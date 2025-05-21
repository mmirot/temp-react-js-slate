
import { supabase } from './client';
import { clearInvalidCredentials, saveCredentialsToCache } from './credentialUtils';
import { checkConnection } from './connectionCheck';

/**
 * Attempt to reconnect to Supabase
 * @returns {Promise<boolean>} True if reconnection was successful
 */
export const reconnect = async () => {
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
        // Instead, try to re-initialize the client
        return await checkConnection();
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
    
    return await checkConnection();
  } catch (error) {
    console.error('Supabase - Reconnection error:', error);
    return false;
  }
};
