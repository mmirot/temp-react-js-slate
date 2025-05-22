
// Re-export clerk auth context for compatibility with consistent fallback values
import { useAuth as useClerkAuth, ClerkAuthProvider } from './clerk/index.js';

// Export the auth hook with guaranteed fallback values
export function useAuth() {
  const auth = useClerkAuth();
  // Ensure we always return a properly structured object even if the context is null
  return auth || {
    user: null,
    session: null,
    loading: false,
    isAuthenticated: false,
    signIn: () => console.warn('Auth not initialized'),
    signUp: () => console.warn('Auth not initialized'),
    signOut: () => console.warn('Auth not initialized'),
  };
}

// Re-export the provider
export { ClerkAuthProvider };
