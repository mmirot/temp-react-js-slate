
import { supabase } from './supabase/client';
import { checkConnection } from './supabase/connectionCheck';
import { reconnect } from './supabase/reconnect';
import { getLastConnectionAttempt } from './supabase/connectionUtils';

// Periodically check connection in the background
let connectionCheckInterval;

// Import the hasRealCredentials from client.js to determine if we should check connection
import { hasRealCredentials } from './supabase/client';

// Create a function to detect if we're in a password reset flow or have OTP error by checking URL parameters
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
    console.error('Failed to check URL parameters:', e);
    return false;
  }
};

// Run the detection function immediately
const inResetFlowOrError = isPasswordResetOrError();

// Initial connection test - run immediately with delays
if (inResetFlowOrError) {
  console.log('Supabase - Detected auth flow or error, prioritizing immediate connection test');
  
  // First, try to connect synchronously before handling any auth
  (async () => {
    // Use a powerful delay upfront for initial connection
    console.log('Supabase - Adding substantial initial delay for auth flow');
    await new Promise(resolve => setTimeout(resolve, 3000)); // 3 second initial delay
    
    // Now run connection check
    try {
      console.log('Supabase - Testing initial connection for auth flow');
      const isConnected = await checkConnection();
      console.log('Supabase initial connection status for auth flow:', isConnected ? 'Connected' : 'Failed');
      
      if (!isConnected) {
        console.log('Supabase - First connection attempt failed, trying reconnect...');
        
        // Add another small delay
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
        
        // Try reconnecting with wait
        const reconnected = await reconnect(true, 10000); // Extended timeout
        console.log('Supabase reconnection result:', reconnected ? 'Success' : 'Failed');
      }
    } catch (error) {
      console.error('Supabase - Initial connection test failed:', error);
    }
  })();
} else if (hasRealCredentials) {
  // For normal pages, use standard connection check
  // Add increased initial delay for all connection attempts
  setTimeout(async () => {
    // Priority connection check
    const isConnected = await checkConnection();
    console.log('Supabase initial connection status:', isConnected ? 'Connected' : 'Failed');
  }, 1000); // 1 second initial delay
  
  // Set up periodic checking
  connectionCheckInterval = setInterval(() => {
    console.log('Supabase - Running periodic connection check');
    checkConnection().then(isConnected => {
      console.log('Supabase periodic connection check result:', isConnected ? 'Connected' : 'Failed');
    });
  }, 5 * 60 * 1000); // Every 5 minutes
}

// Function to test connection manually
const testConnection = async () => {
  console.log('Supabase - Manual connection test requested');
  
  // Add delay before checking
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  try {
    const isConnected = await checkConnection();
    console.log('Supabase manual connection test result:', isConnected ? 'Connected' : 'Failed');
    return isConnected;
  } catch (error) {
    console.error('Supabase manual connection test error:', error);
    return false;
  }
};

// Export the necessary functions and the Supabase client
export { supabase, checkConnection, reconnect, getLastConnectionAttempt, testConnection };
