
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import ClerkSetupGuide from '../components/ClerkSetupGuide';

const Auth = () => {
  const { user, loading } = useAuth();
  
  // Check if VITE_CLERK_PUBLISHABLE_KEY exists
  const clerkKeyAvailable = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // If Clerk key is not available, show the setup guide
  if (!clerkKeyAvailable) {
    return <ClerkSetupGuide />;
  }

  // If user is already authenticated, redirect to home page
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Welcome to SV Pathology Lab</h2>
          
          {/* Simplified authentication UI for now since we're not using Clerk components directly */}
          <div className="flex justify-center">
            <p className="text-gray-600 mb-4">
              Please set up Clerk authentication first. See the setup guide for instructions.
            </p>
          </div>
          
          <div className="mt-6">
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
