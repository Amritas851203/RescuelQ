import { initiateEmergencyCall } from '../services/EmergencyCallService.js';
import { supabase } from '../config/supabase.js';

// In-memory logs for demo if DB isn't available
let callLogs = [];

export const getCallLogs = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('call_logs')
      .select('*')
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.json(callLogs);
  }
};

export const getContacts = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('emergency_contacts')
      .select('*');
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    // Mock contacts for demo
    res.json([
      { id: 1, name: 'Main Hospital', type: 'Medical', phone: '+1234567890', status: 'Available', location: 'Central District' },
      { id: 2, name: 'Sector 5 Fire Station', type: 'Fire', phone: '+1234567891', status: 'Busy', location: 'West Sector' },
      { id: 3, name: 'Police HQ', type: 'Police', phone: '+1234567892', status: 'Available', location: 'Downtown' },
      { id: 4, name: 'NDRF Base', type: 'Disaster Management', phone: '+1234567893', status: 'Standby', location: 'Peripheral Base' }
    ]);
  }
};

export const manualTriggerCall = async (req, res) => {
  const { incident, contact } = req.body;
  try {
    const result = await initiateEmergencyCall(incident, contact, req.io);
    res.json({ message: 'Call initiated', ...result });
  } catch (error) {
    res.status(500).json({ message: 'Failed to initiate call', error: error.message });
  }
};

export const handleCallStatusWebhook = (req, res) => {
  const { CallSid, CallStatus } = req.body;
  console.log(`[Twilio Webhook] Call ${CallSid} status: ${CallStatus}`);
  
  const statusMap = {
    'initiated': 'Calling',
    'ringing': 'Ringing',
    'answered': 'Connected',
    'completed': 'Completed',
    'failed': 'Failed',
    'no-answer': 'No Answer',
    'busy': 'Busy'
  };

  const status = statusMap[CallStatus] || CallStatus;

  // Emit to frontend
  req.io.emit('EMERGENCY_CALL_STATUS_UPDATE', {
    call_sid: CallSid,
    status: status
  });

  res.sendStatus(200);
};

export const getCallAnalytics = async (req, res) => {
  // Mock analytics
  res.json({
    totalCalls: 154,
    successRate: 92.5,
    avgResponseTime: '4.2s',
    activeIncidents: 3,
    callsByDepartment: [
      { name: 'Medical', value: 45 },
      { name: 'Fire', value: 38 },
      { name: 'Police', value: 42 },
      { name: 'Disaster Mgmt', value: 29 }
    ]
  });
};
