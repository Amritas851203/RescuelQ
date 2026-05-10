import { useEffect } from 'react';
import { io } from 'socket.io-client';
import useSosStore from '../store/useSosStore';

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const useRealtime = () => {
  const addReport = useSosStore((state) => state.addReport);

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on('connect', () => {
      console.log('Connected to realtime server');
    });

    socket.on('NEW_SOS_REPORT', (report) => {
      console.log('New SOS Report Received via Socket:', report);
      addReport(report);
    });

    return () => {
      socket.disconnect();
    };
  }, [addReport]);
};

export default useRealtime;
