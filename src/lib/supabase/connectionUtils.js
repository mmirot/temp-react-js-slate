
// Utility functions for checking and managing Supabase connection

let lastConnectionAttempt = Date.now();

/**
 * Get the timestamp of the last connection attempt
 * @returns {number} Timestamp of the last connection attempt
 */
export const getLastConnectionAttempt = () => lastConnectionAttempt;

/**
 * Updates the last connection attempt timestamp
 */
export const updateConnectionAttempt = () => {
  lastConnectionAttempt = Date.now();
  return lastConnectionAttempt;
};

/**
 * Create Supabase client configuration options
 * @returns {Object} Supabase client configuration options
 */
export const createClientOptions = () => ({
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'supabase.auth.token',
    detectSessionInUrl: true,
    flowType: 'pkce',
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
});
