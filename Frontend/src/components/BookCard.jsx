import React from 'react';

const BookCard = ({ book, isIssuing, onIssue, showIssueButton = true }) => {
  const isAvailable = book.availableCopies > 0;
  
  return (
    <div className="card hover-lift" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div className="card-body flex-col gap-3">
        {/* Genre / Category Badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="badge badge-neutral text-xs" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {book.category || 'General'}
          </span>
          <span className={`badge ${isAvailable ? 'badge-success' : 'badge-danger'} text-xs`}>
            {isAvailable ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        {/* Title and Author */}
        <div>
          <h4 className="font-bold" style={{ color: 'var(--text)', fontSize: '1.1rem', marginBottom: '4px', lineHeight: '1.3' }}>
            {book.title}
          </h4>
          <p className="text-secondary text-sm" style={{ fontStyle: 'italic' }}>
            by {book.author || 'Unknown Author'}
          </p>
        </div>

        {/* Copies status indicator */}
        <div style={{ marginTop: 'auto', backgroundColor: 'var(--bg)', padding: '10px', borderRadius: 'var(--radius)', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontWeight: '500' }}>
            <span className="text-muted">Available:</span>
            <span className="font-bold" style={{ color: isAvailable ? 'var(--success)' : 'var(--danger)' }}>
              {book.availableCopies} / {book.totalCopies} copies
            </span>
          </div>
          {/* Progress fill */}
          <div style={{ height: '6px', backgroundColor: 'var(--border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div 
              style={{ 
                height: '100%', 
                width: `${(book.availableCopies / book.totalCopies) * 100}%`, 
                backgroundColor: isAvailable ? 'var(--success)' : 'var(--danger)', 
                borderRadius: 'var(--radius-full)',
                transition: 'width 0.4s ease'
              }} 
            />
          </div>
        </div>
      </div>

      {showIssueButton && (
        <div className="card-footer" style={{ borderTop: '1px solid var(--border)', padding: '12px 16px' }}>
          <button
            type="button"
            className={`btn ${isAvailable ? 'btn-primary' : 'btn-secondary'} w-full btn-sm`}
            disabled={!isAvailable || isIssuing}
            onClick={() => onIssue(book._id)}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}
          >
            {isIssuing ? (
              <>
                <span className="spinner spinner-white"></span>
                <span>Issuing...</span>
              </>
            ) : isAvailable ? (
              <>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
                <span>Issue Book</span>
              </>
            ) : (
              'Not Available'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default BookCard;
