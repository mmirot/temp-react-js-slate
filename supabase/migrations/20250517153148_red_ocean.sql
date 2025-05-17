/*
  # Update stains table with complete list

  1. Changes
    - Cleans up existing stains table
    - Inserts complete list of unique stains from CSV
  
  2. Security
    - Maintains existing RLS policies
*/

-- First, clear existing stains to avoid duplicates
TRUNCATE TABLE stains RESTART IDENTITY CASCADE;

-- Insert the complete list of unique stains
INSERT INTO stains (name) VALUES
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