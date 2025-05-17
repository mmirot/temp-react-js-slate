/*
  # Create and populate new stains table

  1. New Tables
    - `new_stain_list`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `new_stain_list` table
    - Add policy for authenticated users to read stains
*/

-- Create the new stains table
CREATE TABLE IF NOT EXISTS new_stain_list (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE new_stain_list ENABLE ROW LEVEL SECURITY;

-- Create policy for reading stains
CREATE POLICY "Allow authenticated users to read stains"
  ON new_stain_list
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert the stains
INSERT INTO new_stain_list (name) VALUES
  ('HE'),
  ('CD20'),
  ('P63'),
  ('H&E'),
  ('Elastic'),
  ('Mucicarmine'),
  ('S100'),
  ('Alcian Blue'),
  ('Congo Red'),
  ('CK20'),
  ('CK7'),
  ('Oil Red O'),
  ('Iron'),
  ('Von Kossa'),
  ('CD45'),
  ('Giemsa'),
  ('PAS'),
  ('CD68'),
  ('Trichrome'),
  ('Gram'),
  ('GRAM'),
  ('GMS'),
  ('P53'),
  ('Reticulin'),
  ('CD30'),
  ('Ki67'),
  ('AE1/AE3'),
  ('CAM5.2'),
  ('TTF1'),
  ('CD3'),
  ('AFB')
ON CONFLICT (name) DO NOTHING;