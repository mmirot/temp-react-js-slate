
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase, checkConnection, reconnect } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [supabaseError, setSupabaseError] = useState(null);
  const [connectionState, setConnectionState] = useState('checking'); // 'checking', 'connected', 'error'
  const navigate = useNavigate();

  // Function to check connection status
  const verifyConnection = async () => {
    try {
      const isConnected = await checkConnection();
      setConnectionState(isConnected ? 'connected' : 'error');
      return isConnected;
    } catch (error) {
      console.error('Connection verification error:', error);
      setConnectionState('error');
      setSupabaseError(error.message || 'Failed to connect to Supabase');
      return false;
    }
  };

  useEffect(() => {
    console.log('AuthContext - Initializing auth state');
    
    // Check if Supabase env variables are missing
    const hasEnvVariables = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!hasEnvVariables) {
      console.log('AuthContext - Missing Supabase environment variables');
      setSupabaseError('Missing Supabase environment variables');
      setConnectionState('error');
      setLoading(false);
      return;
    }
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('AuthContext - Auth state change:', event);
        
        // Verify connection on auth state change
        const connectionOk = await verifyConnection();
        if (!connectionOk) {
          console.warn('AuthContext - Connection issue detected during auth state change');
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            toast.error('Authentication successful but there seems to be a connection issue with Supabase.');
          }
        }
        
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          console.log('AuthContext - User signed in', newSession?.user?.email);
          toast.success('Signed in successfully');
          navigate('/');
        }
        
        if (event === 'SIGNED_OUT') {
          console.log('AuthContext - User signed out');
          toast.success('Signed out successfully');
          navigate('/auth');
        }
        
        if (event === 'TOKEN_REFRESHED') {
          console.log('AuthContext - Auth token refreshed');
        }
        
        if (event === 'PASSWORD_RECOVERY') {
          console.log('AuthContext - Password recovery requested');
          toast.success('Password reset initiated. Please check your email.');
          navigate('/auth');
        }
      }
    );

    // THEN check for existing session
    console.log('AuthContext - Checking for existing session');
    verifyConnection().then(connectionOk => {
      if (connectionOk) {
        supabase.auth.getSession().then(({ data: { session: existingSession }, error }) => {
          console.log('AuthContext - Session check result:', existingSession ? 'Session found' : 'No session');
          if (error) {
            console.error('AuthContext - Error getting session:', error);
            setSupabaseError(error.message);
          }
          setSession(existingSession);
          setUser(existingSession?.user ?? null);
          setLoading(false);
        }).catch(error => {
          console.error('AuthContext - Error getting session:', error);
          setSupabaseError(error.message);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => {
      console.log('AuthContext - Cleaning up auth listener');
      subscription?.unsubscribe();
    };
  }, [navigate]);

  const signIn = async (email, password) => {
    try {
      // Check connection first
      const connectionOk = await verifyConnection();
      if (!connectionOk) {
        toast.error('Cannot sign in - No connection to Supabase. Please check your connection.');
        return { success: false, error: 'No connection to Supabase' };
      }
      
      console.log('AuthContext - Attempting sign in:', email);
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      console.log('AuthContext - Sign in successful');
      return { success: true, data };
    } catch (error) {
      console.error('AuthContext - Sign in error:', error.message);
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  const signUp = async (email, password) => {
    try {
      // Check connection first
      const connectionOk = await verifyConnection();
      if (!connectionOk) {
        toast.error('Cannot sign up - No connection to Supabase. Please check your connection.');
        return { success: false, error: 'No connection to Supabase' };
      }
      
      console.log('AuthContext - Attempting sign up:', email);
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      console.log('AuthContext - Sign up successful');
      toast.success('Signup successful! Please check your email for verification.');
      return { success: true, data };
    } catch (error) {
      console.error('AuthContext - Sign up error:', error.message);
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    try {
      console.log('AuthContext - Attempting sign out');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log('AuthContext - Sign out successful');
    } catch (error) {
      console.error('AuthContext - Sign out error:', error.message);
      toast.error(error.message);
    }
  };
  
  const retryConnection = async () => {
    setSupabaseError(null);
    setConnectionState('checking');
    const result = await reconnect();
    if (result) {
      toast.success('Connection to Supabase restored!');
      // Reload auth state
      const { data, error } = await supabase.auth.getSession();
      if (!error) {
        setSession(data.session);
        setUser(data.session?.user ?? null);
      }
    } else {
      toast.error('Failed to reconnect to Supabase.');
      setSupabaseError('Failed to reconnect to Supabase.');
    }
    setConnectionState(result ? 'connected' : 'error');
    return result;
  };

  const value = {
    user,
    session,
    signIn,
    signUp,
    signOut,
    loading,
    supabaseError,
    connectionState,
    retryConnection,
    supabase, // Expose supabase client for password reset
  };

  console.log('AuthContext - Current auth state:', { 
    isAuthenticated: !!user, 
    isLoading: loading,
    userEmail: user?.email || 'none',
    hasError: !!supabaseError,
    connectionState
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
