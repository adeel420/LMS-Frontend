import React, { useState, useEffect } from 'react';
import { FileText, Info, Bell, Calendar, User, Phone, Mail, MapPin, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';

const LearnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loginAttempts, setLoginAttempts] = useState([]);
  const [personalDetails, setPersonalDetails] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
    fetchLoginAttempts();
    fetchPersonalDetails();
    fetchNotifications();

    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await apiService.getLearnerTasks();
      setTasks(response);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLoginAttempts = async () => {
    try {
      const response = await apiService.getLearnerLoginAttempts();
      setLoginAttempts(response);
    } catch (error) {
      console.error('Error fetching login attempts:', error);
    }
  };

  const fetchPersonalDetails = async () => {
    try {
      const response = await apiService.getLearnerPersonalDetails();
      setPersonalDetails(response);
    } catch (error) {
      console.error('Error fetching personal details:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await apiService.getNotifications();
      setNotifications(response);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const submissions = tasks.filter(t => t.submission).length;
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const lastSubmission = tasks.find(t => t.submission);
  const getLastSubmissionDate = () => {
    if (!lastSubmission || !lastSubmission.submission?.submittedAt) return 'None';
    try {
      return new Date(lastSubmission.submission.submittedAt).toLocaleDateString();
    } catch {
      return 'None';
    }
  };

  const stats = [
    {
      title: 'Submissions',
      value: submissions.toString(),
      subtitle: 'Last submission added on',
      detail: getLastSubmissionDate(),
      icon: FileText,
      color: 'bg-teal-500',
      bgColor: 'bg-teal-100'
    },
    {
      title: 'Total Tasks',
      value: tasks.length.toString(),
      subtitle: 'Tasks assigned to you',
      detail: tasks.filter(t => t.status === 'assigned').length + ' pending',
      icon: Info,
      color: 'bg-red-500',
      bgColor: 'bg-red-100'
    }
  ];



  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Welcome Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome The-E-Assessment</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-700 font-semibold text-lg">{stat.title}</h3>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon size={24} className={`${stat.color.replace('bg-', 'text-')}`} />
                </div>
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-3">{stat.value}</div>
              <div className="text-sm text-gray-600">
                <div className="mb-1">{stat.subtitle}</div>
                <div className="font-medium text-gray-800">{stat.detail}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-900 font-semibold text-lg">Recent Notifications</h3>
            <Bell size={20} className="text-gray-400" />
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">{unreadNotifications}</span>
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-600 mb-1">Unread notifications</div>
              <div className="text-sm font-medium text-gray-800">
                {notifications.length > 0 ?
                  `Last: ${new Date(notifications[0].createdAt).toLocaleDateString()}` :
                  'No notifications'
                }
              </div>
            </div>
          </div>

          {/* Recent Notifications List */}
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {notifications.slice(0, 5).map((notification) => (
              <div key={notification._id} className={`p-3 rounded-lg border ${!notification.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                    <div className="text-xs text-gray-500 mt-2">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
                  )}
                </div>
              </div>
            ))}

            {notifications.length === 0 && (
              <div className="text-center py-4 text-gray-500 text-sm">
                No notifications yet
              </div>
            )}

            {notifications.length > 5 && (
              <div className="text-center pt-2">
                <button
                  onClick={() => window.location.href = '#notifications'}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View all notifications
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Login Attempts Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-gray-900 font-semibold mb-6 text-lg">Learner Login Attempts ({loginAttempts.length} times)</h3>

          {/* Chart Area */}
          <div className="relative h-64 mb-6">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-teal-400 to-teal-500 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-sm opacity-90">Google Chrome</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {loginAttempts.length > 0 ? (
              loginAttempts.slice(-3).map((attempt, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 font-medium">
                      {attempt.userAgent?.includes('Edg') ? 'Microsoft Edge' :
                        attempt.userAgent?.includes('Chrome') ? 'Google Chrome' :
                          attempt.userAgent?.includes('Firefox') ? 'Firefox' :
                            attempt.userAgent?.includes('Safari') ? 'Safari' :
                              attempt.userAgent?.includes('Opera') ? 'Opera' : 'Unknown Browser'}
                    </span>
                    <span className="text-sm font-bold text-gray-800">
                      {new Date(attempt.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-teal-400 h-3 rounded-full transition-all duration-500" style={{ width: '100%' }}></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                No login attempts recorded
              </div>
            )}
          </div>
        </div>

        {/* Learner Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-gray-900 font-semibold mb-6 text-lg">Learner Info</h3>

          <div className="space-y-4">


            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <User size={16} className="text-gray-400" />
                <span className="text-gray-700">{personalDetails?.name || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-gray-400" />
                <span className="text-gray-700">{personalDetails?.email || user?.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-gray-400" />
                <span className="text-gray-700">{personalDetails?.phone || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-gray-400" />
                <span className="text-gray-700">DOB: {personalDetails?.dateOfBirth || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-gray-400" />
                <span className="text-gray-700">Register On: {personalDetails?.registrationDate || 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-gray-400" />
                <span className="text-gray-700">Ethnicity: {personalDetails?.ethnicity || 'Not provided'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Learner Activities */}
      <div className="mt-6 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-gray-900 font-semibold mb-4 text-lg">Learner Activities</h3>
        <div className="text-center py-8">
          <TrendingUp size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No recent activities to display.</p>
          <p className="text-sm text-gray-400 mt-1">Your learning activities will appear here once you start engaging with the platform.</p>
        </div>
      </div>
    </div>
  );
};

export default LearnerDashboard;