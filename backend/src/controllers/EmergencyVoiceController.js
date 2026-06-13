import geminiService from '../services/geminiService.js';
import SOSReport from '../models/SOSReport.js';

export const handleVoiceWebhook = async (req, res) => {
  const { SpeechResult, incidentId, CallSid, Language = 'en-IN' } = req.body;
  const io = req.io;

  console.log(`[Voice Webhook] Received speech for incident ${incidentId}: "${SpeechResult}"`);

  try {
    // 1. Fetch incident context
    let incidentData = { type: 'Incident', severity: 'Critical', address: 'Unknown', aiSummary: 'Critical intelligence dispatch.' };
    
    if (incidentId) {
      const data = await SOSReport.findById(incidentId);
      if (data) {
        incidentData = {
          type: data.type || 'Incident',
          severity: data.severity,
          address: data.message?.split('|')[0] || 'Unknown Location',
          aiSummary: data.message
        };
      }
    }

    // 2. Emit transcript to frontend
    if (io) {
      io.emit('LIVE_TRANSCRIPT', {
        call_sid: CallSid,
        incident_id: incidentId,
        text: SpeechResult,
        source: 'Responder',
        timestamp: new Date().toISOString()
      });
    }

    // 3. Process with AI
    const aiResponse = await geminiService.generateEmergencyResponse(SpeechResult, incidentData);
    console.log(`[AI Response] Generated tactical reply: "${aiResponse}"`);

    // 4. Emit AI response to frontend
    if (io) {
      io.emit('LIVE_TRANSCRIPT', {
        call_sid: CallSid,
        incident_id: incidentId,
        text: aiResponse,
        source: 'AI Agent',
        timestamp: new Date().toISOString()
      });
    }

    // 5. Generate new TwiML to speak response and continue gathering
    const callbackUrl = `${process.env.BACKEND_URL || 'http://localhost:5001'}/api/emergency/voice-webhook?incidentId=${incidentId}`;
    
    res.set('Content-Type', 'text/xml');
    res.send(`
      <Response>
        <Say voice="${Language.startsWith('hi') ? 'Polly.Aditi' : 'Polly.Salli'}" language="${Language}">
          ${aiResponse}
        </Say>
        <Gather input="speech" action="${callbackUrl}" speechTimeout="auto" language="${Language}">
          <Say voice="${Language.startsWith('hi') ? 'Polly.Aditi' : 'Polly.Salli'}" language="${Language}">
            Speak now to continue tactical briefing.
          </Say>
        </Gather>
        <Say voice="${Language.startsWith('hi') ? 'Polly.Aditi' : 'Polly.Salli'}" language="${Language}">
          End of tactical link. Stay safe.
        </Say>
      </Response>
    `);
  } catch (error) {
    console.error('Voice Webhook Error:', error);
    res.set('Content-Type', 'text/xml');
    res.send(`
      <Response>
        <Say voice="Polly.Salli">An error occurred in the tactical link. Please standby for manual dispatch.</Say>
      </Response>
    `);
  }
};
