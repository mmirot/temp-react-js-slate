import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import './index.css';
import App from './App';

// Check if we're in the Lovable preview environment
const isLovablePreview = window.location.hostname.includes('lovable.app') || 
                        window.location.hostname.includes('localhost');

// For demo/preview, don't use Clerk
const showDemoMode = isLovablePreview;

console.log('Running in:', showDemoMode ? 'Demo Mode' : 'Production Mode');

// Get the Clerk publishable key from environment variables
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {showDemoMode ? (
      <App />
    ) : (
      <ClerkProvider publishableKey={clerkPubKey}>
        <App />
      </ClerkProvider>
    )}
  </React.StrictMode>
);