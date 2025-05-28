/*
  # Fix RLS Policies for Non-Gyn Submissions

  1. Changes
    - Safely drop and recreate RLS policies for non_gyn_submissions table
    - Add proper policy checks to prevent duplicates
    - Ensure proper access control for public operations

  2. Security
    - Enable RLS on non_gyn_submissions table
    - Add policies for SELECT, INSERT, UPDATE, and DELETE operations
    - Restrict deletion to pending submissions only
*/

DO $$ BEGIN
  -- First disable RLS to reset policies
  ALTER TABLE non_gyn_submissions DISABLE ROW LEVEL SECURITY;

  -- Drop existing policies if they exist
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
CREATE POLICY "Allow anyone to read all submissions"
  ON non_gyn_submissions
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow anyone to insert submissions"
  ON non_gyn_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow anyone to update pending submissions"
  ON non_gyn_submissions
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow deletion of pending submissions"
  ON non_gyn_submissions
  FOR DELETE
  TO public
  USING (date_screened IS NULL);