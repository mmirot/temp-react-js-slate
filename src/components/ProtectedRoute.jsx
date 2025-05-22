
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import toast from 'react-hot-toast';
import ClerkSetupGuide from './ClerkSetupGuide';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  // Check if VITE_CLERK_PUBLISHABLE_KEY exists and is valid
  const clerkKeyAvailable = (() => {
    const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
    return key && key !== 'placeholder_for_dev';
  })();
  
  // Show a loading state
  if (loading) {
    console.log('ProtectedRoute - Loading auth state...');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // If Clerk key is not available, show the setup guide
  if (!clerkKeyAvailable) {
    console.error('ProtectedRoute - No valid Clerk key available, protected route cannot be accessed');
    toast.error('Authentication is not set up properly. Please add a valid Clerk Publishable Key.', {
      duration: 6000,
      id: 'missing-clerk-key',
    });
    
    return <ClerkSetupGuide />;
  }

  // Redirect to auth if no user
  if (!isAuthenticated) {
    console.log('ProtectedRoute - No user found, redirecting to auth page');
    return <Navigate to="/auth" replace />;
  }

  console.log('ProtectedRoute - User authenticated, rendering protected content');
  return children;
};

export default ProtectedRoute;
