import { useEffect, useState } from "react";
import api from "../services/api";

export default function Issues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    category: "Technical",
    description: "",
  });

  const CATEGORIES = ["Technical", "Academic", "Infrastructure", "Other"];

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const data = await api.issues.getMyIssues();
      setIssues(Array.isArray(data) ? data : []);
    } catch {
      setIssues([]);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.title) formData.title = formData.category; // fallback
      await api.issues.report(formData);
      setFormData({ title: "", category: "Technical", description: "" });
      fetchIssues();
      alert("Issue reported successfully!");
    } catch (err) {
      alert("Failed to report issue");
    }
  };

  const getBadge = (status) => {
    if (status === "Resolved")
      return <span className="neo-badge" style={{ color: "var(--neo-success)" }}>✅ Resolved</span>;
    if (status === "Open")
      return <span className="neo-badge" style={{ color: "var(--neo-warning)" }}>🚧 Open</span>;
    return <span className="neo-badge" style={{ color: "var(--neo-text-sec)" }}>⏳ Pending</span>;
  };

  if (loading) return <div className="fade-in" style={{ padding: "2rem", color: "var(--neo-text-sec)", textAlign: "center" }}>Loading Issues...</div>;

  return (
    <div className="fade-in" style={{ padding: "2rem", minHeight: "100vh", position: "relative" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <h1 className="neo-title" style={{ fontSize: "2.5rem", marginBottom: "2rem", textAlign: "center" }}>
          🚨 Report an Issue
        </h1>

        <div className="neo-container" style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto 3rem auto" }}>
          <h2 className="neo-title" style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>Submit a New Report</h2>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--neo-text)", fontWeight: "600", fontSize: "0.95rem" }}>
                Title / Subject *
              </label>
              <input 
                type="text"
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                placeholder="Brief summary of the issue"
                className="neo-input" 
                required
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--neo-text)", fontWeight: "600", fontSize: "0.95rem" }}>
                Category *
              </label>
              <select 
                name="category" 
                value={formData.category} 
                onChange={handleChange} 
                className="neo-input" 
                required
                style={{ appearance: "none" }}
              >
                {CATEGORIES.map(c => <option key={c} value={c} style={{ background: "var(--neo-bg)" }}>{c}</option>)}
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--neo-text)", fontWeight: "600", fontSize: "0.95rem" }}>
                Description *
              </label>
              <textarea
                name="description"
                className="neo-input"
                value={formData.description}
                onChange={handleChange}
                placeholder="Explain the issue in detail..."
                required
                rows="4"
                style={{ resize: "vertical" }}
              />
            </div>

            <button type="submit" className="neo-button neo-button-primary" style={{ padding: "1rem", fontSize: "1.1rem" }}>
              Submit Issue
            </button>
          </form>
        </div>

        <div className="neo-table-container">
          <div style={{ padding: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
            <h2 className="neo-title" style={{ margin: 0, fontSize: "1.5rem" }}>📋 My Reported Issues</h2>
          </div>

          {issues.length === 0 ? (
           <div style={{ padding: "3rem", textAlign: "center", color: "var(--neo-text-sec)" }}>
             <p>You haven't reported any issues yet.</p>
           </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Title / Category</th>
                  <th>Description</th>
                  <th>Admin Response</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {issues.map(i => (
                  <tr key={i._id}>
                    <td style={{ color: "var(--neo-text-sec)", fontSize: "0.85rem" }}>
                      {new Date(i.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <div style={{ fontWeight: "600", fontSize: "1rem" }}>{i.title || i.category}</div>
                      <div style={{ color: "var(--neo-cyan)", fontSize: "0.8rem" }}>{i.category}</div>
                    </td>
                    <td style={{ maxWidth: "300px" }}>{i.description}</td>
                    <td style={{ color: "var(--neo-accent)", fontStyle: "italic", maxWidth: "250px" }}>
                      {i.adminResponse || "—"}
                    </td>
                    <td>{getBadge(i.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
