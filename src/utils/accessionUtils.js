
// Utility functions for accession number handling
import { getTodayDateString } from './dateUtils';

// Generate CN prefix based on date (CNyy- format)
export const generateAccessionPrefix = (dateString = null) => {
  const date = dateString ? new Date(dateString) : new Date();
  const year = date.getFullYear();
  const lastTwoDigits = year.toString().slice(-2);
  return `CN${lastTwoDigits}-`;
};

// Parse range input like "001-005" or "001,003,005-007"
export const parseAccessionRange = (rangeInput, prefix) => {
  if (!rangeInput.trim()) return [];
  
  const accessionNumbers = [];
  const parts = rangeInput.split(',').map(part => part.trim());
  
  for (const part of parts) {
    if (part.includes('-')) {
      // Handle range like "001-005"
      const [start, end] = part.split('-').map(num => num.trim());
      const startNum = parseInt(start);
      const endNum = parseInt(end);
      
      if (isNaN(startNum) || isNaN(endNum) || startNum > endNum) {
        throw new Error(`Invalid range: ${part}`);
      }
      
      for (let i = startNum; i <= endNum; i++) {
        const paddedNum = i.toString().padStart(start.length, '0');
        accessionNumbers.push(`${prefix}${paddedNum}`);
      }
    } else {
      // Handle single number
      const num = parseInt(part);
      if (isNaN(num)) {
        throw new Error(`Invalid number: ${part}`);
      }
      accessionNumbers.push(`${prefix}${part}`);
    }
  }
  
  return accessionNumbers;
};

// Validate accession range input
export const validateAccessionRange = (rangeInput) => {
  if (!rangeInput.trim()) return false;
  
  try {
    const parts = rangeInput.split(',').map(part => part.trim());
    
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(num => num.trim());
        const startNum = parseInt(start);
        const endNum = parseInt(end);
        
        if (isNaN(startNum) || isNaN(endNum) || startNum > endNum) {
          return false;
        }
      } else {
        const num = parseInt(part);
        if (isNaN(num)) {
          return false;
        }
      }
    }
    
    return true;
  } catch (error) {
    return false;
  }
};
