import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || `/${user.role.toLowerCase()}/dashboard`;
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const loggedInUser = await login(email, password);
      const from = location.state?.from?.pathname || `/${loggedInUser.role.toLowerCase()}/dashboard`;
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: 'var(--bg)',
      padding: '20px'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', boxShadow: 'var(--shadow-lg)' }}>
        <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '10px' }}>
            <h1 className="font-bold text-2xl" style={{ color: 'var(--primary)', marginBottom: '5px' }}>
              SmartCampus
            </h1>
            <p className="text-secondary text-sm">Sign in to your college portal</p>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="name@school.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                <label className="form-label" htmlFor="password">Password</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    color: 'var(--primary)',
                    fontSize: '0.786rem',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                  disabled={isSubmitting}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              style={{ marginTop: '10px', height: '40px' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? <span className="spinner"></span> : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.857rem' }}>
            <span className="text-secondary">New student or teacher? </span>
            <span style={{ color: 'var(--muted)' }}>Contact admin to register</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
