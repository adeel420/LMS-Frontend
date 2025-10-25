import { supabase } from '../lib/supabase';
import { User, Course, Submission, Notification, Resource } from '../types';

export const databaseService = {
  // Users
  async getUser(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }
    return data;
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Courses
  async getCourses(): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Submissions
  async getSubmissions(userId: string): Promise<Submission[]> {
    const { data, error } = await supabase
      .from('submissions')
      .select(`
        *,
        courses (
          title,
          instructor
        )
      `)
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createSubmission(submission: Omit<Submission, 'id' | 'submitted_at'>): Promise<Submission> {
    const { data, error } = await supabase
      .from('submissions')
      .insert(submission)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Notifications
  async getNotifications(userId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async markNotificationAsRead(id: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);

    if (error) throw error;
  },

  // Resources
  async getResources(courseId?: string): Promise<Resource[]> {
    let query = supabase
      .from('resources')
      .select(`
        *,
        courses (
          title
        )
      `);

    if (courseId) {
      query = query.eq('course_id', courseId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // User Progress
  async getUserProgress(userId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('user_progress')
      .select(`
        *,
        courses (
          title,
          description
        )
      `)
      .eq('user_id', userId);
    if (error) throw error;
    return data || [];
  },

  async updateUserProgress(userId: string, courseId: string, completionPercentage: number): Promise<void> {
    const { error } = await supabase.rpc('update_user_progress', {
      p_user_id: userId,
      p_course_id: courseId,
      p_completion_percentage: completionPercentage
    });

    if (error) throw error;
  }
};