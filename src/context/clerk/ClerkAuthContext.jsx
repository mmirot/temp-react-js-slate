
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth as useClerkAuth, useUser, useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const ClerkAuthContext = createContext();

export function useAuth() {
  return useContext(ClerkAuthContext);
}

export const ClerkAuthProvider = ({ children }) => {
  const { isLoaded, userId, sessionId } = useClerkAuth();
  const { user } = useUser();
  const clerk = useClerk();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Set loading state based on Clerk's isLoaded
  useEffect(() => {
    if (isLoaded) {
      setLoading(false);
    }
  }, [isLoaded]);

  // Authentication actions similar to previous Supabase implementation
  const signIn = async (emailAddress, password) => {
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

  // Create a value that mirrors the structure of the previous Supabase auth context
  // for easier integration with existing components
  const value = {
    user: user,
    session: sessionId ? { id: sessionId } : null,
    signIn,
    signUp,
    signOut,
    loading,
    supabaseError: null, // Set to null since we're using Clerk now
    connectionState: 'connected', // Always connected with Clerk
    supabase: null, // No longer using Supabase client
  };

  console.log('ClerkAuthContext - Current auth state:', { 
    isAuthenticated: !!userId, 
    isLoading: loading,
    userEmail: user?.emailAddresses?.[0]?.emailAddress || 'none',
  });

  return (
    <ClerkAuthContext.Provider value={value}>
      {children}
    </ClerkAuthContext.Provider>
  );
};
