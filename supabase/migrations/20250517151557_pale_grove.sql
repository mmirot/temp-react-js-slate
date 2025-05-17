/*
  # Add initial stain names

  1. New Data
    - Add common stain names to the stains table
  
  2. Changes
    - Insert initial stain data into the stains table
*/

INSERT INTO stains (name) VALUES
  ('H&E'),
  ('PAS'),
  ('GMS'),
  ('AFB'),
  ('Gram'),
  ('Iron'),
  ('Trichrome'),
  ('Congo Red'),
  ('Reticulin'),
  ('Giemsa')
ON CONFLICT (name) DO NOTHING;