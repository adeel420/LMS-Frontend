import React, { useState, useEffect } from 'react';
import { Plus, FileText, Upload, Eye, Calendar, CheckCircle, Clock, XCircle, Download } from 'lucide-react';
import { apiService } from '../../services/api';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  resourceFiles?: string[];
  submission?: {
    content: string;
    files: string[];
    submittedAt: string;
  };
  feedback?: {
    accessor?: string;
  };
  createdAt: string;
}

const LearnerSubmissions: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingTask, setSubmittingTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [submissionContent, setSubmissionContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await apiService.getLearnerTasks();
      console.log('Tasks response:', response);
      console.log('Tasks with resourceFiles:', response.filter((task: Task) => task.resourceFiles && task.resourceFiles.length > 0));
      setTasks(response);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingTask || !submissionContent.trim()) {
      alert('Please provide submission content');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('content', submissionContent);
      files.forEach(file => {
        formData.append('files', file);
      });

      await apiService.submitTask(submittingTask._id, formData);
      setSubmittingTask(null);
      setSubmissionContent('');
      setFiles([]);
      fetchTasks();
      alert('Task submitted successfully!');
    } catch (error) {
      console.error('Error submitting task:', error);
      alert('Error submitting task');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Clock size={16} className="text-blue-500" />;
      case 'accessor_pass':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'accessor_fail':
        return <XCircle size={16} className="text-red-500" />;
      case 'iqa_pass':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'eqa_approved':
        return <CheckCircle size={16} className="text-purple-500" />;
      default:
        return <Clock size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'accessor_pass':
        return 'bg-green-100 text-green-800';
      case 'accessor_fail':
        return 'bg-red-100 text-red-800';
      case 'iqa_pass':
        return 'bg-green-100 text-green-800';
      case 'eqa_approved':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'Submitted';
      case 'accessor_review':
        return 'Under Review';
      case 'accessor_pass':
        return 'Passed by Accessor';
      case 'accessor_fail':
        return 'Failed - Needs Resubmission';
      case 'iqa_review':
        return 'IQA Review';
      case 'iqa_pass':
        return 'Passed by IQA';
      case 'iqa_fail':
        return 'Failed by IQA';
      case 'eqa_approved':
        return 'EQA Approved';
      default:
        return status;
    }
  };

  const handleDownload = (url: string) => {
    window.open(url, '_blank');
  };

  const getFileNameFromUrl = (url: string) => {
    return url.split('/').pop() || 'document';
  };

  if (submittingTask) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Submit Task: {submittingTask.title}</h1>
          <button
            onClick={() => setSubmittingTask(null)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Tasks
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-4">
            <h3 className="font-medium text-gray-900 mb-2">Task Description:</h3>
            <p className="text-gray-700">{submittingTask.description}</p>
          </div>

          {submittingTask.resourceFiles && submittingTask.resourceFiles.length > 0 && (
            <div className="mb-4">
              <h3 className="font-medium text-gray-900 mb-2">Task Resources:</h3>
              <div className="space-y-2">
                {submittingTask.resourceFiles.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    <FileText size={14} />
                    <span className="flex-1">{getFileNameFromUrl(file)}</span>
                    <button
                      type="button"
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Submission Content <span className="text-red-500">*</span>
              </label>
              <textarea
                value={submissionContent}
                onChange={(e) => setSubmissionContent(e.target.value)}
                placeholder="Provide your submission content here..."
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachments (Optional)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <label
                  htmlFor="file-upload"
                  className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Upload size={16} />
                  Choose Files
                </label>
                <span className="text-sm text-gray-500">
                  {files.length} file(s) selected
                </span>
              </div>
              {files.length > 0 && (
                <div className="mt-2 space-y-1">
                  {files.map((file, index) => (
                    <div key={index} className="text-sm text-gray-600 flex items-center gap-2">
                      <FileText size={14} />
                      {file.name} ({(file.size / 1024).toFixed(1)} KB)
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-teal-500 text-white px-6 py-2 rounded-lg hover:bg-teal-600 transition-colors"
              >
                Submit Task
              </button>
              <button
                type="button"
                onClick={() => setSubmittingTask(null)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (viewingTask) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Task Details: {viewingTask.title}</h1>
          <button
            onClick={() => setViewingTask(null)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Tasks
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700">{viewingTask.description}</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Status</h3>
            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${getStatusColor(viewingTask.status)}`}>
              {getStatusIcon(viewingTask.status)}
              <span>{getStatusLabel(viewingTask.status)}</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Created</h3>
            <p className="text-gray-700">{new Date(viewingTask.createdAt).toLocaleDateString()}</p>
          </div>

          {viewingTask.resourceFiles && viewingTask.resourceFiles.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Task Resources</h3>
              <div className="space-y-2">
                {viewingTask.resourceFiles.map((file, index) => (
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

          {viewingTask.submission && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Your Submission</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-3">{viewingTask.submission.content}</p>
                <div className="text-sm text-gray-600">
                  Submitted: {new Date(viewingTask.submission.submittedAt).toLocaleDateString()}
                </div>
                {viewingTask.submission.files.length > 0 && (
                  <div className="mt-3">
                    <div className="text-sm font-medium text-gray-700 mb-2">Attachments:</div>
                    {viewingTask.submission.files.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
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
                )}
              </div>
            </div>
          )}

          {viewingTask.feedback?.accessor && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Feedback</h3>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-700">{viewingTask.feedback.accessor}</p>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            {(viewingTask.status === 'assigned' || viewingTask.status === 'accessor_fail') && (
              <button
                onClick={() => {
                  setViewingTask(null);
                  setSubmittingTask(viewingTask);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Submit Task
              </button>
            )}
            <button
              onClick={() => setViewingTask(null)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Tasks</h1>
        <p className="text-gray-600">View and submit your assigned tasks</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm">


        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resources</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No tasks assigned yet
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{task.title}</div>
                        <div className="text-sm text-gray-500">{task.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${getStatusColor(task.status)}`}>
                        {getStatusIcon(task.status)}
                        <span>{getStatusLabel(task.status)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {task.submission?.submittedAt ?
                        new Date(task.submission.submittedAt).toLocaleDateString() :
                        'Not submitted'
                      }
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {task.feedback?.accessor || 'No feedback yet'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {task.resourceFiles && task.resourceFiles.length > 0 ? (
                        task.resourceFiles.length === 1 ? (
                          <button
                            onClick={() => handleDownload(task.resourceFiles[0])}
                            className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 flex items-center gap-1"
                            title="Download Resource"
                          >
                            <Download size={12} />
                            Download
                          </button>
                        ) : (
                          <div className="space-y-1">
                            {task.resourceFiles.map((file, index) => (
                              <button
                                key={index}
                                onClick={() => handleDownload(file)}
                                className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 flex items-center gap-1 text-xs"
                                title={`Download ${getFileNameFromUrl(file)}`}
                              >
                                <Download size={10} />
                                {index + 1}
                              </button>
                            ))}
                          </div>
                        )
                      ) : (
                        <span className="text-gray-400">No files</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {(task.status === 'assigned' || task.status === 'accessor_fail') && (
                        <button
                          onClick={() => setSubmittingTask(task)}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 mr-2"
                        >
                          Submit
                        </button>
                      )}
                      <button
                        onClick={() => setViewingTask(task)}
                        className="text-blue-600 hover:text-blue-700"
                        title="View Details"
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

        {tasks.length === 0 && (
          <div className="p-4 text-center text-gray-500 text-sm">
            Showing 0 to 0 of 0 entries
          </div>
        )}
      </div>
    </div>
  );
};

export default LearnerSubmissions;