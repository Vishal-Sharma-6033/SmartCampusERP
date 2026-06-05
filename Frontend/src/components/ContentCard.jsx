import React, { useState } from 'react';
import api from '../api/axios';

const ContentCard = ({ item, isBookmarked = false, onBookmarkToggle, showDeleteButton = false, onDelete }) => {
  const [isBookmarkedLocal, setIsBookmarkedLocal] = useState(isBookmarked);
  const [isTogglingBookmark, setIsTogglingBookmark] = useState(false);
  
  const subjectName = item.subjectId?.name || 'General Subject';
  const subjectCode = item.subjectId?.code || '';

  // Get visual icon and label based on item type
  const getTypeMeta = (type) => {
    switch (type?.toLowerCase()) {
      case 'pdf':
        return { icon: '📄', label: 'PDF Document', color: '#EF4444' };
      case 'video':
        return { icon: '🎥', label: 'Video Lecture', color: '#3B82F6' };
      case 'note':
        return { icon: '📝', label: 'Class Notes', color: '#10B981' };
      case 'syllabus':
        return { icon: '📋', label: 'Syllabus Doc', color: '#F59E0B' };
      case 'image':
        return { icon: '🖼️', label: 'Reference Image', color: '#8B5CF6' };
      default:
        return { icon: '📦', label: 'Content Material', color: '#64748B' };
    }
  };

  const meta = getTypeMeta(item.type);

  // View material: Open fileUrl, send increment hit to backend
  const handleView = async () => {
    try {
      window.open(item.fileUrl, '_blank');
      // Increment views count in DB
      await api.post(`/content/${item._id}/view`);
    } catch (err) {
      console.error('Failed to register view count:', err);
    }
  };

  // Download material: Request fileUrl, trigger download, send increment hit
  const handleDownload = async () => {
    try {
      // Fetch the download link from secure download
      const res = await api.get(`/content/${item._id}/download`);
      const fileUrl = res.data?.fileUrl || item.fileUrl;

      // Trigger download
      const link = document.createElement('a');
      link.href = fileUrl;
      link.setAttribute('download', item.title);
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Increment downloads count in DB
      await api.post(`/content/${item._id}/download`);
    } catch (err) {
      console.error('Download trigger failed:', err);
    }
  };

  // Toggle bookmark
  const handleBookmarkClick = async () => {
    setIsTogglingBookmark(true);
    try {
      const res = await api.post(`/content/${item._id}/bookmark`);
      const updatedBookmarks = res.data?.bookmarks || [];
      const nowBookmarked = !isBookmarkedLocal;
      setIsBookmarkedLocal(nowBookmarked);
      if (onBookmarkToggle) {
        onBookmarkToggle(item._id, nowBookmarked, updatedBookmarks);
      }
    } catch (err) {
      console.error('Bookmark toggle failed:', err);
    } finally {
      setIsTogglingBookmark(false);
    }
  };

  return (
    <div className="card hover-lift" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div className="card-body flex-col gap-3">
        {/* Header row with material type badge and bookmark star */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span 
            className="badge text-xs" 
            style={{ 
              backgroundColor: `${meta.color}15`, 
              color: meta.color, 
              border: `1px solid ${meta.color}30`,
              fontWeight: '600',
              textTransform: 'uppercase'
            }}
          >
            {meta.icon} {meta.label}
          </span>

          {!showDeleteButton && (
            <button 
              onClick={handleBookmarkClick}
              disabled={isTogglingBookmark}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: isBookmarkedLocal ? 'var(--warning)' : 'var(--muted)',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.2s ease'
              }}
              className="bookmark-btn"
              title={isBookmarkedLocal ? 'Remove Bookmark' : 'Bookmark Material'}
            >
              {isBookmarkedLocal ? (
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              )}
            </button>
          )}
        </div>

        {/* Title and details */}
        <div>
          <h4 className="font-bold text-base" style={{ color: 'var(--text)', marginBottom: '4px', lineHeight: '1.4' }}>
            {item.title}
          </h4>
          {item.description && (
            <p className="text-secondary text-xs line-clamp-2" style={{ marginBottom: '8px' }}>
              {item.description}
            </p>
          )}
          <span className="badge badge-neutral text-xs" style={{ display: 'inline-block' }}>
            📚 {subjectName} {subjectCode && `(${subjectCode})`}
          </span>
        </div>

        {/* View and download counters */}
        <div style={{ display: 'flex', gap: '15px', fontSize: '0.8rem', color: 'var(--muted)', marginTop: 'auto', paddingTop: '8px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            👁️ {item.view || 0} views
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            📥 {item.download || 0} downloads
          </span>
        </div>
      </div>

      <div className="card-footer" style={{ borderTop: '1px solid var(--border)', padding: '12px 16px', display: 'flex', gap: '8px' }}>
        {showDeleteButton ? (
          <button 
            onClick={() => onDelete(item._id)}
            className="btn btn-danger w-full btn-sm"
          >
            Delete Material
          </button>
        ) : (
          <>
            <button 
              onClick={handleView}
              className="btn btn-secondary btn-sm"
              style={{ flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px' }}
            >
              👁️ View
            </button>
            <button 
              onClick={handleDownload}
              className="btn btn-primary btn-sm"
              style={{ flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px' }}
            >
              📥 Download
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ContentCard;
