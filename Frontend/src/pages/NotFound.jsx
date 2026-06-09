import React from 'react';
import { useNavigate } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';

const NotFound = () => {
  useDocumentTitle('404 Page Not Found', 'The requested page could not be located');
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: 'var(--bg)',
      padding: '24px',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{
        maxWidth: '450px',
        width: '100%',
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '40px 32px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px'
      }}>
        {/* Styled 404 SVG Illustration */}
        <svg viewBox="0 0 24 24" width="80" height="80" fill="none" stroke="var(--danger)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.85 }}>
          <circle cx="12" cy="12" r="10" />
          <line x1="8" y1="15" x2="16" y2="15" />
          <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2.5" />
          <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2.5" />
        </svg>

        <div>
          <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 800, color: 'var(--text)', lineHeight: '1.1' }}>404</h1>
          <h2 style={{ margin: '8px 0 0', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text)' }}>Page Not Found</h2>
        </div>

        <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
          We couldn't locate the page you were looking for. It might have been moved, deleted, or does not exist.
        </p>

        <button 
          onClick={() => navigate('/')} 
          className="btn btn-primary"
          style={{ width: '100%', height: '44px', fontWeight: 600, marginTop: '8px' }}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFound;
