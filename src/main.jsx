
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import './index.css';
import App from './App';

// Get the publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Check if we're in the Lovable preview environment
const isLovablePreview = window.location.hostname.includes('lovable.app') || 
                         window.location.hostname.includes('localhost');

// Log environment information for debugging
console.log('Environment details:', {
  isLovablePreview,
  hasPublishableKey: !!PUBLISHABLE_KEY,
  hostname: window.location.hostname
});

if (!PUBLISHABLE_KEY) {
  // Display a simplified message for missing key in preview mode
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
          <h3>Next Steps:</h3>
          <p><strong>In Lovable Preview:</strong></p>
          <ol>
            <li>This message appears because environment variables aren't available in preview mode</li>
            <li>Continue development of non-authentication features</li>
            <li>When ready to deploy, you'll set the environment variable during the publishing process</li>
          </ol>
          <p><strong>When Publishing:</strong></p>
          <ol>
            <li>Use the "Publish" button in Lovable</li>
            <li>During deployment, you'll be prompted to set <code>VITE_CLERK_PUBLISHABLE_KEY</code></li>
            <li>Get your publishable key from the <a href="https://dashboard.clerk.com/" style={{color: '#2563eb', textDecoration: 'underline'}}>Clerk dashboard</a></li>
          </ol>
        </div>
        
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button 
            onClick={() => {
              document.getElementById('root').removeChild(document.getElementById('root').firstChild);
              ReactDOM.createRoot(document.getElementById('root')).render(
                <React.StrictMode>
                  <App />
                </React.StrictMode>
              );
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
            Continue to App
          </button>
          <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#4a5568' }}>
            Note: Authentication features will not function until the environment variable is set.
          </p>
        </div>
      </div>
    </React.StrictMode>
  );
} else {
  // Render the app with Clerk authentication if key is available
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <ClerkProvider 
        publishableKey={PUBLISHABLE_KEY}
        afterSignOutUrl="/"
        signInUrl="/auth"
      >
        <App />
      </ClerkProvider>
    </React.StrictMode>
  );
}
