
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import './index.css';
import App from './App';

// Get the publishable key
// In Lovable environment, we can provide a default for development
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_dummy-key-for-development';

// Check if we're using the development fallback key
if (PUBLISHABLE_KEY === 'pk_test_dummy-key-for-development') {
  console.warn('⚠️ Using development fallback key. For production, set VITE_CLERK_PUBLISHABLE_KEY in your environment.');
  
  // Display a warning but continue loading the app
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <div style={{ 
        padding: '20px', 
        maxWidth: '800px', 
        margin: '40px auto',
        fontFamily: 'Arial, sans-serif',
        lineHeight: '1.6',
        color: '#333',
        backgroundColor: '#fff3cd',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        border: '1px solid #ffeeba'
      }}>
        <h1 style={{ color: '#856404' }}>⚠️ Development Mode</h1>
        <p>The app is running with a development fallback key for Clerk authentication. This will allow basic functionality but some features may be limited.</p>
        <p>For full functionality, you need to:</p>
        <ol>
          <li>Get a publishable key from the <a href="https://dashboard.clerk.com/last-active?path=api-keys" target="_blank" rel="noopener noreferrer">Clerk dashboard</a>.</li>
          <li>Set it as an environment variable named <code>VITE_CLERK_PUBLISHABLE_KEY</code> in your project settings.</li>
        </ol>
        <p><strong>Note:</strong> In Lovable, environment variables can be set in the project settings.</p>
        <button 
          style={{ 
            marginTop: '10px',
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          onClick={() => {
            document.getElementById('root').__CLERK_DEV_MESSAGE.style.display = 'none';
            document.getElementById('app-content').style.display = 'block';
          }}
        >
          Continue to App
        </button>
      </div>
    </React.StrictMode>
  );
  
  // Create a hidden div for the actual app content
  const appContentDiv = document.createElement('div');
  appContentDiv.id = 'app-content';
  appContentDiv.style.display = 'none';
  document.body.appendChild(appContentDiv);
  
  // Store reference to the warning message
  document.getElementById('root').__CLERK_DEV_MESSAGE = document.getElementById('root').firstChild;
  
  // Render the actual app in the hidden div
  ReactDOM.createRoot(appContentDiv).render(
    <React.StrictMode>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
    </React.StrictMode>
  );
} else {
  // Normal rendering with the proper key
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
}
