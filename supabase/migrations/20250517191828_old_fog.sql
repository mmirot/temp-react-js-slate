/*
  # Clear Stain QC submissions

  1. Changes
    - Truncates the stain_submissions table to remove all data
    - Maintains table structure and relationships
*/

-- Clear all submissions while maintaining table structure
TRUNCATE TABLE stain_submissions RESTART IDENTITY CASCADE;