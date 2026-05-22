import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Import models
import Skill from '../models/Skill.js';
import Project from '../models/Project.js';
import Certificate from '../models/Certificate.js';
import Blog from '../models/Blog.js';

// Load env variables from backend/.env
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('Error: MONGO_URI is not defined in the environment variables.');
  process.exit(1);
}

const skillsData = [
  // Programming Languages -> Category: Backend
  { name: 'Python', category: 'AI/ML', level: 95 },
  { name: 'Java', category: 'Backend', level: 80 },
  { name: 'C', category: 'Backend', level: 85 },
  
  // Frontend
  { name: 'React.js', category: 'Frontend', level: 90 },
  { name: 'JavaScript', category: 'Frontend', level: 90 },
  { name: 'Tailwind CSS', category: 'Frontend', level: 85 },
  { name: 'HTML5 / CSS3', category: 'Frontend', level: 90 },
  { name: 'Streamlit', category: 'Frontend', level: 85 },

  // Backend
  { name: 'Node.js', category: 'Backend', level: 88 },
  { name: 'Express.js', category: 'Backend', level: 88 },
  { name: 'FastAPI', category: 'Backend', level: 85 },
  { name: 'REST APIs', category: 'Backend', level: 90 },
  { name: 'Data Structures & Algorithms', category: 'Backend', level: 88 },

  // Database
  { name: 'MongoDB', category: 'Database', level: 90 },
  { name: 'Mongoose ODM', category: 'Database', level: 90 },
  { name: 'DBMS / SQL', category: 'Database', level: 85 },

  // AI/ML
  { name: 'LangChain', category: 'AI/ML', level: 85 },
  { name: 'Scikit-learn', category: 'AI/ML', level: 85 },
  { name: 'TensorFlow', category: 'AI/ML', level: 75 },
  { name: 'Pandas & NumPy', category: 'AI/ML', level: 85 },
  { name: 'Matplotlib', category: 'AI/ML', level: 80 },

  // Cloud/DevOps
  { name: 'Git & GitHub', category: 'Cloud/DevOps', level: 90 },
  { name: 'Power BI', category: 'Cloud/DevOps', level: 80 },
  { name: 'Linux OS', category: 'Cloud/DevOps', level: 75 }
];

const projectsData = [
  {
    title: 'AI Multi-Agent Sales Lead Management System',
    description: 'Developed and implemented an AI-driven lead qualification process, decreasing cost per qualified lead by 15% and generating 75 additional qualified leads per month through automated CRM updates. Engineered an AI-powered multi-agent system automating four repetitive sales tasks, resulting in a 25% reduction in manual sales processing time and improved lead engagement rates.',
    technologies: ['Python', 'FastAPI', 'LangChain', 'MongoDB', 'Gmail API', 'Streamlit'],
    githubLink: 'https://github.com/Coding-shiva',
    liveLink: 'https://share.streamlit.io', // Placeholder link or streamlit
    category: 'AI/ML',
    featured: true,
    order: 1
  },
  {
    title: 'Grocery Delivery Web Application',
    description: 'Developed a full-stack MERN application with admin and user dashboards, improving system efficiency by 30%. Implemented product management, search, and order placement features, increasing user engagement by 25%.',
    technologies: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'Vercel'],
    githubLink: 'https://github.com/Coding-shiva',
    liveLink: 'https://grocery-app-ui.vercel.app',
    category: 'Full-Stack',
    featured: true,
    order: 2
  },
  {
    title: 'Blinkit Grocery Data Analytics',
    description: 'Identified inventory bottlenecks and proposed optimizations that improved delivery efficiency and inventory accuracy by 20% using statistical analysis and Power BI visualizations.',
    technologies: ['Python', 'Pandas', 'Excel', 'Power BI'],
    githubLink: 'https://github.com/Coding-shiva',
    liveLink: '',
    category: 'Data Science',
    featured: false,
    order: 3
  },
  {
    title: 'Diabetes Prediction Model',
    description: 'Enhanced diabetes prediction model by conducting five iterations, resulting in a 7% improvement in accuracy and a notable 9% increase in the F1-score metric.',
    technologies: ['Python', 'Scikit-learn', 'Pandas', 'NumPy'],
    githubLink: 'https://github.com/Coding-shiva',
    liveLink: '',
    category: 'AI/ML',
    featured: false,
    order: 4
  }
];

