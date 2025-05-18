/*
  # Clear stain submissions log
  
  1. Changes
    - Safely truncate stain_submissions table while preserving the table structure
*/

DO $$ 
BEGIN
  DELETE FROM stain_submissions;
END $$;