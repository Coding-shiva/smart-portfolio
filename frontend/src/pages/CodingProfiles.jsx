import React, { useEffect } from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  BarChart,
  Bar
} from 'recharts';
import { Code, Terminal, Trophy, Star, ShieldAlert } from 'lucide-react';
import { Github, Linkedin } from '../components/BrandIcons';
import { API_BASE } from '../context/AuthContext';

const CodingProfiles = () => {
  // Static stats representative of a competitive coder & full stack dev
  const profilesData = [
    {
      platform: 'LeetCode',
      icon: <Code size={24} style={{ color: '#ffa116' }} />,
      solved: '150+',
      total: '2500',
      rating: 'Rating: 1550',
      ranking: 'Solved: Easy & Medium Problems',
      badges: ['50 Days Badge', 'Problem Solving Badge'],
      link: 'https://leetcode.com/u/ShivanandSharma/',
    },
    {
      platform: 'HackerRank',
      icon: <Star size={24} style={{ color: '#2ec866' }} />,
      solved: 'Multiple Coding Problems',
      total: 'Languages: Java, Python, SQL',
      rating: 'Java (5★), Python (4★)',
      ranking: 'SQL Intermediate (4★)',
      badges: ['Java 5 Stars', 'Python 4 Stars', 'SQL Intermediate'],
      link: 'https://www.hackerrank.com/profile/shivananadsharm1',
    },
    {
      platform: 'GitHub',
      icon: <Github size={24} style={{ color: 'var(--text-primary)' }} />,
      solved: '12 Projects Deployed',
      total: '20+ Repositories',
      rating: 'Active Development',
      ranking: 'Contributions: 400+ past year',
      badges: ['Arctic Code Vault Contributor', 'Pull Shark'],
      link: 'https://github.com/Coding-shiva',
    },
    {
      platform: 'LinkedIn',
      icon: <Linkedin size={24} style={{ color: '#0077b5' }} />,
      solved: '3 Technical Posts',
      total: '500+ Connections',
      rating: 'Active Professional Presence',
      ranking: 'Industry Outreach & Insights',
      badges: ['Article Author', 'Network Creator', 'Full-Stack Developer'],
      link: 'https://linkedin.com/in/shivanand-sharma',
    },
  ];

  // Data for radar chart (Topic distributions)
  const skillsDistribution = [
    { subject: 'Data Structures', A: 95, B: 80, fullMark: 100 },
    { subject: 'Algorithms', A: 90, B: 75, fullMark: 100 },
    { subject: 'Dynamic Programming', A: 85, B: 60, fullMark: 100 },
    { subject: 'System Design', A: 80, B: 85, fullMark: 100 },
    { subject: 'DBMS / SQL', A: 85, B: 90, fullMark: 100 },
    { subject: 'Machine Learning', A: 75, B: 55, fullMark: 100 },
  ];

  // Data for contest progress chart
  const contestProgress = [
    { name: 'Jan', Rating: 1500 },
    { name: 'Feb', Rating: 1580 },
    { name: 'Mar', Rating: 1610 },
    { name: 'Apr', Rating: 1690 },
    { name: 'May', Rating: 1780 },
    { name: 'Jun', Rating: 1850 },
  ];

  useEffect(() => {
    // Track page view
    fetch(`${API_BASE}/analytics/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: '/coding-profiles', referrer: document.referrer || 'Direct' }),
    }).catch(() => {});
  }, []);

  return (
    <div className="container section">
      <h2 className="section-title">Coding Profiles Dashboard</h2>

      {/* Profiles grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '24px',
        marginBottom: '48px',
      }}>
        {profilesData.map((prof) => (
          <div key={prof.platform} className="glass-card" style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '16px'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {prof.icon} {prof.platform}
                </h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                <div>Solved / Logs: <strong style={{ color: 'var(--text-primary)' }}>{prof.solved}</strong></div>
                <div>Rating / Score: <strong style={{ color: 'var(--text-primary)' }}>{prof.rating}</strong></div>
                <div>Rank Standing: <strong style={{ color: 'var(--text-primary)' }}>{prof.ranking}</strong></div>
              </div>

              <div style={{ marginTop: '16px' }}>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Badges:</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {prof.badges.map(b => (
                    <span key={b} style={{
                      fontSize: '0.7rem',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: 'var(--bg-tertiary)',
                      color: 'var(--accent-secondary)',
                      border: '1px solid var(--glass-border)'
                    }}>{b}</span>
                  ))}
                </div>
              </div>
            </div>

            <a
              href={prof.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
              style={{ padding: '8px 12px', fontSize: '0.85rem', width: '100%', textAlign: 'center', justifyContent: 'center' }}
            >
              Visit Profile
            </a>
          </div>
        ))}
      </div>

      {/* Analytics charts */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '32px',
      }} className="charts-grid">
        {/* Radar topic skills */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Star size={18} style={{ color: 'var(--accent)' }} /> Topic Proficiency Map
          </h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <RadarChart cx="50%" cy="50%" radius="70%" data={skillsDistribution}>
                <PolarGrid stroke="var(--glass-border)" />
                <PolarAngleAxis dataKey="subject" stroke="var(--text-secondary)" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="var(--text-muted)" tick={{ fontSize: 9 }} />
                <Radar name="Shivanand Sharma" dataKey="A" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.3} />
                <Radar name="Benchmark Average" dataKey="B" stroke="var(--accent-secondary)" fill="var(--accent-secondary)" fillOpacity={0.1} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--glass-border)' }} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: '0.8rem', paddingTop: '10px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rating LineChart */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trophy size={18} style={{ color: 'var(--warning)' }} /> Contest Rating Progress
          </h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <LineChart data={contestProgress} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{ fontSize: 11 }} />
                <YAxis domain={[1400, 2000]} stroke="var(--text-secondary)" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }} />
                <Line type="monotone" dataKey="Rating" stroke="var(--accent)" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .charts-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CodingProfiles;
