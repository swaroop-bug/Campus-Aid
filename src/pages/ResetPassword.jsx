import { useState, useEffect } from 'react';
import api from '../services/api';

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
      setError('Invalid reset link');
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

  if (!token && !error) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>🔒 Reset Password</h2>
        <p className="auth-subtitle">Enter your new password</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            name="newPassword"
            placeholder="New Password (min 6 characters)"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading || !token} className="auth-btn">
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        {message && (
          <div style={{
            background: '#d4edda',
            color: '#155724',
            padding: '1rem',
            borderRadius: '5px',
            marginTop: '1rem',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}
        {error && <p className="error">{error}</p>}
        <p className="auth-link">
          <a onClick={() => onSwitchPage('login')}>← Back to Login</a>
        </p>
      </div>
    </div>
  );
}