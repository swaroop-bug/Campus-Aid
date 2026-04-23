
import { useState } from "react";
import Login from "./pages/Login";
// registration has been removed; Register component is no longer used
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
import { Brain, Search, MessageCircle, LogOut, Key, Menu, X } from 'lucide-react';

import './styles.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Temporarily set to false
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole") || "student");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogin = (token, name, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userName", name);
    localStorage.setItem("userRole", role);
    setIsAuthenticated(true);
    setUserName(name);
    setUserRole(role);
    setCurrentPage("dashboard");
  };

  const handleNavigationClick = (item) => {
    item.action();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    setIsAuthenticated(false);
    setUserName("");
    setUserRole("student");
    setCurrentPage("login");
  };

  const baseNavigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '🏠',
      action: () => setCurrentPage("dashboard")
    },
    {
      id: 'quiz',
      label: 'Quiz',
      icon: '✏️',
      action: () => setCurrentPage("quiz")
    },
    {
      id: 'lostfound',
      label: 'Lost & Found',
      icon: '🔍',
      action: () => setCurrentPage("lostfound")
    },
    {
      id: 'chatbot',
      label: 'AI Chatbot',
      icon: '🤖',
      action: () => setCurrentPage("chatbot")
    },

    {
      id: 'profile',
      label: 'My Profile',
      icon: '👤',
      action: () => setCurrentPage("profile")
    }
  ];

  const navigationItems = userRole === 'admin' 
    ? [
        ...baseNavigationItems.slice(0, 4),
        {
          id: 'admin',
          label: 'Admin Panel',
          icon: '⚙️',
          action: () => setCurrentPage("admin")
        },
        ...baseNavigationItems.slice(4)
      ]
    : baseNavigationItems;

  const quickActions = [
    {
      icon: Brain,
      title: 'Take Quiz',
      description: 'Test your knowledge',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      action: () => setCurrentPage('quiz')
    },
    {
      icon: Search,
      title: 'Lost Items',
      description: 'Find lost items',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      action: () => setCurrentPage('lostfound')
    },
    {
      icon: MessageCircle,
      title: 'AI Assistant',
      description: 'Get instant help',
      color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      action: () => setCurrentPage('chatbot')
    }

  ];

  return (
    <>
      {isAuthenticated && (
        <div style={{
          display: 'flex',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f1419 0%, #1a1f35 100%)'
        }}>
          {/* Sidebar */}
          <div style={{
            width: sidebarCollapsed ? '80px' : '280px',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'width 0.3s ease',
            position: 'fixed',
            height: '100vh',
            left: 0,
            top: 0,
            zIndex: 1000,
            overflowY: 'auto'
          }}>
            {/* Sidebar Header */}
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarCollapsed ? 'center' : 'space-between'
            }}>
              {!sidebarCollapsed && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  cursor: 'pointer'
                }} onClick={() => setCurrentPage("dashboard")}>
                  <img
                    src="/assets/logo2.png"
                    alt="Campus Aid Logo"
                    style={{ width: '40px', height: '40px', borderRadius: '8px' }}
                  />
                  <div>
                    <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1.1rem' }}>
                      Campus Aid
                    </div>
                    <div style={{ color: '#b0c4de', fontSize: '0.8rem' }}>
                      M.Sc. Program
                    </div>
                  </div>
                </div>
              )}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
              </button>
            </div>

            {/* Navigation Menu */}
            <div style={{ padding: '1rem 0' }}>
              {navigationItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNavigationClick(item)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: sidebarCollapsed ? '1rem' : '1rem 1.5rem',
                    cursor: 'pointer',
                    color: currentPage === item.id ? '#667eea' : '#b0c4de',
                    background: currentPage === item.id ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                    borderRight: currentPage === item.id ? '3px solid #667eea' : '3px solid transparent',
                    transition: 'all 0.2s',
                    fontSize: sidebarCollapsed ? '1.2rem' : '1rem'
                  }}
                  onMouseEnter={(e) => {
                    if (currentPage !== item.id) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== item.id) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  <span style={{ fontSize: '1.2rem', marginRight: sidebarCollapsed ? '0' : '1rem' }}>
                    {item.icon}
                  </span>
                  {!sidebarCollapsed && (
                    <span style={{ fontWeight: currentPage === item.id ? '600' : '400' }}>
                      {item.label}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            {!sidebarCollapsed && (
              <div style={{
                padding: '1rem 1.5rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                marginTop: '1rem'
              }}>
                <div style={{
                  color: '#b0c4de',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  marginBottom: '1rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Quick Actions
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {quickActions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                      <div
                        key={index}
                        onClick={action.action}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0.8rem 1rem',
                          background: action.color,
                          borderRadius: '10px',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
                        }}
                      >
                        <Icon size={18} color="white" style={{ marginRight: '0.8rem' }} />
                        <div>
                          <div style={{
                            color: 'white',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            marginBottom: '0.1rem'
                          }}>
                            {action.title}
                          </div>
                          <div style={{
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '0.7rem'
                          }}>
                            {action.description}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* User Section */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '1rem 1.5rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(0, 0, 0, 0.2)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                marginBottom: '1rem',
                cursor: 'pointer'
              }} onClick={() => setShowDropdown(!showDropdown)}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.2rem'
                }}>
                  👤
                </div>
                {!sidebarCollapsed && (
                  <div>
                    <div style={{ color: 'white', fontWeight: '600', fontSize: '0.9rem' }}>
                      {userName}
                    </div>
                    <div style={{ color: '#b0c4de', fontSize: '0.7rem' }}>
                      M.Sc. Student
                    </div>
                  </div>
                )}
                {!sidebarCollapsed && (
                  <span style={{ color: '#b0c4de', marginLeft: 'auto' }}>
                    {showDropdown ? '▲' : '▼'}
                  </span>
                )}
              </div>

              {!sidebarCollapsed && showDropdown && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  marginTop: '0.5rem'
                }}>
                  <div
                    onClick={() => {
                      setCurrentPage('changepassword');
                      setShowDropdown(false);
                    }}
                    style={{
                      padding: '0.8rem 1rem',
                      cursor: 'pointer',
                      color: '#b0c4de',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      transition: 'background 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.8rem'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
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
                      padding: '0.8rem 1rem',
                      cursor: 'pointer',
                      color: '#e74c3c',
                      transition: 'background 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.8rem'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <LogOut size={16} />
                    <span>Log out</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div style={{
            flex: 1,
            marginLeft: sidebarCollapsed ? '80px' : '280px',
            transition: 'margin-left 0.3s ease',
            minHeight: '100vh'
          }}>
            {isAuthenticated && currentPage === "dashboard" && (
              <Dashboard userName={userName} onNavigate={setCurrentPage} />
            )}
            {isAuthenticated && currentPage === "notes" && <Notes />}
            {isAuthenticated && currentPage === "quiz" && <Quiz />}
            {isAuthenticated && currentPage === "lostfound" && <LostFound />}
            {isAuthenticated && currentPage === "chatbot" && <Chatbot onNavigate={setCurrentPage} />}

            {isAuthenticated && currentPage === "admin" && <Admin />}
            {isAuthenticated && currentPage === "profile" && <StudentProfile />}
            {isAuthenticated && currentPage === "changepassword" && (
              <ChangePassword onBack={() => setCurrentPage("dashboard")} />
            )}
          </div>
        </div>
      )}

      {!isAuthenticated && currentPage === "login" && (
        <Login onLogin={handleLogin} onSwitchPage={setCurrentPage} />
      )}
      {/* registration screen disabled; component removed */}
      {!isAuthenticated && currentPage === "forgotpassword" && (
        <ForgotPassword onSwitchPage={setCurrentPage} />
      )}
      {!isAuthenticated && currentPage === "resetpassword" && (
        <ResetPassword onSwitchPage={setCurrentPage} />
      )}
    </>
  );
}
