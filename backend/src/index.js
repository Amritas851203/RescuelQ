import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import setupSockets from './sockets/index.js';
import apiRoutes from './routes/api.js';
import connectDB from './config/db.js';

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Initialize socket handlers
setupSockets(io);

// Pass io to request object for use in controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// API Routes
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'RescueIQ Backend is running' });
});

// CRITICAL: Prevent server from crashing on unhandled errors
process.on('unhandledRejection', (reason) => {
  console.error('--- UNHANDLED REJECTION ---');
  console.error('Reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('--- UNCAUGHT EXCEPTION ---');
  console.error(err);
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 RescueIQ Backend operational on port ${PORT}`);
});

// Set timeout for long-running external API fetches
server.keepAliveTimeout = 65000; 
server.headersTimeout = 66000;

// --- REAL-TIME DISASTER INTELLIGENCE POLLER ---
// This simulates a connected system that automatically detects disasters and pushes them to the UI
import { fetchEarthquakes, fetchGlobalDisasters } from './services/disasterService.js';
import { randomUUID } from 'crypto';
import SOSReport from './models/SOSReport.js';

const pollIntelligence = async () => {
  try {
    console.log('📡 Scanning Global Intelligence Feeds...');
    const [quakes, disasters] = await Promise.all([
      fetchEarthquakes(),
      fetchGlobalDisasters()
    ]);

    const allEvents = [...quakes, ...disasters];
    
    // Emit the raw intel feed to the Social Scanner
    io.emit('INTEL_FEED_UPDATE', allEvents);

    // Auto-Promote CRITICAL events to the Triage Queue (Simulation of connected system)
    const criticalEvents = allEvents.filter(e => e.severity === 'CRITICAL');
    for (const event of criticalEvents) {
      // We only "auto-promote" a small percentage to avoid flooding the DB
      if (Math.random() > 0.7) {
        // Save to MongoDB for persistence
        const savedReport = await SOSReport.create({
          reporter_name: `AI_AUTO_DETECT: ${event.callerName}`,
          location_lat: event.location.lat,
          location_lng: event.location.lng,
          message: `[AUTO-DETECTED] ${event.aiSummary}`,
          severity: event.severity.toLowerCase(),
          affected_people: event.affected_people,
          risk_level: event.risk_level,
          status: 'Pending',
          type: event.type
        });

        const formattedReport = {
          ...savedReport.toObject(),
          id: savedReport._id,
          location: { lat: savedReport.location_lat, lng: savedReport.location_lng },
          callerName: savedReport.reporter_name
        };
        
        io.emit('NEW_SOS_REPORT', formattedReport);
        console.log(`📢 AUTO-PROMOTED: ${event.type} in ${event.address}`);
      }
    }
  } catch (err) {
    console.error('Poller Error:', err.message);
  }
};

// Start polling every 60 seconds (realistic for real-world APIs)
setInterval(pollIntelligence, 60000);
// Initial poll on startup
setTimeout(pollIntelligence, 5000);
