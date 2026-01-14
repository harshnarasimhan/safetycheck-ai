// src/components/CommunityPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  ThumbsUp, 
  ThumbsDown, 
  FileText,
  User,
  Clock,
  Tag,
  TrendingUp,
  MessageSquare,
  Star,
  ChevronDown,
  Eye
} from 'lucide-react';

const CommunityPage = ({ apiKey }) => {
  const [testCases, setTestCases] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTestCase, setNewTestCase] = useState({
    title: '',
    description: '',
    category: '',
    prompt: '',
    expected_behavior: ''
  });
  const [votedTestCases, setVotedTestCases] = useState(new Set());
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchTestCases();
    fetchCategories();
  }, [selectedCategory, sortBy, sortOrder]);

  const fetchTestCases = async () => {
    try {
      setLoading(true);
      const url = selectedCategory 
        ? `http://localhost:8000/test-cases?category=${selectedCategory}`
        : 'http://localhost:8000/test-cases';
      
      const response = await fetch(url);
      const data = await response.json();
      setTestCases(data.test_cases);
    } catch (error) {
      console.error('Error fetching test cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/categories');
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleVote = async (testCaseId, voteValue) => {
    if (!apiKey) {
      showNotification('Please sign in to vote', 'warning');
      return;
    }

    if (votedTestCases.has(testCaseId)) {
      showNotification('You have already voted on this test case', 'info');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/test-cases/${testCaseId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey
        },
        body: JSON.stringify({ value: voteValue })
      });

      if (response.ok) {
        const data = await response.json();
        setTestCases(prevTestCases => 
          prevTestCases.map(tc => 
            tc.id === testCaseId 
              ? { ...tc, vote_score: data.new_score }
              : tc
          )
        );
        setVotedTestCases(prev => new Set([...prev, testCaseId]));
        showNotification('Vote recorded successfully', 'success');
      } else {
        const errorData = await response.json();
        showNotification(`Error: ${errorData.detail}`, 'error');
      }
    } catch (error) {
      console.error('Error voting:', error);
      showNotification('Failed to vote. Please try again.', 'error');
    }
  };

  const handleCreateTestCase = async (e) => {
    e.preventDefault();
    
    if (!apiKey) {
      showNotification('Please sign in to create a test case', 'warning');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/test-cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey
        },
        body: JSON.stringify(newTestCase)
      });

      if (response.ok) {
        const data = await response.json();
        showNotification(`Test case "${data.title}" created successfully!`, 'success');
        setShowCreateForm(false);
        setNewTestCase({
          title: '',
          description: '',
          category: '',
          prompt: '',
          expected_behavior: ''
        });
        fetchTestCases();
      } else {
        const errorData = await response.json();
        showNotification(`Error: ${errorData.detail}`, 'error');
      }
    } catch (error) {
      console.error('Error creating test case:', error);
      showNotification('Failed to create test case. Please try again.', 'error');
    }
  };

  const showNotification = (message, type) => {
    // In a real app, you'd use a proper notification system
    console.log(`${type}: ${message}`);
  };

  const filteredTestCases = testCases.filter(testCase =>
    testCase.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testCase.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedTestCases = [...filteredTestCases].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'vote_score') {
      aValue = a.vote_score || 0;
      bValue = b.vote_score || 0;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-gradient">Community Test Library</h1>
        <p className="text-secondary">Browse, use, and contribute test cases for AI safety</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="lg:col-span-3">
          <div className="glass-card p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search test cases..."
                  className="glass-input w-full pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <select
                  className="glass-input px-4"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <select
                  className="glass-input px-4"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="created_at">Latest</option>
                  <option value="vote_score">Most Voted</option>
                  <option value="title">Title</option>
                </select>
                {apiKey && (
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="glass-button glass-button-primary"
                  >
                    <Plus size={20} />
                    Create
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="glass-card p-4">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <TrendingUp size={18} />
              Community Stats
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary">Total Tests</span>
                <span className="font-medium">{testCases.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Categories</span>
                <span className="font-medium">{categories.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Active Users</span>
                <span className="font-medium">127</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCreateForm && (
        <div className="modal-overlay">
          <div className="glass-modal w-full max-w-2xl p-8 fade-in">
            <h2 className="text-2xl font-bold mb-6">Create New Test Case</h2>
            <form onSubmit={handleCreateTestCase}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="floating-label">Title</label>
                  <input
                    type="text"
                    required
                    className="glass-input w-full"
                    value={newTestCase.title}
                    onChange={(e) => setNewTestCase({...newTestCase, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="floating-label">Category</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., healthcare, education"
                    className="glass-input w-full"
                    value={newTestCase.category}
                    onChange={(e) => setNewTestCase({...newTestCase, category: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="floating-label">Description</label>
                <textarea
                  required
                  rows="3"
                  className="glass-input w-full"
                  value={newTestCase.description}
                  onChange={(e) => setNewTestCase({...newTestCase, description: e.target.value})}
                />
              </div>
              
              <div className="mb-4">
                <label className="floating-label">Test Prompt</label>
                <textarea
                  required
                  rows="3"
                  className="glass-input w-full"
                  value={newTestCase.prompt}
                  onChange={(e) => setNewTestCase({...newTestCase, prompt: e.target.value})}
                />
              </div>
              
              <div className="mb-6">
                <label className="floating-label">Expected Behavior</label>
                <textarea
                  rows="3"
                  className="glass-input w-full"
                  value={newTestCase.expected_behavior}
                  onChange={(e) => setNewTestCase({...newTestCase, expected_behavior: e.target.value})}
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="glass-button glass-button-primary"
                >
                  Create Test Case
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="glass-button glass-button-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="glass-card h-64 flex items-center justify-center">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-secondary">Loading test cases...</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {sortedTestCases.length === 0 ? (
            <div className="glass-card h-64 flex items-center justify-center">
              <div className="text-center">
                <FileText size={48} className="mx-auto mb-4 text-gray-600" />
                <p className="text-secondary">No test cases found. {apiKey ? 'Create one!' : 'Sign in to create one.'}</p>
              </div>
            </div>
          ) : (
            sortedTestCases.map(testCase => (
              <div key={testCase.id} className="test-case-card">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{testCase.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-secondary mb-2">
                      <span className="flex items-center gap-1">
                        <Tag size={14} />
                        {testCase.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <User size={14} />
                        {testCase.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {new Date(testCase.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 glass rounded-full text-xs font-medium">
                      {testCase.vote_score > 0 ? `+${testCase.vote_score}` : testCase.vote_score}
                    </span>
                  </div>
                </div>
                
                <p className="text-secondary mb-4">{testCase.description}</p>
                
                <div className="mb-4">
                  <div className="text-sm text-secondary mb-2 flex items-center gap-2">
                    <MessageSquare size={14} />
                    Test Prompt
                  </div>
                  <div className="code-block">{testCase.prompt}</div>
                </div>
                
                {testCase.expected_behavior && (
                  <div className="mb-4">
                    <div className="text-sm text-secondary mb-2 flex items-center gap-2">
                      <Eye size={14} />
                      Expected Behavior
                    </div>
                    <div className="code-block">{testCase.expected_behavior}</div>
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleVote(testCase.id, 1)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                        votedTestCases.has(testCase.id) 
                          ? 'glass opacity-50 cursor-not-allowed' 
                          : 'glass hover:bg-white hover:bg-opacity-10'
                      }`}
                      disabled={votedTestCases.has(testCase.id)}
                    >
                      <ThumbsUp size={16} />
                      <span>{testCase.vote_score > 0 ? testCase.vote_score : 0}</span>
                    </button>
                    <button
                      onClick={() => handleVote(testCase.id, -1)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                        votedTestCases.has(testCase.id) 
                          ? 'glass opacity-50 cursor-not-allowed' 
                          : 'glass hover:bg-white hover:bg-opacity-10'
                      }`}
                      disabled={votedTestCases.has(testCase.id)}
                    >
                      <ThumbsDown size={16} />
                      <span>{testCase.vote_score < 0 ? Math.abs(testCase.vote_score) : 0}</span>
                    </button>
                  </div>
                  <button className="glass-button glass-button-secondary text-sm">
                    Use This Test
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CommunityPage;