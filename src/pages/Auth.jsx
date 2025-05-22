
import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isResetting, setIsResetting] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const showSignUp = searchParams.get('sign-up') === 'true';
  
  // Check if we're in the Lovable preview environment
  const isLovablePreview = window.location.hostname.includes('lovable.app') || 
                         window.location.hostname.includes('localhost');
  
  // Check if Clerk key is available
  const hasClerkKey = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  // Handle the case where user sees "Welcome back" without sign-in dialog
  const handleResetSession = async () => {
    try {
      setIsResetting(true);
      toast.loading('Resetting your session...', { id: 'reset-session' });
      
      // Simulate reset for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Session reset. Please sign in again.', { id: 'reset-session' });
            
      // Force reload the page to clear any cached state
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Failed to reset session:', error);
      toast.error('Error resetting session. Please try again.', { id: 'reset-session' });
      setIsResetting(false);
    }
  };

  // Initialize Clerk components if available
  let ClerkComponents = null;
  if (hasClerkKey) {
    try {
      const { SignIn, SignUp } = require('@clerk/clerk-react');
      ClerkComponents = { SignIn, SignUp };
    } catch (error) {
      console.error('Failed to load Clerk components:', error);
    }
  }

  // Showing demo auth UI if no key or in preview mode
  const showDemoUI = !hasClerkKey || (isLovablePreview && !hasClerkKey);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            {showSignUp ? 'Create an Account' : 'Welcome Back'}
            {showDemoUI && ' (Demo)'}
          </h2>
          
          {showDemoUI ? (
            // Demo auth UI
            <div>
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 font-semibold">Demo Mode Active</p>
                <p className="mt-2 text-sm text-blue-700">
                  You're viewing a demo version of the authentication page. 
                  Authentication requires the <code>VITE_CLERK_PUBLISHABLE_KEY</code> environment 
                  variable, which will be set during deployment.
                </p>
              </div>
              
              <div className="space-y-4">
                {showSignUp ? (
                  <div className="space-y-4">
                    <div className="form-group">
                      <label className="block text-gray-700 mb-1">Email</label>
                      <input type="email" className="w-full p-2 border rounded" placeholder="email@example.com" disabled />
                    </div>
                    <div className="form-group">
                      <label className="block text-gray-700 mb-1">Password</label>
                      <input type="password" className="w-full p-2 border rounded" placeholder="********" disabled />
                    </div>
                    <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-md opacity-50 cursor-not-allowed">
                      Sign Up (Demo)
                    </button>
                    <p className="text-center text-sm text-gray-500">
                      Already have an account?{" "}
                      <Link to="/auth" className="text-blue-600 hover:underline">
                        Sign in
                      </Link>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="form-group">
                      <label className="block text-gray-700 mb-1">Email</label>
                      <input type="email" className="w-full p-2 border rounded" placeholder="email@example.com" disabled />
                    </div>
                    <div className="form-group">
                      <label className="block text-gray-700 mb-1">Password</label>
                      <input type="password" className="w-full p-2 border rounded" placeholder="********" disabled />
                    </div>
                    <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-md opacity-50 cursor-not-allowed">
                      Sign In (Demo)
                    </button>
                    <div className="mt-4 text-center">
                      <button 
                        onClick={handleResetSession}
                        disabled={isResetting}
                        className={`text-sm text-blue-600 hover:text-blue-800 underline ${isResetting ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isResetting ? 'Resetting session...' : 'Having trouble signing in? Click here to reset your session'}
                      </button>
                    </div>
                    <p className="text-center text-sm text-gray-500">
                      Don't have an account?{" "}
                      <Link to="/auth?sign-up=true" className="text-blue-600 hover:underline">
                        Sign up
                      </Link>
                    </p>
                  </div>
                )}
                
                <div className="pt-4 mt-2 border-t border-gray-200">
                  <Link 
                    to="/" 
                    className="w-full block text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-md hover:from-blue-600 hover:to-indigo-700 transition"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            // Real Clerk auth UI
            ClerkComponents ? (
              <>
                {showSignUp ? (
                  <ClerkComponents.SignUp signInUrl="/auth" routing="path" />
                ) : (
                  <>
                    <ClerkComponents.SignIn signUpUrl="/auth?sign-up=true" routing="path" />
                    
                    <div className="mt-4 text-center">
                      <button 
                        onClick={handleResetSession}
                        disabled={isResetting}
                        className={`text-sm text-blue-600 hover:text-blue-800 underline ${isResetting ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isResetting ? 'Resetting session...' : 'Having trouble signing in? Click here to reset your session'}
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              // Fallback if Clerk import fails
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-red-800 font-semibold">Authentication Error</p>
                <p className="mt-2 text-sm text-red-700">
                  There was an error loading the authentication components. Please refresh the page or try again later.
                </p>
                <Link 
                  to="/" 
                  className="mt-4 w-full block text-center bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition"
                >
                  Return to Home
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
