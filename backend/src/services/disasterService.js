import axios from 'axios';
import geminiService from './geminiService.js';

const GDACS_API = 'https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH';
const USGS_API = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson';

/**
 * Helper to enrich disaster data with Gemini AI intelligence (Sequential to avoid rate limits)
 */
const enrichWithAI = async (events) => {
  const enriched = [];
  for (const event of events) {
    // Only analyze critical or high severity to save API quota/time
    if (event.severity === 'CRITICAL' || event.severity === 'HIGH') {
      try {
        const analysis = await geminiService.analyzeDisaster(event);
        enriched.push({ 
          ...event, 
          aiSummary: analysis.aiSummary || event.aiSummary,
          resources: analysis.requiredResources || event.resources,
          risk_level: analysis.riskLevel || event.risk_level,
          tacticalAction: analysis.tacticalAction
        });
      } catch (err) {
        enriched.push(event);
      }
    } else {
      enriched.push(event);
    }
  }
  return enriched;
};

/**
 * Fetches real-world disaster events from GDACS
 */
export const fetchGlobalDisasters = async () => {
  try {
    const response = await axios.get(GDACS_API);
    const features = response.data.features || [];

    const mapped = features.map((feature, index) => {
      const event = feature.properties;
      const [lng, lat] = feature.geometry.coordinates;

      return {
        id: event.eventid ? `gdacs-${event.eventid}` : `gdacs-sim-${index}`,
        type: event.eventtype === 'EQ' ? 'Earthquake' : 
              event.eventtype === 'FL' ? 'Flood' : 
              event.eventtype === 'TC' ? 'Cyclone' : 
              event.eventtype === 'VO' ? 'Volcano' : 'Disaster',
        severity: event.alertlevel === 'red' ? 'CRITICAL' : 
                  event.alertlevel === 'orange' ? 'HIGH' : 'MEDIUM',
        location: { lat, lng },
        address: event.country || event.eventname,
        callerName: 'GDACS INTEL',
        aiSummary: `Global threat: ${event.eventname}. Magnitude/Level: ${event.alertlevel?.toUpperCase()}. Sector isolation recommended.`,
        affected_people: Math.floor(Math.random() * 5000), 
        risk_level: event.alertlevel === 'red' ? 9 : event.alertlevel === 'orange' ? 7 : 4,
        created_at: event.fromdate ? new Date(event.fromdate).toISOString() : new Date().toISOString(),
        isGlobal: true,
        resources: ['Global Response Team', 'Satellite Monitoring', 'Medical Support']
      };
    }).slice(0, 5);

    return await enrichWithAI(mapped);
  } catch (error) {
    console.error('GDACS Fetch Error:', error.message);
    return [];
  }
};

/**
 * Fetches latest earthquakes from USGS
 */
export const fetchEarthquakes = async () => {
  try {
    const response = await axios.get(USGS_API);
    const features = response.data.features || [];

    const mapped = features.slice(0, 5).map(feature => {
      const { mag, place, time } = feature.properties;
      const [lng, lat] = feature.geometry.coordinates;

      return {
        id: `usgs-${feature.id}`,
        type: 'Earthquake',
        severity: mag > 6 ? 'CRITICAL' : (mag > 4 ? 'HIGH' : 'MEDIUM'),
        location: { lat, lng },
        address: place,
        callerName: 'USGS GLOBAL NET',
        aiSummary: `Seismic activity detected: Magnitude ${mag} at ${place}. Critical infrastructure at risk.`,
        affected_people: Math.floor(mag * 1000),
        risk_level: Math.min(10, Math.floor(mag * 1.5)),
        created_at: new Date(time).toISOString(),
        isGlobal: true,
        resources: ['Seismic Rescue Team', 'Heavy Machinery']
      };
    });

    return await enrichWithAI(mapped);
  } catch (error) {
    console.error('USGS Fetch Error:', error.message);
    return [];
  }
};

/**
 * Fetches real weather alerts/current severe weather using OpenWeatherMap
 */
export const fetchWeatherAlerts = async () => {
  const API_KEY = process.env.WEATHER_API_KEY;
  if (!API_KEY) return [];

  const cities = ['Miami', 'Tokyo', 'Manila', 'Jakarta', 'Mumbai'];
  const alerts = [];

  try {
    for (const city of cities) {
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
      const data = response.data;
      
      if (data.weather[0].main === 'Thunderstorm' || data.weather[0].main === 'Rain' || data.weather[0].main === 'Extreme') {
        alerts.push({
          id: `owm-${data.id}`,
          type: data.weather[0].main,
          severity: data.weather[0].main === 'Thunderstorm' ? 'HIGH' : 'MEDIUM',
          location: { lat: data.coord.lat, lng: data.coord.lon },
          address: `${data.name}, ${data.sys.country}`,
          callerName: 'OPENWEATHER INTEL',
          aiSummary: `Real-time weather threat: ${data.weather[0].description} at ${data.name}. Humidity ${data.main.humidity}%, Wind ${data.wind.speed}m/s. Potential flood risk detected.`,
          affected_people: Math.floor(Math.random() * 5000) + 1000,
          risk_level: data.weather[0].main === 'Thunderstorm' ? 8 : 5,
          created_at: new Date().toISOString(),
          isGlobal: true,
          resources: ['Weather Response Team', 'Drainage Support']
        });
      }
    }
    return await enrichWithAI(alerts);
  } catch (error) {
    console.error('Weather Fetch Error:', error.message);
    return [];
  }
};
