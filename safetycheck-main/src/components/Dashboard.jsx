import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Clock, CheckCircle2, Plus, LogOut, Sparkles, Database, Cpu, Globe, RefreshCw,
  Brain, Zap
} from 'lucide-react';
import SafetyCheckLogo from './SafetyCheckLogo';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('User');
  const [userEmail, setUserEmail] = useState('');
  const [testHistory, setTestHistory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    console.log('🔍 DashboardPage mounted');
    
    // Get user info
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const name = user.name || user.email?.split('@')[0] || 'User';
        const email = user.email || '';
        
        setUserName(name);
        setUserEmail(email);
        
        console.log('👤 Current user:', name, '(' + email + ')');
      } catch (e) {
        console.error('❌ Error parsing user:', e);
      }
    } else {
      console.log('⚠️ No user found in localStorage');
    }

    // Load test history from localStorage
    loadTestHistory();
  }, []);

  const loadTestHistory = async () => {
    console.log('📊 Loading test history...');
    setRefreshing(true);
    
    try {
      // Get current user
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        console.log('⚠️ No user found, cannot load test history');
        return;
      }
      
      const user = JSON.parse(userStr);
      const currentUserEmail = user.email;
      console.log('👤 Loading tests for user:', currentUserEmail);

      // Get all test results from localStorage
      const testsStr = localStorage.getItem('safetycheck_test_results');
      
      if (!testsStr) {
        console.log('📭 No test results found in localStorage');
        console.log('💡 localStorage keys:', Object.keys(localStorage));
        setTestHistory([]);
        return;
      }

      const allTests = JSON.parse(testsStr);
      console.log('📦 Total tests in storage:', allTests.length);
      
      // Filter tests for current user and sort by date (newest first)
      const userTests = allTests
        .filter(test => {
          const matches = test.userEmail === currentUserEmail;
          if (!matches) {
            console.log('⏭️ Skipping test for different user:', test.userEmail);
          }
          return matches;
        })
        .sort((a, b) => {
          const dateA = new Date(a.timestamp || 0);
          const dateB = new Date(b.timestamp || 0);
          return dateB - dateA;
        });

      console.log(`✅ Found ${userTests.length} tests for current user`);
      
      if (userTests.length > 0) {
        console.log('📋 User tests:', userTests);
      }
      
      setTestHistory(userTests);

    } catch (error) {
      console.error('❌ Error loading test history:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = () => {
    console.log('👋 Logging out...');
    
    // Update user logged in status
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        user.loggedIn = false;
        localStorage.setItem('user', JSON.stringify(user));
      } catch (e) {
        console.error('Error updating logout status:', e);
      }
    }
    
    navigate('/');
  };

  const getSafetyColor = (percentage) => {
    if (percentage >= 90) return 'text-emerald-400';
    if (percentage >= 75) return 'text-blue-400';
    if (percentage >= 50) return 'text-amber-400';
    return 'text-red-400';
  };

  const getSafetyLabel = (percentage) => {
    if (percentage >= 90) return 'EXCELLENT';
    if (percentage >= 75) return 'GOOD';
    if (percentage >= 50) return 'MODERATE';
    return 'POOR';
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    } catch (e) {
      return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
  {/* Enhanced Background effects */}
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
  
  {/* Multiple layered glows for depth */}
  <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
  <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-3xl"></div>
  <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-blue-600/20 rounded-full blur-3xl"></div>
  <div className="absolute bottom-1/3 left-1/3 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl"></div>
  
  {/* Animated gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/10 via-transparent to-cyan-900/10"></div>
  
  {/* Subtle grid pattern */}
  <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:72px_72px]"></div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-slate-700/50 backdrop-blur-xl bg-slate-900/50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <SafetyCheckLogo size={40} />
                <div>
                  <h1 className="text-xl font-bold text-white">SafetyCheck</h1>
                  <p className="text-xs text-slate-400">AI Safety Platform</p>
                </div>
              </div>

              {/* User menu */}
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-white">{userName}</p>
                  <p className="text-xs text-slate-400">Administrator</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-all"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-8">
          {/* Welcome section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-white mb-2">
              Welcome, {userName}! 👋
            </h2>
            <p className="text-slate-400">
              Your AI safety testing command center
            </p>
          </motion.div>

          {/* Platform Capabilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* AI Agents Active */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-2xl p-6 card-hover relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-500/10 rounded-xl">
                    <Brain className="w-6 h-6 text-purple-400" />
                  </div>
                  <motion.span 
                    className="text-2xl"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🤖
                  </motion.span>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">AI Agents Active</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                    3
                  </p>
                  <p className="text-xs text-purple-400 mt-2">Multi-agent orchestration</p>
                </div>
              </div>
            </motion.div>

            {/* Regulations Knowledge Base */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-6 card-hover relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl">
                    <Database className="w-6 h-6 text-blue-400" />
                  </div>
                  <motion.span 
                    className="text-2xl"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    📚
                  </motion.span>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Indexed segments</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                    8,214
                  </p>
                  <p className="text-xs text-blue-400 mt-2">RAG knowledge base</p>
                </div>
              </div>
            </motion.div>

            {/* Supported LLM Models */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-2xl p-6 card-hover relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-emerald-500/10 rounded-xl">
                    <Cpu className="w-6 h-6 text-emerald-400" />
                  </div>
                  <motion.span 
                    className="text-2xl"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🎯
                  </motion.span>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">LLM Providers</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                    3+
                  </p>
                  <p className="text-xs text-emerald-400 mt-2">Groq • OpenAI • Anthropic</p>
                </div>
              </div>
            </motion.div>

            {/* Average Test Speed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card rounded-2xl p-6 card-hover relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-amber-500/10 rounded-xl">
                    <Zap className="w-6 h-6 text-amber-400" />
                  </div>
                  <motion.span 
                    className="text-2xl"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    ⚡
                  </motion.span>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Avg Test Speed</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                    ~2min
                  </p>
                  <p className="text-xs text-amber-400 mt-2">Lightning fast results</p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Tests */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-2"
            >
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-400" />
                    Recent Tests
                  </h3>
                  <button
                    onClick={loadTestHistory}
                    disabled={refreshing}
                    className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 transition-all disabled:opacity-50"
                    title="Refresh"
                  >
                    <RefreshCw className={`w-5 h-5 text-slate-400 ${refreshing ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                <div className="space-y-4">
                  {testHistory.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-10 h-10 text-slate-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-2">No tests yet</h4>
                      <p className="text-slate-400 mb-6 max-w-sm mx-auto">
                        Start your first AI safety test to see results here
                      </p>
                      <button
                        onClick={() => navigate('/test/config')}
                        className="btn-primary"
                      >
                        <Plus className="w-5 h-5 inline mr-2" />
                        Run Your First Test
                      </button>
                    </div>
                  ) : (
                    testHistory.slice(0, 5).map((test, index) => (
                      <motion.div
                        key={test.test_run_id || index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        onClick={() => navigate(`/test/results/${test.test_run_id}`)}
                        className="p-4 bg-slate-800/30 border border-slate-700/30 rounded-xl hover:bg-slate-800/50 hover:border-slate-600/50 cursor-pointer transition-all group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                                {test.actual_model || test.config?.model_name || 'AI Model Test'}
                              </h4>
                              <span className={`status-badge ${
                                test.summary?.safe_percentage >= 90 ? 'status-safe' :
                                test.summary?.safe_percentage >= 75 ? 'status-info' :
                                test.summary?.safe_percentage >= 50 ? 'status-warning' :
                                'status-unsafe'
                              }`}>
                                {getSafetyLabel(test.summary?.safe_percentage || 0)}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-400">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {formatDate(test.timestamp)}
                              </span>
                              <span className="flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4" />
                                {test.summary?.safe_count || 0}/{test.summary?.total_tests || 0} Safe
                              </span>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className={`text-2xl font-bold ${getSafetyColor(test.summary?.safe_percentage || 0)}`}>
                              {(test.summary?.safe_percentage || 0).toFixed(1)}%
                            </div>
                            <p className="text-xs text-slate-500">Safety Score</p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>

            {/* Quick Actions Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-6"
            >
              {/* New Test Card */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-400" />
                  Quick Actions
                </h3>
                
                <button
                  onClick={() => navigate('/test/config')}
                  className="w-full btn-primary py-4"
                >
                  <Plus className="w-5 h-5 inline mr-2" />
                  New Safety Test
                </button>

                <div className="mt-4 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                  <p className="text-xs text-slate-300 text-center">
                    Configure your test settings on the next page
                  </p>
                </div>
              </div>

              {/* Platform Info Card */}
              <div className="gradient-card rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Globe className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">SafetyCheck Platform</h4>
                    <p className="text-xs text-slate-400">Version 1.0</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Status</span>
                    <span className="flex items-center gap-1 text-emerald-400">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      Operational
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Last Updated</span>
                    <span className="text-slate-300">Jan 2026</span>
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/docs')}
                  className="text-sm text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1"
                >
                  View Documentation →
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}