import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/Auth/LoginForm';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';

// Learner Components
import LearnerDashboard from './components/Learner/LearnerDashboard';
import LearnerSubmissions from './components/Learner/LearnerSubmissions';
import LearnerNotifications from './components/Learner/LearnerNotifications';
import LearnerResources from './components/Learner/LearnerResources';
import AdditionalInfo from './components/AdditionalInfo/AdditionalInfo';
import Assessor from './components/Assessor/Assessor';
import ChangePassword from './components/ChangePassword/ChangePassword';

// Admin Components
import AdminDashboard from './components/Admin/AdminDashboard';
import UserManagement from './components/Admin/UserManagement';
import TaskManagement from './components/Admin/TaskManagement';

// Accessor Components
import AccessorDashboard from './components/Accessor/AccessorDashboard';
import ReviewTasks from './components/Accessor/ReviewTasks';
import MyAssessments from './components/Accessor/MyAssessments';
import MyLearners from './components/Accessor/MyLearners';
import AccessorNotifications from './components/Accessor/AccessorNotifications';

// IQA Components
import IQADashboard from './components/IQA/IQADashboard';
import IQAReviewTasks from './components/IQA/IQAReviewTasks';
import IQAAssessments from './components/IQA/IQAAssessments';

// EQA Components
import EQADashboard from './components/EQA/EQADashboard';
import EQAReviewTasks from './components/EQA/EQAReviewTasks';
import EQAAssessments from './components/EQA/EQAAssessments';
import EQAAuditReports from './components/EQA/EQAAuditReports';

const MainApp: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeSection, setActiveSection] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderContent = () => {
    // Admin Routes
    if (user.role === 'admin') {
      switch (activeSection) {
        case 'dashboard':
          return <AdminDashboard activeSection={activeSection} />;
        case 'users':
          return <UserManagement />;
        case 'courses':
          return <TaskManagement />;
        case 'notifications':
          return <div className="p-6">Admin Notifications (Coming Soon)</div>;
        case 'reports':
          return <div className="p-6">Reports (Coming Soon)</div>;
        case 'settings':
          return <div className="p-6">System Settings (Coming Soon)</div>;
        default:
          return <AdminDashboard activeSection={activeSection} />;
      }
    }

    // Learner Routes
    if (user.role === 'learner') {
      switch (activeSection) {
        case 'dashboard':
          return <LearnerDashboard />;
        case 'submissions':
          return <LearnerSubmissions />;
        case 'additional-info':
          return <AdditionalInfo />;
        case 'notifications':
          return <LearnerNotifications />;
        case 'resources':
          return <LearnerResources />;
        case 'assessor':
          return <Assessor />;
        case 'change-password':
          return <ChangePassword />;
        default:
          return <LearnerDashboard />;
      }
    }

    // Accessor Routes
    if (user.role === 'accessor') {
      switch (activeSection) {
        case 'dashboard':
          return <AccessorDashboard onNavigate={setActiveSection} />;
        case 'review-tasks':
          return <ReviewTasks />;
        case 'my-assessments':
          return <MyAssessments />;
        case 'learners':
          return <MyLearners />;
        case 'notifications':
          return <AccessorNotifications />;
        default:
          return <AccessorDashboard onNavigate={setActiveSection} />;
      }
    }

    // IQA Routes
    if (user.role === 'iqa') {
      switch (activeSection) {
        case 'dashboard':
          return <IQADashboard />;
        case 'quality-review':
          return <IQAReviewTasks />;
        case 'assessments':
          return <IQAAssessments />;
        case 'notifications':
          return <AccessorNotifications />;
        default:
          return <IQADashboard />;
      }
    }

    // EQA Routes
    if (user.role === 'eqa') {
      switch (activeSection) {
        case 'dashboard':
          return <EQADashboard />;
        case 'approved-tasks':
          return <EQAReviewTasks />;
        case 'audit-reports':
          return <EQAAuditReports />;
        default:
          return <EQADashboard />;
      }
    }

    return <div className="p-6">Dashboard</div>;
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 flex flex-col">
        <Header onNavigate={setActiveSection} />
        <main className="flex-1">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
