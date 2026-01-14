import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Loader2, Activity } from 'lucide-react';

export default function LoadingScreen({ 
  message = "Loading...", 
  subtitle = "Please wait...",
  showProgress = false 
}) {
  return (
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Background effects - Blue theme */}
      <div className="absolute inset-0 gradient-bg opacity-50"></div>
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 glass-card rounded-2xl p-12 text-center max-w-md w-full mx-4"
      >
        {/* Animated logo with glow effect */}
        <motion.div
          animate={{ 
            rotate: 360,
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="w-24 h-24 mx-auto mb-6 relative"
        >
          {/* Outer glow ring */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute inset-0 bg-blue-500/30 rounded-2xl blur-xl"
          />
          
          {/* Main logo */}
          <div className="relative w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/50">
            <Shield className="w-12 h-12 text-white" />
          </div>
        </motion.div>
        
        {/* Loading text */}
        <h2 className="text-2xl font-bold text-white mb-2">{message}</h2>
        <p className="text-slate-400 mb-6">{subtitle}</p>
        
        {/* Progress bar */}
        {showProgress && (
          <div className="mb-6">
            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
            </div>
          </div>
        )}
        
        {/* Loading dots animation */}
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
          <div className="flex gap-1">
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
        </div>
      </motion.div>
    </div>
  );
}