
import { supabase } from './client';
import { clearInvalidCredentials } from './credentialUtils';
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
    console.log('Supabase - Detected new credentials, reloading page to apply them');
    try {
      localStorage.setItem('supabase_credentials', JSON.stringify({ 
        url: newUrl, 
        key: newKey,
        timestamp: Date.now()
      }));
      window.location.reload();
      return true;
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
