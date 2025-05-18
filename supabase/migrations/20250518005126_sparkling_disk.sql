/*
  # Add UUID primary key to Users table

  1. Changes
    - Add id column with UUID type and primary key constraint
    - Set default value to auto-generate UUIDs
    - Update existing rows with new UUIDs
  
  2. Security
    - No changes to existing security policies
*/

-- Add UUID column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Users' AND column_name = 'id'
  ) THEN
    ALTER TABLE "Users" ADD COLUMN id uuid DEFAULT gen_random_uuid();
  END IF;
END $$;

-- Update any existing rows with new UUIDs if id is null
UPDATE "Users" SET id = gen_random_uuid() WHERE id IS NULL;

-- Make id column NOT NULL after ensuring all rows have values
ALTER TABLE "Users" ALTER COLUMN id SET NOT NULL;

-- Add primary key constraint if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'Users_pkey'
    AND table_name = 'Users'
  ) THEN
    ALTER TABLE "Users" ADD CONSTRAINT Users_pkey PRIMARY KEY (id);
  END IF;
END $$;