
import React from 'react';
import toast from 'react-hot-toast';

const ClerkSetupGuide = () => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 mb-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">Authentication Setup Guide</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Current Status:</h3>
        <div className="flex items-center bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>Authentication is not set up. Protected features are unavailable.</span>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Steps to Enable Authentication:</h3>
        
        <ol className="list-decimal pl-5 space-y-4">
          <li className="text-gray-700">
            <p className="font-medium mb-1">Sign up for a Clerk account</p>
            <p className="mb-2">Visit <a href="https://go.clerk.com/lovable" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Clerk's website</a> and create an account.</p>
          </li>
          
          <li className="text-gray-700">
            <p className="font-medium mb-1">Create a new application in Clerk</p>
            <p className="mb-2">After signing in, create a new application from your Clerk dashboard.</p>
          </li>
          
          <li className="text-gray-700">
            <p className="font-medium mb-1">Get your Publishable Key</p>
            <p className="mb-2">Find your Publishable Key in the API Keys section of your Clerk dashboard.</p>
          </li>
          
          <li className="text-gray-700">
            <p className="font-medium mb-1">Create a <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code> file in your project root directory</p>
            <div className="bg-gray-100 p-3 rounded flex items-center justify-between">
              <code>VITE_CLERK_PUBLISHABLE_KEY=pk_your_publishable_key_here</code>
              <button 
                onClick={() => copyToClipboard("VITE_CLERK_PUBLISHABLE_KEY=pk_your_publishable_key_here")} 
                className="text-indigo-600 hover:text-indigo-800"
                aria-label="Copy to clipboard"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
              </button>
            </div>
          </li>
          
          <li className="text-gray-700">
            <p className="font-medium mb-1">Restart your development server</p>
            <p>After adding the <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code> file, restart your development server to apply the changes.</p>
          </li>
        </ol>
      </div>
      
      <div className="p-4 bg-blue-50 border-l-4 border-blue-500 text-blue-700">
        <h4 className="font-bold">Note:</h4>
        <p>The <code className="bg-gray-100 px-1">.env.local</code> file should NEVER be committed to version control. It contains sensitive information that should remain private.</p>
      </div>
    </div>
  );
};

export default ClerkSetupGuide;
