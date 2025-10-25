/*
  # Create Submissions Table

  1. New Tables
    - `submissions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `course_id` (uuid, foreign key to courses)
      - `title` (text)
      - `content` (text)
      - `file_url` (text, optional)
      - `status` (enum: pending, reviewed, approved, rejected)
      - `grade` (integer, optional)
      - `feedback` (text, optional)
      - `submitted_at` (timestamp)
      - `reviewed_at` (timestamp, optional)

  2. Security
    - Enable RLS on `submissions` table
    - Add policies for users to manage their own submissions
*/

CREATE TYPE submission_status AS ENUM ('pending', 'reviewed', 'approved', 'rejected');

CREATE TABLE IF NOT EXISTS submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  file_url text,
  status submission_status NOT NULL DEFAULT 'pending',
  grade integer CHECK (grade >= 0 AND grade <= 100),
  feedback text,
  submitted_at timestamptz DEFAULT now(),
  reviewed_at timestamptz
);

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own submissions"
  ON submissions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own submissions"
  ON submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own submissions"
  ON submissions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);