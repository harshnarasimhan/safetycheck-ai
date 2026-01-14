// frontend/src/ResultsCard.jsx
import React from 'react';

// A simple component to display results in a clean card
function ResultsCard({ title, children }) {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      margin: '20px 0',
      backgroundColor: '#f9f9f9',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h4 style={{ marginTop: 0, color: '#333' }}>{title}</h4>
      <div style={{ fontSize: '16px' }}>
        {children}
      </div>
    </div>
  );
}

export default ResultsCard;