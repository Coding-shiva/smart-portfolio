import express from 'express';
import { uploadAndAnalyzeResume, getActiveResume, downloadActiveResume, analyzeResumePublic } from '../controllers/resumeController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/upload', protect, adminOnly, upload.single('resume'), uploadAndAnalyzeResume);
router.post('/analyze', upload.single('resume'), analyzeResumePublic);
router.get('/active', getActiveResume);
router.get('/download', downloadActiveResume);

export default router;
