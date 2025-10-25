import React, { useState, useEffect } from 'react';
import { UserCheck, Star, Calendar, Clock, FileText, MessageSquare } from 'lucide-react';
import { apiService } from '../../services/api';

interface AssessorInfo {
  id: string;
  name: string;
  email: string;
  specialization: string;
  rating: number;
  totalAssessments: number;
  avatar?: string;
}

interface Assessment {
  id: string;
  title: string;
  status: 'completed' | 'in-progress' | 'scheduled';
  scheduledDate: string;
  feedback?: string;
  grade?: number;
}

const Assessor: React.FC = () => {
  const [assessorInfo, setAssessorInfo] = useState<AssessorInfo | null>(null);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssessorData();
  }, []);

  const fetchAssessorData = async () => {
    try {
      const tasks = await apiService.getLearnerTasks();
      
      // Get unique accessor from tasks
      const accessorTasks = tasks.filter(task => task.accessor);
      if (accessorTasks.length > 0) {
        const accessor = accessorTasks[0].accessor;
        setAssessorInfo({
          id: accessor._id,
          name: accessor.username,
          email: accessor.email || `${accessor.username}@lms.com`,
          specialization: 'Learning Assessment',
          rating: 4.8,
          totalAssessments: accessorTasks.length
        });
      }
      
      // Convert tasks to assessments format
      const assessmentData = tasks.map(task => ({
        id: task._id,
        title: task.title,
        description: task.description,
        status: getAssessmentStatus(task.status),
        originalStatus: task.status,
        scheduledDate: new Date(task.createdAt).toLocaleDateString(),
        submittedDate: task.submission?.submittedAt ? new Date(task.submission.submittedAt).toLocaleDateString() : null,
        feedback: task.feedback?.accessor,
        grade: getGradeFromStatus(task.status),
        hasSubmission: !!task.submission
      }));
      
      setAssessments(assessmentData);
    } catch (error) {
      console.error('Error fetching assessor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAssessmentStatus = (taskStatus: string) => {
    switch (taskStatus) {
      case 'assigned':
        return 'scheduled';
      case 'submitted':
        return 'in-progress';
      case 'accessor_pass':
      case 'iqa_pass':
      case 'eqa_approved':
        return 'completed';
      default:
        return 'scheduled';
    }
  };

  const getGradeFromStatus = (status: string) => {
    if (status === 'accessor_pass') return 85;
    if (status === 'iqa_pass') return 90;
    if (status === 'eqa_approved') return 95;
    return undefined;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="text-center py-8">
          <div className="text-gray-500">Loading assessor information...</div>
        </div>
      </div>
    );
  }

  if (!assessorInfo) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="text-center py-8">
          <div className="text-gray-500">No assessor assigned yet</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Assessor</h1>
        <p className="text-gray-600">Connect with your assigned assessor and track your assessment progress</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assessor Profile */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCheck size={32} className="text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">{assessorInfo.name}</h2>
            <p className="text-sm text-gray-600 mb-3">{assessorInfo.specialization}</p>
            
            <div className="flex items-center justify-center gap-1 mb-3">
              {renderStars(assessorInfo.rating)}
              <span className="text-sm text-gray-600 ml-1">({assessorInfo.rating})</span>
            </div>
            
            <div className="text-sm text-gray-500 mb-4">
              {assessorInfo.totalAssessments} assessments completed
            </div>
            
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors mb-3">
              Contact Assessor
            </button>
            
            <div className="text-xs text-gray-500">
              {assessorInfo.email}
            </div>
          </div>
        </div>

        {/* Assessment Schedule */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Assessment Schedule</h2>
            <Calendar size={20} className="text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {assessments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                <p>No assessments scheduled yet</p>
              </div>
            ) : (
              assessments.map((assessment) => (
                <div key={assessment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-2">{assessment.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{assessment.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>Assigned: {assessment.scheduledDate}</span>
                        </div>
                        {assessment.submittedDate && (
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>Submitted: {assessment.submittedDate}</span>
                          </div>
                        )}
                        {assessment.grade && (
                          <div className="flex items-center gap-1">
                            <Star size={14} className="text-yellow-500" />
                            <span>Grade: {assessment.grade}%</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <FileText size={14} />
                          <span>Status: {assessment.originalStatus.replace('_', ' ')}</span>
                        </div>
                      </div>
                      
                      {assessment.feedback && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                          <div className="flex items-start gap-2">
                            <MessageSquare size={16} className="text-green-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-green-800 mb-1">Assessor Feedback</p>
                              <p className="text-sm text-green-700">{assessment.feedback}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {!assessment.hasSubmission && assessment.originalStatus === 'assigned' && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
                          <div className="flex items-start gap-2">
                            <Clock size={16} className="text-yellow-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-yellow-800 mb-1">Action Required</p>
                              <p className="text-sm text-yellow-700">This assessment is waiting for your submission.</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {assessment.originalStatus === 'accessor_pass' && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3">
                          <div className="flex items-start gap-2">
                            <FileText size={16} className="text-green-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-green-800 mb-1">Assessment Passed!</p>
                              <p className="text-sm text-green-700">Congratulations! Your assessor has approved this submission.</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {assessment.originalStatus === 'accessor_fail' && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
                          <div className="flex items-start gap-2">
                            <MessageSquare size={16} className="text-red-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-red-800 mb-1">Assessment Needs Revision</p>
                              <p className="text-sm text-red-700">Please review the feedback and resubmit your work.</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="ml-4 flex flex-col items-end gap-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(assessment.status)}`}>
                        {assessment.status === 'completed' && <FileText size={14} className="mr-1" />}
                        {assessment.status === 'in-progress' && <Clock size={14} className="mr-1" />}
                        {assessment.status === 'scheduled' && <Calendar size={14} className="mr-1" />}
                        {assessment.status.replace('-', ' ')}
                      </span>
                      
                      {assessment.originalStatus === 'assigned' && (
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                          Submit Work
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <Calendar size={20} className="text-blue-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Schedule Assessment</div>
              <div className="text-sm text-gray-600">Book your next assessment session</div>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <MessageSquare size={20} className="text-green-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Request Feedback</div>
              <div className="text-sm text-gray-600">Get detailed feedback on your work</div>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <FileText size={20} className="text-purple-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">View Portfolio</div>
              <div className="text-sm text-gray-600">Access your assessment portfolio</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assessor;