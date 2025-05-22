
import React, { createContext, useContext } from 'react';

// Create the context
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  // The Clerk auth is now the primary system, so we don't need
  // the Supabase auth state or actions in this context anymore
  
  console.log('AuthContext - Using Clerk for authentication');
  
  // Create an empty auth context since Clerk is handling auth directly
  const value = {
    // This context is now mostly a placeholder since Clerk handles auth
    // We could add app-specific auth state here in the future if needed
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
