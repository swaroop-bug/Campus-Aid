import React, { useState, useEffect } from "react";
import {
  Brain,
  Search,
  MessageCircle,
  Trophy,
  Calendar,
  Award,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import api from "../services/api";

export default function Dashboard({ userName, onNavigate }) {
  const [announcements, setAnnouncements] = useState([]);
  const [quizScores, setQuizScores] = useState([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);

  useEffect(() => {
    // Fetch real announcements
    const fetchAnnouncements = async () => {
      try {
        const data = await api.announcements.getAll();
        setAnnouncements(Array.isArray(data) ? data : []);
      } catch {
        setAnnouncements([]);
      }
      setLoadingAnnouncements(false);
    };

    // Fetch quiz scores
    const fetchScores = async () => {
      try {
        const data = await api.quiz.getScores();
        setQuizScores(Array.isArray(data) ? data : []);
      } catch {
        setQuizScores([]);
      }
    };

    fetchAnnouncements();
    fetchScores();
  }, []);

  const stats = [
    {
      label: "Program",
      value: "M.Sc. (PG)",
      emoji: "🎓",
      description: "Master of Science Program",
    },
    {
      label: "Study Resources",
      value: "5+ Years PYQS",
      emoji: "📖",
      description: "Previous Year Question Papers",
    },
    {
      label: "Active Users",
      value: "150+",
      emoji: "👥",
      description: "Students using Campus Aid",
    },
    {
      label: "AI Responses",
      value: "10K+",
      emoji: "🤖",
      description: "Questions answered by AI",
    },

  ];

  const recentActivities = quizScores.length > 0
    ? quizScores.slice(0, 5).map((q) => ({
        icon: Brain,
        title: `Quiz: ${q.subject}`,
        description: `Scored ${q.score}/${q.totalQuestions} (${Math.round((q.score / q.totalQuestions) * 100)}%)`,
        time: q.completedAt ? new Date(q.completedAt).toLocaleDateString("en-IN") : "Recently",
        color: (q.score / q.totalQuestions) >= 0.7
          ? "var(--neo-success)"
          : (q.score / q.totalQuestions) >= 0.5
          ? "var(--neo-warning)"
          : "var(--neo-danger)",
        target: "quiz"
      }))
    : [
        {
          icon: MessageCircle,
          title: "AI Chatbot",
          description: "Ask questions and get instant help",
          time: "Try it now!",
          color: "var(--neo-accent)",
          target: "chatbot"
        },

        {
          icon: Brain,
          title: "Take a Quiz",
          description: "Test your knowledge with AI-generated quizzes",
          time: "Start now!",
          color: "var(--neo-success)",
          target: "quiz"
        },
        {
          icon: Search,
          title: "Lost & Found",
          description: "Report or find lost items on campus",
          time: "Check it out!",
          color: "var(--neo-warning)",
          target: "lostfound"
        },
      ];

  return (
    <div className="fade-in" style={{ padding: "2rem", minHeight: "100vh", position: "relative" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Welcome Section */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 className="neo-title" style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>
            Welcome back, <span className="gradient-text-shiny">{userName}</span>! 👋
          </h1>
          <p style={{ color: "var(--neo-text-sec)", fontSize: "1.3rem", maxWidth: "700px", margin: "0 auto", lineHeight: "1.6" }}>
            Your comprehensive academic companion for M.Sc. studies. Access
            resources, take quizzes, and get instant help from our AI assistant.
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", marginBottom: "3rem" }}>
          {stats.map((stat, index) => {
            const gradients = [
              "linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(6, 182, 212, 0.2))",
              "linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2))",
              "linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(239, 68, 68, 0.2))",
              "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(236, 72, 153, 0.2))"
            ];
            
            return (
              <div
                key={index}
                className="neo-container"
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "default",
                  background: "rgba(17, 24, 39, 0.4)",
                }}
                onMouseEnter={(e) => { 
                  e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
                  e.currentTarget.style.boxShadow = "var(--shape-outset-hover)";
                  e.currentTarget.style.background = gradients[index % gradients.length];
                }}
                onMouseLeave={(e) => { 
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow = "var(--shape-outset)";
                  e.currentTarget.style.background = "rgba(17, 24, 39, 0.4)";
                }}
              >
                <div style={{ position: "absolute", top: "-20px", right: "-20px", fontSize: "7rem", opacity: 0.03, transform: "rotate(15deg)", filter: "blur(2px)" }}>
                  {stat.emoji}
                </div>
                <div style={{ 
                  fontSize: "3rem", 
                  marginBottom: "1rem", 
                  filter: "drop-shadow(0 0 15px rgba(255,255,255,0.2))" 
                }}>
                  {stat.emoji}
                </div>
                <div style={{ color: "var(--neo-text-sec)", fontSize: "1rem", marginBottom: "0.5rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>
                  {stat.label}
                </div>
                <div className="neo-title" style={{ fontSize: "2.5rem", marginBottom: "0.5rem", background: "linear-gradient(180deg, #fff, #9ca3af)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {stat.value}
                </div>
                <div style={{ color: "var(--neo-text-sec)", fontSize: "0.85rem", opacity: 0.8 }}>
                  {stat.description}
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem", marginBottom: "3rem" }}>
          {/* Recent Activities */}
          <div className="neo-container" style={{ padding: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
              <div className="neo-inset" style={{ width: "50px", height: "50px", borderRadius: "15px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Trophy size={24} color="var(--neo-accent)" />
              </div>
              <div>
                <h3 className="neo-title" style={{ margin: "0", fontSize: "1.5rem" }}>
                  {quizScores.length > 0 ? "Recent Quiz Scores" : "Get Started"}
                </h3>
                <p style={{ color: "var(--neo-text-sec)", margin: "0.2rem 0 0 0", fontSize: "0.9rem" }}>
                  {quizScores.length > 0 ? "Your latest quiz performance" : "Explore Campus Aid features"}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {recentActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={index}
                    className="neo-inset"
                    onClick={() => onNavigate(activity.target)}
                    style={{
                      display: "flex", alignItems: "center", gap: "1rem", padding: "1.5rem",
                      cursor: "pointer", transition: "all 0.3s",
                      borderLeft: `3px solid ${activity.color}`
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateX(5px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateX(0)"; }}
                  >
                    <div className="neo-outset" style={{ width: "50px", height: "50px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={24} color={activity.color} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: "var(--neo-text)", fontSize: "1rem", fontWeight: "600", marginBottom: "0.3rem" }}>
                        {activity.title}
                      </div>
                      <div style={{ color: "var(--neo-text-sec)", fontSize: "0.9rem", marginBottom: "0.3rem" }}>
                        {activity.description}
                      </div>
                      <div style={{ color: "var(--neo-accent)", fontSize: "0.8rem", opacity: 0.7 }}>
                        {activity.time}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Announcements */}
          <div className="neo-container" style={{ padding: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
              <div className="neo-inset" style={{ width: "50px", height: "50px", borderRadius: "15px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Calendar size={24} color="var(--neo-warning)" />
              </div>
              <div>
                <h3 className="neo-title" style={{ margin: "0", fontSize: "1.5rem" }}>Announcements</h3>
                <p style={{ color: "var(--neo-text-sec)", margin: "0.2rem 0 0 0", fontSize: "0.9rem" }}>Important updates & notices</p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {loadingAnnouncements && <p style={{ color: "var(--neo-text-sec)", fontSize: "0.9rem" }}>Loading...</p>}
              {!loadingAnnouncements && announcements.length === 0 && <p style={{ color: "var(--neo-text-sec)", fontSize: "0.9rem" }}>No announcements at this time.</p>}
              {announcements.slice(0, 5).map((announcement) => {
                let badgeColor = "var(--neo-success)";
                if (announcement.priority === "high") badgeColor = "var(--neo-danger)";
                if (announcement.priority === "medium") badgeColor = "var(--neo-warning)";

                return (
                  <div
                    key={announcement._id}
                    className="neo-outset"
                    onClick={() => onNavigate("dashboard")}
                    style={{
                      padding: "1.5rem",
                      cursor: "pointer",
                      transition: "all 0.3s",
                      borderLeft: `4px solid ${badgeColor}`
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateX(5px)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateX(0)"; }}
                  >
                    <div style={{ color: "var(--neo-text)", fontSize: "1.1rem", fontWeight: "700", marginBottom: "0.5rem" }}>
                      {announcement.title}
                    </div>
                    <div style={{ color: "var(--neo-text-sec)", fontSize: "0.9rem", marginBottom: "0.8rem" }}>
                      {announcement.description}
                    </div>
                    <div style={{ color: "var(--neo-text-sec)", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <Calendar size={14} />
                      {announcement.createdAt ? new Date(announcement.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : ""}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quiz Analytics Chart */}
        {quizScores.length > 0 && (
          <div className="neo-container" style={{ padding: "2rem", marginBottom: "3rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
              <div className="neo-inset" style={{ width: "50px", height: "50px", borderRadius: "15px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Brain size={24} color="var(--neo-cyan)" />
              </div>
              <div>
                <h3 className="neo-title" style={{ margin: "0", fontSize: "1.5rem" }}>Quiz Analytics</h3>
                <p style={{ color: "var(--neo-text-sec)", margin: "0.2rem 0 0 0", fontSize: "0.9rem" }}>Your overall subject performance</p>
              </div>
            </div>

            <div style={{ height: "350px", width: "100%", padding: "1rem" }} className="neo-inset">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={quizScores.map(q => ({
                  subject: q.subject,
                  percentage: Math.round((q.score / q.totalQuestions) * 100)
                }))}>
                  <XAxis dataKey="subject" stroke="rgba(255,255,255,0.5)" tick={{fill: "rgba(255,255,255,0.5)"}} />
                  <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: "rgba(255,255,255,0.5)"}} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ background: "rgba(10, 15, 30, 0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", backdropFilter: "blur(10px)" }} 
                    itemStyle={{ color: "var(--neo-cyan)", fontWeight: "bold" }}
                  />
                  <Bar 
                    dataKey="percentage" 
                    fill="var(--neo-cyan)" 
                    radius={[4, 4, 0, 0]} 
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Quick Tips Section */}
        <div className="neo-container" style={{ padding: "3rem 2rem", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            <Award size={40} color="var(--neo-accent)" />
            <h2 className="neo-title" style={{ margin: "0", fontSize: "2.5rem" }}>Pro Tips for Success</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem", marginTop: "2rem" }}>
            <div className="neo-inset" onClick={() => onNavigate("chatbot")} style={{ padding: "2rem", cursor: "pointer" }}>
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🎯</div>
              <h4 style={{ color: "var(--neo-text)", margin: "0 0 0.5rem 0", fontSize: "1.2rem", fontWeight: "700" }}>Use AI Chatbot</h4>
              <p style={{ color: "var(--neo-text-sec)", margin: "0", fontSize: "0.9rem" }}>Get instant answers to your academic questions 24/7</p>
            </div>

            <div className="neo-inset" onClick={() => onNavigate("notes")} style={{ padding: "2rem", cursor: "pointer" }}>
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>📚</div>
              <h4 style={{ color: "var(--neo-text)", margin: "0 0 0.5rem 0", fontSize: "1.2rem", fontWeight: "700" }}>Study Resources</h4>
              <p style={{ color: "var(--neo-text-sec)", margin: "0", fontSize: "0.9rem" }}>Access 5+ years of PYQs and comprehensive study materials</p>
            </div>
            <div className="neo-inset" onClick={() => onNavigate("quiz")} style={{ padding: "2rem", cursor: "pointer" }}>
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🧠</div>
              <h4 style={{ color: "var(--neo-text)", margin: "0 0 0.5rem 0", fontSize: "1.2rem", fontWeight: "700" }}>Practice Quizzes</h4>
              <p style={{ color: "var(--neo-text-sec)", margin: "0", fontSize: "0.9rem" }}>Test your knowledge with AI-generated quizzes and track progress</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
