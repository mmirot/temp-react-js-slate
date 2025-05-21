
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading, session } = useAuth();
  
  useEffect(() => {
    console.log('ProtectedRoute - Auth State:', { user, loading, session: session ? 'Session exists' : 'No session' });
  }, [user, loading, session]);

  if (loading) {
    console.log('ProtectedRoute - Loading auth state...');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) {
    console.log('ProtectedRoute - No user found, redirecting to auth page');
    return <Navigate to="/auth" replace />;
  }

  console.log('ProtectedRoute - User authenticated, rendering protected content');
  return children;
};

export default ProtectedRoute;
