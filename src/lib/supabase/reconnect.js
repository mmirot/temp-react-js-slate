
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
      
      // Check for OTP errors in URL or hash
      const hasOtpError = url.searchParams.has('error_code') && url.searchParams.get('error_code') === 'otp_expired';
      const hashParams = new URLSearchParams(url.hash.replace('#', ''));
      const hasHashOtpError = hashParams.has('error_code') && hashParams.get('error_code') === 'otp_expired';
      
      if (isAuthFlow || hasOtpError || hasHashOtpError) {
        console.log('Supabase - In special flow, reconnecting without full page reload');
        
        // Add a substantial delay for connection to establish
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 seconds delay
        
        // For auth flows, don't reload the full page to preserve params
        if (waitForConnection) {
          console.log('Supabase - Waiting for connection to establish...');
          return await waitForConnectionEstablished(timeout);
        } else {
          return await checkConnection();
        }
      } else {
        console.log('Supabase - Reloading page to apply new credentials');
        window.location.reload();
        return true;
      }
    } catch (error) {
      console.error('Supabase - Failed to save new credentials:', error);
    }
  }
  
  // If credentials failed, try to create a new client instance
  try {
    // Add a substantial initial delay before trying to get session for auth flows
    const urlParams = new URL(window.location.href).searchParams;
    const hashParams = new URLSearchParams(window.location.hash.replace('#', ''));
    
    const hasAuthParams = urlParams.has('type') || 
                          urlParams.has('error_code') || 
                          hashParams.has('error_code');
                          
    if (hasAuthParams) {
      console.log('Supabase - Detected auth parameters, adding extended connection delay');
      await new Promise(resolve => setTimeout(resolve, 3000)); // 3 second delay
    }
    
    // Attempt to establish connection before checking session
    const isConnected = await checkConnection();
    if (!isConnected) {
      console.log('Supabase - Initial connection check failed, will retry');
    }
    
    // Now check session
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
  await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second initial delay
  
  // Try connecting after initial delay
  let isConnected = await checkConnection();
  if (isConnected) {
    console.log('Supabase - Connection established after initial delay');
    return true;
  }
  
  // If not connected, wait with multiple retries
  let attempts = 1;
  const maxAttempts = 6; // Increase max attempts
  
  while (!isConnected && attempts < maxAttempts && Date.now() - startTime < maxTimeout) {
    console.log(`Supabase - Connection attempt ${attempts}/${maxAttempts}...`);
    // Increase wait time between retries
    await new Promise(resolve => setTimeout(resolve, 1500 + (attempts * 300))); 
    isConnected = await checkConnection();
    attempts++;
  }
  
  console.log(`Supabase - Connection ${isConnected ? 'established' : 'failed'} after ${attempts} attempts`);
  return isConnected;
};
