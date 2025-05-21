
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import './index.css';
import App from './App';

// Use the environment variable for Clerk publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Log for debugging
console.log('Clerk key available:', !!PUBLISHABLE_KEY);

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
  console.info("To enable authentication, please add VITE_CLERK_PUBLISHABLE_KEY to your .env file.");
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
