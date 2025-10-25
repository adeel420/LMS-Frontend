import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await login(formData.username, formData.password);
      if (!success) {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { username: 'admin', role: 'Admin', description: 'Full system access' },
    { username: 'learner1', role: 'Learner', description: 'Student portal' },
    { username: 'accessor1', role: 'Accessor', description: 'Assessment review' },
    { username: 'iqa1', role: 'IQA', description: 'Quality assurance' },
    { username: 'eqa1', role: 'EQA', description: 'External quality' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
          <div className="text-center mb-8">
            <div className="inline-block mb-4">
              <div className="text-3xl font-bold text-red-500 mb-1">THE-E-</div>
              <div className="text-3xl font-bold text-red-500 -mt-2">ASSESSMENT</div>
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mt-4">Welcome to LMS</h2>
            <p className="text-gray-500 mt-2">Please enter your credentials to login</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={20} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={20} className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-blue-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff size={20} className="text-gray-400" />
                  ) : (
                    <Eye size={20} className="text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Demo Accounts</h3>
            <div className="space-y-2">
              {demoAccounts.map((account, index) => (
                <button
                  key={index}
                  onClick={() => setFormData({ username: account.username, password: account.username + '123' })}
                  className="w-full text-left p-2 hover:bg-white rounded border text-xs transition-colors"
                >
                  <div className="font-medium text-gray-800">{account.role}</div>
                  <div className="text-gray-600">{account.username}</div>
                  <div className="text-gray-500">{account.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center lg:text-left">
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 rounded-2xl p-8 text-white shadow-2xl">
              <h1 className="text-4xl font-bold mb-2">The-E-Assessment</h1>
              <h2 className="text-xl mb-6 opacity-90">Complete Learning Management System</h2>
              
              <div className="space-y-4 text-left">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Multi-Role System</h3>
                  <p className="text-sm opacity-90">Admin, Learner, Accessor, IQA, and EQA roles with specific workflows</p>
                </div>
                
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Assessment Workflow</h3>
                  <p className="text-sm opacity-90">Complete task submission and review process with quality assurance</p>
                </div>
                
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Quality Management</h3>
                  <p className="text-sm opacity-90">Internal and external quality assurance with audit trails</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;