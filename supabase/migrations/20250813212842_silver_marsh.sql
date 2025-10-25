/*
  # Create User Progress Table

  1. New Tables
    - `user_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `course_id` (uuid, foreign key to courses)
      - `completion_percentage` (integer)
      - `last_accessed` (timestamp)
      - `total_time_spent` (integer, minutes)

  2. Security
    - Enable RLS on `user_progress` table
    - Add policies for users to manage their own progress
*/

CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  completion_percentage integer NOT NULL DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  last_accessed timestamptz DEFAULT now(),
  total_time_spent integer NOT NULL DEFAULT 0,
  UNIQUE(user_id, course_id)
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own progress"
  ON user_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);