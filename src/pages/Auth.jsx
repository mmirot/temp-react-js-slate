
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { checkConnection, reconnect } from '../lib/supabaseClient';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const { user, signIn, signUp, supabaseError, retryConnection } = useAuth();

  useEffect(() => {
    // Check Supabase connection when component mounts
    const verifyConnection = async () => {
      setConnectionStatus('checking');
      try {
        const isConnected = await checkConnection();
        console.log('Auth - Supabase connection status:', isConnected);
        setConnectionStatus(isConnected ? 'connected' : 'error');
        
        if (!isConnected) {
          toast.error('Not connected to Supabase. Authentication will not work.');
        }
      } catch (error) {
        console.error('Auth - Connection check error:', error);
        setConnectionStatus('error');
      }
    };
    
    verifyConnection();
  }, []);

  if (user) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check connection first
    if (connectionStatus === 'error') {
      toast.error('Cannot authenticate - No connection to Supabase. Please fix connection issues first.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let result;
      if (isSigningUp) {
        result = await signUp(email, password);
      } else {
        result = await signIn(email, password);
      }
      
      if (!result.success && result.error.toLowerCase().includes('network')) {
        // Try once more for network errors
        toast.error('Network issue detected. Attempting to reconnect...');
        await retryConnection();
        // Retry the auth operation
        if (isSigningUp) {
          await signUp(email, password);
        } else {
          await signIn(email, password);
        }
      }
    } catch (error) {
      console.error('Auth form error:', error);
      toast.error(`Authentication error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleRetryConnection = async () => {
    setConnectionStatus('checking');
    const success = await reconnect();
    setConnectionStatus(success ? 'connected' : 'error');
    if (success) {
      toast.success('Connection to Supabase restored!');
    } else {
      toast.error('Failed to connect to Supabase. Please check your configuration.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-50">
      {connectionStatus === 'error' && (
        <div className="mb-6 w-full max-w-md bg-yellow-50 border-l-4 border-yellow-400 p-4 text-yellow-700">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold">Supabase Connection Error</p>
              <p className="text-sm">Authentication requires a connection to Supabase.</p>
            </div>
            <button 
              onClick={handleRetryConnection}
              className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
            >
              Retry
            </button>
          </div>
        </div>
      )}
      
      {connectionStatus === 'checking' && (
        <div className="mb-6 w-full max-w-md bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="flex items-center text-blue-700">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500 mr-3"></div>
            <span>Checking Supabase connection...</span>
          </div>
        </div>
      )}
      
      {connectionStatus === 'connected' && (
        <div className="mb-6 w-full max-w-md bg-green-50 border-l-4 border-green-400 p-4 text-green-700">
          <p className="font-bold">Connected to Supabase</p>
          <p className="text-sm">You can now sign in or sign up.</p>
        </div>
      )}
      
      <div className="w-full max-w-md">
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">
            {isSigningUp ? 'Sign Up' : 'Sign In'}
          </h2>
          <form className="mb-0 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={isSigningUp ? 'new-password' : 'current-password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting || connectionStatus !== 'connected'}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isSubmitting || connectionStatus !== 'connected'
                    ? 'bg-indigo-300 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                }`}
              >
                {isSubmitting ? 'Processing...' : isSigningUp ? 'Sign Up' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setIsSigningUp(!isSigningUp)}
              className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
            >
              {isSigningUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
