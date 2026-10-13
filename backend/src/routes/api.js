import express from 'express';
import { getSOSReports, createSOSReport, updateSOSReport, updateSOSStatus } from '../controllers/sosController.js';
import { handleTwilioWebhook } from '../controllers/twilioController.js';
import DispatchController from '../controllers/DispatchController.js';
import { 
  signup, 
  login, 
  verifyOtp, 
  forgotPassword, 
  resetPassword, 
  logout, 
  getMe 
} from '../controllers/authController.js';
import { authMiddleware, authorize } from '../middleware/authMiddleware.js';
import { getSocialAlerts, analyzePost, convertToIncident, archiveAlert } from '../controllers/socialController.js';
import { getAIResponse } from '../controllers/aiController.js';
import { 
  getCallLogs, 
  getContacts, 
  manualTriggerCall, 
  handleCallStatusWebhook, 
  getCallAnalytics 
} from '../controllers/EmergencyCallController.js';
import { handleVoiceWebhook } from '../controllers/EmergencyVoiceController.js';

const router = express.Router();

// ================= AUTHENTICATION ROUTES =================
router.post('/auth/signup', signup);
router.post('/auth/login', login);
router.post('/auth/verify-otp', verifyOtp);
router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/reset-password', resetPassword);
router.post('/auth/logout', authMiddleware, logout);
router.get('/auth/me', authMiddleware, getMe);

// ================= SOS & INCIDENT REPORTING =================
router.get('/sos', authMiddleware, getSOSReports);
router.post('/sos', createSOSReport); // Public emergency creation
router.patch('/sos/:id', authMiddleware, updateSOSReport);
router.put('/sos/:id/status', authMiddleware, updateSOSStatus);

// ================= TEAM DISPATCH & FLEET =================
router.get('/teams', DispatchController.getTeams);
router.get('/missions', DispatchController.getActiveMissions);
router.post('/dispatch/assign', authMiddleware, DispatchController.assignMission);
router.post('/dispatch/auto', authMiddleware, DispatchController.autoAssignAI);
router.post('/dispatch/recall', authMiddleware, DispatchController.recallMission);
router.post('/dispatch/hold', authMiddleware, DispatchController.holdMission);

// ================= SOCIAL SCANNER & EARLY WARNING =================
router.get('/social/alerts', authMiddleware, getSocialAlerts);
router.post('/social/analyze', authMiddleware, analyzePost);
router.post('/social/convert', authMiddleware, convertToIncident);
router.post('/social/archive', authMiddleware, archiveAlert);

// ================= EMERGENCY VOICE & CALLING (MONGODB MIGRATED) =================
router.get('/emergency/call-logs', authMiddleware, getCallLogs);
router.get('/emergency/contacts', authMiddleware, getContacts);
router.get('/emergency/analytics', authMiddleware, getCallAnalytics);
router.post('/emergency/call', authMiddleware, manualTriggerCall);
router.post('/emergency/call-status', handleCallStatusWebhook);
router.post('/emergency/voice-webhook', handleVoiceWebhook);

// ================= TWILIO WEBHOOK =================
router.post('/webhook/twilio', handleTwilioWebhook);

// ================= AI CHATBOT ROUTE =================
router.post('/ai/chat', authMiddleware, getAIResponse);

export default router;
