import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="h-screen w-screen fixed inset-0 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #F68D1B 0%, #018FCF 100%)' }}>
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 py-4 sm:py-8">
        <div className="w-full max-w-md flex-shrink-0">
          {/* White Form Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-4 shadow-2xl">
            {/* Logo and Header */}
            <div className="text-center mb-3 sm:mb-4">
              <div className="flex justify-center">
                <div className="w-20 h-18 sm:w-22 sm:h-22 flex items-center justify-center">
                  <img
                    src="https://res.cloudinary.com/dyyuwwbaq/image/upload/v1761506439/logo_wb1grw.jpg"
                    alt="LMS Logo"
                    className="w-full h-full object-contain rounded-lg sm:rounded-xl"
                  />
                </div>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">Welcome to LMS</h1>
              <p className="text-gray-600 text-xs sm:text-sm">Please enter your credentials to login</p>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3">
              <div>
                <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 sm:px-4 pr-10 text-sm sm:text-base border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-xs sm:text-sm font-medium mb-1">Captcha</label>
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <div className="flex gap-1 text-lg sm:text-xl font-bold bg-gray-100 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border">
                    {captchaCode.split('').map((char, idx) => {
                      const colors = ['text-green-600', 'text-blue-600', 'text-yellow-600', 'text-red-600', 'text-purple-600', 'text-pink-600'];
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
                    className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 sm:p-2 rounded-lg transition-all duration-200"
                  >
                    <RefreshCw size={16} className="sm:w-[18px] sm:h-[18px]" />
                  </button>
                </div>
                <input
                  type="text"
                  value={captcha}
                  onChange={(e) => setCaptcha(e.target.value)}
                  className="w-full px-3 py-2 sm:px-4 text-sm sm:text-base border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Enter captcha"
                  required
                />
              </div>

              {error && (
                <div className="text-red-600 text-xs sm:text-sm text-center bg-red-50 p-2 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-2.5 sm:py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-3 sm:mt-4 flex-shrink-0">
          <div className="text-center text-white/80 text-xs sm:text-sm px-4">
            <p><b>For support contact:</b> info@mostservs.com | 03365555683</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;