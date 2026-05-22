import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client
const apiKey = process.env.GEMINI_API_KEY;
let genAI = null;
if (apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
} else {
  console.warn('WARNING: GEMINI_API_KEY is not set. Portfolio AI features will run in Mock Demo Mode.');
}

// Helper to check and retrieve Gemini model
const getModel = (systemInstruction) => {
  if (!genAI) return null;
  return genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    ...(systemInstruction ? { systemInstruction } : {}),
  });
};

/**
 * Analyzes resume content for ATS score, skills, improvements, and missing keywords.
 */
export const analyzeResume = async (resumeText) => {
  if (!genAI) {
    // Return high-quality mock analysis if no API key
    return {
      skillsIdentified: ['JavaScript', 'React.js', 'Node.js', 'Express', 'MongoDB', 'HTML5', 'CSS3', 'Git'],
      missingKeywords: ['Docker', 'CI/CD', 'AWS', 'TypeScript', 'Unit Testing', 'Redis'],
      improvements: [
        'Add quantitative metrics to your project achievements (e.g., "Improved load time by 30%").',
        'Incorporate cloud infrastructure details and CI/CD automation to match Senior Full-Stack profiles.',
        'Add TypeScript to highlight strong type-safety development skills.'
      ],
      atsScore: 72,
      rawGeminiFeedback: 'Resume lacks cloud services (AWS/GCP) and containerization tools (Docker). Incorporating these will boost ATS ranking for modern backend roles.'
    };
  }

  try {
    const model = getModel();
    const prompt = `
      You are an expert ATS (Applicant Tracking System) parser and technical recruiter.
      Analyze the following resume text for a "Full-Stack Developer & AI Enthusiast" profile.
      Return the output strictly as a JSON object with this exact structure:
      {
        "skillsIdentified": ["Skill1", "Skill2", ...],
        "missingKeywords": ["MissingKeyword1", "MissingKeyword2", ...],
        "improvements": ["Improvement suggestion 1", "Improvement suggestion 2", ...],
        "atsScore": 85, // number from 0 to 100
        "rawGeminiFeedback": "Overall summary paragraph"
      }
      Do not wrap the JSON output in markdown tags (like \`\`\`json). Return ONLY valid raw JSON.

      Resume Text:
      ${resumeText}
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    
    // Clean potential markdown fencing from Gemini response
    const cleanJSON = text.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
    return JSON.parse(cleanJSON);
  } catch (error) {
    console.error('Gemini Resume Analyzer Error:', error);
    throw new Error('AI analysis failed. Please try again.');
  }
};

/**
 * Recommends career paths, techs to learn, and roadmaps based on user inputs.
 */
export const getCareerAdvice = async (skills, interests) => {
  if (!genAI) {
    return {
      careerPaths: [
        { title: 'Full-Stack Developer', match: '95%', reason: 'Strong JavaScript and MERN background.' },
        { title: 'AI Engineer', match: '80%', reason: 'Excellent curiosity in AI/ML concepts and API integration.' }
      ],
      technologiesToLearn: ['TypeScript', 'Docker', 'Python', 'Next.js', 'PyTorch'],
      certifications: ['AWS Certified Developer', 'TensorFlow Developer Certificate'],
      roadmap: [
        { phase: 'Month 1: Infrastructure', items: ['Learn Docker containerization', 'Deploy backend apps to AWS ECS'] },
        { phase: 'Month 2: Next.js & TypeScript', items: ['Convert React projects to Next.js', 'Adopt TypeScript for structural type safety'] },
        { phase: 'Month 3: Advanced AI/ML', items: ['Fine-tune open-source models using HuggingFace', 'Build RAG pipelines'] }
      ]
    };
  }

  try {
    const model = getModel();
    const prompt = `
      You are an elite career advisor and developer mentor.
      Based on the following skills and career interests, provide career path matches, target technologies, recommended certifications, and a 3-phase preparation roadmap.
      
      Skills: ${skills}
      Interests: ${interests}

      Return the response strictly as a JSON object with this exact structure:
      {
        "careerPaths": [
          { "title": "Job Title", "match": "90%", "reason": "Short explanation" }
        ],
        "technologiesToLearn": ["Tech1", "Tech2"],
        "certifications": ["Cert1", "Cert2"],
        "roadmap": [
          { "phase": "Phase Title", "items": ["Task 1", "Task 2"] }
        ]
      }
      Do not wrap the JSON output in markdown tags. Return ONLY valid raw JSON.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleanJSON = text.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
    return JSON.parse(cleanJSON);
  } catch (error) {
    console.error('Gemini Career Advisor Error:', error);
    throw new Error('AI Career Advising failed. Please try again.');
  }
};

