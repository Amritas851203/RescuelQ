import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

// Simulation of AI analyzing a post
const analyzeIncident = (content, type) => {
  const riskLevels = {
    'Critical': { score: 9.5, confidence: 98 },
    'High': { score: 8.2, confidence: 92 },
    'Medium': { score: 6.5, confidence: 85 },
    'Low': { score: 4.1, confidence: 78 }
  };

  const priority = content.toLowerCase().includes('help') || content.toLowerCase().includes('sos') || content.toLowerCase().includes('trapped')
    ? 'Critical' 
    : (content.toLowerCase().includes('warning') ? 'High' : 'Medium');

  return {
    riskScore: riskLevels[priority].score,
    confidence: riskLevels[priority].confidence,
    priority,
    sentiment: priority === 'Critical' ? 'Negative/Panic' : 'Urgent',
    summary: `AI detected ${type} related keywords. Manual verification recommended.`,
    recommendation: priority === 'Critical' ? 'Immediate dispatch of reconnaissance drones.' : 'Monitor for escalation.'
  };
};

export const getSocialAlerts = async (req, res) => {
  try {
    const alerts = [];

    // 1. Fetch real Earthquakes from USGS (No API Key Required)
    try {
      const usgsResponse = await axios.get('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson');
      const earthquakes = usgsResponse.data.features.slice(0, 5); // Get latest 5
      
      earthquakes.forEach(eq => {
        const { mag, place, time, url } = eq.properties;
        const [lon, lat] = eq.geometry.coordinates;
        
        if (mag > 2.0) { // Only show relevant ones
          const content = `SEISMIC ALERT: Magnitude ${mag} earthquake detected near ${place}. Lat: ${lat}, Lon: ${lon}. Source: USGS.`;
          const analysis = analyzeIncident(content, 'Earthquake');
          
          alerts.push({
            id: uuidv4(),
            type: 'Earthquake',
            platform: 'Public Alert',
            source: 'USGS Monitoring',
            content,
            location: place,
            timestamp: new Date(time).toISOString(),
            riskLevel: mag > 5 ? 9.5 : (mag > 3 ? 7.5 : 5.0),
            confidence: 100,
            priority: mag > 5 ? 'Critical' : (mag > 3 ? 'High' : 'Medium'),
            sentiment: 'Urgent',
            isVerified: true,
            externalUrl: url
          });
        }
      });
    } catch (e) {
      console.error('USGS Fetch Error:', e.message);
    }

    // 2. Mock News API (Template for when API Key is provided)
    // In a real app, you'd use: const news = await axios.get(`https://newsapi.org/v2/everything?q=disaster&apiKey=${process.env.NEWS_API_KEY}`);
    const mockNews = [
      { title: 'Flash Flooding reported in Downtown district following heavy rainfall.', source: 'Local News Network', location: 'Downtown' },
      { title: 'Wildfire spreading rapidly in North Sector forests. Evacuation orders issued.', source: 'Emergency Services', location: 'North Sector' }
    ];

    mockNews.forEach(news => {
      const analysis = analyzeIncident(news.title, 'Disaster');
      alerts.push({
        id: uuidv4(),
        type: news.title.includes('Flooding') ? 'Flood' : 'Fire',
        platform: 'News',
        source: news.source,
        content: news.title,
        location: news.location,
        timestamp: new Date().toISOString(),
        riskLevel: analysis.riskScore,
        confidence: analysis.confidence,
        priority: analysis.priority,
        sentiment: analysis.sentiment,
        isVerified: true
      });
    });

    // 3. Social Media Simulation (Twitter/Instagram)
    const socialSim = [
      { user: '@citizen_eye', text: 'Help! Water levels rising in the Industrial Zone. People are trapped on rooftops! #SOS #Flood', platform: 'Twitter/X', location: 'Industrial Zone' },
      { user: '@rescue_fan', text: 'Smoke seen coming from the Coastal Bridge area. Possible infrastructure failure?', platform: 'Instagram', location: 'Coastal Bridge' }
    ];

    socialSim.forEach(post => {
      const analysis = analyzeIncident(post.text, 'Incident');
      alerts.push({
        id: uuidv4(),
        type: post.text.includes('Flood') ? 'Flood' : 'Medical',
        platform: post.platform,
        source: post.user,
        content: post.text,
        location: post.location,
        timestamp: new Date(Date.now() - 600000).toISOString(),
        riskLevel: analysis.riskScore,
        confidence: analysis.confidence,
        priority: analysis.priority,
        sentiment: analysis.sentiment,
        isVerified: false
      });
    });

    // Sort by timestamp (newest first)
    alerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.status(200).json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching social alerts', error: error.message });
  }
};

export const analyzePost = async (req, res) => {
  const { content, type } = req.body;
  try {
    const analysis = analyzeIncident(content, type || 'Incident');
    res.status(200).json(analysis);
  } catch (error) {
    res.status(500).json({ message: 'AI Analysis failed', error: error.message });
  }
};

export const convertToIncident = async (req, res) => {
  const { alertId } = req.body;
  try {
    // This would typically involve saving to a 'sos_reports' table in Supabase
    res.status(200).json({ 
      message: 'Alert successfully promoted to Triage Queue', 
      incidentId: uuidv4(),
      status: 'success'
    });
  } catch (error) {
    res.status(500).json({ message: 'Conversion failed', error: error.message });
  }
};
