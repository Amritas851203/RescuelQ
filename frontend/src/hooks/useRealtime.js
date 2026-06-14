import { useEffect } from 'react';
import { io } from 'socket.io-client';
import useSosStore from '../store/useSosStore';
import useSocialStore from '../store/useSocialStore';
import useCallStore from '../store/useCallStore';

export const socket = io('/', {
  transports: ['polling', 'websocket'],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

const useRealtime = () => {
  const addReport = useSosStore((state) => state.addReport);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.on('connect', () => {
      console.log('✅ Successfully connected to RescueIQ Realtime Server');
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Realtime Connection Error:', error.message);
    });

    socket.on('disconnect', (reason) => {
      console.warn('⚠️ Realtime Disconnected:', reason);
    });

    socket.on('NEW_SOS_REPORT', (report) => {
      console.log('📢 Incoming SOS intelligence detected via Socket:', report);
      addReport(report);
    });

    socket.on('SOS_STATUS_UPDATED', ({ id, status }) => {
      console.log('✅ Incident status updated via global network:', id, status);
      useSosStore.getState().setReports(
        useSosStore.getState().reports.map((r) => (r.id === id || r._id === id) ? { ...r, status } : r)
      );
    });

    socket.on('INTEL_FEED_UPDATE', (intel) => {
      // console.log('📡 Global Intelligence Feed Synchronized:', intel.length, 'nodes');
      const alerts = intel.map(item => ({
        id: item.id || item._id,
        type: item.type,
        platform: 'Global Net',
        source: item.callerName || 'Unknown',
        content: item.aiSummary || item.message,
        location: item.address || 'Unknown Sector',
        lat: item.location?.lat || item.location_lat,
        lng: item.location?.lng || item.location_lng,
        timestamp: item.created_at,
        riskLevel: item.risk_level || 5,
        confidence: 95,
        priority: item.severity?.charAt(0).toUpperCase() + item.severity?.slice(1).toLowerCase() || 'Low',
        sentiment: 'Urgent',
        isVerified: true,
        affected: item.affected_people || 0
      }));
      useSocialStore.getState().setAlerts(alerts);
    });

    socket.on('EMERGENCY_CALL_STATUS', (callData) => {
      console.log('Tactical call signal received:', callData);
      if (callData.status === 'Initiating' || callData.status === 'Ringing') {
        useCallStore.getState().initiateIncomingCall({
          call_sid: callData.call_sid,
          incident_id: callData.incident_id,
          callerName: callData.contact_name || 'AI Dispatch',
          type: 'Emergency Alert',
          location: callData.location || 'Tactical Sector',
          priority: 'CRITICAL'
        });
      } else if (callData.status === 'Completed' || callData.status === 'Failed') {
        useCallStore.getState().endCall();
      }
    });

    socket.on('EMERGENCY_CALL_STATUS_UPDATE', (update) => {
      if (update.status === 'Completed' || update.status === 'Failed') {
        useCallStore.getState().endCall();
      }
    });

    socket.on('LIVE_TRANSCRIPT', (data) => {
      console.log('Realtime AI Transcript:', data);
      useCallStore.getState().addTranscript(data);
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('disconnect');
      socket.off('NEW_SOS_REPORT');
      socket.off('SOS_STATUS_UPDATED');
      socket.off('INTEL_FEED_UPDATE');
      socket.off('EMERGENCY_CALL_STATUS');
      socket.off('EMERGENCY_CALL_STATUS_UPDATE');
      socket.off('LIVE_TRANSCRIPT');
    };
  }, [addReport]);
};

export default useRealtime;
