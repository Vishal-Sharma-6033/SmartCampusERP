import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import useDebounce from '../../hooks/useDebounce';
import BookCard from '../../components/BookCard';
import OverdueBanner from '../../components/OverdueBanner';
import Toast from '../../components/Toast';

const StudentLibrary = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isIssuing, setIsIssuing] = useState(null);
  
  // Overdue check state
  const [hasOverdue, setHasOverdue] = useState(false);
  
  // Toasts
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Fetch student issue status to check for overdue items
  const checkOverdueStatus = async () => {
    try {
      const res = await api.get('/library/my-issues');
      const issues = res.data?.data || res.data || [];
      const overdueExists = issues.some(
        issue => issue.status === 'ISSUED' && new Date() > new Date(issue.dueDate)
      );
      setHasOverdue(overdueExists);
    } catch (err) {
      console.error('Failed to check overdue status:', err);
    }
  };

  // Fetch book list matching query
  const fetchBooks = async (query = '') => {
    setIsLoading(true);
    try {
      const res = await api.get(`/library/books?search=${query}`);
      setBooks(res.data?.data || res.data || []);
    } catch (err) {
      console.error(err);
      setToastMessage('Failed to fetch book catalog.');
      setToastType('error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkOverdueStatus();
  }, []);

  useEffect(() => {
    fetchBooks(debouncedSearch);
  }, [debouncedSearch]);

  const handleIssueBook = async (bookId) => {
    if (hasOverdue) {
      setToastMessage('Cannot borrow books while you have outstanding overdue books.');
      setToastType('error');
      return;
    }

    // 1. Optimistic UI update: Find target book and decrement availableCopies locally
    const originalBooks = [...books];
    setBooks(prevBooks =>
      prevBooks.map(book => {
        if (book._id === bookId) {
          return {
            ...book,
            availableCopies: Math.max(0, book.availableCopies - 1),
            issuedCount: book.issuedCount + 1
          };
        }
        return book;
      })
    );

    setIsIssuing(bookId);
    try {
      const res = await api.post('/library/issue', { bookId });
      const issueDetails = res.data?.data || res.data;
      
      const formattedDate = issueDetails?.dueDate 
        ? new Date(issueDetails.dueDate).toLocaleDateString()
        : '7 days';

      setToastMessage(`Book successfully issued! Please return it by ${formattedDate}.`);
      setToastType('success');
      
      // Refresh list to align with database copy counts
      const updatedBooksRes = await api.get(`/library/books?search=${debouncedSearch}`);
      setBooks(updatedBooksRes.data?.data || updatedBooksRes.data || []);
    } catch (err) {
      console.error(err);
      setToastMessage(err.response?.data?.message || 'Failed to issue book.');
      setToastType('error');
      
      // Revert Optimistic UI state on failure
      setBooks(originalBooks);
    } finally {
      setIsIssuing(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}

      {/* Overdue alert banner */}
      <OverdueBanner hasOverdue={hasOverdue} />

      {/* Library Catalog search header */}
      <div className="card">
        <div className="card-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
            <div>
              <h2 className="font-bold text-lg" style={{ color: 'var(--text)', marginBottom: '4px' }}>Library Catalog</h2>
              <p className="text-secondary text-xs">Search and browse academic texts. Borrow directly from your dashboard.</p>
            </div>
            <button 
              onClick={() => navigate('/student/my-books')} 
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <span>My Borrowed Books</span>
            </button>
          </div>
          
          <div className="divider" style={{ margin: '15px 0' }} />
          
          {/* Search Input Bar */}
          <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search by title, author, or keywords..."
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

      {/* Book Grid Catalog */}
      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          <div className="skeleton" style={{ height: '200px' }} />
          <div className="skeleton" style={{ height: '200px' }} />
          <div className="skeleton" style={{ height: '200px' }} />
        </div>
      ) : books.length === 0 ? (
        <div className="card" style={{ padding: '60px', textAlign: 'center', color: 'var(--muted)' }}>
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 15px' }}>
            <rect x="2" y="3" width="20" height="18" rx="2" ry="2" />
            <line x1="6" y1="8" x2="18" y2="8" />
            <line x1="6" y1="12" x2="18" y2="12" />
            <line x1="6" y1="16" x2="12" y2="16" />
          </svg>
          <h4 className="font-bold text-lg" style={{ color: 'var(--text)', marginBottom: '5px' }}>No books found</h4>
          <p className="text-secondary text-sm">We couldn't find any catalog matches for "{searchQuery}". Try revising your search keywords.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {books.map(book => (
            <BookCard
              key={book._id}
              book={book}
              isIssuing={isIssuing === book._id}
              onIssue={handleIssueBook}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentLibrary;
