import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import './index.css';

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Check if we're in the Lovable preview environment without a Clerk key
const isLovablePreview = window.location.hostname.includes('lovable.app') || 
                        window.location.hostname.includes('localhost');
const showDemoMode = isLovablePreview && !publishableKey;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {showDemoMode ? (
      // Render app without ClerkProvider in demo mode
      <App />
    ) : (
      // Wrap app with ClerkProvider when auth is enabled
      <ClerkProvider 
        publishableKey={publishableKey}
        navigate={(to) => window.location.href = to}
      >
        <App />
      </ClerkProvider>
    )}
  </React.StrictMode>
);