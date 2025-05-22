
import React from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { useLocation } from 'react-router-dom';

const Auth = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const showSignUp = searchParams.get('sign-up') === 'true';

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
            <SignIn signUpUrl="/auth?sign-up=true" routing="path" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
