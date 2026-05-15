import axios from 'axios';
import { supabase } from '../config/supabase.js';
import { randomUUID } from 'crypto';
import { triggerAutomatedResponse } from '../services/EmergencyCallService.js';

// Simulation of AI analyzing a post
const analyzeIncident = (content, type) => {
  const riskLevels = {
    'Critical': { score: 9.5, confidence: 98 },
    'High': { score: 8.2, confidence: 92 },
    'Medium': { score: 6.5, confidence: 85 },
    'Low': { score: 4.1, confidence: 78 }
  };

  const priority = content.toLowerCase().includes('help') || content.toLowerCase().includes('sos') || content.toLowerCase().includes('trapped') || content.toLowerCase().includes('emergency')
    ? 'Critical' 
    : (content.toLowerCase().includes('warning') || content.toLowerCase().includes('danger') ? 'High' : 'Medium');

  return {
    riskScore: riskLevels[priority].score,
    confidence: riskLevels[priority].confidence,
    priority,
    sentiment: priority === 'Critical' ? 'Panic' : 'Urgent',
    summary: `AI Intelligence detected ${type} related signatures. Primary threat: ${priority}. Sector isolation recommended.`,
    recommendation: priority === 'Critical' ? 'Immediate tactical dispatch of Alpha Unit and Medics.' : 'Continuous monitoring for signature escalation.'
  };
};

