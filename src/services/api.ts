const API_BASE_URL = 'https://lms-backend-pj3v.onrender.com/api';

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
  async login(username: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
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

  // Admin - Tasks
  async getTasks() {
    return this.request('/admin/tasks');
  }

  async createTask(taskData: { title: string; description: string; learnerId: string; accessorId: string }) {
    return this.request('/admin/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData)
    });
  }

  async updateTask(id: string, taskData: { title: string; description: string; learnerId: string; accessorId: string }) {
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

  async reviewTaskEQA(taskId: string, result: string, feedback: string) {
    return this.request(`/eqa/tasks/${taskId}/review`, {
      method: 'POST',
      body: JSON.stringify({ result, feedback })
    });
  }
}

export const apiService = new ApiService();