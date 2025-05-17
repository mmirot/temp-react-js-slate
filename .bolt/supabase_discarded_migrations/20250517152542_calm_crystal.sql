/*
  # Update stains table with complete list

  1. Changes
    - Add all stains from the provided list
    - Ensure no duplicates using ON CONFLICT
    - Preserve existing stain IDs
  
  2. Notes
    - Some stains had variations in capitalization (e.g., 'GRAM' vs 'Gram')
    - H&E appears twice in different forms
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