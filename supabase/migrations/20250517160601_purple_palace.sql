/*
  # Add initial stain data

  1. Changes
    - Ensures stains exist in new_stain_list table
    - Adds common pathology stains
*/

-- First ensure the table exists and is empty
TRUNCATE TABLE new_stain_list RESTART IDENTITY CASCADE;

-- Insert the complete list of stains
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