import React, { useState, useEffect } from 'react';
import { Terminal, Send, Award, AwardIcon, Sparkles, BookOpen } from 'lucide-react';
import { API_BASE, useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const AIInterview = () => {
  const { apiFetch } = useAuth();
  
  // Selection states
  const [type, setType] = useState('technical');
  const [category, setCategory] = useState('React.js');
  
  // Q&A states
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [loadingEvaluation, setLoadingEvaluation] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  
  const [toast, setToast] = useState(null);

  const fetchQuestion = async () => {
    setLoadingQuestion(true);
    setQuestion(null);
    setAnswer('');
    setEvaluation(null);

    try {
      const res = await apiFetch('/ai/interview/question', {
        method: 'POST',
        body: JSON.stringify({ type, category }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch question.');
      }

      setQuestion(data.question);
      setToast({ message: 'Interview question generated!', type: 'success' });
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setLoadingQuestion(false);
    }
  };

  const handleEvaluate = async (e) => {
    e.preventDefault();
    if (!answer.trim()) {
      setToast({ message: 'Please type an answer before submitting.', type: 'error' });
      return;
    }

    setLoadingEvaluation(true);
    setEvaluation(null);

    try {
      const res = await apiFetch('/ai/interview/grade', {
        method: 'POST',
        body: JSON.stringify({ question, answer }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Evaluation failed.');
      }

      setEvaluation(data);
      setToast({ message: 'Answer grading complete!', type: 'success' });
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setLoadingEvaluation(false);
    }
  };

  useEffect(() => {
    // Track page view
    fetch(`${API_BASE}/analytics/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: '/ai-interview', referrer: document.referrer || 'Direct' }),
    }).catch(() => {});
  }, []);

  return (
    <div className="container section">
      <h2 className="section-title">AI Interview Assistant</h2>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.5fr',
        gap: '32px',
      }} className="interview-grid">
        
        {/* Left pane: configuration controls */}
        <div className="glass-panel" style={{ padding: '28px', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={20} style={{ color: 'var(--accent)' }} /> Mock Simulation
          </h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Configure target category and role focus, click generate question to prompt the interview assistant, then type your explanation response.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
            <div className="form-group">
              <label className="form-label">Interview Type</label>
              <select
                className="form-control"
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={{ backgroundColor: 'var(--bg-secondary)', cursor: 'pointer' }}
              >
                <option value="technical">Technical</option>
                <option value="behavioral">Behavioral</option>
                <option value="hr">HR</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Target Topic / Category</label>
              <select
                className="form-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ backgroundColor: 'var(--bg-secondary)', cursor: 'pointer' }}
              >
                <option value="React.js">React.js</option>
                <option value="Node.js & Express">Node.js & Express</option>
                <option value="Databases (SQL & NoSQL)">Databases (SQL & NoSQL)</option>
                <option value="System Design">System Design</option>
                <option value="General Professionalism">General Professionalism</option>
              </select>
            </div>
          </div>

          <button
            onClick={fetchQuestion}
            className="btn btn-primary"
            disabled={loadingQuestion}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {loadingQuestion ? 'Generating...' : 'Start / Next Question'}
          </button>
        </div>

        {/* Right pane: Q&A panel & grading logs */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          
          {loadingQuestion ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="skeleton" style={{ height: '30px', width: '20%' }} />
              <div className="skeleton" style={{ height: '80px', width: '100%' }} />
            </div>
          ) : question ? (
            <div>
              <div style={{
                padding: '20px',
                borderRadius: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--glass-border)',
                marginBottom: '24px'
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase' }}>
                  {type} Question &bull; {category}
                </span>
                <p style={{ fontSize: '1.25rem', fontWeight: 500, marginTop: '8px', lineHeight: '1.6' }}>{question}</p>
              </div>

              {/* Input Answer */}
              {!evaluation && (
                <form onSubmit={handleEvaluate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Your Response</label>
                    <textarea
                      className="form-control"
                      rows="6"
                      placeholder="Type your explanation answer here..."
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loadingEvaluation}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    {loadingEvaluation ? 'Evaluating Response...' : 'Submit Answer'}
                  </button>
                </form>
              )}

              {/* Evaluation logs */}
              {loadingEvaluation && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
                  <div className="skeleton" style={{ height: '50px', width: '40%' }} />
                  <div className="skeleton" style={{ height: '120px', width: '100%' }} />
                </div>
              )}

              {evaluation && (
                <div style={{ marginTop: '12px' }}>
                  {/* Score badge header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      border: '5px solid var(--glass-border)',
                      borderTopColor: evaluation.score >= 80 ? 'var(--success)' : evaluation.score >= 60 ? 'var(--warning)' : 'var(--danger)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.35rem',
                      fontWeight: 'bold',
                      fontFamily: 'Outfit',
                      transform: 'rotate(-45deg)',
                      flexShrink: 0
                    }}>
                      <span style={{ transform: 'rotate(45deg)' }}>{evaluation.score}%</span>
                    </div>

                    <div>
                      <h3 style={{ fontSize: '1.25rem' }}>AI Review Completed</h3>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Grades generated based on relevance & correctness</span>
                    </div>
                  </div>

                  {/* Feedback */}
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Recruiter Feedback</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '20px' }}>
                    {evaluation.feedback}
                  </p>

                  {/* Improvements list */}
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>Actionable Improvements</h4>
                  <ul style={{
                    color: 'var(--text-secondary)',
                    paddingLeft: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    fontSize: '0.95rem',
                    marginBottom: '28px'
                  }}>
                    {evaluation.improvements?.map((imp, idx) => (
                      <li key={idx}>{imp}</li>
                    ))}
                  </ul>

                  <button onClick={fetchQuestion} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                    Practice Next Question
                  </button>
                </div>
              )}

            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: 'var(--text-muted)', textAlign: 'center' }}>
              <BookOpen size={64} style={{ marginBottom: '12px' }} />
              <p>Configure parameters on the left side, then click Start to generate your mock interview query.</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .interview-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AIInterview;
