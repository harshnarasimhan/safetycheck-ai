// src/components/ManualTestingPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileText, ArrowLeft, Copy, CheckCircle2, Loader2 } from 'lucide-react';
import API_URL from './config';

export default function ManualTestingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const config = location.state?.config || {};
  
  const [testPrompts, setTestPrompts] = useState([]);
  const [testCases, setTestCases] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch test prompts on mount
  useEffect(() => {
    fetchTestPrompts();
  }, []);

  const fetchTestPrompts = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/api/test/generate-prompts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          industry: config.industry,
          num_tests: config.num_tests || 8,
          quick_mode: config.quick_mode !== false
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate prompts');
      }

      const data = await response.json();
      setTestPrompts(data.prompts);
      
      // Initialize test cases with prompts
      setTestCases(data.prompts.map(p => ({
        prompt: p,
        response: ''
      })));

    } catch (error) {
      console.error('Error:', error);
      alert(`Error generating prompts: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateResponse = (index, value) => {
    const updated = [...testCases];
    updated[index].response = value;
    setTestCases(updated);
  };

  const copyPrompt = (prompt) => {
    navigator.clipboard.writeText(prompt);
    alert('Prompt copied to clipboard!');
  };

  const copyAllPrompts = () => {
    const allPrompts = testCases.map((t, i) => `${i + 1}. ${t.prompt}`).join('\n\n');
    navigator.clipboard.writeText(allPrompts);
    alert('All prompts copied! Paste them into a text file to keep handy while testing.');
  };

  const handleSubmit = async () => {
    // Validate - at least some responses
    const validTests = testCases.filter(t => t.response.trim());
    
    if (validTests.length === 0) {
      alert('Please add at least one response');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/test/manual`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config: config,
          test_cases: validTests
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit test');
      }

      const data = await response.json();
      navigate(`/test/results/${data.test_run_id}`);

    } catch (error) {
      console.error('Error:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-blue-950 to-black py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-blue-200">Generating test prompts...</p>
        </div>
      </div>
    );
  }

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-blue-950 to-black py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-24 h-24 text-blue-400 animate-spin mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-blue-100 mb-2">🔍 Evaluating Responses</h3>
          <p className="text-blue-300/70">Analyzing {testCases.filter(t => t.response).length} test cases...</p>
        </div>
      </div>
    );
  }

  const filledCount = testCases.filter(t => t.response.trim()).length;

  // Determine what to display based on system type
  const systemLabel = config.test_type === 'application' ? 'Application' : 'Model';
  const displayName = config.model_name || config.manual_app_name || 'Unknown';

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-950 to-black py-12 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/test/config')}
            className="flex items-center gap-2 text-blue-300 hover:text-blue-100 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Configuration
          </button>
        </div>

        {/* Header - FIXED to show application name */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Manual Safety Testing
          </h1>
          
          {/* Display application/model info */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg mb-2">
            <FileText className="w-4 h-4 text-blue-400" />
            <span className="text-blue-200 font-medium">
              Testing: {displayName}
            </span>
          </div>
          
          <p className="text-sm text-slate-400 mt-2">
            {systemLabel} • {config.industry === 'healthcare' ? 'Healthcare' : 'Finance'} Industry • Manual Testing
          </p>
        </div>

        {/* Instructions */}
        <div className="backdrop-blur-xl bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <span className="text-3xl">📋</span>
            <div>
              <h3 className="text-lg font-semibold text-blue-100 mb-3">How to Complete This Test:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-blue-200/90">
                <li>
                  <strong>Copy the prompts below</strong> - We've generated {testCases.length} safety test prompts
                </li>
                <li>
                  <strong>Go to {displayName}</strong> (or any AI app you're testing)
                </li>
                <li>
                  <strong>Ask each question</strong> to the AI and copy its response
                </li>
                <li>
                  <strong>Paste responses below</strong> in the corresponding boxes
                </li>
                <li>
                  <strong>Submit for evaluation</strong> - Our judge will analyze the safety
                </li>
              </ol>
              
              <div className="mt-4 p-3 bg-blue-500/10 rounded-lg">
                <p className="text-xs text-blue-200/80">
                  💡 <strong>Tip:</strong> You don't need to fill all {testCases.length} responses. 
                  Even 3-5 responses will give you good insights!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="backdrop-blur-xl bg-blue-900/20 border border-blue-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-blue-100 font-medium">Progress:</span>
            <span className="text-blue-100">
              {filledCount} / {testCases.length} responses filled
            </span>
          </div>
          <div className="mt-2 h-2 bg-blue-900/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-300"
              style={{ width: `${(filledCount / testCases.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Test Cases */}
        <div className="space-y-4 mb-8">
          {testCases.map((testCase, index) => (
            <div key={index} className="backdrop-blur-xl bg-blue-900/20 border border-blue-500/30 rounded-xl p-6">
              
              {/* Prompt (Read-only, with copy button) */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-blue-200/80">
                    Test Prompt {index + 1}
                  </label>
                  <button
                    onClick={() => copyPrompt(testCase.prompt)}
                    className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-600/30 hover:bg-blue-600/40 text-blue-100 rounded-lg transition-all"
                  >
                    <Copy className="w-3 h-3" />
                    Copy
                  </button>
                </div>
                <div className="px-4 py-3 bg-black/40 border border-blue-500/30 rounded-xl text-blue-100">
                  {testCase.prompt}
                </div>
              </div>

              {/* Response (User fills this) */}
              <div>
                <label className="block text-sm font-medium text-blue-200/80 mb-2">
                  AI's Response {testCase.response.trim() ? (
                    <CheckCircle2 className="w-4 h-4 inline ml-1 text-emerald-400" />
                  ) : '(Paste here)'}
                </label>
                <textarea
                  value={testCase.response}
                  onChange={(e) => updateResponse(index, e.target.value)}
                  placeholder={`1. Go to ${displayName}
2. Ask the prompt above
3. Copy the AI's complete response
4. Paste it here...`}
                  rows={6}
                  className="w-full px-4 py-3 bg-black/40 border border-blue-500/30 rounded-xl text-blue-100 placeholder-blue-300/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Copy All Prompts Button */}
        <div className="text-center mb-6">
          <button
            onClick={copyAllPrompts}
            className="px-6 py-3 bg-blue-600/30 hover:bg-blue-600/40 text-blue-100 rounded-xl transition-all border border-blue-500/30 inline-flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy All Prompts to Clipboard
          </button>
          <p className="text-xs text-blue-300/60 mt-2">
            Keep prompts handy while you test the AI app
          </p>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={filledCount === 0}
            className="px-12 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-lg font-semibold rounded-xl transition-all shadow-lg hover:shadow-blue-500/50 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {filledCount === 0 
              ? '⚠️ Add at least one response to continue' 
              : `🔍 Evaluate ${filledCount} Response${filledCount > 1 ? 's' : ''}`
            }
          </button>
        </div>
      </div>
    </div>
  );
}