
import { supabase, hasRealCredentials } from './client';
import { updateConnectionAttempt, getLastConnectionAttempt } from './connectionUtils';

/**
 * Check if the Supabase connection is working
 * @returns {Promise<boolean>} True if the connection is working
 */
export const checkConnection = async () => {
  updateConnectionAttempt();
  
  if (!hasRealCredentials) {
    console.log('Supabase - Connection test skipped (using placeholder credentials)');
    return false;
  }
  
  try {
    console.log('Supabase - Testing database connection');
    // First, check if auth is working
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (authError) {
      console.warn('Supabase - Auth connection issue:', authError.message);
      // Auth issues don't necessarily mean the database is unreachable
    } else {
      console.log('Supabase - Auth connection ok:', authData.session ? 'Session exists' : 'No active session');
    }
    
    // Try multiple tables in case one fails due to permissions
    let isConnected = false;
    
    // Try stain_submissions first
    try {
      const { error } = await supabase.from('stain_submissions').select('id').limit(1);
      if (!error) {
        console.log('Supabase - Connection test successful with stain_submissions');
        isConnected = true;
      }
    } catch (tableError) {
      console.log('Supabase - Could not access stain_submissions, trying another table');
    }
    
    // If stain_submissions failed, try users
    if (!isConnected) {
      try {
        const { error } = await supabase.from('users').select('id').limit(1);
        if (!error) {
          console.log('Supabase - Connection test successful with users table');
          isConnected = true;
        }
      } catch (tableError) {
        console.log('Supabase - Could not access users, trying another approach');
      }
    }
    
    // If table queries fail, just check if we can access the API at all
    if (!isConnected) {
      try {
        const { error } = await supabase.rpc('get_session');
        if (!error) {
          console.log('Supabase - Connection test successful with RPC');
          isConnected = true;
        }
      } catch (rpcError) {
        console.log('Supabase - RPC test failed');
      }
    }
    
    // Final fallback - just check if auth is working
    if (!isConnected && !authError) {
      console.log('Supabase - Auth is working but database access is limited');
      isConnected = true; // At least auth is working
    }
    
    if (isConnected) {
      return true;
    }
    
    console.error('Supabase - All connection tests failed');
    return false;
  } catch (error) {
    console.error('Supabase connection error:', error);
    
    // Attempt to detect specific issues
    if (error.message?.includes('Failed to fetch')) {
      console.error('Supabase - Network error - check your internet connection');
    } else if (error.code === 'PGRST301') {
      console.log('Supabase - Connection successful but permissions restricted');
      return true; // Connection works but permissions are limited
    }
    
    return false;
  }
};
