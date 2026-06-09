import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import ContentCard from '../../components/ContentCard';
import Toast from '../../components/Toast';

const StudentBookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Toasts
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const fetchBookmarks = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/users/me/bookmarks');
      setBookmarks(res.data?.bookmarks || []);
    } catch (err) {
      console.error(err);
      setToastMessage('Failed to fetch bookmarks list.');
      setToastType('error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleBookmarkToggle = (contentId, isAdded) => {
    if (!isAdded) {
      // Remove from list immediately (local UI feedback)
      setBookmarks(prev => prev.filter(item => item._id !== contentId));
      setToastMessage('Material removed from bookmarks.');
      setToastType('info');
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', padding: '20px' }}>
        <div className="skeleton" style={{ height: '220px' }} />
        <div className="skeleton" style={{ height: '220px' }} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}

      {/* Header */}
      <div className="card">
        <div className="card-body">
          <h2 className="font-bold text-lg" style={{ color: 'var(--text)', marginBottom: '4px' }}>My Bookmarked Materials</h2>
          <p className="text-secondary text-xs">Quickly access lecture videos, syllabi, or notes you have saved for offline study or reference.</p>
        </div>
      </div>

      {/* Grid List */}
      {bookmarks.length === 0 ? (
        <div className="card" style={{ padding: '60px', textAlign: 'center', color: 'var(--muted)' }}>
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 15px' }}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <h4 className="font-bold text-lg" style={{ color: 'var(--text)', marginBottom: '5px' }}>No bookmarks saved</h4>
          <p className="text-secondary text-sm">Tap the star icon on any study material card to save it here for quick reference.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {bookmarks.map(item => (
            <ContentCard
              key={item._id}
              item={item}
              isBookmarked={true}
              onBookmarkToggle={handleBookmarkToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentBookmarks;
