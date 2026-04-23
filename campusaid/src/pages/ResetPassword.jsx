import { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles.css';

export default function ResetPassword({ onSwitchPage }) {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    // Get token from URL
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError('Invalid or missing reset token.');
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await api.password.reset({
        token,
        newPassword: formData.newPassword
      });

      if (response.message) {
        setMessage('Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          window.history.pushState({}, '', '/');
          onSwitchPage('login');
        }, 2000);
      } else {
        setError(response.message || 'Password reset failed');
      }
    } catch (err) {
      setError('Failed to reset password. Link may have expired.');
    }
    setLoading(false);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--neo-bg)' }}>
      <div className="neo-container" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem 2rem', textAlign: 'center' }}>
        <h2 className="neo-title" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔒 Reset Password</h2>
        <p style={{ color: 'var(--neo-text-sec)', marginBottom: '2rem' }}>Enter your new strong password</p>

        {!token && !error ? (
          <p style={{ color: 'var(--neo-text-sec)' }}>Validating link...</p>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <input
              type="password"
              name="newPassword"
              className="neo-input"
              placeholder="New Password (min 6 characters)"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="confirmPassword"
              className="neo-input"
              placeholder="Confirm New Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <button type="submit" disabled={loading || !token} className="neo-button neo-button-primary" style={{ padding: '1rem' }}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        {message && (
          <div className="neo-outset" style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            borderRadius: '10px', 
            color: 'var(--neo-success)',
            border: '1px solid var(--neo-success)',
            fontSize: '0.9rem'
          }}>
            {message}
          </div>
        )}

        {error && (
          <div className="neo-outset" style={{ 
            marginTop: '1.5rem', 
            padding: '1rem', 
            borderRadius: '10px', 
            color: 'var(--neo-danger)',
            border: '1px solid var(--neo-danger)',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        <p style={{ marginTop: '2rem', fontSize: '0.95rem' }}>
          <a onClick={() => onSwitchPage('login')} style={{ color: 'var(--neo-accent)', cursor: 'pointer', textDecoration: 'none' }}>← Back to Login</a>
        </p>
      </div>
    </div>
  );
}