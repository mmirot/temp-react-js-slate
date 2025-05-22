
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
console.log('- Clerk key value (first 5 chars):', PUBLISHABLE_KEY ? PUBLISHABLE_KEY.substring(0, 5) : 'N/A');
console.log('- All env variables:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')));

// Check if we have a valid key
const hasValidKey = PUBLISHABLE_KEY && 
                    PUBLISHABLE_KEY !== 'placeholder_for_dev' && 
                    PUBLISHABLE_KEY.startsWith('pk_');

if (!hasValidKey) {
  console.error('No valid Clerk publishable key found! Authentication will not work.');
  console.error('Please check that your .env.local file exists and contains VITE_CLERK_PUBLISHABLE_KEY=pk_...');
}

// Create a root instance
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app with ClerkProvider only if we have a valid key
root.render(
  <React.StrictMode>
    {hasValidKey ? (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    ) : (
      // Render App without ClerkProvider when no valid key is available
      <App />
    )}
  </React.StrictMode>
);
