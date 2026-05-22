import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Github, Linkedin } from '../components/BrandIcons';
import { API_BASE } from '../context/AuthContext';
import Toast from '../components/Toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, subject, message } = formData;

    if (!name || !email || !subject || !message) {
      setToast({ message: 'Please fill in all details.', type: 'error' });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Submission failed.');
      }

      setToast({ message: 'Your message has been successfully sent!', type: 'success' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Track contact page visit
    fetch(`${API_BASE}/analytics/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: '/contact', referrer: document.referrer || 'Direct' }),
    }).catch(() => {});
  }, []);

  return (
    <div className="container section">
      <h2 className="section-title">Get In Touch</h2>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 2fr',
        gap: '40px',
      }} className="contact-grid">
        
        {/* Left: Contact Info */}
        <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>Contact Information</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
              Feel free to send a message. I am open to discussing software architecture collaborations, full-time development positions, or AI integration ideas.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', color: 'var(--text-secondary)' }}>
              <Mail size={20} style={{ color: 'var(--accent)' }} />
              <span>shivanandsharma7322@gmail.com</span>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', color: 'var(--text-secondary)' }}>
              <Phone size={20} style={{ color: 'var(--accent)' }} />
              <span>+91 87563 15251</span>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', color: 'var(--text-secondary)' }}>
              <MapPin size={20} style={{ color: 'var(--accent)' }} />
              <span>Prayagraj, UP, India</span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '24px' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>Social Profiles</h4>
            <div style={{ display: 'flex', gap: '16px' }}>
              <a href="https://github.com/Coding-shiva" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '10px' }}>
                <Github size={18} />
              </a>
              <a href="https://linkedin.com/in/shivanand-sharma" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: '10px' }}>
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Right: Message Form */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Send a Message</h3>
          
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px'
            }} className="form-row">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Subject</label>
              <input
                type="text"
                name="subject"
                className="form-control"
                placeholder="Subject of message"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea
                name="message"
                className="form-control"
                rows="6"
                placeholder="Type your message details here..."
                value={formData.message}
                onChange={handleChange}
                required
                style={{ resize: 'vertical' }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {loading ? 'Sending Message...' : 'Send Message'} <Send size={16} />
            </button>
          </form>
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
          .form-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Contact;
