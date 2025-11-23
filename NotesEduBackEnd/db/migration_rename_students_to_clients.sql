-- Migration: Rename students to clients throughout the database
-- This migration renames the students table to clients and updates all references

-- Step 1: Rename the students table to clients
ALTER TABLE students RENAME TO clients;

-- Step 2: Rename student_id to client_id in notes table
ALTER TABLE notes RENAME COLUMN student_id TO client_id;

-- Step 3: Rename student_id to client_id in dailies table
ALTER TABLE dailies RENAME COLUMN student_id TO client_id;

-- Step 4: Rename the indexes
ALTER INDEX IF EXISTS idx_notes_student_id RENAME TO idx_notes_client_id;
ALTER INDEX IF EXISTS idx_dailies_student_id RENAME TO idx_dailies_client_id;

-- Note: Foreign key constraints are automatically updated when the table is renamed
-- PostgreSQL maintains the referential integrity even after renaming
