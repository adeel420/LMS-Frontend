/*
  # Create Users Table

  1. New Tables
    - `users`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `name` (text)
      - `learner_id` (text, unique)
      - `phone` (text, optional)
      - `date_of_birth` (date, optional)
      - `ethnicity` (text, optional)
      - `registration_date` (text)
      - `avatar_url` (text, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `users` table
    - Add policy for users to read and update their own data
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  learner_id text UNIQUE NOT NULL,
  phone text,
  date_of_birth text,
  ethnicity text,
  registration_date text NOT NULL DEFAULT to_char(now(), 'DD/MM/YYYY'),
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);