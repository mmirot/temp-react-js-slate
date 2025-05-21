
import React, { createContext, useContext } from 'react';
import { useAuthState } from './useAuthState';
import { useAuthActions } from './useAuthActions';
import { useConnectionManagement } from './useConnectionManagement';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  // Get state and actions from custom hooks
  const { 
    user, 
    session, 
    loading, 
    supabaseError, 
    connectionState, 
    supabase 
  } = useAuthState();
  
  const {
    signIn,
    signUp,
    signOut
  } = useAuthActions();
  
  const {
    retryConnection
  } = useConnectionManagement();

  // Combine all values for the context
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
