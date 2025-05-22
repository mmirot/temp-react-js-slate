
// Import and re-export the database client
import { supabase, hasRealCredentials } from './supabase/client';
import { checkConnection } from './supabase/connectionCheck';
import { reconnect } from './supabase/reconnect';

// Log environment variable presence for debugging
console.log('Supabase URL exists:', !!import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
console.log('Using Supabase URL:', import.meta.env.VITE_SUPABASE_URL || '(fallback URL)');

// Export everything
export { 
  supabase, 
  hasRealCredentials,
  checkConnection,
  reconnect
};
