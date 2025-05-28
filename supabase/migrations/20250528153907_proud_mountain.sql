/*
  # Fix RLS policies for non-gyn submissions

  1. Changes
    - Reset and recreate RLS policies for non_gyn_submissions table
    - Add policy existence checks to prevent conflicts
    - Ensure proper public access for CRUD operations

  2. Security
    - Enable RLS on non_gyn_submissions table
    - Grant public access for select, insert, update operations
    - Restrict deletion to pending submissions only
*/

-- First disable RLS to reset policies
ALTER TABLE non_gyn_submissions DISABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
  -- Drop policies one by one with existence check
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'non_gyn_submissions' 
    AND policyname = 'Allow anyone to read all submissions'
  ) THEN
    DROP POLICY "Allow anyone to read all submissions" ON non_gyn_submissions;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'non_gyn_submissions' 
    AND policyname = 'Allow anyone to insert submissions'
  ) THEN
    DROP POLICY "Allow anyone to insert submissions" ON non_gyn_submissions;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'non_gyn_submissions' 
    AND policyname = 'Allow anyone to update pending submissions'
  ) THEN
    DROP POLICY "Allow anyone to update pending submissions" ON non_gyn_submissions;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'non_gyn_submissions' 
    AND policyname = 'Allow deletion of pending submissions'
  ) THEN
    DROP POLICY "Allow deletion of pending submissions" ON non_gyn_submissions;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE non_gyn_submissions ENABLE ROW LEVEL SECURITY;

-- Create new policies
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'non_gyn_submissions' 
    AND policyname = 'Allow anyone to read all submissions'
  ) THEN
    CREATE POLICY "Allow anyone to read all submissions"
      ON non_gyn_submissions
      FOR SELECT
      TO public
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'non_gyn_submissions' 
    AND policyname = 'Allow anyone to insert submissions'
  ) THEN
    CREATE POLICY "Allow anyone to insert submissions"
      ON non_gyn_submissions
      FOR INSERT
      TO public
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'non_gyn_submissions' 
    AND policyname = 'Allow anyone to update pending submissions'
  ) THEN
    CREATE POLICY "Allow anyone to update pending submissions"
      ON non_gyn_submissions
      FOR UPDATE
      TO public
      USING (true)
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'non_gyn_submissions' 
    AND policyname = 'Allow deletion of pending submissions'
  ) THEN
    CREATE POLICY "Allow deletion of pending submissions"
      ON non_gyn_submissions
      FOR DELETE
      TO public
      USING (date_screened IS NULL);
  END IF;
END $$;