import React, { useState, useEffect } from 'react';
import { ClipboardCheck, Users, FileText, Clock, CheckCircle, XCircle, ArrowRight, Download } from 'lucide-react';
import { apiService } from '../../services/api';

interface Task {
  _id: string;
  title: string;
  description: string;
  learner: { _id: string; username: string; email: string };
  status: string;
  resourceFiles?: string[];
  submission?: {
    content: string;
    files: string[];
    submittedAt: string;
  };
  createdAt: string;
}

interface AccessorDashboardProps {
  onNavigate?: (section: string) => void;
}

const AccessorDashboard: React.FC<AccessorDashboardProps> = ({ onNavigate }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await apiService.getAccessorTasks();
      setTasks(response);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debug: Log task statuses
  console.log('Tasks and their statuses:', tasks.map(t => ({ title: t.title, status: t.status })));
  console.log('Failed tasks:', tasks.filter(t => t.status === 'accessor_fail'));

  const stats = [
    {
      title: 'Pending Reviews',
      value: tasks.filter(t => t.status === 'submitted').length.toString(),
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Passed Tasks',
      value: tasks.filter(t => t.status === 'accessor_pass').length.toString(),
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Failed Tasks',
      value: tasks.filter(t => t.status === 'accessor_fail').length.toString(),
      icon: XCircle,
      color: 'bg-red-500',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Total Tasks',
      value: tasks.length.toString(),
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-100'
    }
  ];

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Accessor Dashboard</h1>
        <p className="text-gray-600">Review and assess learner submissions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-700 font-semibold text-sm">{stat.title}</h3>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon size={20} className={`${stat.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Tasks Awaiting Review</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {tasks.filter(t => t.status === 'submitted').map((task) => (
            <div key={task._id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-2">{task.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span>Learner: {task.learner.username}</span>
                    <span>Submitted: {task.submission?.submittedAt ? 
                      new Date(task.submission.submittedAt).toLocaleDateString() : 
                      'Not submitted'
                    }</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      task.status === 'submitted' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {task.status.toUpperCase()}
                    </span>
                  </div>
                  
                  {task.resourceFiles && task.resourceFiles.length > 0 && (
                    <div className="bg-blue-50 p-3 rounded-lg mb-3">
                      <p className="text-sm font-medium text-blue-800 mb-2">Admin Resources:</p>
                      <div className="flex flex-wrap gap-2">
                        {task.resourceFiles.map((file, index) => (
                          <button
                            key={index}
                            onClick={() => window.open(file, '_blank')}
                            className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs hover:bg-blue-200 transition-colors"
                          >
                            <Download size={12} />
                            {file.split('/').pop()}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {task.submission && (
                    <div className="bg-gray-50 p-3 rounded-lg mb-4">
                      <p className="text-sm text-gray-700">{task.submission.content}</p>
                      {task.submission.files.length > 0 && (
                        <div className="flex items-center gap-2 mt-2">
                          <FileText size={14} />
                          <span className="text-sm text-gray-600">{task.submission.files.length} file(s) attached</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <button 
                    onClick={() => onNavigate?.('review-tasks')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <ArrowRight size={16} />
                    Go to Review Tab
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {tasks.filter(t => t.status === 'submitted').length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <ClipboardCheck size={48} className="mx-auto text-gray-300 mb-4" />
            <p>No tasks awaiting review</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessorDashboard;