import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const getIcon = (type) => {
  switch (type) {
    case 'dashboard':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="9" />
          <rect x="14" y="3" width="7" height="5" />
          <rect x="14" y="12" width="7" height="9" />
          <rect x="3" y="16" width="7" height="5" />
        </svg>
      );
    case 'calendar':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      );
    case 'chart':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      );
    case 'clipboard':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        </svg>
      );
    case 'academic':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
        </svg>
      );
    case 'credit-card':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
          <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
      );
    case 'book':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      );
    case 'folder':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      );
    case 'bell':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      );
    case 'cpu':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <rect x="9" y="9" width="6" height="6" />
          <line x1="9" y1="1" x2="9" y2="4" />
          <line x1="15" y1="1" x2="15" y2="4" />
          <line x1="9" y1="20" x2="9" y2="23" />
          <line x1="15" y1="20" x2="15" y2="23" />
          <line x1="20" y1="9" x2="23" y2="9" />
          <line x1="20" y1="15" x2="23" y2="15" />
          <line x1="1" y1="9" x2="4" y2="9" />
          <line x1="1" y1="15" x2="4" y2="15" />
        </svg>
      );
    case 'upload':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      );
    case 'users':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case 'scroll':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );
    case 'cog':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
    case 'power':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
          <line x1="12" y1="2" x2="12" y2="12" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      );
  }
};

const linksByRole = {
  STUDENT: [
    { label: 'Dashboard', path: '/student/dashboard', icon: 'dashboard' },
    { label: 'My Timetable', path: '/student/timetable', icon: 'calendar' },
    { label: 'Attendance', path: '/student/attendance', icon: 'chart' },
    { label: 'Assignments', path: '/student/assignments', icon: 'clipboard' },
    { label: 'Exams & Results', path: '/student/exams', icon: 'academic' },
    { label: 'Fee Payment', path: '/student/fees', icon: 'credit-card' },
    { label: 'Library', path: '/student/library', icon: 'book' },
    { label: 'Study Material', path: '/student/study-material', icon: 'folder' },
    { label: 'Notifications', path: '/notifications', icon: 'bell' },
    { label: 'AI Tutor', path: '/student/ai-tutor', icon: 'cpu' },
  ],
  TEACHER: [
    { label: 'Dashboard', path: '/teacher/dashboard', icon: 'dashboard' },
    { label: 'My Subjects', path: '/teacher/timetable', icon: 'book' },
    { label: 'Attendance', path: '/teacher/attendance', icon: 'chart' },
    { label: 'Assignments', path: '/teacher/assignments', icon: 'clipboard' },
    { label: 'Exam Results', path: '/teacher/exams', icon: 'academic' },
    { label: 'Upload Content', path: '/teacher/upload-content', icon: 'upload' },
    { label: 'Notifications', path: '/notifications', icon: 'bell' },
  ],
  ADMIN: [
    { label: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard' },
    { label: 'User Management', path: '/admin/users', icon: 'users' },
    { label: 'Fee Management', path: '/admin/fees', icon: 'credit-card' },
    { label: 'Exam Management', path: '/admin/exams', icon: 'academic' },
    { label: 'Library', path: '/admin/library', icon: 'book' },
    { label: 'Timetable', path: '/admin/timetable', icon: 'calendar' },
    { label: 'Notice Board', path: '/notice-board', icon: 'clipboard' },
    { label: 'Audit Logs', path: '/admin/logs', icon: 'scroll' },
    { label: 'Settings', path: '/admin/settings', icon: 'cog' },
  ],
  PARENT: [
    { label: 'Dashboard', path: '/parent/dashboard', icon: 'dashboard' },
    { label: 'My Children', path: '/parent/children', icon: 'users' },
    { label: 'Attendance', path: '/parent/attendance', icon: 'chart' },
    { label: 'Fee Status', path: '/parent/fees', icon: 'credit-card' },
    { label: 'Results', path: '/parent/results', icon: 'academic' },
  ]
};

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const role = user.role;
  const links = linksByRole[role] || [];
  const initials = user.name ? user.name.slice(0, 2).toUpperCase() : 'U';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-logo">
        SmartCampus
      </div>
      <ul className="sidebar-menu">
        {links.map((link, idx) => (
          <li key={idx} className="sidebar-item" onClick={toggleSidebar}>
            <NavLink
              to={link.path}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {getIcon(link.icon)}
              <span>{link.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="sidebar-footer">
        {user.role === 'STUDENT' ? (
          <Link to="/student/profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', textDecoration: 'none', cursor: 'pointer', flex: 1 }}>
            <div className="avatar-small">{initials}</div>
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <span className="font-semibold text-sm truncate" style={{ color: 'var(--text)', lineHeight: '1.2' }}>
                {user.name}
              </span>
              <span className="text-muted text-xs truncate">{user.role}</span>
            </div>
          </Link>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', flex: 1 }}>
            <div className="avatar-small">{initials}</div>
            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <span className="font-semibold text-sm truncate" style={{ color: 'var(--text)', lineHeight: '1.2' }}>
                {user.name}
              </span>
              <span className="text-muted text-xs truncate">{user.role}</span>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="btn btn-ghost btn-sm"
          title="Sign Out"
          style={{ padding: '6px', borderRadius: 'var(--radius-full)' }}
        >
          {getIcon('power')}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
export { getIcon };
