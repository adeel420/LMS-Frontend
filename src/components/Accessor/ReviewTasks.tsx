import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle, XCircle, FileText, Clock, Download } from 'lucide-react';
import { apiService } from '../../services/api';

interface Task {
  _id: string;
  title: string;
  description: string;
  learner: { _id: string; username: string; email: string; userId?: string };
  status: string;
  resourceFiles?: string[];
  submission?: {
    content: string;
    files: string[];
    submittedAt: string;
  };
  createdAt: string;
}

const ReviewTasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewingTask, setReviewingTask] = useState<Task | null>(null);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await apiService.getSubmittedTasks();
      setTasks(response);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (result: 'pass' | 'fail') => {
    if (!reviewingTask || !feedback.trim()) {
      alert('Please provide feedback');
      return;
    }

    try {
      await apiService.assessTask(reviewingTask._id, result, feedback);
      setReviewingTask(null);
      setFeedback('');
      fetchTasks();
      alert(`Task ${result === 'pass' ? 'passed' : 'failed'} successfully!`);
    } catch (error) {
      console.error('Error reviewing task:', error);
      alert('Error reviewing task');
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Review Tasks</h1>
        <p className="text-gray-600">Assess learner submissions</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Submitted Tasks ({tasks.filter(task => task.status === 'submitted').length})</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {tasks.filter(task => task.status === 'submitted').map((task) => (
            <div key={task._id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-2">{task.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span>Learner: {task.learner.userId ? `${task.learner.userId} - ${task.learner.username}` : task.learner.username}</span>
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
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Submission Content:</h4>
                      <p className="text-sm text-gray-700">{task.submission.content}</p>
                      {task.submission.files.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700">Files:</p>
                          {task.submission.files.map((file, index) => (
                            <div key={index} className="flex items-center gap-2 mt-1">
                              <FileText size={14} />
                              <a href={file} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                                View File {index + 1}
                              </a>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <button 
                    onClick={() => setReviewingTask(task)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Eye size={16} />
                    Review
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {tasks.filter(task => task.status === 'submitted').length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <Clock size={48} className="mx-auto text-gray-300 mb-4" />
            <p>No tasks awaiting review</p>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Review Task: {reviewingTask.title}</h2>
            
            <div className="mb-4">
              <h3 className="font-medium text-gray-900 mb-2">Task Description:</h3>
              <p className="text-gray-700">{reviewingTask.description}</p>
            </div>
            
            {reviewingTask.resourceFiles && reviewingTask.resourceFiles.length > 0 && (
              <div className="mb-4">
                <h3 className="font-medium text-gray-900 mb-2">Admin Resources:</h3>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex flex-wrap gap-2">
                    {reviewingTask.resourceFiles.map((file, index) => (
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
            
            <div className="mb-4">
              <h3 className="font-medium text-gray-900 mb-2">Learner: {reviewingTask.learner.userId ? `${reviewingTask.learner.userId} - ${reviewingTask.learner.username}` : reviewingTask.learner.username}</h3>
            </div>
            
            {reviewingTask.submission && (
              <div className="mb-4">
                <h3 className="font-medium text-gray-900 mb-2">Submission:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{reviewingTask.submission.content}</p>
                </div>
              </div>
            )}
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Feedback *</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Provide detailed feedback for the learner..."
                required
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => handleReview('pass')}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <CheckCircle size={16} />
                Pass
              </button>
              <button
                onClick={() => handleReview('fail')}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
              >
                <XCircle size={16} />
                Fail
              </button>
              <button
                onClick={() => {
                  setReviewingTask(null);
                  setFeedback('');
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewTasks;