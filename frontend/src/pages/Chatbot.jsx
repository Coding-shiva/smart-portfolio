import React, { useState, useEffect, useRef } from 'react';
import { Send, Cpu, User, HelpCircle, MessageSquare } from 'lucide-react';
import { API_BASE, useAuth } from '../context/AuthContext';

const Chatbot = () => {
  const { apiFetch } = useAuth();
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am Gemini, trained on this developer\'s resume, skills, and portfolio database. Ask me anything about his qualifications, projects, or background!',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Suggestions lists
  const suggestions = [
    'Who is this developer?',
    'What projects has he built?',
    'What technologies does he know?',
    'What is his education background?',
  ];

  const handleSend = async (textToSend) => {
    const messageText = textToSend || input;
    if (!messageText.trim() || loading) return;

    // Add user message
    const userMessage = { sender: 'user', text: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Prepare conversation history (exclude initial greet)
    const history = messages
      .slice(1)
      .map((msg) => ({
        sender: msg.sender,
        text: msg.text,
      }));

    try {
      const res = await apiFetch('/ai/chatbot', {
        method: 'POST',
        body: JSON.stringify({ message: messageText, history }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'API error.');
      }

      setMessages((prev) => [...prev, { sender: 'bot', text: data.response }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'I apologize, but I am facing connectivity issues. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Scroll to bottom
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    // Track chatbot page visit
    fetch(`${API_BASE}/analytics/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: '/chatbot', referrer: document.referrer || 'Direct' }),
    }).catch(() => {});
  }, []);

  return (
    <div className="container section" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
      <h2 className="section-title" style={{ marginBottom: '24px' }}>AI Portfolio Assistant</h2>

      <div className="glass-panel" style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1.2fr 3fr',
        borderRadius: '16px',
        overflow: 'hidden',
      }} className="chat-layout">
        
        {/* Left Side: Suggestions Panel */}
        <div style={{
          padding: '24px',
          borderRight: '1px solid var(--glass-border)',
          backgroundColor: 'rgba(255, 255, 255, 0.01)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }} className="chat-sidebar">
          <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <HelpCircle size={18} style={{ color: 'var(--accent)' }} /> Suggested Prompts
          </h3>
          {suggestions.map((sug, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sug)}
              className="btn btn-secondary"
              disabled={loading}
              style={{
                fontSize: '0.85rem',
                textAlign: 'left',
                padding: '10px 14px',
                borderRadius: '8px',
                width: '100%',
                justifyContent: 'flex-start',
                cursor: 'pointer'
              }}
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Right Side: Messages Log & Input Form */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Messages list */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            maxHeight: '450px',
          }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  gap: '10px',
                  alignItems: 'flex-start',
                }}
              >
                {msg.sender === 'bot' && (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-glow)',
                    color: 'var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Cpu size={16} />
                  </div>
                )}

                <div style={{
                  maxWidth: '75%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  lineHeight: '1.5',
                  backgroundColor: msg.sender === 'user' ? 'var(--accent)' : 'var(--bg-secondary)',
                  color: msg.sender === 'user' ? '#ffffff' : 'var(--text-primary)',
                  border: msg.sender === 'user' ? 'none' : '1px solid var(--glass-border)',
                  borderTopRightRadius: msg.sender === 'user' ? '2px' : '12px',
                  borderTopLeftRadius: msg.sender === 'bot' ? '2px' : '12px',
                  whiteSpace: 'pre-line',
                }}>
                  {msg.text}
                </div>

                {msg.sender === 'user' && (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-tertiary)',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <User size={16} />
                  </div>
                )}
              </div>
            ))}
            
            {/* Loading typing bubble */}
            {loading && (
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--accent-glow)',
                  color: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Cpu size={16} />
                </div>
                <div style={{
                  display: 'flex',
                  gap: '4px',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--glass-border)',
                }}>
                  <div className="skeleton" style={{ width: '8px', height: '8px', borderRadius: '50%' }} />
                  <div className="skeleton" style={{ width: '8px', height: '8px', borderRadius: '50%' }} />
                  <div className="skeleton" style={{ width: '8px', height: '8px', borderRadius: '50%' }} />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Form input bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            style={{
              padding: '16px 24px',
              borderTop: '1px solid var(--glass-border)',
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              className="form-control"
              placeholder="Ask me a question about Shiva..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              style={{ flex: 1 }}
            />
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || !input.trim()}
              style={{ padding: '12px', borderRadius: '8px' }}
            >
              <Send size={18} />
            </button>
          </form>
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .chat-layout {
            grid-template-columns: 1fr !important;
          }
          .chat-sidebar {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
