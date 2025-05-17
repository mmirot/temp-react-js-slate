/*
  # Drop stains table

  1. Changes
    - Drop the stains table
    - Update foreign key constraints in stain_submissions table
    - Update stain_submissions to reference new_stain_list

  2. Security
    - No changes to RLS policies needed
*/

-- First update the foreign key in stain_submissions
ALTER TABLE stain_submissions
DROP CONSTRAINT stain_submissions_stain_id_fkey;

-- Add new foreign key to new_stain_list
ALTER TABLE stain_submissions
ADD CONSTRAINT stain_submissions_stain_id_fkey
FOREIGN KEY (stain_id) REFERENCES new_stain_list(id);

-- Drop the old stains table
DROP TABLE IF EXISTS stains;