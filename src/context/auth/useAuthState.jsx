
import { useState, useEffect } from 'react';
import { supabase, checkConnection, reconnect } from '../../lib/supabaseClient';
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
  const verifyConnection = async (withDelay = false) => {
    try {
      // Add optional delay before checking connection
      if (withDelay) {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Increased to 1.5 seconds
      }
      
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

  // Check if we're in a password reset flow or have OTP errors
  const isPasswordResetOrErrorFlow = () => {
    try {
      const url = new URL(window.location.href);
      
      // Check for password reset flow
      const isResetFlow = url.searchParams.has('type') && 
            (url.searchParams.get('type') === 'recovery' || 
             url.searchParams.get('type') === 'signup');
             
      // Check for OTP expired error
      const isOtpError = url.searchParams.has('error_code') && 
                       url.searchParams.get('error_code') === 'otp_expired';
      
      // Also check hash fragment for errors (some auth redirects put params in hash)
      const hashParams = new URLSearchParams(url.hash.replace('#', ''));
      const hasHashOtpError = hashParams.has('error_code') && 
                            hashParams.get('error_code') === 'otp_expired';
                            
      return isResetFlow || isOtpError || hasHashOtpError;
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
    
    // Priority check for auth flows or OTP errors
    const inSpecialFlow = isPasswordResetOrErrorFlow();
    
    const initAuth = async () => {
      if (inSpecialFlow) {
        console.log('AuthContext - Detected auth flow or error, prioritizing connection');
        // Add longer delay for auth flows
        toast.loading('Establishing secure connection...', { id: 'auth-connection', duration: 8000 });
        
        // Add initial delay for auth flows
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second initial delay
        
        // Wait for a solid connection with retries and longer timeout
        const isConnected = await reconnect(true, 8000); // Wait up to 8 seconds
        
        if (!isConnected) {
          console.log('AuthContext - Failed to establish connection for auth flow after waiting');
          toast.error('Connection issue detected. Please try again or refresh the page.', { id: 'auth-connection' });
        } else {
          toast.success('Connection established!', { id: 'auth-connection' });
        }
      }
      
      // Set up auth state listener FIRST
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, newSession) => {
          console.log('AuthContext - Auth state change:', event);
          
          // Add a small delay to ensure connection is ready
          setTimeout(async () => {
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
          }, 800); // Increased delay to ensure connection is established
        }
      );

      // THEN check for existing session
      console.log('AuthContext - Checking for existing session');
      await verifyConnection(true); // Add a delay before checking connection
      
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

      return () => {
        console.log('AuthContext - Cleaning up auth listener');
        subscription?.unsubscribe();
      };
    };
    
    initAuth();
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
