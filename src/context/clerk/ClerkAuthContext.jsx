
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Create a context for our auth state
const ClerkAuthContext = createContext(null);

// Helper hook to use the auth context
export function useAuth() {
  return useContext(ClerkAuthContext) || { 
    user: null, 
    loading: false, 
    isAuthenticated: false,
    signIn: () => {},
    signUp: () => {},
    signOut: () => {}
  };
}

// Check if Clerk is available and properly initialized
const isClerkAvailable = () => {
  const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  const isValid = key && key !== 'placeholder_for_dev';
  console.log('ClerkAuthContext - Checking if Clerk is available:', isValid ? 'Yes' : 'No');
  return isValid;
};

// Create the auth provider component
export const ClerkAuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  
  // Check if Clerk is properly available
  const clerkAvailable = isClerkAvailable();
  
  useEffect(() => {
    // Only try to use Clerk if it's available
    if (clerkAvailable) {
      console.log('ClerkAuthProvider - Clerk is available, initializing...');
      // Dynamically import Clerk hooks to avoid errors when Clerk is not available
      const initClerk = async () => {
        try {
          const { useClerk, useUser, useAuth } = await import('@clerk/clerk-react');
          
          const { isLoaded, user: clerkUser, isSignedIn } = useUser();
          const { getToken, sessionId } = useAuth();
          
          console.log('ClerkAuthProvider loaded, isLoaded:', isLoaded, 'isSignedIn:', isSignedIn);
          
          if (isLoaded) {
            setUser(isSignedIn ? clerkUser : null);
            setSession(sessionId ? { id: sessionId } : null);
            setLoading(false);
          }
        } catch (error) {
          console.error('Failed to initialize Clerk:', error);
          setLoading(false);
        }
      };
      
      initClerk();
    } else {
      // If Clerk is not available, we're not loading
      console.log('ClerkAuthProvider - Clerk is not available, skipping initialization');
      setLoading(false);
    }
  }, [clerkAvailable]);

  // Authentication actions that work with Clerk (when available)
  const signIn = async (emailAddress, password) => {
    if (!clerkAvailable) {
      toast.error('Authentication is not available. Please add a valid Clerk Publishable Key.');
      return { success: false, error: 'Authentication not available' };
    }

    try {
      const { useClerk } = await import('@clerk/clerk-react');
      const clerk = useClerk().clerk;
      
      if (!clerk) {
        toast.error('Clerk is not initialized properly.');
        return { success: false, error: 'Clerk not initialized' };
      }
      
      const result = await clerk.signIn.create({
        identifier: emailAddress,
        password,
      });
      
      if (result.status === 'complete') {
        toast.success('Signed in successfully!');
        navigate('/');
        return { success: true };
      } else {
        toast.info('Additional verification steps required.');
        return { success: false, needsMoreSteps: true };
      }
    } catch (error) {
      console.error('ClerkAuthContext - Sign in error:', error.message);
      toast.error(error.message || 'Failed to sign in');
      return { success: false, error: error.message };
    }
  };

  const signUp = async (emailAddress, password) => {
    if (!clerkAvailable) {
      toast.error('Authentication is not available. Please add a valid Clerk Publishable Key.');
      return { success: false, error: 'Authentication not available' };
    }

    try {
      const { useClerk } = await import('@clerk/clerk-react');
      const clerk = useClerk().clerk;
      
      if (!clerk) {
        toast.error('Clerk is not initialized properly.');
        return { success: false, error: 'Clerk not initialized' };
      }
      
      const result = await clerk.signUp.create({
        emailAddress,
        password,
      });
      
      if (result.status === 'complete') {
        toast.success('Signed up successfully!');
        navigate('/');
        return { success: true };
      } else {
        toast.info('Please check your email to verify your account.');
        return { success: false, needsVerification: true };
      }
    } catch (error) {
      console.error('ClerkAuthContext - Sign up error:', error.message);
      toast.error(error.message || 'Failed to sign up');
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    if (!clerkAvailable) {
      toast.error('Authentication is not available.');
      return;
    }

    try {
      const { useClerk } = await import('@clerk/clerk-react');
      const clerk = useClerk().clerk;
      await clerk.signOut();
      toast.success('Signed out successfully!');
      navigate('/auth');
    } catch (error) {
      console.error('ClerkAuthContext - Sign out error:', error.message);
      toast.error(error.message || 'Failed to sign out');
    }
  };

  // Value for the context
  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
    connectionState: clerkAvailable ? 'connected' : 'disconnected',
  };

  return (
    <ClerkAuthContext.Provider value={value}>
      {children}
    </ClerkAuthContext.Provider>
  );
};
