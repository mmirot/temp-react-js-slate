
import { supabase } from './client';
import { clearInvalidCredentials, saveCredentialsToCache } from './credentialUtils';
import { checkConnection } from './connectionCheck';

/**
 * Attempt to reconnect to Supabase
 * @param {boolean} waitForConnection - Whether to wait for connection before returning
 * @param {number} timeout - Maximum time to wait in ms
 * @returns {Promise<boolean>} True if reconnection was successful
 */
export const reconnect = async (waitForConnection = false, timeout = 3000) => {
  console.log('Supabase - Attempting to reconnect...');
  
  // Check for updated environment variables
  const newUrl = import.meta.env.VITE_SUPABASE_URL;
  const newKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  // If we have new credentials from env vars, use them
  if (newUrl && newKey) {
    console.log('Supabase - Detected environment variables, saving credentials');
    try {
      saveCredentialsToCache(newUrl, newKey);
      
      // Check if we need to reload the page
      const url = new URL(window.location.href);
      const isAuthFlow = url.searchParams.has('type') && 
                         (url.searchParams.get('type') === 'recovery' || 
                          url.searchParams.get('type') === 'signup');
      
      if (isAuthFlow) {
        console.log('Supabase - In auth flow, reconnecting without full page reload');
        // For auth flows, don't reload the full page to preserve params
        // Instead, try to re-initialize the client with delay for connection
        if (waitForConnection) {
          console.log('Supabase - Waiting for connection to establish...');
          return await waitForConnectionEstablished(timeout);
        } else {
          return await checkConnection();
        }
      } else {
        // Check if we have error parameters that suggest an expired OTP
        const hasOtpError = url.searchParams.has('error_code') && 
                          url.searchParams.get('error_code') === 'otp_expired';
        
        if (hasOtpError) {
          console.log('Supabase - Detected expired OTP error, will not reload page');
          // For expired OTP, don't reload to preserve error params for UI display
          if (waitForConnection) {
            return await waitForConnectionEstablished(timeout);
          } else {
            return await checkConnection();
          }
        } else {
          console.log('Supabase - Reloading page to apply new credentials');
          window.location.reload();
          return true;
        }
      }
    } catch (error) {
      console.error('Supabase - Failed to save new credentials:', error);
    }
  }
  
  // If credentials failed, try to create a new client instance
  try {
    // Add an initial delay before trying to get session for auth flows
    // This gives Supabase client more time to initialize
    const hasErrorParams = window.location.href.includes('error_code=otp_expired');
    if (hasErrorParams) {
      console.log('Supabase - Detected error parameters, adding connection delay');
      await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 second delay
    }
    
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Supabase - Session verification failed during reconnect:', error);
      // Clear any existing credentials as they may be invalid
      clearInvalidCredentials();
      return false;
    }
    
    if (waitForConnection) {
      return await waitForConnectionEstablished(timeout);
    } else {
      return await checkConnection();
    }
  } catch (error) {
    console.error('Supabase - Reconnection error:', error);
    return false;
  }
};

/**
 * Wait for a successful connection to establish with retry logic
 * @param {number} maxTimeout - Maximum time to wait in ms
 * @returns {Promise<boolean>} True if connection established
 */
const waitForConnectionEstablished = async (maxTimeout = 3000) => {
  console.log('Supabase - Waiting for connection to establish...');
  const startTime = Date.now();
  
  // Add initial forced delay before first connection attempt
  await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second initial delay
  
  // Try connecting after initial delay
  let isConnected = await checkConnection();
  if (isConnected) {
    console.log('Supabase - Connection established after initial delay');
    return true;
  }
  
  // If not connected, wait with multiple retries
  let attempts = 1;
  const maxAttempts = 5; // Increase max attempts
  
  while (!isConnected && attempts < maxAttempts && Date.now() - startTime < maxTimeout) {
    console.log(`Supabase - Connection attempt ${attempts}/${maxAttempts}...`);
    // Increase wait time between retries
    await new Promise(resolve => setTimeout(resolve, 1000 + (attempts * 200))); 
    isConnected = await checkConnection();
    attempts++;
  }
  
  console.log(`Supabase - Connection ${isConnected ? 'established' : 'failed'} after ${attempts} attempts`);
  return isConnected;
};

