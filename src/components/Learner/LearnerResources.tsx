import React, { useState } from 'react';
import { BookOpen, Download, Eye } from 'lucide-react';
import { Resource } from '../../types';

const LearnerResources: React.FC = () => {
  const [activeTab, setActiveTab] = useState('view-qualification-units');
  const [resources] = useState<Resource[]>([
    {
      id: '1',
      title: 'CPD Activities Form',
      description: 'CPD Activities Form',
      type: 'qualification_unit',
      file_url: '#',
      course_id: '1',
      created_at: '2025-01-01'
    },
    {
      id: '2',
      title: 'ProQual Candidate Statement Form',
      description: 'ProQual Candidate Statement Form',
      type: 'qualification_unit',
      file_url: '#',
      course_id: '1',
      created_at: '2025-01-01'
    },
    {
      id: '3',
      title: 'Assessment Plan_Essential Evidence List_ProQual Level 6 NVQ Diploma in Occupational Health and Safety Practice_603.3105.9',
      description: 'Assessment Plan_Essential Evidence List_ProQual Level 6 NVQ Diploma in Occupational Health and Safety Practice_603.3105.9',
      type: 'qualification_unit',
      file_url: '#',
      course_id: '1',
      created_at: '2025-01-01'
    },
    {
      id: '4',
      title: 'Induction Form - Inspire College of Technologies Ltd (ICT) (ICT Guide)',
      description: 'Induction Form - Inspire College of Technologies Ltd (ICT) (ICT Guide)',
      type: 'qualification_unit',
      file_url: '#',
      course_id: '1',
      created_at: '2025-01-01'
    },
    {
      id: '5',
      title: 'ICT Qualifications Candidate Assessment Plan ProQual Level 6 NVQ Diploma in Occupational Health and Safety Practice',
      description: 'ICT Qualifications Candidate Assessment Plan ProQual Level 6 NVQ Diploma in Occupational Health and Safety Practice',
      type: 'qualification_unit',
      file_url: '#',
      course_id: '1',
      created_at: '2025-01-01'
    },
    {
      id: '6',
      title: 'EL Industrial and Eng Hm Language Proficiency V4.1 30 January 2025',
      description: 'EL Industrial and Eng Hm Language Proficiency V4.1 30 January 2025',
      type: 'qualification_unit',
      file_url: '#',
      course_id: '1',
      created_at: '2025-01-01'
    },
    {
      id: '7',
      title: 'EL Industrial and Eng Hm Language Proficiency V4.1 29 January 2025',
      description: 'EL Industrial and Eng Hm Language Proficiency V4.1 29 January 2025',
      type: 'qualification_unit',
      file_url: '#',
      course_id: '1',
      created_at: '2025-01-01'
    },
    {
      id: '8',
      title: 'Statement of authenticity',
      description: 'Statement of authenticity',
      type: 'qualification_unit',
      file_url: '#',
      course_id: '1',
      created_at: '2025-01-01'
    },
    {
      id: '9',
      title: '001 - ICT Gap Qualifications Registration and Equal Opportunities Form',
      description: '001 - ICT Gap Qualifications Registration and Equal Opportunities Form',
      type: 'qualification_unit',
      file_url: '#',
      course_id: '1',
      created_at: '2025-01-01'
    },
    {
      id: '10',
      title: 'Continuing Professional Development record',
      description: 'Continuing Professional Development record',
      type: 'qualification_unit',
      file_url: '#',
      course_id: '1',
      created_at: '2025-01-01'
    },
    {
      id: '11',
      title: 'ProQual NVQ Level 6 Diploma in Occupational Health & Safety Practice - Course Handbook',
      description: 'ProQual NVQ Level 6 Diploma in Occupational Health & Safety Practice - Course Handbook',
      type: 'qualification_unit',
      file_url: '#',
      course_id: '1',
      created_at: '2025-01-01'
    }
  ]);

  const tabs = [
    { id: 'view-qualification-units', label: 'View Qualification Units', color: 'bg-blue-500' },
    { id: 'course-documents', label: 'Course Documents', color: 'bg-blue-500' },
    { id: 'awarding-body-documents', label: 'Awarding Body Documents', color: 'bg-blue-500' },
    { id: 'worksheets', label: 'Worksheets', color: 'bg-blue-500' },
    { id: 'assessment-plans', label: 'Assessment Plans', color: 'bg-blue-500' },
    { id: 'all-documents', label: 'All Documents', color: 'bg-blue-500' }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen size={24} className="text-blue-500" />
          <h1 className="text-2xl font-bold text-gray-900">Resources</h1>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200 flex items-center gap-4">
          <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm">Copy</button>
          <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm">Excel</button>
          <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm">CSV</button>
          <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm">PDF</button>
          <div className="ml-auto">
            <input
              type="search"
              placeholder="Search..."
              className="px-3 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qualification</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resources Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attachment</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {resources.map((resource, index) => (
                <tr key={resource.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    603/3105/9 - ProQual Level 6 NVQ Diploma in Occupational Health and Safety Practice
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-md">
                    {resource.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <button className="text-blue-600 hover:text-blue-700 mr-3">
                      <Download size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 text-center text-gray-500 text-sm border-t">
          Showing 1 to {resources.length} of {resources.length} entries
        </div>
      </div>
    </div>
  );
};

export default LearnerResources;