import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import SearchResults from '../components/SearchResults';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const SearchPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [results, setResults] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Toasts
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const fetchSearchResults = async (searchVal) => {
    if (!searchVal) return;
    setIsLoading(true);
    try {
      const res = await api.get(`/search?q=${encodeURIComponent(searchVal)}`);
      setResults(res.data?.data || res.data || {});
      // Refresh recents list since search saves history
      fetchRecentSearches();
    } catch (err) {
      console.error(err);
      setToastMessage('Search query failed.');
      setToastType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecentSearches = async () => {
    try {
      const res = await api.get('/search/recent');
      const list = res.data?.data || res.data || [];
      // Deduplicate recent queries list
      const queries = [...new Set(list.map(item => item.query))];
      setRecentSearches(queries.slice(0, 8)); // Max 8
    } catch (err) {
      console.error('Failed to load recent searches:', err);
    }
  };

  useEffect(() => {
    if (query) {
      fetchSearchResults(query);
    } else {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchRecentSearches();
  }, []);

  const handleRecentClick = (q) => {
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'flex-start' }}>
      
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}

      {/* LEFT COLUMN: Main Search Results Panel (taking 2 grid cols on wide screen) */}
      <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Page Header */}
        <div className="card">
          <div className="card-body">
            <h2 className="font-bold text-lg" style={{ color: 'var(--text)', marginBottom: '4px' }}>Global Search Results</h2>
            {query ? (
              <p className="text-secondary text-xs">Showing portal matches matching query "<strong style={{ color: 'var(--primary)' }}>{query}</strong>"</p>
            ) : (
              <p className="text-secondary text-xs">Enter a search keyword in the navbar to browse database entries.</p>
            )}
          </div>
        </div>

        {/* Results layout */}
        {isLoading ? (
          <div className="card" style={{ padding: '40px' }}>
            <div className="flex justify-center p-6"><div className="spinner spinner-dark"></div></div>
          </div>
        ) : !query ? (
          <div className="card" style={{ padding: '50px', textAlign: 'center', color: 'var(--muted)' }}>
            <span>Please type a search query in the top bar to inspect campus records.</span>
          </div>
        ) : results ? (
          <SearchResults results={results} query={query} role={user?.role} />
        ) : null}
      </div>

      {/* RIGHT COLUMN: Sidebar (Recent Searches) */}
      <div className="card" style={{ height: 'fit-content' }}>
        <div className="card-header">
          <h3 className="card-title" style={{ fontSize: '0.95rem' }}>Recent Searches</h3>
        </div>
        <div className="card-body">
          {recentSearches.length === 0 ? (
            <p className="text-muted text-xs" style={{ padding: '10px 0' }}>Your search history is empty.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {recentSearches.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRecentClick(q)}
                  className="btn btn-ghost"
                  style={{
                    textAlign: 'left',
                    padding: '8px 12px',
                    fontSize: '0.85rem',
                    borderRadius: 'var(--radius)',
                    color: 'var(--text-secondary)',
                    backgroundColor: 'var(--bg)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%'
                  }}
                >
                  <span>🕒</span>
                  <span className="truncate">{q}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
