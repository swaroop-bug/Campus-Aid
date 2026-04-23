import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Admin() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.admin.getAllStudents();
      setStudents(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error('Failed to fetch students:', err);
      setError('Failed to fetch students');
    }
    setLoading(false);
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({ name: student.name, email: student.email, password: '' });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.admin.updateStudent(editingStudent._id, {
        name: formData.name,
        email: formData.email
      });
      setEditingStudent(null);
      setFormData({ name: '', email: '', password: '' });
      fetchStudents();
    } catch (err) {
      setError('Failed to update student');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await api.admin.deleteStudent(id);
        fetchStudents();
      } catch (err) {
        setError('Failed to delete student');
      }
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.admin.createStudent(formData);
      setShowCreateForm(false);
      setFormData({ name: '', email: '', password: '' });
      fetchStudents();
    } catch (err) {
      setError('Failed to create student');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{ color: 'white', margin: 0 }}>Student Management</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
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
          {showCreateForm ? 'Cancel' : 'Add Student'}
        </button>
      </div>

      {error && (
        <div style={{
          background: '#e74c3c',
          color: 'white',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      {showCreateForm && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '2rem',
          borderRadius: '12px',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: 'white', marginTop: 0 }}>Create New Student</h2>
          <form onSubmit={handleCreate}>
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="Name"
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
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="email"
                placeholder="Email"
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
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
              Create Student
            </button>
          </form>
        </div>
      )}

      {editingStudent && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '2rem',
          borderRadius: '12px',
          marginBottom: '2rem'
        }}>
          <h2 style={{ color: 'white', marginTop: 0 }}>Edit Student</h2>
          <form onSubmit={handleUpdate}>
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="Name"
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
            <div style={{ marginBottom: '1rem' }}>
              <input
                type="email"
                placeholder="Email"
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
                Update
              </button>
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
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
        </div>
      )}

      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(255, 255, 255, 0.1)' }}>
              <th style={{ padding: '1rem', textAlign: 'left', color: 'white' }}>Name</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: 'white' }}>Email</th>
              <th style={{ padding: '1rem', textAlign: 'left', color: 'white' }}>Created</th>
              <th style={{ padding: '1rem', textAlign: 'center', color: 'white' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <td style={{ padding: '1rem', color: 'white' }}>{student.name}</td>
                <td style={{ padding: '1rem', color: '#b0c4de' }}>{student.email}</td>
                <td style={{ padding: '1rem', color: '#b0c4de' }}>
                  {new Date(student.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <button
                    onClick={() => handleEdit(student)}
                    style={{
                      background: '#ffc107',
                      color: 'black',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginRight: '0.5rem',
                      fontSize: '0.9rem'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(student._id)}
                    style={{
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Admin;