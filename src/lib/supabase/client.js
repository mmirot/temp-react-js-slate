
import { createClient } from '@supabase/supabase-js';
import { getCachedCredentials, saveCredentialsToCache } from './credentialUtils';
import { createClientOptions, updateConnectionAttempt } from './connectionUtils';

// Try to use environment variables first, then fallback to cached credentials, then use placeholders
const cached = getCachedCredentials();
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || (cached?.url) || 'https://pbsgsljpqrwrfeddazjx.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || (cached?.key) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBic2dzbGpwcXJ3cmZlZGRhemp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MTc1OTgsImV4cCI6MjA2MjQ5MzU5OH0.qh3LepTmJrRBUaqyVU5Qn3dNdPD8eqYtIz6iVqsa84c';

// Save valid credentials to localStorage when they are available
saveCredentialsToCache(supabaseUrl, supabaseAnonKey);

// Log connection attempt
console.log('Supabase - Initializing client connection');
console.log('Supabase - Using URL:', supabaseUrl ? (supabaseUrl === 'https://placeholder.supabase.co' ? 'Using placeholder URL' : 'URL provided') : 'URL missing');

// Check if we have real credentials or placeholders
const hasRealCredentials = supabaseUrl !== 'https://placeholder.supabase.co' && supabaseAnonKey !== 'placeholder-key';

if (!hasRealCredentials) {
  console.warn('Using placeholder Supabase credentials. Please click the "Connect to Supabase" button in the top right to set up your connection.');
}

// Ensure the URL is properly formatted
const formattedUrl = supabaseUrl.trim().replace(/\/$/, '');
console.log('Supabase - Connecting to Supabase instance:', formattedUrl.substring(0, formattedUrl.indexOf('.') + 1) + '***');

// Create Supabase client configuration options
const supabaseOptions = createClientOptions();

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

// Update connection attempt timestamp
updateConnectionAttempt();

export { supabase, hasRealCredentials };
