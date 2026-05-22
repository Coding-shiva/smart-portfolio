import express from 'express';
import { trackPageview, getAnalyticsOverview } from '../controllers/analyticsController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/track', trackPageview);
router.get('/overview', protect, adminOnly, getAnalyticsOverview);

export default router;
