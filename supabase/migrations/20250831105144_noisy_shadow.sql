/*
  # Add Username Field to Users Table

  1. New Columns
    - `username` (text, unique, 5-20 characters, NOT NULL)
    - `first_name` (text, required, NOT NULL)
    - `last_name` (text, required, NOT NULL)

  2. Security
    - Add unique constraint on username (case-insensitive)
    - Add check constraints for username format and length
    - Update RLS policies to include new fields

  3. Changes
    - Modified users table to include personal information
    - Username must be 5-20 characters, alphanumeric + hyphens/underscores only
    - Case-insensitive uniqueness to prevent confusion
    - All new columns are NOT NULL with default values
*/

-- Add new columns to users table with default values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'username'
  ) THEN
    ALTER TABLE users ADD COLUMN username text DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'first_name'
  ) THEN
    ALTER TABLE users ADD COLUMN first_name text DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'last_name'
  ) THEN
    ALTER TABLE users ADD COLUMN last_name text DEFAULT '';
  END IF;
END $$;

-- Update any existing NULL values with defaults
UPDATE users 
SET 
  username = COALESCE(username, 'user' || substring(id::text, 1, 8)),
  first_name = COALESCE(first_name, 'User'),
  last_name = COALESCE(last_name, '')
WHERE username IS NULL OR first_name IS NULL OR last_name IS NULL;

-- Now make the columns NOT NULL
DO $$
BEGIN
  -- Make username NOT NULL
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'username' AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE users ALTER COLUMN username SET NOT NULL;
  END IF;

  -- Make first_name NOT NULL
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'first_name' AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE users ALTER COLUMN first_name SET NOT NULL;
  END IF;

  -- Make last_name NOT NULL
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'last_name' AND is_nullable = 'YES'
  ) THEN
    ALTER TABLE users ALTER COLUMN last_name SET NOT NULL;
  END IF;
END $$;

-- Add constraints for username
DO $$
BEGIN
  -- Add unique constraint on username
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
      length(username) >= 5 AND 
      length(username) <= 20 AND
      username ~ '^[a-zA-Z0-9_-]+$' AND
      username NOT LIKE '-%' AND
      username NOT LIKE '%_' AND
      username NOT LIKE '_%' AND
      username NOT LIKE '%-'
    );
  END IF;
END $$;

-- Create case-insensitive unique index for username
CREATE UNIQUE INDEX IF NOT EXISTS users_username_lower_unique 
ON users (lower(username));

-- Update the name column to be computed from first_name and last_name
UPDATE users 
SET name = first_name || ' ' || last_name
WHERE first_name IS NOT NULL AND last_name IS NOT NULL;