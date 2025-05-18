/*
  # Add UUID primary key to Users table

  1. Changes
    - Add UUID column 'id' if it doesn't exist
    - Generate UUIDs for any existing rows
    - Make id column NOT NULL
    - Ensure primary key constraint exists
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

-- Drop existing primary key if it exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'users_pkey'
    AND table_name = 'Users'
  ) THEN
    ALTER TABLE "Users" DROP CONSTRAINT users_pkey;
  END IF;
END $$;

-- Add primary key constraint
ALTER TABLE "Users" ADD PRIMARY KEY (id);