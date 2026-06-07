import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Forbidden = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoHome = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Redirect based on role
    switch (user.role) {
      case 'ADMIN':
        navigate('/admin/dashboard');
        break;
      case 'TEACHER':
        navigate('/teacher/dashboard');
        break;
      case 'STUDENT':
        navigate('/student/dashboard');
        break;
      case 'PARENT':
        navigate('/parent/dashboard');
        break;
      default:
        navigate('/login');
    }
  };

  return (
    <div className="flex-col items-center justify-center" style={{ height: '100vh', gap: '20px', padding: '20px', textAlign: 'center' }}>
      <div style={{ fontSize: '72px', fontWeight: 'bold', color: 'var(--danger)', lineHeight: '1' }}>403</div>
      <h1 className="font-bold text-2xl">Access Denied</h1>
      <p className="text-secondary" style={{ maxWidth: '400px', margin: '0 auto' }}>
        You do not have permission to access this page. If you believe this is an error, please contact your administrator.
      </p>
      <button onClick={handleGoHome} className="btn btn-primary" style={{ marginTop: '10px' }}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default Forbidden;
