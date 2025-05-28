import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import './index.css';

// Get the publishable key from .env.local
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.trim();

// Check if we're in the Lovable preview environment without a Clerk key
const isLovablePreview = window.location.hostname.includes('lovable.app') || 
                        window.location.hostname.includes('localhost');
const showDemoMode = !PUBLISHABLE_KEY || PUBLISHABLE_KEY === 'undefined';

// Log environment information for debugging
console.log('Environment details:', {
  environment: isLovablePreview ? 'Lovable Preview' : 'Production',
  hasPublishableKey: !!PUBLISHABLE_KEY,
  publishableKey: PUBLISHABLE_KEY ? `${PUBLISHABLE_KEY.substring(0, 7)}...` : 'Not Set',
  hostname: window.location.hostname
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {showDemoMode ? (
      // Render app without ClerkProvider in demo mode
      <App />
    ) : (
      // Wrap app with ClerkProvider when auth is enabled
      <ClerkProvider 
        publishableKey={PUBLISHABLE_KEY || ''}
        navigate={(to) => window.location.href = to}
        appearance={{
          baseTheme: "light"
        }}
      >
        <App />
      </ClerkProvider>
    )}
  </React.StrictMode>
);