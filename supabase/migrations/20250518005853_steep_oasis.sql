/*
  # Add user preferences columns
  
  1. Changes
    - Add use_email column with default 'yes'
    - Add use_cell_phone column with default 'no'
    - Update existing rows with default values
*/

-- Add preference columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Users' AND column_name = 'use_email'
  ) THEN
    ALTER TABLE "Users" ADD COLUMN use_email text DEFAULT 'yes';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Users' AND column_name = 'use_cell_phone'
  ) THEN
    ALTER TABLE "Users" ADD COLUMN use_cell_phone text DEFAULT 'no';
  END IF;
END $$;

-- Update any existing rows that might have NULL values
UPDATE "Users" 
SET use_email = 'yes', 
    use_cell_phone = 'no' 
WHERE use_email IS NULL 
   OR use_cell_phone IS NULL;