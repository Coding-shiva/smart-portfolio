import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail,
  Cpu,
  Database,
  Globe,
  Award,
  BookOpen,
  ArrowRight,
  Sparkles,
  Layers,
  ChevronRight,
  Code
} from 'lucide-react';
import { Github, Linkedin } from '../components/BrandIcons';
import { API_BASE } from '../context/AuthContext';

// Custom role-typing hook
const useTypingEffect = (words, speed = 100, pause = 1000) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => {
    if (words.length === 0) return;

    if (subIndex === words[index].length + 1 && !reverse) {
      const timeout = setTimeout(() => setReverse(true), pause);
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setText(words[index].substring(0, subIndex + (reverse ? -1 : 1)));
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, speed + (reverse ? -40 : 0));

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, words, speed, pause]);

  return text;
};

const Home = () => {
  const roles = ['Full-Stack Developer', 'AI/ML Specialist', 'Computer Science Engineer', 'Problem Solver'];
  const typedRole = useTypingEffect(roles, 80, 1500);

  const [skills, setSkills] = useState([]);
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default skills if DB is empty
  const defaultSkills = [
    { name: 'React.js', category: 'Frontend', level: 90 },
    { name: 'JavaScript', category: 'Frontend', level: 95 },
    { name: 'HTML5/CSS3', category: 'Frontend', level: 95 },
    { name: 'Node.js', category: 'Backend', level: 85 },
    { name: 'Express.js', category: 'Backend', level: 85 },
    { name: 'Python', category: 'Backend', level: 80 },
    { name: 'MongoDB', category: 'Database', level: 88 },
    { name: 'PostgreSQL', category: 'Database', level: 75 },
    { name: 'Gemini API', category: 'AI/ML', level: 85 },
    { name: 'TensorFlow', category: 'AI/ML', level: 65 },
    { name: 'Docker', category: 'Cloud/DevOps', level: 70 },
    { name: 'Git/GitHub', category: 'Cloud/DevOps', level: 90 },
  ];

  // Default education/timeline
  const education = [
    {
      year: '2022 - 2026',
      title: 'B.Tech in Computer Science and Engineering',
      institution: 'Institute of Engineering & Rural Technology, Prayagraj',
      desc: 'Specializing in software engineering and machine learning. Score: 80.7% (Till 7th Semester)',
    },
    {
      year: '2021',
      title: 'Higher Secondary School (Class XII)',
      institution: 'Kendriya Vidyalaya, Mughalsarai',
      desc: 'Focused on PCM & Computer Science. Score: 93.4%',
    },
    {
      year: '2019',
      title: 'Secondary School (Class X)',
      institution: 'Kendriya Vidyalaya, Mughalsarai',
      desc: 'General Science & Mathematics foundation. Score: 91.8%',
    },
  ];

  // Default certs
  const defaultCerts = [
    { title: 'Google Advanced Data Analytics', issuer: 'Coursera', issueDate: '2025-02-15' },
    { title: 'Meta Front-End Developer Professional', issuer: 'Coursera', issueDate: '2024-11-20' },
    { title: 'MongoDB Developer Associate', issuer: 'MongoDB Academy', issueDate: '2024-06-10' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skillsRes, certsRes] = await Promise.all([
          fetch(`${API_BASE}/skills`),
          fetch(`${API_BASE}/certificates`),
        ]);

        if (skillsRes.ok) {
          const skillsData = await skillsRes.json();
          setSkills(skillsData.length ? skillsData : defaultSkills);
        } else {
          setSkills(defaultSkills);
        }

        if (certsRes.ok) {
          const certsData = await certsRes.json();
          setCerts(certsData.length ? certsData : defaultCerts);
        } else {
          setCerts(defaultCerts);
        }
      } catch (err) {
        console.error('Error fetching landing data:', err);
        setSkills(defaultSkills);
        setCerts(defaultCerts);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Track landing page visit
    fetch(`${API_BASE}/analytics/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: '/', referrer: document.referrer || 'Direct' }),
    }).catch((err) => console.log('Analytics track fail:', err));
  }, []);

  // Filter skills by category
  const categories = ['Frontend', 'Backend', 'Database', 'AI/ML', 'Cloud/DevOps'];

  return (
    <div className="container" style={{ minHeight: '80vh', paddingBottom: '40px' }}>
      {/* 1. HERO SECTION */}
      <section className="section" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        paddingTop: '60px',
        paddingBottom: '80px',
        position: 'relative'
      }}>
        {/* Glow circles */}
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
          top: '-50px',
          zIndex: -1,
        }} />

        {/* Glow avatar layout */}
        <div style={{
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
          padding: '4px',
          boxShadow: '0 0 30px var(--accent-glow)',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent)',
          }}>
            <Code size={70} />
          </div>
        </div>

        <h1 style={{
          fontSize: '3.5rem',
          fontFamily: "'Outfit', sans-serif",
          marginBottom: '12px',
          fontWeight: 800,
        }}>
          Hi, I am <span style={{
            background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>Shivanand Sharma</span>
        </h1>

        <h3 style={{
          fontSize: '1.8rem',
          fontWeight: 500,
          color: 'var(--text-secondary)',
          minHeight: '2.5rem',
          marginBottom: '20px',
        }}>
          I build solutions as a <span style={{ color: 'var(--accent)', borderRight: '2px solid var(--accent)', paddingRight: '4px' }}>{typedRole}</span>
        </h3>

        <p style={{
          maxWidth: '650px',
          fontSize: '1.1rem',
          color: 'var(--text-secondary)',
          lineHeight: '1.8',
          marginBottom: '36px',
        }}>
          Computer Science Engineering student specializing in full-stack web development (MERN stack) and machine learning. Experienced in building AI-driven systems using Python, LangChain, FastAPI, and Scikit-learn. GATE 2026 qualified.
        </p>

        <div style={{ display: 'flex', gap: '16px' }}>
          <Link to="/projects" className="btn btn-primary">
            View Projects <ArrowRight size={18} />
          </Link>
          <Link to="/contact" className="btn btn-secondary">
            Let's Talk
          </Link>
        </div>
      </section>

      {/* 2. ABOUT SECTION */}
      <section className="section" style={{ borderTop: '1px solid var(--glass-border)' }}>
        <h2 className="section-title">About Me</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          marginTop: '20px',
        }} className="about-grid">
          {/* Objective & Details */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} style={{ color: 'var(--accent)' }} /> Career Objective
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '24px' }}>
              Final-year Computer Science Engineering student specializing in full-stack web development and machine learning. Eager to apply hands-on project experience, strong algorithmic foundations, and AI automation workflows to software engineering roles.
            </p>

            <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={20} style={{ color: 'var(--accent-secondary)' }} /> Key Highlights
            </h3>
            <ul style={{ color: 'var(--text-secondary)', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li>GATE 2026 Qualified (Placed in top 13% candidates).</li>
              <li>Hands-on experience developing AI Multi-Agent workflows with LangChain & FastAPI.</li>
              <li>Strong problem-solving foundation with a 4-star HackerRank rating in Java, C, and Python.</li>
            </ul>
          </div>

          {/* Education Timeline */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={20} style={{ color: 'var(--accent)' }} /> Education Timeline
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative', paddingLeft: '20px', borderLeft: '2px solid var(--glass-border)' }}>
              {education.map((edu, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute',
                    left: '-29px',
                    top: '4px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent)',
                    border: '3px solid var(--bg-primary)',
                  }} />
                  <span style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600 }}>{edu.year}</span>
                  <h4 style={{ fontSize: '1.1rem', margin: '4px 0' }}>{edu.title}</h4>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{edu.institution}</span>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginTop: '6px' }}>{edu.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. SKILLS DASHBOARD */}
      <section className="section" style={{ borderTop: '1px solid var(--glass-border)' }}>
        <h2 className="section-title">Skills Dashboard</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {categories.map((cat) => {
            const catSkills = skills.filter((s) => s.category === cat);
            if (catSkills.length === 0) return null;

            return (
              <div key={cat} className="glass-panel" style={{ padding: '28px' }}>
                <h3 style={{
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '1.35rem',
                  color: 'var(--accent-secondary)'
                }}>
                  <Layers size={18} /> {cat} Skills
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: '20px',
                }}>
                  {catSkills.map((skill) => (
                    <div key={skill.name} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                        <span style={{ fontWeight: 500 }}>{skill.name}</span>
                        <span style={{ color: 'var(--text-secondary)' }}>{skill.level}%</span>
                      </div>
                      <div style={{
                        height: '8px',
                        backgroundColor: 'var(--bg-tertiary)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${skill.level}%`,
                          background: 'linear-gradient(90deg, var(--accent), var(--accent-secondary))',
                          borderRadius: '4px',
                          transition: 'width 1s ease-in-out',
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. CERTIFICATIONS & ACHIEVEMENTS */}
      <section className="section" style={{ borderTop: '1px solid var(--glass-border)' }}>
        <h2 className="section-title">Certifications & Credentials</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px',
        }}>
          {certs.map((cert, idx) => (
            <div key={idx} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <Award size={36} style={{ color: 'var(--accent)', marginBottom: '12px' }} />
                <h3 style={{ fontSize: '1.15rem', marginBottom: '6px' }}>{cert.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{cert.issuer}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span>Issued: {new Date(cert.issueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}</span>
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      color: 'var(--accent-secondary)',
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Verify <ChevronRight size={16} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mini Responsive CSS overrides */}
      <style>{`
        @media (max-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
