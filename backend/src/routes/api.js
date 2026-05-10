import express from 'express';
import { getSOSReports, createSOSReport } from '../controllers/sosController.js';
import { handleTwilioWebhook } from '../controllers/twilioController.js';
import DispatchController from '../controllers/DispatchController.js';

const router = express.Router();

// SOS endpoints
router.get('/sos', getSOSReports);
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
