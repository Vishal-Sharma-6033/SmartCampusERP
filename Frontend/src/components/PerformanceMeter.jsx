import React from 'react';

const PerformanceMeter = ({ percentage = 0, level = 'Average', size = 160 }) => {
  const numPercentage = Number(percentage) || 0;
  const radius = size * 0.4;
  const strokeWidth = size * 0.08;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (numPercentage / 100) * circumference;

  // Compute color based on level or percentage
  const getColor = (pct) => {
    if (pct >= 80) return 'var(--success)';
    if (pct >= 55) return 'var(--primary)';
    if (pct >= 40) return 'var(--warning)';
    return 'var(--danger)';
  };

  const color = getColor(numPercentage);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px'
    }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        {/* SVG Gauge */}
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="var(--border)"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
          />
        </svg>

        {/* Center Text */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          lineHeight: '1.2'
        }}>
          <span style={{
            fontSize: '1.8rem',
            fontWeight: '800',
            color: 'var(--text)'
          }}>
            {numPercentage.toFixed(0)}%
          </span>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: '600',
            color: 'var(--muted)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginTop: '2px'
          }}>
            {level}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMeter;
