export default function setupSockets(io) {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join specific rooms (e.g., commanders can join 'command_center')
    socket.on('join_room', (room) => {
      socket.join(room);
      console.log(`Socket ${socket.id} joined room ${room}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}
