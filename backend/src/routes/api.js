import express from 'express';
import { getSOSReports, createSOSReport } from '../controllers/sosController.js';
import { handleTwilioWebhook } from '../controllers/twilioController.js';
import DispatchController from '../controllers/DispatchController.js';
import { signup, login, verifyOtp, forgotPassword, resetPassword } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

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

// Dispatch endpoints
router.get('/teams', DispatchController.getTeams);
router.get('/missions', DispatchController.getActiveMissions);
router.post('/dispatch/assign', DispatchController.assignMission);
router.post('/dispatch/auto', DispatchController.autoAssignAI);

// Twilio Webhook
router.post('/webhook/twilio', handleTwilioWebhook);

// Social Media Scanner Mock
router.post('/social/scan', (req, res) => {
  res.json({ message: 'Social scanner initiated', scanned: 12 });
});

export default router;
