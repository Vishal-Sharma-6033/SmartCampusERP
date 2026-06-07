import React from 'react';

const StatusBadge = ({ status, color }) => {
  const badgeStyle = {
    padding: '4px 10px',
    borderRadius: 'var(--radius-full)',
    fontSize: '0.75rem',
    fontWeight: '600',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
    lineHeight: '1',
  };

  if (color) {
    badgeStyle.backgroundColor = `${color}15`;
    badgeStyle.color = color;
  }

  // Pre-configured CSS classes from global style
  let className = '';
  if (!color) {
    const s = status?.toLowerCase() || '';
    if (s === 'submitted' || s === 'on time' || s === 'on-time') {
      className = 'badge-success';
    } else if (s === 'late' || s === 'overdue' || s === 'failed') {
      className = 'badge-danger';
    } else if (s === 'pending' || s === 'partial') {
      className = 'badge-warning';
    } else if (s === 'graded' || s === 'passed') {
      className = 'badge-info';
    } else {
      className = 'badge-neutral';
    }
  }

  return (
    <span className={color ? '' : `badge ${className}`} style={color ? badgeStyle : {}}>
      {status}
    </span>
  );
};

export default StatusBadge;
