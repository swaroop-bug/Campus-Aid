import { useState } from 'react';
import api from '../services/api';
import '../styles.css';

export default function ChangePassword({ onBack }) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await api.password.change({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      if (response.message) {
        setMessage('Password changed successfully!');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setTimeout(() => onBack(), 2000);
      } else {
        setError(response.message || 'Password change failed');
      }
    } catch (err) {
      setError('Failed to change password');
    }
    setLoading(false);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)', background: 'var(--neo-bg)' }}>
      <div className="neo-container" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem 2rem', textAlign: 'center' }}>
        <h2 className="neo-title" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔒 Change Password</h2>
        <p style={{ color: 'var(--neo-text-sec)', marginBottom: '2rem' }}>Update your account password</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <input
            type="password"
            name="currentPassword"
            className="neo-input"
            placeholder="Current Password"
            value={formData.currentPassword}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="newPassword"
            className="neo-input"
            placeholder="New Password (min 6 chars)"
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
          <button type="submit" disabled={loading} className="neo-button neo-button-primary" style={{ padding: '1rem', marginTop: '0.5rem' }}>
            {loading ? 'Changing...' : 'Update Password'}
          </button>
        </form>

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
          <a onClick={onBack} style={{ color: 'var(--neo-accent)', cursor: 'pointer', textDecoration: 'none' }}>← Back to Dashboard</a>
        </p>
      </div>
    </div>
  );
}