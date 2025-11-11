import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, FileText, Download } from 'lucide-react';
import { apiService } from '../../services/api';

interface Task {
  _id: string;
  title: string;
  description: string;
  learner: { _id: string; username: string; email: string; userId?: string };
  status: string;
  resourceFiles?: string[];
  feedback?: {
    accessor?: string;
  };
  assessedAt?: {
    accessor?: string;
  };
  createdAt: string;
}

const MyAssessments: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'passed' | 'failed'>('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await apiService.getMyAssessments();
      setTasks(response);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return task.status !== 'submitted';
    if (filter === 'passed') return task.status === 'accessor_pass';
    if (filter === 'failed') return task.status === 'accessor_fail';
    return true;
  });

  const stats = {
    total: tasks.filter(t => t.status !== 'submitted').length,
    passed: tasks.filter(t => t.status === 'accessor_pass').length,
    failed: tasks.filter(t => t.status === 'accessor_fail').length,
    pending: tasks.filter(t => t.status === 'submitted').length
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Assessments</h1>
        <p className="text-gray-600">View all your completed assessments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Assessed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FileText className="text-blue-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Passed</p>
              <p className="text-2xl font-bold text-green-600">{stats.passed}</p>
            </div>
            <CheckCircle className="text-green-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Failed</p>
              <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
            </div>
            <XCircle className="text-red-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="text-yellow-500" size={24} />
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          All Assessments
        </button>
        <button
          onClick={() => setFilter('passed')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'passed' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Passed
        </button>
        <button
          onClick={() => setFilter('failed')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'failed' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Failed
        </button>
      </div>

      {/* Assessments List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {filter === 'all' ? 'All Assessments' : 
             filter === 'passed' ? 'Passed Assessments' : 'Failed Assessments'} 
            ({filteredTasks.length})
          </h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {filteredTasks.map((task) => (
            <div key={task._id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-2">{task.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span>Learner: {task.learner.userId ? `${task.learner.userId} - ${task.learner.username}` : task.learner.username}</span>
                    {task.assessedAt?.accessor && (
                      <span>Assessed: {new Date(task.assessedAt.accessor).toLocaleDateString()}</span>
                    )}
                    <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
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
                  
                  {task.submission?.files && task.submission.files.length > 0 && (
                    <div className="bg-green-50 p-3 rounded-lg mb-3">
                      <p className="text-sm font-medium text-green-800 mb-2">Learner Submissions:</p>
                      <div className="flex flex-wrap gap-2">
                        {task.submission.files.map((file, index) => (
                          <button
                            key={index}
                            onClick={() => window.open(file, '_blank')}
                            className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded text-xs hover:bg-green-200 transition-colors"
                          >
                            <Download size={12} />
                            {file.split('/').pop()}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {task.feedback?.accessor && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-1">Your Feedback:</p>
                      <p className="text-sm text-gray-600">{task.feedback.accessor}</p>
                    </div>
                  )}
                </div>
                
                <div className="ml-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    task.status === 'accessor_pass' ? 'bg-green-100 text-green-800' :
                    task.status === 'accessor_fail' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status === 'accessor_pass' ? 'PASSED' :
                     task.status === 'accessor_fail' ? 'FAILED' :
                     task.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredTasks.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <p>No assessments found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAssessments;