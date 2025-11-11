import React, { useState, useEffect } from 'react';
import { BookOpen, Download, Eye } from 'lucide-react';
import { apiService } from '../../services/api';

interface TaskResource {
  _id: string;
  title: string;
  description: string;
  resourceFiles: string[];
  course: { _id: string; title: string; code: string };
  createdAt: string;
}

const LearnerResources: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all-documents');
  const [tasks, setTasks] = useState<TaskResource[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<TaskResource[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchTerm]);

  const fetchTasks = async () => {
    try {
      const response = await apiService.getLearnerResources();
      console.log('Resources response:', response);
      console.log('First task course:', response[0]?.course);
      setTasks(response);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    let filtered = tasks;

    if (searchTerm) {
      filtered = tasks.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTasks(filtered);
  };

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = (url: string) => {
    window.open(url, '_blank');
  };

  const getFileNameFromUrl = (url: string) => {
    return url.split('/').pop() || 'document';
  };

  const staticResources = [
    { id: '1', title: 'CPD Activities Form', file_url: '#' },
    { id: '2', title: 'ProQual Candidate Statement Form', file_url: '#' },
    { id: '3', title: 'Assessment Plan_Essential Evidence List', file_url: '#' },
    { id: '4', title: 'Induction Form - ICT Guide', file_url: '#' },
    { id: '5', title: 'ICT Qualifications Candidate Assessment Plan', file_url: '#' },
    { id: '6', title: 'Language Proficiency Form', file_url: '#' },
    { id: '7', title: 'Statement of authenticity', file_url: '#' },
    { id: '8', title: 'Registration and Equal Opportunities Form', file_url: '#' },
    { id: '9', title: 'Continuing Professional Development record', file_url: '#' },
    { id: '10', title: 'Course Handbook', file_url: '#' }
  ];

  const displayResources = filteredTasks;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={24} className="text-blue-500" />
          <h1 className="text-2xl font-bold text-gray-900">Resources</h1>
        </div>


      </div>

      <div className="bg-white rounded-lg shadow-sm">
        {/* <div className="p-4 border-b border-gray-200 flex items-center gap-4">
          <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm">Copy</button>
          <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm">Excel</button>
          <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm">CSV</button>
          <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm">PDF</button>
          <div className="ml-auto">
            <input
              type="search"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
        </div> */}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resources Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attachment</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : displayResources.length > 0 ? (
                displayResources.map((task, index) =>
                  task.resourceFiles.map((fileUrl, fileIndex) => (
                    <tr key={`${task._id}-${fileIndex}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}.{fileIndex + 1}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-md">
                        <div className="font-medium">{task.title}</div>
                        <div className="text-gray-500 text-xs">{getFileNameFromUrl(fileUrl)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={() => handleView(fileUrl)}
                          className="text-blue-600 hover:text-blue-700 mr-3"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDownload(fileUrl, getFileNameFromUrl(fileUrl))}
                          className="text-green-600 hover:text-green-700"
                          title="Download"
                        >
                          <Download size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                    No task resources available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 text-center text-gray-500 text-sm border-t">
          Showing {displayResources.reduce((acc, task) => acc + task.resourceFiles.length, 0)} task resources
        </div>
      </div>
    </div>
  );
};

export default LearnerResources;