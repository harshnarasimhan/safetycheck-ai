// src/components/TestConfigPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Rocket, Loader2, Zap, Brain, Scale } from 'lucide-react';
import ConfigForm from './ConfigForm';
import Disclaimer from './Disclaimer';

export default function TestConfigPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // If manual testing, redirect to manual page
      if (formData.skip_to_manual) {
        navigate('/test/manual', { state: { config: formData } });
        setIsSubmitting(false);
        return;
      }

      // Regular API testing flow
      console.log('🚀 Submitting test configuration:', formData);
      
      const response = await fetch('http://localhost:8000/api/test/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP ${response.status}: Failed to start test`);
      }

      const data = await response.json();
      console.log('✅ Test started successfully:', data);

      if (!data.test_run_id) {
        console.error('❌ No test_run_id in response:', data);
        throw new Error('Server did not return a test_run_id');
      }

      const resultsPath = `/test/results/${data.test_run_id}`;
      console.log('🧭 Navigating to:', resultsPath);
      navigate(resultsPath);

    } catch (error) {
      console.error('❌ Test submission error:', error);
      setError(error.message);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden py-12 px-4 flex flex-col">
      {/* Background effects - BLUE THEME */}
      <div className="absolute inset-0 gradient-bg opacity-50"></div>
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 flex-1">
        <div className="max-w-5xl mx-auto">
          
          {/* Back Button */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-all group"
            >
              <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Dashboard</span>
            </button>
          </motion.div>

          {/* Loading State - BLUE THEME */}
          {isSubmitting ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-2xl p-12 text-center shadow-2xl"
            >
              {/* Animated Spinner */}
              <div className="relative w-24 h-24 mx-auto mb-8">
                {/* Outer glow */}
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="absolute inset-0 bg-blue-500/30 rounded-full blur-xl"
                />
                
                {/* Outer ring */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="url(#blueGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="283"
                    strokeDashoffset="75"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    style={{ transformOrigin: 'center' }}
                  />
                  <defs>
                    <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#60a5fa" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </svg>
                
                {/* Inner ring */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-2 border-4 border-blue-400/30 border-t-blue-400 rounded-full"
                />
                
                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Rocket className="w-10 h-10 text-blue-400" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-3xl font-bold text-white mb-3">
                🚀 Starting Safety Test
              </h3>
              <p className="text-slate-400 mb-8">
                Analyzing your AI configuration...
              </p>
              
              {/* Progress Steps */}
              <div className="space-y-3 max-w-md mx-auto mb-8">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/30"
                >
                  <Loader2 className="w-5 h-5 text-blue-400 animate-spin flex-shrink-0" />
                  <span className="text-sm text-blue-300 text-left">
                    Generating test cases with regulatory context
                  </span>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700/30"
                >
                  <Brain className="w-5 h-5 text-slate-500 flex-shrink-0" />
                  <span className="text-sm text-slate-400 text-left">
                    Querying your AI model
                  </span>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700/30"
                >
                  <Scale className="w-5 h-5 text-slate-500 flex-shrink-0" />
                  <span className="text-sm text-slate-400 text-left">
                    Evaluating safety with Judge Agent
                  </span>
                </motion.div>
              </div>

              {/* Time Estimate */}
              <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl max-w-md mx-auto">
                <p className="text-sm text-slate-300">
                  ⏱️ This typically takes 1-3 minutes
                </p>
              </div>

              {/* Animated dots */}
              <div className="flex items-center justify-center gap-2 mt-6">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 1, 0.3]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                    className="w-2 h-2 bg-blue-400 rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <ConfigForm onSubmit={handleSubmit} />
          )}

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 glass-card rounded-2xl p-6 border-l-4 border-red-500"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-red-400 text-xl">⚠️</span>
                </div>
                <div>
                  <p className="font-semibold text-red-300 mb-1">Error Starting Test</p>
                  <p className="text-sm text-red-200/80">{error}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="relative z-10">
        <Disclaimer />
      </div>
    </div>
  );
}