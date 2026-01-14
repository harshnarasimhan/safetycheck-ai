// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import TermsPage from './components/TermsPage';
import Dashboard from './components/Dashboard';
import TestConfigPage from './components/TestConfigPage';
import ManualTestingPage from './components/ManualTestingPage';  // ← ADD THIS
import TestResultsPage from './components/TestResultsPage';
import DocumentationPage from './components/DocumentationPage';


// Protected Route - requires login
function ProtectedRoute({ children }) {
  const user = localStorage.getItem('user');
  return user ? children : <Navigate to="/" />;
}

// Terms Check - redirects to terms if not accepted
function TermsCheck({ children }) {
  const userData = localStorage.getItem('user');
  if (!userData) return <Navigate to="/" />;
  
  const user = JSON.parse(userData);
  return user.acceptedTerms ? children : <Navigate to="/terms" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        <Route path="/terms" element={
          <ProtectedRoute>
            <TermsPage />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard" element={
          <TermsCheck>
            <Dashboard />
          </TermsCheck>
        } />
        
        <Route path="/test/config" element={
          <TermsCheck>
            <TestConfigPage />
          </TermsCheck>
        } />
        
        {/* ADD THIS ROUTE */}
        <Route path="/test/manual" element={
          <TermsCheck>
            <ManualTestingPage />
          </TermsCheck>
        } />

        <Route path="/terms" element={<TermsPage />} />

        <Route path="/docs" element={<DocumentationPage />} />
        
        <Route path="/test/results/:testRunId" element={
          <TermsCheck>
            <TestResultsPage />
          </TermsCheck>
        } />
      </Routes>
    </Router>
  );
}

export default App;