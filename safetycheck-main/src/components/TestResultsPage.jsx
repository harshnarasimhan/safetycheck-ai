import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Download, Shield, AlertTriangle, CheckCircle2, 
  XCircle, TrendingUp, Clock, FileText, ChevronDown, ChevronUp,
  Loader2, Activity, Info
} from 'lucide-react';
import SafetyCheckLogo from './SafetyCheckLogo';

export default function TestResultsPage() {
  const { testRunId } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [expandedTest, setExpandedTest] = useState(null);
  const [expandedTests, setExpandedTests] = useState({});

  const toggleTest = (index) => {
    setExpandedTests(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Function to save test results to localStorage
  const saveTestResultsToLocalStorage = (testData) => {
    try {
      console.log('💾 Saving test results to localStorage');
      
      // Get current user
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        console.log('⚠️ No user found in localStorage, cannot save test results');
        return false;
      }
      
      const user = JSON.parse(userStr);
      
      // Prepare test data with user info
      const testDataWithUser = {
        ...testData,
        userEmail: user.email,
        userName: user.name || user.email?.split('@')[0] || 'User',
        timestamp: testData.timestamp || new Date().toISOString(), // Use existing timestamp or create new one
        test_run_id: testRunId // Ensure test_run_id is set
      };
      
      // Get existing test results
      const existingTestsStr = localStorage.getItem('safetycheck_test_results');
      let existingTests = existingTestsStr ? JSON.parse(existingTestsStr) : [];
      
      // Check if this test already exists in the array
      const existingIndex = existingTests.findIndex(test => test.test_run_id === testRunId);
      
      if (existingIndex >= 0) {
        // Update existing test
        existingTests[existingIndex] = testDataWithUser;
        console.log('🔄 Updated existing test result');
      } else {
        // Add new test
        existingTests.push(testDataWithUser);
        console.log('➕ Added new test result');
      }
      
      // Save back to localStorage
      localStorage.setItem('safetycheck_test_results', JSON.stringify(existingTests));
      
      console.log('✅ Test results saved to localStorage successfully');
      console.log('📊 Total tests in storage:', existingTests.length);
      return true;
    } catch (error) {
      console.error('❌ Error saving test results to localStorage:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchResults();
  }, [testRunId]);

  const fetchResults = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/test/results/${testRunId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch results');
      }

      const data = await response.json();
      console.log('📥 Fetched test results:', data);
      setResults(data);
      
      // Save to localStorage
      const saved = saveTestResultsToLocalStorage(data);
      if (saved) {
        console.log('✅ Results successfully saved to localStorage');
      }
    } catch (err) {
      console.error('❌ Error fetching results:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    setDownloadingPdf(true);
    
    try {
      const response = await fetch(`http://localhost:8000/api/test/results/${testRunId}/pdf`);
      
      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `safety_report_${testRunId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert(`Error downloading PDF: ${err.message}`);
    } finally {
      setDownloadingPdf(false);
    }
  };

  const getSafetyRating = (percentage) => {
    if (percentage >= 90) return { label: 'EXCELLENT', color: 'emerald', emoji: '🎉' };
    if (percentage >= 75) return { label: 'GOOD', color: 'blue', emoji: '✅' };
    if (percentage >= 50) return { label: 'MODERATE', color: 'amber', emoji: '⚠️' };
    return { label: 'POOR', color: 'red', emoji: '❌' };
  };

  const getSeverityBadge = (severity) => {
    const severityMap = {
      critical: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', label: 'CRITICAL' },
      high: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', label: 'HIGH' },
      medium: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', label: 'MEDIUM' },
      low: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', label: 'LOW' }
    };
    const config = severityMap[severity?.toLowerCase()] || severityMap.medium;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${config.bg} ${config.border} ${config.text} border`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        {/* Background effects - Blue theme */}
        <div className="absolute inset-0 gradient-bg opacity-50"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 glass-card rounded-2xl p-12 text-center max-w-md"
        >
          {/* Animated logo */}
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 3, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="w-20 h-20 mx-auto mb-6"
          >
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/50 glow">
              <SafetyCheckLogo size={40} />
            </div>
          </motion.div>
          
          {/* Loading text */}
          <h2 className="text-2xl font-bold text-white mb-3">Analyzing Results...</h2>
          <p className="text-slate-400 mb-6">Processing safety evaluation data</p>
          
          {/* Loading bar */}
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          
          {/* Loading spinner text */}
          <div className="flex items-center justify-center gap-2 text-slate-400 mt-4">
            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
            <span className="text-sm">This may take a few moments...</span>
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen relative flex items-center justify-center p-4">
        <div className="absolute inset-0 gradient-bg opacity-50"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 glass-card rounded-2xl p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Results</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
          >
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  const summary = results?.summary || {};
  const testResults = results?.results || [];
  const unsafeResults = testResults.filter(r => !r.evaluation?.safe);
  const safetyRating = getSafetyRating(summary.safe_percentage || 0);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-bg opacity-50"></div>
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-slate-700/50 backdrop-blur-xl bg-slate-900/50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Dashboard</span>
              </button>

              <button
                onClick={downloadPDF}
                disabled={downloadingPdf}
                className="btn-primary flex items-center gap-2"
              >
                {downloadingPdf ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Download Report
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8 max-w-7xl">
          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-2">Safety Test Results</h1>
            <p className="text-slate-400">Test ID: {testRunId}</p>
          </motion.div>

          {/* Executive Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-8 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <SafetyCheckLogo size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">Executive Summary</h2>
            </div>

            {/* Safety Score Hero */}
            <div className={`relative overflow-hidden rounded-2xl p-8 mb-6 bg-gradient-to-br ${
              safetyRating.color === 'emerald' ? 'from-emerald-500/20 to-emerald-600/10' :
              safetyRating.color === 'blue' ? 'from-blue-500/20 to-blue-600/10' :
              safetyRating.color === 'amber' ? 'from-amber-500/20 to-amber-600/10' :
              'from-red-500/20 to-red-600/10'
            } border border-${safetyRating.color}-500/20`}>
              <div className="relative z-10 text-center">
                <p className="text-slate-300 text-sm font-medium mb-2">Overall Safety Score</p>
                <div className="flex items-center justify-center gap-4 mb-3">
                  <span className="text-6xl">{safetyRating.emoji}</span>
                  <div className="text-left">
                    <p className={`text-5xl font-bold text-${safetyRating.color}-400`}>
                      {(summary.safe_percentage || 0).toFixed(1)}%
                    </p>
                    <p className={`text-lg font-semibold text-${safetyRating.color}-400`}>
                      {safetyRating.label}
                    </p>
                  </div>
                </div>
                <p className="text-slate-400 text-sm">
                  {summary.safe_count || 0} out of {summary.total_tests || 0} tests passed safety evaluation
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/30">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-slate-700/50 rounded-lg">
                    <Activity className="w-5 h-5 text-slate-400" />
                  </div>
                  <p className="text-slate-400 text-sm font-medium">Total Tests</p>
                </div>
                <p className="text-3xl font-bold text-white">{summary.total_tests || 0}</p>
              </div>

              <div className="bg-emerald-500/5 rounded-xl p-6 border border-emerald-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <p className="text-emerald-300 text-sm font-medium">Safe</p>
                </div>
                <p className="text-3xl font-bold text-emerald-400">
                  {summary.safe_count || 0}
                  <span className="text-lg text-emerald-400/60 ml-2">
                    ({(summary.safe_percentage || 0).toFixed(1)}%)
                  </span>
                </p>
              </div>

              <div className="bg-red-500/5 rounded-xl p-6 border border-red-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <XCircle className="w-5 h-5 text-red-400" />
                  </div>
                  <p className="text-red-300 text-sm font-medium">Unsafe</p>
                </div>
                <p className="text-3xl font-bold text-red-400">
                  {summary.unsafe_count || 0}
                  <span className="text-lg text-red-400/60 ml-2">
                    ({(summary.unsafe_percentage || 0).toFixed(1)}%)
                  </span>
                </p>
              </div>
            </div>

            {/* Meta Info */}
            <div className="mt-6 pt-6 border-t border-slate-700/50">
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <SafetyCheckLogo size={16} />
                  <span>Model: <span className="text-white font-medium">{results.actual_model}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Duration: <span className="text-white font-medium">{results.duration_seconds?.toFixed(1)}s</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>Industry: <span className="text-white font-medium capitalize">{results.config?.industry}</span></span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Unsafe Issues Section */}
          {unsafeResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-8 mb-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-red-500/10 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Critical Issues Found</h2>
                  <p className="text-slate-400 text-sm">{unsafeResults.length} unsafe responses detected</p>
                </div>
              </div>

              <div className="space-y-4">
                {unsafeResults.map((result, index) => {
                  const testIndex = testResults.indexOf(result);
                  const isExpanded = expandedTest === index;
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="bg-red-500/5 border border-red-500/20 rounded-xl overflow-hidden"
                    >
                      <div
                        onClick={() => setExpandedTest(isExpanded ? null : index)}
                        className="p-6 cursor-pointer hover:bg-red-500/10 transition-all"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-red-400 font-bold">#{testIndex + 1}</span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-white mb-1">Unsafe Response Detected</h3>
                              <div className="flex items-center gap-2">
                                {getSeverityBadge(result.evaluation?.severity)}
                                <span className="text-xs text-slate-400">
                                  Confidence: {((result.evaluation?.score || 0) * 100).toFixed(0)}%
                                </span>
                              </div>
                            </div>
                          </div>
                          <button className="p-2 hover:bg-red-500/10 rounded-lg transition-colors">
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-slate-400" />
                            )}
                          </button>
                        </div>

                        {/* Preview */}
                        {!isExpanded && (
                          <div className="space-y-2">
                            <div>
                              <p className="text-xs font-semibold text-slate-400 mb-1">Prompt:</p>
                              <p className="text-sm text-slate-300 line-clamp-1">{result.prompt}</p>
                            </div>
                            {result.evaluation?.issues && result.evaluation.issues.length > 0 && (
                              <div>
                                <p className="text-xs font-semibold text-red-400 mb-1">Key Issue:</p>
                                <p className="text-sm text-red-300 line-clamp-1">{result.evaluation.issues[0]}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-6 pb-6 space-y-4"
                        >
                          {/* Prompt */}
                          <div>
                            <p className="text-xs font-semibold text-slate-400 mb-2">Test Prompt:</p>
                            <div className="p-4 bg-slate-900/50 border border-slate-700/30 rounded-lg">
                              <p className="text-sm text-slate-200">{result.prompt}</p>
                            </div>
                          </div>

                          {/* Response */}
                          <div>
                            <p className="text-xs font-semibold text-slate-400 mb-2">AI Response:</p>
                            <div className="p-4 bg-slate-900/50 border border-slate-700/30 rounded-lg max-h-64 overflow-y-auto">
                              <p className="text-sm text-slate-200 whitespace-pre-wrap break-words">
                                {result.response}
                              </p>
                            </div>
                          </div>

                          {/* Evaluation */}
                          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                            <p className="text-xs font-semibold text-red-400 mb-3">Safety Evaluation:</p>
                            
                            {/* Issues */}
                            {result.evaluation?.issues && result.evaluation.issues.length > 0 && (
                              <div className="mb-3">
                                <p className="text-xs font-semibold text-slate-300 mb-2">Issues Detected:</p>
                                <ul className="space-y-1">
                                  {result.evaluation.issues.map((issue, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-red-300">
                                      <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                      <span>{issue}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Explanation */}
                            {result.evaluation?.explanation && (
                              <div className="mb-3">
                                <p className="text-xs font-semibold text-slate-300 mb-2">Explanation:</p>
                                <p className="text-sm text-slate-200">{result.evaluation.explanation}</p>
                              </div>
                            )}

                            {/* Metadata */}
                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-3 border-t border-red-500/20">
                              <span>Category: <strong className="text-slate-300">{result.evaluation?.category || 'N/A'}</strong></span>
                              <span>Severity: {getSeverityBadge(result.evaluation?.severity)}</span>
                              <span>Confidence: <strong className="text-slate-300">{((result.evaluation?.score || 0) * 100).toFixed(0)}%</strong></span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* All Results Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">All Test Results</h2>
                <p className="text-slate-400 text-sm">{testResults.length} total tests executed</p>
              </div>
            </div>

            <div className="space-y-4">
              {testResults.map((result, index) => {
                const isSafe = result.evaluation?.safe;
                const isExpanded = expandedTests[index] || false;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className={`rounded-xl border transition-all overflow-hidden ${
                      isSafe 
                        ? 'bg-emerald-500/5 border-emerald-500/20' 
                        : 'bg-red-500/5 border-red-500/20'
                    }`}
                  >
                    {/* Header - Always Visible */}
                    <div 
                      className={`p-5 cursor-pointer transition-all ${
                        isSafe 
                          ? 'hover:bg-emerald-500/10' 
                          : 'hover:bg-red-500/10'
                      }`}
                      onClick={() => toggleTest(index)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                              isSafe 
                                ? 'bg-emerald-500/20 text-emerald-400' 
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              Test #{index + 1}
                            </span>
                            <span className={`flex items-center gap-2 text-sm font-bold ${
                              isSafe ? 'text-emerald-400' : 'text-red-400'
                            }`}>
                              {isSafe ? (
                                <>
                                  <CheckCircle2 className="w-5 h-5" />
                                  SAFE
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-5 h-5" />
                                  UNSAFE
                                </>
                              )}
                            </span>
                          </div>
                          
                          {/* Question */}
                          <h4 className="text-base font-semibold text-white mb-2">
                            {result.prompt}
                          </h4>
                          
                          {/* Quick explanation preview */}
                          {!isExpanded && result.evaluation?.explanation && (
                            <p className="text-sm text-slate-400 line-clamp-2">
                              {result.evaluation.explanation}
                            </p>
                          )}
                        </div>
                        
                        <div className="ml-4 text-right flex flex-col items-end gap-2">
                          <div className={`text-3xl font-bold ${isSafe ? 'text-emerald-400' : 'text-red-400'}`}>
                            {((result.evaluation?.score || 0) * 100).toFixed(0)}%
                          </div>
                          <div className={`p-2 rounded-lg transition-all ${
                            isSafe 
                              ? 'hover:bg-emerald-500/10' 
                              : 'hover:bg-red-500/10'
                          }`}>
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-slate-700/30"
                      >
                        <div className="p-5 space-y-4">
                          {/* AI Response */}
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                                isSafe ? 'bg-blue-500/10' : 'bg-red-500/10'
                              }`}>
                                <span className="text-sm">🤖</span>
                              </div>
                              <p className="text-sm font-semibold text-slate-300">AI Response:</p>
                            </div>
                            <div className={`p-4 rounded-xl border max-h-64 overflow-y-auto ${
                              isSafe 
                                ? 'bg-slate-900/50 border-slate-700/30' 
                                : 'bg-red-900/10 border-red-500/20'
                            }`}>
                              <p className="text-sm text-slate-200 whitespace-pre-wrap break-words leading-relaxed">
                                {result.response || 'No response available'}
                              </p>
                            </div>
                          </div>

                          {/* Evaluation Explanation */}
                          {result.evaluation?.explanation && (
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                                  isSafe ? 'bg-emerald-500/10' : 'bg-red-500/10'
                                }`}>
                                  <span className="text-sm">⚖️</span>
                                </div>
                                <p className="text-sm font-semibold text-slate-300">Safety Evaluation:</p>
                              </div>
                              <div className={`p-4 rounded-xl border ${
                                isSafe 
                                  ? 'bg-emerald-500/5 border-emerald-500/20' 
                                  : 'bg-red-500/10 border-red-500/20'
                              }`}>
                                <p className={`text-sm leading-relaxed ${
                                  isSafe ? 'text-emerald-200' : 'text-red-200'
                                }`}>
                                  {result.evaluation.explanation}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Issues (if unsafe) */}
                          {!isSafe && result.evaluation?.issues && result.evaluation.issues.length > 0 && (
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 rounded-lg bg-red-500/10 flex items-center justify-center">
                                  <AlertTriangle className="w-4 h-4 text-red-400" />
                                </div>
                                <p className="text-sm font-semibold text-red-300">Issues Detected:</p>
                              </div>
                              <ul className="space-y-2">
                                {result.evaluation.issues.map((issue, idx) => (
                                  <li key={idx} className="flex items-start gap-2 text-sm text-red-300">
                                    <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                    <span>{issue}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Metadata */}
                          <div className="pt-4 border-t border-slate-700/30">
                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                              {result.evaluation?.category && (
                                <span className="flex items-center gap-1">
                                  <span className="font-semibold text-slate-300">Category:</span>
                                  {result.evaluation.category}
                                </span>
                              )}
                              {result.evaluation?.severity && (
                                <span className="flex items-center gap-1">
                                  <span className="font-semibold text-slate-300">Severity:</span>
                                  {getSeverityBadge(result.evaluation.severity)}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <span className="font-semibold text-slate-300">Confidence:</span>
                                {((result.evaluation?.score || 0) * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8"
          >
            <button
              onClick={() => navigate('/test/config')}
              className="btn-secondary px-8 py-3"
            >
              Run Another Test
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}