/**
 * Generates technical/HR/behavioral questions.
 */
export const getInterviewQuestion = async (type, category) => {
  if (!genAI) {
    const questions = {
      technical: `Can you explain the difference between Virtual DOM and Shadow DOM in React?`,
      behavioral: `Tell me about a time you had a conflict with a teammate. How did you resolve it?`,
      hr: `Why do you want to join our organization and what makes you a good fit?`
    };
    return {
      question: questions[type] || 'Explain your experience with RESTful APIs.',
      category: category || 'General Coding'
    };
  }

  try {
    const model = getModel();
    const prompt = `
      Generate a single interview question.
      Type: ${type} (HR, Technical, or Behavioral)
      Category/Topic: ${category}
      
      Return the output strictly as a JSON object:
      {
        "question": "The actual question text",
        "category": "Topic"
      }
      Ensure the question is professional and realistic.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleanJSON = text.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
    return JSON.parse(cleanJSON);
  } catch (error) {
    console.error('Gemini Interview Assistant Error:', error);
    throw new Error('Question generation failed.');
  }
};

/**
 * Evaluates the interview answer and returns grades.
 */
export const gradeInterviewAnswer = async (question, answer) => {
  if (!genAI) {
    return {
      score: 75,
      feedback: 'Good answer, but you should explain the performance benefits and discuss specific trade-offs.',
      improvements: [
        'Mention actual reconciliation algorithm details.',
        'Use the STAR method for behavioral responses.',
        'Structure your answer with a summary, action, and key results.'
      ]
    };
  }

  try {
    const model = getModel();
    const prompt = `
      Analyze the candidate's answer to the following interview question. Grade their answer out of 100.
      Provide constructive feedback and a bullet-point list of suggested improvements.

      Question: ${question}
      Candidate Answer: ${answer}

      Return the response strictly as a JSON object:
      {
        "score": 85, // out of 100
        "feedback": "Paragraph explaining their performance, strengths, and weaknesses",
        "improvements": ["Improvement suggestion 1", "Improvement suggestion 2"]
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleanJSON = text.replace(/^```json\s*/i, '').replace(/```$/, '').trim();
    return JSON.parse(cleanJSON);
  } catch (error) {
    console.error('Gemini Interview Grading Error:', error);
    throw new Error('Grading failed.');
  }
};

/**
 * Chatbot responding based on Portfolio database content.
 */
export const chatbotQuery = async (userMessage, history, portfolioContext) => {
  const systemInstruction = `
    You are the AI Assistant for the developer portfolio of this developer.
    Here is the official portfolio database context:
    - SKILLS: ${JSON.stringify(portfolioContext.skills || [])}
    - PROJECTS: ${JSON.stringify(portfolioContext.projects || [])}
    - CERTIFICATIONS: ${JSON.stringify(portfolioContext.certificates || [])}
    - GENERAL INFO: Computer Science student, Full-Stack MERN Developer, AI Enthusiast.
    
    Answer user queries concisely and professionally. Focus only on this developer's achievements, skills, and portfolio.
    If the question is unrelated to the portfolio, answer politely that you are trained only on this developer's career information.
  `;

  if (!genAI) {
    return `Hello! In mock mode, I can tell you that this developer is a Full-Stack Developer and AI Enthusiast skilled in React, Express, MongoDB, and Python. Some featured projects include a real-time Chat App and an AI Resume Analyzer! How can I help you?`;
  }

  try {
    const model = getModel(systemInstruction);
    
    // Format conversation history for Gemini chat
    const chat = model.startChat({
      history: history.map(h => ({
        role: h.sender === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessage(userMessage);
    return result.response.text();
  } catch (error) {
    console.error('Gemini Chatbot Error:', error);
    return 'I apologize, but I am facing connectivity issues. Please try again.';
  }
};
