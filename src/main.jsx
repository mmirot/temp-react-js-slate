
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import './index.css';
import App from './App';

// Use the environment variable for Clerk publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Enhanced logging for debugging
console.log('Environment check - Clerk key status:', PUBLISHABLE_KEY ? 'Available ✅' : 'Missing ❌');
console.log('Environment variables loaded:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')).length);
console.log('VITE_CLERK_PUBLISHABLE_KEY value length:', PUBLISHABLE_KEY ? PUBLISHABLE_KEY.length : 0);

// Create a root instance
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app with ClerkProvider regardless of key availability
// This ensures a consistent environment for all components
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY || 'placeholder_for_dev'}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);

// Log additional information about the rendering
console.log('App rendered with ClerkProvider. Key available:', !!PUBLISHABLE_KEY);
