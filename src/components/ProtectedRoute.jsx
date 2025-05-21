
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading, session, supabaseError } = useAuth();
  
  useEffect(() => {
    console.log('ProtectedRoute - Auth State:', { 
      user, 
      loading, 
      session: session ? 'Session exists' : 'No session',
      supabaseError 
    });
  }, [user, loading, session, supabaseError]);

  // Show a loading state
  if (loading) {
    console.log('ProtectedRoute - Loading auth state...');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Show an error message if there's a Supabase connection error
  if (supabaseError) {
    console.log('ProtectedRoute - Supabase error:', supabaseError);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mb-4">
          <h2 className="font-bold text-lg mb-2">Supabase Connection Error</h2>
          <p className="mb-2">There was an issue connecting to Supabase:</p>
          <p className="font-mono bg-red-50 p-2 rounded">{supabaseError}</p>
        </div>
        <p className="text-gray-600 max-w-md text-center">
          Please click the "Connect to Supabase" button in the top right corner of the screen to set up your connection.
        </p>
      </div>
    );
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
