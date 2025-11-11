import React, { useState, useEffect } from 'react';
import { Bell, Download, Eye, Check, CheckCircle, FileText } from 'lucide-react';
import { apiService } from '../../services/api';

const LearnerNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [taskResources, setTaskResources] = useState<any>(null);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      const filterParam = filter !== 'all' ? filter : undefined;
      const data = await apiService.getNotifications(filterParam);
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await apiService.markNotificationAsRead(id);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const fetchTaskResources = async (taskId: string) => {
    try {
      const tasks = await apiService.getLearnerTasks();
      const task = tasks.find((t: any) => t._id === taskId);
      setTaskResources(task);
    } catch (error) {
      console.error('Error fetching task resources:', error);
    }
  };

  const handleDownload = (url: string) => {
    window.open(url, '_blank');
  };

  const getFileNameFromUrl = (url: string) => {
    return url.split('/').pop() || 'document';
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Bell size={24} className="text-blue-500" />
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200 flex items-center gap-4">
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'All' },
              { key: 'unread', label: 'Unread' },
              { key: 'read', label: 'Read' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  filter === tab.key
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={async () => {
                try {
                  await apiService.clearAllNotifications();
                  fetchNotifications();
                  alert('All notifications cleared!');
                } catch (error) {
                  console.error('Error clearing notifications:', error);
                  alert('Error clearing notifications');
                }
              }}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
            >
              Clear All
            </button>
            <input
              type="search"
              placeholder="Search..."
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attachment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Loading notifications...
                  </td>
                </tr>
              ) : notifications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No notifications found
                  </td>
                </tr>
              ) : (
                notifications.map((notification, index) => (
                  <tr key={notification._id} className={`hover:bg-gray-50 ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        {index + 1}
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{notification.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-md">
                      <div className="truncate" title={notification.message}>
                        {notification.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {notification.relatedTask ? (
                        <button 
                          onClick={() => fetchTaskResources(notification.relatedTask._id)}
                          className="text-blue-600 hover:text-blue-700"
                          title="View task resources"
                        >
                          <Download size={16} />
                        </button>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(notification.createdAt).toLocaleDateString()} {new Date(notification.createdAt).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {!notification.read && (
                        <button 
                          onClick={() => markAsRead(notification._id)}
                          className="text-green-600 hover:text-green-700 mr-3"
                          title="Mark as read"
                        >
                          <Check size={16} />
                        </button>
                      )}
                      <button 
                        onClick={() => setSelectedNotification(notification)}
                        className="text-blue-600 hover:text-blue-700"
                        title="View details"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 text-center text-gray-500 text-sm border-t">
          Showing 1 to {notifications.length} of {notifications.length} entries
        </div>
      </div>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">{selectedNotification.title}</h2>
                <button 
                  onClick={() => setSelectedNotification(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Message</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedNotification.message}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1">Type</h3>
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm capitalize">
                      {selectedNotification.type}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1">Status</h3>
                    <span className={`inline-block px-2 py-1 rounded text-sm ${
                      selectedNotification.read ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedNotification.read ? 'Read' : 'Unread'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">Date & Time</h3>
                  <p className="text-gray-600">
                    {new Date(selectedNotification.createdAt).toLocaleDateString()} at {new Date(selectedNotification.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                
                {selectedNotification.relatedTask && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1">Related Task</h3>
                    <p className="text-gray-600">{selectedNotification.relatedTask.title}</p>
                  </div>
                )}
                
                {taskResources && taskResources.resourceFiles && taskResources.resourceFiles.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Task Resources</h3>
                    <div className="space-y-2">
                      {taskResources.resourceFiles.map((file: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          <FileText size={14} />
                          <span className="flex-1">{getFileNameFromUrl(file)}</span>
                          <button
                            onClick={() => handleDownload(file)}
                            className="text-blue-600 hover:text-blue-700"
                            title="Download"
                          >
                            <Download size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                {!selectedNotification.read && (
                  <button 
                    onClick={() => {
                      markAsRead(selectedNotification._id);
                      setSelectedNotification(null);
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Mark as Read
                  </button>
                )}

                <button 
                  onClick={() => setSelectedNotification(null)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearnerNotifications;