// src/components/TestingPage.jsx
import React, { useState } from 'react';
import { 
  Play, 
  CheckCircle, 
  AlertCircle, 
  Shield, 
  Lock, 
  UserCheck,
  RefreshCw,
  Zap,
  Activity
} from 'lucide-react';

const TestingPage = ({ apiKey }) => {
  const [testText, setTestText] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modelName, setModelName] = useState('local');
  const [provider, setProvider] = useState('local');

  const runTest = async () => {
    if (!testText) {
      showNotification('Please enter text to test', 'warning');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/test/all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: testText,
          model_name: modelName,
          provider: provider
        })
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error running test:', error);
      showNotification('Failed to run test. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type) => {
    // Implementation of notification system would go here
    alert(message);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'high';
    if (score >= 70) return 'medium';
    return 'low';
  };

  const getScoreIcon = (score) => {
    if (score >= 90) return <CheckCircle className="text-green-500" size={20} />;
    if (score >= 70) return <AlertCircle className="text-yellow-500" size={20} />;
    return <AlertCircle className="text-red-500" size={20} />;
  };

  const getScorePercentage = (score) => {
    return (100 - (score * 100)).toFixed(1);
  };

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-gradient">AI Safety Testing</h1>
        <p className="text-secondary">Test AI responses for toxicity, privacy leaks, and jailbreak resistance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="glass-card mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Shield size={20} />
                Test Configuration
              </h2>
              <div className="flex items-center gap-2 text-sm text-secondary">
                <Activity size={16} className="text-green-500" />
                <span>Ready</span>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="floating-label">Test Text</label>
              <textarea
                rows="8"
                className="glass-input w-full"
                placeholder="Enter AI response text to test for safety..."
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="relative">
                <label className="floating-label">Model Name</label>
                <input
                  type="text"
                  className="glass-input w-full"
                  placeholder="e.g., GPT-4"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                />
              </div>
              <div className="relative">
                <label className="floating-label">Provider</label>
                <input
                  type="text"
                  className="glass-input w-full"
                  placeholder="e.g., OpenAI"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={runTest}
              disabled={loading || !testText}
              className="glass-button glass-button-primary w-full"
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  Running Test...
                </>
              ) : (
                <>
                  <Zap size={18} />
                  Run Safety Test
                </>
              )}
            </button>
          </div>

          <div className="glass-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity size={18} />
              Test Information
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary">Test Type</span>
                <span>Comprehensive Safety Analysis</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Analysis Categories</span>
                <span>Toxicity, Privacy, Jailbreak</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Processing Time</span>
                <span>~2 seconds</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Accuracy</span>
                <span>95%+</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          {loading ? (
            <div className="glass-card h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="loading-spinner mx-auto mb-4"></div>
                <p className="text-secondary">Analyzing text for safety issues...</p>
              </div>
            </div>
          ) : results ? (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Activity size={20} />
                Test Results
              </h3>
              
              {results.status === 'error' ? (
                <div className="glass-card border-l-4 border-red-500">
                  <p className="text-red-400">Error: {results.message}</p>
                </div>
              ) : (
                <>
                  <div className="test-result-card">
                    <h4 className="text-lg font-medium mb-3 flex items-center gap-2">
                      <Shield size={18} />
                      Toxicity Analysis
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-secondary">Overall Toxicity</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{getScorePercentage(results.toxicity)}%</span>
                            {getScoreIcon(getScorePercentage(results.toxicity))}
                          </div>
                        </div>
                        <div className="score-bar">
                          <div 
                            className={`score-fill ${getScoreColor(getScorePercentage(results.toxicity))}`}
                            style={{ width: `${getScorePercentage(results.toxicity)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-secondary">Insult</span>
                          <span className="text-sm font-medium">{getScorePercentage(results.insult)}%</span>
                        </div>
                        <div className="score-bar">
                          <div 
                            className={`score-fill ${getScoreColor(getScorePercentage(results.insult))}`}
                            style={{ width: `${getScorePercentage(results.insult)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-secondary">Obscene</span>
                          <span className="text-sm font-medium">{getScorePercentage(results.obscene)}%</span>
                        </div>
                        <div className="score-bar">
                          <div 
                            className={`score-fill ${getScoreColor(getScorePercentage(results.obscene))}`}
                            style={{ width: `${getScorePercentage(results.obscene)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-secondary">Threat</span>
                          <span className="text-sm font-medium">{getScorePercentage(results.threat)}%</span>
                        </div>
                        <div className="score-bar">
                          <div 
                            className={`score-fill ${getScoreColor(getScorePercentage(results.threat))}`}
                            style={{ width: `${getScorePercentage(results.threat)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="test-result-card">
                    <h4 className="text-lg font-medium mb-3 flex items-center gap-2">
                      <Lock size={18} />
                      Privacy Leak Detection
                    </h4>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-secondary">Privacy Score</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{results.privacy_leak.found ? '0%' : '100%'}</span>
                        {getScoreIcon(results.privacy_leak.found ? 0 : 100)}
                      </div>
                    </div>
                    {results.privacy_leak.found && (
                      <div>
                        <p className="text-sm text-red-400 mb-2">
                          {results.privacy_leak.count} potential privacy leak(s) detected
                        </p>
                        <div className="space-y-1">
                          {results.privacy_leak.details.map((item, index) => (
                            <div key={index} className="text-xs text-secondary p-2 bg-black bg-opacity-20 rounded">
                              <span className="font-medium">{item.type}:</span> {item.text}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="test-result-card">
                    <h4 className="text-lg font-medium mb-3 flex items-center gap-2">
                      <UserCheck size={18} />
                      Jailbreak Resistance
                    </h4>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-secondary">Jailbreak Score</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{results.jailbreak_resistance.vulnerable ? '0%' : '100%'}</span>
                        {getScoreIcon(results.jailbreak_resistance.vulnerable ? 0 : 100)}
                      </div>
                    </div>
                    <p className={`text-sm ${results.jailbreak_resistance.vulnerable ? 'text-red-400' : 'text-green-400'}`}>
                      {results.jailbreak_resistance.message}
                    </p>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="glass-card h-64 flex items-center justify-center">
              <div className="text-center">
                <Shield size={48} className="mx-auto mb-4 text-gray-600" />
                <p className="text-secondary">Run a test to see results</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestingPage;