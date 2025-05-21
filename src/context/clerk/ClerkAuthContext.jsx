
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth as useClerkAuth, useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ClerkAuthContext = createContext();

export function useAuth() {
  return useContext(ClerkAuthContext);
}

// Check if Clerk is available
const isClerkAvailable = () => {
  try {
    return !!window.Clerk;
  } catch (error) {
    return false;
  }
};

export const ClerkAuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);

  // Use Clerk hooks if available
  const clerkAuth = isClerkAvailable() ? useClerkAuth() : { isLoaded: true, userId: null, sessionId: null };
  const userHook = isClerkAvailable() ? useUser() : { user: null };
  const clerk = isClerkAvailable() ? useClerk() : null;

  // Extract values safely
  const { isLoaded = true, userId = null, sessionId = null } = clerkAuth;
  const clerkUser = userHook?.user;

  // Set loading state based on Clerk's isLoaded
  useEffect(() => {
    if (isLoaded) {
      setLoading(false);
      setUser(clerkUser);
      setSession(sessionId ? { id: sessionId } : null);
    }
  }, [isLoaded, clerkUser, sessionId]);

  // Authentication actions
  const signIn = async (emailAddress, password) => {
    if (!clerk) {
      toast.error('Authentication is not available. Please add a Clerk Publishable Key.');
      return { success: false, error: 'Authentication not available' };
    }

    try {
      console.log('ClerkAuthContext - Attempting sign in:', emailAddress);
      await clerk.signIn.create({
        identifier: emailAddress,
        password
      });
      toast.success('Signed in successfully');
      return { success: true };
    } catch (error) {
      console.error('ClerkAuthContext - Sign in error:', error.message);
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  const signUp = async (emailAddress, password) => {
    if (!clerk) {
      toast.error('Authentication is not available. Please add a Clerk Publishable Key.');
      return { success: false, error: 'Authentication not available' };
    }

    try {
      console.log('ClerkAuthContext - Attempting sign up:', emailAddress);
      await clerk.signUp.create({
        emailAddress,
        password
      });
      toast.success('Signup successful! Please check your email for verification.');
      return { success: true };
    } catch (error) {
      console.error('ClerkAuthContext - Sign up error:', error.message);
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    if (!clerk) {
      toast.error('Authentication is not available. Please add a Clerk Publishable Key.');
      return;
    }

    try {
      console.log('ClerkAuthContext - Attempting sign out');
      await clerk.signOut();
      toast.success('Signed out successfully');
      navigate('/auth');
    } catch (error) {
      console.error('ClerkAuthContext - Sign out error:', error.message);
      toast.error(error.message);
    }
  };

  // Value for the context
  const value = {
    user: user,
    session: session,
    signIn,
    signUp,
    signOut,
    loading,
    supabaseError: null,
    connectionState: 'connected',
    supabase: null,
  };

  console.log('ClerkAuthContext - Current auth state:', { 
    isAuthenticated: !!userId, 
    isLoading: loading,
    userEmail: user?.emailAddresses?.[0]?.emailAddress || 'none',
    clerkAvailable: isClerkAvailable()
  });

  return (
    <ClerkAuthContext.Provider value={value}>
      {children}
    </ClerkAuthContext.Provider>
  );
};
