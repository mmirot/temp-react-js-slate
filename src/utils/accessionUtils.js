
// Utility functions for accession number handling
import { getTodayDateString } from './dateUtils';

// Generate CN prefix based on date (CNyy- format)
export const generateAccessionPrefix = (dateString = null) => {
  const date = dateString ? new Date(dateString) : new Date();
  const year = date.getFullYear();
  const lastTwoDigits = year.toString().slice(-2);
  return `CN${lastTwoDigits}-`;
};
