
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import './index.css';
import App from './App';

// Use the environment variable for Clerk publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Enhanced logging for debugging
console.log('Clerk authentication status:', PUBLISHABLE_KEY ? 'Available ✅' : 'Missing ❌');
console.log('Environment variables loaded:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')).length > 0 ? 'Yes' : 'No');
console.log('Checking for VITE_CLERK_PUBLISHABLE_KEY:', PUBLISHABLE_KEY ? 'Found' : 'Not found');

// Create a root instance
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app with or without ClerkProvider based on key availability
if (PUBLISHABLE_KEY) {
  root.render(
    <React.StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    </React.StrictMode>
  );
} else {
  console.warn("No Clerk Publishable Key found. Running in limited mode without authentication.");
  console.info("To enable authentication, please add VITE_CLERK_PUBLISHABLE_KEY to your .env.local file.");
  
  // When no key is available, wrap the app in a custom provider that will gracefully handle auth
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
