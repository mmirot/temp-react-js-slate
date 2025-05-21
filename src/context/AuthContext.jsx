
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabaseClient';
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
  const navigate = useNavigate();

  useEffect(() => {
    console.log('AuthContext - Initializing auth state');
    
    // Check if Supabase env variables are missing
    const hasEnvVariables = import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
    if (!hasEnvVariables) {
      console.log('AuthContext - Missing Supabase environment variables');
      setSupabaseError('Missing Supabase environment variables');
      setLoading(false);
      return;
    }
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('AuthContext - Auth state change:', event);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          console.log('AuthContext - User signed in', session?.user?.email);
          toast.success('Signed in successfully');
          navigate('/');
        }
        
        if (event === 'SIGNED_OUT') {
          console.log('AuthContext - User signed out');
          toast.success('Signed out successfully');
          navigate('/auth');
        }
      }
    );

    // THEN check for existing session
    console.log('AuthContext - Checking for existing session');
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('AuthContext - Session check result:', session ? 'Session found' : 'No session');
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch(error => {
      console.error('AuthContext - Error getting session:', error);
      setSupabaseError(error.message);
      setLoading(false);
    });

    return () => {
      console.log('AuthContext - Cleaning up auth listener');
      subscription?.unsubscribe();
    };
  }, [navigate]);

  const signIn = async (email, password) => {
    try {
      console.log('AuthContext - Attempting sign in:', email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      console.log('AuthContext - Sign in successful');
      return { success: true };
    } catch (error) {
      console.error('AuthContext - Sign in error:', error.message);
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  const signUp = async (email, password) => {
    try {
      console.log('AuthContext - Attempting sign up:', email);
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      console.log('AuthContext - Sign up successful');
      toast.success('Signup successful! Please check your email for verification.');
      return { success: true };
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

  const value = {
    user,
    session,
    signIn,
    signUp,
    signOut,
    loading,
    supabaseError,
  };

  console.log('AuthContext - Current auth state:', { 
    isAuthenticated: !!user, 
    isLoading: loading,
    userEmail: user?.email || 'none',
    hasError: !!supabaseError
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
