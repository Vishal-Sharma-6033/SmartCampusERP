import React from 'react';

const AvatarCircle = ({ name, size = 'md', className = '' }) => {
  const getInitials = (n) => {
    if (!n) return '?';
    const parts = n.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  };

  const getColorClass = (n) => {
    if (!n) return '#4F46E5';
    const colors = [
      '#4F46E5', // indigo
      '#0EA5E9', // sky
      '#10B981', // emerald
      '#F59E0B', // amber
      '#EC4899', // pink
      '#8B5CF6', // violet
      '#F43F5E', // rose
    ];
    let sum = 0;
    for (let i = 0; i < n.length; i++) {
      sum += n.charCodeAt(i);
    }
    return colors[sum % colors.length];
  };

  const initials = getInitials(name);
  const bgColor = getColorClass(name);

  const sizeClasses = {
    sm: { width: '32px', height: '32px', fontSize: '0.8rem' },
    md: { width: '48px', height: '48px', fontSize: '1.1rem' },
    lg: { width: '64px', height: '64px', fontSize: '1.4rem' },
    xl: { width: '80px', height: '80px', fontSize: '1.8rem' },
  };

  const style = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    color: '#ffffff',
    backgroundColor: bgColor,
    fontWeight: '600',
    userSelect: 'none',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    ...sizeClasses[size],
  };

  return (
    <div style={style} className={className} title={name}>
      {initials}
    </div>
  );
};

export default AvatarCircle;
