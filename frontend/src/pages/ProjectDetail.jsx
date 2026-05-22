import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Globe, Cpu, CheckCircle } from 'lucide-react';
import { Github } from '../components/BrandIcons';
import { API_BASE } from '../context/AuthContext';
import { TextSkeleton } from '../components/LoadingSkeleton';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const defaultProjects = [
    {
      _id: '1',
      title: 'DevAI Career Platform',
      description: 'An AI-driven platform for developers featuring an ATS resume analyzer, a career pathway adviser, and an interview questions simulator powered by Gemini API.',
      longDescription: 'This application acts as a comprehensive portal to boost developers career strategies. By integrating Google Gemini API prompts, it can parse uploaded resumes, extract structure content, flag missing technical terms, and estimate standard ATS compliance. It also conducts mock HR/technical/behavioral rounds and grades transcript responses dynamically.',
      features: ['ATS keyword parser & compliance grade analyzer', 'AI career path navigator with 3-month detailed learning roadmaps', 'Interactive interview simulations covering HR, tech, and behavioral criteria', 'Persistent historical transcripts logs stored in MongoDB'],
      technologies: ['React.js', 'Express.js', 'MongoDB', 'Gemini API', 'Node.js', 'Multer', 'pdf-parse'],
      githubLink: 'https://github.com',
      liveLink: 'https://google.com',
      image: '',
      category: 'AI/ML',
    },
    {
      _id: '2',
      title: 'Real-Time Collaborator',
      description: 'Collaborative code editor and whiteboarding application using WebSockets, allowing multiple users to edit documents and run test suites concurrently.',
      longDescription: 'A multi-user workspace replicating Google Docs style collaboration for coding teams. Outfitted with operational transformation (OT) synchronizer and Sandboxed code run compilers to compile JavaScript/Python script lines in real time.',
      features: ['Real-time operational edits utilizing WebSockets', 'Docker sandboxed runners compiling user scripts securely', 'Shared whiteboard and paint tools synced across connections', 'Redis caching layer managing room keys and active cursor states'],
      technologies: ['React.js', 'Node.js', 'Socket.io', 'Redis', 'Docker', 'Express.js'],
      githubLink: 'https://github.com',
      liveLink: 'https://google.com',
      image: '',
      category: 'Full-Stack',
    },
    {
      _id: '3',
      title: 'Decentralized Task Manager',
      description: 'A Web3 utility enabling teams to allocate bounties and delegate work on smart contracts, logging progress on-chain.',
      longDescription: 'A decentralized project tool executing tasks and payment disbursals through Ethereum smart contracts. Teams outline criteria and lock ERC-20 stablecoin rewards, released automatically when code validations pass.',
      features: ['Solidity smart contracts automating developer milestone payments', 'Web3 client integrations syncing MetaMask wallet sessions', 'Cryptographic signature audits validating task closure approvals', 'IPFS storage backing document and requirement uploads'],
      technologies: ['Solidity', 'Hardhat', 'React.js', 'Ethers.js', 'IPFS', 'Metamask'],
      githubLink: 'https://github.com',
      liveLink: 'https://google.com',
      image: '',
      category: 'Web3',
    }
  ];

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/projects/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProject(data);
        } else {
          throw new Error('Project not found');
        }
      } catch (err) {
        const fallback = defaultProjects.find(p => p._id === id);
        if (fallback) {
          setProject(fallback);
        } else {
          setError('Project could not be found.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="container section">
        <Link to="/projects" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '24px' }}>
          <ArrowLeft size={16} /> Back to Projects
        </Link>
        <div className="glass-panel" style={{ padding: '40px' }}>
          <div className="skeleton" style={{ height: '40px', width: '50%', marginBottom: '20px' }} />
          <div className="skeleton" style={{ height: '300px', width: '100%', borderRadius: '8px', marginBottom: '24px' }} />
          <TextSkeleton lines={5} />
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container section" style={{ textAlign: 'center' }}>
        <h2>Error</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '16px 0 24px' }}>{error || 'Project not found.'}</p>
        <Link to="/projects" className="btn btn-primary">
          <ArrowLeft size={18} /> Back to Projects
        </Link>
      </div>
    );
  }

  const featuresList = project.features || [
    'Modular React UI component structural patterns',
    'Robust error reporting integrations and graceful UI fallbacks',
    'Responsive mobile layouts utilizing CSS flexible grids',
    'Production optimized environment scripting setups'
  ];

  return (
    <div className="container section">
      <Link to="/projects" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        color: 'var(--text-secondary)',
        textDecoration: 'none',
        marginBottom: '24px',
        fontWeight: 500,
      }}>
        <ArrowLeft size={16} /> Back to Projects
      </Link>

      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        {/* Banner header image */}
        <div style={{
          height: '350px',
          background: 'linear-gradient(135deg, var(--accent), var(--accent-secondary))',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
        }}>
          {project.image ? (
            <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', opacity: 0.8 }}>
              <Cpu size={70} />
              <span style={{ fontSize: '1.2rem', fontFamily: 'Outfit', fontWeight: 600 }}>{project.category} Module</span>
            </div>
          )}
        </div>

        {/* Project details content */}
        <div style={{ padding: '40px' }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '24px',
            marginBottom: '24px',
          }}>
            <div>
              <span style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--accent)',
                padding: '4px 10px',
                border: '1px solid var(--accent)',
                borderRadius: '4px',
                textTransform: 'uppercase',
              }}>{project.category}</span>
              <h1 style={{ fontSize: '2.5rem', marginTop: '12px', marginBottom: '8px' }}>{project.title}</h1>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              {project.githubLink && (
                <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                  <Github size={18} /> Repository
                </a>
              )}
              {project.liveLink && (
                <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <Globe size={18} /> Live Demo
                </a>
              )}
            </div>
          </div>

          <h3 style={{ fontSize: '1.4rem', marginBottom: '12px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>Overview</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '32px' }}>
            {project.longDescription || project.description}
          </p>

          <h3 style={{ fontSize: '1.4rem', marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>Key Architecture & Features</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginBottom: '32px',
          }} className="features-grid">
            {featuresList.map((feature, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <CheckCircle size={18} style={{ color: 'var(--success)', marginTop: '3px', flexShrink: 0 }} />
                <span style={{ color: 'var(--text-secondary)', fontSize: '1.025rem' }}>{feature}</span>
              </div>
            ))}
          </div>

          <h3 style={{ fontSize: '1.4rem', marginBottom: '12px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>Technologies Employed</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {project.technologies.map((tech) => (
              <span key={tech} style={{
                fontSize: '0.85rem',
                fontWeight: 500,
                padding: '6px 12px',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--glass-border)',
              }}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .features-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ProjectDetail;
