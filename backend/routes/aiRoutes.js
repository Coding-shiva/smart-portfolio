import express from 'express';
import {
  getAIRecommendations,
  generateQuestion,
  gradeAnswer,
  askChatbot,
} from '../controllers/aiController.js';

const router = express.Router();

router.post('/career', getAIRecommendations);
router.post('/interview/question', generateQuestion);
router.post('/interview/grade', gradeAnswer);
router.post('/chatbot', askChatbot);

export default router;
