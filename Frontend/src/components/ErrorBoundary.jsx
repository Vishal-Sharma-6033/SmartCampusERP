import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundColor: 'var(--bg)',
          padding: '20px',
          fontFamily: 'Inter, system-ui, sans-serif'
        }}>
          <div style={{
            maxWidth: '500px',
            width: '100%',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '32px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: 'var(--danger)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              fontSize: '1.8rem',
              fontWeight: 'bold'
            }}>
              ⚠
            </div>
            
            <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)' }}>
              Application Render Error
            </h1>
            
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
              An unexpected error occurred while rendering this view. Try reloading or return to the main dashboard.
            </p>

            {this.state.error && (
              <pre style={{
                margin: 0,
                padding: '12px',
                backgroundColor: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                fontSize: '0.8rem',
                color: 'var(--danger)',
                textAlign: 'left',
                overflowX: 'auto',
                whiteSpace: 'pre-wrap',
                maxHeight: '120px'
              }}>
                {this.state.error.toString()}
              </pre>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button 
                onClick={this.handleReload} 
                className="btn btn-primary" 
                style={{ flex: 1 }}
              >
                Reload Page
              </button>
              <button 
                onClick={this.handleGoHome} 
                className="btn btn-outline" 
                style={{ flex: 1 }}
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
