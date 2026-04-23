import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    file: null
  });

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    const data = await api.notes.getNotes();
    setNotes(data);
    setLoading(false);
  };

  const handleChange = (e) => {
    if (e.target.name === 'file') {
      setFormData({ ...formData, file: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('title', formData.title);
    form.append('subject', formData.subject);
    form.append('description', formData.description);
    form.append('file', formData.file);

    await api.notes.upload(form);
    setShowModal(false);
    setFormData({
      title: '',
      subject: '',
      description: '',
      file: null
    });
    fetchNotes();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      await api.notes.delete(id);
      fetchNotes();
    }
  };

  if (loading) return <div className="loading">Loading Notes...</div>;

  return (
    <div className="main-container">
      <div className="notes-header">
        <h1>📖 Notes</h1>
        <button className="upload-btn" onClick={() => setShowModal(true)}>
          + Upload Notes
        </button>
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="upload-modal" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Upload Notes</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Chapter 5 - Data Structures"
                  required
                />
              </div>

              <div className="form-group">
                <label>Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g., MSc Data Science"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description of the notes..."
                  required
                />
              </div>

              <div className="form-group">
                <label>Upload File (PDF, DOC, DOCX)</label>
                <input
                  type="file"
                  name="file"
                  onChange={handleChange}
                  accept=".pdf,.doc,.docx"
                  required
                />
              </div>

              <div className="modal-buttons">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notes Grid */}
      <div className="notes-grid">
        {notes.length === 0 ? (
          <div className="empty-state">
            <h3>No notes available</h3>
            <p>Be the first to upload notes!</p>
          </div>
        ) : (
          notes.map((note) => (
            <div key={note._id} className="note-card">
              <div className="note-header">
                <h3>{note.title}</h3>
                <span className="note-subject" style={{background: '#667eea'}}>{note.subject}</span>
              </div>
              <div className="note-description">{note.description}</div>
              <div className="note-meta">
                <span>📁 {note.fileName}</span>
                <span>👤 {note.uploadedBy?.name || 'Unknown'}</span>
              </div>
              <div className="note-actions">
                <a 
                  className="download-btn" 
                  href={`http://localhost:5000${note.filePath}`} 
                  target="_blank" 
                  rel="noreferrer"
                  download
                >
                  📥 Download
                </a>
                <a 
                  className="download-btn" 
                  href={`http://localhost:5000${note.filePath}`} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{background: '#27ae60'}}
                >
                  👁️ View
                </a>
                <button 
                  className="delete-btn" 
                  onClick={() => handleDelete(note._id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

