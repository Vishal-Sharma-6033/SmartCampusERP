import React from 'react';

const ProgressBar = ({ value }) => {
  const rounded = Math.min(100, Math.max(0, Math.round(value || 0)));
  
  // Decide color based on percentage
  let barColor = 'var(--danger)';
  if (rounded >= 75) {
    barColor = 'var(--success)';
  } else if (rounded >= 60) {
    barColor = 'var(--warning)';
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="text-xs font-semibold" style={{ color: barColor }}>
          {rounded >= 75 ? 'Good Standing' : rounded >= 60 ? 'Warning' : 'Low Attendance'}
        </span>
        <span className="text-xs font-bold" style={{ color: 'var(--text)' }}>{rounded}%</span>
      </div>
      <div style={{
        height: '8px',
        width: '100%',
        backgroundColor: 'var(--border)',
        borderRadius: 'var(--radius-full)',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          width: `${rounded}%`,
          backgroundColor: barColor,
          borderRadius: 'var(--radius-full)',
          transition: 'width 0.5s ease-in-out'
        }} />
      </div>
    </div>
  );
};

export default ProgressBar;
