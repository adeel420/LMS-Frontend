import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Info, 
  Bell, 
  BookOpen, 
  UserCheck, 
  Lock, 
  LogOut,
  User,
  Users,
  Settings,
  ClipboardCheck,
  Award,
  Download
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchNotificationCount();
      const interval = setInterval(fetchNotificationCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotificationCount = async () => {
    try {
      const notifications = await apiService.getNotifications('unread');
      setUnreadCount(notifications.length);
    } catch (error) {
      console.error('Error fetching notification count:', error);
    }
  };

  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'bg-green-500' }
    ];

    switch (user?.role) {
      case 'admin':
        return [
          ...baseItems,
          { id: 'users', label: 'User Management', icon: Users, color: 'bg-blue-500' },
          { id: 'courses', label: 'Course Management', icon: BookOpen, color: 'bg-blue-500' },
          // { id: 'reports', label: 'Reports', icon: FileText, color: 'bg-blue-500' },
          // { id: 'settings', label: 'System Settings', icon: Settings, color: 'bg-blue-500' }
        ];
      
      case 'learner':
        return [
          ...baseItems,
          { id: 'submissions', label: 'Submissions', icon: FileText, color: 'bg-blue-500' },
          { id: 'additional-info', label: 'Additional Info', icon: Info, color: 'bg-blue-500' },
          { id: 'notifications', label: 'Notifications', icon: Bell, color: 'bg-blue-500', badge: unreadCount > 0 ? unreadCount.toString() : undefined },
          { id: 'resources', label: 'Resources', icon: BookOpen, color: 'bg-blue-500' },
          { id: 'assessor', label: 'Assessor', icon: UserCheck, color: 'bg-blue-500' },
          { id: 'change-password', label: 'Change Password', icon: Lock, color: 'bg-blue-500' }
        ];
      
      case 'accessor':
        return [
          ...baseItems,
          { id: 'review-tasks', label: 'Review Tasks', icon: ClipboardCheck, color: 'bg-blue-500' },
          { id: 'my-assessments', label: 'My Assessments', icon: FileText, color: 'bg-blue-500' },
          { id: 'learners', label: 'My Learners', icon: Users, color: 'bg-blue-500' },
          { id: 'notifications', label: 'Notifications', icon: Bell, color: 'bg-blue-500', badge: unreadCount > 0 ? unreadCount.toString() : undefined }
        ];
      
      case 'iqa':
        return [
          ...baseItems,
          { id: 'quality-review', label: 'Quality Review', icon: Award, color: 'bg-blue-500' },
          { id: 'assessments', label: 'Assessments', icon: FileText, color: 'bg-blue-500' },
          { id: 'notifications', label: 'Notifications', icon: Bell, color: 'bg-blue-500', badge: unreadCount > 0 ? unreadCount.toString() : undefined }
        ];
      
      case 'eqa':
        return [
          ...baseItems,
          { id: 'approved-tasks', label: 'Approved Tasks', icon: Award, color: 'bg-blue-500' },
          { id: 'audit-reports', label: 'Audit Reports', icon: FileText, color: 'bg-blue-500' }
        ];
      
      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  const getRoleTitle = () => {
    switch (user?.role) {
      case 'admin': return 'Admin Panel';
      case 'learner': return 'Learner Panel';
      case 'accessor': return 'Accessor Panel';
      case 'iqa': return 'IQA Panel';
      case 'eqa': return 'EQA Panel';
      default: return 'User Panel';
    }
  };

  const getCompletionPercentage = () => {
    if (user?.role === 'learner') {
      return '0% Completion';
    }
    return null;
  };

  return (
    <div className="w-80 bg-gradient-to-b from-slate-700 to-slate-800 text-white min-h-screen flex flex-col shadow-xl">
      {/* Header */}
      <div className="p-6 border-b border-slate-600">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-slate-700 font-bold text-sm">LMS</span>
          </div>
          <h2 className="text-xl font-bold">{getRoleTitle()}</h2>
        </div>
        
        <div className="flex items-center gap-3 mt-4">
          <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center border-2 border-slate-500">
            <User size={20} className="text-slate-300" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">{user?.name}</p>
            {getCompletionPercentage() && (
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-slate-300">{getCompletionPercentage()}</span>
              </div>
            )}
            {user?.role === 'learner' && (
              <div className="text-xs text-slate-400 mt-1">0% Sampling</div>
            )}
            <div className="text-xs text-slate-400 mt-1 capitalize">{user?.role}</div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-4">
        {menuItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-all duration-200 ${
                isActive 
                  ? 'bg-green-500 text-white shadow-lg border-r-4 border-green-300' 
                  : 'text-slate-300 hover:bg-slate-600 hover:text-white hover:shadow-md'
              }`}
            >
              <div className={`p-2 rounded-lg transition-colors ${
                isActive ? 'bg-green-600 shadow-md' : `${item.color} opacity-80`
              }`}>
                <item.icon size={16} className="text-white" />
              </div>
              <span className="text-sm font-medium flex-1">{item.label}</span>
              {item.badge && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-sm">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-slate-600">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-6 py-3 text-slate-300 hover:bg-red-600 hover:text-white transition-all duration-200 rounded-lg group"
        >
          <div className="p-2 rounded-lg bg-red-500 group-hover:bg-red-700 transition-colors">
            <LogOut size={16} className="text-white" />
          </div>
          <span className="text-sm font-medium">Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;