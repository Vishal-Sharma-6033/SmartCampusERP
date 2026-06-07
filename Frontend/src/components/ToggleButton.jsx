import React from 'react';

const ToggleButton = ({ status, onChange, disabled }) => {
  const isPresent = status?.toLowerCase() === 'present';
  
  return (
    <button
      type="button"
      onClick={() => onChange(isPresent ? 'absent' : 'present')}
      disabled={disabled}
      className="btn btn-sm"
      style={{
        backgroundColor: isPresent ? 'var(--success)' : 'var(--danger)',
        color: '#fff',
        border: 'none',
        padding: '6px 16px',
        minWidth: '100px',
        fontWeight: '600',
        borderRadius: 'var(--radius-full)',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all var(--transition)'
      }}
    >
      {isPresent ? 'PRESENT' : 'ABSENT'}
    </button>
  );
};

export default ToggleButton;