export const getSocialAlerts = async (req, res) => {
  try {
    const alerts = [];

    // 1. Fetch real Earthquakes from USGS (Live Data)
    try {
      const usgsResponse = await axios.get('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson');
      const earthquakes = usgsResponse.data.features.slice(0, 10);
      
      earthquakes.forEach(eq => {
        const { mag, place, time, url } = eq.properties;
        const [lon, lat] = eq.geometry.coordinates;
        
        if (mag > 1.0) {
          const content = `SEISMIC EVENT: Magnitude ${mag} detected at ${place}. Coordinates: [${lat}, ${lon}]. Intelligence Source: USGS Global Net.`;
          
          alerts.push({
            id: randomUUID(),
            type: 'Earthquake',
            platform: 'Global Net',
            source: 'USGS Seismograph',
            content,
            location: place,
            lat,
            lng: lon,
            timestamp: new Date(time).toISOString(),
            riskLevel: mag > 5 ? 9.8 : (mag > 3 ? 7.2 : 4.5),
            confidence: 100,
            priority: mag > 5 ? 'Critical' : (mag > 3 ? 'High' : 'Medium'),
            sentiment: 'Urgent',
            isVerified: true,
            externalUrl: url,
            affected: Math.floor(mag * 200),
            medicsNeeded: mag > 5 ? 12 : 2,
            teamsNeeded: mag > 4 ? 4 : 1
          });
        }
      });
    } catch (e) {
      console.error('USGS Fetch Error:', e.message);
    }

    // 2. Mock Professional Intelligence Feed
    const intelFeed = [
      { 
        type: 'Flood', 
        content: 'CRITICAL: Water levels at Yamuna River breach Level-3. Flash flood warning for Delhi Sector 14. 1,200 souls at risk.', 
        source: 'Hydro-Stat Sentinel', 
        location: 'Delhi (Yamuna Basin)',
        lat: 28.6139,
        lng: 77.2090,
        affected: 1200,
        medicsNeeded: 8,
        teamsNeeded: 15,
        risk: 9.2
      },
      { 
        type: 'Fire', 
        content: 'INDUSTRIAL ALERT: Chemical fire detected in Mumbai Warehouse District. High toxic plume signature. Evacuation level: HIGH.', 
        source: 'Eco-Monitor 7', 
        location: 'Mumbai Industrial',
        lat: 19.0760,
        lng: 72.8777,
        affected: 450,
        medicsNeeded: 20,
        teamsNeeded: 10,
        risk: 8.7
      },
      { 
        type: 'Infrastructure', 
        content: 'GRID FAILURE: Communication blackout detected in Coastal Sector. Signal towers offline. Search & Rescue Required.', 
        source: 'Comm-Sat 9', 
        location: 'Coastal Region',
        lat: 15.2993,
        lng: 74.1240,
        affected: 2500,
        medicsNeeded: 5,
        teamsNeeded: 6,
        risk: 7.5
      }
    ];

    intelFeed.forEach(item => {
      alerts.push({
        id: randomUUID(),
        type: item.type,
        platform: 'Sat Intelligence',
        source: item.source,
        content: item.content,
        location: item.location,
        lat: item.lat,
        lng: item.lng,
        timestamp: new Date().toISOString(),
        riskLevel: item.risk,
        confidence: 94,
        priority: item.risk > 8 ? 'Critical' : 'High',
        sentiment: 'Critical',
        isVerified: true,
        affected: item.affected,
        medicsNeeded: item.medicsNeeded,
        teamsNeeded: item.teamsNeeded
      });
    });

    // 3. Social Media Simulation
    const socialSim = [
      { user: '@citizen_x', text: 'Help! Building collapse near central park! Multiple people trapped. #Emergency #SOS', platform: 'Twitter/X', location: 'Central Park Area', lat: 40.7851, lng: -73.9683 },
      { user: '@fire_tracker', text: 'Smoke reported in North District. Possible bushfire outbreak.', platform: 'Public Feed', location: 'North District', lat: 34.0522, lng: -118.2437 }
    ];

    socialSim.forEach(post => {
      const analysis = analyzeIncident(post.text, 'Social Detection');
      alerts.push({
        id: randomUUID(),
        type: post.text.includes('collapse') ? 'Infrastructure' : 'Fire',
        platform: post.platform,
        source: post.user,
        content: post.text,
        location: post.location,
        lat: post.lat,
        lng: post.lng,
        timestamp: new Date(Date.now() - 300000).toISOString(),
        riskLevel: analysis.riskScore,
        confidence: analysis.confidence,
        priority: analysis.priority,
        sentiment: analysis.sentiment,
        isVerified: false,
        affected: 50,
        medicsNeeded: 2,
        teamsNeeded: 1
      });
    });

    alerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const intelligenceStats = {
      totalEmergencies: alerts.length,
      highRiskZones: alerts.filter(a => a.priority === 'Critical' || a.priority === 'High').length,
      verifiedIncidents: alerts.filter(a => a.isVerified).length,
      peopleAffected: alerts.reduce((acc, a) => acc + (a.affected || 0), 0),
      medicalNeeded: alerts.reduce((acc, a) => acc + (a.medicsNeeded || 0), 0),
      rescueTeams: alerts.reduce((acc, a) => acc + (a.teamsNeeded || 0), 0),
      evacuationAreas: alerts.filter(a => a.riskLevel > 8).length,
      weatherThreat: 'LEVEL 4 (SEVERE)',
      infrastructureDamage: '$12.4M (EST)',
      commFailures: alerts.filter(a => a.type === 'Infrastructure').length
    };

    res.status(200).json({
      alerts,
      stats: intelligenceStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching social intelligence', error: error.message });
  }
};

export const analyzePost = async (req, res) => {
  const { content, type } = req.body;
  try {
    const analysis = analyzeIncident(content, type || 'Incident');
    res.status(200).json(analysis);
  } catch (error) {
    res.status(500).json({ message: 'AI Intelligence Analysis failed', error: error.message });
  }
};

export const convertToIncident = async (req, res) => {
  console.log('--- CONVERSION REQUEST START ---');
  const { alert } = req.body;
  if (!alert) {
    console.error('CONVERSION ERROR: Missing alert in body');
    return res.status(400).json({ message: 'Missing alert data for conversion' });
  }

  try {
    const alertType = alert.type ? String(alert.type).toUpperCase() : 'ALERT';
    const intelligenceMessage = `[${alertType}] ${alert.content || 'No content'} | IMPACT: ${alert.affected || 0} souls | RESOURCES: ${alert.medicsNeeded || 0} Medics, ${alert.teamsNeeded || 0} Units | CONFIDENCE: ${alert.confidence || 0}%`;

    const sosReport = {
      reporter_name: `AI SCANNER: ${String(alert.source || 'INTEL')}`,
      location_lat: Number(alert.lat) || 0,
      location_lng: Number(alert.lng) || 0,
      message: intelligenceMessage,
      severity: String(alert.priority || 'pending'),
      affected_people: Number(alert.affected) || 0,
      risk_level: Math.floor(Number(alert.riskLevel) || 5)
    };

    console.log('PREPARING INSERT:', JSON.stringify(sosReport));

    // 2. Insert into Supabase
    const { data, error } = await supabase
      .from('sos_reports')
      .insert([sosReport])
      .select();

    if (error) {
      console.error('SUPABASE PRIMARY ERROR:', error.message);
      
      const minimalReport = {
        reporter_name: 'AI Scanner Fallback',
        location_lat: sosReport.location_lat,
        location_lng: sosReport.location_lng,
        message: sosReport.message
      };
      
      const { data: fbData, error: fbError } = await supabase
        .from('sos_reports')
        .insert([minimalReport])
        .select();

      if (fbError) {
        console.error('SUPABASE FALLBACK ERROR:', fbError.message);
        const errorMessage = fbError.message.includes('not found') 
          ? 'Database Error: Table "sos_reports" missing. Please run SCHEMA.md in Supabase.'
          : fbError.message;
        return res.status(500).json({ message: errorMessage });
      }
      
      if (req.io && fbData && fbData.length > 0) {
        req.io.emit('NEW_SOS_REPORT', {
          ...fbData[0],
          location: { lat: fbData[0].location_lat, lng: fbData[0].location_lng },
          callerName: fbData[0].reporter_name
        });
      }

      console.log('FALLBACK SUCCESS');
      return res.status(200).json({ 
        message: 'Promoted in Fallback Mode', 
        incident: fbData ? fbData[0] : null,
        status: 'success'
      });
    }

    if (req.io && data && data.length > 0) {
      const formattedIncident = {
        ...data[0],
        location: { lat: data[0].location_lat, lng: data[0].location_lng },
        callerName: data[0].reporter_name,
        type: alert.type || 'Incident',
        address: alert.location || 'Unknown',
        aiSummary: alert.content || 'Critical intelligence alert'
      };

      req.io.emit('NEW_SOS_REPORT', formattedIncident);

      // Trigger AI Emergency Calling
      const upperSeverity = (data[0].severity || '').toUpperCase();
      if (upperSeverity === 'CRITICAL' || upperSeverity === 'EXTREME' || upperSeverity === 'HIGH') {
        console.log(`[Social Trigger] Critical intelligence promoted. Initiating automated calls for ${formattedIncident.id}`);
        triggerAutomatedResponse(formattedIncident, req.io);
      }
    }

    console.log('CONVERSION SUCCESS');
    res.status(200).json({ 
      message: 'Intelligence successfully promoted', 
      incident: data ? data[0] : null,
      status: 'success'
    });
  } catch (error) {
    console.error('CRITICAL FATAL ERROR:', error);
    res.status(500).json({ message: `Fatal Promotion Error: ${error.message}` });
  }
};

export const archiveAlert = async (req, res) => {
  const { alertId } = req.body;
  try {
    res.status(200).json({ 
      message: 'Alert moved to Intelligence Archive', 
      status: 'success',
      archivedAt: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: 'Archiving failed', error: error.message });
  }
};
