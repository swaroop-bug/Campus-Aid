import { useState } from 'react';
import api from '../services/api';

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
    <div className="auth-container">
      <div className="auth-card">
        <h2>🔒 Change Password</h2>
        <p className="auth-subtitle">Update your account password</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            name="currentPassword"
            placeholder="Current Password"
            value={formData.currentPassword}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
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
          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
        {message && <p style={{color: 'green', marginTop: '1rem', textAlign: 'center'}}>{message}</p>}
        {error && <p className="error">{error}</p>}
        <p className="auth-link">
          <a onClick={onBack}>← Back to Dashboard</a>
        </p>
      </div>
    </div>
  );
}