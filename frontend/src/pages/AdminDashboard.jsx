import React, { useState, useEffect } from 'react';
import { useAuth, API_BASE } from '../context/AuthContext';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  Settings, Users, Briefcase, Code, FileText, Mail, Plus, Trash2, Edit, Check, Star, LogIn, Upload, Shield
} from 'lucide-react';
import Toast from '../components/Toast';

const AdminDashboard = () => {
  const { user, login, token, apiFetch } = useAuth();
  
  // Login states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // General dashboard states
  const [activeTab, setActiveTab] = useState('analytics');
  const [analytics, setAnalytics] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [certs, setCerts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [toast, setToast] = useState(null);

  // Resume Upload
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(false);

  // Form Editor States (for CRUD)
  const [editingItem, setEditingItem] = useState(null); // { type: 'project'|'skill'|'blog'|'cert', item: null|object }
  const [projectForm, setProjectForm] = useState({ title: '', description: '', technologies: '', githubLink: '', liveLink: '', category: 'Full-Stack', featured: false });
  const [skillForm, setSkillForm] = useState({ name: '', category: 'Frontend', level: 80, icon: '' });
  const [blogForm, setBlogForm] = useState({ title: '', content: '', summary: '', category: 'AI/ML', tags: '', published: true });
  const [certForm, setCertForm] = useState({ title: '', issuer: '', issueDate: '', credentialId: '', credentialUrl: '' });

  useEffect(() => {
    if (token) {
      fetchAnalytics();
      fetchProjects();
      fetchSkills();
      fetchBlogs();
      fetchCerts();
      fetchMessages();
    }
  }, [token]);

  // Auth Action
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    const result = await login(email, password);
    setLoginLoading(false);
    if (result.success) {
      setToast({ message: 'Welcome back, Admin!', type: 'success' });
    } else {
      setToast({ message: result.error || 'Login failed.', type: 'error' });
    }
  };

  // API fetches
  const fetchAnalytics = async () => {
    try {
      const res = await apiFetch('/analytics/overview');
      if (res.ok) setAnalytics(await res.json());
    } catch (err) { console.log(err); }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_BASE}/projects`);
      if (res.ok) setProjects(await res.json());
    } catch (err) { console.log(err); }
  };

  const fetchSkills = async () => {
    try {
      const res = await fetch(`${API_BASE}/skills`);
      if (res.ok) setSkills(await res.json());
    } catch (err) { console.log(err); }
  };

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${API_BASE}/blogs`);
      if (res.ok) setBlogs(await res.json());
    } catch (err) { console.log(err); }
  };

  const fetchCerts = async () => {
    try {
      const res = await fetch(`${API_BASE}/certificates`);
      if (res.ok) setCerts(await res.json());
    } catch (err) { console.log(err); }
  };

  const fetchMessages = async () => {
    try {
      const res = await apiFetch('/contact');
      if (res.ok) setMessages(await res.json());
    } catch (err) { console.log(err); }
  };

  // Resume Upload Action
  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) return;
    setResumeLoading(true);
    const formData = new FormData();
    formData.append('resume', resumeFile);

    try {
      const res = await apiFetch('/resume/upload', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        setToast({ message: 'Resume uploaded and analyzed successfully!', type: 'success' });
        setResumeFile(null);
        fetchAnalytics();
      } else {
        const errData = await res.json();
        throw new Error(errData.message || 'Upload failed.');
      }
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    } finally {
      setResumeLoading(false);
    }
  };

  // CRUD Actions - Deletes
  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      const res = await apiFetch(`/${type}s/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setToast({ message: 'Item deleted.', type: 'success' });
        if (type === 'project') fetchProjects();
        if (type === 'skill') fetchSkills();
        if (type === 'blog') fetchBlogs();
        if (type === 'certificate') fetchCerts();
        if (type === 'contact') fetchMessages(); // Messages use '/contact'
      }
    } catch (err) {
      setToast({ message: 'Deletion failed.', type: 'error' });
    }
  };

  // CRUD Toggle Read
  const handleToggleRead = async (id) => {
    try {
      const res = await apiFetch(`/contact/${id}/read`, { method: 'PUT' });
      if (res.ok) {
        fetchMessages();
      }
    } catch (err) { console.log(err); }
  };

  // CRUD Submits
  const handleSaveItem = async (e) => {
    e.preventDefault();
    const { type, item } = editingItem;
    
    let endpoint = `/${type}s`;
    let method = 'POST';
    let body = {};

    if (item) {
      endpoint += `/${item._id}`;
      method = 'PUT';
    }

    if (type === 'project') {
      body = {
        ...projectForm,
        technologies: projectForm.technologies.split(',').map(s => s.trim()).filter(Boolean)
      };
    } else if (type === 'skill') {
      body = skillForm;
    } else if (type === 'blog') {
      body = {
        ...blogForm,
        tags: blogForm.tags.split(',').map(s => s.trim()).filter(Boolean)
      };
    } else if (type === 'certificate') {
      body = certForm;
    }

    try {
      const res = await apiFetch(endpoint, {
        method,
        body: JSON.stringify(body)
      });

      if (res.ok) {
        setToast({ message: item ? 'Updated successfully!' : 'Created successfully!', type: 'success' });
        setEditingItem(null);
        if (type === 'project') fetchProjects();
        if (type === 'skill') fetchSkills();
        if (type === 'blog') fetchBlogs();
        if (type === 'certificate') fetchCerts();
      } else {
        const data = await res.json();
        throw new Error(data.message);
      }
    } catch (err) {
      setToast({ message: err.message || 'Operation failed.', type: 'error' });
    }
  };

  // Form triggers
  const startEdit = (type, item) => {
    setEditingItem({ type, item });
    if (type === 'project') {
      setProjectForm(item ? {
        title: item.title,
        description: item.description,
        technologies: item.technologies.join(', '),
        githubLink: item.githubLink,
        liveLink: item.liveLink,
        category: item.category,
        featured: item.featured
      } : { title: '', description: '', technologies: '', githubLink: '', liveLink: '', category: 'Full-Stack', featured: false });
    } else if (type === 'skill') {
      setSkillForm(item ? {
        name: item.name,
        category: item.category,
        level: item.level,
        icon: item.icon
      } : { name: '', category: 'Frontend', level: 80, icon: '' });
    } else if (type === 'blog') {
      setBlogForm(item ? {
        title: item.title,
        content: item.content,
        summary: item.summary,
        category: item.category,
        tags: item.tags.join(', '),
        published: item.published
      } : { title: '', content: '', summary: '', category: 'AI/ML', tags: '', published: true });
    } else if (type === 'certificate') {
      setCertForm(item ? {
        title: item.title,
        issuer: item.issuer,
        issueDate: item.issueDate ? item.issueDate.substring(0, 10) : '',
        credentialId: item.credentialId,
        credentialUrl: item.credentialUrl
      } : { title: '', issuer: '', issueDate: '', credentialId: '', credentialUrl: '' });
    }
  };

  // Render Login Screen if not authenticated
  if (!token) {
    return (
      <div className="container section" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        
        <div className="glass-panel" style={{ padding: '40px', maxWidth: '400px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-glow)',
              color: 'var(--accent)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <Shield size={24} />
            </div>
            <h2 style={{ fontFamily: 'Outfit', fontSize: '1.75rem' }}>Admin Gateway</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>Sign in to manage portfolio modules and view traffic.</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="admin@portfolio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loginLoading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              {loginLoading ? 'Signing In...' : 'Access Dashboard'} <LogIn size={16} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Colors for pie slices
  const COLORS = ['var(--accent)', 'var(--accent-secondary)', 'var(--success)', '#f59e0b'];

  return (
    <div className="container section">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontFamily: 'Outfit' }}>Control Center</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Logged in as: {user?.name} ({user?.role})</p>
        </div>
      </div>

      {/* Tabs panels layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '32px' }} className="admin-grid">
        {/* Navigation Sidebar */}
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px', height: 'fit-content' }}>
          <button
            onClick={() => setActiveTab('analytics')}
            style={{
              padding: '12px 16px',
              textAlign: 'left',
              background: activeTab === 'analytics' ? 'var(--accent-glow)' : 'transparent',
              color: activeTab === 'analytics' ? 'var(--accent)' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <Users size={18} /> Visitor Analytics
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            style={{
              padding: '12px 16px',
              textAlign: 'left',
              background: activeTab === 'projects' ? 'var(--accent-glow)' : 'transparent',
              color: activeTab === 'projects' ? 'var(--accent)' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <Briefcase size={18} /> Manage Projects
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            style={{
              padding: '12px 16px',
              textAlign: 'left',
              background: activeTab === 'skills' ? 'var(--accent-glow)' : 'transparent',
              color: activeTab === 'skills' ? 'var(--accent)' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <Code size={18} /> Manage Skills
          </button>
          <button
            onClick={() => setActiveTab('blogs')}
            style={{
              padding: '12px 16px',
              textAlign: 'left',
              background: activeTab === 'blogs' ? 'var(--accent-glow)' : 'transparent',
              color: activeTab === 'blogs' ? 'var(--accent)' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <FileText size={18} /> Manage Blogs
          </button>
          <button
            onClick={() => setActiveTab('certs')}
            style={{
              padding: '12px 16px',
              textAlign: 'left',
              background: activeTab === 'certs' ? 'var(--accent-glow)' : 'transparent',
              color: activeTab === 'certs' ? 'var(--accent)' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <Star size={18} /> Certifications
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            style={{
              padding: '12px 16px',
              textAlign: 'left',
              background: activeTab === 'messages' ? 'var(--accent-glow)' : 'transparent',
              color: activeTab === 'messages' ? 'var(--accent)' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              justifyContent: 'space-between'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Mail size={18} /> Messages</span>
            {messages.filter(m => !m.read).length > 0 && (
              <span style={{ backgroundColor: 'var(--danger)', color: '#fff', fontSize: '0.75rem', padding: '2px 6px', borderRadius: '10px' }}>
                {messages.filter(m => !m.read).length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('resume')}
            style={{
              padding: '12px 16px',
              textAlign: 'left',
              background: activeTab === 'resume' ? 'var(--accent-glow)' : 'transparent',
              color: activeTab === 'resume' ? 'var(--accent)' : 'var(--text-secondary)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <Upload size={18} /> Upload Resume
          </button>
        </div>

        {/* Content Pane */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          
          {/* TAB 1: ANALYTICS VIEW */}
          {activeTab === 'analytics' && (
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Visitor Analytics Summary</h3>
              {analytics ? (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                    <div className="glass-card" style={{ textAlign: 'center' }}>
                      <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Total Pageviews</h4>
                      <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent)' }}>{analytics.totalVisitors}</p>
                    </div>
                    {/* Add other aggregates if needed */}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }} className="analytics-details">
                    <div className="glass-card" style={{ padding: '20px' }}>
                      <h4 style={{ marginBottom: '16px' }}>Daily Traffic (7 Days)</h4>
                      <div style={{ width: '100%', height: '240px' }}>
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                          <LineChart data={analytics.dailyTraffic}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                            <XAxis dataKey="_id" stroke="var(--text-secondary)" tick={{ fontSize: 10 }} />
                            <YAxis stroke="var(--text-secondary)" tick={{ fontSize: 10 }} />
                            <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--glass-border)' }} />
                            <Line type="monotone" dataKey="visits" stroke="var(--accent)" strokeWidth={2} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="glass-card" style={{ padding: '20px' }}>
                      <h4 style={{ marginBottom: '16px' }}>Device Breakdown</h4>
                      <div style={{ width: '100%', height: '240px' }}>
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                          <PieChart>
                            <Pie
                              data={analytics.deviceBreakdown.map(d => ({ name: d._id, value: d.count }))}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {analytics.deviceBreakdown.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--glass-border)' }} />
                            <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)' }}>No analytics records collected yet.</p>
              )}
            </div>
          )}

          {/* TAB 2: PROJECTS CRUD */}
          {activeTab === 'projects' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.5rem' }}>Portfolio Projects</h3>
                {!editingItem && (
                  <button onClick={() => startEdit('project', null)} className="btn btn-primary" style={{ padding: '8px 16px' }}>
                    <Plus size={16} /> Add Project
                  </button>
                )}
              </div>

              {editingItem?.type === 'project' ? (
                <form onSubmit={handleSaveItem} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Project Title</label>
                    <input type="text" className="form-control" value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea className="form-control" rows="3" value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Technologies (Comma separated)</label>
                    <input type="text" className="form-control" placeholder="React, Node.js, Express" value={projectForm.technologies} onChange={e => setProjectForm({...projectForm, technologies: e.target.value})} required />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">GitHub URL</label>
                      <input type="text" className="form-control" value={projectForm.githubLink} onChange={e => setProjectForm({...projectForm, githubLink: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Live URL</label>
                      <input type="text" className="form-control" value={projectForm.liveLink} onChange={e => setProjectForm({...projectForm, liveLink: e.target.value})} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <select className="form-control" value={projectForm.category} onChange={e => setProjectForm({...projectForm, category: e.target.value})}>
                        <option value="Full-Stack">Full-Stack</option>
                        <option value="AI/ML">AI/ML</option>
                        <option value="Web3">Web3</option>
                        <option value="Frontend">Frontend</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '36px' }}>
                      <input type="checkbox" id="featured" checked={projectForm.featured} onChange={e => setProjectForm({...projectForm, featured: e.target.checked})} />
                      <label htmlFor="featured">Feature on Landing Page</label>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button type="submit" className="btn btn-primary">Save Project</button>
                    <button type="button" onClick={() => setEditingItem(null)} className="btn btn-secondary">Cancel</button>
                  </div>
                </form>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {projects.map(p => (
                    <div key={p._id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4>{p.title}</h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{p.category} &bull; {p.technologies.join(', ')}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => startEdit('project', p)} className="btn btn-secondary" style={{ padding: '6px' }}><Edit size={14} /></button>
                        <button onClick={() => handleDelete('project', p._id)} className="btn btn-danger" style={{ padding: '6px', border: 'none' }}><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SKILLS CRUD */}
          {activeTab === 'skills' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.5rem' }}>Technical Skills</h3>
                {!editingItem && (
                  <button onClick={() => startEdit('skill', null)} className="btn btn-primary" style={{ padding: '8px 16px' }}>
                    <Plus size={16} /> Add Skill
                  </button>
                )}
              </div>

              {editingItem?.type === 'skill' ? (
                <form onSubmit={handleSaveItem} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Skill Name</label>
                    <input type="text" className="form-control" value={skillForm.name} onChange={e => setSkillForm({...skillForm, name: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-control" value={skillForm.category} onChange={e => setSkillForm({...skillForm, category: e.target.value})}>
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="Database">Database</option>
                      <option value="AI/ML">AI/ML</option>
                      <option value="Cloud/DevOps">Cloud/DevOps</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Skill Level (0 - 100): {skillForm.level}%</label>
                    <input type="range" className="form-control" min="0" max="100" value={skillForm.level} onChange={e => setSkillForm({...skillForm, level: Number(e.target.value)})} />
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button type="submit" className="btn btn-primary">Save Skill</button>
                    <button type="button" onClick={() => setEditingItem(null)} className="btn btn-secondary">Cancel</button>
                  </div>
                </form>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {skills.map(s => (
                    <div key={s._id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4>{s.name}</h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{s.category} &bull; Level: {s.level}%</span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => startEdit('skill', s)} className="btn btn-secondary" style={{ padding: '6px' }}><Edit size={14} /></button>
                        <button onClick={() => handleDelete('skill', s._id)} className="btn btn-danger" style={{ padding: '6px', border: 'none' }}><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: BLOGS CRUD */}
          {activeTab === 'blogs' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.5rem' }}>Blog Articles</h3>
                {!editingItem && (
                  <button onClick={() => startEdit('blog', null)} className="btn btn-primary" style={{ padding: '8px 16px' }}>
                    <Plus size={16} /> Add Article
                  </button>
                )}
              </div>

              {editingItem?.type === 'blog' ? (
                <form onSubmit={handleSaveItem} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Article Title</label>
                    <input type="text" className="form-control" value={blogForm.title} onChange={e => setBlogForm({...blogForm, title: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Summary / Snippet</label>
                    <input type="text" className="form-control" value={blogForm.summary} onChange={e => setBlogForm({...blogForm, summary: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-control" value={blogForm.category} onChange={e => setBlogForm({...blogForm, category: e.target.value})}>
                      <option value="AI/ML">AI/ML</option>
                      <option value="Cloud/DevOps">Cloud/DevOps</option>
                      <option value="Database">Database</option>
                      <option value="Frontend">Frontend</option>
                      <option value="General">General</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tags (Comma separated)</label>
                    <input type="text" className="form-control" placeholder="Docker, Web3, AWS" value={blogForm.tags} onChange={e => setBlogForm({...blogForm, tags: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Markdown Content</label>
                    <textarea className="form-control" rows="8" placeholder="# Article content in Markdown..." value={blogForm.content} onChange={e => setBlogForm({...blogForm, content: e.target.value})} required style={{ fontFamily: 'monospace' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button type="submit" className="btn btn-primary">Save Post</button>
                    <button type="button" onClick={() => setEditingItem(null)} className="btn btn-secondary">Cancel</button>
                  </div>
                </form>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {blogs.map(b => (
                    <div key={b._id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4>{b.title}</h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{b.category} &bull; Views: {b.views}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => startEdit('blog', b)} className="btn btn-secondary" style={{ padding: '6px' }}><Edit size={14} /></button>
                        <button onClick={() => handleDelete('blog', b._id)} className="btn btn-danger" style={{ padding: '6px', border: 'none' }}><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: CERTIFICATES CRUD */}
          {activeTab === 'certs' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '1.5rem' }}>Certifications</h3>
                {!editingItem && (
                  <button onClick={() => startEdit('certificate', null)} className="btn btn-primary" style={{ padding: '8px 16px' }}>
                    <Plus size={16} /> Add Cert
                  </button>
                )}
              </div>

              {editingItem?.type === 'certificate' ? (
                <form onSubmit={handleSaveItem} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Certification Title</label>
                    <input type="text" className="form-control" value={certForm.title} onChange={e => setCertForm({...certForm, title: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Issuer</label>
                    <input type="text" className="form-control" value={certForm.issuer} onChange={e => setCertForm({...certForm, issuer: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Issue Date</label>
                    <input type="date" className="form-control" value={certForm.issueDate} onChange={e => setCertForm({...certForm, issueDate: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Credential Verification URL</label>
                    <input type="text" className="form-control" value={certForm.credentialUrl} onChange={e => setCertForm({...certForm, credentialUrl: e.target.value})} />
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button type="submit" className="btn btn-primary">Save Certificate</button>
                    <button type="button" onClick={() => setEditingItem(null)} className="btn btn-secondary">Cancel</button>
                  </div>
                </form>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {certs.map(c => (
                    <div key={c._id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4>{c.title}</h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{c.issuer}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => startEdit('certificate', c)} className="btn btn-secondary" style={{ padding: '6px' }}><Edit size={14} /></button>
                        <button onClick={() => handleDelete('certificate', c._id)} className="btn btn-danger" style={{ padding: '6px', border: 'none' }}><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: MESSAGES VIEW */}
          {activeTab === 'messages' && (
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '24px' }}>Contact Messages Inbox</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {messages.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)' }}>No messages received yet.</p>
                ) : (
                  messages.map(m => (
                    <div key={m._id} className="glass-panel" style={{
                      padding: '20px',
                      borderLeft: m.read ? 'none' : '4px solid var(--accent)',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div>
                          <strong>{m.name}</strong> &bull; <span style={{ color: 'var(--text-secondary)' }}>{m.email}</span>
                          <h4 style={{ marginTop: '4px' }}>{m.subject}</h4>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', height: 'fit-content' }}>
                          <button onClick={() => handleToggleRead(m._id)} className="btn btn-secondary" style={{ padding: '6px' }} title={m.read ? 'Mark Unread' : 'Mark Read'}>
                            <Check size={14} style={{ color: m.read ? 'var(--text-muted)' : 'var(--success)' }} />
                          </button>
                          <button onClick={() => handleDelete('contact', m._id)} className="btn btn-danger" style={{ padding: '6px', border: 'none' }}><Trash2 size={14} /></button>
                        </div>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>{m.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 7: RESUME UPLOAD */}
          {activeTab === 'resume' && (
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Upload Active Portfolio Resume</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
                Upload the primary developer PDF resume. The system will parse its technical content, run a Gemini analysis to extract credentials, and update the active resume display.
              </p>

              <form onSubmit={handleResumeUpload} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '450px' }}>
                <div className="form-group">
                  <label className="form-label">Resume PDF File</label>
                  <input
                    type="file"
                    accept=".pdf"
                    className="form-control"
                    onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                    required
                  />
                </div>
                <button type="submit" disabled={resumeLoading || !resumeFile} className="btn btn-primary" style={{ justifyContent: 'center' }}>
                  {resumeLoading ? 'Uploading & Analyzing...' : 'Upload Resume PDF'} <Upload size={16} />
                </button>
              </form>
            </div>
          )}

        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .admin-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
