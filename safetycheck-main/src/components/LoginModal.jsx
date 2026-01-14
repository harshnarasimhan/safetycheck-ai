// src/components/LoginModal.jsx
import React, { useState } from 'react';
import { X, User, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        onLogin({
          name: data.username,
          email: data.email
        }, data.api_key);
        onClose();
        // Reset form
        setFormData({ username: '', email: '', password: '' });
      } else {
        setError(data.detail || 'Authentication failed');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({ username: '', email: '', password: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="glass-modal w-full max-w-md mx-4 fade-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white hover:bg-opacity-10 transition-all"
        >
          <X size={20} className="text-gray-400" />
        </button>

        <div className="pt-8 pb-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 glow">
              <User className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-secondary text-sm">
              {isLogin 
                ? 'Sign in to your SafetyCheck account' 
                : 'Join our community of AI safety testers'
              }
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-900 bg-opacity-20 border border-red-500 rounded-lg text-red-400 text-sm fade-in">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative fade-in" style={{animationDelay: '0.1s'}}>
                <label className="floating-label">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="username"
                    required
                    className={`glass-input w-full pl-10 transition-all ${
                      focusedField === 'username' ? 'border-blue-400' : ''
                    }`}
                    placeholder="Choose a username"
                    value={formData.username}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </div>
            )}

            <div className="relative fade-in" style={{animationDelay: '0.2s'}}>
              <label className="floating-label">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="email"
                  name="email"
                  required
                  className={`glass-input w-full pl-10 transition-all ${
                    focusedField === 'email' ? 'border-blue-400' : ''
                  }`}
                  placeholder="Your email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            <div className="relative fade-in" style={{animationDelay: '0.3s'}}>
              <label className="floating-label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  className={`glass-input w-full pl-10 pr-10 transition-all ${
                    focusedField === 'password' ? 'border-blue-400' : ''
                  }`}
                  placeholder="Your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="glass-button glass-button-primary w-full py-3 text-lg font-semibold group"
            >
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight 
                    size={18} 
                    className="ml-2 transition-transform group-hover:translate-x-1" 
                  />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-secondary">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={toggleMode}
                className="ml-1 text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          {/* Security Note */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <div className="flex items-center text-xs text-secondary">
              <Lock size={14} className="mr-2 text-green-400" />
              Your data is secure and encrypted
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;