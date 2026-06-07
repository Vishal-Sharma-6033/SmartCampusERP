import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import NotificationItem from '../components/NotificationItem';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import Toast from '../components/Toast';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Total unread count indicator at top
  const [unreadCount, setUnreadCount] = useState(0);

  // Toasts
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const fetchNotifications = async (pageNum = 1, append = false) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const res = await api.get(`/notifications?page=${pageNum}&limit=12`);
      const payload = res.data?.data?.notifications || res.data?.notifications || [];
      const totalPages = res.data?.data?.pages || res.data?.pages || 1;

      if (append) {
        setNotifications(prev => [...prev, ...payload]);
      } else {
        setNotifications(payload);
      }

      // Count unread items
      const unread = payload.filter(n => !n.isRead).length;
      if (append) {
        setUnreadCount(prev => prev + unread);
      } else {
        setUnreadCount(unread);
      }

      setHasMore(pageNum < totalPages);
      setPage(pageNum);
    } catch (err) {
      console.error(err);
      setToastMessage('Failed to load notifications.');
      setToastType('error');
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  };

  useEffect(() => {
    fetchNotifications(1, false);
  }, []);

  // Hook for infinite scroll trigger
  useInfiniteScroll(
    () => {
      if (!isLoading && hasMore) {
        fetchNotifications(page + 1, true);
      }
    },
    hasMore,
    isLoading
  );

  const handleMarkAsRead = async (id) => {
    // Check if already read
    const target = notifications.find(n => n._id === id);
    if (!target || target.isRead) return;

    try {
      await api.patch(`/notifications/${id}/read`);
      // Update local state
      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) return;
    try {
      await api.patch('/notifications/read-all');
      setToastMessage('All notifications marked as read.');
      setToastType('success');
      
      // Update local state to all read
      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
      setToastMessage('Failed to mark all as read.');
      setToastType('error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px', margin: '0 auto' }}>
      
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}

      {/* Header and Bulk Action */}
      <div className="card">
        <div className="card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div>
            <h2 className="font-bold text-lg" style={{ color: 'var(--text)', marginBottom: '4px' }}>Notification Center</h2>
            <p className="text-secondary text-xs">Keep track of fees releases, timetables adjustments, exams results, and academic alerts.</p>
          </div>
          
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllRead}
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Mark All Read</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifications List Card */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="card-title">All Notifications</h3>
          {unreadCount > 0 && (
            <span className="badge badge-primary text-xs font-semibold">
              {unreadCount} Unread
            </span>
          )}
        </div>
        <div className="card-body" style={{ padding: '0' }}>
          {isInitialLoad ? (
            <div className="flex justify-center p-6"><div className="spinner spinner-dark"></div></div>
          ) : notifications.length === 0 ? (
            <div style={{ padding: '50px', textAlign: 'center', color: 'var(--muted)' }} className="text-sm">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 15px' }}>
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <h4 className="font-bold text-base" style={{ color: 'var(--text)', marginBottom: '5px' }}>Clean Inbox</h4>
              <span>You don't have any notifications right now.</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {notifications.map(notif => (
                <NotificationItem
                  key={notif._id}
                  item={notif}
                  onClick={handleMarkAsRead}
                />
              ))}

              {/* Infinite loader indicators */}
              {isLoading && (
                <div style={{ padding: '15px', display: 'flex', justifyContent: 'center', borderTop: '1px solid var(--border)' }}>
                  <div className="spinner spinner-dark"></div>
                </div>
              )}

              {!hasMore && notifications.length > 0 && (
                <div style={{ padding: '15px', textAlign: 'center', color: 'var(--muted)', fontSize: '0.8rem', borderTop: '1px solid var(--border)' }}>
                  <span>You've reached the end of your notifications log.</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
