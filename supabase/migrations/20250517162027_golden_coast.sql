/*
  # Disable RLS policies for testing

  1. Changes
    - Disable RLS on new_stain_list and stain_submissions tables
    - Drop existing policies
*/

-- Disable RLS on tables
ALTER TABLE new_stain_list DISABLE ROW LEVEL SECURITY;
ALTER TABLE stain_submissions DISABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON new_stain_list;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON stain_submissions;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON stain_submissions;
DROP POLICY IF EXISTS "Allow authenticated users to read stains" ON new_stain_list;
DROP POLICY IF EXISTS "Allow authenticated users to read stain submissions" ON stain_submissions;
DROP POLICY IF EXISTS "Allow authenticated users to insert stain submissions" ON stain_submissions;
DROP POLICY IF EXISTS "Allow authenticated users to update their submissions" ON stain_submissions;