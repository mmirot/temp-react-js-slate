
// Helper functions for date formatting and validation
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  
  try {
    // For PostgreSQL date format like '2025-05-19'
    if (typeof dateString === 'string' && dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // To prevent date manipulation, we manually construct the date
      // without applying timezone conversion
      const parts = dateString.split('-');
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);
      
      // Format as MM/DD/YYYY or your preferred format
      return `${month}/${day}/${year}`;
    }
    
    // Fallback for other date formats
    return new Date(dateString).toLocaleDateString();
  } catch (error) {
    console.error('Error formatting date:', error, dateString);
    return dateString || '-';
  }
};

// Get today's date in YYYY-MM-DD format using local timezone
export const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

// Check if a date is in the future
export const isDateInFuture = (dateString) => {
  const today = getTodayDateString();
  return dateString > today;
};
