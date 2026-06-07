import React from 'react';

const TypingIndicator = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', margin: '8px 0', alignItems: 'flex-start' }}>
      <style>{`
        @keyframes typingBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
      <div style={{
        padding: '12px 18px',
        borderRadius: '16px',
        borderBottomLeftRadius: '4px',
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: 'var(--muted)',
          animation: 'typingBounce 1.2s infinite ease-in-out',
          animationDelay: '0s'
        }} />
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: 'var(--muted)',
          animation: 'typingBounce 1.2s infinite ease-in-out',
          animationDelay: '0.2s'
        }} />
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: 'var(--muted)',
          animation: 'typingBounce 1.2s infinite ease-in-out',
          animationDelay: '0.4s'
        }} />
      </div>
    </div>
  );
};

export default TypingIndicator;
