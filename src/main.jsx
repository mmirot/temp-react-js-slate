
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import './index.css';
import App from './App';

// Get the publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Show a more user-friendly error message if the key is missing
if (!PUBLISHABLE_KEY) {
  console.error('Error: Missing VITE_CLERK_PUBLISHABLE_KEY in environment variables.');
  
  // Render a helpful error message instead of crashing the app
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <div style={{ 
        padding: '20px', 
        maxWidth: '800px', 
        margin: '40px auto',
        fontFamily: 'Arial, sans-serif',
        lineHeight: '1.6',
        color: '#333',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#e53e3e' }}>Environment Variable Error</h1>
        <p>The Clerk publishable key is missing. Follow these steps to fix it:</p>
        <ol>
          <li>Create a <code>.env</code> or <code>.env.local</code> file in the root of your project.</li>
          <li>Add the following line to the file:<br />
            <code style={{ 
              backgroundColor: '#eee', 
              padding: '5px 10px', 
              borderRadius: '4px',
              display: 'block',
              marginTop: '10px'
            }}>VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key</code>
          </li>
          <li>Replace <code>your_clerk_publishable_key</code> with your actual Clerk publishable key from the <a href="https://dashboard.clerk.com/last-active?path=api-keys" target="_blank" rel="noopener noreferrer">Clerk dashboard</a>.</li>
          <li>Restart the development server.</li>
        </ol>
        <p><strong>Important:</strong> Make sure the file is named correctly and is in the root directory of the project, not in the <code>src</code> folder.</p>
      </div>
    </React.StrictMode>
  );
  
  // Exit early to prevent trying to render the app without the key
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in environment variables.');
}

// Log key existence for debugging (won't reveal the key itself)
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
