/*
  # Update RLS policies for non-gyn submissions

  1. Changes
    - Add policy to allow deletion of all records for workload log
    - Keep existing policies for other operations
    - Ensure proper access control for data management

  2. Security
    - Maintains public access for basic operations
    - Adds specific policy for log deletion
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

  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'non_gyn_submissions' 
    AND policyname = 'Allow deletion of all submissions'
  ) THEN
    DROP POLICY "Allow deletion of all submissions" ON non_gyn_submissions;
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

-- Policy for deleting pending submissions (not yet screened)
CREATE POLICY "Allow deletion of pending submissions"
  ON non_gyn_submissions
  FOR DELETE
  TO public
  USING (date_screened IS NULL);

-- Policy for deleting all submissions (workload log)
CREATE POLICY "Allow deletion of all submissions"
  ON non_gyn_submissions
  FOR DELETE
  TO public
  USING (true);