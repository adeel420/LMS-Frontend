import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, Calendar, Info, CheckCircle, AlertTriangle, FileText, Award } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';

const Notifications: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  useEffect(() => {
    fetchNotifications(activeFilter);
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(() => fetchNotifications(activeFilter), 30000);
    
    return () => clearInterval(interval);
  }, [activeFilter]);

  const fetchNotifications = async (filter?: string) => {
    try {
      const filterParam = filter && filter !== 'all' ? filter : undefined;
      const data = await apiService.getNotifications(filterParam);
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    fetchNotifications(filter);
  };

  const markAsRead = async (id: string) => {
    try {
      await apiService.markNotificationAsRead(id);
      // Refresh notifications to get updated data
      fetchNotifications(activeFilter);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const markAllAsRead = async () => {
    try {
      await apiService.markAllNotificationsAsRead();
      // Refresh notifications to get updated data
      fetchNotifications(activeFilter);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task_assigned':
        return <FileText size={20} className="text-blue-500" />;
      case 'task_submitted':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'task_reviewed':
        return <Award size={20} className="text-purple-500" />;
      case 'system':
        return <Info size={20} className="text-blue-500" />;
      default:
        return <Bell size={20} className="text-gray-500" />;
    }
  };



  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Notifications</h1>
            <p className="text-gray-600">Stay updated with your learning progress</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              <Bell size={16} />
              <span className="text-sm font-medium">{unreadCount} unread</span>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        {/* Filter Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6 py-4">
            {[
              { key: 'all', label: 'All' },
              { key: 'unread', label: 'Unread' },
              { key: 'read', label: 'Read' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleFilterChange(tab.key)}
                className={`pb-2 px-1 border-b-2 font-medium text-sm ${
                  activeFilter === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading notifications...
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification._id}
                className={`p-6 transition-colors ${
                  !notification.read ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </h3>
                        <p className="text-gray-600 mt-1 text-sm">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                          <Calendar size={12} />
                          <span>{new Date(notification.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification._id)}
                            className="p-1 text-blue-600 hover:text-blue-700"
                            title="Mark as read"
                          >
                            <Check size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification._id)}
                          className="p-1 text-red-600 hover:text-red-700"
                          title="Delete notification"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Bell size={48} className="mx-auto text-gray-300 mb-4" />
              <p>No notifications</p>
              <p className="text-sm">You're all caught up!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;