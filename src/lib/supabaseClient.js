
import { createClient } from '@supabase/supabase-js';

// Check for cached credentials in localStorage
const getCachedCredentials = () => {
  try {
    const cached = localStorage.getItem('supabase_credentials');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.url && parsed.key) {
        console.log('Supabase - Found cached credentials');
        return parsed;
      }
    }
  } catch (error) {
    console.warn('Supabase - Error reading cached credentials:', error);
  }
  return null;
};

// Try to use environment variables first, then fallback to cached credentials, then use placeholders
const cached = getCachedCredentials();
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || (cached?.url) || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || (cached?.key) || 'placeholder-key';

// Save valid credentials to localStorage when they are available
if (supabaseUrl !== 'https://placeholder.supabase.co' && supabaseAnonKey !== 'placeholder-key') {
  try {
    localStorage.setItem('supabase_credentials', JSON.stringify({ url: supabaseUrl, key: supabaseAnonKey }));
    console.log('Supabase - Cached credentials to localStorage');
  } catch (error) {
    console.warn('Supabase - Failed to cache credentials:', error);
  }
}

// Log connection attempt
console.log('Supabase - Initializing client connection');
console.log('Supabase - Using URL:', supabaseUrl ? (supabaseUrl === 'https://placeholder.supabase.co' ? 'Using placeholder URL' : 'URL provided') : 'URL missing');

// Configuration options for Supabase client
const supabaseOptions = {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'supabase.auth.token',
    detectSessionInUrl: true,
    flowType: 'pkce',
    // Remove hardcoded domain to allow for dynamic assignment
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js/2.x',
    },
  },
  db: {
    schema: 'public',
  },
  catchNetworkErrors: true,
};

// Check if we have real environment variables or placeholders
const hasRealCredentials = supabaseUrl !== 'https://placeholder.supabase.co' && supabaseAnonKey !== 'placeholder-key';

if (!hasRealCredentials) {
  console.warn('Using placeholder Supabase credentials. Please click the "Connect to Supabase" button in the top right to set up your connection.');
  // Don't throw an error here - let the app continue loading with limited functionality
}

// Ensure the URL is properly formatted
const formattedUrl = supabaseUrl.trim().replace(/\/$/, '');
console.log('Supabase - Connecting to Supabase instance:', formattedUrl.substring(0, formattedUrl.indexOf('.') + 1) + '***');

// Add a connection timestamp to detect stale connections
let lastConnectionAttempt = Date.now();
export const getLastConnectionAttempt = () => lastConnectionAttempt;

export const supabase = createClient(formattedUrl, supabaseAnonKey, supabaseOptions);
console.log('Supabase - Client created with', hasRealCredentials ? 'actual credentials' : 'placeholder credentials');

// Add a helper function to check connection
export const checkConnection = async () => {
  lastConnectionAttempt = Date.now();
  
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
    
    // Then check database access
    const { data, error } = await supabase.from('stain_submissions').select('id').limit(1);
    if (error) {
      console.error('Supabase - Database connection error:', error.message);
      
      // Check if it's a permissions issue rather than connection issue
      if (error.code === 'PGRST301' || error.message.includes('permission denied')) {
        console.log('Supabase - This appears to be a permissions issue, not a connection issue');
        return true; // Connection works, but permissions are restricted
      }
      
      throw error;
    }
    
    console.log('Supabase - Connection test successful', data);
    return true;
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

// Add a reconnect function that can be called from anywhere
export const reconnect = async () => {
  console.log('Supabase - Attempting to reconnect...');
  
  // Check for updated environment variables
  const newUrl = import.meta.env.VITE_SUPABASE_URL;
  const newKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (newUrl && newKey && (newUrl !== supabaseUrl || newKey !== supabaseAnonKey)) {
    console.log('Supabase - Detected new credentials, reloading page to apply them');
    localStorage.setItem('supabase_credentials', JSON.stringify({ url: newUrl, key: newKey }));
    window.location.reload();
    return true;
  }
  
  return await checkConnection();
};

// Test the connection immediately only if we have real credentials
if (hasRealCredentials) {
  checkConnection().then(isConnected => {
    console.log('Supabase connection status:', isConnected ? 'Connected' : 'Failed');
  });
}

export { supabase as default };
