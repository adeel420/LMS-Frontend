const API_BASE_URL = 'https://lms-backend-9qpa.onrender.com/api';
// const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  }

  // Auth
  async login(username: string, password: string, captcha: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password, captcha })
    });
  }

  async signup(username: string, email: string, password: string) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ username, email, password })
    });
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword })
    });
  }

  async getMe() {
    return this.request('/auth/me');
  }

  // Admin - Users
  async getUsers() {
    return this.request('/admin/users');
  }

  async createUser(userData: { username: string; email: string; password: string; role: string }) {
    return this.request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async updateUser(id: string, userData: { username: string; email: string; role: string; password?: string }) {
    return this.request(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  async deleteUser(id: string) {
    return this.request(`/admin/users/${id}`, {
      method: 'DELETE'
    });
  }

  // Admin - Courses
  async getCourses() {
    return this.request('/admin/courses');
  }

  async createCourse(courseData: { title: string; description: string; code: string }) {
    return this.request('/admin/courses', {
      method: 'POST',
      body: JSON.stringify(courseData)
    });
  }

  // Admin - Tasks
  async getTasks() {
    return this.request('/admin/tasks');
  }

  async createTask(taskData: { title: string; description: string; courseId: string; learnerId: string; accessorId: string }, files?: FileList) {
    const formData = new FormData();
    formData.append('title', taskData.title);
    formData.append('description', taskData.description);
    formData.append('courseId', taskData.courseId);
    formData.append('learnerId', taskData.learnerId);
    formData.append('accessorId', taskData.accessorId);

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
    }

    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/admin/tasks`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: formData
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Task creation failed');
    }
    return data;
  }

  async updateTask(id: string, taskData: { title: string; description: string; courseId: string; learnerId: string; accessorId: string }, files?: FileList) {
    if (files && files.length > 0) {
      const formData = new FormData();
      formData.append('title', taskData.title);
      formData.append('description', taskData.description);
      formData.append('courseId', taskData.courseId);
      formData.append('learnerId', taskData.learnerId);
      formData.append('accessorId', taskData.accessorId);

      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/tasks/${id}`, {
        method: 'PUT',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: formData
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Task update failed');
      }
      return data;
    }

    return this.request(`/admin/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData)
    });
  }

  async deleteTask(id: string) {
    return this.request(`/admin/tasks/${id}`, {
      method: 'DELETE'
    });
  }

  // Learner
  async getLearnerTasks() {
    return this.request('/learner/tasks');
  }

  async getLearnerLoginAttempts() {
    return this.request('/learner/login-attempts');
  }

  async getLearnerPersonalDetails() {
    return this.request('/learner/personal-details');
  }

  async updateLearnerPersonalDetails(details: { name: string; phone: string; dateOfBirth: string; ethnicity: string }) {
    return this.request('/learner/personal-details', {
      method: 'PUT',
      body: JSON.stringify(details)
    });
  }

  async getLearnerResources() {
    return this.request('/learner/resources');
  }

  // Notifications
  async getNotifications(filter?: string) {
    const queryParam = filter ? `?filter=${filter}` : '';
    return this.request(`/notifications${queryParam}`);
  }

  async markNotificationAsRead(id: string) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PUT'
    });
  }

  async markAllNotificationsAsRead() {
    return this.request('/notifications/read-all', {
      method: 'PUT'
    });
  }

  async clearAllNotifications() {
    return this.request('/notifications/clear-all', {
      method: 'DELETE'
    });
  }

  async submitTask(taskId: string, formData: FormData) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/learner/tasks/${taskId}/submit`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: formData
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Submit failed');
    }
    return data;
  }

  // Accessor
  async getAccessorTasks() {
    return this.request('/accessor/tasks');
  }

  async getSubmittedTasks() {
    return this.request('/accessor/tasks/submitted');
  }

  async assessTask(taskId: string, result: string, feedback: string) {
    return this.request(`/accessor/tasks/${taskId}/assess`, {
      method: 'POST',
      body: JSON.stringify({ result, feedback })
    });
  }

  // IQA
  async getIQATasks() {
    return this.request('/iqa/tasks');
  }

  async reviewTaskIQA(taskId: string, result: string, feedback: string) {
    return this.request(`/iqa/tasks/${taskId}/review`, {
      method: 'POST',
      body: JSON.stringify({ result, feedback })
    });
  }

  // EQA
  async getEQATasks() {
    return this.request('/eqa/tasks');
  }

  async getEQAApprovedTasks() {
    return this.request('/eqa/approved-tasks');
  }

  async reviewTaskEQA(taskId: string, result: string, feedback: string) {
    return this.request(`/eqa/tasks/${taskId}/review`, {
      method: 'POST',
      body: JSON.stringify({ result, feedback })
    });
  }

  // Accessor Assessments
  async getMyAssessments() {
    return this.request('/accessor/my-assessments');
  }
}

export const apiService = new ApiService();