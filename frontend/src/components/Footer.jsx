import React from 'react';
import { Mail, Code } from 'lucide-react';
import { Github, Linkedin } from './BrandIcons';

const Footer = () => {
  return (
    <footer className="glass-panel" style={{
      margin: '40px 12px 12px 12px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
    }}>
      <div style={{ display: 'flex', gap: '20px' }}>
        <a href="https://github.com/Coding-shiva" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', transition: 'var(--transition)' }}>
          <Github size={20} />
        </a>
        <a href="https://linkedin.com/in/shivanand-sharma" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', transition: 'var(--transition)' }}>
          <Linkedin size={20} />
        </a>
        <a href="https://leetcode.com/u/ShivanandSharma/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', transition: 'var(--transition)' }}>
          <Code size={20} />
        </a>
        <a href="mailto:shivanandsharma7322@gmail.com" style={{ color: 'var(--text-secondary)', transition: 'var(--transition)' }}>
          <Mail size={20} />
        </a>
      </div>

      <div style={{
        fontSize: '0.875rem',
        color: 'var(--text-muted)',
        textAlign: 'center',
      }}>
        &copy; {new Date().getFullYear()} Smart Developer Portfolio & AI Career Platform. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
