import fs from 'fs';
import pdf from 'pdf-parse';
import ResumeData from '../models/ResumeData.js';
import { analyzeResume } from '../services/geminiService.js';

/**
 * @desc    Upload and analyze resume
 * @route   POST /api/resume/upload
 * @access  Private (Admin only, or public user testing resume)
 */
export const uploadAndAnalyzeResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a PDF resume file.' });
  }

  try {
    // Read PDF
    const dataBuffer = fs.readFileSync(req.file.path);
    const parsedPdf = await pdf(dataBuffer);
    const extractedText = parsedPdf.text;

    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({ message: 'Could not extract text from the PDF. Ensure it is not an image-only PDF.' });
    }

    // Call Gemini Service for ATS Analysis
    const aiAnalysis = await analyzeResume(extractedText);

    // Save to Database
    // Set all other resumes to inactive
    await ResumeData.updateMany({}, { isActive: false });

    const newResume = new ResumeData({
      filename: req.file.originalname,
      filePath: req.file.path,
      extractedText,
      atsScore: aiAnalysis.atsScore || 0,
      analysis: {
        skillsIdentified: aiAnalysis.skillsIdentified || [],
        missingKeywords: aiAnalysis.missingKeywords || [],
        improvements: aiAnalysis.improvements || [],
        rawGeminiFeedback: aiAnalysis.rawGeminiFeedback || '',
      },
      isActive: true,
    });

    const savedResume = await newResume.save();
    res.status(201).json(savedResume);
  } catch (error) {
    console.error('Upload & Analyze Resume Error:', error);
    res.status(500).json({ message: error.message || 'Internal server error.' });
  }
};

/**
 * @desc    Get the active resume details (ATS score, files)
 * @route   GET /api/resume/active
 * @access  Public
 */
export const getActiveResume = async (req, res) => {
  try {
    const resume = await ResumeData.findOne({ isActive: true });
    if (resume) {
      res.json(resume);
    } else {
      res.json(null); // Return null with 200 OK to avoid browser console error
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Download the active resume file
 * @route   GET /api/resume/download
 * @access  Public
 */
export const downloadActiveResume = async (req, res) => {
  try {
    const resume = await ResumeData.findOne({ isActive: true });
    if (resume) {
      if (fs.existsSync(resume.filePath)) {
        res.download(resume.filePath, resume.filename);
      } else {
        res.status(404).json({ message: 'Resume file not found on disk' });
      }
    } else {
      res.status(404).json({ message: 'No active resume found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Analyze a resume publicly (for visitors) without saving it to database
 * @route   POST /api/resume/analyze
 * @access  Public
 */
export const analyzeResumePublic = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a PDF resume file.' });
  }

  try {
    const dataBuffer = fs.readFileSync(req.file.path);
    const parsedPdf = await pdf(dataBuffer);
    const extractedText = parsedPdf.text;

    if (!extractedText || extractedText.trim().length === 0) {
      // Clean up file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Could not extract text from the PDF. Ensure it is not image-only.' });
    }

    const aiAnalysis = await analyzeResume(extractedText);

    // Remove the file immediately to conserve disk space
    fs.unlinkSync(req.file.path);

    res.json({
      filename: req.file.originalname,
      atsScore: aiAnalysis.atsScore || 0,
      analysis: {
        skillsIdentified: aiAnalysis.skillsIdentified || [],
        missingKeywords: aiAnalysis.missingKeywords || [],
        improvements: aiAnalysis.improvements || [],
        rawGeminiFeedback: aiAnalysis.rawGeminiFeedback || '',
      }
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Public Resume Audit Error:', error);
    res.status(500).json({ message: error.message || 'Internal server error.' });
  }
};

