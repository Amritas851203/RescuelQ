import DispatchService from '../services/DispatchService.js';
import geminiService from '../services/geminiService.js';
import { supabase } from '../config/supabase.js';

export default function setupSockets(io) {
  // Simulation Loop
  setInterval(async () => {
    const missions = await DispatchService.getActiveMissions();
    for (const mission of missions) {
      if (mission.status === 'EN_ROUTE' || mission.status === 'TRANSPORTING') {
        const updatedMission = DispatchService.updateMissionProgress(mission.id);
        if (updatedMission) {
          io.to('command_center').emit('vehicle_update', {
            missionId: updatedMission.id,
            teamId: updatedMission.teamId,
            location: updatedMission.currentLocation,
            status: updatedMission.status
          });
        }
      }
    }
  }, 1000);

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join specific rooms
    socket.on('join_room', (room) => {
      socket.join(room);
      console.log(`Socket ${socket.id} joined room ${room}`);
    });

    // Command Center Handlers
    socket.on('dispatch_team', async (data) => {
      try {
        const { teamId, sosId } = data;
        const mission = await DispatchService.assignMission(teamId, sosId);
        io.to('command_center').emit('mission_assigned', mission);
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    socket.on('RESPONDER_SPEECH', async (data) => {
      const { callSid, incidentId, text, language } = data;
      console.log(`[Socket Voice] Responder (${language}): "${text}"`);

      try {
        let incidentData = { type: 'Incident', severity: 'Critical', address: 'Unknown', aiSummary: 'Critical intelligence dispatch.', language };
        
        if (incidentId && process.env.SUPABASE_URL) {
          const { data: dbData } = await supabase.from('sos_reports').select('*').eq('id', incidentId).single();
          if (dbData) {
            incidentData = {
              type: dbData.type || 'Incident',
              severity: dbData.severity,
              address: dbData.message.split('|')[0] || 'Unknown Location',
              aiSummary: dbData.message,
              affected_people: dbData.affected_people || 1200,
              risk_level: dbData.risk_level || 8,
              resources: dbData.resources || ['Alpha Unit', 'Medic 1', 'Rescue 4'],
              language
            };
          }
        }

        const aiResponse = await geminiService.generateEmergencyResponse(text, incidentData);
        
        io.emit('LIVE_TRANSCRIPT', {
          call_sid: callSid,
          incident_id: incidentId,
          text: aiResponse,
          source: 'AI Agent',
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Socket Voice Processing Error:', error);
      }
    });

    socket.on('ACCEPT_CALL', async (data) => {
      const { callSid, incidentId, language } = data;
      console.log(`[Socket] Call ${callSid} accepted. Language: ${language}`);
      
      io.emit('EMERGENCY_CALL_STATUS_UPDATE', {
        call_sid: callSid,
        status: 'Connected'
      });

      try {
        let incidentData = { type: 'Incident', severity: 'Critical', address: 'Unknown', aiSummary: 'Critical intelligence dispatch.', language };
        if (incidentId && process.env.SUPABASE_URL) {
          const { data: dbData } = await supabase.from('sos_reports').select('*').eq('id', incidentId).single();
          if (dbData) {
            incidentData = {
              type: dbData.type || 'Incident',
              severity: dbData.severity,
              address: dbData.message.split('|')[0] || 'Unknown Location',
              aiSummary: dbData.message,
              language
            };
          }
        }

        // Generate multilingual initial briefing
        const multilingualPrompt = `Hello, this is RescueIQ Dispatch. A ${incidentData.severity} ${incidentData.type} has been detected at ${incidentData.address}. Please provide an initial briefing to the responder in their selected language (${language}).`;
        const aiResponse = await geminiService.generateEmergencyResponse(multilingualPrompt, incidentData);

        io.emit('LIVE_TRANSCRIPT', {
          call_sid: callSid,
          incident_id: incidentId,
          text: aiResponse,
          source: 'AI Agent',
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error sending initial briefing:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}
