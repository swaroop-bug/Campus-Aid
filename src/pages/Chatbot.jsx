import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, MessageSquare, Info, ShieldAlert } from 'lucide-react';
import api from '../services/api';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      content: 'Hello! I am **CampusAid Assistant**, your dedicated guide for S.S. & B.A.S. College. How can I help you today?',
      details: [
        'MSc Admissions & Eligibility',
        'Fees & Scholarship Policies',
        'Hostel & Campus Facilities',
        'CampusAid Platform Support'
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await api.chatbot.sendMessage(userMessage);
      
      // Parse the response into the structured format
      // Expected format: Direct answer \n Bullet points \n Optional suggestion
      const botReply = response.reply || "I'm sorry, I couldn't process that.";
      
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: botReply 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: "I'm having trouble reaching my brain right now. Please try again later!" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const QuickQuestion = ({ text }) => (
    <button
      onClick={() => {
        setInput(text);
      }}
      className="neo-button"
      style={{
        padding: '0.6rem 1rem',
        fontSize: '0.85rem',
        borderRadius: '20px',
        whiteSpace: 'nowrap',
        color: 'var(--neo-cyan)',
        border: '1px solid rgba(6, 182, 212, 0.2)'
      }}
    >
      {text}
    </button>
  );

  return (
    <div className="fade-in" style={{ 
      padding: '2rem', 
      height: 'calc(100vh - 40px)', 
      display: 'flex', 
      flexDirection: 'column',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div className="neo-container" style={{ 
        padding: '1.5rem', 
        marginBottom: '1.5rem', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        background: 'rgba(17, 24, 39, 0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="neo-inset" style={{ 
            width: '50px', 
            height: '50px', 
            borderRadius: '15px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'var(--neo-accent)'
          }}>
            <Bot size={28} />
          </div>
          <div>
            <h2 className="neo-title" style={{ margin: 0, fontSize: '1.5rem' }}>CampusAid Assistant</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--neo-success)' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'currentColor' }}></span>
              AI Knowledge Base Online (AY 2026-27)
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="neo-button" style={{ padding: '0.5rem', borderRadius: '10px' }} title="Help">
            <Info size={20} />
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="neo-inset" style={{ 
        flex: 1, 
        marginBottom: '1.5rem', 
        borderRadius: '20px', 
        padding: '1.5rem',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        background: 'rgba(10, 15, 30, 0.3)'
      }}>
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            style={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
              width: '100%'
            }}
          >
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              maxWidth: '80%',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
            }}>
              <div className="neo-outset" style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '12px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0,
                background: msg.role === 'user' ? 'var(--neo-cyan-glow)' : 'rgba(255,255,255,0.05)',
                color: msg.role === 'user' ? '#fff' : 'var(--neo-accent)'
              }}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div 
                className="neo-container"
                style={{ 
                  padding: '1.2rem', 
                  borderRadius: msg.role === 'user' ? '20px 5px 20px 20px' : '5px 20px 20px 20px',
                  background: msg.role === 'user' ? 'rgba(6, 182, 212, 0.1)' : 'rgba(17, 24, 39, 0.6)',
                  borderLeft: msg.role === 'bot' ? '3px solid var(--neo-accent)' : 'none',
                  borderRight: msg.role === 'user' ? '3px solid var(--neo-cyan)' : 'none'
                }}
              >
                <div style={{ 
                  color: 'var(--neo-text)', 
                  whiteSpace: 'pre-wrap',
                  lineHeight: '1.6',
                  fontSize: '1rem'
                }}>
                  {msg.content}
                </div>
                {msg.details && (
                  <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {msg.details.map((d, i) => (
                      <span key={i} style={{ 
                        padding: '0.3rem 0.8rem', 
                        background: 'rgba(255,255,255,0.05)', 
                        borderRadius: '10px', 
                        fontSize: '0.75rem',
                        color: 'var(--neo-text-sec)',
                        border: '1px solid rgba(255,255,255,0.05)'
                      }}>
                        {d}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="neo-outset" style={{ width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={20} className="spin-slow" />
            </div>
            <div className="neo-container" style={{ padding: '1rem 1.5rem', borderRadius: '5px 20px 20px 20px' }}>
              <div className="loading-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="neo-container" style={{ padding: '1rem', background: 'rgba(17, 24, 39, 0.4)' }}>
        <div style={{ display: 'flex', gap: '0.8rem', overflowX: 'auto', paddingBottom: '1rem', scrollbarWidth: 'none' }}>
          <QuickQuestion text="MSc Data Science fees?" />
          <QuickQuestion text="Admission process?" />
          <QuickQuestion text="Hostel facilities?" />
          <QuickQuestion text="Refund policy?" />
          <QuickQuestion text="Required documents?" />
        </div>
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '1rem' }}>
          <div className="neo-inset" style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 1.5rem', borderRadius: '15px' }}>
            <MessageSquare size={20} style={{ color: 'var(--neo-text-sec)', marginRight: '1rem' }} />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about admissions, fees, hostel..."
              style={{
                width: '100%',
                background: 'none',
                border: 'none',
                color: 'white',
                padding: '1.2rem 0',
                outline: 'none',
                fontSize: '1rem'
              }}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="neo-button"
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: input.trim() ? 'var(--neo-cyan-glow)' : 'transparent',
              color: input.trim() ? '#fff' : 'var(--neo-text-sec)',
              transition: 'all 0.3s'
            }}
          >
            <Send size={24} />
          </button>
        </form>
      </div>

      {/* Scope Warning */}
      <div style={{ 
        marginTop: '1rem', 
        textAlign: 'center', 
        fontSize: '0.75rem', 
        color: 'var(--neo-text-sec)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem'
      }}>
        <ShieldAlert size={14} />
        CampusAid Assistant specializes in college-related queries only.
      </div>
    </div>
  );
}
