
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import toast from 'react-hot-toast';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  // Check if VITE_CLERK_PUBLISHABLE_KEY exists
  const clerkKeyAvailable = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  
  // Show a loading state
  if (loading) {
    console.log('ProtectedRoute - Loading auth state...');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // If Clerk key is not available, show a helpful message
  if (!clerkKeyAvailable) {
    console.error('ProtectedRoute - No Clerk key available, protected route cannot be accessed');
    toast.error('Authentication is not set up. Please add a Clerk Publishable Key.', {
      duration: 6000,
      id: 'missing-clerk-key',
    });
    return <Navigate to="/" replace />;
  }

  // Redirect to auth if no user
  if (!user) {
    console.log('ProtectedRoute - No user found, redirecting to auth page');
    return <Navigate to="/auth" replace />;
  }

  console.log('ProtectedRoute - User authenticated, rendering protected content');
  return children;
};

export default ProtectedRoute;
