-- Migration: Add phone_number column to staff and viewers tables

-- Add phone_number to staff table
ALTER TABLE staff ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);

-- Add phone_number to viewers table
ALTER TABLE viewers ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);

-- Migration rollback
-- ALTER TABLE staff DROP COLUMN IF EXISTS phone_number;
-- ALTER TABLE viewers DROP COLUMN IF EXISTS phone_number;
