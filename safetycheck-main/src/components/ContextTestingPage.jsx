// src/components/ContextTestingPage.jsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ContextTestingPage() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the new test config page
    navigate('/test/config');
  }, [navigate]);
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Redirecting to test configuration...</p>
      </div>
    </div>
  );
}