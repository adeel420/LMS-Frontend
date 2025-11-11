import React, { useState, useEffect } from 'react';
import { Users, Mail, Calendar, BookOpen } from 'lucide-react';
import { apiService } from '../../services/api';

interface Task {
  _id: string;
  title: string;
  status: string;
  learner: { _id: string; username: string; email: string };
  createdAt: string;
}

interface LearnerStats {
  learnerId: string;
  learnerName: string;
  learnerEmail: string;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  passedTasks: number;
  failedTasks: number;
}

const MyLearners: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [learners, setLearners] = useState<LearnerStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await apiService.getAccessorTasks();
      setTasks(response);
      
      // Group tasks by learner
      const learnerMap = new Map<string, LearnerStats>();
      
      response.forEach((task: Task) => {
        const learnerId = task.learner._id;
        if (!learnerMap.has(learnerId)) {
          learnerMap.set(learnerId, {
            learnerId,
            learnerName: task.learner.username,
            learnerEmail: task.learner.email,
            totalTasks: 0,
            completedTasks: 0,
            pendingTasks: 0,
            passedTasks: 0,
            failedTasks: 0
          });
        }
        
        const learner = learnerMap.get(learnerId)!;
        learner.totalTasks++;
        
        if (task.status === 'completed') learner.completedTasks++;
        else if (task.status === 'submitted') learner.pendingTasks++;
        else if (task.status === 'accessor_pass') learner.passedTasks++;
        else if (task.status === 'accessor_fail') learner.failedTasks++;
      });
      
      setLearners(Array.from(learnerMap.values()));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Learners</h1>
        <p className="text-gray-600">Manage and track your assigned learners</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Learners</p>
              <p className="text-2xl font-bold text-gray-900">{learners.length}</p>
            </div>
            <Users className="text-blue-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
            </div>
            <BookOpen className="text-green-500" size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending Reviews</p>
              <p className="text-2xl font-bold text-gray-900">{tasks.filter(t => t.status === 'submitted').length}</p>
            </div>
            <Calendar className="text-yellow-500" size={24} />
          </div>
        </div>
      </div>

      {/* Learners List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Learner Progress</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {learners.map((learner) => (
            <div key={learner.learnerId} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{learner.learnerName}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Mail size={14} />
                        <span>{learner.learnerEmail}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">{learner.totalTasks}</div>
                      <div className="text-gray-500">Total Tasks</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-yellow-600">{learner.pendingTasks}</div>
                      <div className="text-gray-500">Pending</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-green-600">{learner.passedTasks}</div>
                      <div className="text-gray-500">Passed</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-red-600">{learner.failedTasks}</div>
                      <div className="text-gray-500">Failed</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-blue-600">{learner.completedTasks}</div>
                      <div className="text-gray-500">Completed</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {learners.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <Users size={48} className="mx-auto text-gray-300 mb-4" />
            <p>No learners assigned yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLearners;