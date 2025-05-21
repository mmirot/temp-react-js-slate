
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
  
  // Try connecting immediately first
  let isConnected = await checkConnection();
  if (isConnected) {
    console.log('Supabase - Connection established immediately');
    return true;
  }
  
  // If not connected, wait with multiple retries
  let attempts = 1;
  const maxAttempts = 3;
  
  while (!isConnected && attempts < maxAttempts && Date.now() - startTime < maxTimeout) {
    console.log(`Supabase - Connection attempt ${attempts}/${maxAttempts}...`);
    // Wait for 1 second before retrying
    await new Promise(resolve => setTimeout(resolve, 1000));
    isConnected = await checkConnection();
    attempts++;
  }
  
  console.log(`Supabase - Connection ${isConnected ? 'established' : 'failed'} after ${attempts} attempts`);
  return isConnected;
};
