
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import './index.css';
import App from './App';

// Use the environment variable for Clerk publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Enhanced logging for debugging
console.log('Environment check:');
console.log('- Clerk key available:', PUBLISHABLE_KEY ? 'Yes' : 'No');
console.log('- Clerk key length:', PUBLISHABLE_KEY ? PUBLISHABLE_KEY.length : 0);
console.log('- All env variables:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')));

// If we don't have a valid publishable key, we need to show an error
// but still render the app so users can see setup instructions
if (!PUBLISHABLE_KEY || PUBLISHABLE_KEY === 'placeholder_for_dev') {
  console.error('No valid Clerk publishable key found! Authentication will not work.');
  console.error('Please check that your .env.local file exists and contains VITE_CLERK_PUBLISHABLE_KEY=pk_...');
}

// Create a root instance
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app with ClerkProvider only if we have a valid key
root.render(
  <React.StrictMode>
    {PUBLISHABLE_KEY && PUBLISHABLE_KEY !== 'placeholder_for_dev' ? (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    ) : (
      // Render App without ClerkProvider when no valid key is available
      <App />
    )}
  </React.StrictMode>
);

