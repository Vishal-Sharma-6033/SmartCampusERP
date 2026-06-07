import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => {
      const next = [...prev, { id, message, type }];
      if (next.length > 3) {
        next.shift();
      }
      return next;
    });

    // Auto-dismiss in 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast container */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'none'
      }}>
        <style>{`
          @keyframes slideIn {
            from {
              transform: translateX(120%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          .toast-item {
            animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            pointer-events: auto;
          }
        `}</style>
        {toasts.map((toast) => {
          const config = {
            success: { bg: '#22C55E', color: '#ffffff', icon: '✓' },
            error: { bg: '#EF4444', color: '#ffffff', icon: '✕' },
            warning: { bg: '#F59E0B', color: '#ffffff', icon: '⚠' },
            info: { bg: '#4F46E5', color: '#ffffff', icon: 'ℹ' }
          }[toast.type] || { bg: '#4F46E5', color: '#ffffff', icon: 'ℹ' };

          return (
            <div
              key={toast.id}
              className="toast-item"
              style={{
                backgroundColor: config.bg,
                color: config.color,
                padding: '12px 18px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                minWidth: '280px',
                maxWidth: '350px',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{config.icon}</span>
              <span style={{ flex: 1, fontSize: '0.9rem', fontWeight: '500', lineHeight: '1.4' }}>
                {toast.message}
              </span>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255,255,255,0.7)',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  outline: 'none'
                }}
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
