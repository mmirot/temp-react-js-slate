import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import './index.css';
import App from './App';

// Get the publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const isLovablePreview = window.location.hostname.includes('lovable.app') || 
                         window.location.hostname.includes('localhost');
const isProduction = window.location.hostname === 'svpathlab.com';
console.log('Environment details:', {
  environment: isProduction ? 'Production' : (isLovablePreview ? 'Lovable Preview' : 'Other'),
  hasPublishableKey: !!PUBLISHABLE_KEY,
  hostname: window.location.hostname
});

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
      <div style={{ 
        padding: '20px', 
        maxWidth: '800px', 
        margin: '40px auto',
        fontFamily: 'Arial, sans-serif',
        lineHeight: '1.6',
        color: '#333',
        backgroundColor: '#f0f5ff',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        border: '1px solid #c3cfe2'
      }}>
        <h1 style={{ color: '#2a4365' }}>Environment Setup Required</h1>
        <p>To use authentication features, you need to set up your environment variable:</p>
        
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #ddd' }}>
          <h3>For {isProduction ? 'Production Site' : 'Lovable Preview'}:</h3>
          <p><strong>{isProduction ? 'Production Environment' : 'Preview Mode'} Setup:</strong></p>
          <ol>
            <li>The VITE_CLERK_PUBLISHABLE_KEY environment variable is not set</li>
            <li>This key is required for authentication features to work</li>
            {isProduction && <li>For production deployment, you must set this in your hosting provider's environment settings</li>}
            <li>Get your publishable key from the <a href="https://dashboard.clerk.com/" style={{color: '#2563eb', textDecoration: 'underline'}}>Clerk dashboard</a></li>
          </ol>
          
          {isProduction && (
            <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#fffbea', borderRadius: '6px', border: '1px solid #f6e05e' }}>
              <strong>Important for Production:</strong>
              <ul>
                <li>Set VITE_CLERK_PUBLISHABLE_KEY in your deployment environment</li>
                <li>Make sure your domain (svpathlab.com) is added to the allowed domains in your Clerk dashboard</li>
                <li>Configure redirect URLs in Clerk to include https://svpathlab.com/auth</li>
              </ul>
            </div>
          )}
        </div>
        
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button 
            onClick={() => {
          document.getElementById('root').innerHTML = '';
          ReactDOM.createRoot(document.getElementById('root')).render(renderApp());
            }}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '6px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          >
            Continue to App in Demo Mode
          </button>
          <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#4a5568' }}>
            Note: Authentication features will not function until the environment variable is set.
          </p>
        </div>
      </div>
    </React.StrictMode>
  );
} else {
  ReactDOM.createRoot(document.getElementById('root')).render(renderApp());
}