import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import SkeletonLoader from '../../components/SkeletonLoader';

const AuditLogs = () => {
  useDocumentTitle('System Audit Logs', 'View administrative system audits');
  const { addToast } = useToast();

  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [moduleFilter, setModuleFilter] = useState('');
  const [expandedLogId, setExpandedLogId] = useState(null);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/admin/logs');
      const data = response.data.data || [];
      setLogs(data);
    } catch (err) {
      console.error(err);
      addToast('Failed to load audit logs.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleRowClick = (id) => {
    setExpandedLogId(prev => (prev === id ? null : id));
  };

  const getActionColor = (action) => {
    const act = String(action).toUpperCase();
    if (act.includes('CREATE') || act.includes('ADD') || act.includes('REGISTER')) return 'badge-success';
    if (act.includes('DELETE') || act.includes('REMOVE') || act.includes('HARD')) return 'badge-danger';
    if (act.includes('LOGIN') || act.includes('LOGOUT')) return 'badge-primary';
    if (act.includes('UPDATE') || act.includes('EDIT') || act.includes('PATCH')) return 'badge-warning';
    return 'badge-neutral';
  };

  const modules = Array.from(new Set(logs.map(log => log.module).filter(Boolean)));

  const filteredLogs = logs.filter(log => {
    if (!moduleFilter) return true;
    return log.module === moduleFilter;
  });

  return (
    <div className="container" style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ margin: 0, fontWeight: 700, color: 'var(--text)' }}>System Audit Logs</h1>
          <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: '0.9rem' }}>
            Chronological log of administrative portal actions and security operations.
          </p>
        </div>

        <button onClick={fetchLogs} className="btn btn-outline" disabled={isLoading} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          Refresh Logs
        </button>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px',
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--muted)' }}>Filter by Module</label>
          <select
            className="form-input"
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            style={{ minWidth: '180px', height: '38px', padding: '0 8px' }}
          >
            <option value="">All Modules</option>
            {modules.map(m => (
              <option key={m} value={m}>{m.toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
        {isLoading ? (
          <div style={{ padding: '24px' }}>
            <SkeletonLoader type="table" count={6} />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--muted)' }}>
            No audit logs found.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '900px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--bg)' }}>
                <th style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--muted)', fontSize: '0.85rem', width: '200px' }}>Timestamp</th>
                <th style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--text)', fontSize: '0.85rem' }}>User</th>
                <th style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--text)', fontSize: '0.85rem' }}>Action</th>
                <th style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--text)', fontSize: '0.85rem' }}>Module</th>
                <th style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--text)', fontSize: '0.85rem' }}>IP Address</th>
                <th style={{ padding: '16px 20px', fontWeight: 600, color: 'var(--text)', fontSize: '0.85rem', width: '100px' }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => {
                const isExpanded = expandedLogId === log._id;
                return (
                  <React.Fragment key={log._id}>
                    <tr 
                      onClick={() => handleRowClick(log._id)} 
                      style={{ 
                        borderBottom: isExpanded ? 'none' : '1px solid var(--border)', 
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        backgroundColor: isExpanded ? 'rgba(79, 70, 229, 0.02)' : 'transparent'
                      }}
                    >
                      <td style={{ padding: '14px 20px', color: 'var(--muted)', fontSize: '0.88rem' }}>
                        {new Date(log.createdAt).toLocaleString(undefined, {
                          year: 'numeric', month: 'short', day: '2-digit',
                          hour: '2-digit', minute: '2-digit', second: '2-digit'
                        })}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: 600, color: 'var(--text)', fontSize: '0.92rem' }}>
                            {log.user?.name || 'Anonymous System'}
                          </span>
                          <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
                            {log.user?.email || 'system-daemon'}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span className={`badge ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', fontWeight: 600, color: 'var(--text)', textTransform: 'uppercase', fontSize: '0.82rem' }}>
                        {log.module}
                      </td>
                      <td style={{ padding: '14px 20px', color: 'var(--muted)', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                        {log.ip || '127.0.0.1'}
                      </td>
                      <td style={{ padding: '14px 20px', textAlign: 'right', color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.8rem' }}>
                        {isExpanded ? '▲' : '▼'}
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'rgba(79, 70, 229, 0.02)' }}>
                        <td colSpan="6" style={{ padding: '0 20px 20px' }}>
                          <div style={{
                            padding: '16px',
                            backgroundColor: '#0F172A',
                            borderRadius: '8px',
                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                          }}>
                            <span style={{ display: 'block', fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase' }}>
                              Details Payload
                            </span>
                            <pre style={{
                              margin: 0,
                              fontSize: '0.85rem',
                              fontFamily: 'monospace',
                              color: '#38BDF8',
                              overflowX: 'auto',
                              whiteSpace: 'pre-wrap',
                              lineHeight: '1.4'
                            }}>
                              {JSON.stringify(log.details || {}, null, 2)}
                            </pre>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;
