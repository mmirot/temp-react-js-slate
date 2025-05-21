
import { supabase, reconnect } from '../../lib/supabaseClient';
import toast from 'react-hot-toast';

export function useConnectionManagement() {
  const retryConnection = async () => {
    try {
      console.log('AuthContext - Attempting to retry connection');
      const result = await reconnect();
      
      if (result) {
        toast.success('Connection to Supabase restored!');
        // Reload auth state
        const { data, error } = await supabase.auth.getSession();
        if (!error) {
          return true;
        }
      } else {
        toast.error('Failed to reconnect to Supabase.');
      }
      
      return result;
    } catch (error) {
      console.error('AuthContext - Retry connection error:', error);
      toast.error('Failed to retry connection: ' + error.message);
      return false;
    }
  };

  return {
    retryConnection
  };
}
