import React from 'react';

const SkeletonLoader = ({ type = 'table', count = 3, height, width, style = {} }) => {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', ...style }}>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .skeleton-shimmer {
          background: linear-gradient(90deg, #f8fafc 25%, #e2e8f0 50%, #f8fafc 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite ease-in-out;
          border-radius: 4px;
        }
      `}</style>

      {type === 'table' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
          <div style={{ display: 'flex', gap: '16px', borderBottom: '2px solid var(--border)', paddingBottom: '10px' }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton-shimmer" style={{ height: '20px', flex: 1 }} />
            ))}
          </div>
          {Array.from({ length: count }).map((_, rIdx) => (
            <div key={rIdx} style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '12px', paddingTop: '4px' }}>
              {[1, 2, 3, 4].map((cIdx) => (
                <div 
                  key={cIdx} 
                  className="skeleton-shimmer" 
                  style={{ 
                    height: '16px', 
                    flex: 1, 
                    maxWidth: cIdx === 1 ? '160px' : 'none' 
                  }} 
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {type === 'card' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          width: '100%'
        }}>
          {Array.from({ length: count }).map((_, idx) => (
            <div 
              key={idx} 
              className="card" 
              style={{ 
                padding: '20px', 
                backgroundColor: 'var(--surface)', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px',
                minHeight: height || '140px'
              }}
            >
              <div className="skeleton-shimmer" style={{ height: '24px', width: '60%' }} />
              <div className="skeleton-shimmer" style={{ height: '16px', width: '95%' }} />
              <div className="skeleton-shimmer" style={{ height: '16px', width: '40%', marginTop: 'auto' }} />
            </div>
          ))}
        </div>
      )}

      {type === 'generic' && (
        <div 
          className="skeleton-shimmer" 
          style={{ 
            height: height || '20px', 
            width: width || '100%',
            borderRadius: 'var(--radius)'
          }} 
        />
      )}
    </div>
  );
};

export default SkeletonLoader;
