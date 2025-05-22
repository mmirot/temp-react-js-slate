
import React from 'react';
import { SignIn, SignUp, useClerk } from '@clerk/clerk-react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const searchParams = new URLSearchParams(location.search);
  const showSignUp = searchParams.get('sign-up') === 'true';
  
  // Handle the case where user sees "Welcome back" without sign-in dialog
  const handleResetSession = async () => {
    try {
      await signOut();
      toast.success('Session reset. Please sign in again.');
      // Force reload the page to clear any cached state
      window.location.reload();
    } catch (error) {
      console.error('Failed to reset session:', error);
      toast.error('Error resetting session. Please try again.');
    }
  };

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
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Having trouble signing in? Click here to reset your session
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
