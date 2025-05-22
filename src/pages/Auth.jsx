
import React, { useState } from 'react';
import { SignIn, SignUp, useClerk } from '@clerk/clerk-react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

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
  
  // Handle the case where user sees "Welcome back" without sign-in dialog
  const handleResetSession = async () => {
    try {
      setIsResetting(true);
      toast.loading('Resetting your session...', { id: 'reset-session' });
      
      await signOut();
      
      toast.success('Session reset. Please sign in again.', { id: 'reset-session' });
      
      // For Lovable preview, provide additional guidance
      if (isLovablePreview) {
        toast.success('Note: In the Lovable preview, authentication uses a demo mode. In production, you will need to set the VITE_CLERK_PUBLISHABLE_KEY environment variable.');
      }
      
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

  // Display more info about environment in preview mode
  React.useEffect(() => {
    if (isLovablePreview) {
      console.log('Auth component loaded in Lovable preview environment');
    }
  }, [isLovablePreview]);

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
                    Authentication is in demo mode. In production, set the VITE_CLERK_PUBLISHABLE_KEY
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
