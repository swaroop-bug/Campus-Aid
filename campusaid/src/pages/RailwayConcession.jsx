import React, { useState, useEffect } from "react";
import api from "../services/api";

export default function RailwayConcession() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [form, setForm] = useState({
    studentName: localStorage.getItem("userName") || "",
    email: "",
    rollNumber: "",
    yearOfStudy: "1st Year",
    fromStation: "",
    toStation: "",
    trainClass: "Second Class",
    concessionType: "Quarterly",
    purpose: "Education",
  });

  useEffect(() => { fetchApplications(); }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await api.railway.getMyApplications();
      setApplications(Array.isArray(data) ? data : []);
    } catch { setMsg({ text: "Failed to load applications", type: "error" }); }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg({ text: "", type: "" });
    try {
      const data = await api.railway.apply(form);
      if (data.application) {
        setMsg({ text: "Application submitted successfully!", type: "success" });
        setShowForm(false);
        setForm((p) => ({ ...p, rollNumber: "", fromStation: "", toStation: "" }));
        fetchApplications();
      } else {
        setMsg({ text: data.message || "Submission failed", type: "error" });
      }
    } catch { setMsg({ text: "Something went wrong. Try again.", type: "error" }); }
    setSubmitting(false);
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this application?")) return;
    try {
      const data = await api.railway.cancel(id);
      setMsg({ text: data.message || "Application cancelled", type: "success" });
      fetchApplications();
    } catch { setMsg({ text: "Failed to cancel", type: "error" }); }
  };

  const getBadge = (status) => { 
    let badgeColor = "var(--neo-text-sec)";
    if (status === "Pending") badgeColor = "var(--neo-warning)";
    if (status === "Approved") badgeColor = "var(--neo-success)";
    if (status === "Rejected") badgeColor = "var(--neo-danger)";
    return <span className="neo-badge" style={{ color: badgeColor }}>{status}</span>; 
  };

  const fields = [
    { label: "Student Name", key: "studentName", type: "text", placeholder: "Your full name" },
    { label: "Email", key: "email", type: "email", placeholder: "Your email address" },
    { label: "Roll Number", key: "rollNumber", type: "text", placeholder: "e.g. MSC2024001" },
    { label: "From Station", key: "fromStation", type: "text", placeholder: "Departure station" },
    { label: "To Station", key: "toStation", type: "text", placeholder: "Destination station" },
  ];

  const selects = [
    { label: "Year of Study", key: "yearOfStudy", options: ["1st Year", "2nd Year"] },
    { label: "Train Class", key: "trainClass", options: ["Second Class", "Sleeper Class", "First Class"] },
    { label: "Concession Type", key: "concessionType", options: ["Quarterly", "Half-Yearly", "Annual"] },
     ];

  return (
    <div className="fade-in" style={{ padding: "2rem", minHeight: "100vh", background: "var(--neo-bg)" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div>
            <h1 className="neo-title" style={{ fontSize: "1.8rem", margin: 0 }}>🚆 Railway Concession</h1>
            <p style={{ color: "var(--neo-text-sec)", margin: "0.4rem 0 0", fontSize: "0.9rem" }}>Apply for student railway concession pass</p>
          </div>
          {!showForm && (
            <button className="neo-button neo-button-primary" onClick={() => { setShowForm(true); setMsg({ text: "", type: "" }); }}>
              + Apply Now
            </button>
          )}
        </div>

        {/* Message */}
        {msg.text && (
          <div className="neo-outset" style={{ 
            color: msg.type === "success" ? "var(--neo-success)" : "var(--neo-danger)", 
            padding: "1rem", 
            marginBottom: "1.5rem", 
            border: `1px solid ${msg.type === "success" ? "var(--neo-success)" : "var(--neo-danger)"}` 
          }}>
            {msg.text}
          </div>
        )}

        {/* Application Form */}
        {showForm && (
          <div className="neo-container" style={{ padding: "2rem", marginBottom: "2rem" }}>
            <h2 className="neo-title" style={{ margin: "0 0 1.5rem", fontSize: "1.2rem" }}>📋 New Application</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
                {fields.map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--neo-text)", fontWeight: "600", fontSize: "0.95rem" }}>{label}</label>
                    <input type={type} placeholder={placeholder} value={form[key]} required onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="neo-input" />
                  </div>
                ))}
                {selects.map(({ label, key, options }) => (
                  <div key={key}>
                    <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--neo-text)", fontWeight: "600", fontSize: "0.95rem" }}>{label}</label>
                    <select value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="neo-input" style={{ appearance: "none" }}>
                      {options.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button type="submit" disabled={submitting} className="neo-button neo-button-primary" style={{ opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? "Submitting..." : "Submit Application"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="neo-button">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Applications List */}
        <h2 className="neo-title" style={{ fontSize: "1.2rem", margin: "0 0 1rem" }}>📄 My Applications</h2>
        {loading ? (
          <p style={{ color: "var(--neo-text-sec)", textAlign: "center", padding: "2rem" }}>Loading...</p>
        ) : applications.length === 0 ? (
          <div className="neo-container" style={{ textAlign: "center", padding: "3rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚉</div>
            <p style={{ color: "var(--neo-text-sec)", margin: 0 }}>No applications yet. Click <b style={{ color: "var(--neo-accent)" }}>Apply Now</b> to get started.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {applications.map((app) => (
              <div key={app._id} className="neo-outset" style={{ padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                  <div>
                    <div style={{ color: "var(--neo-text)", fontWeight: "700", fontSize: "1rem", marginBottom: "0.4rem" }}>
                      🚉 {app.fromStation} <span style={{ color: "var(--neo-accent)" }}>→</span> {app.toStation}
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.4rem" }}>
                      <span className="neo-inset" style={{ color: "var(--neo-accent)", padding: "0.2rem 0.8rem", borderRadius: "12px", fontSize: "0.8rem" }}>{app.trainClass}</span>
                      <span className="neo-inset" style={{ color: "var(--neo-text-sec)", padding: "0.2rem 0.8rem", borderRadius: "12px", fontSize: "0.8rem" }}>{app.concessionType}</span>
                      <span className="neo-inset" style={{ color: "var(--neo-text-sec)", padding: "0.2rem 0.8rem", borderRadius: "12px", fontSize: "0.8rem" }}>{app.purpose}</span>
                    </div>
                    <div style={{ color: "var(--neo-text-sec)", fontSize: "0.8rem", marginTop: "0.8rem" }}>Roll: {app.rollNumber} · Year: {app.yearOfStudy} · Applied: {new Date(app.appliedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                    {app.remarks && <div style={{ color: "var(--neo-text)", fontSize: "0.85rem", marginTop: "0.5rem" }}>💬 {app.remarks}</div>}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.6rem" }}>
                    {getBadge(app.status)}
                    {app.status === "Pending" && (
                      <button onClick={() => handleCancel(app._id)} className="neo-button" style={{ color: "var(--neo-danger)", padding: "0.4rem 1rem", fontSize: "0.8rem" }}>
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