const certsData = [
  {
    title: 'IBM SkillsBuild — Artificial Intelligence (Grade A+)',
    issuer: 'ICT Academy',
    issueDate: new Date('2025-11-01'),
    credentialId: 'IBM-AI-2025',
    credentialUrl: 'https://skillsbuild.org/'
  },
  {
    title: 'Intermediate Machine Learning',
    issuer: 'Kaggle',
    issueDate: new Date('2025-05-15'),
    credentialId: 'Kaggle-IML-88',
    credentialUrl: 'https://www.kaggle.com/learn'
  },
  {
    title: 'Python Programming (4 Stars)',
    issuer: 'HackerRank',
    issueDate: new Date('2024-04-10'),
    credentialId: 'HR-Python-4S',
    credentialUrl: 'https://www.hackerrank.com/'
  },
  {
    title: 'Java Basic (5 Stars)',
    issuer: 'HackerRank',
    issueDate: new Date('2024-03-20'),
    credentialId: 'HR-Java-5S',
    credentialUrl: 'https://www.hackerrank.com/'
  },
  {
    title: 'SQL Intermediate (4 Stars)',
    issuer: 'HackerRank',
    issueDate: new Date('2024-06-25'),
    credentialId: 'HR-SQL-4S',
    credentialUrl: 'https://www.hackerrank.com/'
  }
];

const blogsData = [
  {
    title: 'Building AI Multi-Agent Systems for Lead Operations',
    summary: 'An in-depth look at how multi-agent architectures can automate sales workflows, reduce manual CRM overhead, and optimize lead qualification using LangChain and FastAPI.',
    content: '### Introduction\nIn modern sales operations, time is money. Automated CRM updates and intelligent lead parsing are key to scaling growth. In this post, we discuss the development of a multi-agent system that automates lead ingestion, sentiment classification, email response generation, and database updates.\n\n### The Architecture\nUsing LangChain agents, we configure separate tasks:\n1. **The Ingestion Agent**: Connects to the Gmail API and polls incoming emails.\n2. **The Scorer Agent**: Evaluates the leads using predefined parameters (company size, budget, role).\n3. **The Response Agent**: Drafts tailored follow-ups.\n4. **The Database sync**: Enters scoring statistics directly into MongoDB.\n\n### Results\nBy automating lead management, response processing times decreased by 25%, resulting in a 15% reduction in overall sales operations cost.',
    category: 'AI/ML',
    tags: ['AI', 'LangChain', 'FastAPI', 'Multi-Agents'],
    published: true
  },
  {
    title: 'Optimizing MERN Stack Apps for Production Deployments',
    summary: 'Best practices for production-ready full-stack projects, focusing on CORS policies, secure JWT authentication, and Docker Compose networking configuration.',
    content: '### Introduction\nMoving a MERN stack project from localhost to a secure production cloud environment requires proper architectural adjustments. Let\'s explore some security improvements that ensure reliable operations.\n\n### 1. Robust CORS Policy\nNever leave CORS configuration at `*` in production. Always verify origin lists using secure domains.\n\n### 2. HTTPS & SSL termination\nEnsure Nginx or a reverse proxy terminates SSL, and Node runs safely behind it. Mongoose connections to Atlas should use TLS 1.3 by default.\n\n### 3. Containerization\nUsing Docker simplifies orchestration. Setting up named volumes preserves local asset uploads and MongoDB records dynamically.',
    category: 'Full-Stack',
    tags: ['MERN', 'Docker', 'Nginx', 'MongoDB Atlas'],
    published: true
  }
];

const seedDatabase = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected!');

    // 1. Clean collections
    console.log('Clearing existing Collections...');
    await Skill.deleteMany({});
    await Project.deleteMany({});
    await Certificate.deleteMany({});
    await Blog.deleteMany({});
    console.log('Cleared!');

    // 2. Insert new data
    console.log('Seeding Skills...');
    await Skill.insertMany(skillsData);
    console.log(`Seeded ${skillsData.length} Skills.`);

    console.log('Seeding Projects...');
    await Project.insertMany(projectsData);
    console.log(`Seeded ${projectsData.length} Projects.`);

    console.log('Seeding Certificates...');
    await Certificate.insertMany(certsData);
    console.log(`Seeded ${certsData.length} Certificates.`);

    console.log('Seeding Blogs...');
    // Mongoose middle pre-save will automatically make slugs for blogs
    for (let blog of blogsData) {
      await Blog.create(blog);
    }
    console.log(`Seeded ${blogsData.length} Blogs.`);

    console.log('Database Seeding Completed Successfully! 🌱');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
