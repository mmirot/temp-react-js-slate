/*
  # Pathology Stain QC Schema

  1. New Tables
    - `stains`
      - `id` (uuid, primary key)
      - `name` (text) - Name of the stain
      - `created_at` (timestamp)
    
    - `stain_submissions`
      - `id` (uuid, primary key)
      - `stain_id` (uuid, references stains)
      - `date_prepared` (date)
      - `tech_initials` (text)
      - `stain_qc` (text) - PASS or FAIL
      - `path_initials` (text)
      - `date_qc` (date)
      - `comments` (text)
      - `repeat_stain` (boolean)
      - `created_at` (timestamp)
      
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create stains table
CREATE TABLE IF NOT EXISTS stains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create stain submissions table
CREATE TABLE IF NOT EXISTS stain_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stain_id uuid REFERENCES stains(id),
  date_prepared date NOT NULL,
  tech_initials text NOT NULL,
  stain_qc text CHECK (stain_qc IN ('PASS', 'FAIL')),
  path_initials text,
  date_qc date,
  comments text,
  repeat_stain boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE stains ENABLE ROW LEVEL SECURITY;
ALTER TABLE stain_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users to read stains"
  ON stains
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read stain submissions"
  ON stain_submissions
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert stain submissions"
  ON stain_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update their submissions"
  ON stain_submissions
  FOR UPDATE
  TO authenticated
  USING (tech_initials = current_user OR path_initials = current_user)
  WITH CHECK (tech_initials = current_user OR path_initials = current_user);

-- Insert initial stain types
INSERT INTO stains (name) VALUES
  ('HE'),
  ('PAS'),
  ('GMS'),
  ('AFB'),
  ('GRAM');