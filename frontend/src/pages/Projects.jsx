import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Globe, Sparkles } from 'lucide-react';
import { Github } from '../components/BrandIcons';
import { API_BASE } from '../context/AuthContext';
import { GridSkeleton } from '../components/LoadingSkeleton';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const defaultProjects = [
    {
      _id: '1',
      title: 'DevAI Career Platform',
      description: 'An AI-driven platform for developers featuring an ATS resume analyzer, a career pathway adviser, and an interview questions simulator powered by Gemini API.',
      technologies: ['React.js', 'Express.js', 'MongoDB', 'Gemini API', 'Node.js'],
      githubLink: 'https://github.com',
      liveLink: 'https://google.com',
      image: '',
      category: 'AI/ML',
      featured: true,
    },
    {
      _id: '2',
      title: 'Real-Time Collaborator',
      description: 'Collaborative code editor and whiteboarding application using WebSockets, allowing multiple users to edit documents and run test suites concurrently.',
      technologies: ['React.js', 'Node.js', 'Socket.io', 'Redis', 'Docker'],
      githubLink: 'https://github.com',
      liveLink: 'https://google.com',
      image: '',
      category: 'Full-Stack',
      featured: true,
    },
    {
      _id: '3',
      title: 'Decentralized Task Manager',
      description: 'A Web3 utility enabling teams to allocate bounties and delegate work on smart contracts, logging progress on-chain.',
      technologies: ['Solidity', 'Hardhat', 'React.js', 'Ethers.js'],
      githubLink: 'https://github.com',
      liveLink: 'https://google.com',
      image: '',
      category: 'Web3',
      featured: false,
    }
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (category !== 'All') queryParams.append('category', category);
        if (search) queryParams.append('search', search);

        const res = await fetch(`${API_BASE}/projects?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setProjects(data.length ? data : defaultProjects.filter(p => {
            const matchesCat = category === 'All' || p.category === category;
            const matchesSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
            return matchesCat && matchesSearch;
          }));
        } else {
          throw new Error();
        }
      } catch (err) {
        // Fallback filter
        setProjects(defaultProjects.filter(p => {
          const matchesCat = category === 'All' || p.category === category;
          const matchesSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
          return matchesCat && matchesSearch;
        }));
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchProjects();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, category]);

  useEffect(() => {
    // Track projects pagevisit
    fetch(`${API_BASE}/analytics/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: '/projects', referrer: document.referrer || 'Direct' }),
    }).catch(() => {});
  }, []);

  const categories = ['All', 'Full-Stack', 'AI/ML', 'Web3', 'Frontend'];

  return (
    <div className="container section">
      <h2 className="section-title">Portfolio Projects</h2>

      {/* Search and filter controls */}
      <div className="glass-panel" style={{
        padding: '20px',
        marginBottom: '40px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Search bar */}
        <div style={{ position: 'relative', flex: '1', minWidth: '280px' }}>
          <Search size={18} style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)'
          }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search projects by name or technology..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '40px' }}
          />
        </div>

        {/* Category filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="btn"
              style={{
                padding: '8px 16px',
                fontSize: '0.875rem',
                backgroundColor: category === cat ? 'var(--accent)' : 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                border: category === cat ? 'none' : '1px solid var(--glass-border)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <GridSkeleton count={3} />
      ) : projects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          No projects match your search criteria. Try a different query.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px',
        }}>
          {projects.map((project) => (
            <div key={project._id} className="glass-card" style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
            }}>
              <div>
                {/* Project Image */}
                <div style={{
                  height: '180px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1))',
                  border: '1px solid var(--glass-border)',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '0.9rem',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  {project.image ? (
                    <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <Globe size={40} style={{ color: 'var(--accent)' }} />
                      <span>Preview Image</span>
                    </div>
                  )}
                  {project.featured && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: 'var(--accent)',
                      color: '#fff',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '4px 8px',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Sparkles size={12} /> Featured
                    </div>
                  )}
                </div>

                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{project.title}</h3>
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.95rem',
                  marginBottom: '16px',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  lineHeight: '1.5',
                }}>{project.description}</p>
              </div>

              <div>
                {/* Technology chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                  {project.technologies.map((tech) => (
                    <span key={tech} style={{
                      fontSize: '0.75rem',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: 'var(--bg-tertiary)',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--glass-border)',
                    }}>
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Footer Links */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid var(--glass-border)',
                  paddingTop: '16px',
                }}>
                  <Link to={`/projects/${project._id}`} style={{
                    color: 'var(--accent)',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                  }}>
                    View Details
                  </Link>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    {project.githubLink && (
                      <a href={project.githubLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)' }}>
                        <Github size={18} />
                      </a>
                    )}
                    {project.liveLink && (
                      <a href={project.liveLink} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)' }}>
                        <Globe size={18} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
