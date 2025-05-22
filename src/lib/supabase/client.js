
import { createClient } from '@supabase/supabase-js';
import { getCachedCredentials, saveCredentialsToCache } from './credentialUtils';
import { createClientOptions, updateConnectionAttempt } from './connectionUtils';

// Get environment variables
const environmentUrl = import.meta.env.VITE_SUPABASE_URL;
const environmentKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log environment variable presence for debugging
console.log('Supabase - Environment URL exists:', !!environmentUrl);
console.log('Supabase - Environment key exists:', !!environmentKey);

// Try to use environment variables first, then fallback to cached credentials, then use placeholders
const cached = getCachedCredentials();
const supabaseUrl = environmentUrl || (cached?.url) || 'https://pbsgsljpqrwrfeddazjx.supabase.co';
const supabaseAnonKey = environmentKey || (cached?.key) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBic2dzbGpwcXJ3cmZlZGRhemp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MTc1OTgsImV4cCI6MjA2MjQ5MzU5OH0.qh3LepTmJrRBUaqyVU5Qn3dNdPD8eqYtIz6iVqsa84c';

// Save valid credentials to localStorage when they are available
if (environmentUrl && environmentKey) {
  console.log('Supabase - Using environment variables');
  saveCredentialsToCache(environmentUrl, environmentKey);
} else if (cached?.url && cached?.key) {
  console.log('Supabase - Using cached credentials');
} else {
  console.log('Supabase - Using hardcoded credentials');
}

// Log actual URL being used (without exposing the full key)
console.log('Supabase - Connecting to:', supabaseUrl);
console.log('Supabase - Using anon key:', supabaseAnonKey.substring(0, 10) + '...');

// Check if we have real credentials or placeholders
const hasRealCredentials = supabaseUrl !== 'https://placeholder.supabase.co' && supabaseAnonKey !== 'placeholder-key';

// Ensure the URL is properly formatted
const formattedUrl = supabaseUrl.trim().replace(/\/$/, '');

// Create Supabase client with proper persistence settings
const supabaseOptions = {
  ...createClientOptions(),
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: globalThis.localStorage
  }
};

// Attempt to create the Supabase client with error handling
let supabase;

try {
  supabase = createClient(formattedUrl, supabaseAnonKey, supabaseOptions);
  console.log('Supabase - Client created successfully for database operations');
} catch (error) {
  console.error('Supabase - Failed to create client:', error);
  // Create fallback client with placeholder values to prevent crashes
  supabase = createClient('https://placeholder.supabase.co', 'placeholder-key', supabaseOptions);
}

// Update connection attempt timestamp
updateConnectionAttempt();

export { supabase, hasRealCredentials };
