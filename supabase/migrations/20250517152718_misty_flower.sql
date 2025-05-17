/*
  # Add complete list of stains

  1. Changes
    - Adds all stains from the provided list to the stains table
    - Ensures no duplicates using ON CONFLICT
    - Preserves existing stains
*/

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