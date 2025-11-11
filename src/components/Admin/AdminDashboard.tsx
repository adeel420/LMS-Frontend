import React, { useState, useEffect } from 'react';
import { Users, BookOpen, FileText, Settings, TrendingUp, UserPlus, Award, AlertCircle } from 'lucide-react';
import { apiService } from '../../services/api';
import UserManagement from './UserManagement';
import TaskManagement from './TaskManagement';

interface AdminDashboardProps {
  activeSection: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ activeSection }) => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await apiService.getUsers();
      setUsers(response);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: 'Total Users',
      value: users.length.toString(),
      change: '+12%',
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Active Tasks',
      value: tasks.length.toString(),
      change: '+5%',
      icon: BookOpen,
      color: 'bg-green-500',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Pending Reviews',
      value: users.filter(u => u.role === 'learner').length.toString(),
      change: '+8%',
      icon: FileText,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'System Health',
      value: '98%',
      change: '+2%',
      icon: Settings,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-100'
    }
  ];

  const getRecentActivities = () => {
    const activities = [];
    
    // Recent user registrations
    const recentUsers = users.slice(-3).reverse();
    recentUsers.forEach(user => {
      activities.push({
        id: `user-${user._id}`,
        action: `New ${user.role} registered`,
        user: user.username,
        time: new Date(user.createdAt).toLocaleDateString(),
        type: 'user'
      });
    });
    
    // Add some mock activities
    activities.push(
      { id: 'task-1', action: 'Task submitted for review', user: 'learner1', time: '2 hours ago', type: 'task' },
      { id: 'review-1', action: 'IQA review completed', user: 'iqa1', time: '4 hours ago', type: 'review' }
    );
    
    return activities.slice(0, 4);
  };
  
  const recentActivities = getRecentActivities();

  if (activeSection === 'users') {
    return <UserManagement />;
  }

  if (activeSection === 'courses') {
    return <TaskManagement />;
  }

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">System overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-700 font-semibold text-sm">{stat.title}</h3>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon size={20} className={`${stat.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</div>
            <div className="text-sm text-green-600 font-medium">{stat.change} from last month</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  {activity.type === 'user' && <UserPlus size={16} className="text-blue-600" />}
                  {activity.type === 'task' && <FileText size={16} className="text-green-600" />}
                  {activity.type === 'review' && <Award size={16} className="text-purple-600" />}
                  {activity.type === 'course' && <BookOpen size={16} className="text-orange-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">by {activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">Database</span>
              </div>
              <span className="text-sm text-green-600">Operational</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">API Server</span>
              </div>
              <span className="text-sm text-green-600">Operational</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">File Storage</span>
              </div>
              <span className="text-sm text-green-600">Operational</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">Authentication</span>
              </div>
              <span className="text-sm text-green-600">Operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
            <UserPlus size={20} className="text-blue-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Manage Users</div>
              <div className="text-sm text-gray-600">Use sidebar navigation</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
            <BookOpen size={20} className="text-green-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Manage Tasks</div>
              <div className="text-sm text-gray-600">Use sidebar navigation</div>
            </div>
          </div>
          
          <button className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <TrendingUp size={20} className="text-purple-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">View Reports</div>
              <div className="text-sm text-gray-600">Analytics & insights</div>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
            <Settings size={20} className="text-orange-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Settings</div>
              <div className="text-sm text-gray-600">System configuration</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;