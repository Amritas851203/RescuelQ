import express from 'express';
import { getAIResponse } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// AI requests protected so only authenticated users can chat
router.post('/chat', protect, getAIResponse);

export default router;
