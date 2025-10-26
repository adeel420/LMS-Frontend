import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');

  const generateCaptcha = () => {
    const chars = '0123456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

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

    if (captcha !== captchaCode) {
      setError('Invalid captcha. Please try again.');
      generateCaptcha();
      setCaptcha('');
      setLoading(false);
      return;
    }

    try {
      const success = await login(formData.username, formData.password, captcha);
      if (!success) {
        setError('Invalid credentials. Please try again.');
        generateCaptcha();
        setCaptcha('');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      generateCaptcha();
      setCaptcha('');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form (40%) */}
      <div className="w-full md:w-2/5 bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-3xl shadow-lg p-8">
            {/* Logo and Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="60" cy="20" r="4" fill="#1e5ba8" />
                  <circle cx="48" cy="28" r="3" fill="#1e5ba8" />
                  <circle cx="72" cy="28" r="3" fill="#1e5ba8" />
                  <path d="M 60 35 L 75 45 L 75 50 Q 75 55 70 55 L 50 55 Q 45 55 45 50 L 45 45 Z" fill="#1e5ba8" />
                  <rect x="58" y="55" width="4" height="12" fill="#1e5ba8" />
                  <rect x="48" y="48" width="24" height="4" fill="#1e5ba8" opacity="0.8" />
                  <rect x="48" y="52" width="24" height="4" fill="#1e5ba8" opacity="0.6" />
                  <path d="M 45 65 Q 40 70 38 80 Q 40 75 45 72" stroke="#1e5ba8" strokeWidth="2" fill="none" />
                  <path d="M 42 68 Q 35 75 32 85 Q 35 78 42 73" stroke="#1e5ba8" strokeWidth="2" fill="none" />
                  <path d="M 75 65 Q 80 70 82 80 Q 80 75 75 72" stroke="#1e5ba8" strokeWidth="2" fill="none" />
                  <path d="M 78 68 Q 85 75 88 85 Q 85 78 78 73" stroke="#1e5ba8" strokeWidth="2" fill="none" />
                </svg>
              </div>

              <h1 className="text-3xl font-bold text-blue-700 mb-2">Welcome to</h1>
              <h2 className="text-3xl font-bold text-blue-700 mb-4">LMS</h2>
              <p className="text-gray-600 text-sm">Please enter your credentials to login</p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-blue-600 text-sm font-medium mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-600 text-sm font-medium mb-2">Captcha</label>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex gap-1 text-2xl font-bold bg-gray-100 px-3 py-2 rounded">
                    {captchaCode.split('').map((char, idx) => {
                      const colors = ['text-green-500', 'text-blue-500', 'text-yellow-600', 'text-red-500', 'text-purple-500', 'text-pink-500'];
                      return (
                        <span key={idx} className={colors[idx % colors.length]}>
                          {char}
                        </span>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      generateCaptcha();
                      setCaptcha('');
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition"
                  >
                    <RefreshCw size={20} />
                  </button>
                </div>
                <input
                  type="text"
                  value={captcha}
                  onChange={(e) => setCaptcha(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 transition"
                  placeholder="Enter captcha"
                  required
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition mt-6"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Background Image (60%) */}
      <div className="hidden md:block w-3/5 bg-gray-200 relative">
        <img
          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80"
          alt="Education background"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default LoginForm;