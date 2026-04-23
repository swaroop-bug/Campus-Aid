import { useEffect, useState } from "react";
import api from "../services/api";

const DEPT_NAMES = {
  CS: "Computer Science",
  IT: "Information Technology",
  DS: "Data Science",
  MACS: "Maths & Computational Sciences",
};

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    description: "",
    file: null,
  });

  const userDept = localStorage.getItem("userDepartment") || "CS";
  const userRole = localStorage.getItem("userRole") || "student";
  const isAdmin = userRole === "admin";

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    const data = await api.notes.getNotes();
    setNotes(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const handleChange = (e) => {
    if (e.target.name === "file") {
      setFormData({ ...formData, file: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("title", formData.title);
    form.append("subject", formData.subject);
    form.append("description", formData.description);
    form.append("file", formData.file);

    await api.notes.upload(form);
    setShowModal(false);
    setFormData({
      title: "",
      subject: "",
      description: "",
      file: null,
    });
    fetchNotes();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      await api.notes.delete(id);
      fetchNotes();
    }
  };

  if (loading) return <div className="fade-in" style={{ padding: "2rem", color: "var(--neo-text-sec)", textAlign: "center" }}>Loading Notes...</div>;

  return (
    <div className="fade-in" style={{ padding: "2rem", minHeight: "100vh", background: "var(--neo-bg)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div>
            <h1 className="neo-title" style={{ fontSize: "2rem", margin: 0 }}>📖 Notes</h1>
            <p style={{ color: "var(--neo-text-sec)", margin: "0.4rem 0 0" }}>
              {isAdmin
                ? "Viewing all department notes"
                : `Showing notes for ${DEPT_NAMES[userDept] || userDept} department only`}
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            {!isAdmin && (
              <span className="neo-inset" style={{ padding: "0.4rem 0.9rem", borderRadius: "12px", color: "var(--neo-cyan)", fontSize: "0.85rem", fontWeight: "600" }}>
                🏫 {userDept}
              </span>
            )}
            <button className="neo-button neo-button-primary" onClick={() => setShowModal(true)}>
              + Upload Notes
            </button>
          </div>
        </div>

        {/* Upload Modal */}
        {showModal && (
          <div style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(5px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem"
          }} onClick={() => setShowModal(false)}>
            <div className="neo-container" style={{ width: "100%", maxWidth: "500px", padding: "2rem" }} onClick={(e) => e.stopPropagation()}>
              <h2 className="neo-title" style={{ marginBottom: "1.5rem" }}>Upload Notes</h2>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", color: "var(--neo-text)", marginBottom: "0.5rem", fontWeight: "600" }}>Title</label>
                  <input
                    type="text"
                    name="title"
                    className="neo-input"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Chapter 5 - Data Structures"
                    required
                  />
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", color: "var(--neo-text)", marginBottom: "0.5rem", fontWeight: "600" }}>Subject</label>
                  <input
                    type="text"
                    name="subject"
                    className="neo-input"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g., Computer Science"
                    required
                  />
                </div>

                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", color: "var(--neo-text)", marginBottom: "0.5rem", fontWeight: "600" }}>Description</label>
                  <textarea
                    name="description"
                    className="neo-input"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Brief description of the notes..."
                    required
                    style={{ resize: "vertical" }}
                  />
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{ display: "block", color: "var(--neo-text)", marginBottom: "0.5rem", fontWeight: "600" }}>Upload File (PDF, DOC, DOCX)</label>
                  <input
                    type="file"
                    name="file"
                    onChange={handleChange}
                    accept=".pdf,.doc,.docx"
                    required
                    style={{ color: "var(--neo-text)" }}
                  />
                </div>

                <div style={{ display: "flex", gap: "1rem" }}>
                  <button type="button" className="neo-button" style={{ flex: 1 }} onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="neo-button neo-button-primary" style={{ flex: 1 }}>
                    Upload
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Notes Grid */}
        <div>
          {notes.length === 0 ? (
            <div className="neo-container" style={{ textAlign: "center", padding: "4rem" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📚</div>
              <h3 className="neo-title" style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>No notes available</h3>
              <p style={{ color: "var(--neo-text-sec)" }}>Be the first to upload notes!</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
              {notes.map((note) => (
                <div key={note._id} className="neo-outset" style={{ padding: "1.5rem", display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                    <h3 className="neo-title" style={{ margin: 0, fontSize: "1.2rem", wordBreak: "break-word" }}>{note.title}</h3>
                    <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0, marginLeft: "0.5rem" }}>
                      {note.department && (
                        <span className="neo-inset" style={{ color: "var(--neo-cyan)", padding: "0.2rem 0.6rem", borderRadius: "12px", fontSize: "0.7rem", whiteSpace: "nowrap", fontWeight: "600" }}>
                          {note.department}
                        </span>
                      )}
                      <span className="neo-inset" style={{ color: "var(--neo-accent)", padding: "0.2rem 0.6rem", borderRadius: "12px", fontSize: "0.75rem", whiteSpace: "nowrap" }}>
                        {note.subject}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ color: "var(--neo-text-sec)", fontSize: "0.9rem", marginBottom: "1.5rem", flex: 1 }}>
                    {note.description}
                  </div>
                  
                  <div className="neo-inset" style={{ padding: "0.8rem", borderRadius: "10px", marginBottom: "1.5rem", fontSize: "0.85rem" }}>
                    <div style={{ color: "var(--neo-text)", marginBottom: "0.3rem", display: "flex", alignItems: "center", gap: "0.4rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      📁 {note.fileName}
                    </div>
                    <div style={{ color: "var(--neo-text-sec)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      👤 {note.uploadedByName || "Unknown"}
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
                    <a
                      className="neo-button"
                      href={`http://localhost:8000${note.filePath}`}
                      target="_blank"
                      rel="noreferrer"
                      download
                      style={{ flex: 1, textAlign: "center", textDecoration: "none", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "0.9rem" }}
                    >
                      📥 Download
                    </a>
                    <a
                      className="neo-button"
                      href={`http://localhost:8000${note.filePath}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ flex: 1, textAlign: "center", textDecoration: "none", color: "var(--neo-success)", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "0.9rem" }}
                    >
                      👁️ View
                    </a>
                    <button
                      className="neo-button"
                      onClick={() => handleDelete(note._id)}
                      style={{ flex: "0 0 auto", color: "var(--neo-danger)", padding: "0 1rem" }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
