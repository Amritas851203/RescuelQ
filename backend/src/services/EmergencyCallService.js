import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

const client = (accountSid && authToken) ? twilio(accountSid, authToken) : null;

export const initiateEmergencyCall = async (incident, contact, io) => {
  const { id, type, location, address, severity, aiSummary } = incident;
  const { name, phone, language = 'en-IN' } = contact;

  console.log(`[EmergencyCallService] Initiating call to ${name} (${phone}) for incident ${id}`);

  // Construct the message based on language
  let message = '';
  if (language.startsWith('hi')) {
    message = `आपातकालीन सूचना। ${address} में ${type} का पता चला है। गंभीरता: ${severity}। कृपया तत्काल कार्रवाई करें। विवरण: ${aiSummary}`;
  } else {
    message = `Critical Emergency Alert. A ${type} has been detected in ${address}. Severity level is ${severity}. Immediate response requested. Intelligence summary: ${aiSummary}`;
  }

  // Generate TwiML with <Gather> for interaction
  const callbackUrl = `${process.env.BACKEND_URL || 'http://localhost:5001'}/api/emergency/voice-webhook?incidentId=${id}`;
  
  const twiml = `
    <Response>
      <Say voice="${language.startsWith('hi') ? 'Polly.Aditi' : 'Polly.Salli'}" language="${language}">
        ${message}. You can speak now to receive further intelligence or confirm deployment.
      </Say>
      <Gather input="speech" action="${callbackUrl}" speechTimeout="auto" language="${language}">
        <Say voice="${language.startsWith('hi') ? 'Polly.Aditi' : 'Polly.Salli'}" language="${language}">
          Awaiting responder input.
        </Say>
      </Gather>
      <Say voice="${language.startsWith('hi') ? 'Polly.Aditi' : 'Polly.Salli'}" language="${language}">
        Signal lost. Re-establishing link if necessary.
      </Say>
    </Response>
  `;

  const callLog = {
    id: `CALL-${Math.floor(Math.random() * 1000000)}`,
    incident_id: id,
    contact_name: name,
    contact_phone: phone,
    status: 'Initiating',
    timestamp: new Date().toISOString(),
  };

  // Emit initiating status
  if (io) io.emit('EMERGENCY_CALL_STATUS', callLog);

  if (!client) {
    console.warn('[EmergencyCallService] Twilio credentials missing. SIMULATING CALL.');
    
    // Simulate call lifecycle
    setTimeout(() => {
      callLog.status = 'Ringing';
      if (io) io.emit('EMERGENCY_CALL_STATUS', callLog);
    }, 1500);
    
    return { success: true, simulated: true, callSid: callLog.id };
  }

  try {
    const call = await client.calls.create({
      twiml,
      to: phone,
      from: fromNumber,
      statusCallback: `${process.env.BACKEND_URL || 'http://localhost:5001'}/api/emergency/call-status`,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
    });

    callLog.status = 'Initiated';
    callLog.call_sid = call.sid;
    if (io) io.emit('EMERGENCY_CALL_STATUS', callLog);

    return { success: true, callSid: call.sid };
  } catch (error) {
    console.error('[EmergencyCallService] Twilio Error:', error);
    callLog.status = 'Failed';
    callLog.error = error.message;
    if (io) io.emit('EMERGENCY_CALL_STATUS', callLog);
    return { success: false, error: error.message };
  }
};

export const triggerAutomatedResponse = async (incident, io) => {
  // Logic to find nearest/relevant contacts and call them
  // For now, we'll use a set of default emergency responders
  const defaultContacts = [
    { name: 'City Hospital Emergency', phone: '+1234567890', type: 'Medical' },
    { name: 'Fire Response Unit 1', phone: '+1234567891', type: 'Fire' },
    { name: 'Police Dispatch', phone: '+1234567892', type: 'Police' }
  ];

  console.log(`[EmergencyCallService] Triggering automated response for ${incident.type}`);

  for (const contact of defaultContacts) {
    // In a real system, we might stagger these or prioritize
    await initiateEmergencyCall(incident, contact, io);
  }
};
