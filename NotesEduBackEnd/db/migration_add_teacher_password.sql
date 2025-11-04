-- Add password column to teachers table
ALTER TABLE teachers ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- Update to make password NOT NULL after data migration (if needed)
-- ALTER TABLE teachers ALTER COLUMN password SET NOT NULL;
