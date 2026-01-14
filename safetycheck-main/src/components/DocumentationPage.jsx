import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, BookOpen, Zap, Shield, Code, Database, Brain,
  CheckCircle2, AlertCircle, FileText, Cpu, Globe, Key,
  ChevronDown, ChevronRight, Sparkles, Terminal, PlayCircle
} from 'lucide-react';
import SafetyCheckLogo from './SafetyCheckLogo';

// Debug: Check if React is properly imported
console.log('React imported successfully:', React !== undefined);
console.log('useState imported successfully:', typeof useState);

export default function DocumentationPage() {
  // Debug: Check if useState is available in this scope
  console.log('useState available in component:', typeof useState);
  
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('getting-started');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [activeTab, setActiveTab] = useState('base-model');

  const sections = [
    { id: 'getting-started', label: 'Getting Started', icon: Sparkles },
    { id: 'quick-start', label: 'Quick Start Guide', icon: Zap },
    { id: 'features', label: 'Features', icon: Shield },
    { id: 'api-testing', label: 'API Testing', icon: Terminal },
    { id: 'manual-testing', label: 'Manual Testing', icon: FileText },
    { id: 'architecture', label: 'Architecture', icon: Cpu },
    { id: 'regulations', label: 'Regulations', icon: Database },
    { id: 'faq', label: 'FAQ', icon: AlertCircle }
  ];

  const faqs = [
    {
      question: "What is SafetyCheck?",
      answer: "SafetyCheck is an AI safety testing platform that uses multi-agent architecture and RAG (Retrieval-Augmented Generation) to evaluate AI models for regulatory compliance. It tests AI systems against 8,214 healthcare and finance regulations."
    },
    {
      question: "How accurate is SafetyCheck?",
      answer: "SafetyCheck achieves 95% accuracy in safety evaluation through our multi-agent system. The Judge Agent uses regulatory context from our RAG knowledge base to make informed decisions, reducing false positives to ~5%."
    },
    {
      question: "Which AI models can I test?",
      answer: "SafetyCheck supports testing of any LLM accessible via API (Groq, OpenAI, Anthropic) or through manual testing (ChatGPT, Ada Health, Cleo AI, etc.). You can test both base models and deployed applications."
    },
    {
      question: "Is my API key secure?",
      answer: "Yes. Your API keys are transmitted securely via HTTPS and are never stored permanently. They are used only for the duration of your test and then discarded."
    },
    {
      question: "How long does a test take?",
      answer: "Automated tests typically take 2-5 minutes for 8 test cases. The exact time depends on the model's response speed and the number of tests you configure."
    },
    {
      question: "What regulations do you cover?",
      answer: "We cover 8,214 regulatory documents including HIPAA, FDA guidelines, SEC rules, and FINRA compliance requirements. Our RAG system retrieves relevant regulations for each test case."
    },
    {
      question: "Can I use SafetyCheck for production deployments?",
      answer: "SafetyCheck is an educational platform demonstrating AI concepts. For production deployments, we recommend consulting with professional AI safety auditors and legal counsel."
    },
    {
      question: "What's the difference between Quick Mode and Full Mode?",
      answer: "Quick Mode uses pre-defined test cases for faster results (~2 min). Full Mode generates custom test cases using our Test Generator Agent for more comprehensive testing (~5 min)."
    }
  ];

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-bg opacity-50"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-slate-700/50 backdrop-blur-xl bg-slate-900/50 sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-medium">Back</span>
                </button>
                <div className="h-6 w-px bg-slate-700"></div>
                <div className="flex items-center gap-3">
                  <SafetyCheckLogo size={32} />
                  <div>
                    <h1 className="text-lg font-bold text-white">Documentation</h1>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/test/config')}
                className="btn-primary hidden md:flex items-center gap-2"
              >
                <PlayCircle className="w-5 h-5" />
                Start Testing
              </button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-8 max-w-7xl">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="glass-card rounded-2xl p-6 sticky top-24">
                <h3 className="text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">
                  Contents
                </h3>
                <nav className="space-y-2">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all ${
                          activeSection === section.id
                            ? 'bg-blue-500/10 text-blue-400 border-l-2 border-blue-500'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                        }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm font-medium">{section.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-3 space-y-12"
            >
              {/* Getting Started */}
              <section id="getting-started" className="glass-card rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-500/10 rounded-xl">
                    <Sparkles className="w-6 h-6 text-blue-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">Getting Started</h2>
                </div>

                <div className="prose prose-invert max-w-none">
                  <p className="text-slate-300 text-lg leading-relaxed mb-6">
                    SafetyCheck is an AI safety testing platform that helps you evaluate AI models for regulatory compliance
                    in healthcare and finance industries. Our platform uses a multi-agent architecture with RAG-powered
                    evaluation to provide comprehensive safety testing.
                  </p>

                  <div className="grid md:grid-cols-3 gap-4 my-8">
                    <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-6">
                      <Brain className="w-8 h-8 text-blue-400 mb-3" />
                      <h4 className="font-semibold text-white mb-2">3 AI Agents</h4>
                      <p className="text-sm text-slate-400">
                        Multi-agent orchestration for comprehensive testing
                      </p>
                    </div>

                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-6">
                      <Database className="w-8 h-8 text-emerald-400 mb-3" />
                      <h4 className="font-semibold text-white mb-2">8,214 Regulations</h4>
                      <p className="text-sm text-slate-400">
                        RAG-powered regulatory knowledge base
                      </p>
                    </div>

                    <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-6">
                      <Zap className="w-8 h-8 text-purple-400 mb-3" />
                      <h4 className="font-semibold text-white mb-2">~2 Min Tests</h4>
                      <p className="text-sm text-slate-400">
                        Lightning-fast safety evaluation
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Quick Start Guide */}
<section id="quick-start" className="glass-card rounded-2xl p-8">
  <div className="flex items-center gap-3 mb-6">
    <div className="p-3 bg-emerald-500/10 rounded-xl">
      <Zap className="w-6 h-6 text-emerald-400" />
    </div>
    <h2 className="text-3xl font-bold text-white">Quick Start Guide</h2>
  </div>

  {/* Tabs for Base Model vs Application */}
  <div className="mb-6">
    <div className="flex gap-2 p-1 bg-slate-800/50 rounded-xl inline-flex">
      <button
        onClick={() => setActiveTab('base-model')}
        className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
          activeTab === 'base-model'
            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        Base Model Testing
      </button>
      <button
        onClick={() => setActiveTab('application')}
        className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
          activeTab === 'application'
            ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
            : 'text-slate-400 hover:text-white'
        }`}
      >
        Application Testing
      </button>
    </div>
  </div>

  {/* Base Model Quick Start */}
  {activeTab === 'base-model' && (
    <div className="space-y-6">
      {/* Step 1 */}
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
          1
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-2">Get API Key</h3>
          <p className="text-slate-400 mb-3">
            Sign up for a free API key from your preferred provider:
          </p>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <strong>Groq</strong>: Free unlimited testing at{' '}
              <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                console.groq.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <strong>OpenAI</strong>: Get key at{' '}
              <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                platform.openai.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
              <strong>Anthropic</strong>: Get key at{' '}
              <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                console.anthropic.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Step 2 */}
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
          2
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-2">Configure Test</h3>
          <p className="text-slate-400 mb-3">
            Go to the test configuration page and set up your test:
          </p>
          <div className="bg-slate-900/50 border border-slate-700/30 rounded-lg p-4 font-mono text-sm">
            <div className="text-slate-300">
              <div className="text-slate-500">// Select test type</div>
              <div>Test Type: <span className="text-blue-400">Base Model</span></div>
              <div className="text-slate-500 mt-2">// Choose testing method</div>
              <div>Method: <span className="text-emerald-400">Automated (API)</span></div>
              <div className="text-slate-500 mt-2">// Choose provider</div>
              <div>Provider: <span className="text-emerald-400">Groq</span></div>
              <div>Model: <span className="text-emerald-400">llama-3.3-70b-versatile</span></div>
              <div className="text-slate-500 mt-2">// Select industry</div>
              <div>Industry: <span className="text-purple-400">Healthcare</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 3 */}
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
          3
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-2">Run Test & Get Results</h3>
          <p className="text-slate-400 mb-3">
            Click "Start Test" and receive comprehensive safety analysis in ~2 minutes with:
          </p>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Overall safety score with detailed breakdown
            </li>
            <li className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              Critical issues and regulatory violations
            </li>
            <li className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              Downloadable PDF report with recommendations
            </li>
          </ul>
        </div>
      </div>
    </div>
  )}

  {/* Application Quick Start */}
  {activeTab === 'application' && (
    <div className="space-y-6">
      {/* Step 1 */}
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
          1
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-2">Choose Your Application</h3>
          <p className="text-slate-400 mb-3">
            Select what you want to test:
          </p>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <strong>ChatGPT</strong>: Test OpenAI's consumer chatbot
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <strong>Ada Health</strong>: Test AI health symptom checker
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
              <strong>Cleo AI</strong>: Test finance chatbot
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <strong>Any AI App</strong>: Test your own deployed application
            </li>
          </ul>
        </div>
      </div>

      {/* Step 2 */}
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
          2
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-2">Configure Test</h3>
          <p className="text-slate-400 mb-3">
            Set up your application test:
          </p>
          <div className="bg-slate-900/50 border border-slate-700/30 rounded-lg p-4 font-mono text-sm">
            <div className="text-slate-300">
              <div className="text-slate-500">// Select test type</div>
              <div>Test Type: <span className="text-purple-400">Deployed Application</span></div>
              <div className="text-slate-500 mt-2">// Choose testing method</div>
              <div>Method: <span className="text-blue-400">Manual (Copy/Paste)</span></div>
              <div className="text-slate-500 mt-2">// Select industry</div>
              <div>Industry: <span className="text-emerald-400">Healthcare</span></div>
              <div className="text-slate-500 mt-2">// Number of tests</div>
              <div>Tests: <span className="text-amber-400">8 test cases</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 3 */}
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
          3
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-2">Execute Manual Tests</h3>
          <p className="text-slate-400 mb-3">
            Follow the 3-step testing workflow:
          </p>
          <div className="space-y-3">
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
              <p className="text-sm font-semibold text-blue-400 mb-1">📝 Copy Test Prompt</p>
              <p className="text-xs text-slate-300">
                SafetyCheck generates adversarial test prompts - copy each one
              </p>
            </div>
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-4">
              <p className="text-sm font-semibold text-emerald-400 mb-1">🤖 Test in Your App</p>
              <p className="text-xs text-slate-300">
                Paste the prompt into ChatGPT/Ada Health/your app and get response
              </p>
            </div>
            <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4">
              <p className="text-sm font-semibold text-purple-400 mb-1">✅ Paste Response Back</p>
              <p className="text-xs text-slate-300">
                Copy the AI's response and paste it into SafetyCheck for evaluation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 4 */}
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
          4
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-2">Get Safety Analysis</h3>
          <p className="text-slate-400 mb-3">
            Our Judge Agent + RAG system evaluates each response:
          </p>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              Safety verdict: Safe or Unsafe with confidence score
            </li>
            <li className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              Regulatory citations from 8,214 documents
            </li>
            <li className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              Specific violations and severity ratings
            </li>
            <li className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-400" />
              Detailed explanations and recommendations
            </li>
          </ul>
        </div>
      </div>

      {/* Tip */}
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-400 mb-1">
              💡 Pro Tip: No API Access Needed!
            </p>
            <p className="text-xs text-slate-300">
              Manual testing is perfect for testing proprietary AI apps, consumer chatbots like ChatGPT, 
              or any AI system without public API access. Our Judge Agent still uses RAG to evaluate 
              responses against real regulations!
            </p>
          </div>
        </div>
      </div>
    </div>
  )}
</section>

              {/* Features */}
              <section id="features" className="glass-card rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-purple-500/10 rounded-xl">
                    <Shield className="w-6 h-6 text-purple-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">Key Features</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-6">
                    <Brain className="w-8 h-8 text-blue-400 mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Multi-Agent Architecture</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Test Generator Agent creates adversarial test cases, Judge Agent evaluates safety with regulatory context,
                      and Coordinator orchestrates the entire workflow.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-xl p-6">
                    <Database className="w-8 h-8 text-emerald-400 mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">RAG-Powered Evaluation</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Our Retrieval-Augmented Generation system uses 8,214 regulatory documents to provide context-aware
                      safety evaluation grounded in actual HIPAA, FDA, SEC, and FINRA regulations.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-6">
                    <Globe className="w-8 h-8 text-purple-400 mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Multi-Provider Support</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Test any LLM through Groq, OpenAI, Anthropic, or custom endpoints. Support for GPT-4, Claude,
                      Llama 3.3, and more with automatic provider-specific API handling.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-xl p-6">
                    <FileText className="w-8 h-8 text-amber-400 mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Dual Testing Modes</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Automated API testing for fast results, or Manual testing to evaluate any AI application
                      (ChatGPT, Ada Health, Cleo AI) without API access.
                    </p>
                  </div>
                </div>
              </section>

              {/* API Testing */}
              <section id="api-testing" className="glass-card rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-emerald-500/10 rounded-xl">
                    <Terminal className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">API Testing</h2>
                </div>

                <p className="text-slate-300 mb-6">
                  Automated API testing allows you to test any LLM model programmatically with your API key.
                  Tests are executed automatically and results are available in 2-5 minutes.
                </p>

                <div className="bg-slate-900/50 border border-slate-700/30 rounded-xl p-6 mb-6">
                  <h4 className="text-sm font-semibold text-slate-400 mb-3">Example Configuration:</h4>
                  <pre className="text-sm text-slate-300 overflow-x-auto">
{`{
  "test_type": "base_model",
  "testing_method": "api",
  "industry": "healthcare",
  "model_provider": "groq",
  "model_name": "llama-3.3-70b-versatile",
  "api_key": "gsk_...",
  "num_tests": 8,
  "quick_mode": true
}`}
                  </pre>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-white mb-1">Fast & Scalable</p>
                      <p className="text-sm text-slate-400">8 tests in ~2 minutes with automated execution</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-white mb-1">Reproducible Results</p>
                      <p className="text-sm text-slate-400">Same configuration always produces consistent results</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-purple-500/5 border border-purple-500/20 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-white mb-1">Comprehensive Reports</p>
                      <p className="text-sm text-slate-400">Detailed PDF reports with safety analysis and recommendations</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Manual Testing */}
              <section id="manual-testing" className="glass-card rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-amber-500/10 rounded-xl">
                    <FileText className="w-6 h-6 text-amber-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">Manual Testing</h2>
                </div>

                <p className="text-slate-300 mb-6">
                  Manual testing allows you to test any AI application without API access. Perfect for testing
                  ChatGPT, Ada Health, Cleo AI, or any proprietary chatbot.
                </p>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      1
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-1">Generate Test Prompts</h4>
                      <p className="text-sm text-slate-400">
                        SafetyCheck generates 8 adversarial test prompts based on your selected industry
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      2
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-1">Test in Your AI App</h4>
                      <p className="text-sm text-slate-400">
                        Copy each prompt and paste into ChatGPT, Ada Health, or any AI application
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      3
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-1">Paste Responses</h4>
                      <p className="text-sm text-slate-400">
                        Copy the AI's response and paste it back into SafetyCheck for evaluation
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      4
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-1">Get Safety Analysis</h4>
                      <p className="text-sm text-slate-400">
                        Our Judge Agent evaluates each response for safety and compliance
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Architecture */}
              <section id="architecture" className="glass-card rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-500/10 rounded-xl">
                    <Cpu className="w-6 h-6 text-blue-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">System Architecture</h2>
                </div>

                <p className="text-slate-300 mb-6">
                  SafetyCheck uses a sophisticated multi-agent architecture with RAG integration:
                </p>

                <div className="bg-slate-900/50 border border-slate-700/30 rounded-xl p-6 font-mono text-sm mb-6">
                  <pre className="text-slate-300">
{`  ┌────────────────────────────────────────────┐
  │         SAFETYCHECK PLATFORM               │
  ├────────────────────────────────────────────┤
  │  Frontend (React + Tailwind)               │
  │      ↓ REST API                            │
  │  Backend (FastAPI)                         │
  │      ↓                                     │
  │  AGENTIC ORCHESTRATION                     │
  │  ├─ Test Coordinator                       │
  │  ├─ Test Generator Agent (Groq Llama 3.3)  │
  │  ├─ Judge Agent (Groq Llama 3.3)           │
  │  ├─ RAG System (8,214 regulations)         │
  │  └─ Model Client (Multi-provider)          │
  │      ↓                                     │
  │  LLM PROVIDERS                             │
  │  └─ Groq / OpenAI / Anthropic / Custom     │
  └────────────────────────────────────────────┘`}
                  </pre>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
                    <Code className="w-6 h-6 text-blue-400 mb-2" />
                    <h4 className="text-sm font-semibold text-white mb-1">Frontend</h4>
                    <p className="text-xs text-slate-400">React 18, Tailwind CSS, Framer Motion</p>
                  </div>

                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-4">
                    <Terminal className="w-6 h-6 text-emerald-400 mb-2" />
                    <h4 className="text-sm font-semibold text-white mb-1">Backend</h4>
                    <p className="text-xs text-slate-400">FastAPI, Python 3.10+, Uvicorn</p>
                  </div>

                  <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4">
                    <Database className="w-6 h-6 text-purple-400 mb-2" />
                    <h4 className="text-sm font-semibold text-white mb-1">AI/ML</h4>
                    <p className="text-xs text-slate-400">Groq, OpenAI, Anthropic, ChromaDB</p>
                  </div>
                </div>
              </section>

              {/* Regulations */}
              <section id="regulations" className="glass-card rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-emerald-500/10 rounded-xl">
                    <Database className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">Regulatory Coverage</h2>
                </div>

                <p className="text-slate-300 mb-6">
                  Our RAG system uses 8,214 regulatory documents across healthcare and finance:
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Healthcare (HIPAA + FDA)</h3>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                        <span>No PHI sharing without authorization</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                        <span>No prescription without medical license</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                        <span>Emergency care direction required</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                        <span>No definitive diagnoses</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Finance (SEC + FINRA)</h3>
                    <ul className="space-y-2 text-sm text-slate-300">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>No unlicensed investment advice</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>No guaranteed returns promises</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>No account information sharing</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>No misleading claims</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* FAQ */}
              <section id="faq" className="glass-card rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-purple-500/10 rounded-xl">
                    <AlertCircle className="w-6 h-6 text-purple-400" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
                </div>

                <div className="space-y-3">
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className={`border rounded-xl transition-all ${
                        expandedFaq === index
                          ? 'bg-blue-500/5 border-blue-500/20'
                          : 'bg-slate-800/20 border-slate-700/30 hover:border-slate-600/50'
                      }`}
                    >
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                        className="w-full p-5 text-left flex items-start justify-between gap-4"
                      >
                        <span className="font-semibold text-white">{faq.question}</span>
                        {expandedFaq === index ? (
                          <ChevronDown className="w-5 h-5 text-blue-400 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0" />
                        )}
                      </button>

                      {expandedFaq === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-5 pb-5"
                        >
                          <p className="text-slate-300 leading-relaxed">{faq.answer}</p>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* CTA */}
              <div className="glass-card rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Ready to Test Your AI?</h3>
                <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
                  Start testing your AI models for safety and compliance in minutes with our
                  multi-agent platform and RAG-powered evaluation.
                </p>
                <button
                  onClick={() => navigate('/test/config')}
                  className="btn-primary px-8 py-3 text-lg"
                >
                  <PlayCircle className="w-5 h-5 inline mr-2" />
                  Start Testing Now
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}