import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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
  throw new Error('Missing Supabase environment variables. Please click the "Connect to Supabase" button in the top right to set up your connection.');
}

// Ensure the URL is properly formatted
const formattedUrl = supabaseUrl.trim().replace(/\/$/, '');

export const supabase = createClient(formattedUrl, supabaseAnonKey, supabaseOptions);

// Add a helper function to check connection
export const checkConnection = async () => {
  try {
    const { data, error } = await supabase.from('stain_submissions').select('id').limit(1);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Supabase connection error:', error);
    return false;
  }
};

export { supabase as default };