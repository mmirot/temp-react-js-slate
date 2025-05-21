
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import toast from 'react-hot-toast';

const ProtectedRoute = ({ children }) => {
  const { user, loading, session, supabaseError, connectionState, retryConnection } = useAuth();
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  
  useEffect(() => {
    console.log('ProtectedRoute - Auth State:', { 
      user, 
      loading, 
      session: session ? 'Session exists' : 'No session',
      supabaseError,
      connectionState,
      retryCount
    });
  }, [user, loading, session, supabaseError, connectionState, retryCount]);

  // Attempt auto-retry once if there's a connection error
  useEffect(() => {
    if ((supabaseError || connectionState === 'error') && retryCount < 1 && !isRetrying) {
      console.log('ProtectedRoute - Attempting automatic connection retry');
      setIsRetrying(true);
      
      const timer = setTimeout(() => {
        retryConnection()
          .then(success => {
            if (success) {
              toast.success('Connection restored automatically!');
            } else {
              toast.error('Auto-reconnection failed. Please try manually reconnecting.');
            }
            setRetryCount(prev => prev + 1);
            setIsRetrying(false);
          })
          .catch(() => {
            setIsRetrying(false);
            setRetryCount(prev => prev + 1);
          });
      }, 2000); // Wait 2 seconds before retry
      
      return () => clearTimeout(timer);
    }
  }, [supabaseError, connectionState, retryCount, isRetrying, retryConnection]);

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
  if (supabaseError || connectionState === 'error') {
    console.log('ProtectedRoute - Supabase error:', supabaseError);
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mb-4">
          <h2 className="font-bold text-lg mb-2">Supabase Connection Error</h2>
          <p className="mb-2">There was an issue connecting to Supabase:</p>
          <p className="font-mono bg-red-50 p-2 rounded text-sm overflow-auto">{supabaseError || 'Connection failed'}</p>
        </div>
        <button 
          className={`mt-4 px-4 py-2 text-white rounded transition-colors ${
            isRetrying ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
          onClick={retryConnection}
          disabled={isRetrying}
        >
          {isRetrying ? (
            <span className="flex items-center">
              <span className="animate-spin h-4 w-4 border-t-2 border-b-2 border-white rounded-full mr-2"></span>
              Retrying...
            </span>
          ) : (
            'Retry Connection'
          )}
        </button>
        <p className="text-gray-600 max-w-md text-center mt-4">
          Please click the "Connect to Supabase" button in the top right corner of the screen to set up your connection.
        </p>
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
          <h3 className="font-bold mb-1">Troubleshooting Tips:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Make sure your Supabase project is correctly set up</li>
            <li>Check that your browser allows cookies and local storage</li>
            <li>Try clearing browser cache and refreshing the page</li>
            <li>Ensure your network connection is stable</li>
          </ul>
        </div>
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
