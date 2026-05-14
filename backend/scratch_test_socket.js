import { io } from 'socket.io-client';

const socket = io('http://localhost:5999', {
  transports: ['websocket'],
});

socket.on('connect', () => {
  console.log('SUCCESS: Connected to backend socket at http://localhost:5999');
  process.exit(0);
});

socket.on('connect_error', (err) => {
  console.error('FAILURE: Could not connect to backend socket:', err.message);
  process.exit(1);
});

setTimeout(() => {
  console.error('FAILURE: Connection timeout');
  process.exit(1);
}, 5000);
