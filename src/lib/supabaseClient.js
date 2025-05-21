
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
  try {
    const url = new URL(window.location.href);
    return url.searchParams.has('type') && 
          (url.searchParams.get('type') === 'recovery' || 
            url.searchParams.get('type') === 'signup');
  } catch (e) {
    return false;
  }
};

// Prioritize connection for password reset flows
const inResetFlow = isPasswordResetFlow();
if (inResetFlow) {
  console.log('Supabase - Detected password reset flow, prioritizing connection');
  
  // For password reset flows, use a delay before everything else
  setTimeout(async () => {
    console.log('Supabase - Delayed connection check for password reset flow starting');
    // Wait for connection with retries for auth flows
    const isConnected = await reconnect(true, 5000);
    console.log('Supabase initial connection status:', isConnected ? 'Connected' : 'Failed');
  }, 1000);
}

// If in password reset flow or we have credentials, try to connect immediately
if (hasRealCredentials || inResetFlow) {
  console.log('Supabase - Attempting immediate connection check');
  
  // Add small initial delay for all connection attempts
  setTimeout(async () => {
    // Priority connection check for auth flows
    const isConnected = await checkConnection();
    console.log('Supabase initial connection status:', isConnected ? 'Connected' : 'Failed');
    
    // If we're in a password reset flow and connection failed, try reconnecting immediately
    if (inResetFlow && !isConnected) {
      console.log('Supabase - Detected password reset flow with failed connection. Attempting reconnect...');
      
      // Add a small delay before reconnection attempt
      setTimeout(async () => {
        const reconnected = await reconnect(true, 5000);
        console.log('Supabase reconnection attempt for password reset flow:', reconnected ? 'Successful' : 'Failed');
      }, 500);
    }
  }, 500);
  
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
