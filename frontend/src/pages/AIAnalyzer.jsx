import React, { useState, useEffect } from 'react';
import { Upload, Download, Sparkles, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import { API_BASE, useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const AIAnalyzer = () => {
  const { isAdmin, apiFetch } = useAuth();
  const [activeResume, setActiveResume] = useState(null);
  
  // Public audit states
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // 1. Fetch active portfolio resume details
    const fetchActiveResume = async () => {
      try {
        const res = await fetch(`${API_BASE}/resume/active`);
        if (res.ok) {
          const data = await res.json();
          setActiveResume(data);
        }
      } catch (err) {
        console.error('Error fetching active resume:', err);
      }
    };
    fetchActiveResume();

    // 2. Track page view
    fetch(`${API_BASE}/analytics/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: '/resume-analyzer', referrer: document.referrer || 'Direct' }),
    }).catch(() => {});
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type !== 'application/pdf') {
        setToast({ message: 'Only PDF documents are supported!', type: 'error' });
        return;
      }
      setFile(selected);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      // If admin is logged in, upload/save to database. Otherwise, analyze publicly
      const endpoint = isAdmin ? '/resume/upload' : '/resume/analyze';
      const fetchOpts = isAdmin 
        ? { method: 'POST', body: formData }
        : { method: 'POST', body: formData }; // apiFetch handles Auth headers if present

      const res = await apiFetch(endpoint, fetchOpts);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Analysis failed. Make sure the file is valid.');
      }

      setAnalysisResult(data.analysis || data);
      
      if (isAdmin) {
        setActiveResume(data);
        setToast({ message: 'Active resume updated successfully!', type: 'success' });
      } else {
        setToast({ message: 'ATS evaluation completed successfully!', type: 'success' });
      }
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadActive = () => {
    window.open(`${API_BASE}/resume/download`, '_blank');
  };

  // Determine which analysis dataset to show
  const currentAnalysis = analysisResult?.analysis || analysisResult || activeResume?.analysis;
  const currentScore = analysisResult?.atsScore || activeResume?.atsScore;
  const filename = analysisResult?.filename || activeResume?.filename;

  return (
    <div className="container section">
      <h2 className="section-title">AI Resume Analyzer</h2>
      
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.5fr',
        gap: '32px',
      }} className="analyzer-grid">
        
        {/* Left Side: Upload Zone & Official resume info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Active portfolio resume info */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} style={{ color: 'var(--accent)' }} /> Active Resume
            </h3>
            {activeResume ? (
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '8px' }}>{activeResume.filename}</p>
                <div style={{ display: 'flex', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  <span>ATS Base Score: <strong>{activeResume.atsScore}%</strong></span>
                  <span>&bull;</span>
                  <span>Uploaded: {new Date(activeResume.createdAt).toLocaleDateString()}</span>
                </div>
                <button onClick={handleDownloadActive} className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                  <Download size={16} /> Download Active Resume
                </button>
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No official active resume has been uploaded yet by the developer.</p>
            )}
          </div>

          {/* Test/Upload new resume form */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} style={{ color: 'var(--accent-secondary)' }} /> {isAdmin ? 'Update Official Resume' : 'Audit Your Resume'}
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              {isAdmin 
                ? 'Upload and replace the primary resume file. The AI analyzer will refresh the active portfolio score.' 
                : 'Upload your own PDF resume to run an instant ATS review powered by Google Gemini.'}
            </p>

            <form onSubmit={handleAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                border: '2px dashed var(--glass-border)',
                borderRadius: '8px',
                padding: '24px',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                position: 'relative'
              }}>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer'
                  }}
                />
                <Upload size={32} style={{ color: 'var(--accent)', marginBottom: '8px' }} />
                <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                  {file ? file.name : 'Click or Drag PDF here'}
                </p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PDF up to 10MB</span>
              </div>

              {file && (
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {loading ? 'Processing with AI...' : 'Submit & Analyze'}
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Right Side: ATS Score & AI Suggestions feedback */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '16px' }}>
              <div className="skeleton" style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
              <div className="skeleton" style={{ width: '60%', height: '24px' }} />
              <div className="skeleton" style={{ width: '100%', height: '80px' }} />
            </div>
          ) : currentAnalysis ? (
            <div>
              {/* ATS visual score gauge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
                <div style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  border: '6px solid var(--glass-border)',
                  borderTopColor: currentScore >= 80 ? 'var(--success)' : currentScore >= 60 ? 'var(--warning)' : 'var(--danger)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  fontFamily: 'Outfit',
                  transform: 'rotate(-45deg)'
                }}>
                  <span style={{ transform: 'rotate(45deg)' }}>{currentScore}%</span>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.4rem' }}>ATS Compatibility Score</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {filename ? `Analyzed file: ${filename}` : 'Active Portfolio Resume Data'}
                  </p>
                </div>
              </div>

              {/* Skills identified */}
              <h4 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>Skills Identified</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
                {currentAnalysis.skillsIdentified?.map((s, i) => (
                  <span key={i} style={{
                    fontSize: '0.8rem',
                    padding: '4px 8px',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    color: 'var(--success)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <CheckCircle size={12} /> {s}
                  </span>
                ))}
              </div>

              {/* Missing keywords */}
              <h4 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>Suggested Missing Keywords</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
                {currentAnalysis.missingKeywords?.map((s, i) => (
                  <span key={i} style={{
                    fontSize: '0.8rem',
                    padding: '4px 8px',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    color: 'var(--danger)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <AlertTriangle size={12} /> {s}
                  </span>
                ))}
              </div>

              {/* Improvements */}
              <h4 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>AI Improvement Suggestions</h4>
              <ul style={{
                color: 'var(--text-secondary)',
                paddingLeft: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontSize: '0.95rem',
                marginBottom: '24px'
              }}>
                {currentAnalysis.improvements?.map((imp, i) => (
                  <li key={i}>{imp}</li>
                ))}
              </ul>

              {/* Raw Gemini Feedback Summary */}
              {currentAnalysis.rawGeminiFeedback && (
                <div style={{
                  padding: '16px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--glass-border)',
                  fontSize: '0.9rem',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.6'
                }}>
                  <strong>AI Recruiter Feedback:</strong><br />
                  {currentAnalysis.rawGeminiFeedback}
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', color: 'var(--text-muted)', textAlign: 'center' }}>
              <FileText size={64} style={{ marginBottom: '12px' }} />
              <p>Upload a resume PDF to view the ATS scoring dashboard and recommendations.</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .analyzer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AIAnalyzer;
