
import { createClient } from '@supabase/supabase-js';
import { getCachedCredentials, saveCredentialsToCache } from './credentialUtils';
import { createClientOptions, updateConnectionAttempt } from './connectionUtils';

// Get environment variables
const environmentUrl = import.meta.env.VITE_SUPABASE_URL;
const environmentKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Try to use environment variables first, then fallback to cached credentials, then use placeholders
const cached = getCachedCredentials();
const supabaseUrl = environmentUrl || (cached?.url) || 'https://placeholder.supabase.co';
const supabaseAnonKey = environmentKey || (cached?.key) || 'placeholder-key';

// Save valid credentials to localStorage when they are available
if (environmentUrl && environmentKey) {
  console.log('Supabase - Using environment variables');
  saveCredentialsToCache(environmentUrl, environmentKey);
} else if (cached?.url && cached?.key) {
  console.log('Supabase - Using cached credentials');
} else {
  console.warn('Supabase - No valid credentials found. Using placeholders.');
}

// Log connection attempt
console.log('Supabase - Initializing client connection');
console.log('Supabase - URL status:', supabaseUrl ? (supabaseUrl === 'https://placeholder.supabase.co' ? 'Using placeholder URL' : 'URL provided') : 'URL missing');

// Check if we have real credentials or placeholders
const hasRealCredentials = supabaseUrl !== 'https://placeholder.supabase.co' && supabaseAnonKey !== 'placeholder-key';

if (!hasRealCredentials) {
  console.warn('Using placeholder Supabase credentials. Please check your environment variables or connect to Supabase.');
}

// Ensure the URL is properly formatted
const formattedUrl = supabaseUrl.trim().replace(/\/$/, '');
console.log('Supabase - Connecting to Supabase instance:', formattedUrl.substring(0, formattedUrl.indexOf('.') + 1) + '***');

// Create Supabase client configuration options with auth disabled
const supabaseOptions = {
  ...createClientOptions(),
  auth: {
    ...createClientOptions().auth,
    autoRefreshToken: false, // Disable auto refreshing as we're using Clerk
    persistSession: false,   // Don't persist sessions as we're using Clerk
  }
};

// Attempt to create the Supabase client with error handling
let supabase;

try {
  supabase = createClient(formattedUrl, supabaseAnonKey, supabaseOptions);
  console.log('Supabase - Client created for database operations only (auth disabled)');
} catch (error) {
  console.error('Supabase - Failed to create client:', error);
  // Create fallback client with placeholder values to prevent crashes
  supabase = createClient('https://placeholder.supabase.co', 'placeholder-key', supabaseOptions);
}

// Update connection attempt timestamp
updateConnectionAttempt();

export { supabase, hasRealCredentials };
