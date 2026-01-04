-- Add status column to about table
ALTER TABLE about ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'AVAILABLE FOR HIRE';
