// src/components/HomePage.jsx
import React from 'react';
import { Shield, Users, Trophy, BarChart3, TrendingUp, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
const HomePage = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to SafetyCheck</h1>
        <p className="text-gray-400 text-lg">
          Your free, community-driven platform for AI safety testing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <Shield className="text-blue-500" size={32} />
            <span className="text-2xl font-bold">3</span>
          </div>
          <h3 className="text-lg font-semibold mb-1">Safety Tests</h3>
          <p className="text-sm text-gray-400">Toxicity, Privacy, Jailbreaks</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <Users className="text-green-500" size={32} />
            <span className="text-2xl font-bold">50+</span>
          </div>
          <h3 className="text-lg font-semibold mb-1">Community Tests</h3>
          <p className="text-sm text-gray-400">Shared by our users</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <Trophy className="text-yellow-500" size={32} />
            <span className="text-2xl font-bold">20+</span>
          </div>
          <h3 className="text-lg font-semibold mb-1">Models Ranked</h3>
          <p className="text-sm text-gray-400">On our public leaderboard</p>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="text-purple-500" size={32} />
            <span className="text-2xl font-bold">100%</span>
          </div>
          <h3 className="text-lg font-semibold mb-1">Free to Use</h3>
          <p className="text-sm text-gray-400">For small developers</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BarChart3 size={24} />
            Quick Start
          </h2>
          <ol className="space-y-3 text-gray-300">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
              <span>Sign up for a free account to get your API key.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
              <span>Navigate to the <strong>Safety Testing</strong> page to run your first test.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">3</span>
              <span>Explore the <strong>Community Library</strong> for test cases created by other users.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold">4</span>
              <span>Check the <strong>Model Leaderboard</strong> to compare AI safety performance.</span>
            </li>
          </ol>
        </div>

        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp size={24} />
            Why SafetyCheck?
          </h2>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
              <span><strong>Free:</strong> No expensive audits, just powerful safety tools.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
              <span><strong>Community-Driven:</strong> Share knowledge and test cases with other developers.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
              <span><strong>Context-Aware:</strong> Get tests tailored to your specific use case.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={18} />
              <span><strong>Transparent:</strong> Public leaderboards show which models are safest.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomePage;