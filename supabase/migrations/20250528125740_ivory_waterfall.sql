/*
  # Add RLS policies for non_gyn_submissions table

  1. Changes
    - Enable RLS on non_gyn_submissions table
    - Add policies for:
      - Select: Allow authenticated users to read all submissions
      - Insert: Allow authenticated users to create submissions
      - Update: Allow authenticated users to update submissions
      - Delete: Allow authenticated users to delete submissions

  2. Security
    - Ensures authenticated users can perform all necessary operations
    - Maintains data access control through authentication
*/

-- Enable RLS
ALTER TABLE non_gyn_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users"
  ON non_gyn_submissions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON non_gyn_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users"
  ON non_gyn_submissions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users"
  ON non_gyn_submissions
  FOR DELETE
  TO authenticated
  USING (true);