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
   <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Login Form (40%) */}
      <div className="w-full md:w-[40%] bg-gray-50 flex items-center justify-start ">
        <div className="w-full max-w-[100%]">
          <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8">
            {/* Logo and Header */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="flex justify-center mb-4 sm:mb-6">
               <img src="https://res.cloudinary.com/dyyuwwbaq/image/upload/v1761506439/logo_wb1grw.jpg" alt="LMS Logo" className="w-24 h-24 sm:w-32 sm:h-32 object-contain" />
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-2">Welcome to</h1>
              <h2 className="text-2xl sm:text-3xl font-bold text-blue-700 mb-3 sm:mb-4">LMS</h2>
              <p className="text-gray-600 text-xs sm:text-sm">Please enter your credentials to login</p>
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
                <label className="block text-blue-600 text-sm font-medium mb-2">Password</label>
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
                <label className="block text-blue-600 text-sm font-medium mb-2">Captcha</label>
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