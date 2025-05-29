// Utility functions for CSV handling

/**
 * Convert array of objects to CSV string
 * @param {Array} data - Array of objects to convert
 * @param {Array} headers - Array of header objects with label and key properties
 * @returns {string} CSV string
 */
export const convertToCSV = (data, headers) => {
  if (!data || !data.length || !headers || !headers.length) return '';

  // Create header row
  const headerRow = headers.map(h => `"${h.label}"`).join(',');

  // Create data rows
  const rows = data.map(item => {
    return headers.map(header => {
      // Handle nested properties (e.g., 'new_stain_list.name')
      let value = header.key.split('.').reduce((obj, key) => obj?.[key], item);
      value = value === null || value === undefined ? '' : value;
      // Escape quotes and wrap in quotes
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(',');
  });

  return [headerRow, ...rows].join('\n');
};

/**
 * Download CSV string as file
 * @param {string} csvString - CSV content
 * @param {string} filename - Name for downloaded file
 */
export const downloadCSV = (csvString, filename) => {
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  // Create downloadable link
  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};