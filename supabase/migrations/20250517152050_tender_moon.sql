/*
  # Add initial stain names

  1. New Data
    - Adds common stain names to the `stains` table
    - Each stain gets a unique ID and creation timestamp
  
  2. Changes
    - Inserts standard stain names into the existing stains table
*/

INSERT INTO stains (name) VALUES
  ('H&E'),
  ('PAS'),
  ('GMS'),
  ('AFB'),
  ('Gram'),
  ('Iron'),
  ('Giemsa'),
  ('Trichrome'),
  ('Congo Red'),
  ('Reticulin'),
  ('Alcian Blue'),
  ('Mucicarmine'),
  ('Von Kossa'),
  ('Oil Red O'),
  ('Elastic')
ON CONFLICT (name) DO NOTHING;