import React from 'react';

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 5) return 'Just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const NotificationItem = ({ item, onClick }) => {
  const isUnread = !item.isRead;

  // Get icon and color by type
  const getTypeMeta = (type) => {
    switch (type?.toUpperCase()) {
      case 'FEES':
        return { icon: '💰', color: '#10B981', label: 'Fees & Dues' };
      case 'EXAM':
        return { icon: '📝', color: '#F59E0B', label: 'Exam Notification' };
      case 'ASSIGNMENT':
        return { icon: '📋', color: '#3B82F6', label: 'Assignment Upload' };
      case 'REMINDER':
        return { icon: '⏰', color: '#8B5CF6', label: 'Reminder Warning' };
      case 'GRADE':
        return { icon: '🎓', color: '#EC4899', label: 'Grading Report' };
      default:
        return { icon: '🔔', color: '#64748B', label: 'General Notification' };
    }
  };

  const meta = getTypeMeta(item.type);

  return (
    <div
      onClick={() => onClick(item._id)}
      style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--border)',
        backgroundColor: isUnread ? 'rgba(79, 70, 229, 0.05)' : 'var(--surface)',
        cursor: 'pointer',
        transition: 'background var(--transition)',
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-start',
        position: 'relative'
      }}
      className={`notification-item ${isUnread ? 'unread' : ''}`}
    >
      {/* Type-based Icon Circle */}
      <div 
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: `${meta.color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.25rem',
          flexShrink: 0
        }}
      >
        {meta.icon}
      </div>

      {/* Details columns */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: '1' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="font-semibold text-sm" style={{ color: isUnread ? 'var(--primary)' : 'var(--text)' }}>
            {item.title}
          </span>
          <span className="text-muted text-xs">{formatTimeAgo(item.createdAt)}</span>
        </div>
        <p className="text-secondary text-sm" style={{ lineHeight: '1.4' }}>
          {item.message}
        </p>
      </div>

      {/* Unread marker dot */}
      {isUnread && (
        <span 
          style={{
            position: 'absolute',
            left: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'var(--primary)'
          }}
        />
      )}
    </div>
  );
};

export default NotificationItem;
