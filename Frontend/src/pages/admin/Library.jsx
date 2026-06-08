import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Toast from '../../components/Toast';
import Modal from '../../components/Modal';

const AdminLibrary = () => {
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'issues'

  // Catalog States
  const [books, setBooks] = useState([]);
  const [isCatalogLoading, setIsCatalogLoading] = useState(true);
  const [bookSearchQuery, setBookSearchQuery] = useState('');
  
  // Issues States
  const [issues, setIssues] = useState([]);
  const [isIssuesLoading, setIsIssuesLoading] = useState(true);
  const [issuesStatusFilter, setIssuesStatusFilter] = useState('All');

  // Modals & Forms States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    totalCopies: ''
  });

  // Action statuses
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Fetch Book Inventory Catalog
  const fetchCatalog = async () => {
    setIsCatalogLoading(true);
    try {
      const res = await api.get(`/library/books?search=${bookSearchQuery}`);
      setBooks(res.data?.data || res.data || []);
    } catch (err) {
      console.error(err);
      setToastMessage('Failed to fetch book catalog.');
      setToastType('error');
    } finally {
      setIsCatalogLoading(false);
    }
  };

  // Fetch borrowing issues log
  const fetchIssues = async () => {
    setIsIssuesLoading(true);
    try {
      const res = await api.get(`/library/issues?status=${issuesStatusFilter}`);
      setIssues(res.data?.data || res.data || []);
    } catch (err) {
      console.error(err);
      setToastMessage('Failed to fetch issued books log.');
      setToastType('error');
    } finally {
      setIsIssuesLoading(false);
    }
  };

  // Fetch data depending on active tab
  useEffect(() => {
    if (activeTab === 'catalog') {
      fetchCatalog();
    } else {
      fetchIssues();
    }
  }, [activeTab, issuesStatusFilter]);

  // Handle Search Trigger
  const handleSearchBooks = (e) => {
    e.preventDefault();
    fetchCatalog();
  };

  // Open Add Book Modal
  const openAddModal = () => {
    setFormData({
      title: '',
      author: '',
      isbn: '',
      category: '',
      totalCopies: ''
    });
    setShowAddModal(true);
  };

  // Open Edit Book Modal
  const openEditModal = (book) => {
    setSelectedBook(book);
    setFormData({
      title: book.title || '',
      author: book.author || '',
      isbn: book.isbn || '',
      category: book.category || '',
      totalCopies: book.totalCopies || ''
    });
    setShowEditModal(true);
  };

  // Submit Add Book
  const handleAddBook = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/library/books', {
        ...formData,
        totalCopies: Number(formData.totalCopies)
      });
      setToastMessage('Book successfully added to the catalog!');
      setToastType('success');
      setShowAddModal(false);
      fetchCatalog();
    } catch (err) {
      console.error(err);
      setToastMessage(err.response?.data?.message || 'Failed to add book.');
      setToastType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Edit Book
  const handleEditBook = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.put(`/library/books/${selectedBook._id}`, {
        ...formData,
        totalCopies: Number(formData.totalCopies)
      });
      setToastMessage('Book successfully updated!');
      setToastType('success');
      setShowEditModal(false);
      fetchCatalog();
    } catch (err) {
      console.error(err);
      setToastMessage(err.response?.data?.message || 'Failed to update book.');
      setToastType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Book
  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Are you sure you want to remove this book from the catalog?')) return;
    try {
      await api.delete(`/library/books/${bookId}`);
      setToastMessage('Book removed successfully.');
      setToastType('success');
      fetchCatalog();
    } catch (err) {
      console.error(err);
      setToastMessage(err.response?.data?.message || 'Failed to delete book.');
      setToastType('error');
    }
  };

  // Admin mark returned override
  const handleAdminReturnBook = async (bookId, studentId) => {
    try {
      await api.post('/library/return', { bookId, studentId });
      setToastMessage('Book marked as returned successfully!');
      setToastType('success');
      fetchIssues(); // Refresh logs
    } catch (err) {
      console.error(err);
      setToastMessage(err.response?.data?.message || 'Failed to process return.');
      setToastType('error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}

      {/* Main tab selectors */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', gap: '8px' }}>
        <button
          onClick={() => setActiveTab('catalog')}
          style={{
            padding: '12px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'catalog' ? '2.5px solid var(--primary)' : 'none',
            color: activeTab === 'catalog' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'catalog' ? '700' : '500',
            cursor: 'pointer'
          }}
        >
          Book Inventory Catalog
        </button>
        <button
          onClick={() => setActiveTab('issues')}
          style={{
            padding: '12px 20px',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'issues' ? '2.5px solid var(--primary)' : 'none',
            color: activeTab === 'issues' ? 'var(--primary)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'issues' ? '700' : '500',
            cursor: 'pointer'
          }}
        >
          Issued Books Log
        </button>
      </div>

      {/* ────────────────── VIEW 1: CATALOG INVENTORY ────────────────── */}
      {activeTab === 'catalog' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Controls row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px', alignItems: 'center' }}>
            <form onSubmit={handleSearchBooks} style={{ display: 'flex', gap: '8px', flex: '1', maxWidth: '450px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search by book title or author..."
                value={bookSearchQuery}
                onChange={(e) => setBookSearchQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-secondary" style={{ padding: '8px 16px' }}>
                Search
              </button>
            </form>
            <button onClick={openAddModal} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Add Book</span>
            </button>
          </div>

          {/* Book Catalog Table */}
          <div className="card">
            <div className="card-body" style={{ padding: '0' }}>
              {isCatalogLoading ? (
                <div className="flex justify-center p-6"><div className="spinner spinner-dark"></div></div>
              ) : books.length === 0 ? (
                <p className="text-muted text-sm" style={{ padding: '40px', textAlign: 'center' }}>
                  No books cataloged matching the search filters. Add books above.
                </p>
              ) : (
                <div className="table-wrapper" style={{ border: 'none', borderRadius: '0' }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>ISBN</th>
                        <th>Genre / Category</th>
                        <th>Total Copies</th>
                        <th>Available</th>
                        <th>Issued Count</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {books.map(book => (
                        <tr key={book._id}>
                          <td className="font-semibold" style={{ color: 'var(--text)' }}>{book.title}</td>
                          <td>{book.author || 'N/A'}</td>
                          <td className="text-secondary text-sm">{book.isbn || 'N/A'}</td>
                          <td>
                            <span className="badge badge-neutral text-xs">{book.category || 'General'}</span>
                          </td>
                          <td className="font-semibold">{book.totalCopies}</td>
                          <td className="font-bold" style={{ color: book.availableCopies > 0 ? 'var(--success)' : 'var(--danger)' }}>
                            {book.availableCopies}
                          </td>
                          <td className="font-semibold text-primary">{book.issuedCount || 0}</td>
                          <td style={{ textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '8px' }}>
                              <button onClick={() => openEditModal(book)} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px' }}>
                                Edit
                              </button>
                              <button onClick={() => handleDeleteBook(book._id)} className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)', padding: '4px 8px' }}>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ────────────────── VIEW 2: ISSUED LOGS ────────────────── */}
      {activeTab === 'issues' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Filtering dropdown row */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span className="text-secondary text-sm font-semibold">Filter by Status:</span>
            <select
              className="form-select"
              style={{ width: '180px', padding: '6px 10px' }}
              value={issuesStatusFilter}
              onChange={(e) => setIssuesStatusFilter(e.target.value)}
            >
              <option value="All">All Transactions</option>
              <option value="ISSUED">ISSUED (Active)</option>
              <option value="RETURNED">RETURNED</option>
              <option value="OVERDUE">OVERDUE (Late)</option>
            </select>
          </div>

          {/* Issues table list */}
          <div className="card">
            <div className="card-body" style={{ padding: '0' }}>
              {isIssuesLoading ? (
                <div className="flex justify-center p-6"><div className="spinner spinner-dark"></div></div>
              ) : issues.length === 0 ? (
                <p className="text-muted text-sm" style={{ padding: '40px', textAlign: 'center' }}>
                  No borrowing history matches selected filters.
                </p>
              ) : (
                <div className="table-wrapper" style={{ border: 'none', borderRadius: '0' }}>
                  <table>
                    <thead>
                      <tr>
                        <th>Student</th>
                        <th>Book Details</th>
                        <th>Issue Date</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Fine</th>
                        <th style={{ textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {issues.map(issue => (
                        <tr key={issue._id}>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span className="font-semibold" style={{ color: 'var(--text)' }}>
                                {issue.studentId?.name || 'Unknown Student'}
                              </span>
                              <span className="text-secondary text-xs">{issue.studentId?.email || ''}</span>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span className="font-semibold" style={{ color: 'var(--text)' }}>
                                {issue.bookId?.title || 'Unknown Book'}
                              </span>
                              <span className="text-secondary text-xs">by {issue.bookId?.author || 'Unknown'}</span>
                            </div>
                          </td>
                          <td>{new Date(issue.issueDate).toLocaleDateString()}</td>
                          <td>{new Date(issue.dueDate).toLocaleDateString()}</td>
                          <td>
                            {issue.status === 'RETURNED' ? (
                              <span className="badge badge-success">RETURNED</span>
                            ) : new Date() > new Date(issue.dueDate) ? (
                              <span className="badge badge-danger">OVERDUE</span>
                            ) : (
                              <span className="badge badge-primary">ISSUED</span>
                            )}
                          </td>
                          <td>
                            {issue.fine > 0 ? (
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span className="font-bold text-danger">₹{issue.fine}</span>
                                <span className="text-xs font-semibold" style={{ color: issue.paymentStatus === 'PAID' ? 'var(--success)' : 'var(--danger)' }}>
                                  {issue.paymentStatus === 'PAID' ? 'Paid ✓' : 'Unpaid'}
                                </span>
                              </div>
                            ) : (
                              <span className="text-muted">—</span>
                            )}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            {issue.status === 'ISSUED' && (
                              <button
                                onClick={() => handleAdminReturnBook(issue.bookId?._id, issue.studentId?._id)}
                                className="btn btn-secondary btn-sm"
                              >
                                Mark Returned
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ────────────────── ADD BOOK MODAL ────────────────── */}
      {showAddModal && (
        <Modal title="Add New Book Registry" onClose={() => setShowAddModal(false)}>
          <form onSubmit={handleAddBook} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className="form-group">
              <label className="form-label">Book Title</label>
              <input
                type="text"
                className="form-input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Author Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">ISBN Reference</label>
              <input
                type="text"
                className="form-input"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Genre / Category</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Science, Fiction, History"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Total Copies Quantity</label>
              <input
                type="number"
                min="1"
                className="form-input"
                value={formData.totalCopies}
                onChange={(e) => setFormData({ ...formData, totalCopies: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
              {isSubmitting ? <span className="spinner"></span> : 'Catalog Book'}
            </button>
          </form>
        </Modal>
      )}

      {/* ────────────────── EDIT BOOK MODAL ────────────────── */}
      {showEditModal && (
        <Modal title="Edit Book Registry" onClose={() => setShowEditModal(false)}>
          <form onSubmit={handleEditBook} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className="form-group">
              <label className="form-label">Book Title</label>
              <input
                type="text"
                className="form-input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Author Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">ISBN Reference</label>
              <input
                type="text"
                className="form-input"
                value={formData.isbn}
                onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Genre / Category</label>
              <input
                type="text"
                className="form-input"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Total Copies Quantity</label>
              <input
                type="number"
                min="1"
                className="form-input"
                value={formData.totalCopies}
                onChange={(e) => setFormData({ ...formData, totalCopies: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
              {isSubmitting ? <span className="spinner"></span> : 'Save Changes'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminLibrary;
