import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, User, Eye, ArrowRight } from 'lucide-react';
import { API_BASE } from '../context/AuthContext';
import { GridSkeleton } from '../components/LoadingSkeleton';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const defaultBlogs = [
    {
      _id: '1',
      title: 'Deploying MERN Applications with Docker',
      slug: 'deploying-mern-applications-with-docker',
      summary: 'Learn how to containerize MongoDB, Express, and React applications using Docker Compose for streamlined local dev and production builds.',
      category: 'Cloud/DevOps',
      views: 145,
      createdAt: '2026-05-10T12:00:00Z',
    },
    {
      _id: '2',
      title: 'Harnessing Google Gemini API in React Platforms',
      slug: 'harnessing-google-gemini-api-in-react-platforms',
      summary: 'A step-by-step developer tutorial on configuring Google Generative AI APIs inside Express backend routes and presenting LLM prompts inside React views.',
      category: 'AI/ML',
      views: 284,
      createdAt: '2026-05-15T09:30:00Z',
    },
    {
      _id: '3',
      title: 'Optimizing MongoDB Aggregation Pipelines',
      slug: 'optimizing-mongodb-aggregation-pipelines',
      summary: 'Boost database retrieval performance by refining Aggregation pipeline stages, utilizing indexes effectively, and structuring compound queries.',
      category: 'Database',
      views: 92,
      createdAt: '2026-05-20T16:45:00Z',
    }
  ];

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (category !== 'All') queryParams.append('category', category);
        if (search) queryParams.append('search', search);

        const res = await fetch(`${API_BASE}/blogs?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setBlogs(data.length ? data : defaultBlogs.filter(b => {
            const matchesCat = category === 'All' || b.category === category;
            const matchesSearch = !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.summary.toLowerCase().includes(search.toLowerCase());
            return matchesCat && matchesSearch;
          }));
        } else {
          throw new Error();
        }
      } catch (err) {
        setBlogs(defaultBlogs.filter(b => {
          const matchesCat = category === 'All' || b.category === category;
          const matchesSearch = !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.summary.toLowerCase().includes(search.toLowerCase());
          return matchesCat && matchesSearch;
        }));
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchBlogs();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, category]);

  useEffect(() => {
    // Track page view
    fetch(`${API_BASE}/analytics/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: '/blogs', referrer: document.referrer || 'Direct' }),
    }).catch(() => {});
  }, []);

  const categories = ['All', 'AI/ML', 'Cloud/DevOps', 'Database', 'Frontend'];

  return (
    <div className="container section">
      <h2 className="section-title">Developer Blog</h2>

      {/* Controls panel */}
      <div className="glass-panel" style={{
        padding: '20px',
        marginBottom: '40px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Search Input */}
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
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '40px' }}
          />
        </div>

        {/* Category Sorting buttons */}
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

      {/* Blogs list */}
      {loading ? (
        <GridSkeleton count={3} />
      ) : blogs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          No articles match your search criteria. Try a different query.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px',
        }}>
          {blogs.map((blog) => (
            <article key={blog._id} className="glass-card" style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%'
            }}>
              <div>
                {/* Meta details */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  marginBottom: '12px'
                }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--accent-secondary)',
                    textTransform: 'uppercase'
                  }}>{blog.category}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} />
                    {new Date(blog.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', lineHeight: '1.4' }}>{blog.title}</h3>
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.95rem',
                  marginBottom: '20px',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  lineHeight: '1.5'
                }}>{blog.summary}</p>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid var(--glass-border)',
                paddingTop: '16px',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <Eye size={14} /> {blog.views} views
                </span>

                <Link to={`/blogs/${blog.slug}`} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: 'var(--accent)',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                }}>
                  Read Post <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blogs;
