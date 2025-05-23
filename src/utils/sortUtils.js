
// Helper functions for sorting data
export const getSortedData = (data, sortConfig) => {
  if (!data || !sortConfig || !sortConfig.key) return data;
  
  const sortedData = [...data];
  sortedData.sort((a, b) => {
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    // Handle nested properties like 'new_stain_list.name'
    if (sortConfig.key.includes('.')) {
      const keys = sortConfig.key.split('.');
      aValue = keys.reduce((obj, key) => (obj && obj[key] !== undefined) ? obj[key] : null, a);
      bValue = keys.reduce((obj, key) => (obj && obj[key] !== undefined) ? obj[key] : null, b);
    }

    if (!aValue) return 1;
    if (!bValue) return -1;

    if (sortConfig.key.includes('date')) {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });
  
  return sortedData;
};
