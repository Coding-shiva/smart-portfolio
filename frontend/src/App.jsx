import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import CodingProfiles from './pages/CodingProfiles';
import AICareer from './pages/AICareer';
import AIInterview from './pages/AIInterview';
import AIAnalyzer from './pages/AIAnalyzer';
import Chatbot from './pages/Chatbot';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { MessageSquare } from 'lucide-react';

const FloatingChatbot = () => {
  const location = useLocation();
  const hideBubble = location.pathname === '/chatbot' || location.pathname.startsWith('/admin');

  if (hideBubble) return null;

  return (
    <Link
      to="/chatbot"
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: 'var(--accent)',
        boxShadow: '0 8px 32px var(--accent-glow)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        cursor: 'pointer',
        zIndex: 9999,
        transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      }}
      className="floating-chat-bubble"
      title="Ask Gemini"
      onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1) translateY(-5px)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
    >
      <MessageSquare size={26} />
      <span className="tooltip" style={{
        position: 'absolute',
        right: '80px',
        backgroundColor: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
        padding: '6px 12px',
        borderRadius: '8px',
        fontSize: '0.85rem',
        whiteSpace: 'nowrap',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        border: '1px solid var(--glass-border)',
        opacity: 0,
        pointerEvents: 'none',
        transition: 'opacity 0.2s',
      }}>
        Ask AI Assistant
      </span>
      <style>{`
        .floating-chat-bubble:hover .tooltip {
          opacity: 1 !important;
        }
      `}</style>
    </Link>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            transition: 'background-color 0.3s ease, color 0.3s ease',
          }}>
            <Navbar />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/resume-analyzer" element={<AIAnalyzer />} />
                <Route path="/coding-profiles" element={<CodingProfiles />} />
                <Route path="/ai-career" element={<AICareer />} />
                <Route path="/ai-interview" element={<AIInterview />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/blogs/:slug" element={<BlogDetail />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/chatbot" element={<Chatbot />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
            <FloatingChatbot />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
