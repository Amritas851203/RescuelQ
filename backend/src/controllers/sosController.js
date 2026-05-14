import { supabase } from '../config/supabase.js';

// Detailed Mock Data for Intelligence-Heavy UI
const mockSOS = [
  { 
    id: 'sos-9421', 
    severity: 'CRITICAL', 
    victimsCount: 5, 
    callerName: 'Aditi Rao',
    language: 'Hindi (Translated)',
    aiTrustScore: 98,
    waterLevel: '1.4m',
    gpsAccuracy: '±3m',
    shelterDistance: '0.8km',
    assignedTeam: 'Alpha Team',
    eta: '4m',
    timeSinceRequest: '2m ago',
    commStatus: 'STABLE',
    isMedical: true,
    hasChildren: true,
    hasSeniors: false,
    routeRisk: 'HIGH',
    location: [28.6500, 77.2500], 
    address: 'Sector 14, Rohini, Delhi',
    aiSummary: 'Family of 5 trapped on 2nd floor balcony. Rising water levels. Medical assistance required for 1 child with high fever.',
    transcript: 'Please help, the water is coming inside! My daughter has a fever. We are on the balcony. Please hurry!',
    recommendedStrategy: 'Aerial extraction or shallow water boat. Prioritize medical evacuation.'
  },
  { 
    id: 'sos-8820', 
    severity: 'INJURED', 
    victimsCount: 2, 
    callerName: 'Sanjay Gupta',
    language: 'English',
    aiTrustScore: 92,
    waterLevel: '0.8m',
    gpsAccuracy: '±12m',
    shelterDistance: '1.5km',
    assignedTeam: 'None',
    eta: '--',
    timeSinceRequest: '5m ago',
    commStatus: 'WEAK',
    isMedical: true,
    hasChildren: false,
    hasSeniors: true,
    routeRisk: 'MEDIUM',
    location: [28.6300, 77.2200], 
    address: 'Lajpat Nagar II, Delhi',
    aiSummary: 'Elderly couple trapped in ground floor apartment. Leg injury reported for male victim. Signal dropping.',
    transcript: 'Hello? I can hear you. My husband fell... he can\'t walk. The water is up to our knees. We need help.',
    recommendedStrategy: 'Ground rescue via Ambulance or Fire Truck. Manual lift required.'
  },
  { 
    id: 'sos-7715', 
    severity: 'STRANDED', 
    victimsCount: 12, 
    callerName: 'Unknown (Scanner)',
    language: 'Mixed',
    aiTrustScore: 75,
    waterLevel: '2.1m',
    gpsAccuracy: '±50m',
    shelterDistance: '2.4km',
    assignedTeam: 'None',
    eta: '--',
    timeSinceRequest: '12m ago',
    commStatus: 'OFFLINE',
    isMedical: false,
    hasChildren: true,
    hasSeniors: true,
    routeRisk: 'CRITICAL',
    location: [28.6100, 77.2800], 
    address: 'Mayur Vihar Ph-III',
    aiSummary: 'Large group detected via social media scanner. Potential school building. High flood zone.',
    transcript: '[NO DIRECT COMMS] Metadata indicates multiple victims at this coordinate.',
    recommendedStrategy: 'Reconnaissance drone dispatch recommended. Multi-unit rescue boat deployment needed.'
  },
];

export const getSOSReports = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('sos_reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return res.json(mockSOS);
    }

    res.json(data);
  } catch (error) {
    res.json(mockSOS);
  }
};

export const updateSOSReport = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('sos_reports')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) {
      // If DB fails, simulate update on mock data for demo
      const updatedMock = { ...mockSOS.find(m => m.id === id), ...updates };
      req.io.emit('UPDATE_SOS_REPORT', updatedMock);
      return res.json(updatedMock);
    }

    req.io.emit('UPDATE_SOS_REPORT', data[0]);
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update SOS report' });
  }
};

export const createSOSReport = async (req, res) => {
  try {
    const reportData = req.body;
    const { data, error } = await supabase
      .from('sos_reports')
      .insert([reportData])
      .select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    req.io.emit('NEW_SOS_REPORT', data[0]);
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create SOS report' });
  }
};
