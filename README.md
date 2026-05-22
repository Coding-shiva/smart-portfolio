# Smart Developer Portfolio & AI Career Platform

A production-ready MERN-stack Developer Portfolio Platform integrated with Google Gemini AI to serve as an interactive credentials showcase, recruiter tool, and student career coach.

---

## 🚀 Key Features

1. **AI Resume Parser & Optimizer (ATS Scoring)**
   - Upload any PDF resume.
   - Powered by Gemini to extract structured content, calculate an ATS compatibility score, highlight identified skills, flag missing keywords, and suggest improvements.

2. **AI Career Advisor & Personalized Roadmap**
   - Provide your technical background and career interests.
   - The AI recommends target role matches, certifications, specific skill masteries, and generates a phased learning timeline roadmap.

3. **AI Interview Simulator**
   - Participate in simulated technical, HR, or behavioral interview rounds.
   - Prompts generate dynamic coding, architecture, or behavior questions.
   - Evaluates your typed response transcripts and provides constructive feedback and rating scores.

4. **Gemini Chatbot Assistant**
   - Interactive conversational widget pre-conditioned on the developer's resume details.
   - Answers recruiter queries about qualifications, stack preferences, and credentials.

5. **Coding Profiles Dashboard**
   - Interactive charts using Recharts for Github, LeetCode, and HackerRank statistics.
   - **Result**: Resolved the layout width/height warning, ensuring charts render smoothly under flex/grid containers.

6. **Shivanand Sharma Resume Seeding & Personalization**
   - **Database Seeding**: Created and executed [seedShivanandData.js](file:///c:/Users/shivanand%20sharma/Desktop/myprotfolio/backend/scripts/seedShivanandData.js) to clear old records and populate the MongoDB Atlas database with Shivanand's actual details:
     - **24 Skills** mapped correctly (Frontend, Backend, Database, AI/ML, Cloud/DevOps).
     - **4 Projects** (AI Multi-Agent Sales Lead System, MERN Grocery App, Blinkit Analytics, Diabetes Prediction Model).
     - **5 Certifications** (IBM AI, Kaggle Machine Learning, HackerRank Python/Java/SQL).
     - **2 Tech Blogs** on AI Workflows & MERN Production Deployments.
   - **Frontend Personalization**: Updated [Home.jsx](file:///c:/Users/shivanand%20sharma/Desktop/myprotfolio/frontend/src/pages/Home.jsx) to update the default template with Shivanand's actual name, titles, professional summary, highlights, and academic timeline.

7. **Admin Dashboard (CMS & Analytics)**
   - CRUD management panel for Projects, Skills, Blogs, and Certifications.
   - Pageviews and device breakdown charts (visitors are tracked with browser metadata).
   - Inbound email/message contact inbox.

---

## 🛠️ Technology Stack

- **Frontend**: React.js, Vite, React Router, Recharts, Framer Motion, Lucide React, CSS (Glassmorphism design).
- **Backend**: Node.js, Express.js, Multer (PDF uploads), PDF-Parse (Resume text extraction), Nodemailer.
- **Database**: MongoDB (Atlas ready), Mongoose ODM.
- **AI Engine**: Google Gemini API (`gemini-1.5-flash`).

---

## 📦 Setup & Installation

### Option 1: Running Locally

#### 1. Database Setup
Make sure MongoDB is running locally on your computer:
- Default Connection: `mongodb://localhost:27017/portfolio`

#### 2. Backend Installation
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Copy and configure the environment variables:
   ```bash
   cp .env.example .env
   ```
3. Update the `.env` settings:
   - `MONGO_URI`: Your local MongoDB or MongoDB Atlas cluster connection string.
   - `GEMINI_API_KEY`: Google AI Studio Gemini API Key. *(If left blank, the server automatically defaults to high-quality interactive mock datasets so that all features work without keys).*
   - Nodemailer SMTP credentials (`SMTP_HOST`, `SMTP_PORT`, `EMAIL_USER`, `EMAIL_PASS`) for contact alerts. *(If blank, it falls back to console-logging the alerts).*
4. Install dependencies and start server:
   ```bash
   npm install
   npm run dev
   ```
   The backend server runs on: `http://localhost:5000`

#### 3. Frontend Installation
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies and start the Vite dev server:
   ```bash
   npm install
   npm run dev
   ```
   The frontend application runs on: `http://localhost:5173`

---

### Option 2: Running with Docker Compose 🐳

To orchestrate the client, server, and MongoDB services automatically in isolated containers:

1. Make sure you have **Docker Desktop** installed.
2. In the root workspace directory, run:
   ```bash
   docker-compose up --build
   ```
3. Docker will stand up:
   - **Frontend App**: Running on `http://localhost:8080`
   - **Backend API**: Running on `http://localhost:5000`
   - **MongoDB Service**: Running on port `27017`
4. Persistent database records are backed up inside the named volume `mongo-data`, and uploads inside `uploads-data`.

---

## 🔐 Seed Admin Credentials

When the backend server starts for the first time, it automatically creates a default administrator user:
- **Email**: `admin@portfolio.com`
- **Password**: `admin12345`

Log in using the **Admin Panel** link in the navigation menu. We strongly advise updating your password immediately in the dashboard after logging in!

---

## 📂 Project Architecture

```
├── backend/
│   ├── config/             # Database connection configurations
│   ├── controllers/        # Express handlers (Auth, Projects, Blogs, AI, Analytics)
│   ├── middleware/         # Auth verification, error catches, file uploads limit
│   ├── models/             # Mongoose schemas (User, Project, Skill, Certificate, Blog)
│   ├── routes/             # REST APIs
│   ├── services/           # Gemini & Email clients
│   ├── Dockerfile
│   └── server.js           # Server startup script
├── frontend/
│   ├── src/
│   │   ├── assets/         # Images & SVG assets
│   │   ├── components/     # Layout elements (Navbar, Footer, Toasts)
│   │   ├── context/        # Theme & Auth sessions
│   │   ├── pages/          # Home, Projects, CodingStats, AI pages, Admin Dashboard
│   │   ├── App.jsx         # App router config
│   │   └── index.css       # Core styles (Glassmorphism theme)
│   ├── Dockerfile
│   └── nginx.conf          # Router redirection for containerized frontend
└── docker-compose.yml       # Docker orchestrator configurations
```
