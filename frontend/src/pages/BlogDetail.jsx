import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Calendar, Eye, Clock, Bookmark } from 'lucide-react';
import { API_BASE } from '../context/AuthContext';
import { TextSkeleton } from '../components/LoadingSkeleton';

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const defaultBlogs = [
    {
      _id: '1',
      title: 'Deploying MERN Applications with Docker',
      slug: 'deploying-mern-applications-with-docker',
      summary: 'Learn how to containerize MongoDB, Express, and React applications using Docker Compose for streamlined local dev and production builds.',
      content: `# Containerizing MERN Apps with Docker

Docker helps encapsulate application processes, assuring consistency across deployment servers. In this article, we construct multi-container builds connecting React, Node-Express, and MongoDB.

## 1. Structure outline
We set directories under a unified workspace:
- \`backend/\` -> containing Node.js Express server
- \`frontend/\` -> containing React Vite template
- \`docker-compose.yml\` -> orchestrating the environment

## 2. Dockerfile for Backend
\`\`\`dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
\`\`\`

## 3. Docker Compose Orchestration
The root compose outlines services, environment values, and network connections:
\`\`\`yaml
version: "3.8"
services:
  db:
    image: mongo:latest
    ports:
      - "27017:27017"
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGO_URI=mongodb://db:27017/portfolio
    depends_on:
      - db
\`\`\`
Use \`docker-compose up --build\` to launch the application.`,
      category: 'Cloud/DevOps',
      views: 145,
      createdAt: '2026-05-10T12:00:00Z',
    },
    {
      _id: '2',
      title: 'Harnessing Google Gemini API in React Platforms',
      slug: 'harnessing-google-gemini-api-in-react-platforms',
      summary: 'A step-by-step developer tutorial on configuring Google Generative AI APIs inside Express backend routes and presenting LLM prompts inside React views.',
      content: `# Integrating Gemini API

Large language models unlock smart capabilities inside portfolios. This walkthrough shows how to connect Google Gemini.

## API Setup
Obtain an API key from Google AI Studio, then install:
\`\`\`bash
npm i @google/generative-ai
\`\`\`

## Node.js route logic
Initialize client instances:
\`\`\`javascript
import { GoogleGenerativeAI } from '@google/generative-ai';
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
\`\`\`

Send prompts to get text completions:
\`\`\`javascript
const result = await model.generateContent("Give 3 resume improvement tips.");
console.log(result.response.text());
\`\`\``,
      category: 'AI/ML',
      views: 284,
      createdAt: '2026-05-15T09:30:00Z',
    }
  ];

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/blogs/slug/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setBlog(data);
        } else {
          throw new Error('Article not found');
        }
      } catch (err) {
        const fallback = defaultBlogs.find(b => b.slug === slug);
        if (fallback) {
          setBlog(fallback);
        } else {
          setError('Article could not be found.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="container section">
        <Link to="/blogs" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '24px' }}>
          <ArrowLeft size={16} /> Back to Blogs
        </Link>
        <div className="glass-panel" style={{ padding: '40px' }}>
          <div className="skeleton" style={{ height: '40px', width: '60%', marginBottom: '20px' }} />
          <TextSkeleton lines={10} />
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container section" style={{ textAlign: 'center' }}>
        <h2>Error</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '16px 0 24px' }}>{error || 'Article not found.'}</p>
        <Link to="/blogs" className="btn btn-primary">
          <ArrowLeft size={18} /> Back to Blogs
        </Link>
      </div>
    );
  }

  // Calculate approximate reading time
  const wordCount = blog.content.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200); // Average 200 wpm

  return (
    <div className="container section">
      <Link to="/blogs" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        color: 'var(--text-secondary)',
        textDecoration: 'none',
        marginBottom: '24px',
        fontWeight: 500,
      }}>
        <ArrowLeft size={16} /> Back to Blogs
      </Link>

      <article className="glass-panel" style={{ padding: '40px', maxWidth: '850px', margin: '0 auto' }}>
        {/* Header Metadata */}
        <span style={{
          fontSize: '0.8rem',
          fontWeight: 600,
          color: 'var(--accent-secondary)',
          textTransform: 'uppercase',
        }}>{blog.category}</span>
        
        <h1 style={{ fontSize: '2.5rem', marginTop: '12px', marginBottom: '16px', lineHeight: '1.3' }}>{blog.title}</h1>

        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px',
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          borderBottom: '1px solid var(--glass-border)',
          paddingBottom: '20px',
          marginBottom: '32px'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={16} />
            {new Date(blog.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={16} />
            {readTime} min read
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Eye size={16} />
            {blog.views} views
          </span>
        </div>

        {/* Markdown Render Body */}
        <div style={{
          color: 'var(--text-secondary)',
          lineHeight: '1.8',
          fontSize: '1.1rem',
        }} className="markdown-body">
          <ReactMarkdown>{blog.content}</ReactMarkdown>
        </div>
      </article>

      {/* Styled element overrides inside markdown markup */}
      <style>{`
        .markdown-body h1, .markdown-body h2, .markdown-body h3 {
          margin-top: 32px;
          margin-bottom: 16px;
          color: var(--text-primary);
        }
        .markdown-body p {
          margin-bottom: 20px;
        }
        .markdown-body ul, .markdown-body ol {
          margin-bottom: 20px;
          padding-left: 24px;
        }
        .markdown-body li {
          margin-bottom: 8px;
        }
        .markdown-body pre {
          background-color: var(--bg-secondary);
          border: 1px solid var(--glass-border);
          border-radius: 8px;
          padding: 16px;
          overflow-x: auto;
          margin-bottom: 20px;
          font-family: 'Courier New', Courier, monospace;
          font-size: 0.95rem;
        }
        .markdown-body code {
          background-color: var(--bg-secondary);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 0.9em;
        }
        .markdown-body pre code {
          background-color: transparent;
          padding: 0;
          border-radius: 0;
          font-size: inherit;
        }
        .markdown-body blockquote {
          border-left: 4px solid var(--accent);
          padding-left: 16px;
          margin: 0 0 20px 0;
          font-style: italic;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};

export default BlogDetail;
