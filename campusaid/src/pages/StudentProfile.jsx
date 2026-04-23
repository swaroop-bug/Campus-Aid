/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import api from "../services/api";

function StudentProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [formData, setFormData] = useState({ name: "" });

  const DEPT_NAMES = {
    CS: "Computer Science",
    IT: "Information Technology",
    DS: "Data Science",
    MACS: "Maths & Computational Sciences",
  };

  // Railway Concession state
  const [railwayApplications, setRailwayApplications] = useState([]);
  const [showRailwayForm, setShowRailwayForm] = useState(false);
  const [railwaySaving, setRailwaySaving] = useState(false);
  const [railwayMsg, setRailwayMsg] = useState({ text: "", type: "" });
  const [railwayForm, setRailwayForm] = useState({
    studentName: "",
    email: "",
    rollNumber: "",
    yearOfStudy: "1st Year",
    fromStation: "",
    toStation: "",
    trainClass: "Second Class",
    concessionType: "Quarterly",
    purpose: "Education",
  });

  useEffect(() => {
    fetchUserProfile();
    fetchRailwayApplications();
  }, []);

  const fetchRailwayApplications = async () => {
    try {
      const data = await api.railway.getMyApplications();
      if (Array.isArray(data)) setRailwayApplications(data);
    } catch (err) {}
  };

  const handleRailwaySubmit = async (e) => {
    e.preventDefault();
    setRailwaySaving(true);
    setRailwayMsg({ text: "", type: "" });
    try {
      const data = await api.railway.apply(railwayForm);
      if (data.application) {
        setRailwayMsg({
          text: "Application submitted successfully!",
          type: "success",
        });
        setShowRailwayForm(false);
        setRailwayForm({
          studentName: "",
          email: "",
          rollNumber: "",
          yearOfStudy: "1st Year",
          fromStation: "",
          toStation: "",
          trainClass: "Second Class",
          concessionType: "Quarterly",
          purpose: "Education",
        });
        fetchRailwayApplications();
      } else {
        setRailwayMsg({
          text: data.message || "Submission failed",
          type: "error",
        });
      }
    } catch (err) {
      setRailwayMsg({ text: "Something went wrong", type: "error" });
    }
    setRailwaySaving(false);
  };

  const handleRailwayCancel = async (id) => {
    if (!window.confirm("Cancel this application?")) return;
    try {
      const data = await api.railway.cancel(id);
      setRailwayMsg({ text: data.message || "Cancelled", type: "success" });
      fetchRailwayApplications();
    } catch (err) {
      setRailwayMsg({ text: "Failed to cancel", type: "error" });
    }
  };

  const openRailwayForm = (userData) => {
    setRailwayForm((prev) => ({
      ...prev,
      studentName: userData.name || "",
      email: userData.email || "",
    }));
    setShowRailwayForm(true);
    setRailwayMsg({ text: "", type: "" });
  };

  const fetchUserProfile = async () => {
    try {
      const data = await api.auth.getProfile();
      if (data.id) {
        setUser(data);
      } else {
        setError(data.message || "Failed to load profile");
      }
    } catch (err) {
      setError("Failed to load profile");
    }
    setLoading(false);
  };

  const handleEdit = () => {
    setFormData({ name: user.name });
    setSuccessMsg("");
    setIsEditing(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = await api.auth.updateProfile({ name: formData.name });
      if (data.user) {
        setUser(data.user);
        localStorage.setItem("userName", data.user.name);
        setSuccessMsg("Profile updated successfully!");
        setIsEditing(false);
      } else {
        setError(data.message || "Update failed");
      }
    } catch (err) {
      setError("Failed to update profile");
    }
    setSaving(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ name: "" });
    setSuccessMsg("");
  };

  const getInitials = (name) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "U";

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <div style={{ textAlign: "center", color: "white" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
          <div style={{ fontSize: "1.1rem", color: "#b0c4de" }}>
            Loading profile...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <div
          style={{
            background: "rgba(231,76,60,0.15)",
            border: "1px solid #e74c3c",
            color: "#e74c3c",
            padding: "1.5rem 2.5rem",
            borderRadius: "12px",
            fontSize: "1rem",
          }}
        >
          ⚠️ {error}
        </div>
      </div>
    );
  }

  return (
    <div
      className="fade-in"
      style={{
        padding: "2rem",
        minHeight: "100vh",
        background: "var(--neo-bg)",
      }}
    >
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        {/* Header */}
        <h1
          className="neo-title"
          style={{
            fontSize: "1.8rem",
            marginBottom: "2rem",
          }}
        >
          👤 My Profile
        </h1>

        {/* Success Message */}
        {successMsg && (
          <div
            style={{
              background: "rgba(39,174,96,0.15)",
              border: "1px solid #27ae60",
              color: "#2ecc71",
              padding: "1rem 1.5rem",
              borderRadius: "10px",
              marginBottom: "1.5rem",
              fontSize: "0.95rem",
            }}
          >
            ✅ {successMsg}
          </div>
        )}

        {/* Avatar + Name Card */}
        <div
          className="neo-container"
          style={{
            padding: "2rem",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
          }}
        >
          <div
            className="neo-inset"
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              color: "var(--neo-accent)",
              flexShrink: 0,
            }}
          >
            {getInitials(user.name)}
          </div>
          <div>
            <div
              style={{ color: "var(--neo-text)", fontSize: "1.5rem", fontWeight: "700" }}
            >
              {user.name}
            </div>
            <div
              style={{
                color: "var(--neo-text-sec)",
                fontSize: "0.9rem",
                marginTop: "0.3rem",
              }}
            >
              {user.email}
            </div>
            <div style={{ marginTop: "0.5rem" }}>
              <span
                className="neo-badge"
                style={{
                  color: user.role === "admin" ? "var(--neo-warning)" : "var(--neo-accent)",
                }}
              >
                {user.role === "admin"
                  ? "⚙️ Administrator"
                  : `🎓 M.Sc. ${DEPT_NAMES[user.department] || "Student"}`}
              </span>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          {[
            { label: "📧 Email", value: user.email },
            {
              label: "🛡️ Role",
              value: user.role === "admin" ? "Administrator" : "Student",
            },
            {
              label: "📅 Member Since",
              value: new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
            },
            { label: "🏫 Program", value: `M.Sc. ${DEPT_NAMES[user.department] || "Computer Science"}` },
          ].map((item, i) => (
            <div
              key={i}
              className="neo-outset"
              style={{
                padding: "1.2rem",
              }}
            >
              <div
                style={{
                  color: "#b0c4de",
                  fontSize: "0.8rem",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "0.5rem",
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  color: "white",
                  fontSize: "0.95rem",
                  fontWeight: "500",
                }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* Railway Concession Section */}
        <div
          className="neo-container"
          style={{
            padding: "2rem",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.2rem",
            }}
          >
            <h2
              style={{
                color: "white",
                margin: 0,
                fontSize: "1.1rem",
                fontWeight: "600",
              }}
            >
              🚆 Railway Concession
            </h2>
            {!showRailwayForm && (
              <button
                className="neo-button neo-button-primary"
                onClick={() => openRailwayForm(user)}
              >
                + Apply Now
              </button>
            )}
          </div>

          {/* Feedback Message */}
          {railwayMsg.text && (
            <div
              style={{
                background:
                  railwayMsg.type === "success"
                    ? "rgba(39,174,96,0.15)"
                    : "rgba(231,76,60,0.15)",
                border: `1px solid ${railwayMsg.type === "success" ? "#27ae60" : "#e74c3c"}`,
                color: railwayMsg.type === "success" ? "#2ecc71" : "#e74c3c",
                padding: "0.8rem 1.2rem",
                borderRadius: "8px",
                marginBottom: "1rem",
                fontSize: "0.9rem",
              }}
            >
              {railwayMsg.type === "success" ? "✅" : "⚠️"} {railwayMsg.text}
            </div>
          )}

          {/* Application Form */}
          {showRailwayForm && (
            <form onSubmit={handleRailwaySubmit}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1rem",
                  marginBottom: "1rem",
                }}
              >
                {[
                  {
                    label: "Student Name",
                    key: "studentName",
                    type: "text",
                    placeholder: "Full name",
                  },
                  {
                    label: "Email",
                    key: "email",
                    type: "email",
                    placeholder: "Your email",
                  },
                  {
                    label: "Roll Number",
                    key: "rollNumber",
                    type: "text",
                    placeholder: "e.g. MSC2024001",
                  },
                  {
                    label: "From Station",
                    key: "fromStation",
                    type: "text",
                    placeholder: "Departure station",
                  },
                  {
                    label: "To Station",
                    key: "toStation",
                    type: "text",
                    placeholder: "Destination station",
                  },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label
                      style={{
                        color: "#b0c4de",
                        display: "block",
                        marginBottom: "0.3rem",
                        fontSize: "0.82rem",
                      }}
                    >
                      {label}
                    </label>
                    <input
                      type={type}
                      required
                      placeholder={placeholder}
                      value={railwayForm[key]}
                      onChange={(e) =>
                        setRailwayForm({
                          ...railwayForm,
                          [key]: e.target.value,
                        })
                      }
                      style={{
                        width: "100%",
                        padding: "0.7rem 0.9rem",
                        border: "1px solid rgba(255,255,255,0.15)",
                        borderRadius: "8px",
                        background: "rgba(255,255,255,0.08)",
                        color: "white",
                        fontSize: "0.9rem",
                        boxSizing: "border-box",
                      }}
                    />
                  </div>
                ))}
                {[
                  {
                    label: "Year of Study",
                    key: "yearOfStudy",
                    options: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
                  },
                  {
                    label: "Train Class",
                    key: "trainClass",
                    options: ["Second Class", "Sleeper Class", "First Class"],
                  },
                  {
                    label: "Concession Type",
                    key: "concessionType",
                    options: ["Quarterly", "Half-Yearly", "Annual"],
                  },
                  {
                    label: "Purpose",
                    key: "purpose",
                    options: ["Education", "Home Visit"],
                  },
                ].map(({ label, key, options }) => (
                  <div key={key}>
                    <label
                      style={{
                        color: "#b0c4de",
                        display: "block",
                        marginBottom: "0.3rem",
                        fontSize: "0.82rem",
                      }}
                    >
                      {label}
                    </label>
                    <select
                      value={railwayForm[key]}
                      onChange={(e) =>
                        setRailwayForm({
                          ...railwayForm,
                          [key]: e.target.value,
                        })
                      }
                      style={{
                        width: "100%",
                        padding: "0.7rem 0.9rem",
                        border: "1px solid rgba(255,255,255,0.15)",
                        borderRadius: "8px",
                        background: "#1a1f35",
                        color: "white",
                        fontSize: "0.9rem",
                        boxSizing: "border-box",
                      }}
                    >
                      {options.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  type="submit"
                  disabled={railwaySaving}
                  className="neo-button neo-button-primary"
                  style={{ opacity: railwaySaving ? 0.7 : 1 }}
                >
                  {railwaySaving ? "Submitting..." : "Submit Application"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowRailwayForm(false)}
                  className="neo-button"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Existing Applications */}
          {railwayApplications.length > 0 && !showRailwayForm && (
            <div>
              <p
                style={{
                  color: "#b0c4de",
                  fontSize: "0.85rem",
                  marginBottom: "0.8rem",
                }}
              >
                Your Applications:
              </p>
              {railwayApplications.map((app) => {
                const statusColor =
                  app.status === "Approved"
                    ? "#2ecc71"
                    : app.status === "Rejected"
                      ? "#e74c3c"
                      : "#f39c12";
                const statusBg =
                  app.status === "Approved"
                    ? "rgba(46,204,113,0.1)"
                    : app.status === "Rejected"
                      ? "rgba(231,76,60,0.1)"
                      : "rgba(243,156,18,0.1)";
                return (
                  <div
                    key={app._id}
                    className="neo-outset"
                    style={{
                      padding: "1rem",
                      marginBottom: "0.8rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            color: "white",
                            fontWeight: "600",
                            fontSize: "0.95rem",
                          }}
                        >
                          🚉 {app.fromStation} → {app.toStation}
                        </div>
                        <div
                          style={{
                            color: "#b0c4de",
                            fontSize: "0.82rem",
                            marginTop: "0.3rem",
                          }}
                        >
                          {app.trainClass} · {app.concessionType} ·{" "}
                          {app.purpose}
                        </div>
                        <div
                          style={{
                            color: "#6b7fa3",
                            fontSize: "0.78rem",
                            marginTop: "0.2rem",
                          }}
                        >
                          Applied:{" "}
                          {new Date(app.appliedAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                        {app.remarks && (
                          <div
                            style={{
                              color: "#b0c4de",
                              fontSize: "0.82rem",
                              marginTop: "0.3rem",
                            }}
                          >
                            Remarks: {app.remarks}
                          </div>
                        )}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-end",
                          gap: "0.5rem",
                        }}
                      >
                        <span
                          style={{
                            background: statusBg,
                            color: statusColor,
                            padding: "0.2rem 0.8rem",
                            borderRadius: "20px",
                            fontSize: "0.78rem",
                            fontWeight: "700",
                          }}
                        >
                          {app.status}
                        </span>
                        {app.status === "Pending" && (
                          <button
                            onClick={() => handleRailwayCancel(app._id)}
                            style={{
                              background: "rgba(231,76,60,0.15)",
                              color: "#e74c3c",
                              border: "1px solid rgba(231,76,60,0.3)",
                              padding: "0.2rem 0.7rem",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontSize: "0.78rem",
                            }}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {railwayApplications.length === 0 && !showRailwayForm && (
            <p
              style={{
                color: "#6b7fa3",
                fontSize: "0.9rem",
                textAlign: "center",
                padding: "1rem 0",
              }}
            >
              No applications yet. Click{" "}
              <b style={{ color: "#f39c12" }}>Apply Now</b> to get started.
            </p>
          )}
        </div>

        {/* Edit Profile Section */}
        <div
          className="neo-container"
          style={{
            padding: "2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: isEditing ? "1.5rem" : "0",
            }}
          >
            <h2
              style={{
                color: "white",
                margin: 0,
                fontSize: "1.1rem",
                fontWeight: "600",
              }}
            >
              ✏️ Edit Profile
            </h2>
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="neo-button"
              >
                Edit Name
              </button>
            )}
          </div>

          {isEditing && (
            <form onSubmit={handleUpdate}>
              <div style={{ marginBottom: "1.2rem" }}>
                <label
                  style={{
                    color: "#b0c4de",
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.9rem",
                  }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  autoFocus
                  placeholder="Enter your full name"
                  style={{
                    width: "100%",
                    padding: "0.8rem 1rem",
                    border: "1px solid rgba(102,126,234,0.4)",
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.08)",
                    color: "white",
                    fontSize: "1rem",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <button
                  type="submit"
                  disabled={saving}
                  className="neo-button neo-button-primary"
                  style={{ opacity: saving ? 0.7 : 1 }}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="neo-button"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentProfile;
