
import React, { useState } from 'react';
import { SignIn, SignUp, useClerk } from '@clerk/clerk-react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useClerk();
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
      
      await signOut();
      
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

  // If no Clerk key in preview mode, show message
  if (isLovablePreview && !hasClerkKey) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Authentication Unavailable in Preview
            </h2>
            
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 font-semibold">Preview Environment Notice</p>
              <p className="mt-2 text-sm text-blue-700">
                Authentication requires the <code>VITE_CLERK_PUBLISHABLE_KEY</code> environment variable,
                which is not accessible in the Lovable preview environment.
              </p>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600">
                To use authentication features:
              </p>
              
              <ol className="list-decimal pl-5 space-y-2 text-gray-600">
                <li>When deploying with the "Publish" button, set your Clerk publishable key</li>
                <li>Visit your deployed site to use full authentication features</li>
              </ol>
              
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            {showSignUp ? 'Create an Account' : 'Welcome Back'}
          </h2>
          
          {showSignUp ? (
            <SignUp signInUrl="/auth" routing="path" />
          ) : (
            <>
              <SignIn signUpUrl="/auth?sign-up=true" routing="path" />
              
              <div className="mt-4 text-center">
                <button 
                  onClick={handleResetSession}
                  disabled={isResetting}
                  className={`text-sm text-blue-600 hover:text-blue-800 underline ${isResetting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isResetting ? 'Resetting session...' : 'Having trouble signing in? Click here to reset your session'}
                </button>
              </div>

              {isLovablePreview && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm">
                  <p className="font-semibold text-blue-800">Lovable Preview Environment</p>
                  <p className="mt-1 text-blue-700">
                    Authentication is in preview mode. In production, set the VITE_CLERK_PUBLISHABLE_KEY
                    environment variable in your deployment settings.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
