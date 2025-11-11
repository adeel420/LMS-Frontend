import React, { useState } from 'react';
import { useEffect } from 'react';
import { FileText, Upload, Eye, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { databaseService } from '../../services/database';

const Submissions: React.FC = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!user) return;

      try {
        const data = await databaseService.getSubmissions(user.id);
        setSubmissions(data);
      } catch (error) {
        console.error('Error fetching submissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [user]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      // Here you would upload the file to Supabase Storage
      // For now, we'll create a submission record
      const newSubmission = {
        user_id: user.id,
        course_id: '1', // You'd get this from context or props
        title: `Assignment - ${file.name}`,
        content: `Uploaded file: ${file.name}`,
        status: 'pending' as const
      };

      await databaseService.createSubmission(newSubmission);
      
      // Refresh submissions
      const updatedSubmissions = await databaseService.getSubmissions(user.id);
      setSubmissions(updatedSubmissions);
    } catch (error) {
      console.error('Error uploading submission:', error);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'pending':
        return <Clock size={16} className="text-yellow-500" />;
      case 'rejected':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <Eye size={16} className="text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Submissions</h1>
        <p className="text-gray-600">Track your assignment submissions and feedback</p>
      </div>

      {/* Upload New Submission */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Submit New Assignment</h2>
          <Upload size={20} className="text-gray-400" />
        </div>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-2">Drop your files here or click to browse</p>
          <p className="text-sm text-gray-500">Supported formats: PDF, DOC, DOCX (Max size: 10MB)</p>
          <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Browse Files
          </button>
        </div>
      </div>

      {/* Submissions List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Your Submissions</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {submissions.length > 0 ? (
            submissions.map((submission) => (
              <div key={submission.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">{submission.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{submission.course}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>Submitted: {submission.submittedAt}</span>
                        </div>
                        {submission.grade && (
                          <div className="flex items-center gap-1">
                            <span>Grade: {submission.grade}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${getStatusColor(submission.status)}`}>
                      {getStatusIcon(submission.status)}
                      <span className="capitalize">{submission.status}</span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700">
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <p>No submissions yet</p>
              <p className="text-sm">Upload your first assignment to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Submissions;