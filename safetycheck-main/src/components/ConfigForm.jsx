import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings, Zap, Shield, Database, Cpu, Key, Thermometer, FileText, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import SafetyCheckLogo from './SafetyCheckLogo';

export default function ConfigForm({ onSubmit }) {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    test_type: 'base_model',
    testing_method: 'api',
    industry: 'healthcare',
    use_case: 'chatbot',
    num_tests: 8,
    quick_mode: true,
    model_provider: 'groq',
    model_name: 'llama-3.3-70b-versatile',
    system_prompt: 'You are a helpful AI assistant.',
    temperature: 0.7,
    max_tokens: 2000,
    application_name: ''  // NEW: For manual application testing
  });

  const [validationResult, setValidationResult] = useState(null);
  const [validating, setValidating] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleProviderChange = (e) => {
    const provider = e.target.value;
    let defaultModel = 'gpt-4o-mini';
    if (provider === 'groq') {
      defaultModel = 'llama-3.3-70b-versatile';
    } else if (provider === 'anthropic') {
      defaultModel = 'claude-3-5-sonnet-20241022';
    }
    setFormData({
      ...formData,
      model_provider: provider,
      model_name: defaultModel
    });
  };

  const validateApiKey = async () => {
    if (formData.testing_method !== 'api') {
      alert('Validation only needed for API testing');
      return;
    }

    if (!formData.api_key && formData.test_type === 'base_model') {
      alert('Please enter an API key first');
      return;
    }

    setValidating(true);
    
    try {
      const payload = formData.test_type === 'base_model' 
        ? {
            provider: formData.model_provider,
            model_name: formData.model_name,
            api_key: formData.api_key
          }
        : {
            endpoint: formData.application_endpoint,
            api_key: formData.application_api_key
          };

      const response = await fetch('http://localhost:8000/api/validate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      setValidationResult(result);

    } catch (error) {
      setValidationResult({
        valid: false,
        message: `Connection error: ${error.message}`
      });
    } finally {
      setValidating(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // VALIDATION: Manual Application Testing requires application name
    if (formData.testing_method === 'manual' && formData.test_type === 'application') {
      if (!formData.application_name || !formData.application_name.trim()) {
        alert('Please enter the application name you are testing');
        return;
      }
    }
    
    // VALIDATION: API Base Model Testing requires API key
    if (formData.testing_method === 'api' && formData.test_type === 'base_model') {
      if (!validationResult?.valid) {
        alert('Please validate your API key first');
        return;
      }
    }
    
    // Prepare config for submission
    const config = { ...formData };
    
    // For manual application testing, use application_name as model_name
    if (formData.testing_method === 'manual' && formData.test_type === 'application') {
      config.model_name = formData.application_name.trim();
      config.manual_app_name = formData.application_name.trim();
    }
    
    // Navigate to appropriate page
    if (formData.testing_method === 'manual') {
      navigate('/test/manual', { state: { config } });
    } else {
      onSubmit(config);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden py-12">
      {/* Background effects */}
      <div className="absolute inset-0 gradient-bg opacity-50"></div>
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <Settings className="w-8 h-8 text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold text-white">Test Configuration</h1>
          </div>
          <p className="text-slate-400 text-lg">
            Configure your AI safety test parameters
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between">
              {[
                { 
                  num: 1, 
                  label: 'Test Type', 
                  icon: ({ className }) => <SafetyCheckLogo size={24} className={className} />
                },
                { num: 2, label: 'Method', icon: Zap },
                { num: 3, label: 'Configuration', icon: Settings },
                { num: 4, label: 'Launch', icon: CheckCircle2 }
              ].map((step, index) => {
                const Icon = step.icon;
                return (
                  <React.Fragment key={step.num}>
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                        currentStep >= step.num
                          ? 'bg-slate-800/50 text-white shadow-lg shadow-blue-500/50'
                          : 'bg-slate-800/50 text-slate-400'
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`text-xs font-medium ${
                        currentStep >= step.num ? 'text-blue-400' : 'text-slate-500'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                    {index < 3 && (
                      <div className={`flex-1 h-1 rounded mx-2 transition-all ${
                        currentStep > step.num ? 'bg-blue-500' : 'bg-slate-700/50'
                      }`}></div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="glass-card rounded-2xl p-8 shadow-2xl"
        >
          {/* Step 1: Test Type */}
          <div className="mb-8">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-4">
              <SafetyCheckLogo size={24} />
              Step 1: What are you testing?
            </label>
            
            <div className="grid md:grid-cols-2 gap-4">
              <label className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all ${
                formData.test_type === 'base_model'
                  ? 'border-blue-500 bg-blue-500/5'
                  : 'border-slate-700/50 bg-slate-800/20 hover:border-slate-600/50'
              }`}>
                <input
                  type="radio"
                  name="test_type"
                  value="base_model"
                  checked={formData.test_type === 'base_model'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Cpu className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-1">Base Model</p>
                    <p className="text-sm text-slate-400">
                      Test GPT-4, Claude, Llama, or other LLMs
                    </p>
                  </div>
                </div>
                {formData.test_type === 'base_model' && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                  </div>
                )}
              </label>

              <label className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all ${
                formData.test_type === 'application'
                  ? 'border-blue-500 bg-blue-500/5'
                  : 'border-slate-700/50 bg-slate-800/20 hover:border-slate-600/50'
              }`}>
                <input
                  type="radio"
                  name="test_type"
                  value="application"
                  checked={formData.test_type === 'application'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Database className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-1">Deployed Application</p>
                    <p className="text-sm text-slate-400">
                      Test live chatbot, Ada Health, Cleo AI
                    </p>
                  </div>
                </div>
                {formData.test_type === 'application' && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Step 2: Testing Method */}
          <div className="mb-8">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-4">
              <Zap className="w-5 h-5 text-blue-400" />
              Step 2: How do you want to test?
            </label>
            
            <div className="grid md:grid-cols-2 gap-4">
              <label className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all ${
                formData.testing_method === 'api'
                  ? 'border-blue-500 bg-blue-500/5'
                  : 'border-slate-700/50 bg-slate-800/20 hover:border-slate-600/50'
              }`}>
                <input
                  type="radio"
                  name="testing_method"
                  value="api"
                  checked={formData.testing_method === 'api'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <Zap className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-1">Automated (API)</p>
                    <p className="text-sm text-slate-400">
                      Fast automated testing via API
                    </p>
                  </div>
                </div>
                {formData.testing_method === 'api' && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                  </div>
                )}
              </label>

              <label className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all ${
                formData.testing_method === 'manual'
                  ? 'border-blue-500 bg-blue-500/5'
                  : 'border-slate-700/50 bg-slate-800/20 hover:border-slate-600/50'
              }`}>
                <input
                  type="radio"
                  name="testing_method"
                  value="manual"
                  checked={formData.testing_method === 'manual'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-1">Manual (Copy/Paste)</p>
                    <p className="text-sm text-slate-400">
                      No API needed, test any AI app
                    </p>
                  </div>
                </div>
                {formData.testing_method === 'manual' && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="divider my-8"></div>

          {/* Step 3: Configuration */}
          <div className="space-y-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
              <Settings className="w-5 h-5 text-blue-400" />
              Step 3: Configuration
            </label>

            {/* APPLICATION NAME FIELD - Shows when Manual + Application */}
            {formData.testing_method === 'manual' && formData.test_type === 'application' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Application/Chatbot Name *
                </label>
                <input
                  type="text"
                  name="application_name"
                  value={formData.application_name}
                  onChange={handleChange}
                  placeholder="e.g., Symptomate, Ada Health, ChatGPT, Babylon Health, Cleo AI"
                  className="input-field"
                  required
                />
                <p className="text-xs text-slate-400 mt-2">
                  Enter the name of the AI application or chatbot you're testing
                </p>
              </motion.div>
            )}

            {/* Industry */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Industry
              </label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="input-field"
              >
                <option value="healthcare">🏥 Healthcare (HIPAA, FDA)</option>
                <option value="finance">💰 Finance (SEC, FINRA)</option>
                <option value="general">🌐 General</option>
              </select>
            </div>

            {formData.testing_method === 'api' && formData.test_type === 'base_model' && (
              <>
                {/* Provider */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    AI Provider
                  </label>
                  <select
                    name="model_provider"
                    value={formData.model_provider}
                    onChange={handleProviderChange}
                    className="input-field"
                  >
                    <option value="groq">⚡ Groq</option>
                    <option value="openai">🤖 OpenAI</option>
                    <option value="anthropic">🧠 Anthropic Claude</option>
                  </select>
                </div>

                {/* Model */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Model
                  </label>
                  <select
                    name="model_name"
                    value={formData.model_name}
                    onChange={handleChange}
                    className="input-field"
                  >
                    {formData.model_provider === 'groq' && (
                      <>
                        <option value="llama-3.3-70b-versatile">⭐ Llama 3.3 70B</option>
                        <option value="llama-3.1-8b-instant">⚡ Llama 3.1 8B</option>
                        <option value="mixtral-8x7b-32768">🔥 Mixtral 8x7B</option>
                        <option value="gemma2-9b-it">💎 Gemma 2 9B</option>
                      </>
                    )}
                    {formData.model_provider === 'openai' && (
                      <>
                        <option value="gpt-4o-mini">GPT-4o Mini</option>
                        <option value="gpt-4o">GPT-4o</option>
                      </>
                    )}
                    {formData.model_provider === 'anthropic' && (
                      <>
                        <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</option>
                        <option value="claude-3-haiku-20240307">Claude 3 Haiku</option>
                      </>
                    )}
                  </select>
                </div>

                {/* API Key */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                    <Key className="w-4 h-4" />
                    API Key
                  </label>
                  <input
                    type="password"
                    name="api_key"
                    value={formData.api_key || ''}
                    onChange={handleChange}
                    placeholder={
                      formData.model_provider === 'groq' 
                        ? 'gsk_...' 
                        : formData.model_provider === 'openai'
                        ? 'sk-...'
                        : 'Enter API key'
                    }
                    className="input-field"
                    required
                  />
                  <p className="text-xs text-slate-400 mt-2">
                    {formData.model_provider === 'openai' && '⚠️ OpenAI free tier: 3 requests/min limit'}
                    {formData.model_provider === 'anthropic' && 'Get API key at: https://console.anthropic.com'}
                  </p>
                </div>

                {/* System Prompt */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    System Prompt
                  </label>
                  <textarea
                    name="system_prompt"
                    value={formData.system_prompt}
                    onChange={handleChange}
                    rows={3}
                    className="input-field resize-none"
                  />
                </div>

                {/* Advanced Settings Row */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Temperature */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                      <Thermometer className="w-4 h-4" />
                      Temperature: <span className="text-blue-400">{formData.temperature}</span>
                    </label>
                    <input
                      type="range"
                      name="temperature"
                      min="0"
                      max="1"
                      step="0.1"
                      value={formData.temperature}
                      onChange={handleChange}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>Focused</span>
                      <span>Creative</span>
                    </div>
                  </div>

                  {/* Max Tokens */}
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Max Tokens
                    </label>
                    <input
                      type="number"
                      name="max_tokens"
                      value={formData.max_tokens}
                      onChange={handleChange}
                      min="100"
                      max="4000"
                      step="100"
                      className="input-field"
                    />
                    <p className="text-xs text-slate-400 mt-1">
                      Recommended: 2000 for complete answers
                    </p>
                  </div>
                </div>

                {/* Validate Button */}
                <div>
                  <button
                    type="button"
                    onClick={validateApiKey}
                    disabled={validating}
                    className="w-full p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:bg-slate-700/50 transition-all disabled:opacity-50"
                  >
                    {validating ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Validating...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-5 h-5" />
                        Validate API Key
                      </span>
                    )}
                  </button>
                  
                  {validationResult && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-3 p-3 rounded-xl flex items-start gap-3 ${
                        validationResult.valid 
                          ? 'bg-emerald-500/10 border border-emerald-500/20' 
                          : 'bg-red-500/10 border border-red-500/20'
                      }`}
                    >
                      {validationResult.valid ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      )}
                      <p className={`text-sm ${validationResult.valid ? 'text-emerald-300' : 'text-red-300'}`}>
                        {validationResult.message}
                      </p>
                    </motion.div>
                  )}
                </div>
              </>
            )}

            {formData.testing_method === 'manual' && (
              <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-400 mb-1">
                      Manual Testing Mode
                    </p>
                    <p className="text-xs text-slate-300">
                      You'll see test prompts on next page. Copy them, test in any AI app, then paste responses. No API key needed!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Test Configuration */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Number of Tests
                </label>
                <input
                  type="number"
                  name="num_tests"
                  value={formData.num_tests}
                  onChange={handleChange}
                  min="1"
                  max="20"
                  className="input-field"
                />
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-800/30 border border-slate-700/30 rounded-xl hover:bg-slate-800/50 transition-all">
                  <input
                    type="checkbox"
                    name="quick_mode"
                    checked={formData.quick_mode}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-slate-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                  />
                  <div>
                    <p className="text-sm font-medium text-white">Quick Mode</p>
                    <p className="text-xs text-slate-400">Use pre-defined test cases (faster)</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="divider my-8"></div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="btn-primary w-full py-4 text-lg"
            >
              {formData.testing_method === 'manual' 
                ? '✍️ Continue to Manual Testing' 
                : `🚀 Start ${formData.test_type === 'base_model' ? 'Model' : 'Application'} Test`
              }
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}