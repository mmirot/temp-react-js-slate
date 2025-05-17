/*
  # Add additional stains to the database
  
  1. Changes
    - Add more stains to the stains table including Congo Red
*/

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