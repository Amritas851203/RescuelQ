import SOSReport from '../models/SOSReport.js';
import { fetchGlobalDisasters } from '../services/disasterService.js';

// Detailed Mock Data for fallback/Intelligence-Heavy UI
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
    location: { lat: 28.6500, lng: 77.2500 }, 
    address: 'Sector 14, Rohini, Delhi',
    aiSummary: 'Family of 5 trapped on 2nd floor balcony. Rising water levels. Medical assistance required for 1 child with high fever.',
    transcript: 'Please help, the water is coming inside! My daughter has a fever. We are on the balcony. Please hurry!',
    recommendedStrategy: 'Aerial extraction or shallow water boat. Prioritize medical evacuation.',
    resources: ['Medical Team', 'Rescue Boat', 'Life Jackets'],
    risk_level: 9,
    affected_people: 5,
    type: 'Flood'
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
    location: { lat: 28.6300, lng: 77.2200 }, 
    address: 'Lajpat Nagar II, Delhi',
    aiSummary: 'Elderly couple trapped in ground floor apartment. Leg injury reported for male victim. Signal dropping.',
    transcript: 'Hello? I can hear you. My husband fell... he can\'t walk. The water is up to our knees. We need help.',
    recommendedStrategy: 'Ground rescue via Ambulance or Fire Truck. Manual lift required.',
    resources: ['Ambulance', 'Paramedics'],
    risk_level: 7,
    affected_people: 2,
    type: 'Earthquake'
  }
];

export const getSOSReports = async (req, res) => {
  try {
    // Only fetch from MongoDB Atlas
    const dbReports = await SOSReport.find().sort({ created_at: -1 });

    let localReports = [];
    if (dbReports && dbReports.length > 0) {
      localReports = dbReports.map(report => ({
        ...report.toObject(),
        id: report._id.toString(),
        location: { 
          lat: report.location_lat || 28.6139, 
          lng: report.location_lng || 77.2090 
        },
        severity: report.severity?.toUpperCase() || 'LOW',
        callerName: report.reporter_name || 'Anonymous',
        type: report.type || 'Emergency'
      }));
    }

    // If no DB reports, return empty list (or mocks if you prefer, but user wants clean queue)
    res.json(localReports);
  } catch (error) {
    console.error('Controller Error:', error);
    res.json([]);
  }
};

export const updateSOSReport = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const report = await SOSReport.findByIdAndUpdate(id, updates, { new: true });

    if (!report) {
      // If DB fails/not found, simulate update on mock data for demo
      const updatedMock = { ...mockSOS.find(m => m.id === id), ...updates };
      req.io.emit('UPDATE_SOS_REPORT', updatedMock);
      return res.json(updatedMock);
    }

    const formattedReport = {
      ...report.toObject(),
      id: report._id,
      location: { lat: report.location_lat, lng: report.location_lng }
    };

    req.io.emit('UPDATE_SOS_REPORT', formattedReport);
    res.json(formattedReport);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update SOS report' });
  }
};

export const createSOSReport = async (req, res) => {
  try {
    console.log('📥 Incoming Mock SOS Request:', req.body);
    const { lat, lng, name, message, severity, victimsCount, risk_level, type, injury_severity } = req.body;
    
    const report = await SOSReport.create({
      reporter_name: name,
      location_lat: lat,
      location_lng: lng,
      message: message,
      severity: severity || 'pending',
      affected_people: victimsCount || 1,
      risk_level: risk_level || 5,
      type: type || 'Emergency',
      injury_severity: injury_severity || 5
    });

    console.log('💾 SOS Report saved to MongoDB:', report._id);

    const formattedReport = {
      ...report.toObject(),
      id: report._id.toString(),
      location: { lat: report.location_lat, lng: report.location_lng },
      callerName: report.reporter_name,
      type: report.type || 'Emergency'
    };

    console.log('📡 Broadcasting NEW_SOS_REPORT to all units:', formattedReport.id);
    req.io.emit('NEW_SOS_REPORT', formattedReport);
    res.status(201).json(formattedReport);
  } catch (error) {
    console.error('Create SOS Error:', error);
    res.status(500).json({ error: 'Failed to create SOS report in MongoDB' });
  }
};

export const updateSOSStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const report = await SOSReport.findByIdAndUpdate(id, { status }, { new: true });

    req.io.emit('SOS_STATUS_UPDATED', { id, status });
    res.status(200).json({ id, status, message: 'Status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update SOS report status' });
  }
};
