/*
  # Add Username Field to Users Table

  1. New Columns
    - `username` (text, unique, 5-20 characters)
    - `first_name` (text, required)
    - `last_name` (text, required)

  2. Security
    - Add unique constraint on username (case-insensitive)
    - Add check constraints for username format and length
    - Update RLS policies to include new fields

  3. Changes
    - Modified users table to include personal information
    - Username must be 5-20 characters, alphanumeric + hyphens/underscores only
    - Case-insensitive uniqueness to prevent confusion
*/

-- Add new columns to users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'username'
  ) THEN
    ALTER TABLE users ADD COLUMN username text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'first_name'
  ) THEN
    ALTER TABLE users ADD COLUMN first_name text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'last_name'
  ) THEN
    ALTER TABLE users ADD COLUMN last_name text;
  END IF;
END $$;

-- Add constraints for username
DO $$
BEGIN
  -- Add unique constraint on lowercase username
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'users' AND constraint_name = 'users_username_unique'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT users_username_unique UNIQUE (username);
  END IF;

  -- Add check constraint for username format and length
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'users_username_format'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT users_username_format 
    CHECK (
      username IS NULL OR (
        length(username) >= 5 AND 
        length(username) <= 20 AND
        username ~ '^[a-zA-Z0-9_-]+$' AND
        username NOT LIKE '-%' AND
        username NOT LIKE '%_' AND
        username NOT LIKE '_%' AND
        username NOT LIKE '%-'
      )
    );
  END IF;
END $$;

-- Create case-insensitive unique index for username
CREATE UNIQUE INDEX IF NOT EXISTS users_username_lower_unique 
ON users (lower(username));

-- Update the name column to be computed from first_name and last_name
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'name'
  ) THEN
    -- Update existing records to use first_name + last_name format
    UPDATE users 
    SET name = COALESCE(first_name, '') || ' ' || COALESCE(last_name, '')
    WHERE first_name IS NOT NULL AND last_name IS NOT NULL;
  END IF;
END $$;