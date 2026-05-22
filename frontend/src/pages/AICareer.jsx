import React, { useState, useEffect } from 'react';
import { Sparkles, Compass, CheckCircle2, ChevronRight, BookOpen, Landmark } from 'lucide-react';
import { API_BASE, useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const AICareer = () => {
  const { apiFetch } = useAuth();
  const [skills, setSkills] = useState('');
  const [interests, setInterests] = useState('');
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState(null);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!skills.trim() || !interests.trim()) {
      setToast({ message: 'Please input both your current skills and career interests.', type: 'error' });
      return;
    }

    setLoading(true);
    setAdvice(null);

    try {
      const res = await apiFetch('/ai/career', {
        method: 'POST',
        body: JSON.stringify({ skills, interests }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to generate recommendations.');
      }

      setAdvice(data);
      setToast({ message: 'Career pathways recommendation generated!', type: 'success' });
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Track page view
    fetch(`${API_BASE}/analytics/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: '/ai-career', referrer: document.referrer || 'Direct' }),
    }).catch(() => {});
  }, []);

  return (
    <div className="container section">
      <h2 className="section-title">AI Career Advisor</h2>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.5fr',
        gap: '32px',
      }} className="career-grid">
        
        {/* Left: Input Form */}
        <div className="glass-panel" style={{ padding: '28px', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={20} style={{ color: 'var(--accent)' }} /> Career Advisor
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Tell our AI about your technical background and career aspiration to compute targeted job matches, learning timelines, and certificate paths.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Current Skills</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="e.g. React.js, Python, CSS, SQL, data structures"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Career Interests & Roles</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="e.g. Machine Learning Engineer, Cloud Architect, SaaS Product Developer"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {loading ? 'Consulting Advisor AI...' : 'Generate Roadmap'}
            </button>
          </form>
        </div>

        {/* Right: Advice & Roadmap Dashboard */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="skeleton" style={{ height: '40px', width: '40%' }} />
              <div className="skeleton" style={{ height: '100px', width: '100%' }} />
              <div className="skeleton" style={{ height: '40px', width: '30%' }} />
              <div className="skeleton" style={{ height: '150px', width: '100%' }} />
            </div>
          ) : advice ? (
            <div>
              {/* Match Roles */}
              <h3 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>Target Career Match</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                {advice.careerPaths?.map((path, idx) => (
                  <div key={idx} className="glass-card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>{path.title}</h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{path.reason}</p>
                    </div>
                    <div style={{
                      backgroundColor: 'var(--accent-glow)',
                      color: 'var(--accent)',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontWeight: 'bold',
                      fontSize: '0.9rem'
                    }}>{path.match} Match</div>
                  </div>
                ))}
              </div>

              {/* Technologies to learn */}
              <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>Technologies to Master</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
                {advice.technologiesToLearn?.map((tech, idx) => (
                  <span key={idx} style={{
                    fontSize: '0.85rem',
                    padding: '6px 12px',
                    backgroundColor: 'rgba(6, 182, 212, 0.1)',
                    color: 'var(--accent-secondary)',
                    border: '1px solid rgba(6, 182, 212, 0.2)',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <BookOpen size={14} /> {tech}
                  </span>
                ))}
              </div>

              {/* Recommended Certifications */}
              <h3 style={{ fontSize: '1.4rem', marginBottom: '16px' }}>Target Certifications</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
                {advice.certifications?.map((cert, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--text-secondary)' }}>
                    <Landmark size={16} style={{ color: 'var(--accent)' }} />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>

              {/* Roadmap stages */}
              <h3 style={{ fontSize: '1.4rem', marginBottom: '20px' }}>Your Personalized Roadmap</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {advice.roadmap?.map((phase, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    gap: '16px',
                    position: 'relative',
                    paddingBottom: idx === advice.roadmap.length - 1 ? 0 : '20px',
                  }}>
                    {/* Visual Connector dot */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                    }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--accent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>{idx + 1}</div>
                      {idx !== advice.roadmap.length - 1 && (
                        <div style={{
                          width: '2px',
                          flexGrow: 1,
                          backgroundColor: 'var(--glass-border)',
                          marginTop: '6px'
                        }} />
                      )}
                    </div>

                    <div style={{ flex: 1, marginTop: '-2px' }}>
                      <h4 style={{ fontSize: '1.1rem', marginBottom: '8px', color: 'var(--accent-secondary)' }}>{phase.phase}</h4>
                      <ul style={{
                        color: 'var(--text-secondary)',
                        paddingLeft: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        fontSize: '0.95rem'
                      }}>
                        {phase.items?.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: 'var(--text-muted)', textAlign: 'center' }}>
              <Compass size={64} style={{ marginBottom: '12px' }} />
              <p>Enter your profile skills and career goals to view custom recommendations and timeline roadmaps.</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .career-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AICareer;
