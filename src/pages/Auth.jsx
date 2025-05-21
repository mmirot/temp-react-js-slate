import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/auth';
import { Navigate, useSearchParams, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { checkConnection, reconnect, testConnection } from '../lib/supabaseClient';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [forcedReconnectAttempted, setForcedReconnectAttempted] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { user, signIn, signUp, supabase, supabaseError, retryConnection } = useAuth();
  const [connectionTested, setConnectionTested] = useState(false);
  const [manualConnectionTest, setManualConnectionTest] = useState(false);

  // Check for OTP expired error in both search params and hash fragment
  useEffect(() => {
    const checkForOtpError = () => {
      const errorCode = searchParams.get('error_code');
      const hashParams = new URLSearchParams(location.hash.replace('#', ''));
      const hashErrorCode = hashParams.get('error_code');
      
      if (errorCode === 'otp_expired' || hashErrorCode === 'otp_expired') {
        console.log('Auth - Detected OTP expired error');
        setOtpError(true);
        // Don't show changing password form for expired OTP
        setIsChangingPassword(false);
        
        // Run connection test after detecting OTP error
        runManualConnectionTest();
      }
    };
    
    checkForOtpError();
  }, [searchParams, location.hash]);

  // Priority check for password reset flow
  useEffect(() => {
    // Check if we're in a password reset flow
    const type = searchParams.get('type');
    const isRecovery = type === 'recovery';
    
    if (isRecovery) {
      console.log('Auth - Detected password recovery flow');
      setIsChangingPassword(true);
      
      // Force connection verification and reconnection for password reset flows
      const forceConnection = async () => {
        setConnectionStatus('checking');
        const toastId = toast.loading('Establishing secure connection...');
        
        // Add a longer initial delay before checking connection
        await new Promise(resolve => setTimeout(resolve, 3000)); // Increased to 3 seconds
        
        const isConnected = await checkConnection();
        if (!isConnected && !forcedReconnectAttempted) {
          console.log('Auth - Forcing reconnection for password reset flow');
          setForcedReconnectAttempted(true);
          
          // Try to reconnect with waiting enabled and increased timeout
          const reconnected = await reconnect(true, 10000); // Increased to 10 seconds with retries
          setConnectionStatus(reconnected ? 'connected' : 'error');
          
          if (reconnected) {
            toast.success('Connection established! You can now set your new password.', { id: toastId });
          } else {
            toast.error('Connection failed. Please try the Test Connection button below.', { id: toastId });
          }
        } else {
          setConnectionStatus(isConnected ? 'connected' : 'error');
          if (isConnected) {
            toast.success('Connection established! You can now set your new password.', { id: toastId });
          } else {
            toast.error('Connection issue detected. Please try the Test Connection button below.', { id: toastId });
          }
        }
        
        setConnectionTested(true);
      };
      
      forceConnection();
    }

    // General connection check
    const verifyConnection = async () => {
      if (!isRecovery && !otpError) {
        setConnectionStatus('checking');
        try {
          // Add longer delay before checking connection
          await new Promise(resolve => setTimeout(resolve, 2000)); // Increased to 2 seconds
          const isConnected = await checkConnection();
          console.log('Auth - Supabase connection status:', isConnected);
          setConnectionStatus(isConnected ? 'connected' : 'error');
          
          if (!isConnected) {
            toast.error('Not connected to Supabase. Authentication will not work.');
          }
          
          setConnectionTested(true);
        } catch (error) {
          console.error('Auth - Connection check error:', error);
          setConnectionStatus('error');
          setConnectionTested(true);
        }
      }
    };
    
    if (!isRecovery && !otpError) {
      verifyConnection();
    }
  }, [searchParams]);

  if (user && !isChangingPassword) {
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
  
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (!password || password.length < 6) {
      toast.error('Please enter a password (minimum 6 characters)');
      return;
    }
    
    if (connectionStatus === 'error') {
      // If connection error in password change flow, force a reconnection attempt
      toast.error('Connection issue detected. Attempting to reconnect...');
      setConnectionStatus('checking');
      
      // Add a longer delay before reconnecting
      await new Promise(resolve => setTimeout(resolve, 2000)); // Increased to 2 seconds
      const reconnected = await reconnect(true, 8000); // Increased wait time with retry
      
      if (!reconnected) {
        toast.error('Cannot change password - No connection to Supabase. Please try again or refresh the page.');
        setConnectionStatus('error');
        return;
      }
      
      setConnectionStatus('connected');
      toast.success('Connection restored!');
      
      // Add another small delay before attempting password change
      await new Promise(resolve => setTimeout(resolve, 1000)); // Increased to 1 second
    }
    
    setIsSubmitting(true);
    
    try {
      if (!supabase) {
        // Add longer delay before retry
        await new Promise(resolve => setTimeout(resolve, 2000)); // Increased to 2 seconds
        await retryConnection();
        
        if (!supabase) {
          throw new Error('Supabase client is not available');
        }
        
        // Add another small delay after connection retry
        await new Promise(resolve => setTimeout(resolve, 1000)); // Increased to 1 second
      }

      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) throw error;
      
      toast.success('Password updated successfully!');
      setIsChangingPassword(false);
      
      // Redirect to homepage after successful password change
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      console.error('Password change error:', error);
      toast.error(`Password change failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    
    if (connectionStatus === 'error') {
      toast.error('Cannot reset password - No connection to Supabase. Please fix connection issues first.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (!supabase) {
        throw new Error('Supabase client is not available');
      }

      const currentUrl = window.location.origin;
      console.log('Auth - Reset password redirect URL:', currentUrl + '/auth');

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: currentUrl + '/auth',
      });
      
      if (error) throw error;
      
      toast.success('Password reset email sent! Please check your inbox.');
      setIsResettingPassword(false);
      if (otpError) {
        setOtpError(false);
      }
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error(`Password reset failed: ${error.message}`);
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

  // Function to manually test connection
  const runManualConnectionTest = async () => {
    setManualConnectionTest(true);
    setConnectionStatus('checking');
    const toastId = toast.loading('Testing connection to Supabase...');
    
    try {
      // Substantial delay before testing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const isConnected = await testConnection();
      setConnectionStatus(isConnected ? 'connected' : 'error');
      
      if (isConnected) {
        toast.success('Connection to Supabase successful!', { id: toastId });
      } else {
        toast.error('Failed to connect to Supabase. Please try again.', { id: toastId });
      }
    } catch (error) {
      console.error('Connection test error:', error);
      setConnectionStatus('error');
      toast.error('Connection test error: ' + error.message, { id: toastId });
    } finally {
      setManualConnectionTest(false);
      setConnectionTested(true);
    }
  };

  // Password recovery flow (after clicking email link)
  if (isChangingPassword) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          {connectionStatus === 'error' && (
            <div className="mb-6 w-full p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">Connection Error</p>
                  <p>Cannot complete password reset without connecting to Supabase.</p>
                </div>
                <button 
                  onClick={runManualConnectionTest}
                  disabled={manualConnectionTest}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 disabled:opacity-50"
                >
                  {manualConnectionTest ? 'Testing...' : 'Test Connection'}
                </button>
              </div>
            </div>
          )}
          
          {connectionStatus === 'checking' && (
            <div className="mb-6 w-full bg-blue-50 border-l-4 border-blue-400 p-4">
              <div className="flex items-center text-blue-700">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500 mr-3"></div>
                <span>Establishing connection for password reset...</span>
              </div>
            </div>
          )}
          
          {/* Connection test button - always visible in password reset flow */}
          <div className="mb-6 w-full bg-gray-100 border border-gray-200 p-4 rounded-md">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Connection Status: 
                  <span className={`ml-2 ${
                    connectionStatus === 'connected' ? 'text-green-600' : 
                    connectionStatus === 'error' ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {connectionStatus === 'connected' ? 'Connected' : 
                     connectionStatus === 'error' ? 'Failed' : 'Checking...'}
                  </span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {connectionTested ? 
                    'Connection has been tested.' : 
                    'Connection test has not run yet.'}
                </p>
              </div>
              <button 
                onClick={runManualConnectionTest}
                disabled={manualConnectionTest || connectionStatus === 'checking'}
                className="px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 disabled:opacity-50"
              >
                {manualConnectionTest ? 'Testing...' : 'Test Connection'}
              </button>
            </div>
          </div>
          
          <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
            <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">Set New Password</h2>
            <form className="mb-0 space-y-6" onSubmit={handlePasswordChange}>
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="mt-1">
                  <input
                    id="new-password"
                    name="password"
                    type="password"
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
                  {isSubmitting ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Add a dedicated component to handle the OTP expired error
  if (otpError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Password Reset Link Expired</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>The password reset link you used has expired or is invalid. Please request a new password reset link.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Connection test button - always visible in OTP error flow */}
          <div className="mb-6 w-full bg-gray-100 border border-gray-200 p-4 rounded-md">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Connection Status: 
                  <span className={`ml-2 ${
                    connectionStatus === 'connected' ? 'text-green-600' : 
                    connectionStatus === 'error' ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {connectionStatus === 'connected' ? 'Connected' : 
                     connectionStatus === 'error' ? 'Failed' : 'Checking...'}
                  </span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {connectionTested ? 
                    'Connection has been tested.' : 
                    'Connection test has not run yet.'}
                </p>
              </div>
              <button 
                onClick={runManualConnectionTest}
                disabled={manualConnectionTest || connectionStatus === 'checking'}
                className="px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 disabled:opacity-50"
              >
                {manualConnectionTest ? 'Testing...' : 'Test Connection'}
              </button>
            </div>
          </div>
          
          <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
            <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">Request New Password Reset</h2>
            <form className="mb-0 space-y-6" onSubmit={handlePasswordReset}>
              <div>
                <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="mt-1">
                  <input
                    id="reset-email"
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
                <button
                  type="submit"
                  disabled={isSubmitting || connectionStatus !== 'connected'}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isSubmitting || connectionStatus !== 'connected'
                      ? 'bg-indigo-300 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  }`}
                >
                  {isSubmitting ? 'Sending...' : 'Send New Reset Link'}
                </button>
              </div>
              
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setOtpError(false);
                    setIsResettingPassword(false);
                  }}
                  className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

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
              onClick={runManualConnectionTest}
              disabled={manualConnectionTest}
              className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 disabled:opacity-50"
            >
              {manualConnectionTest ? 'Testing...' : 'Test Connection'}
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
      
      {/* Connection test button - always visible */}
      <div className="mb-6 w-full max-w-md bg-gray-100 border border-gray-200 p-4 rounded-md">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium">Connection Status: 
              <span className={`ml-2 ${
                connectionStatus === 'connected' ? 'text-green-600' : 
                connectionStatus === 'error' ? 'text-red-600' : 'text-blue-600'
              }`}>
                {connectionStatus === 'connected' ? 'Connected' : 
                 connectionStatus === 'error' ? 'Failed' : 'Checking...'}
              </span>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {connectionTested ? 
                'Connection has been tested.' : 
                'Connection test has not run yet.'}
            </p>
          </div>
          <button 
            onClick={runManualConnectionTest}
            disabled={manualConnectionTest || connectionStatus === 'checking'}
            className="px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {manualConnectionTest ? 'Testing...' : 'Test Connection'}
          </button>
        </div>
      </div>
      
      {connectionStatus === 'connected' && (
        <div className="mb-6 w-full max-w-md bg-green-50 border-l-4 border-green-400 p-4 text-green-700">
          <p className="font-bold">Connected to Supabase</p>
          <p className="text-sm">You can now sign in or sign up.</p>
        </div>
      )}
      
      <div className="w-full max-w-md">
        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
          <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">
            {isResettingPassword ? 'Reset Password' : (isSigningUp ? 'Sign Up' : 'Sign In')}
          </h2>
          
          {isResettingPassword ? (
            <form className="mb-0 space-y-6" onSubmit={handlePasswordReset}>
              <div>
                <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="reset-email"
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
                <button
                  type="submit"
                  disabled={isSubmitting || connectionStatus !== 'connected'}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isSubmitting || connectionStatus !== 'connected'
                      ? 'bg-indigo-300 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  }`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
                </button>
              </div>
              
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setIsResettingPassword(false)}
                  className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          ) : (
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
              
              {!isSigningUp && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setIsResettingPassword(true)}
                    className="text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot your password?
                  </button>
                </div>
              )}
            </form>
          )}

          {!isResettingPassword && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
