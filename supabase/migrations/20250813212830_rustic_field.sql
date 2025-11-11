/*
  # Create Resources Table

  1. New Tables
    - `resources`
      - `id` (uuid, primary key)
      - `course_id` (uuid, foreign key to courses)
      - `title` (text)
      - `description` (text)
      - `type` (enum: pdf, video, link, document)
      - `url` (text)
      - `file_size` (text, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `resources` table
    - Add policy for authenticated users to read resources
*/

CREATE TYPE resource_type AS ENUM ('pdf', 'video', 'link', 'document');

CREATE TABLE IF NOT EXISTS resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid REFERENCES courses(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  type resource_type NOT NULL,
  url text NOT NULL,
  file_size text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read resources"
  ON resources
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert sample resources
INSERT INTO resources (course_id, title, description, type, url, file_size) 
SELECT 
  c.id,
  'Health and Safety Legislation Handbook',
  'Comprehensive guide covering all relevant health and safety laws and regulations.',
  'pdf',
  '#',
  '2.5 MB'
FROM courses c WHERE c.title LIKE '%ProQual%' LIMIT 1;

INSERT INTO resources (course_id, title, description, type, url) 
SELECT 
  c.id,
  'Risk Assessment Training Video',
  'Step-by-step tutorial on conducting effective workplace risk assessments.',
  'video',
  '#'
FROM courses c WHERE c.title LIKE '%ProQual%' LIMIT 1;