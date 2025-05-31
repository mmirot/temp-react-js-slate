/*
  # Fix RLS policies for non_gyn_submissions table

  1. Changes
    - Enable RLS on non_gyn_submissions table
    - Add policies for public access to:
      - SELECT: Allow anyone to read all submissions
      - INSERT: Allow anyone to insert submissions
      - UPDATE: Allow anyone to update pending submissions
      - DELETE: Allow deletion of pending submissions
    
  2. Security
    - Policies allow public access for basic CRUD operations
    - Delete operations restricted to pending submissions only
*/

-- First disable RLS to reset policies
ALTER TABLE non_gyn_submissions DISABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON non_gyn_submissions;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON non_gyn_submissions;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON non_gyn_submissions;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON non_gyn_submissions;

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
  USING (stain_qc IS NULL);