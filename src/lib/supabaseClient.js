
import { supabase } from './supabase/client';
import { checkConnection } from './supabase/connectionCheck';
import { reconnect } from './supabase/reconnect';
import { getLastConnectionAttempt } from './supabase/connectionUtils';

// Periodically check connection in the background
let connectionCheckInterval;

// Import the hasRealCredentials from client.js to determine if we should check connection
import { hasRealCredentials } from './supabase/client';

// Detect if we're in a password reset flow or have OTP error by checking URL parameters
const isPasswordResetOrError = () => {
  try {
    const url = new URL(window.location.href);
    
    // Check for password reset flow
    const isResetFlow = url.searchParams.has('type') && 
           (url.searchParams.get('type') === 'recovery' || 
            url.searchParams.get('type') === 'signup');
            
    // Check for OTP expired error
    const isOtpError = url.searchParams.has('error_code') && 
                      url.searchParams.get('error_code') === 'otp_expired';
                      
    // Also check hash fragment for errors (some auth redirects put params in hash)
    const hashParams = new URLSearchParams(url.hash.replace('#', ''));
    const hasHashOtpError = hashParams.has('error_code') && 
                           hashParams.get('error_code') === 'otp_expired';
    
    return isResetFlow || isOtpError || hasHashOtpError;
  } catch (e) {
    return false;
  }
};

// Prioritize connection for password reset flows and OTP errors
const inResetFlowOrError = isPasswordResetOrError();
if (inResetFlowOrError) {
  console.log('Supabase - Detected auth flow or error, prioritizing connection');
  
  // For password reset flows or errors, use a longer delay before everything else
  setTimeout(async () => {
    console.log('Supabase - Delayed connection check for auth flow starting');
    // Wait for connection with retries for auth flows
    const isConnected = await reconnect(true, 8000); // Increase timeout to 8 seconds
    console.log('Supabase initial connection status:', isConnected ? 'Connected' : 'Failed');
  }, 1500); // Increased initial delay to 1.5 seconds
}

// If in password reset flow / error or we have credentials, try to connect immediately
if (hasRealCredentials || inResetFlowOrError) {
  console.log('Supabase - Attempting immediate connection check');
  
  // Add increased initial delay for all connection attempts
  setTimeout(async () => {
    // Priority connection check for auth flows
    const isConnected = await checkConnection();
    console.log('Supabase initial connection status:', isConnected ? 'Connected' : 'Failed');
    
    // If we're in a password reset flow or have error and connection failed, try reconnecting immediately
    if (inResetFlowOrError && !isConnected) {
      console.log('Supabase - Detected auth flow with failed connection. Attempting reconnect...');
      
      // Add a larger delay before reconnection attempt
      setTimeout(async () => {
        const reconnected = await reconnect(true, 8000); // Increase timeout and wait for connection
        console.log('Supabase reconnection attempt for auth flow:', reconnected ? 'Successful' : 'Failed');
      }, 1000); // Increased delay to 1 second
    }
  }, 800); // Increased initial delay to 800ms
  
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
