import React from 'react';

const FeeStatusBadge = ({ status }) => {
  let className = 'badge-danger'; // default PENDING
  const s = status?.toUpperCase() || 'PENDING';
  
  if (s === 'PAID') {
    className = 'badge-success';
  } else if (s === 'PARTIAL') {
    className = 'badge-warning';
  }

  return (
    <span className={`badge ${className}`} style={{ padding: '4px 10px', fontSize: '0.75rem', fontWeight: '600' }}>
      {s}
    </span>
  );
};

export default FeeStatusBadge;
