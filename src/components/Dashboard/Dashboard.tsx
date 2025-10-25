import React from 'react';
import { useState, useEffect } from 'react';
import { FileText, Info, Bell, Calendar, User, Phone, Mail, MapPin, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { databaseService } from '../../services/database';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [userProgress, setUserProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        const [submissionsData, notificationsData, progressData] = await Promise.all([
          databaseService.getSubmissions(user.id),
          databaseService.getNotifications(user.id),
          databaseService.getUserProgress(user.id)
        ]);

        setSubmissions(submissionsData);
        setNotifications(notificationsData);
        setUserProgress(progressData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Submissions',
      value: submissions.length.toString(),
      subtitle: 'Last submission added on',
      detail: submissions.length > 0 ? new Date(submissions[0].submitted_at).toLocaleDateString() : 'None',
      icon: FileText,
      color: 'bg-teal-500',
      bgColor: 'bg-teal-100'
    },
    {
      title: 'Additional Information',
      value: '0',
      subtitle: 'Last Additional Info added on',
      detail: 'None',
      icon: Info,
      color: 'bg-red-500',
      bgColor: 'bg-red-100'
    }
  ];

  const unreadNotifications = notifications.filter(n => !n.read);

  const loginAttempts = [
    { browser: 'Google Chrome', percentage: 100, color: 'bg-teal-400' }
  ];

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
            <h3 className="text-gray-900 font-semibold text-lg">Notifications</h3>
            <Bell size={20} className="text-gray-400" />
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">13</span>
            </div>
            <div className="flex-1">
              <div className="text-sm text-gray-600 mb-1">Last notification received on</div>
              <div className="text-sm font-medium text-gray-800">19-03-2025 06:37 AM</div>
            </div>
          </div>

          {unreadNotifications.length > 0 && (
            <div className="text-xs text-red-500 font-medium">
              {unreadNotifications.length} new
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Login Attempts Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-gray-900 font-semibold mb-6 text-lg">Learner Login Attempts (4 times)</h3>
          
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
            {loginAttempts.map((attempt, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 font-medium">{attempt.browser}</span>
                  <span className="text-sm font-bold text-gray-800">{attempt.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`${attempt.color} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${attempt.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learner Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-gray-900 font-semibold mb-6 text-lg">Learner Info</h3>
          
          <div className="space-y-4">
            <div className="text-sm">
              <div className="font-semibold text-gray-900 mb-2">
                603/3105/9 - ProQual Level 6 NVQ Diploma in Occupational Health and Safety Practice
              </div>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <User size={16} className="text-gray-400" />
                <span className="text-gray-700">{user?.name || 'Hashim Yaqoob'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-gray-400" />
                <span className="text-gray-700">{user?.email || 'hashim.yaqub@gmail.com'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-gray-400" />
                <span className="text-gray-700">{user?.phone || '00923365555683'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-gray-400" />
                <span className="text-gray-700">DOB: {user?.date_of_birth || '1983-01-25'}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-gray-400" />
                <span className="text-gray-700">Register On: {user?.registration_date || '18/03/2025'}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-gray-400" />
                <span className="text-gray-700">Ethnicity: {user?.ethnicity || 'Pakistan'}</span>
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

export default Dashboard;