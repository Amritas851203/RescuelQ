import { processAudioToText, classifySeverityAndLocation } from '../services/aiService.js';
import SOSReport from '../models/SOSReport.js';

export const handleTwilioWebhook = async (req, res) => {
  try {
    const { RecordingUrl, From, CallSid } = req.body;

    console.log(`Received Twilio webhook for call ${CallSid} from ${From}`);
    
    if (!RecordingUrl) {
      console.log('No recording URL, using mock processing for demo');
    }

    // 1. Process Audio to Text (Whisper)
    const { text, language } = await processAudioToText(RecordingUrl);
    console.log(`Transcription: ${text}`);

    // 2. Classify Severity and Extract Location (Claude)
    const aiAnalysis = await classifySeverityAndLocation(text);
    console.log(`AI Analysis:`, aiAnalysis);

    // 3. Save to MongoDB
    const report = await SOSReport.create({
      reporter_name: From || 'Twilio Call',
      location_lat: aiAnalysis.location?.lat || 19.0760,
      location_lng: aiAnalysis.location?.lng || 72.8777,
      message: `[TWILIO CALL] ${text} | Summary: ${aiAnalysis.summary}`,
      severity: aiAnalysis.severity || 'high',
      affected_people: 1,
      risk_level: aiAnalysis.urgency_score || 7,
      status: 'Pending',
      type: 'Emergency'
    });

    const formattedIncident = {
      ...report.toObject(),
      id: report._id.toString(),
      location: { lat: report.location_lat, lng: report.location_lng },
      callerName: report.reporter_name,
      type: report.type || 'Emergency'
    };

    // 4. Emit Realtime Event via Socket.IO
    req.io.emit('NEW_SOS_REPORT', formattedIncident);
    console.log('Emitted NEW_SOS_REPORT event to clients');

    // Return TwiML response to end the call gracefully
    res.set('Content-Type', 'text/xml');
    res.send(`
      <Response>
        <Say voice="alice">Your emergency has been recorded and rescue teams have been alerted. Stay safe.</Say>
      </Response>
    `);
  } catch (error) {
    console.error('Twilio Webhook Error:', error);
    res.set('Content-Type', 'text/xml');
    res.send(`
      <Response>
        <Say voice="alice">An error occurred, but help is on the way.</Say>
      </Response>
    `);
  }
};
