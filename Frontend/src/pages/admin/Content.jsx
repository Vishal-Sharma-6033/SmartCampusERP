import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import Toast from '../../components/Toast';

const AdminContent = () => {
  const [contentList, setContentList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Toasts
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const fetchAllContent = async () => {
    setIsLoading(true);
    try {
      // Fetch up to 100 items for administration overview
      const res = await api.get(`/content?search=${searchQuery}&limit=100`);
      const payload = res.data?.data?.data || res.data?.data || [];
      setContentList(payload);
    } catch (err) {
      console.error(err);
      setToastMessage('Failed to load portal materials.');
      setToastType('error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllContent();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAllContent();
  };

  const handleDeleteContent = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this LMS material? This will remove the Cloudinary file asset.')) return;
    try {
      await api.delete(`/content/${id}`);
      setToastMessage('Material successfully deleted.');
      setToastType('success');
      // Update local state
      setContentList(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error(err);
      setToastMessage(err.response?.data?.message || 'Failed to delete content.');
      setToastType('error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}

      {/* Page Header */}
      <div className="card">
        <div className="card-body">
          <h2 className="font-bold text-lg" style={{ color: 'var(--text)', marginBottom: '4px' }}>LMS Material Audits</h2>
          <p className="text-secondary text-xs">Review study attachments, audit usage statistics (views/downloads), and prune assets from database nodes.</p>
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', maxWidth: '500px' }}>
        <input
          type="text"
          className="form-input"
          placeholder="Filter catalog by titles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="btn btn-secondary" style={{ padding: '8px 16px' }}>
          Search
        </button>
      </form>

      {/* Materials Table Card */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Study Materials Directory</h3>
        </div>
        <div className="card-body" style={{ padding: '0' }}>
          {isLoading ? (
            <div className="flex justify-center p-6"><div className="spinner spinner-dark"></div></div>
          ) : contentList.length === 0 ? (
            <p className="text-muted text-sm" style={{ padding: '40px', textAlign: 'center' }}>
              No study materials cataloged in the system registry.
            </p>
          ) : (
            <div className="table-wrapper" style={{ border: 'none', borderRadius: '0' }}>
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Subject</th>
                    <th>Views</th>
                    <th>Downloads</th>
                    <th>Uploaded By</th>
                    <th>Published Date</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {contentList.map(item => (
                    <tr key={item._id}>
                      <td className="font-semibold" style={{ color: 'var(--text)' }}>{item.title}</td>
                      <td>
                        <span className="badge badge-neutral text-xs" style={{ textTransform: 'capitalize' }}>
                          {item.type || 'General'}
                        </span>
                      </td>
                      <td>{item.subjectId?.name || 'N/A'}</td>
                      <td className="font-semibold">{item.view || 0}</td>
                      <td className="font-semibold text-primary">{item.download || 0}</td>
                      <td className="text-secondary text-sm">
                        {item.uploadedBy?.name || 'Portal Faculty'}
                      </td>
                      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => handleDeleteContent(item._id)}
                          className="btn btn-ghost btn-sm"
                          style={{ color: 'var(--danger)', padding: '4px 8px' }}
                        >
                          Delete
                        </button>
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
  );
};

export default AdminContent;
