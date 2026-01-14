import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Shield, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';

export default function TermsPage() {
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);

  const handleAccept = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    user.acceptedTerms = true;
    localStorage.setItem('user', JSON.stringify(user));
    navigate('/dashboard');
  };

  const handleDecline = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-bg opacity-50"></div>
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <FileText className="w-8 h-8 text-blue-400" />
              </div>
              <h1 className="text-4xl font-bold text-white">Terms & Conditions</h1>
            </div>
            <p className="text-slate-400 text-lg">
              Please review and accept our terms to continue
            </p>
          </div>

          {/* Terms Card */}
          <div className="glass-card rounded-2xl overflow-hidden shadow-2xl">
            {/* Alert Banner */}
            <div className="bg-amber-500/10 border-b border-amber-500/20 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-300 mb-1">
                    Educational Platform - Please Read Carefully
                  </p>
                  <p className="text-xs text-slate-300">
                    By using SafetyCheck, you acknowledge this is an educational project and not a professional safety certification service.
                  </p>
                </div>
              </div>
            </div>

            {/* Terms Content */}
            <div className="p-8 max-h-[60vh] overflow-y-auto space-y-8">
              {/* 1. Acceptance of Terms */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-400 font-bold">1</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">Acceptance of Terms</h2>
                </div>
                <div className="pl-11 text-sm text-slate-300 space-y-3 leading-relaxed">
                  <p>
                    By accessing and using SafetyCheck ("the Platform"), you accept and agree to be bound by these Terms and Conditions. 
                    If you do not agree to these terms, please do not use the Platform.
                  </p>
                  <p>
                    This Platform is provided as a capstone project for educational and demonstration purposes only.
                  </p>
                </div>
              </section>

              {/* 2. Educational Purpose */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-400 font-bold">2</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">Educational & Demonstration Platform</h2>
                </div>
                <div className="pl-11 space-y-4">
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4">
                    <p className="text-sm text-slate-300 leading-relaxed mb-3">
                      <strong className="text-blue-300">SafetyCheck is a student capstone project</strong> developed to demonstrate:
                    </p>
                    <ul className="text-sm text-slate-300 space-y-2">
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                        <span>Multi-agent AI architectures and orchestration</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                        <span>Retrieval-Augmented Generation (RAG) implementation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                        <span>AI safety testing methodologies and best practices</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                        <span>Full-stack application development (FastAPI + React)</span>
                      </li>
                    </ul>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed pl-4">
                    Results from this Platform are for educational and demonstration purposes only and should not be used as 
                    the sole basis for production deployment decisions or regulatory compliance.
                  </p>
                </div>
              </section>

              {/* 3. Not Professional Certification */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-400 font-bold">3</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">Limitations & Disclaimers</h2>
                </div>
                <div className="pl-11 space-y-4">
                  <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                    <p className="text-sm font-semibold text-amber-300 mb-3">
                      This Platform does NOT provide:
                    </p>
                    <ul className="text-sm text-slate-300 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-400 flex-shrink-0">✗</span>
                        <span>Official regulatory compliance certifications (HIPAA, SEC, FDA, etc.)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-400 flex-shrink-0">✗</span>
                        <span>Legal clearance or authorization for AI system deployment</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-400 flex-shrink-0">✗</span>
                        <span>Professional AI safety audits or penetration testing</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-400 flex-shrink-0">✗</span>
                        <span>Guarantees of AI system safety, security, or compliance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-400 flex-shrink-0">✗</span>
                        <span>Legal, medical, financial, or professional advice of any kind</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 4. User Responsibilities */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-400 font-bold">4</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">User Responsibilities</h2>
                </div>
                <div className="pl-11 text-sm text-slate-300 space-y-3 leading-relaxed">
                  <p>As a user of this Platform, you agree to:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>Use the Platform for educational and testing purposes only</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>Not use test results as the sole basis for production deployment decisions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>Consult with qualified professionals for actual compliance requirements</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>Not include any personally identifiable information (PII) in test inputs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>Protect and not share your API keys with unauthorized parties</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* 5. Data & Privacy */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-400 font-bold">5</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">Data Handling & Privacy</h2>
                </div>
                <div className="pl-11 text-sm text-slate-300 space-y-3 leading-relaxed">
                  <p>
                    <strong className="text-white">API Keys:</strong> Your API keys are transmitted securely to third-party 
                    LLM providers (Groq, OpenAI, Anthropic) for testing purposes. We do not permanently store your API keys.
                  </p>
                  <p>
                    <strong className="text-white">Test Data:</strong> Test prompts, responses, and results may be temporarily 
                    stored for report generation. This data is not shared with third parties beyond the LLM providers necessary 
                    for testing.
                  </p>
                  <p>
                    <strong className="text-white">Third-Party Services:</strong> Your use of this Platform involves third-party 
                    LLM APIs (Groq, OpenAI, Anthropic). Your data is subject to their respective privacy policies and terms of service.
                  </p>
                </div>
              </section>

              {/* 6. Limitation of Liability */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-red-400 font-bold">6</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">Limitation of Liability</h2>
                </div>
                <div className="pl-11 space-y-4">
                  <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                    <p className="text-sm text-slate-300 leading-relaxed mb-3">
                      <strong className="text-red-300">THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND.</strong>
                    </p>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      The developers, operators, and affiliated institutions shall not be liable for any direct, indirect, 
                      incidental, special, consequential, or punitive damages resulting from:
                    </p>
                  </div>
                  <ul className="text-sm text-slate-300 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 flex-shrink-0">•</span>
                      <span>Use or inability to use the Platform</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 flex-shrink-0">•</span>
                      <span>Decisions made based on test results or safety evaluations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 flex-shrink-0">•</span>
                      <span>Regulatory violations, compliance failures, or legal issues</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 flex-shrink-0">•</span>
                      <span>Inaccuracies, errors, or omissions in test results</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 flex-shrink-0">•</span>
                      <span>Data breaches, unauthorized access, or loss of data</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400 flex-shrink-0">•</span>
                      <span>Any other matter relating to the Platform</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* 7. Professional Recommendations */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-400 font-bold">7</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">Professional Recommendations</h2>
                </div>
                <div className="pl-11 space-y-4">
                  <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-4">
                    <p className="text-sm text-slate-300 leading-relaxed mb-3">
                      <strong className="text-emerald-300">For production AI deployments in regulated industries, we strongly recommend:</strong>
                    </p>
                    <ul className="text-sm text-slate-300 space-y-2">
                      <li className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>Engaging certified AI safety auditors and compliance experts</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>Consulting with legal counsel specializing in AI regulations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>Conducting comprehensive third-party security audits</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>Implementing enterprise-grade monitoring and safety controls</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>Following official regulatory guidelines for your jurisdiction</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 8. Changes to Terms */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-400 font-bold">8</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">Changes to Terms</h2>
                </div>
                <div className="pl-11 text-sm text-slate-300 space-y-3 leading-relaxed">
                  <p>
                    We reserve the right to modify these Terms and Conditions at any time. Continued use of the Platform 
                    after changes constitutes acceptance of the modified terms.
                  </p>
                </div>
              </section>

              {/* Contact Info */}
              <section className="pt-6 border-t border-slate-700/50">
                <p className="text-xs text-slate-400 text-center leading-relaxed">
                  This is a student capstone project developed for educational purposes.<br />
                  For questions, concerns, or feedback, please contact the development team through your academic institution.<br />
                  <span className="text-slate-500">Last Updated: January 2026</span>
                </p>
              </section>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-slate-700/50 bg-slate-900/50">
              <div className="mb-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                    className="mt-1 w-5 h-5 rounded border-slate-600 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                  />
                  <span className="text-sm text-slate-300 leading-relaxed">
                    I have read, understood, and agree to the Terms and Conditions. I acknowledge that this is an 
                    educational platform and results should not be used as professional safety certifications.
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleDecline}
                  className="btn-secondary py-3"
                >
                  Decline
                </button>
                <button
                  onClick={handleAccept}
                  disabled={!accepted}
                  className="btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Accept & Continue
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}