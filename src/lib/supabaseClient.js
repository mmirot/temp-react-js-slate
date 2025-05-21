
import { supabase } from './supabase/client';
import { checkConnection } from './supabase/connectionCheck';
import { reconnect } from './supabase/reconnect';
import { getLastConnectionAttempt } from './supabase/connectionUtils';

// Periodically check connection in the background
let connectionCheckInterval;

// Import the hasRealCredentials from client.js to determine if we should check connection
import { hasRealCredentials } from './supabase/client';

if (hasRealCredentials) {
  connectionCheckInterval = setInterval(() => {
    console.log('Supabase - Running periodic connection check');
    checkConnection().then(isConnected => {
      console.log('Supabase periodic connection check result:', isConnected ? 'Connected' : 'Failed');
    });
  }, 5 * 60 * 1000); // Every 5 minutes
}

// Test the connection immediately only if we have real credentials
if (hasRealCredentials) {
  checkConnection().then(isConnected => {
    console.log('Supabase initial connection status:', isConnected ? 'Connected' : 'Failed');
  });
}

// Export the necessary functions and the Supabase client
export { supabase, checkConnection, reconnect, getLastConnectionAttempt };
