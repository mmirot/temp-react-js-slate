/*
  # Add test data for stain submissions

  1. Changes
    - Adds sample stain submissions with various dates and statuses
    - Includes both completed and pending submissions
    - Uses different technicians and pathologists
*/

-- Insert test data with different dates and statuses
INSERT INTO stain_submissions (
  stain_id,
  date_prepared,
  tech_initials,
  stain_qc,
  path_initials,
  date_qc,
  comments,
  repeat_stain
) 
SELECT
  id as stain_id,
  -- Different dates for testing
  CASE mod(row_number() OVER (), 4)
    WHEN 0 THEN CURRENT_DATE - interval '3 days'
    WHEN 1 THEN CURRENT_DATE - interval '1 day'
    WHEN 2 THEN CURRENT_DATE - interval '7 days'
    WHEN 3 THEN CURRENT_DATE
  END as date_prepared,
  -- Different tech initials
  CASE mod(row_number() OVER (), 3)
    WHEN 0 THEN 'ABC'
    WHEN 1 THEN 'XYZ'
    WHEN 2 THEN 'JKL'
  END as tech_initials,
  -- Mix of PASS, FAIL, and pending (null) status
  CASE mod(row_number() OVER (), 5)
    WHEN 0 THEN 'PASS'
    WHEN 1 THEN 'FAIL'
    WHEN 2 THEN 'PASS'
    WHEN 3 THEN NULL
    WHEN 4 THEN 'PASS'
  END as stain_qc,
  -- Different pathologist initials
  CASE mod(row_number() OVER (), 4)
    WHEN 0 THEN 'DEF'
    WHEN 1 THEN 'MNO'
    WHEN 2 THEN 'PQR'
    WHEN 3 THEN NULL
  END as path_initials,
  -- QC dates for completed submissions
  CASE 
    WHEN mod(row_number() OVER (), 5) != 3 THEN CURRENT_DATE
    ELSE NULL
  END as date_qc,
  -- Comments for failed stains
  CASE 
    WHEN mod(row_number() OVER (), 5) = 1 THEN 'Needs improvement'
    ELSE NULL
  END as comments,
  -- Some repeats needed
  CASE 
    WHEN mod(row_number() OVER (), 5) = 1 THEN true
    ELSE false
  END as repeat_stain
FROM new_stain_list;