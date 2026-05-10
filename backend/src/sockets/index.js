import DispatchService from '../services/DispatchService.js';

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

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}
