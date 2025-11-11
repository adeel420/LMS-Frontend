/*
  # Create Courses Table

  1. New Tables
    - `courses`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `instructor` (text)
      - `duration` (text)
      - `level` (enum: Beginner, Intermediate, Advanced)
      - `thumbnail_url` (text, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `courses` table
    - Add policy for authenticated users to read courses
*/

CREATE TYPE course_level AS ENUM ('Beginner', 'Intermediate', 'Advanced');

CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  instructor text NOT NULL,
  duration text NOT NULL,
  level course_level NOT NULL DEFAULT 'Beginner',
  thumbnail_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read courses"
  ON courses
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert sample course data
INSERT INTO courses (title, description, instructor, duration, level) VALUES
('ProQual Level 6 NVQ Diploma in Occupational Health and Safety Practice', 'Comprehensive diploma covering all aspects of occupational health and safety in the workplace.', 'Dr. Sarah Johnson', '12 months', 'Advanced'),
('Health and Safety Fundamentals', 'Introduction to basic health and safety principles and practices.', 'John Smith', '6 weeks', 'Beginner'),
('Risk Assessment and Management', 'Advanced course on identifying, assessing, and managing workplace risks.', 'Dr. Sarah Johnson', '8 weeks', 'Intermediate');