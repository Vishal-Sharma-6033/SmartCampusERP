import React from 'react';

const OverdueBanner = ({ hasOverdue }) => {
  if (!hasOverdue) return null;

  return (
    <div 
      className="alert alert-danger" 
      style={{ 
        position: 'sticky', 
        top: '0', 
        zIndex: 100, 
        margin: '0 0 20px 0', 
        borderLeft: '4px solid var(--danger)',
        backgroundColor: '#FEF2F2',
        color: '#991B1B',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 16px',
        borderRadius: 'var(--radius)'
      }}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0 }}>
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      <div>
        <strong style={{ fontWeight: '700' }}>Warning: </strong>
        <span>You have overdue library books! Late fines are accumulating at a rate of ₹10 per day. Please return them to avoid service suspensions.</span>
      </div>
    </div>
  );
};

export default OverdueBanner;
