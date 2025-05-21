
import React from 'react';
import { Navigate } from 'react-router-dom';
import { 
  SignIn, 
  SignUp, 
  useAuth as useClerkAuth 
} from '@clerk/clerk-react';
import { useAuth } from '../context/clerk';

const Auth = () => {
  const { userId } = useClerkAuth();
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // If user is already authenticated, redirect to home page
  if (userId) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Welcome to SV Pathology Lab</h2>
          
          {/* Clerk provides these components out of the box */}
          {/* Tab navigation for Sign In and Sign Up */}
          <div className="flex border-b border-gray-200 mb-6">
            <button 
              className="flex-1 py-2 px-4 text-center border-b-2 border-indigo-500 font-medium text-indigo-600"
              id="signin-tab"
              onClick={() => document.getElementById('clerk-sign-in').style.display = 'block'}
            >
              Sign In
            </button>
            <button 
              className="flex-1 py-2 px-4 text-center text-gray-500 font-medium"
              id="signup-tab"
              onClick={() => document.getElementById('clerk-sign-up').style.display = 'block'}
            >
              Sign Up
            </button>
          </div>
          
          <div id="clerk-sign-in" className="mb-6">
            <SignIn 
              routing="path"
              path="/auth"
              redirectUrl="/"
              signUpUrl="/auth/sign-up" 
            />
          </div>
          
          <div id="clerk-sign-up" style={{ display: 'none' }}>
            <SignUp 
              routing="path"
              path="/auth/sign-up"
              redirectUrl="/"
              signInUrl="/auth" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
