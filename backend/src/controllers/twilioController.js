import { processAudioToText, classifySeverityAndLocation } from '../services/aiService.js';
import { supabase } from '../config/supabase.js';

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

    // 3. Save to Supabase
    const reportData = {
      caller_phone: From || '+1234567890',
      transcription: text,
      severity: aiAnalysis.severity,
      urgency_score: aiAnalysis.urgency_score,
      location: aiAnalysis.location || { lat: 19.0760, lng: 72.8777 },
      summary: aiAnalysis.summary,
      status: 'New'
    };

    let savedReport = reportData;

    // Optional: Save to DB if configured
    if (process.env.SUPABASE_URL) {
      const { data, error } = await supabase
        .from('sos_reports')
        .insert([reportData])
        .select();
      
      if (!error && data) {
        savedReport = data[0];
      } else {
        console.error('Failed to save to Supabase:', error);
      }
    } else {
      // Mock ID
      savedReport.id = Math.random().toString(36).substr(2, 9);
      savedReport.created_at = new Date().toISOString();
    }

    // 4. Emit Realtime Event via Socket.IO
    req.io.emit('NEW_SOS_REPORT', savedReport);
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
