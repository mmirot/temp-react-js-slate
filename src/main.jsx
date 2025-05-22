
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import './index.css';
import App from './App';

// Get the publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Check if we're in the Lovable preview environment or on a custom domain without the env var
const isLovablePreview = window.location.hostname.includes('lovable.app') || 
                         window.location.hostname.includes('localhost');
                         
// For custom domains, we should also enable preview mode if the key is missing
const isCustomDomainWithoutKey = !PUBLISHABLE_KEY && 
                               !isLovablePreview && 
                               window.location.hostname !== '';

// For previews, use a working demo key that allows rendering without authentication
const dummyKey = 'pk_test_Y29uY2VudHJhdGVkLWNvbGxpZS03Mi5jbGVyay5hY2NvdW50cy5kZXYk';

// Use the environment variable if available, otherwise use a dummy key
const effectiveKey = PUBLISHABLE_KEY || ((isLovablePreview || isCustomDomainWithoutKey) ? dummyKey : null);

// Log the environment and key status for debugging
console.log('Environment details:', {
  isLovablePreview,
  isCustomDomainWithoutKey,
  hasPublishableKey: !!PUBLISHABLE_KEY,
  usingDummyKey: !PUBLISHABLE_KEY && (isLovablePreview || isCustomDomainWithoutKey),
  hostname: window.location.hostname,
  effectiveKey: effectiveKey ? 'Key available' : 'No key available'
});

// If no real key is available in production, show an error
if (!effectiveKey) {
  console.error('Error: Missing VITE_CLERK_PUBLISHABLE_KEY environment variable');
  
  // Display a detailed error message
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
        
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #ddd' }}>
          <h3>How to Fix This Error:</h3>
          <p><strong>In Lovable:</strong></p>
          <ol>
            <li>This error appears because Lovable is a preview environment and doesn't have access to your environment variables.</li>
            <li>Continue development and deploy to Netlify or another platform where you'll set the environment variables.</li>
          </ol>
          <p><strong>In Netlify:</strong></p>
          <ol>
            <li>Go to your Netlify dashboard</li>
            <li>Select your site</li>
            <li>Navigate to Site settings > Build & deploy > Environment</li>
            <li>Add <code>VITE_CLERK_PUBLISHABLE_KEY</code> with your value from Clerk</li>
          </ol>
        </div>
      </div>
    </React.StrictMode>
  );
} else {
  console.log('Starting application with', PUBLISHABLE_KEY ? 'actual' : 'preview', 'Clerk key');
  
  // Create a root instance and render the app normally
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <ClerkProvider 
        publishableKey={effectiveKey}
        afterSignOutUrl="/"
        signInUrl="/auth"
      >
        <App />
      </ClerkProvider>
    </React.StrictMode>
  );
}
