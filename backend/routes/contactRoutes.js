import express from 'express';
import {
  submitContactMessage,
  getContactMessages,
  markMessageAsRead,
  deleteContactMessage,
} from '../controllers/contactController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(submitContactMessage)
  .get(protect, adminOnly, getContactMessages);

router.put('/:id/read', protect, adminOnly, markMessageAsRead);
router.delete('/:id', protect, adminOnly, deleteContactMessage);

export default router;
