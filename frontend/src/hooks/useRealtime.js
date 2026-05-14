import { useEffect } from 'react';
import { io } from 'socket.io-client';
import useSosStore from '../store/useSosStore';
import useSocialStore from '../store/useSocialStore';

const useRealtime = () => {
  const addReport = useSosStore((state) => state.addReport);

  useEffect(() => {
    const socket = io('/', {
      transports: ['polling', 'websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('Successfully connected to RescueIQ Realtime Server');
    });

    socket.on('connect_error', (error) => {
      console.error('Realtime Connection Error:', error.message);
    });

    socket.on('disconnect', (reason) => {
      console.warn('Realtime Disconnected:', reason);
    });

    socket.on('NEW_SOS_REPORT', (report) => {
      console.log('Incoming SOS intelligence detected:', report);
      addReport(report);
    });

    socket.on('SOS_STATUS_UPDATED', ({ id, status }) => {
      console.log('Incident status updated via global network:', id, status);
      useSosStore.getState().setReports(
        useSosStore.getState().reports.map((r) => r.id === id ? { ...r, status } : r)
      );
    });

    socket.on('INTEL_FEED_UPDATE', (intel) => {
      console.log('Global Intelligence Feed Synchronized:', intel.length, 'nodes');
      const alerts = intel.map(item => ({
        id: item.id,
        type: item.type,
        platform: 'Global Net',
        source: item.callerName,
        content: item.aiSummary,
        location: item.address,
        lat: item.location.lat,
        lng: item.location.lng,
        timestamp: item.created_at,
        riskLevel: item.risk_level,
        confidence: 95,
        priority: item.severity.charAt(0).toUpperCase() + item.severity.slice(1).toLowerCase(),
        sentiment: 'Urgent',
        isVerified: true,
        affected: item.affected_people,
        medicsNeeded: Math.floor(item.affected_people / 500),
        teamsNeeded: Math.floor(item.affected_people / 1000)
      }));
      useSocialStore.getState().setAlerts(alerts);
    });

    return () => {
      socket.disconnect();
    };
  }, [addReport]);
};

export default useRealtime;
