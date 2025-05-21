
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log connection attempt
console.log('Supabase - Initializing client connection');
console.log('Supabase - Using URL:', supabaseUrl ? 'URL provided' : 'URL missing');

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

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please click the "Connect to Supabase" button in the top right to set up your connection.');
  throw new Error('Missing Supabase environment variables. Please click the "Connect to Supabase" button in the top right to set up your connection.');
}

// Ensure the URL is properly formatted
const formattedUrl = supabaseUrl.trim().replace(/\/$/, '');
console.log('Supabase - Connecting to Supabase instance');

export const supabase = createClient(formattedUrl, supabaseAnonKey, supabaseOptions);
console.log('Supabase - Client created successfully');

// Add a helper function to check connection
export const checkConnection = async () => {
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

// Test the connection immediately
checkConnection().then(isConnected => {
  console.log('Supabase connection status:', isConnected ? 'Connected' : 'Failed');
});

export { supabase as default };
