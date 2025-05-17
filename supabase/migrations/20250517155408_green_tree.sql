/*
  # Fix stains table

  1. Changes
    - Add stains to the existing stains table
    - Ensure RLS is enabled
    - Add policy for reading stains

  2. Security
    - Enable RLS on stains table
    - Add policy for authenticated users to read stains
*/

-- Insert the stains into the existing stains table
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

-- Make sure RLS is enabled
ALTER TABLE stains ENABLE ROW LEVEL SECURITY;

-- Make sure the read policy exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'stains' 
    AND policyname = 'Allow authenticated users to read stains'
  ) THEN
    CREATE POLICY "Allow authenticated users to read stains"
      ON stains
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;