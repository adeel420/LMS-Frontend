/*
  # Create Functions and Triggers

  1. Functions
    - Function to create user profile on signup
    - Function to create sample notifications for new users

  2. Triggers
    - Trigger to automatically create user profile when auth user is created
    - Trigger to create initial progress records for new users
*/

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO users (id, email, name, learner_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'learner_id', '603/3105/' || (FLOOR(RANDOM() * 9999) + 1)::text)
  );
  
  -- Create welcome notification
  INSERT INTO notifications (user_id, title, message, type)
  VALUES (
    NEW.id,
    'Welcome to The-E-Assessment!',
    'Your account has been created successfully. Start exploring your courses and begin your learning journey.',
    'success'
  );
  
  -- Create initial progress for the main course
  INSERT INTO user_progress (user_id, course_id, completion_percentage)
  SELECT NEW.id, c.id, 0
  FROM courses c
  WHERE c.title LIKE '%ProQual%'
  LIMIT 1;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update user progress
CREATE OR REPLACE FUNCTION update_user_progress(
  p_user_id uuid,
  p_course_id uuid,
  p_completion_percentage integer
)
RETURNS void AS $$
BEGIN
  INSERT INTO user_progress (user_id, course_id, completion_percentage, last_accessed)
  VALUES (p_user_id, p_course_id, p_completion_percentage, now())
  ON CONFLICT (user_id, course_id)
  DO UPDATE SET
    completion_percentage = p_completion_percentage,
    last_accessed = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;