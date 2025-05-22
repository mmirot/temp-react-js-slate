
import { createClient } from '@supabase/supabase-js';
import { getCachedCredentials, saveCredentialsToCache } from './credentialUtils';
import { createClientOptions, updateConnectionAttempt } from './connectionUtils';

// Get environment variables
const environmentUrl = import.meta.env.VITE_SUPABASE_URL;
const environmentKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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

// Log connection attempt with actual values being used
console.log('Supabase - Connecting to:', supabaseUrl);

// Check if we have real credentials or placeholders
const hasRealCredentials = supabaseUrl !== 'https://placeholder.supabase.co' && supabaseAnonKey !== 'placeholder-key';

// Ensure the URL is properly formatted
const formattedUrl = supabaseUrl.trim().replace(/\/$/, '');

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
  console.log('Supabase - Client created successfully for database operations');
} catch (error) {
  console.error('Supabase - Failed to create client:', error);
  // Create fallback client with placeholder values to prevent crashes
  supabase = createClient('https://placeholder.supabase.co', 'placeholder-key', supabaseOptions);
}

// Update connection attempt timestamp
updateConnectionAttempt();

export { supabase, hasRealCredentials };
