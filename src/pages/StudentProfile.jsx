import React, { useState, useEffect } from 'react';
import api from '../services/api';

function StudentProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      // For now, we'll get user info from localStorage or make a profile endpoint
      // Since we don't have a dedicated profile endpoint, we'll use the token to get user info
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      // Decode token to get user info (simple way, in production use proper JWT decode)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.id;

        // For students, we can create a simple profile display
        // In a real app, you'd have a /api/auth/profile endpoint
        setUser({
          id: userId,
          name: localStorage.getItem('userName') || 'User',
          email: '', // We don't store email in localStorage
          role: localStorage.getItem('userRole') || 'student',
          createdAt: new Date().toISOString() // Placeholder
        });
      } catch (decodeError) {
        console.error('Error decoding token:', decodeError);
        setError('Invalid authentication token');
      }

    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile');
    }
    setLoading(false);
  };

  const handleEdit = () => {
    setFormData({ name: user.name, email: user.email });
    setIsEditing(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    // In a real implementation, you'd call an API to update the profile
    // For now, just update local state
    setUser({ ...user, name: formData.name, email: formData.email });
    localStorage.setItem('userName', formData.name);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ name: '', email: '' });
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'white' }}>
        <div>Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{
          background: '#e74c3c',
          color: 'white',
          padding: '1rem',
          borderRadius: '8px',
          display: 'inline-block'
        }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        padding: '2rem',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{ color: 'white', margin: 0 }}>My Profile</h1>
          {!isEditing && (
            <button
              onClick={handleEdit}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '0.8rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleUpdate}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem' }}>
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  fontSize: '1rem'
                }}
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ color: 'white', display: 'block', marginBottom: '0.5rem' }}>
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  fontSize: '1rem'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '0.8rem 1.5rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '0.8rem 1.5rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ color: '#b0c4de', display: 'block', marginBottom: '0.5rem' }}>
                Full Name
              </label>
              <div style={{
                color: 'white',
                fontSize: '1.1rem',
                padding: '0.8rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '6px'
              }}>
                {user.name}
              </div>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ color: '#b0c4de', display: 'block', marginBottom: '0.5rem' }}>
                Email Address
              </label>
              <div style={{
                color: 'white',
                fontSize: '1.1rem',
                padding: '0.8rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '6px'
              }}>
                {user.email || 'Not available'}
              </div>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ color: '#b0c4de', display: 'block', marginBottom: '0.5rem' }}>
                Role
              </label>
              <div style={{
                color: 'white',
                fontSize: '1.1rem',
                padding: '0.8rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '6px'
              }}>
                {user.role === 'admin' ? 'Administrator' : 'Student'}
              </div>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ color: '#b0c4de', display: 'block', marginBottom: '0.5rem' }}>
                Account Created
              </label>
              <div style={{
                color: 'white',
                fontSize: '1.1rem',
                padding: '0.8rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '6px'
              }}>
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentProfile;