import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Shield, FileText, X } from 'lucide-react';

export default function Disclaimer() {
  const [showFullDisclaimer, setShowFullDisclaimer] = useState(false);

  return (
    <>
      {/* Compact Disclaimer Banner */}
      <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg flex-shrink-0">
            <Info className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-blue-200 font-medium mb-1">
              Important Information
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              This is an educational AI safety testing platform. Results are for demonstration purposes only and should not be considered as professional safety certifications.
            </p>
            <button
              onClick={() => setShowFullDisclaimer(true)}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium mt-2 inline-flex items-center gap-1"
            >
              Read full disclaimer
              <FileText className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Full Disclaimer Modal */}
      <AnimatePresence>
        {showFullDisclaimer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowFullDisclaimer(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-xl">
                    <Shield className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Disclaimer & Important Information</h3>
                    <p className="text-sm text-slate-400">Please read carefully</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowFullDisclaimer(false)}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)] space-y-6">
                {/* Educational Purpose */}
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-300 mb-2">Educational Platform</h4>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        SafetyCheck is a capstone project developed for educational purposes only. It is not affiliated with any safety certifications or regulatory bodies.  
                      </p>
                    </div>
                  </div>
                </div>

                {/* Not Professional Certification */}
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-300 mb-2">Not a Professional Safety Certification</h4>
                      <p className="text-sm text-slate-300 leading-relaxed mb-3">
                        Test results should not be considered as:
                      </p>
                      <ul className="text-sm text-slate-300 space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-amber-400 flex-shrink-0">•</span>
                          <span>Official regulatory compliance certifications</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-400 flex-shrink-0">•</span>
                          <span>Legal clearance for AI deployment in production environments</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-400 flex-shrink-0">•</span>
                          <span>Replacement for professional AI safety audits</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-400 flex-shrink-0">•</span>
                          <span>Guarantee of AI system safety or compliance</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Limitation of Liability */}
                <div>
                  <h4 className="font-semibold text-white mb-3">Limitation of Liability</h4>
                  <div className="text-sm text-slate-300 space-y-3 leading-relaxed">
                    <p>
                      This platform is provided "as is" without warranties of any kind. The developers 
                      and operators of SafetyCheck shall not be held liable for:
                    </p>
                    <ul className="space-y-2 pl-4">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 flex-shrink-0">•</span>
                        <span>Decisions made based on test results from this platform</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 flex-shrink-0">•</span>
                        <span>Any damages resulting from the use or inability to use this service</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 flex-shrink-0">•</span>
                        <span>Inaccuracies or errors in test results or safety evaluations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400 flex-shrink-0">•</span>
                        <span>Compliance violations or regulatory issues with tested AI systems</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Data Privacy */}
                <div>
                  <h4 className="font-semibold text-white mb-3">Data Privacy & Security</h4>
                  <div className="text-sm text-slate-300 space-y-2 leading-relaxed">
                    <p>
                      <strong className="text-white">API Keys:</strong> Your API keys are used only for testing 
                      purposes and are not stored permanently. They are transmitted securely to third-party 
                      LLM providers (Groq, OpenAI, Anthropic) as per their terms of service.
                    </p>
                    <p>
                      <strong className="text-white">Test Data:</strong> Test prompts and responses may be 
                      temporarily stored for generating reports. No personally identifiable information (PII) 
                      should be included in test inputs.
                    </p>
                    <p>
                      <strong className="text-white">Third-Party Services:</strong> This platform uses third-party 
                      LLM APIs. Your usage is subject to their respective privacy policies and terms of service.
                    </p>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-emerald-300 mb-2">Professional Recommendations</h4>
                      <p className="text-sm text-slate-300 leading-relaxed mb-2">
                        For production AI deployments in regulated industries, we strongly recommend:
                      </p>
                      <ul className="text-sm text-slate-300 space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-400 flex-shrink-0">•</span>
                          <span>Engaging professional AI safety auditors and legal counsel</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-400 flex-shrink-0">•</span>
                          <span>Conducting comprehensive compliance reviews with industry experts</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-400 flex-shrink-0">•</span>
                          <span>Implementing enterprise-grade safety testing and monitoring</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-emerald-400 flex-shrink-0">•</span>
                          <span>Following official regulatory guidelines for your jurisdiction</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="pt-4 border-t border-slate-700/50">
                  <p className="text-xs text-slate-400 text-center">
                    This platform is a student capstone project. For questions or concerns, 
                    please contact the development team through your academic institution.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-700/50 bg-slate-900/50">
                <button
                  onClick={() => setShowFullDisclaimer(false)}
                  className="btn-primary w-full"
                >
                  I Understand
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}