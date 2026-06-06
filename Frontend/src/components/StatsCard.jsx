import React from 'react';

const StatsCard = ({ title, value, icon, color = 'var(--primary)', subtitle }) => {
  return (
    <div className="card" style={{ borderLeft: `4px solid ${color}`, width: '100%' }}>
      <div className="card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <span className="text-secondary text-sm font-medium">{title}</span>
          <span className="text-2xl font-bold" style={{ color: 'var(--text)', lineHeight: '1.2' }}>{value}</span>
          {subtitle && <span className="text-muted text-xs">{subtitle}</span>}
        </div>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: 'var(--radius)',
          backgroundColor: `${color}15`, // Light tint of the color
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
