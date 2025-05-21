
import { useState, useEffect } from 'react';
import { supabase, checkConnection } from '../../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export function useAuthState() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [supabaseError, setSupabaseError] = useState(null);
  const [connectionState, setConnectionState] = useState('checking'); // 'checking', 'connected', 'error'
  
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

  // Check if we're in a password reset flow
  const isPasswordResetFlow = () => {
    try {
      const url = new URL(window.location.href);
      return url.searchParams.has('type') && 
            (url.searchParams.get('type') === 'recovery' || 
             url.searchParams.get('type') === 'signup');
    } catch (e) {
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
    
    // Priority check for password reset flows
    const inResetFlow = isPasswordResetFlow();
    if (inResetFlow) {
      console.log('AuthContext - Detected password reset flow, prioritizing connection');
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
          toast.success('Password reset link clicked. Please set your new password.');
          // Stay on auth page for password reset
        }

        if (event === 'USER_UPDATED') {
          console.log('AuthContext - User updated');
          toast.success('Your account has been updated successfully.');
        }
      }
    );

    // If in password reset flow, force connection verification
    if (inResetFlow) {
      console.log('AuthContext - In password reset flow, verifying connection first');
      verifyConnection().then(isConnected => {
        if (!isConnected) {
          console.log('AuthContext - Connection issue detected during password reset flow');
          toast.error('Connection issue detected. Attempting to reconnect...');
        }
      });
    }

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
  }, []);

  return {
    user,
    session,
    loading,
    supabaseError,
    connectionState,
    supabase
  };
}
