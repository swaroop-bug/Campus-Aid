import { useState } from 'react';
import api from '../services/api';
import '../styles.css';

export default function ForgotPassword({ onSwitchPage }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await api.password.forgot(email);
      if (response.message) {
        setMessage(response.message);
        setEmail('');
      } else {
        setError('Failed to send reset link');
      }
    } catch (err) {
      setError('Failed to process request');
    }
    setLoading(false);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--neo-bg)' }}>
      <div className="neo-container" style={{ width: '100%', maxWidth: '420px', padding: '2.5rem 2rem', textAlign: 'center' }}>
        <h2 className="neo-title" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔑 Forgot Password</h2>
        <p style={{ color: 'var(--neo-text-sec)', marginBottom: '2rem' }}>Enter your email to receive a password reset link</p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <input
            type="email"
            className="neo-input"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" disabled={loading} className="neo-button neo-button-primary" style={{ padding: '1rem' }}>
            {loading ? 'Sending...' : 'Send Reset Link'}
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
          <a onClick={() => onSwitchPage('login')} style={{ color: 'var(--neo-accent)', cursor: 'pointer', textDecoration: 'none' }}>← Back to Login</a>
        </p>
      </div>
    </div>
  );
}