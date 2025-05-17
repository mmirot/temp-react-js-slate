/*
  # Fresh start for stain tracking system

  1. New Tables
    - `new_stain_list`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `created_at` (timestamp)
    - `stain_submissions`
      - `id` (uuid, primary key) 
      - `stain_id` (uuid, references new_stain_list)
      - Other fields remain unchanged

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Drop existing tables to start fresh
DROP TABLE IF EXISTS stain_submissions;
DROP TABLE IF EXISTS new_stain_list;
DROP TABLE IF EXISTS stains;

-- Create new_stain_list table
CREATE TABLE new_stain_list (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create stain_submissions table
CREATE TABLE stain_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stain_id uuid REFERENCES new_stain_list(id),
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
ALTER TABLE new_stain_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE stain_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users to read stains"
  ON new_stain_list
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

-- Insert initial stain list
INSERT INTO new_stain_list (name) VALUES
  ('H&E'),
  ('PAS'),
  ('GMS'),
  ('AFB'),
  ('Gram'),
  ('CD3'),
  ('CD20'),
  ('CD30'),
  ('CD45'),
  ('CD68'),
  ('S100'),
  ('AE1/AE3'),
  ('CAM5.2'),
  ('CK7'),
  ('CK20'),
  ('Ki67'),
  ('P53'),
  ('P63'),
  ('TTF1'),
  ('Iron'),
  ('Giemsa'),
  ('Trichrome'),
  ('Congo Red'),
  ('Reticulin'),
  ('Elastic'),
  ('Mucicarmine'),
  ('Alcian Blue'),
  ('Von Kossa'),
  ('Oil Red O')
ON CONFLICT (name) DO NOTHING;