import React, { useState } from 'react';
import api from '../services/api';
import '../styles.css';

function Login({ onLogin, onSwitchPage }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // enforce domain on client side too
    if (!formData.email.toLowerCase().endsWith('@somaiya.edu')) {
      setError('Email must be a @somaiya.edu address');
      return;
    }

    setLoading(true);
    try {
      const response = await api.auth.login(formData);
      if (response.user) {
        onLogin(response.token, response.user.name, response.user.role, response.user.department);
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--neo-bg)' }}>
      <div className="neo-container" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem 2rem', textAlign: 'center' }}>
        <h2 className="neo-title" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome Back 👋</h2>
        <p style={{ color: 'var(--neo-text-sec)', marginBottom: '2rem' }}>Sign in to your Campus Aid account</p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <input
            type="email"
            name="email"
            className="neo-input"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            className="neo-input"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading} className="neo-button neo-button-primary" style={{ marginTop: '0.5rem', padding: '1rem' }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        {error && <p style={{ color: 'var(--neo-danger)', marginTop: '1rem', fontSize: '0.9rem' }}>{error}</p>}
        <p style={{ marginTop: '2rem', fontSize: '0.95rem' }}>
          <a onClick={() => onSwitchPage('forgotpassword')} style={{ color: 'var(--neo-accent)', cursor: 'pointer', textDecoration: 'none' }}>Forgot Password?</a>
        </p>
      </div>
    </div>
  );
}

export default Login;