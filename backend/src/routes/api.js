import express from 'express';
import { getSOSReports, createSOSReport, updateSOSReport, updateSOSStatus } from '../controllers/sosController.js';
import { handleTwilioWebhook } from '../controllers/twilioController.js';
import DispatchController from '../controllers/DispatchController.js';
import { signup, login, verifyOtp, forgotPassword, resetPassword } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

import { getSocialAlerts, analyzePost, convertToIncident, archiveAlert } from '../controllers/socialController.js';

const router = express.Router();

// Auth Routes
router.post('/auth/signup', signup);
router.post('/auth/login', login);
router.post('/auth/verify-otp', verifyOtp);
router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/reset-password', resetPassword);

// SOS endpoints
router.get('/sos', authMiddleware, getSOSReports);
router.post('/sos', createSOSReport);
router.patch('/sos/:id', authMiddleware, updateSOSReport);
router.put('/sos/:id/status', authMiddleware, updateSOSStatus);

// Dispatch endpoints
router.get('/teams', DispatchController.getTeams);
router.get('/missions', DispatchController.getActiveMissions);
router.post('/dispatch/assign', DispatchController.assignMission);
router.post('/dispatch/auto', DispatchController.autoAssignAI);
router.post('/dispatch/recall', authMiddleware, DispatchController.recallMission);
router.post('/dispatch/hold', authMiddleware, DispatchController.holdMission);

// Social Scanner endpoints
router.get('/social/alerts', authMiddleware, getSocialAlerts);
router.post('/social/analyze', authMiddleware, analyzePost);
router.post('/social/convert', authMiddleware, convertToIncident);
router.post('/social/archive', authMiddleware, archiveAlert);

// Twilio Webhook
router.post('/webhook/twilio', handleTwilioWebhook);

export default router;
