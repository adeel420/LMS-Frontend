/*
  # Create Assessments and Questions Tables

  1. New Tables
    - `assessments`
      - `id` (uuid, primary key)
      - `course_id` (uuid, foreign key to courses)
      - `title` (text)
      - `description` (text)
      - `time_limit` (integer, minutes)
      - `total_marks` (integer)
      - `passing_marks` (integer)
      - `created_at` (timestamp)
    
    - `questions`
      - `id` (uuid, primary key)
      - `assessment_id` (uuid, foreign key to assessments)
      - `question` (text)
      - `type` (enum: multiple_choice, true_false, essay)
      - `options` (jsonb, optional)
      - `correct_answer` (text, optional)
      - `marks` (integer)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read assessments and questions
*/

CREATE TYPE question_type AS ENUM ('multiple_choice', 'true_false', 'essay');

CREATE TABLE IF NOT EXISTS assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  time_limit integer NOT NULL DEFAULT 60,
  total_marks integer NOT NULL DEFAULT 100,
  passing_marks integer NOT NULL DEFAULT 60,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid REFERENCES assessments(id) ON DELETE CASCADE NOT NULL,
  question text NOT NULL,
  type question_type NOT NULL,
  options jsonb,
  correct_answer text,
  marks integer NOT NULL DEFAULT 1
);

ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read assessments"
  ON assessments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read questions"
  ON questions
  FOR SELECT
  TO authenticated
  USING (true);