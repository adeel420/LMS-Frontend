import React, { useState, useEffect } from 'react';
import { Download, FileText, Award, Calendar, Eye, BarChart3 } from 'lucide-react';
import { apiService } from '../../services/api';

const EQADashboard: React.FC = () => {
  const [approvedTasks, setApprovedTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [reviewResult, setReviewResult] = useState('');
  const [feedback, setFeedback] = useState('');
  const [accessorCount, setAccessorCount] = useState(0);

  useEffect(() => {
    fetchTasks();
    fetchAccessorCount();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await apiService.getEQATasks();
      setApprovedTasks(response);
    } catch (error) {
      console.error('Error fetching EQA tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccessorCount = async () => {
    try {
      const users = await apiService.getUsers();
      const accessors = users.filter((user: any) => user.role === 'accessor');
      setAccessorCount(accessors.length);
    } catch (error) {
      console.error('Error fetching accessor count:', error);
    }
  };

  const handleReview = async () => {
    if (!selectedTask || !reviewResult || !feedback) return;
    
    try {
      await apiService.reviewTaskEQA(selectedTask._id, reviewResult, feedback);
      
      // Update task status locally instead of refetching
      setApprovedTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === selectedTask._id 
            ? { 
                ...task, 
                status: reviewResult === 'approve' ? 'eqa_pass' : 'eqa_fail',
                feedback: { 
                  ...task.feedback, 
                  eqa: feedback 
                }
              }
            : task
        )
      );
      
      setSelectedTask(null);
      setReviewResult('');
      setFeedback('');
    } catch (error) {
      console.error('Error reviewing task:', error);
    }
  };

  const stats = [
    {
      title: 'Pending EQA Reviews',
      value: approvedTasks.filter(t => t.status === 'iqa_pass').length.toString(),
      icon: Award,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'EQA Approved',
      value: approvedTasks.filter(t => t.status === 'eqa_pass').length.toString(),
      icon: Download,
      color: 'bg-green-500',
      bgColor: 'bg-green-100'
    },
    {
      title: 'EQA Rejected',
      value: approvedTasks.filter(t => t.status === 'eqa_fail').length.toString(),
      icon: BarChart3,
      color: 'bg-red-500',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Active Accessors',
      value: accessorCount.toString(),
      icon: Calendar,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-100'
    }
  ];

  const handleDownloadTask = (taskId: string) => {
    // Handle task download logic
    console.log('Downloading task:', taskId);
    alert('Download functionality would be implemented here');
  };

  const handleBulkDownload = () => {
    // Handle bulk download logic
    console.log('Bulk download initiated');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">EQA Dashboard</h1>
        <p className="text-gray-600">External Quality Assurance - Download approved tasks and audit data</p>
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
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Bulk Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Bulk Actions</h2>
          <div className="flex gap-3">
            <button
              onClick={handleBulkDownload}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Download size={16} />
              Download All Approved Tasks
            </button>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <BarChart3 size={16} />
              Generate Audit Report
            </button>
          </div>
        </div>
      </div>

      {/* Approved Tasks */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">EQA Approved Tasks</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading tasks...
            </div>
          ) : approvedTasks.map((task) => (
            <div key={task._id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-2">{task.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-500 mb-4">
                    <div>
                      <span className="font-medium">Learner:</span> {task.learner?.username}
                    </div>
                    <div>
                      <span className="font-medium">Submitted:</span> {task.submission?.submittedAt ? new Date(task.submission.submittedAt).toLocaleDateString() : 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">IQA Status:</span> {task.status.includes('iqa') ? 'Approved' : 'Pending'}
                    </div>
                    <div>
                      <span className="font-medium">Current Status:</span> {task.status.replace('_', ' ')}
                    </div>
                  </div>
                  
                  {task.submission?.files && task.submission.files.length > 0 && (
                    <div className="flex items-center gap-2 mb-4">
                      {task.submission.files.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded">
                          <FileText size={14} />
                          <span className="text-sm">{file}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {task.feedback?.iqa && (
                    <div className="bg-purple-50 p-3 rounded-lg mb-4">
                      <p className="text-sm font-medium text-purple-800 mb-1">IQA Feedback:</p>
                      <p className="text-sm text-purple-700">{task.feedback.iqa}</p>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      task.status === 'eqa_approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {task.status === 'eqa_approved' ? 'EQA Approved' : 'Awaiting EQA'}
                    </span>
                    {task.status === 'eqa_approved' && (
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        Ready for Download
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2">
                    <Eye size={16} />
                    View
                  </button>
                  {task.status === 'iqa_pass' && (
                    <button 
                      onClick={() => setSelectedTask(task)}
                      className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
                    >
                      <Award size={16} />
                      EQA Review
                    </button>
                  )}
                  {task.status === 'eqa_approved' && (
                    <button
                      onClick={() => handleDownloadTask(task._id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <Download size={16} />
                      Download
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {approvedTasks.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <Award size={48} className="mx-auto text-gray-300 mb-4" />
            <p>No EQA approved tasks available</p>
          </div>
        )}
      </div>

      {/* Compliance Summary */}
      <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">98%</div>
            <div className="text-sm text-gray-600">Overall Compliance Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">156</div>
            <div className="text-sm text-gray-600">Tasks Processed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">12</div>
            <div className="text-sm text-gray-600">Audit Reports Generated</div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">EQA Review: {selectedTask.title}</h2>
                <button 
                  onClick={() => setSelectedTask(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Task Details</h3>
                  <p className="text-gray-600">{selectedTask.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1">Learner</h3>
                    <p className="text-gray-600">{selectedTask.learner?.username}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1">IQA Decision</h3>
                    <span className="text-green-600 font-medium">Pass</span>
                  </div>
                </div>
                
                {selectedTask.submission?.content && (
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Submission Content</h3>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-gray-700">{selectedTask.submission.content}</p>
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
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">EQA Decision</label>
                  <select 
                    value={reviewResult}
                    onChange={(e) => setReviewResult(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">Select decision</option>
                    <option value="approve">Approve</option>
                    <option value="reject">Reject</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">EQA Feedback</label>
                  <textarea 
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24"
                    placeholder="Enter your feedback..."
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button 
                  onClick={() => setSelectedTask(null)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleReview}
                  disabled={!reviewResult || !feedback}
                  className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:opacity-50"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EQADashboard;