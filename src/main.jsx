
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import './index.css';
import App from './App';

// Use the environment variable for Clerk publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Log for debugging
console.log('Clerk key available:', !!PUBLISHABLE_KEY);

if (!PUBLISHABLE_KEY) {
  console.error("Error: Missing Clerk Publishable Key. Please check your .env file.");
  // Provide a fallback key for development purposes
  // In production, you should ensure the environment variable is properly set
  throw new Error("Missing Clerk Publishable Key. Please set VITE_CLERK_PUBLISHABLE_KEY in your .env file.");
}

// Use createRoot API for React 18
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
