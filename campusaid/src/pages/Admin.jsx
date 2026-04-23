/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";

const TABS = [
  { id: "overview", label: "📊 Overview" },
  { id: "students", label: "👥 Students" },
  { id: "notes", label: "📖 Notes" },
  { id: "analytics", label: "📈 Quiz Analytics" },
  { id: "railway", label: "🚆 Railway" },
  { id: "lostfound", label: "🔍 Lost & Found" },
  { id: "issues", label: "🚨 Issues" },
  { id: "announcements", label: "📢 Announcements" },
];

function Admin({ initialTab = "overview" }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", department: "CS" });

  const DEPT_OPTIONS = [
    { value: "CS", label: "Computer Science" },
    { value: "IT", label: "Information Technology" },
    { value: "DS", label: "Data Science" },
    { value: "MACS", label: "Maths & Computational Sci." },
  ];
  const [studentSearch, setStudentSearch] = useState("");

  const [railway, setRailway] = useState([]);
  const [railwayRemarks, setRailwayRemarks] = useState({});
  const [lostFound, setLostFound] = useState([]);
  const [issues, setIssues] = useState([]);
  const [issueResponse, setIssueResponse] = useState({});
  const [notes, setNotes] = useState([]);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteForm, setNoteForm] = useState({ title: "", subject: "", description: "", file: null, department: "CS" });
  const [notesDeptFilter, setNotesDeptFilter] = useState("ALL");
  const [announcements, setAnnouncements] = useState([]);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState({ title: "", description: "", priority: "medium" });

  const [quizData, setQuizData] = useState([]);

  const fetchStudents = useCallback(async () => {
    try {
      const r = await api.admin.getAllStudents();
      setStudents(Array.isArray(r) ? r : []);
    } catch {
      setError("Failed to fetch students");
    }
    setLoading(false);
  }, []);

  const fetchRailway = useCallback(async () => {
    try {
      const r = await api.admin.getRailwayApplications();
      setRailway(Array.isArray(r) ? r : []);
    } catch {}
  }, []);

  const fetchLostFound = useCallback(async () => {
    try {
      const r = await api.admin.getLostFound();
      setLostFound(Array.isArray(r) ? r : []);
    } catch {}
  }, []);

  const fetchIssues = useCallback(async () => {
    try {
      const r = await api.admin.getAllIssues();
      setIssues(Array.isArray(r) ? r : []);
    } catch {}
  }, []);

  const fetchNotes = useCallback(async () => {
    try {
      const r = await api.notes.getNotes();
      setNotes(Array.isArray(r) ? r : []);
    } catch {}
  }, []);

  const fetchAnnouncements = useCallback(async () => {
    try {
      const r = await api.admin.getAnnouncements();
      setAnnouncements(Array.isArray(r) ? r : []);
    } catch {}
  }, []);

  const fetchQuizAnalytics = useCallback(async () => {
    try {
      const r = await api.admin.getQuizAnalytics();
      setQuizData(Array.isArray(r) ? r : []);
    } catch {}
  }, []);

  useEffect(() => {
    fetchStudents();
    fetchRailway();
    fetchLostFound();
    fetchIssues();
    fetchNotes();
    fetchAnnouncements();
    fetchQuizAnalytics();
  }, [fetchStudents, fetchRailway, fetchLostFound, fetchIssues, fetchNotes, fetchAnnouncements, fetchQuizAnalytics]);

  const handleEdit = (s) => {
    setEditingStudent(s);
    setFormData({ name: s.name, email: s.email, password: "", department: s.department || "CS" });
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.admin.updateStudent(editingStudent._id, { name: formData.name, email: formData.email, department: formData.department });
      setEditingStudent(null);
      fetchStudents();
    } catch {
      setError("Failed to update");
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm("Delete this student?")) {
      try {
        await api.admin.deleteStudent(id);
        fetchStudents();
      } catch {
        setError("Failed to delete");
      }
    }
  };
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.admin.createStudent(formData);
      setShowCreateForm(false);
      setFormData({ name: "", email: "", password: "", department: "CS" });
      fetchStudents();
    } catch {
      setError("Failed to create");
    }
  };
  const handleRailwayStatus = async (id, status) => {
    await api.admin.updateRailwayStatus(id, status, railwayRemarks[id] || "");
    fetchRailway();
  };
  const handleIssueUpdate = async (id, status) => {
    await api.admin.updateIssue(id, { status, adminResponse: issueResponse[id] || "" });
    fetchIssues();
  };
  const handleDeleteNote = async (id) => {
    if (window.confirm("Delete this note?")) {
      await api.notes.delete(id);
      fetchNotes();
    }
  };
  const handleNoteUpload = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("title", noteForm.title);
    form.append("subject", noteForm.subject);
    form.append("description", noteForm.description);
    form.append("department", noteForm.department);
    if (noteForm.file) form.append("file", noteForm.file);
    await api.notes.upload(form);
    setShowNoteForm(false);
    setNoteForm({ title: "", subject: "", description: "", file: null, department: "CS" });
    fetchNotes();
  };
  const handleNoteChange = (e) => {
    if (e.target.name === "file") {
      setNoteForm({ ...noteForm, file: e.target.files[0] });
    } else {
      setNoteForm({ ...noteForm, [e.target.name]: e.target.value });
    }
  };
  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await api.admin.createAnnouncement(announcementForm);
      setShowAnnouncementForm(false);
      setAnnouncementForm({ title: "", description: "", priority: "medium" });
      fetchAnnouncements();
    } catch {}
  };
  const handleDeleteAnnouncement = async (id) => {
    if (window.confirm("Delete this announcement?")) {
      await api.admin.deleteAnnouncement(id);
      fetchAnnouncements();
    }
  };

  const getBadge = (status) => {
    let color = "var(--neo-text-sec)";
    if (["Approved", "Active", "Returned", "Resolved"].includes(status)) color = "var(--neo-success)";
    if (["Pending", "Open", "In Progress"].includes(status)) color = "var(--neo-warning)";
    if (["Rejected", "Overdue"].includes(status)) color = "var(--neo-danger)";
    
    return <span className="neo-badge" style={{ color }}>{status}</span>;
  };

  // Build Quiz stats
  const totalQuizzes = quizData.length;
  const avgScore = totalQuizzes > 0 ? Math.round(quizData.reduce((sum, q) => sum + (q.score / q.totalQuestions) * 100, 0) / totalQuizzes) : 0;
  
  const subjectMap = {};
  quizData.forEach(q => {
    if (!subjectMap[q.subject]) subjectMap[q.subject] = { name: q.subject, totalScore: 0, totalPossible: 0, attempts: 0 };
    subjectMap[q.subject].totalScore += q.score;
    subjectMap[q.subject].totalPossible += q.totalQuestions;
    subjectMap[q.subject].attempts++;
  });
  
  const subjectChartData = Object.values(subjectMap).map(s => ({
    name: s.name,
    AverageScore: Math.round((s.totalScore / s.totalPossible) * 100),
    Attempts: s.attempts
  })).sort((a,b) => b.AverageScore - a.AverageScore);

  const studentStats = {};
  quizData.forEach(q => {
    const key = q.user || q.studentName;
    if (!studentStats[key]) {
      studentStats[key] = { name: q.studentName, email: q.studentEmail, quizzes: 0, totalScore: 0, totalPossible: 0 };
    }
    studentStats[key].quizzes++;
    studentStats[key].totalScore += q.score;
    studentStats[key].totalPossible += q.totalQuestions;
  });

  // Recent 20 sorted timeline for LineChart
  const timelineData = [...quizData].sort((a,b) => new Date(a.completedAt) - new Date(b.completedAt)).slice(-30).map((q, i) => ({
    time: i,
    scorePercent: Math.round((q.score / q.totalQuestions) * 100),
    student: q.studentName
  }));

  // Recharts Custom Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="neo-tooltip">
          <p className="neo-title" style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color, fontSize: "0.85rem", fontWeight: "600" }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ padding: "2rem", minHeight: "100vh" }}>
      <h1 className="neo-title" style={{ fontSize: "2.2rem", marginBottom: "2rem" }}>
        Admin Panel
      </h1>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "3rem", flexWrap: "wrap" }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`neo-button ${activeTab === tab.id ? "active" : ""}`}
            style={{ minWidth: "140px" }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="neo-inset" style={{ color: "var(--neo-danger)", padding: "1rem", marginBottom: "2rem" }}>
          {error}
        </div>
      )}

      {/* OVERVIEW */}
      {activeTab === "overview" && (
        <div className="fade-in">
          <div className="neo-container" style={{ padding: "2rem", marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ color: "var(--neo-text-sec)", marginBottom: "0.5rem" }}>Welcome back,</div>
              <div className="neo-title" style={{ fontSize: "1.8rem" }}>Campus Admin ⚙️</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: "var(--neo-text-sec)" }}>Action needed</div>
              <div className="neo-accent-text" style={{ fontSize: "2.5rem", fontWeight: "800", lineHeight: 1 }}>
                {railway.filter((r) => r.status === "Pending").length + issues.filter((i) => i.status === "Open").length}
              </div>
              <div style={{ color: "var(--neo-text-sec)", fontSize: "0.8rem" }}>pending items</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2rem" }}>
            {[
              { label: "Total Students", value: students.length, icon: "👥", tab: "students" },
              { label: "Quizzes Taken", value: totalQuizzes, icon: "📈", tab: "analytics" },
              { label: "Open Issues", value: issues.filter((i) => i.status === "Open").length, icon: "🚨", tab: "issues" },
              { label: "Railway Pending", value: railway.filter((r) => r.status === "Pending").length, icon: "🚆", tab: "railway" },
            ].map((stat) => (
              <div
                key={stat.label}
                onClick={() => setActiveTab(stat.tab)}
                className="neo-button"
                style={{ height: "140px", flexDirection: "column", gap: "0.5rem", width: "100%" }}
              >
                <div style={{ fontSize: "1.8rem" }}>{stat.icon}</div>
                <div className="neo-title" style={{ fontSize: "2rem" }}>{stat.value}</div>
                <div style={{ color: "var(--neo-text-sec)", fontSize: "0.8rem" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STUDENTS */}
      {activeTab === "students" && (
        <div className="fade-in">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <h2 className="neo-title" style={{ fontSize: "1.4rem" }}>
              👥 Students <span style={{ color: "var(--neo-accent)" }}>({students.length})</span>
            </h2>
            <button onClick={() => setShowCreateForm(!showCreateForm)} className="neo-button">
              {showCreateForm ? "Cancel" : "+ Add Student"}
            </button>
          </div>

          {showCreateForm && (
            <div className="neo-container" style={{ padding: "2rem", marginBottom: "2rem" }}>
              <h3 className="neo-title" style={{ marginBottom: "1.5rem" }}>Create New Student</h3>
              <form onSubmit={handleCreate} style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-end" }}>
                <div style={{ flex: 1, minWidth: "200px" }}><input className="neo-input" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></div>
                <div style={{ flex: 1, minWidth: "200px" }}><input className="neo-input" type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required /></div>
                <div style={{ flex: 1, minWidth: "200px" }}><input className="neo-input" type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required /></div>
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <select className="neo-input" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })}>
                    {DEPT_OPTIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                </div>
                <button type="submit" className="neo-button neo-button-primary">Create</button>
              </form>
            </div>
          )}

          <input className="neo-input" placeholder="🔍 Search students..." style={{ marginBottom: "2rem", maxWidth: "400px" }} value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} />

          <div className="neo-table-container">
            <table>
              <thead>
                <tr>
                  {["Name", "Email", "Department", "Joined", "Actions"].map((h) => (<th key={h}>{h}</th>))}
                </tr>
              </thead>
              <tbody>
                {students.filter((s) => !studentSearch || s.name?.toLowerCase().includes(studentSearch.toLowerCase()) || s.email?.toLowerCase().includes(studentSearch.toLowerCase())).map((s) => (
                  <tr key={s._id}>
                    <td><strong>{s.name}</strong></td>
                    <td style={{ color: "var(--neo-text-sec)" }}>{s.email}</td>
                    <td><span className="neo-badge" style={{ color: "var(--neo-cyan)", fontSize: "0.8rem" }}>{s.department || "CS"}</span></td>
                    <td style={{ color: "var(--neo-text-sec)" }}>{new Date(s.createdAt).toLocaleDateString("en-IN")}</td>
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button onClick={() => handleEdit(s)} className="neo-button" style={{ padding: "0.4rem 1rem", fontSize: "0.8rem" }}>Edit</button>
                        <button onClick={() => handleDelete(s._id)} className="neo-button" style={{ padding: "0.4rem 1rem", fontSize: "0.8rem", color: "var(--neo-danger)" }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {editingStudent && (
            <div className="neo-container" style={{ padding: "2rem", marginTop: "2rem", border: "1px solid var(--neo-accent)" }}>
              <h3 className="neo-title" style={{ marginBottom: "1.5rem" }}>Edit Student</h3>
              <form onSubmit={handleUpdate} style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <input className="neo-input" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ flex: 1, minWidth: "180px" }} />
                <input className="neo-input" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={{ flex: 1, minWidth: "180px" }} />
                <select className="neo-input" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} style={{ flex: 1, minWidth: "180px" }}>
                  {DEPT_OPTIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
                <button type="submit" className="neo-button neo-button-primary">Save</button>
                <button type="button" onClick={() => setEditingStudent(null)} className="neo-button">Cancel</button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* QUIZ ANALYTICS */}
      {activeTab === "analytics" && (
        <div className="fade-in">
          <h2 className="neo-title" style={{ fontSize: "1.4rem", marginBottom: "2rem" }}>📈 Advanced Quiz Analytics</h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem", marginBottom: "3rem" }}>
            <div className="neo-container" style={{ padding: "2rem", textAlign: "center" }}>
              <div style={{ color: "var(--neo-text-sec)", marginBottom: "1rem" }}>Overall Average</div>
              <div className="neo-accent-text" style={{ fontSize: "3rem", fontWeight: "800", lineHeight: 1 }}>{avgScore}%</div>
            </div>
            <div className="neo-container" style={{ padding: "2rem", textAlign: "center" }}>
              <div style={{ color: "var(--neo-text-sec)", marginBottom: "1rem" }}>Total Quizzes Taken</div>
              <div className="neo-title" style={{ fontSize: "3rem", lineHeight: 1 }}>{totalQuizzes}</div>
            </div>
            <div className="neo-container" style={{ padding: "2rem", textAlign: "center" }}>
              <div style={{ color: "var(--neo-text-sec)", marginBottom: "1rem" }}>Active Students</div>
              <div className="neo-title" style={{ fontSize: "3rem", lineHeight: 1 }}>{Object.keys(studentStats).length}</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "3rem" }}>
            {/* Chart 1: Subject Performance */}
            <div className="neo-container" style={{ padding: "2rem" }}>
              <h3 className="neo-title" style={{ marginBottom: "1.5rem", fontSize: "1.1rem" }}>Subject Average Performance</h3>
              <div style={{ height: "300px", width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="var(--neo-text-sec)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--neo-text-sec)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                    <Bar dataKey="AverageScore" fill="var(--neo-accent)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Recent Attempts Timeline */}
            <div className="neo-container" style={{ padding: "2rem" }}>
              <h3 className="neo-title" style={{ marginBottom: "1.5rem", fontSize: "1.1rem" }}>Recent Scores Trend</h3>
              <div style={{ height: "300px", width: "100%" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="time" hide />
                    <YAxis stroke="var(--neo-text-sec)" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="scorePercent" stroke="var(--neo-success)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="neo-table-container">
            <table>
              <thead>
                <tr>
                  {["Student", "Email", "Quizzes", "Avg Score", "Performance"].map((h) => (<th key={h}>{h}</th>))}
                </tr>
              </thead>
              <tbody>
                {Object.values(studentStats).sort((a, b) => b.quizzes - a.quizzes).map((s, idx) => {
                  const avg = Math.round((s.totalScore / s.totalPossible) * 100);
                  return (
                    <tr key={idx}>
                      <td><strong>{s.name || "Unknown"}</strong></td>
                      <td style={{ color: "var(--neo-text-sec)" }}>{s.email || "—"}</td>
                      <td>{s.quizzes}</td>
                      <td><span className="neo-accent-text" style={{ fontWeight: "700" }}>{avg}%</span></td>
                      <td>
                        <div className="progress-bar" style={{ marginBottom: 0, height: "8px" }}>
                          <div className="progress" style={{ width: `${avg}%`, background: avg >= 70 ? "var(--neo-success)" : avg >= 50 ? "var(--neo-warning)" : "var(--neo-danger)", boxShadow: "none" }} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* OTHER TABS: NOTES, RAILWAY, ISSUES, LOSTFOUND, ANNOUNCEMENTS */}
      {/* Simplified visually to match neomorphic structure */}
      
      {activeTab === "notes" && (
        <div className="fade-in">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <h2 className="neo-title" style={{ fontSize: "1.4rem" }}>📖 Notes ({notesDeptFilter === "ALL" ? notes.length : notes.filter(n => (n.department || "CS") === notesDeptFilter).length})</h2>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <select className="neo-input" value={notesDeptFilter} onChange={(e) => setNotesDeptFilter(e.target.value)} style={{ width: "auto", minWidth: "180px" }}>
                <option value="ALL">All Departments</option>
                {DEPT_OPTIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
              <button onClick={() => setShowNoteForm(!showNoteForm)} className="neo-button">
                {showNoteForm ? "Cancel" : "+ Upload Note"}
              </button>
            </div>
          </div>

          {showNoteForm && (
            <div className="neo-container" style={{ padding: "2rem", marginBottom: "2rem" }}>
              <h3 className="neo-title" style={{ marginBottom: "1.5rem" }}>Upload New Note</h3>
              <form onSubmit={handleNoteUpload} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <input className="neo-input" name="title" placeholder="Title" value={noteForm.title} onChange={handleNoteChange} required />
                <input className="neo-input" name="subject" placeholder="Subject" value={noteForm.subject} onChange={handleNoteChange} required />
                <textarea className="neo-input" name="description" placeholder="Description" value={noteForm.description} onChange={handleNoteChange} style={{ resize: "vertical", minHeight: "80px" }} required />
                <div>
                  <label style={{ display: "block", color: "var(--neo-text)", marginBottom: "0.5rem", fontWeight: "600" }}>Target Department</label>
                  <select className="neo-input" name="department" value={noteForm.department} onChange={handleNoteChange}>
                    {DEPT_OPTIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                </div>
                <input type="file" name="file" onChange={handleNoteChange} accept=".pdf,.doc,.docx" required style={{ color: "var(--neo-text)" }} />
                <button type="submit" className="neo-button neo-button-primary" style={{ alignSelf: "flex-start" }}>Upload Note</button>
              </form>
            </div>
          )}

          <div className="neo-table-container">
            <table>
              <thead><tr><th>Title</th><th>Subject</th><th>Department</th><th>By</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {notes.filter(n => notesDeptFilter === "ALL" || (n.department || "CS") === notesDeptFilter).map(n => (
                  <tr key={n._id}>
                    <td><strong>{n.title}</strong></td>
                    <td style={{ color: "var(--neo-text-sec)" }}>{n.subject}</td>
                    <td><span className="neo-badge" style={{ color: "var(--neo-cyan)", fontSize: "0.8rem" }}>{n.department || "CS"}</span></td>
                    <td style={{ color: "var(--neo-text-sec)" }}>{n.uploadedByName || "Unknown"}</td>
                    <td style={{ color: "var(--neo-text-sec)" }}>{new Date(n.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        {n.filePath && <a href={`http://localhost:8000${n.filePath}`} target="_blank" rel="noreferrer" className="neo-button" style={{ padding: "0.4rem 1rem", fontSize: "0.8rem", textDecoration: "none" }}>Download</a>}
                        <button onClick={() => handleDeleteNote(n._id)} className="neo-button" style={{ padding: "0.4rem 1rem", fontSize: "0.8rem", color: "var(--neo-danger)" }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "announcements" && (
        <div className="fade-in">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <h2 className="neo-title" style={{ fontSize: "1.4rem" }}>📢 Announcements</h2>
            <button onClick={() => setShowAnnouncementForm(!showAnnouncementForm)} className="neo-button">
              {showAnnouncementForm ? "Cancel" : "+ New"}
            </button>
          </div>
          {showAnnouncementForm && (
            <form onSubmit={handleCreateAnnouncement} className="neo-container" style={{ padding: "2rem", marginBottom: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <input className="neo-input" placeholder="Title" value={announcementForm.title} onChange={e => setAnnouncementForm({...announcementForm, title: e.target.value})} required />
              <textarea className="neo-input" placeholder="Description" style={{ minHeight: "100px", resize: "vertical" }} value={announcementForm.description} onChange={e => setAnnouncementForm({...announcementForm, description: e.target.value})} required />
              <select className="neo-input" value={announcementForm.priority} onChange={e => setAnnouncementForm({...announcementForm, priority: e.target.value})}>
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
              </select>
              <button type="submit" className="neo-button neo-button-primary" style={{ alignSelf: "flex-start" }}>Publish</button>
            </form>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {announcements.map(a => (
              <div key={a._id} className="neo-container" style={{ padding: "1.5rem", display: "flex", justifyContent: "space-between" }}>
                <div>
                  <h3 className="neo-title" style={{ marginBottom: "0.5rem" }}>{a.title} {getBadge(a.priority)}</h3>
                  <p style={{ color: "var(--neo-text-sec)", marginBottom: "0.5rem" }}>{a.description}</p>
                </div>
                <button onClick={() => handleDeleteAnnouncement(a._id)} className="neo-button" style={{ color: "var(--neo-danger)", alignSelf: "flex-start" }}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "railway" && (
        <div className="fade-in">
          <h2 className="neo-title" style={{ fontSize: "1.4rem", marginBottom: "2rem" }}>🚆 Railway Applications ({railway.length})</h2>
          <div className="neo-table-container">
            <table>
              <thead><tr><th>Student</th><th>Route</th><th>Details</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {railway.map(r => (
                  <tr key={r._id}>
                    <td>
                      <strong>{r.studentName}</strong>
                      <div style={{ color: "var(--neo-text-sec)", fontSize: "0.8rem" }}>{r.email}</div>
                      <div style={{ color: "var(--neo-text-sec)", fontSize: "0.8rem" }}>{r.rollNumber}</div>
                    </td>
                    <td>
                      <div><strong>{r.fromStation}</strong> to <strong>{r.toStation}</strong></div>
                      <div style={{ color: "var(--neo-text-sec)", fontSize: "0.8rem" }}>{new Date(r.appliedAt).toLocaleDateString()}</div>
                    </td>
                    <td style={{ fontSize: "0.9rem" }}>
                       <div>Class: {r.trainClass}</div>
                       <div>Type: {r.concessionType}</div>
                       <div>Purpose: {r.purpose}</div>
                    </td>
                    <td>{getBadge(r.status)}</td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <input className="neo-input" placeholder="Remarks..." value={railwayRemarks[r._id] || ""} onChange={(e) => setRailwayRemarks({...railwayRemarks, [r._id]: e.target.value})} style={{ padding: "0.4rem", fontSize: "0.8rem", width: "100%" }} />
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button onClick={() => handleRailwayStatus(r._id, "Approved")} className="neo-button" style={{ color: "var(--neo-success)", padding: "0.4rem 1rem", fontSize: "0.8rem" }}>Approve</button>
                          <button onClick={() => handleRailwayStatus(r._id, "Rejected")} className="neo-button" style={{ color: "var(--neo-danger)", padding: "0.4rem 1rem", fontSize: "0.8rem" }}>Reject</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "lostfound" && (
        <div className="fade-in">
          <h2 className="neo-title" style={{ fontSize: "1.4rem", marginBottom: "2rem" }}>🔍 Lost & Found Posts ({lostFound.length})</h2>
          <div className="neo-table-container">
            <table>
              <thead><tr><th>Type</th><th>Item</th><th>Details</th><th>Contact</th><th>Actions</th></tr></thead>
              <tbody>
                {lostFound.map(lf => (
                  <tr key={lf._id}>
                    <td>
                      <span className="neo-badge" style={{ color: lf.type === "lost" ? "var(--neo-danger)" : "var(--neo-success)" }}>
                        {lf.type === "lost" ? "❌ Lost" : "✅ Found"}
                      </span>
                    </td>
                    <td><strong>{lf.title}</strong><div style={{ fontSize: "0.8rem", color: "var(--neo-text-sec)", marginTop: "0.2rem" }}>{new Date(lf.createdAt).toLocaleDateString()}</div></td>
                    <td style={{ fontSize: "0.9rem" }}>
                      <div>{lf.description}</div>
                      <div style={{ color: "var(--neo-text-sec)" }}>📍 {lf.location || "N/A"}</div>
                    </td>
                    <td style={{ fontSize: "0.9rem" }}>
                      <div style={{ color: "var(--neo-accent)" }}>📧 {lf.contactEmail}</div>
                      <div style={{ color: "var(--neo-text-sec)" }}>📱 {lf.contactPhone}</div>
                      <div style={{ color: "var(--neo-text-sec)", fontSize: "0.8rem" }}>User: {lf.postedByName || "Unknown"}</div>
                    </td>
                    <td>
                      <button onClick={async () => {
                        if (window.confirm("Delete this post?")) {
                          await api.admin.deleteLostFound(lf._id);
                          fetchLostFound();
                        }
                      }} className="neo-button" style={{ color: "var(--neo-danger)", padding: "0.4rem 1rem", fontSize: "0.8rem" }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "issues" && (
        <div className="fade-in">
          <h2 className="neo-title" style={{ fontSize: "1.4rem", marginBottom: "2rem" }}>🚨 Issues & Reports ({issues.length})</h2>
          <div className="neo-table-container">
            <table>
              <thead><tr><th>Student</th><th>Issue</th><th>Description</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {issues.map(i => (
                  <tr key={i._id}>
                    <td>
                      <strong>{i.studentName}</strong>
                      <div style={{ color: "var(--neo-text-sec)", fontSize: "0.8rem" }}>{i.studentEmail}</div>
                    </td>
                    <td>
                      <div><strong>{i.title || i.category}</strong></div>
                      <div style={{ color: "var(--neo-text-sec)", fontSize: "0.8rem" }}>{i.category} • {new Date(i.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td style={{ fontSize: "0.9rem", maxWidth: "300px" }}>{i.description}</td>
                    <td>{getBadge(i.status)}</td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <input className="neo-input" placeholder="Admin Response..." value={issueResponse[i._id] || ""} onChange={(e) => setIssueResponse({...issueResponse, [i._id]: e.target.value})} style={{ padding: "0.4rem", fontSize: "0.8rem", width: "100%" }} />
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button onClick={() => handleIssueUpdate(i._id, "Open")} className="neo-button" style={{ color: "var(--neo-warning)", padding: "0.4rem 1rem", fontSize: "0.8rem" }}>Open</button>
                          <button onClick={() => handleIssueUpdate(i._id, "Resolved")} className="neo-button" style={{ color: "var(--neo-success)", padding: "0.4rem 1rem", fontSize: "0.8rem" }}>Resolve</button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}

export default Admin;
