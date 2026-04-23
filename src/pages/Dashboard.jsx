import React from 'react';
import { BookOpen, Brain, Search, MessageCircle, Trophy, Users, Calendar, Award } from 'lucide-react';

export default function Dashboard({ userName, onNavigate }) {
  const stats = [
    {
      label: 'Program',
      value: 'M.Sc. (PG)',
      emoji: '🎓',
      description: 'Master of Science Program'
    },
    {
      label: 'Study Resources',
      value: '5+ Years PYQS',
      emoji: '📖',
      description: 'Previous Year Question Papers'
    },
    {
      label: 'Active Users',
      value: '150+',
      emoji: '👥',
      description: 'Students using Campus Aid'
    },
    {
      label: 'AI Responses',
      value: '10K+',
      emoji: '🤖',
      description: 'Questions answered by AI'
    },

  ];

  const recentActivities = [
    {
      icon: MessageCircle,
      title: 'AI Chatbot Query',
      description: 'Asked about admission process',
      time: '2 hours ago',
      color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    },
    {
      icon: Brain,
      title: 'Quiz Completed',
      description: 'Scored 85% in Data Structures',
      time: '1 day ago',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      icon: Search,
      title: 'Lost Item Found',
      description: 'Calculator returned via Lost & Found',
      time: '3 days ago',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    }
  ];

  const announcements = [
    {
      title: 'Semester Registration Open',
      description: 'Register for upcoming semester courses',
      priority: 'high',
      date: 'Dec 15, 2024'
    },
    {
      title: 'New Study Materials Added',
      description: 'Latest PYQs and notes uploaded',
      priority: 'medium',
      date: 'Dec 10, 2024'
    },
    {
      title: 'AI Chatbot Enhanced',
      description: 'Improved responses and new features',
      priority: 'low',
      date: 'Dec 8, 2024'
    },

  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f1419 0%, #1a1f35 100%)',
      padding: '2rem',
      overflowY: 'auto'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* Welcome Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem',
          animation: 'fadeIn 0.8s ease-in'
        }}>
          <h1 style={{
            fontSize: '3.5rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem',
            fontWeight: 'bold'
          }}>
            Welcome back, {userName}! 👋
          </h1>
          <p style={{
            color: '#b0c4de',
            fontSize: '1.3rem',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Your comprehensive academic companion for M.Sc. studies.
            Access resources, take quizzes, and get instant help from our AI assistant.
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem'
        }}>
          {stats.map((stat, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                padding: '2rem',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                textAlign: 'center',
                transition: 'transform 0.3s, box-shadow 0.3s',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                position: 'absolute',
                top: '-30px',
                right: '-30px',
                fontSize: '6rem',
                opacity: 0.1,
                transform: 'rotate(15deg)'
              }}>
                {stat.emoji}
              </div>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{stat.emoji}</div>
              <div style={{ color: '#b0c4de', fontSize: '1rem', marginBottom: '0.5rem', fontWeight: '500' }}>
                {stat.label}
              </div>
              <div style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {stat.value}
              </div>
              <div style={{ color: '#888', fontSize: '0.9rem' }}>
                {stat.description}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '2rem',
          marginBottom: '3rem'
        }}>

          {/* Recent Activities */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            padding: '2rem',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '15px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Trophy size={24} color="white" />
              </div>
              <div>
                <h3 style={{ color: 'white', margin: '0', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  Recent Activities
                </h3>
                <p style={{ color: '#b0c4de', margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>
                  Your latest interactions with Campus Aid
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {recentActivities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1.5rem',
                      background: activity.color,
                      borderRadius: '15px',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
                    }}
                  >
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backdropFilter: 'blur(10px)'
                    }}>
                      <Icon size={24} color="white" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        color: 'white',
                        fontSize: '1rem',
                        fontWeight: '600',
                        marginBottom: '0.3rem'
                      }}>
                        {activity.title}
                      </div>
                      <div style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '0.9rem',
                        marginBottom: '0.3rem'
                      }}>
                        {activity.description}
                      </div>
                      <div style={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '0.8rem'
                      }}>
                        {activity.time}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Announcements */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            padding: '2rem',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '15px',
                background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Calendar size={24} color="white" />
              </div>
              <div>
                <h3 style={{ color: 'white', margin: '0', fontSize: '1.5rem', fontWeight: 'bold' }}>
                  Announcements
                </h3>
                <p style={{ color: '#b0c4de', margin: '0.2rem 0 0 0', fontSize: '0.9rem' }}>
                  Important updates & notices
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {announcements.map((announcement, index) => (
                <div
                  key={index}
                  style={{
                    padding: '1.2rem',
                    background: announcement.priority === 'high'
                      ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)'
                      : announcement.priority === 'medium'
                      ? 'linear-gradient(135deg, #ffa726 0%, #fb8c00 100%)'
                      : 'linear-gradient(135deg, #66bb6a 0%, #43a047 100%)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    border: `2px solid ${announcement.priority === 'high' ? '#ff4444' : announcement.priority === 'medium' ? '#ff9800' : '#4caf50'}`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: '600',
                    marginBottom: '0.3rem'
                  }}>
                    {announcement.title}
                  </div>
                  <div style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '0.85rem',
                    marginBottom: '0.5rem'
                  }}>
                    {announcement.description}
                  </div>
                  <div style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <Calendar size={14} />
                    {announcement.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Tips Section */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '3rem 2rem',
          borderRadius: '20px',
          textAlign: 'center',
          boxShadow: '0 15px 35px rgba(102, 126, 234, 0.3)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <Award size={40} color="white" />
            <h2 style={{
              color: 'white',
              margin: '0',
              fontSize: '2.5rem',
              fontWeight: 'bold'
            }}>
              Pro Tips for Success
            </h2>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginTop: '2rem'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '1.5rem',
              borderRadius: '15px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎯</div>
              <h4 style={{ color: 'white', margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>
                Use AI Chatbot
              </h4>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)', margin: '0', fontSize: '0.9rem' }}>
                Get instant answers to your academic questions 24/7
              </p>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '1.5rem',
              borderRadius: '15px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📚</div>
              <h4 style={{ color: 'white', margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>
                Study Resources
              </h4>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)', margin: '0', fontSize: '0.9rem' }}>
                Access 5+ years of PYQs and comprehensive study materials
              </p>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '1.5rem',
              borderRadius: '15px',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🧠</div>
              <h4 style={{ color: 'white', margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>
                Practice Quizzes
              </h4>
              <p style={{ color: 'rgba(255, 255, 255, 0.9)', margin: '0', fontSize: '0.9rem' }}>
                Test your knowledge with AI-generated quizzes and track progress
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}