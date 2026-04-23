import { useState, useEffect } from "react";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";
import Dashboard from "./pages/Dashboard";
import Notes from "./pages/Notes";
import Quiz from "./pages/Quiz";
import LostFound from "./pages/LostFound";
import Chatbot from "./pages/Chatbot";
import Admin from "./pages/Admin";
import StudentProfile from "./pages/StudentProfile";
import RailwayConcession from "./pages/RailwayConcession";
import Issues from "./pages/Issues";
import {
  LogOut,
  Key,
  Menu,
  X,
} from "lucide-react";

import "./styles.css";

export default function App() {
  const [currentPage, setCurrentPage] = useState("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || "",
  );
  const [userRole, setUserRole] = useState(
    localStorage.getItem("userRole") || "student",
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [adminTab, setAdminTab] = useState("overview");
  const [userDepartment, setUserDepartment] = useState(
    localStorage.getItem("userDepartment") || "CS",
  );

  const DEPT_NAMES = {
    CS: "Computer Science",
    IT: "Information Technology",
    DS: "Data Science",
    MACS: "Maths & Computational Sciences",
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("token")) {
      setCurrentPage("resetpassword");
    }
    // Check if user is already logged in
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (token, name, role, department) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userName", name);
    localStorage.setItem("userRole", role);
    localStorage.setItem("userDepartment", department || "CS");
    setIsAuthenticated(true);
    setUserName(name);
    setUserRole(role);
    setUserDepartment(department || "CS");
    // Admin goes to admin panel, student goes to dashboard
    setCurrentPage(role === "admin" ? "admin" : "dashboard");
  };

  const handleNavigationClick = (item) => {
    item.action();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userDepartment");
    setIsAuthenticated(false);
    setUserName("");
    setUserRole("student");
    setUserDepartment("CS");
    setCurrentPage("login");
  };

  // ── Admin navigation (each item opens its tab in Admin panel) ──
  const goAdmin = (tab) => {
    setCurrentPage("admin");
    setAdminTab(tab);
  };

  const adminNavigationItems = [
    {
      id: "overview",
      label: "Overview",
      icon: "📊",
      action: () => goAdmin("overview"),
    },
    {
      id: "students",
      label: "Students",
      icon: "👥",
      action: () => goAdmin("students"),
    },
    {
      id: "notes-mgmt",
      label: "Notes",
      icon: "📖",
      action: () => goAdmin("notes"),
    },
    {
      id: "quiz-mgmt",
      label: "Quiz Analytics",
      icon: "📈",
      action: () => goAdmin("analytics"),
    },
    {
      id: "lostfound",
      label: "Lost & Found",
      icon: "🔍",
      action: () => goAdmin("lostfound"),
    },
    {
      id: "railway",
      label: "Railway Concession",
      icon: "🚆",
      action: () => goAdmin("railway"),
    },
    {
      id: "issues",
      label: "Issues",
      icon: "🚨",
      action: () => goAdmin("issues"),
    },
    {
      id: "announcements",
      label: "Announcements",
      icon: "📢",
      action: () => goAdmin("announcements"),
    },
    {
      id: "profile",
      label: "My Profile",
      icon: "👤",
      action: () => setCurrentPage("profile"),
    },
  ];

  // ── Student navigation ──
  const studentNavigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "🏠",
      action: () => setCurrentPage("dashboard"),
    },
    {
      id: "notes",
      label: "Notes",
      icon: "📖",
      action: () => setCurrentPage("notes"),
    },
    {
      id: "quiz",
      label: "Quiz",
      icon: "✏️",
      action: () => setCurrentPage("quiz"),
    },
    {
      id: "lostfound",
      label: "Lost & Found",
      icon: "🔍",
      action: () => setCurrentPage("lostfound"),
    },
    {
      id: "railway",
      label: "Railway Concession",
      icon: "🚆",
      action: () => setCurrentPage("railway"),
    },
    {
      id: "chatbot",
      label: "Ask Me",
      icon: "🤖",
      action: () => setCurrentPage("chatbot"),
    },

    {
      id: "profile",
      label: "My Profile",
      icon: "👤",
      action: () => setCurrentPage("profile"),
    },
    {
      id: "issues",
      label: "Report Issue",
      icon: "🚨",
      action: () => setCurrentPage("issues"),
    },
  ];

  // Fix: admin sees admin nav, student sees student nav
  const navigationItems =
    userRole === "admin" ? adminNavigationItems : studentNavigationItems;

  return (
    <>
      {isAuthenticated && (
        <div style={{ display: "flex", minHeight: "100vh", background: "var(--neo-bg)" }}>
          {/* Sidebar */}
          <div
            className="sidebar-content"
            style={{
              width: sidebarCollapsed ? "80px" : "280px",
              background: "rgba(10, 15, 30, 0.6)",
              backdropFilter: "blur(16px)",
              borderRight: "1px solid rgba(255, 255, 255, 0.05)",
              boxShadow: "10px 0 30px rgba(0,0,0,0.5)",
              transition: "width 0.3s ease",
              position: "fixed",
              height: "100vh",
              left: 0,
              top: 0,
              zIndex: 1000,
              overflowY: "auto",
            }}
          >
            {/* Sidebar Header */}
            <div
              style={{
                padding: "1.5rem",
                borderBottom: "1px solid rgba(255, 255, 255, 0.02)",
                boxShadow: "var(--shape-flat)",
                display: "flex",
                alignItems: "center",
                justifyContent: sidebarCollapsed ? "center" : "space-between",
              }}
            >
              {!sidebarCollapsed && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.8rem",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    setCurrentPage(
                      userRole === "admin" ? "admin" : "dashboard",
                    )
                  }
                >
                  <img
                    src="/assets/logo2.png"
                    alt="Campus Aid Logo"
                    className="neo-inset"
                    style={{
                      width: "40px",
                      height: "40px",
                      padding: "2px",
                      borderRadius: "8px",
                    }}
                  />
                  <div>
                    <div className="neo-title" style={{ fontSize: "1.1rem" }}>
                      Campus Aid
                    </div>
                    <div style={{ color: "var(--neo-text-sec)", fontSize: "0.8rem" }}>
                      {userRole === "admin"
                        ? "⚙️ Administrator"
                        : `🎓 M.Sc. ${DEPT_NAMES[userDepartment] || "Student"}`}
                    </div>
                  </div>
                </div>
              )}
              <button
                className="neo-button"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                style={{ padding: "0.5rem", borderRadius: "10px" }}
              >
                {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
              </button>
            </div>

            {/* Navigation Menu */}
            <div style={{ padding: "1.5rem 1rem" }}>
              {navigationItems.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleNavigationClick(item)}
                    className={isActive ? "active-nav" : ""}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: sidebarCollapsed ? "1rem" : "0.8rem 1rem",
                      marginBottom: "0.5rem",
                      cursor: "pointer",
                      borderRadius: "12px",
                      background: isActive ? "linear-gradient(90deg, rgba(124, 58, 237, 0.15), rgba(6, 182, 212, 0.05))" : "transparent",
                      borderLeft: isActive ? "3px solid var(--neo-cyan)" : "3px solid transparent",
                      boxShadow: isActive ? "inset 20px 0 20px -20px rgba(6, 182, 212, 0.3)" : "none",
                      color: isActive ? "#fff" : "var(--neo-text-sec)",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      fontSize: sidebarCollapsed ? "1.2rem" : "1rem",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = "var(--neo-text)";
                        e.currentTarget.style.transform = "translateX(5px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = "var(--neo-text-sec)";
                        e.currentTarget.style.transform = "translateX(0)";
                      }
                    }}
                  >
                    <span
                      style={{
                        fontSize: "1.2rem",
                        marginRight: sidebarCollapsed ? "0" : "1rem",
                        filter: isActive ? "drop-shadow(0 0 5px var(--neo-accent-glow))" : "none"
                      }}
                    >
                      {item.icon}
                    </span>
                    {!sidebarCollapsed && (
                      <span
                        style={{
                          fontWeight: isActive ? "600" : "500",
                        }}
                      >
                        {item.label}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* User Section */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "1rem",
                background: "var(--neo-bg)",
                boxShadow: "0 -5px 20px var(--neo-shadow-dark)",
              }}
            >
              <div
                className={showDropdown ? "neo-inset" : ""}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.8rem",
                  padding: "0.8rem",
                  borderRadius: "12px",
                  cursor: "pointer",
                  background: showDropdown ? "rgba(255,255,255,0.05)" : "transparent",
                  transition: "background 0.3s",
                }}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div
                  className="neo-inset"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--neo-accent)",
                    fontSize: "1.2rem",
                  }}
                >
                  👤
                </div>
                {!sidebarCollapsed && (
                  <div>
                    <div style={{ color: "var(--neo-text)", fontWeight: "600", fontSize: "0.9rem" }}>
                      {userName}
                    </div>
                    <div style={{ color: "var(--neo-text-sec)", fontSize: "0.7rem" }}>
                      {userRole === "admin" ? "Administrator" : "Student"}
                    </div>
                  </div>
                )}
              </div>

              {!sidebarCollapsed && showDropdown && (
                <div
                  className="neo-inset"
                  style={{
                    marginTop: "0.8rem",
                    padding: "0.5rem",
                    borderRadius: "12px",
                  }}
                >
                  <div
                    onClick={() => {
                      setCurrentPage("changepassword");
                      setShowDropdown(false);
                    }}
                    style={{
                      padding: "0.8rem",
                      cursor: "pointer",
                      color: "var(--neo-text-sec)",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.8rem",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "var(--neo-text)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "var(--neo-text-sec)"; e.currentTarget.style.background = "transparent"; }}
                  >
                    <Key size={16} />
                    <span>Change Password</span>
                  </div>
                  <div
                    onClick={() => {
                      handleLogout();
                      setShowDropdown(false);
                    }}
                    style={{
                      padding: "0.8rem",
                      cursor: "pointer",
                      color: "var(--neo-danger)",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.8rem",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,71,87,0.1)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    <LogOut size={16} />
                    <span>Log out</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div
            style={{
              flex: 1,
              marginLeft: sidebarCollapsed ? "80px" : "280px",
              transition: "margin-left 0.3s ease",
              minHeight: "100vh",
              background: "transparent",
              position: "relative",
              zIndex: 1,
            }}
          >
            {isAuthenticated && currentPage === "dashboard" && (
              <Dashboard userName={userName} onNavigate={setCurrentPage} />
            )}
            {isAuthenticated && currentPage === "notes" && <Notes />}
            {isAuthenticated && currentPage === "quiz" && <Quiz />}
            {isAuthenticated && currentPage === "lostfound" && <LostFound />}
            {isAuthenticated && currentPage === "railway" && (
              <RailwayConcession />
            )}
            {isAuthenticated && currentPage === "chatbot" && <Chatbot />}
            {isAuthenticated && currentPage === "admin" && (
              <Admin initialTab={adminTab} />
            )}
            {isAuthenticated && currentPage === "profile" && <StudentProfile />}
            {isAuthenticated && currentPage === "issues" && (
              userRole === "admin" ? <Admin initialTab="issues" /> : <Issues />
            )}
            {isAuthenticated && currentPage === "changepassword" && (
              <ChangePassword onBack={() => setCurrentPage(
                userRole === "admin" ? "admin" : "dashboard"
              )} />
            )}
          </div>
        </div>
      )}

      {!isAuthenticated && currentPage === "login" && (
        <Login onLogin={handleLogin} onSwitchPage={setCurrentPage} />
      )}
      {!isAuthenticated && currentPage === "forgotpassword" && (
        <ForgotPassword onSwitchPage={setCurrentPage} />
      )}
      {!isAuthenticated && currentPage === "resetpassword" && (
        <ResetPassword onSwitchPage={setCurrentPage} />
      )}
    </>
  );
}
