import { v4 as uuidv4 } from 'uuid';

// Mock data generator for social alerts
const generateMockAlerts = () => {
  const platforms = ['Twitter/X', 'Instagram', 'News', 'Public Alert'];
  const types = ['Flood', 'Fire', 'Earthquake', 'Medical', 'Infrastructure'];
  const locations = ['North Sector', 'Downtown', 'Industrial Zone', 'Coastal Bridge', 'Central Hospital'];
  const priorities = ['Critical', 'High', 'Medium', 'Low'];

  return Array.from({ length: 15 }).map(() => ({
    id: uuidv4(),
    type: types[Math.floor(Math.random() * types.length)],
    platform: platforms[Math.floor(Math.random() * platforms.length)],
    source: `@operator_${Math.floor(Math.random() * 999)}`,
    content: `EMERGENCY ALERT: Possible ${types[Math.floor(Math.random() * types.length)]} detected in ${locations[Math.floor(Math.random() * locations.length)]}. Immediate assistance requested. #SOS #RescueIQ`,
    location: locations[Math.floor(Math.random() * locations.length)],
    timestamp: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString(),
    riskLevel: Math.floor(Math.random() * 4) + 7, // 7-10 for realistic high risk
    confidence: Math.floor(Math.random() * 20) + 80, // 80-100%
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    sentiment: Math.random() > 0.5 ? 'Negative/Panic' : 'Urgent',
    isVerified: Math.random() > 0.7
  }));
};

export const getSocialAlerts = async (req, res) => {
  try {
    const alerts = generateMockAlerts();
    res.status(200).json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching social alerts', error: error.message });
  }
};

export const analyzePost = async (req, res) => {
  const { content } = req.body;
  try {
    // Mock AI analysis
    const analysis = {
      detectedDisaster: 'Flood',
      riskScore: 8.5,
      confidence: 94,
      priority: 'High',
      summary: 'Automated scan detected high-water level indicators and panicked citizen reports.',
      recommendation: 'Dispatch drone for visual verification of North Sector.'
    };
    res.status(200).json(analysis);
  } catch (error) {
    res.status(500).json({ message: 'AI Analysis failed', error: error.message });
  }
};

export const convertToIncident = async (req, res) => {
  const { alertId } = req.body;
  try {
    // Logic to promote to Triage Queue would go here
    res.status(200).json({ 
      message: 'Alert successfully promoted to Triage Queue', 
      incidentId: uuidv4() 
    });
  } catch (error) {
    res.status(500).json({ message: 'Conversion failed', error: error.message });
  }
};
