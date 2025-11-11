import React, { useState, useEffect } from 'react';
import { Bell, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';

interface HeaderProps {
  onNavigate?: (section: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const notifications = await apiService.getNotifications('unread');
      setUnreadCount(notifications.length);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const getRoleBasedTitle = () => {
    switch (user?.role) {
      case 'admin':
        return 'Admin Dashboard - System Management';
      case 'learner':
        return 'Welcome The-E-Assessment';
      case 'accessor':
        return 'Accessor Dashboard - Assessment Review';
      case 'iqa':
        return 'IQA Dashboard - Quality Assurance';
      case 'eqa':
        return 'EQA Dashboard - External Quality';
      default:
        return 'LMS Dashboard';
    }
  };

  // const getCourseInfo = () => {
  //   if (user?.role === 'learner') {
  //     return '603/3105/9 - ProQual Level 6 NVQ Diploma in Occupational Health and Safety Practice Unit#';
  //   }
  //   return null;
  // };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900">
            {getRoleBasedTitle()}
          </h1>
        </div>

        <div className="flex items-center gap-6">
          {/* {getCourseInfo() && (
            <div className="text-sm text-gray-600 font-medium bg-blue-50 px-3 py-1 rounded-lg">
              {getCourseInfo()}
            </div> */}
          {/* )} */}

          <div className="flex items-center gap-4">
            {user?.role !== 'admin' && (
              <div className="relative">
                <button
                  onClick={() => onNavigate?.('notifications')}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>
            )}

            <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <div className="text-left">
                <span className="text-sm font-semibold text-gray-700 block">{user?.name}</span>
                <span className="text-xs text-gray-500 capitalize">{user?.role}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
