import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  let bg = 'var(--success-light)';
  let border = '#BBF7D0';
  let color = '#15803D';

  if (type === 'error') {
    bg = 'var(--danger-light)';
    border = '#FECACA';
    color = '#B91C1C';
  } else if (type === 'warning') {
    bg = 'var(--warning-light)';
    border = '#FDE68A';
    color = '#92400E';
  } else if (type === 'info') {
    bg = 'var(--info-light)';
    border = '#BFDBFE';
    color = '#1D4ED8';
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 18px',
      backgroundColor: bg,
      border: `1px solid ${border}`,
      color: color,
      borderRadius: 'var(--radius)',
      boxShadow: 'var(--shadow-lg)',
    }}>
      <span className="font-semibold text-sm">{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'currentColor',
          cursor: 'pointer',
          fontWeight: 'bold',
          padding: '0 4px',
          marginLeft: '8px'
        }}
      >
        ×
      </button>
    </div>
  );
};

export default Toast;
