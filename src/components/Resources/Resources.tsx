import React, { useState } from 'react';
import { useEffect } from 'react';
import { BookOpen, FileText, Video, Link, Download, Calendar, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { databaseService } from '../../services/database';

const Resources: React.FC = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const data = await databaseService.getResources();
        setResources(data);
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resources...</p>
        </div>
      </div>
    );
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText size={20} className="text-red-500" />;
      case 'video':
        return <Video size={20} className="text-purple-500" />;
      case 'link':
        return <Link size={20} className="text-blue-500" />;
      default:
        return <FileText size={20} className="text-gray-500" />;
    }
  };

  const getResourceTypeLabel = (type: string) => {
    switch (type) {
      case 'pdf':
        return 'PDF Document';
      case 'video':
        return 'Video';
      case 'link':
        return 'External Link';
      default:
        return 'Document';
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Learning Resources</h1>
        <p className="text-gray-600">Access study materials, videos, and reference documents</p>
      </div>

      {/* Resource Categories */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { type: 'pdf', label: 'PDF Documents', count: 2, color: 'bg-red-100 text-red-700' },
          { type: 'video', label: 'Videos', count: 1, color: 'bg-purple-100 text-purple-700' },
          { type: 'link', label: 'External Links', count: 1, color: 'bg-blue-100 text-blue-700' },
          { type: 'document', label: 'Documents', count: 1, color: 'bg-gray-100 text-gray-700' }
        ].map((category) => (
          <div key={category.type} className="bg-white rounded-lg shadow-sm p-4">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${category.color}`}>
              {getResourceIcon(category.type)}
              <span>{category.label}</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-gray-900">{category.count}</div>
          </div>
        ))}
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {resources.map((resource) => (
          <div key={resource.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {getResourceIcon(resource.type)}
                </div>
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                    {getResourceTypeLabel(resource.type)}
                  </span>
                  <h3 className="font-semibold text-gray-900 mt-1">{resource.title}</h3>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Download size={16} />
              </button>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">{resource.description}</p>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>{resource.createdAt}</span>
                </div>
                {resource.fileSize && (
                  <div className="flex items-center gap-1">
                    <span>{resource.fileSize}</span>
                  </div>
                )}
                {resource.duration && (
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{resource.duration}</span>
                  </div>
                )}
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-medium">
                Access Resource
              </button>
            </div>
          </div>
        ))}
      </div>

      {resources.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No resources available</p>
          <p className="text-sm text-gray-400">Check back later for new learning materials</p>
        </div>
      )}
    </div>
  );
};

export default Resources;