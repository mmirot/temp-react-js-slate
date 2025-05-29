/*
  # Delete stain QC log contents

  This migration deletes all completed QC records from the stain_submissions table
  while preserving pending submissions.

  1. Changes
    - Delete all records where stain_qc is not null (completed QC records)
    - Preserve pending submissions (where stain_qc is null)
*/

-- Delete all completed QC records
DELETE FROM stain_submissions
WHERE stain_qc IS NOT NULL;