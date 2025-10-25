import React, { useState, useEffect } from 'react';
import { Award, FileText, CheckCircle, XCircle, Eye } from 'lucide-react';
import { apiService } from '../../services/api';

const IQAReviewTasks: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [reviewResult, setReviewResult] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await apiService.getIQATasks();
      setTasks(response.filter(t => t.status === 'accessor_pass'));
    } catch (error) {
      console.error('Error fetching IQA tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async () => {
    if (!selectedTask || !reviewResult || !feedback) return;
    
    try {
      await apiService.reviewTaskIQA(selectedTask._id, reviewResult, feedback);
      
      // Update task status locally instead of refetching
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === selectedTask._id 
            ? { 
                ...task, 
                status: reviewResult === 'pass' ? 'iqa_pass' : 'iqa_fail',
                feedback: { 
                  ...task.feedback, 
                  iqa: feedback 
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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">IQA Review Tasks</h1>
        <p className="text-gray-600">Review tasks that have passed accessor evaluation</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Tasks Awaiting IQA Review</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Award size={48} className="mx-auto text-gray-300 mb-4" />
              <p>No tasks awaiting IQA review</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task._id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-2">{task.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-4">
                      <div><span className="font-medium">Learner:</span> {task.learner?.username}</div>
                      <div><span className="font-medium">Submitted:</span> {task.submission?.submittedAt ? new Date(task.submission.submittedAt).toLocaleDateString() : 'N/A'}</div>
                      <div><span className="font-medium">Accessor:</span> {task.accessor?.username}</div>
                      <div><span className="font-medium">Status:</span> <span className="text-green-600">Accessor Pass</span></div>
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
                    
                    {task.feedback?.accessor && (
                      <div className="bg-blue-50 p-3 rounded-lg mb-4">
                        <p className="text-sm font-medium text-blue-800 mb-1">Accessor Feedback:</p>
                        <p className="text-sm text-blue-700">{task.feedback.accessor}</p>
                      </div>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => setSelectedTask(task)}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-2"
                  >
                    <Eye size={16} />
                    IQA Review
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">IQA Review: {selectedTask.title}</h2>
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
                    <h3 className="font-semibold text-gray-700 mb-1">Accessor Decision</h3>
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
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">IQA Decision</label>
                  <select 
                    value={reviewResult}
                    onChange={(e) => setReviewResult(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">Select decision</option>
                    <option value="pass">Pass</option>
                    <option value="fail">Fail</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">IQA Feedback</label>
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
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
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

export default IQAReviewTasks;