import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, Menu, X, Terminal, LogOut, Cpu } from 'lucide-react';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isAdmin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/projects', label: 'Projects' },
    { path: '/resume-analyzer', label: 'Resume Analyzer' },
    { path: '/coding-profiles', label: 'Coding Profiles' },
    { path: '/ai-career', label: 'AI Career' },
    { path: '/ai-interview', label: 'AI Interview' },
    { path: '/blogs', label: 'Blog' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      margin: '12px 12px 0 12px',
      borderRadius: '16px',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      {/* Brand logo */}
      <Link to="/" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        textDecoration: 'none',
        fontSize: '1.25rem',
        fontWeight: 'bold',
        fontFamily: "'Outfit', sans-serif",
        color: 'var(--text-primary)'
      }}>
        <Cpu size={24} style={{ color: 'var(--accent)' }} />
        <span>Dev<span style={{ color: 'var(--accent)' }}>AI</span></span>
      </Link>

      {/* Desktop Links */}
      <div className="desktop-links" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
      }}>
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            style={({ isActive }) => ({
              textDecoration: 'none',
              fontSize: '0.95rem',
              fontWeight: 500,
              color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
              transition: 'var(--transition)',
            })}
          >
            {link.label}
          </NavLink>
        ))}

        {isAdmin && (
          <NavLink
            to="/admin"
            style={({ isActive }) => ({
              textDecoration: 'none',
              fontSize: '0.95rem',
              fontWeight: 600,
              color: isActive ? 'var(--accent)' : 'var(--accent-secondary)',
              padding: '4px 10px',
              border: '1px solid var(--accent-secondary)',
              borderRadius: '6px',
            })}
          >
            Admin Panel
          </NavLink>
        )}
      </div>

      {/* Action utilities */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-primary)',
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'var(--transition)',
          }}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Logged in Admin Actions */}
        {user && (
          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--danger)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 500,
            }}
            title="Log Out"
          >
            <LogOut size={18} />
            <span style={{ fontSize: '0.9rem' }} className="desktop-only">Logout</span>
          </button>
        )}

        {/* Mobile Hamburger menu */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-primary)',
            padding: '8px',
          }}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {mobileOpen && (
        <div className="glass-panel" style={{
          position: 'absolute',
          top: '110%',
          left: 0,
          right: 0,
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          zIndex: 999,
        }}>
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              style={({ isActive }) => ({
                textDecoration: 'none',
                fontSize: '1.1rem',
                fontWeight: 500,
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                paddingBottom: '8px',
                borderBottom: '1px solid var(--glass-border)',
              })}
            >
              {link.label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink
              to="/admin"
              onClick={() => setMobileOpen(false)}
              style={{
                textDecoration: 'none',
                fontSize: '1.1rem',
                fontWeight: 600,
                color: 'var(--accent-secondary)',
              }}
            >
              Admin Panel
            </NavLink>
          )}
        </div>
      )}

      {/* Mini Inline styling overrides for responsiveness */}
      <style>{`
        @media (max-width: 900px) {
          .desktop-links, .desktop-only {
            display: none !ids;
          }
          .mobile-toggle {
            display: block;
          }
        }
        @media (min-width: 901px) {
          .mobile-toggle {
            display: none;
          }
          .desktop-links {
            display: flex;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
