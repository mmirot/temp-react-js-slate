
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import './index.css';
import App from './App';

// Get the publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Validate the publishable key
if (!PUBLISHABLE_KEY) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in environment variables. Get your key at https://dashboard.clerk.com/last-active?path=api-keys');
}

// Log key existence for debugging (won't reveal the key itself)
console.log('Clerk publishable key found:', !!PUBLISHABLE_KEY);

// Create a root instance
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app with ClerkProvider
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
