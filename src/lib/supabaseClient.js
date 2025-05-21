
import { createClient } from '@supabase/supabase-js';

// Use fallback values if environment variables are not available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

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
    domain: 'svpathlab.com'
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
console.log('Supabase - Connecting to Supabase instance');

export const supabase = createClient(formattedUrl, supabaseAnonKey, supabaseOptions);
console.log('Supabase - Client created with', hasRealCredentials ? 'actual credentials' : 'placeholder credentials');

// Add a helper function to check connection
export const checkConnection = async () => {
  if (!hasRealCredentials) {
    console.log('Supabase - Connection test skipped (using placeholder credentials)');
    return false;
  }
  
  try {
    console.log('Supabase - Testing database connection');
    const { data, error } = await supabase.from('stain_submissions').select('id').limit(1);
    if (error) throw error;
    console.log('Supabase - Connection test successful', data);
    return true;
  } catch (error) {
    console.error('Supabase connection error:', error);
    return false;
  }
};

// Test the connection immediately only if we have real credentials
if (hasRealCredentials) {
  checkConnection().then(isConnected => {
    console.log('Supabase connection status:', isConnected ? 'Connected' : 'Failed');
  });
}

export { supabase as default };
