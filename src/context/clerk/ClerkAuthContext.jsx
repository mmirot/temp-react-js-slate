
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ClerkAuthContext = createContext();

export function useAuth() {
  return useContext(ClerkAuthContext);
}

// Check if Clerk is available
const isClerkAvailable = () => {
  const hasKey = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  console.log('ClerkAuthContext - Checking if Clerk is available:', hasKey ? 'Yes' : 'No');
  return hasKey;
};

export const ClerkAuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);

  // Check if Clerk key is available
  const clerkAvailable = isClerkAvailable();
  
  useEffect(() => {
    // Only try to load Clerk functionality if the key is available
    if (clerkAvailable) {
      // We'll let the actual Clerk hooks handle this if they're available
      // But this will be skipped in development if no key is present
      console.log('ClerkAuthContext - Clerk is available, attempting to initialize');
      
      // Try to use the Clerk functionality safely
      try {
        // Dynamically import Clerk hooks only if available
        const { useAuth, useUser, useClerk } = require('@clerk/clerk-react');
        
        // These will be defined if Clerk is properly initialized by ClerkProvider
        if (typeof useAuth === 'function' && 
            typeof useUser === 'function' && 
            typeof useClerk === 'function') {
          console.log('ClerkAuthContext - Clerk hooks loaded successfully');
        }
      } catch (error) {
        console.error('ClerkAuthContext - Error loading Clerk:', error.message);
      }
    } else {
      console.log('ClerkAuthContext - Clerk is not available, running in limited mode');
    }
    
    // In any case, we'll stop showing the loading state after a short delay
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [clerkAvailable]);

  // Authentication actions (mocked when Clerk isn't available)
  const signIn = async (emailAddress, password) => {
    if (!clerkAvailable) {
      toast.error('Authentication is not available. Please add a Clerk Publishable Key.');
      return { success: false, error: 'Authentication not available' };
    }

    // This will only run if Clerk is available
    try {
      toast.error('Authentication system not fully configured. Please add a Clerk Publishable Key.');
      return { success: false, error: 'Authentication system not fully configured' };
    } catch (error) {
      console.error('ClerkAuthContext - Sign in error:', error.message);
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  const signUp = async (emailAddress, password) => {
    if (!clerkAvailable) {
      toast.error('Authentication is not available. Please add a Clerk Publishable Key.');
      return { success: false, error: 'Authentication not available' };
    }

    try {
      toast.error('Authentication system not fully configured. Please add a Clerk Publishable Key.');
      return { success: false, error: 'Authentication system not fully configured' };
    } catch (error) {
      console.error('ClerkAuthContext - Sign up error:', error.message);
      toast.error(error.message);
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    if (!clerkAvailable) {
      toast.error('Authentication is not available. Please add a Clerk Publishable Key.');
      return;
    }

    try {
      toast.error('Authentication system not fully configured. Please add a Clerk Publishable Key.');
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
    connectionState: clerkAvailable ? 'connected' : 'disconnected',
    supabase: null,
  };

  console.log('ClerkAuthContext - Current auth state:', { 
    isAuthenticated: !!user, 
    isLoading: loading,
    userEmail: user?.emailAddresses?.[0]?.emailAddress || 'none',
    clerkAvailable
  });

  return (
    <ClerkAuthContext.Provider value={value}>
      {children}
    </ClerkAuthContext.Provider>
  );
};
