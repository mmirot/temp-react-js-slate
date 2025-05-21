
// Import and re-export all modules from individual files
import { supabase, hasRealCredentials } from './supabase/client';
import { checkConnection } from './supabase/connectionCheck';
import { reconnect } from './supabase/reconnect';

// Export everything
export { 
  supabase, 
  hasRealCredentials,
  checkConnection,
  reconnect
};
