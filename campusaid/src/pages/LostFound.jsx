import { useEffect, useState } from "react";
import api from "../services/api";

export default function LostFound() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "lost",
    category: "",
    location: "",
    contactEmail: "",
    contactPhone: "",
  });
  const currentUserId = localStorage.getItem("token")
    ? parseJwt(localStorage.getItem("token")).id
    : null;

  function parseJwt(token) {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const data = await api.lostfound.getPosts();
    setPosts(data);
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key]);
    });

    await api.lostfound.create(form);
    setFormData({
      title: "",
      description: "",
      type: "lost",
      category: "",
      location: "",
      contactEmail: "",
      contactPhone: "",
    });
    fetchPosts();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await api.lostfound.delete(id);
        fetchPosts();
      } catch (err) {
        alert("Failed to delete post");
      }
    }
  };

  const handleForget = async (id) => {
    if (window.confirm("Are you sure you want to forget this found item?")) {
      try {
        await api.lostfound.forget(id);
        fetchPosts();
      } catch (err) {
        alert("Failed to forget post");
      }
    }
  };

  if (loading) return <div className="fade-in" style={{ padding: "2rem", color: "var(--neo-text-sec)", textAlign: "center" }}>Loading Lost & Found...</div>;

  return (
    <div
      className="fade-in"
      style={{
        minHeight: "calc(100vh - 80px)",
        background: "var(--neo-bg)",
        padding: "2rem",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <h1 className="neo-title" style={{ marginBottom: "2rem", fontSize: "2.5rem", textAlign: "center" }}>
          🔍 Lost & Found
        </h1>

        {/* Form Section */}
        <div className="neo-container" style={{ padding: "2rem", marginBottom: "2rem" }}>
          <h2 className="neo-title" style={{ marginBottom: "1.5rem", fontSize: "1.5rem" }}>
            Report an Item
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              {/* Type Selection */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--neo-text)", fontWeight: "600", fontSize: "0.95rem" }}>
                  Type *
                </label>
                <div style={{ display: "flex", gap: "2rem", padding: "0.5rem 0" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", color: "var(--neo-text)", fontSize: "1rem", fontWeight: "500" }}>
                    <input
                      type="radio"
                      name="type"
                      value="lost"
                      checked={formData.type === "lost"}
                      onChange={handleChange}
                      style={{ width: "18px", height: "18px", cursor: "pointer", accentColor: "var(--neo-danger)" }}
                    />
                    <span style={{ color: "var(--neo-danger)" }}>❌ Lost</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", color: "var(--neo-text)", fontSize: "1rem", fontWeight: "500" }}>
                    <input
                      type="radio"
                      name="type"
                      value="found"
                      checked={formData.type === "found"}
                      onChange={handleChange}
                      style={{ width: "18px", height: "18px", cursor: "pointer", accentColor: "var(--neo-success)" }}
                    />
                    <span style={{ color: "var(--neo-success)" }}>✅ Found</span>
                  </label>
                </div>
              </div>

              {/* Item Name */}
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--neo-text)", fontWeight: "600", fontSize: "0.95rem" }}>Item Name *</label>
                <input
                  type="text"
                  name="title"
                  className="neo-input"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Black Wallet"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--neo-text)", fontWeight: "600", fontSize: "0.95rem" }}>Category</label>
                <input
                  type="text"
                  name="category"
                  className="neo-input"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g., Electronics, Clothing"
                />
              </div>

              {/* Location */}
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--neo-text)", fontWeight: "600", fontSize: "0.95rem" }}>Location</label>
                <input
                  type="text"
                  name="location"
                  className="neo-input"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Where was it lost/found?"
                />
              </div>

              {/* Contact Phone */}
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--neo-text)", fontWeight: "600", fontSize: "0.95rem" }}>Contact Phone *</label>
                <input
                  type="tel"
                  name="contactPhone"
                  className="neo-input"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder="Your phone number"
                  required
                />
              </div>

              {/* Description */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--neo-text)", fontWeight: "600", fontSize: "0.95rem" }}>Description *</label>
                <textarea
                  name="description"
                  className="neo-input"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the item in detail..."
                  required
                  rows="3"
                  style={{ resize: "vertical" }}
                />
              </div>

              {/* Contact Email */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--neo-text)", fontWeight: "600", fontSize: "0.95rem" }}>Contact Email *</label>
                <input
                  type="email"
                  name="contactEmail"
                  className="neo-input"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>

            <button type="submit" className="neo-button neo-button-primary" style={{ marginTop: "1.5rem", width: "100%", padding: "1rem" }}>
              Submit Report
            </button>
          </form>
        </div>

        {/* Table Section */}
        <div className="neo-table-container">
          <div style={{ padding: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
            <h2 className="neo-title" style={{ margin: 0, fontSize: "1.5rem" }}>📋 Reported Items</h2>
          </div>

          {posts.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: "var(--neo-text-sec)" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📭</div>
              <h3 className="neo-title" style={{ marginBottom: "0.5rem" }}>No items reported yet</h3>
              <p>Be the first to report a lost or found item!</p>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Item</th>
                  <th>Description</th>
                  <th>Location</th>
                  <th>Contact</th>
                  {/* <th style={{textAlign: 'center'}}>Actions</th> */}
                </tr>
              </thead>
              <tbody>
                {posts.map((item, index) => (
                  <tr key={item._id}>
                    <td>
                      <span className="neo-badge" style={{ color: item.type === "lost" ? "var(--neo-danger)" : "var(--neo-success)" }}>
                        {item.type === "lost" ? "❌ Lost" : "✅ Found"}
                      </span>
                    </td>
                    <td style={{ fontWeight: "600", fontSize: "0.95rem" }}>{item.title}</td>
                    <td style={{ color: "var(--neo-text-sec)", fontSize: "0.9rem", maxWidth: "250px" }}>{item.description}</td>
                    <td style={{ color: "var(--neo-text-sec)", fontSize: "0.9rem" }}>📍 {item.location || "N/A"}</td>
                    <td style={{ fontSize: "0.9rem" }}>
                      <div style={{ color: "var(--neo-accent)", marginBottom: "0.3rem" }}>📧 {item.contactEmail}</div>
                      <div style={{ color: "var(--neo-text-sec)" }}>📱 {item.contactPhone}</div>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {item.postedBy === currentUserId && (
                        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                          {item.type === "found" && (
                            <button onClick={() => handleForget(item._id)} className="neo-button" style={{ color: "var(--neo-warning)" }}>
                              🧠 Forget
                            </button>
                          )}
                          <button onClick={() => handleDelete(item._id)} className="neo-button" style={{ color: "var(--neo-danger)" }}>
                            🗑️ Delete
                          </button>
                        </div>
                      )}
                    </td>
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
