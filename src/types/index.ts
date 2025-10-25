export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'learner' | 'accessor' | 'iqa' | 'eqa';
  learner_id?: string;
  phone?: string;
  date_of_birth?: string;
  ethnicity?: string;
  registration_date: string;
  avatar_url?: string;
  created_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  subject: string;
  learner_id: string;
  learner_name: string;
  status: 'submitted' | 'accessor_review' | 'accessor_pass' | 'accessor_fail' | 'iqa_review' | 'iqa_pass' | 'iqa_fail' | 'eqa_approved';
  submission_date: string;
  accessor_id?: string;
  accessor_feedback?: string;
  accessor_decision?: 'pass' | 'fail';
  accessor_review_date?: string;
  iqa_id?: string;
  iqa_feedback?: string;
  iqa_decision?: 'pass' | 'fail';
  iqa_review_date?: string;
  eqa_approved_date?: string;
  attachments: TaskAttachment[];
  resubmission_count: number;
}

export interface TaskAttachment {
  id: string;
  filename: string;
  file_url: string;
  file_size: string;
  upload_date: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
  task_id?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  code: string;
  level: string;
  created_at: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'qualification_unit' | 'course_document' | 'awarding_body' | 'worksheet' | 'assessment_plan' | 'document';
  file_url: string;
  file_size?: string;
  course_id: string;
  created_at: string;
}