import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import './index.css';
import App from './App';

// Get the publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const isLovablePreview = window.location.hostname.includes('lovable.app') || 
                         window.location.hostname.includes('localhost');
const isProduction = window.location.hostname === 'svpathlab.com';

// Create a function to render the app with or without ClerkProvider
const renderApp = () => {
  // Only wrap with ClerkProvider if we have a valid key
  if (PUBLISHABLE_KEY) {
    return (
      <React.StrictMode>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
          <App />
        </ClerkProvider>
      </React.StrictMode>
    );
  } else {
    // No key available, render App directly without ClerkProvider
    console.log('No Clerk key available, running in demo mode');
    return (
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
};

// If no publishable key and in preview mode, show the setup message first
if (!PUBLISHABLE_KEY && (isLovablePreview || isProduction)) {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <div style={{ padding: '20px', maxWidth: '800px', margin: '40px auto', fontFamily: 'Arial, sans-serif' }}>
        <h1>Environment Setup Required</h1>
        <p>To use authentication features, you need to set up your environment variable:</p>
        <p>VITE_CLERK_PUBLISHABLE_KEY must be set in your environment.</p>
        <button onClick={() => {
          document.getElementById('root').innerHTML = '';
          ReactDOM.createRoot(document.getElementById('root')).render(renderApp());
        }}>
          Continue in Demo Mode
        </button>
      </div>
    </React.StrictMode>
  );
} else {
  ReactDOM.createRoot(document.getElementById('root')).render(renderApp());
}