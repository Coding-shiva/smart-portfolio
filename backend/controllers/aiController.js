import Project from '../models/Project.js';
import Skill from '../models/Skill.js';
import Certificate from '../models/Certificate.js';
import {
  getCareerAdvice,
  getInterviewQuestion,
  gradeInterviewAnswer,
  chatbotQuery,
} from '../services/geminiService.js';

/**
 * AI Career Advisor
 */
export const getAIRecommendations = async (req, res) => {
  const { skills, interests } = req.body;
  if (!skills || !interests) {
    return res.status(400).json({ message: 'Skills and interests are required.' });
  }

  try {
    const advice = await getCareerAdvice(skills, interests);
    res.json(advice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * AI Interview Assistant - Generate Question
 */
export const generateQuestion = async (req, res) => {
  const { type, category } = req.body;
  if (!type || !category) {
    return res.status(400).json({ message: 'Interview type and category/topic are required.' });
  }

  try {
    const questionData = await getInterviewQuestion(type, category);
    res.json(questionData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * AI Interview Assistant - Grade Answer
 */
export const gradeAnswer = async (req, res) => {
  const { question, answer } = req.body;
  if (!question || !answer) {
    return res.status(400).json({ message: 'Question and candidate answer are required.' });
  }

  try {
    const grade = await gradeInterviewAnswer(question, answer);
    res.json(grade);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * AI Portfolio Chatbot Q&A
 */
export const askChatbot = async (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ message: 'Message is required.' });
  }

  try {
    // 1. Fetch developer context from DB to enrich the chatbot prompt
    const skills = await Skill.find({}).select('name category level');
    const projects = await Project.find({}).select('title description technologies githubLink');
    const certificates = await Certificate.find({}).select('title issuer');

    const portfolioContext = {
      skills: skills.map(s => `${s.name} (${s.category} - ${s.level}%)`),
      projects: projects.map(p => `${p.title}: ${p.description} (Built using: ${p.technologies.join(', ')})`),
      certificates: certificates.map(c => `${c.title} by ${c.issuer}`),
    };

    // 2. Query Gemini with the user message, history, and DB context
    const response = await chatbotQuery(message, history || [], portfolioContext);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
