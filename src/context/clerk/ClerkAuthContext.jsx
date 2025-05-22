
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClerk, useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

const ClerkAuthContext = createContext();

export function useAuth() {
  return useContext(ClerkAuthContext);
}

// Check if Clerk is available and properly initialized
const isClerkAvailable = () => {
  const hasKey = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  console.log('ClerkAuthContext - Checking if Clerk is available:', hasKey ? 'Yes' : 'No');
  return hasKey;
};

export const ClerkAuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const clerk = useClerk();
  const { isLoaded, user, isSignedIn } = useUser();
  const { getToken, sessionId } = useClerkAuth();
  
  // Check if Clerk key is available
  const clerkAvailable = isClerkAvailable();
  
  // Set initial state based on Clerk
  useEffect(() => {
    console.log('ClerkAuthProvider loaded, isLoaded:', isLoaded, 'isSignedIn:', isSignedIn);
    
    if (isLoaded) {
      setLoading(false);
    }
  }, [isLoaded, isSignedIn]);

  // Authentication actions
  const signIn = async (emailAddress, password) => {
    if (!clerkAvailable) {
      toast.error('Authentication is not available. Please add a Clerk Publishable Key.');
      return { success: false, error: 'Authentication not available' };
    }

    try {
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
        // Handle 2FA or other continuation steps if needed
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
      toast.error('Authentication is not available. Please add a Clerk Publishable Key.');
      return { success: false, error: 'Authentication not available' };
    }

    try {
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
        // Handle verification or other continuation steps
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
    if (!clerkAvailable || !clerk) {
      toast.error('Authentication is not available.');
      return;
    }

    try {
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
    user: isSignedIn ? user : null,
    session: sessionId ? { id: sessionId } : null,
    loading: loading || !isLoaded,
    signIn,
    signUp,
    signOut,
    isAuthenticated: isSignedIn,
    connectionState: clerkAvailable ? 'connected' : 'disconnected',
  };

  return (
    <ClerkAuthContext.Provider value={value}>
      {children}
    </ClerkAuthContext.Provider>
  );
};
