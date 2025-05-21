
// Helper functions for managing Supabase credentials

/**
 * Check for cached credentials in localStorage with validation
 * @returns {Object|null} The cached credentials or null if not found/invalid
 */
export const getCachedCredentials = () => {
  try {
    const cached = localStorage.getItem('supabase_credentials');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && typeof parsed.url === 'string' && typeof parsed.key === 'string' &&
          parsed.url.includes('supabase.co') && parsed.key.length > 10) {
        console.log('Supabase - Found cached credentials');
        // Add timestamp check to validate cache
        if (parsed.timestamp && (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000)) {
          return parsed;
        } else {
          console.log('Supabase - Cached credentials expired, clearing cache');
          localStorage.removeItem('supabase_credentials');
        }
      } else {
        console.warn('Supabase - Invalid cached credentials format, clearing cache');
        localStorage.removeItem('supabase_credentials');
      }
    }
  } catch (error) {
    console.warn('Supabase - Error reading cached credentials:', error);
    // Clear potentially corrupt data
    try {
      localStorage.removeItem('supabase_credentials');
    } catch (e) {
      console.error('Supabase - Failed to clear cached credentials:', e);
    }
  }
  return null;
};

/**
 * Clear environment variable values from session storage when they become invalid
 */
export const clearInvalidCredentials = () => {
  try {
    localStorage.removeItem('supabase_credentials');
    console.log('Supabase - Cleared invalid credentials from cache');
  } catch (error) {
    console.warn('Supabase - Failed to clear credentials cache:', error);
  }
};

/**
 * Save credentials to localStorage when they are available
 * @param {string} url - Supabase URL
 * @param {string} key - Supabase anon key
 * @returns {boolean} - Whether credentials were saved successfully
 */
export const saveCredentialsToCache = (url, key) => {
  if (url !== 'https://placeholder.supabase.co' && key !== 'placeholder-key') {
    try {
      localStorage.setItem('supabase_credentials', JSON.stringify({ 
        url, 
        key,
        timestamp: Date.now()
      }));
      console.log('Supabase - Cached credentials to localStorage');
      return true;
    } catch (error) {
      console.warn('Supabase - Failed to cache credentials:', error);
    }
  }
  return false;
};
