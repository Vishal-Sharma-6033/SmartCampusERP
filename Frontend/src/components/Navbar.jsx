import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { getIcon } from './Sidebar';
import Toast from './Toast';

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

const getTitleByPath = (pathname, role) => {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return 'SmartCampus';
  
  // Custom mapping for specific segments
  const map = {
    dashboard: 'Dashboard',
    timetable: 'Weekly Timetable',
    attendance: 'Attendance Tracker',
    assignments: 'Assignments',
    exams: 'Exams & Results',
    fees: 'Fee Management & Payments',
    library: 'Library Catalog',
    'study-material': 'Study Material',
    'upload-content': 'Upload LMS Content',
    'ai-tutor': 'AI Learning Assistant',
    'notice-board': 'Notice Board',
    users: 'User Management',
    logs: 'System Audit Logs',
    settings: 'Portal Settings',
    notifications: 'All Notifications'
  };

  const lastSegment = segments[segments.length - 1];
  return map[lastSegment] || lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
};

const Navbar = ({ toggleSidebar }) => {
  const { user, socket } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [realtimeToast, setRealtimeToast] = useState('');

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications?limit=5');
      const items = response.data.data.notifications || [];
      setNotifications(items);
      // Count unread items
      const unread = items.filter(n => !n.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  // Poll for notifications or fetch on load
  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Poll every 30 seconds for new notifications
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Sockets realtime listener
  useEffect(() => {
    if (!socket) return;

    const handleRealtimeNotification = (data) => {
      console.log('🔔 Realtime socket notification:', data);
      setRealtimeToast(data.message || data.title || 'New notification received!');
      fetchNotifications();
    };

    socket.on('notification', handleRealtimeNotification);

    return () => {
      socket.off('notification', handleRealtimeNotification);
    };
  }, [socket]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleBellClick = () => {
    setDropdownOpen(!dropdownOpen);
    if (!dropdownOpen) {
      fetchNotifications(); // Refresh list on open
    }
  };

  const handleMarkAsRead = async (id, isRead) => {
    if (isRead) return; // Already read, nothing to do
    try {
      await api.patch(`/notifications/${id}/read`);
      // Update local state
      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  if (!user) return null;

  const pageTitle = getTitleByPath(location.pathname, user.role);

  // Role Badge CSS Class
  const getBadgeClass = (role) => {
    switch (role) {
      case 'ADMIN': return 'badge-danger';
      case 'TEACHER': return 'badge-warning';
      case 'STUDENT': return 'badge-primary';
      case 'PARENT': return 'badge-success';
      default: return 'badge-neutral';
    }
  };

  return (
    <nav className="navbar">
      {realtimeToast && (
        <Toast message={realtimeToast} type="info" onClose={() => setRealtimeToast('')} />
      )}
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={toggleSidebar}
          className="btn btn-ghost"
          style={{ padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <span className="font-semibold text-lg" style={{ color: 'var(--text)' }}>
          {pageTitle}
        </span>
      </div>

      {/* Global Search Bar */}
      <form onSubmit={handleSearchSubmit} className="navbar-search" style={{ display: 'flex', alignItems: 'center', position: 'relative', flex: '1', maxWidth: '320px', margin: '0 20px' }}>
        <input
          type="text"
          className="form-input"
          placeholder="Global search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ paddingLeft: '32px', height: '36px', borderRadius: 'var(--radius)', fontSize: '0.85rem' }}
        />
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </form>

      <div className="nav-actions">
        {/* Notification Bell with Dropdown */}
        <div className="notification-container" ref={dropdownRef}>
          <button onClick={handleBellClick} className="notification-bell">
            {getIcon('bell')}
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>

          {dropdownOpen && (
            <div className="notification-dropdown">
              <div className="notification-dropdown-header">
                <span>Notifications</span>
                {unreadCount > 0 && <span className="badge badge-primary">{unreadCount} New</span>}
              </div>
              <ul className="notification-dropdown-list">
                {notifications.length === 0 ? (
                  <li style={{ padding: '16px', textAlign: 'center', color: 'var(--muted)', fontSize: '0.875rem' }}>
                    No notifications
                  </li>
                ) : (
                  notifications.map((notif) => (
                    <li
                      key={notif._id}
                      className={`notification-dropdown-item ${!notif.isRead ? 'unread' : ''}`}
                      onClick={() => handleMarkAsRead(notif._id, notif.isRead)}
                    >
                      <span className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{notif.title}</span>
                      <span className="text-secondary text-xs" style={{ lineHeight: '1.4' }}>{notif.message}</span>
                      <span className="text-muted text-xs" style={{ marginTop: '2px' }}>{formatTimeAgo(notif.createdAt)}</span>
                    </li>
                  ))
                )}
              </ul>
              <div className="notification-dropdown-footer" onClick={() => setDropdownOpen(false)}>
                <Link to="/notifications" style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Info & Badge */}
        {user.role === 'STUDENT' ? (
          <Link to="/student/profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', cursor: 'pointer' }}>
            <span className="font-medium text-sm text-secondary" style={{ display: 'inline-block' }}>
              {user.name}
            </span>
            <span className={`badge ${getBadgeClass(user.role)}`}>
              {user.role}
            </span>
          </Link>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="font-medium text-sm text-secondary" style={{ display: 'inline-block' }}>
              {user.name}
            </span>
            <span className={`badge ${getBadgeClass(user.role)}`}>
              {user.role}
            </span>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
