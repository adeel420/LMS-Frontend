import React, { useState, useEffect } from 'react';
import { Award, FileText, CheckCircle, XCircle, Eye, Filter, Download } from 'lucide-react';
import { apiService } from '../../services/api';

const IQAAssessments: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState<any>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await apiService.getIQATasks();
      setTasks(response);
    } catch (error) {
      console.error('Error fetching IQA assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'pending') return task.status === 'accessor_pass';
    if (filter === 'approved') return task.status === 'iqa_pass';
    if (filter === 'rejected') return task.status === 'iqa_fail';
    return true;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accessor_pass': return 'bg-yellow-100 text-yellow-800';
      case 'iqa_pass': return 'bg-green-100 text-green-800';
      case 'iqa_fail': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accessor_pass': return 'Pending IQA';
      case 'iqa_pass': return 'IQA Approved';
      case 'iqa_fail': return 'IQA Rejected';
      default: return status.replace('_', ' ');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">IQA Assessments</h1>
        <p className="text-gray-600">View all assessments and their IQA status</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">All Assessments</h2>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending IQA</option>
              <option value="approved">IQA Approved</option>
              <option value="rejected">IQA Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Learner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accessor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IQA</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Loading assessments...
                  </td>
                </tr>
              ) : filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No assessments found
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task, index) => (
                  <tr key={task._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{task.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{task.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {task.learner?.learnerID ? `${task.learner.learnerID} - ${task.learner.username}` : task.learner?.username || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {task.accessor?.username || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {task.iqa?.learnerID ? `${task.iqa.learnerID} - ${task.iqa.username}` : task.iqa?.username || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                        {getStatusText(task.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {task.submission?.submittedAt ? new Date(task.submission.submittedAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button 
                        onClick={() => setSelectedTask(task)}
                        className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <Eye size={14} />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 text-center text-gray-500 text-sm border-t">
          Showing {filteredTasks.length} of {tasks.length} assessments
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Assessments</p>
              <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
            </div>
            <Award className="text-blue-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending IQA</p>
              <p className="text-2xl font-bold text-yellow-600">{tasks.filter(t => t.status === 'accessor_pass').length}</p>
            </div>
            <Award className="text-yellow-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">IQA Approved</p>
              <p className="text-2xl font-bold text-green-600">{tasks.filter(t => t.status === 'iqa_pass').length}</p>
            </div>
            <CheckCircle className="text-green-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">IQA Rejected</p>
              <p className="text-2xl font-bold text-red-600">{tasks.filter(t => t.status === 'iqa_fail').length}</p>
            </div>
            <XCircle className="text-red-500" size={24} />
          </div>
        </div>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Assessment Details: {selectedTask.title}</h2>
                <button 
                  onClick={() => setSelectedTask(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Task Description</h3>
                  <p className="text-gray-600">{selectedTask.description}</p>
                </div>
                
                {selectedTask.resourceFiles && selectedTask.resourceFiles.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Admin Resources</h3>
                    <div className="bg-blue-50 p-3 rounded">
                      <div className="flex flex-wrap gap-2">
                        {selectedTask.resourceFiles.map((file, index) => (
                          <button
                            key={index}
                            onClick={() => window.open(file, '_blank')}
                            className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm hover:bg-blue-200 transition-colors"
                          >
                            <Download size={12} />
                            {file.split('/').pop()}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1">Learner</h3>
                    <p className="text-gray-600">{selectedTask.learner?.learnerID ? `${selectedTask.learner.learnerID} - ${selectedTask.learner.username}` : selectedTask.learner?.username || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1">Accessor</h3>
                    <p className="text-gray-600">{selectedTask.accessor?.username || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1">IQA</h3>
                    <p className="text-gray-600">{selectedTask.iqa?.learnerID ? `${selectedTask.iqa.learnerID} - ${selectedTask.iqa.username}` : selectedTask.iqa?.username || 'N/A'}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">Status</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedTask.status)}`}>
                    {getStatusText(selectedTask.status)}
                  </span>
                </div>
                
                {selectedTask.submission && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Learner Submission</h3>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-gray-700 mb-2">{selectedTask.submission.content}</p>
                      {selectedTask.submission.files && selectedTask.submission.files.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {selectedTask.submission.files.map((file, index) => (
                            <button
                              key={index}
                              onClick={() => window.open(file, '_blank')}
                              className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded text-sm hover:bg-green-200 transition-colors"
                            >
                              <Download size={12} />
                              {file.split('/').pop()}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {selectedTask.feedback?.accessor && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Accessor Feedback</h3>
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-blue-700">{selectedTask.feedback.accessor}</p>
                    </div>
                  </div>
                )}
                
                {selectedTask.feedback?.iqa && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">IQA Feedback</h3>
                    <div className="bg-purple-50 p-3 rounded">
                      <p className="text-purple-700">{selectedTask.feedback.iqa}</p>
                    </div>
                  </div>
                )}
                
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">Submitted Date</h3>
                  <p className="text-gray-600">
                    {selectedTask.submission?.submittedAt ? new Date(selectedTask.submission.submittedAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end mt-6 pt-4 border-t">
                <button 
                  onClick={() => setSelectedTask(null)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
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

export default IQAAssessments;