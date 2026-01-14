import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, CheckCircle2, ArrowRight, Sparkles, Lock, Globe, AlertCircle, Eye, EyeOff } from 'lucide-react';
import SafetyCheckLogo from './SafetyCheckLogo';

export default function LandingPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ==================== USER MANAGEMENT ====================
  
  // Get all registered users from localStorage
  const getAllUsers = () => {
    const usersStr = localStorage.getItem('safetycheck_users');
    if (!usersStr) return [];
    try {
      return JSON.parse(usersStr);
    } catch (e) {
      console.error('Error parsing users:', e);
      return [];
    }
  };

  // Save all users to localStorage
  const saveAllUsers = (users) => {
    try {
      localStorage.setItem('safetycheck_users', JSON.stringify(users));
      return true;
    } catch (e) {
      console.error('Error saving users:', e);
      return false;
    }
  };

  // Set current logged-in user
  const setCurrentUser = (user) => {
    try {
      localStorage.setItem('user', JSON.stringify(user));
      return true;
    } catch (e) {
      console.error('Error setting current user:', e);
      return false;
    }
  };

  // ==================== VALIDATION ====================
  
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateName = (name) => {
    return name.trim().length >= 2;
  };

  // ==================== AUTHENTICATION ====================
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (!isLogin && !name) {
      setError('Please enter your full name');
      return;
    }

    // Email validation
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Password validation
    if (!validatePassword(password)) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Name validation (for sign up)
    if (!isLogin && !validateName(name)) {
      setError('Name must be at least 2 characters');
      return;
    }

    // Execute sign in or sign up
    if (isLogin) {
      handleSignIn();
    } else {
      handleSignUp();
    }
  };

  const handleSignIn = async () => {
    setIsLoading(true);
    
    // Simulate network delay for realistic UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const users = getAllUsers();
      
      if (users.length === 0) {
        setError('No accounts found. Please sign up first.');
        setIsLoading(false);
        return;
      }

      // Find user by email (case-insensitive)
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
      
      if (!user) {
        setError('No account found with this email. Please check your email or sign up.');
        setIsLoading(false);
        return;
      }

      // Verify password
      if (user.password !== password) {
        setError('Incorrect password. Please try again.');
        setIsLoading(false);
        return;
      }

      // Update user's last login
      const updatedUser = {
        ...user,
        lastLogin: new Date().toISOString(),
        loggedIn: true
      };

      // Update in users array
      const updatedUsers = users.map(u => 
        u.id === user.id ? updatedUser : u
      );
      saveAllUsers(updatedUsers);

      // Set as current user
      if (!setCurrentUser(updatedUser)) {
        setError('Error saving session. Please try again.');
        setIsLoading(false);
        return;
      }

      console.log('✅ Sign in successful:', updatedUser.name);
      console.log('📧 Email:', updatedUser.email);
      console.log('🕐 Last login:', updatedUser.lastLogin);
      
      // Navigate based on terms acceptance
      setTimeout(() => {
        if (updatedUser.acceptedTerms) {
          navigate('/dashboard');
        } else {
          navigate('/terms');
        }
      }, 300);

    } catch (err) {
      console.error('Sign in error:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    setIsLoading(true);
    
    // Simulate network delay for realistic UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const users = getAllUsers();
      
      // Check if email already exists (case-insensitive)
      const existingUser = users.find(u => 
        u.email.toLowerCase() === email.toLowerCase().trim()
      );
      
      if (existingUser) {
        setError('An account with this email already exists. Please sign in instead.');
        setIsLoading(false);
        return;
      }

      // Create new user object
      const newUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: email.toLowerCase().trim(),
        password: password, // In production: hash this with bcrypt!
        name: name.trim(),
        loggedIn: true,
        acceptedTerms: false,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        testCount: 0,
        settings: {
          theme: 'dark',
          emailNotifications: true
        }
      };

      // Add to users array
      const updatedUsers = [...users, newUser];
      
      if (!saveAllUsers(updatedUsers)) {
        setError('Error creating account. Please try again.');
        setIsLoading(false);
        return;
      }

      // Set as current user
      if (!setCurrentUser(newUser)) {
        setError('Account created but error logging in. Please sign in manually.');
        setIsLoading(false);
        return;
      }

      console.log('✅ Sign up successful!');
      console.log('👤 User:', newUser.name);
      console.log('📧 Email:', newUser.email);
      console.log('🆔 ID:', newUser.id);
      console.log('📊 Total users:', updatedUsers.length);
      
      // Navigate to terms page
      setTimeout(() => {
        navigate('/terms');
      }, 300);

    } catch (err) {
      console.error('Sign up error:', err);
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleTabSwitch = (isLoginTab) => {
    setIsLogin(isLoginTab);
    setError('');
    setPassword('');
    setShowPassword(false);
  };

  // Clear error when user starts typing
  const handleInputChange = (setter) => (e) => {
    if (error) setError('');
    setter(e.target.value);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20"></div>
      
      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-slate-800/50 backdrop-blur-xl bg-slate-900/50">
        <div className="container mx-auto px-6 py-4">
        <div className="flex items-center gap-3">
          <SafetyCheckLogo size={40} />
          <div>
            <h1 className="text-lg font-bold text-white">SafetyCheck</h1>
        <p className="text-xs text-slate-400">AI Safety Platform</p>
           </div>
           </div>
           </div>
        </header>

        <div className="container mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
            
            {/* Left - Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6"
              >
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-300">AI-Powered Safety Testing</span>
              </motion.div>

              {/* Main Heading */}
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                AI Safety Testing
                <span className="block bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mt-2">
                  Before Deployment
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-xl text-slate-400 mb-8 leading-relaxed">
                Automated compliance testing for healthcare and finance AI systems with 
                regulatory-aware evaluation powered by multi-agent architecture.
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-3 mb-10">
                {[
                  { icon: Zap, text: '2-5 min testing' },
                  { icon: Shield, text: '95% accuracy' },
                  { icon: Globe, text: '8,214 segments' }
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50"
                    >
                      <Icon className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-slate-300">{item.text}</span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 p-6 rounded-2xl bg-gradient-to-br from-slate-800/40 to-slate-800/20 border border-slate-700/30">
                <div>
                  <div className="text-3xl font-bold text-white mb-1">99%</div>
                  <div className="text-sm text-slate-400">Efficiency</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">$0</div>
                  <div className="text-sm text-slate-400">Free Testing</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-1">24/7</div>
                  <div className="text-sm text-slate-400">Available</div>
                </div>
              </div>
            </motion.div>

            {/* Right - Auth Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:ml-auto w-full max-w-md"
            >
              <div className="glass-card rounded-2xl p-8 shadow-2xl border border-slate-700/50">
                {/* Tab Switcher */}
                <div className="flex gap-2 p-1 bg-slate-800/50 rounded-xl mb-6">
                  <button
                    type="button"
                    onClick={() => handleTabSwitch(true)}
                    disabled={isLoading}
                    className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all disabled:opacity-50 ${
                      isLogin 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                        : 'text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabSwitch(false)}
                    disabled={isLoading}
                    className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all disabled:opacity-50 ${
                      !isLogin 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' 
                        : 'text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                {/* Error Message */}
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      className="mb-4 overflow-hidden"
                    >
                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-300 leading-relaxed">{error}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name Field (Sign Up Only) */}
                  <AnimatePresence mode="wait">
                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={handleInputChange(setName)}
                          placeholder="Your Name"
                          className="input-field"
                          disabled={isLoading}
                          required={!isLogin}
                          autoComplete="name"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={handleInputChange(setEmail)}
                      placeholder="you@example.com"
                      className="input-field"
                      disabled={isLoading}
                      required
                      autoComplete="email"
                    />
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={handleInputChange(setPassword)}
                        placeholder="••••••••"
                        className="input-field pr-12"
                        disabled={isLoading}
                        required
                        minLength={6}
                        autoComplete={isLogin ? "current-password" : "new-password"}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {!isLogin && (
                      <p className="text-xs text-slate-400 mt-1">
                        Minimum 6 characters
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        {isLogin ? 'Signing In...' : 'Creating Account...'}
                      </>
                    ) : (
                      <>
                        {isLogin ? 'Sign In' : 'Create Account'}
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>

                {/* Switch Mode */}
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => handleTabSwitch(!isLogin)}
                    disabled={isLoading}
                    className="text-sm text-slate-400 hover:text-blue-400 transition-colors disabled:opacity-50"
                  >
                    {isLogin ? (
                      <>Don't have an account? <span className="text-blue-400 font-medium">Sign up</span></>
                    ) : (
                      <>Already have an account? <span className="text-blue-400 font-medium">Sign in</span></>
                    )}
                  </button>
                </div>

                {/* Trust Indicators */}
                <div className="mt-6 pt-6 border-t border-slate-700/50 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Lock className="w-4 h-4 text-blue-400" />
                    <span>Enterprise-grade security</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Globe className="w-4 h-4 text-purple-400" />
                    <span>GDPR compliant</span>
                  </div>
                </div>
              </div>

              {/* DISCLAIMER REMOVED */}
            </motion.div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="container mx-auto px-6 py-20 border-t border-slate-800/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white mb-4">
                Comprehensive AI Safety Testing
              </h2>
              <p className="text-slate-400 text-lg">
                Everything you need to ensure your AI systems are safe and compliant
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Shield,
                  title: 'Multi-Agent Testing',
                  description: 'AI-powered judge and test generator agents working together for comprehensive evaluation',
                  color: 'blue'
                },
                {
                  icon: Globe,
                  title: 'Regulatory Context',
                  description: 'RAG-powered testing with 100+ documents chunked into 8,214 searchable segments for accurate compliance checks',
                  color: 'emerald'
                },
                {
                  icon: Zap,
                  title: 'Instant Reports',
                  description: 'Detailed PDF reports with safety analysis and actionable recommendations',
                  color: 'purple'
                }
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 rounded-2xl bg-gradient-to-br from-slate-800/40 to-slate-800/20 border border-slate-700/30 hover:border-slate-600/50 transition-all"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-${feature.color}-500/10 border border-${feature.color}-500/20 flex items-center justify-center mb-4`}>
                      <Icon className={`w-6 h-6 text-${feature.color}-400`} />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-800/50 py-8">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-3">
                <SafetyCheckLogo size={32} />
                <span className="text-slate-400 text-sm">© 2026 SafetyCheck. Educational Platform.</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}