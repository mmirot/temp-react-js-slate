
import { createClient } from '@supabase/supabase-js';

// Check for cached credentials in localStorage with validation
const getCachedCredentials = () => {
  try {
    const cached = localStorage.getItem('supabase_credentials');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && typeof parsed.url === 'string' && typeof parsed.key === 'string' &&
          parsed.url.includes('supabase.co') && parsed.key.length > 10) {
        console.log('Supabase - Found cached credentials');
        // Add timestamp check to validate cache
        if (parsed.timestamp && (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000)) {
          return parsed;
        } else {
          console.log('Supabase - Cached credentials expired, clearing cache');
          localStorage.removeItem('supabase_credentials');
        }
      } else {
        console.warn('Supabase - Invalid cached credentials format, clearing cache');
        localStorage.removeItem('supabase_credentials');
      }
    }
  } catch (error) {
    console.warn('Supabase - Error reading cached credentials:', error);
    // Clear potentially corrupt data
    try {
      localStorage.removeItem('supabase_credentials');
    } catch (e) {
      console.error('Supabase - Failed to clear cached credentials:', e);
    }
  }
  return null;
};

// Clear environment variable values from session storage when they become invalid
const clearInvalidCredentials = () => {
  try {
    localStorage.removeItem('supabase_credentials');
    console.log('Supabase - Cleared invalid credentials from cache');
  } catch (error) {
    console.warn('Supabase - Failed to clear credentials cache:', error);
  }
};

// Try to use environment variables first, then fallback to cached credentials, then use placeholders
const cached = getCachedCredentials();
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || (cached?.url) || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || (cached?.key) || 'placeholder-key';

// Save valid credentials to localStorage when they are available
if (supabaseUrl !== 'https://placeholder.supabase.co' && supabaseAnonKey !== 'placeholder-key') {
  try {
    localStorage.setItem('supabase_credentials', JSON.stringify({ 
      url: supabaseUrl, 
      key: supabaseAnonKey,
      timestamp: Date.now()
    }));
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
    // Removed hardcoded domain to allow for dynamic domain assignment
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

// Attempt to create the Supabase client with error handling
let supabase;

try {
  supabase = createClient(formattedUrl, supabaseAnonKey, supabaseOptions);
  console.log('Supabase - Client created with', hasRealCredentials ? 'actual credentials' : 'placeholder credentials');
} catch (error) {
  console.error('Supabase - Failed to create client:', error);
  // Create fallback client with placeholder values to prevent crashes
  supabase = createClient('https://placeholder.supabase.co', 'placeholder-key', supabaseOptions);
}

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

// Add a reconnect function that can be called from anywhere
export const reconnect = async () => {
  console.log('Supabase - Attempting to reconnect...');
  
  // Check for updated environment variables
  const newUrl = import.meta.env.VITE_SUPABASE_URL;
  const newKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  // If we have new credentials from env vars, use them
  if (newUrl && newKey && (newUrl !== supabaseUrl || newKey !== supabaseAnonKey)) {
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

// Periodically check connection in the background
let connectionCheckInterval;
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

export { supabase as default };
