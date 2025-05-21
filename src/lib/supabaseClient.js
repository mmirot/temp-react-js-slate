
import { supabase } from './supabase/client';
import { checkConnection } from './supabase/connectionCheck';
import { reconnect } from './supabase/reconnect';
import { getLastConnectionAttempt } from './supabase/connectionUtils';

// Periodically check connection in the background
let connectionCheckInterval;

// Import the hasRealCredentials from client.js to determine if we should check connection
import { hasRealCredentials } from './supabase/client';

// Detect if we're in a password reset flow by checking URL parameters
const isPasswordResetFlow = () => {
  const url = new URL(window.location.href);
  return url.searchParams.has('type') && 
         (url.searchParams.get('type') === 'recovery' || 
          url.searchParams.get('type') === 'signup');
};

// If in password reset flow, try to reconnect immediately
if (hasRealCredentials || isPasswordResetFlow()) {
  console.log('Supabase - Attempting immediate connection check');
  // Priority connection check for auth flows
  checkConnection().then(isConnected => {
    console.log('Supabase initial connection status:', isConnected ? 'Connected' : 'Failed');
    
    // If we're in a password reset flow and connection failed, try reconnecting once
    if (isPasswordResetFlow() && !isConnected) {
      console.log('Supabase - Detected password reset flow with failed connection. Attempting reconnect...');
      reconnect().then(reconnected => {
        console.log('Supabase reconnection attempt for password reset flow:', reconnected ? 'Successful' : 'Failed');
      });
    }
  });
  
  // Set up periodic checking
  connectionCheckInterval = setInterval(() => {
    console.log('Supabase - Running periodic connection check');
    checkConnection().then(isConnected => {
      console.log('Supabase periodic connection check result:', isConnected ? 'Connected' : 'Failed');
    });
  }, 5 * 60 * 1000); // Every 5 minutes
}

// Export the necessary functions and the Supabase client
export { supabase, checkConnection, reconnect, getLastConnectionAttempt };
