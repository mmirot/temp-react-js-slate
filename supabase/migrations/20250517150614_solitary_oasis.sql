/*
  # Add pathology stains

  1. Changes
    - Add unique constraint on stains.name column
    - Insert common pathology stains

  2. Security
    - No changes to existing RLS policies
*/

-- First ensure name column has a unique constraint
ALTER TABLE stains 
ADD CONSTRAINT stains_name_key UNIQUE (name);

-- Now insert the stains with the conflict handling
INSERT INTO stains (name) VALUES
  ('Congo Red'),
  ('Trichrome'),
  ('Iron'),
  ('Reticulin'),
  ('Elastic'),
  ('Mucicarmine'),
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
  ('TTF1')
ON CONFLICT (name) DO NOTHING;