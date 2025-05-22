
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import './index.css';
import App from './App';

// Get the publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Check if the key is available
if (!PUBLISHABLE_KEY) {
  console.error('Error: Missing VITE_CLERK_PUBLISHABLE_KEY environment variable');
  
  // Display a minimal error message
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <div style={{ 
        padding: '20px', 
        maxWidth: '800px', 
        margin: '40px auto',
        fontFamily: 'Arial, sans-serif',
        lineHeight: '1.6',
        color: '#333',
        backgroundColor: '#ffeaea',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        border: '1px solid #ffcaca'
      }}>
        <h1 style={{ color: '#e53e3e' }}>⚠️ Configuration Error</h1>
        <p>The Clerk authentication service requires a valid publishable key.</p>
        <p>Please set the <code>VITE_CLERK_PUBLISHABLE_KEY</code> environment variable in your deployment settings.</p>
      </div>
    </React.StrictMode>
  );
} else {
  console.log('Clerk publishable key found. Starting application...');
  
  // Create a root instance and render the app normally
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
        <App />
      </ClerkProvider>
    </React.StrictMode>
  );
}
