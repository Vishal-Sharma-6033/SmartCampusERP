import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import useDebounce from '../../hooks/useDebounce';
import ContentCard from '../../components/ContentCard';
import Toast from '../../components/Toast';

const StudentStudyMaterial = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 400);
  
  const [activeType, setActiveType] = useState('All'); // 'All' | 'Note' | 'Video' | 'PDF' | 'Syllabus'
  const [contentList, setContentList] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Toasts
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Fetch student bookmarked content IDs
  const fetchBookmarks = async () => {
    try {
      const res = await api.get('/users/me/bookmarks');
      const list = res.data?.bookmarks || [];
      // Store array of IDs
      setBookmarkedIds(list.map(item => item._id || item));
    } catch (err) {
      console.error('Failed to fetch bookmarks:', err);
    }
  };

  // Fetch LMS contents
  const fetchContent = async () => {
    setIsLoading(true);
    try {
      const typeParam = activeType === 'All' ? 'all' : activeType.toLowerCase();
      const res = await api.get(`/content?search=${debouncedSearch}&type=${typeParam}&page=${page}&limit=6`);
      
      const payload = res.data?.data?.data || res.data?.data || [];
      const pagination = res.data?.pagination || res.data?.data?.pagination || {};
      
      setContentList(payload);
      setTotalPages(Math.ceil((pagination.total || 0) / (pagination.limit || 6)) || 1);
    } catch (err) {
      console.error(err);
      setToastMessage('Failed to fetch study materials.');
      setToastType('error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  useEffect(() => {
    fetchContent();
  }, [debouncedSearch, activeType, page]);

  // Adjust page to 1 when search or category shifts
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, activeType]);

  const handleBookmarkToggle = (contentId, isAdded, updatedBookmarks) => {
    if (isAdded) {
      setBookmarkedIds(prev => [...prev, contentId]);
      setToastMessage('Material added to your bookmarks!');
      setToastType('success');
    } else {
      setBookmarkedIds(prev => prev.filter(id => id !== contentId));
      setToastMessage('Material removed from your bookmarks.');
      setToastType('info');
    }
  };

  const types = ['All', 'Note', 'Video', 'PDF', 'Syllabus'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}

      {/* Page Header and Search bar */}
      <div className="card">
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <h2 className="font-bold text-lg" style={{ color: 'var(--text)', marginBottom: '4px' }}>LMS Study Materials</h2>
            <p className="text-secondary text-xs">Access lecture recordings, notes, PDFs, and courses published by your instructors.</p>
          </div>
          
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search lectures, topics, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '40px' }}
            />
            <svg 
              viewBox="0 0 24 24" 
              width="16" 
              height="16" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }}
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {types.map(t => (
          <button
            key={t}
            onClick={() => setActiveType(t)}
            className={`btn ${activeType === t ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            style={{ borderRadius: 'var(--radius-full)', padding: '6px 16px', fontWeight: '600' }}
          >
            {t === 'All' ? '🌐 All' : t === 'Note' ? '📝 Notes' : t === 'Video' ? '🎥 Videos' : t === 'PDF' ? '📄 PDFs' : '📋 Syllabus'}
          </button>
        ))}
      </div>

      {/* Grid List */}
      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          <div className="skeleton" style={{ height: '220px' }} />
          <div className="skeleton" style={{ height: '220px' }} />
          <div className="skeleton" style={{ height: '220px' }} />
        </div>
      ) : contentList.length === 0 ? (
        <div className="card" style={{ padding: '60px', textAlign: 'center', color: 'var(--muted)' }}>
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 15px' }}>
            <rect x="2" y="3" width="20" height="18" rx="2" ry="2" />
            <line x1="6" y1="8" x2="18" y2="8" />
            <line x1="6" y1="12" x2="18" y2="12" />
          </svg>
          <h4 className="font-bold text-lg" style={{ color: 'var(--text)', marginBottom: '5px' }}>No content available</h4>
          <p className="text-secondary text-sm">There are no study materials matching this category at the moment.</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {contentList.map(item => (
              <ContentCard
                key={item._id}
                item={item}
                isBookmarked={bookmarkedIds.includes(item._id)}
                onBookmarkToggle={handleBookmarkToggle}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn btn-secondary btn-sm"
              >
                Previous
              </button>
              <span className="text-sm font-semibold text-secondary">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn btn-secondary btn-sm"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StudentStudyMaterial;
