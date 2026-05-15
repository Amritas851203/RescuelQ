import { create } from 'zustand';

const useCallStore = create((set) => ({
  isRinging: false,
  isConnected: false,
  activeCall: null, // { id, type, location, callerName, priority, incident }
  transcripts: [],
  isMuted: false,
  isSpeakerOn: true,
  callTimer: 0,
  
  initiateIncomingCall: (callData) => set({ 
    isRinging: true, 
    activeCall: callData,
    isConnected: false,
    transcripts: [],
    callTimer: 0
  }),
  
  acceptCall: () => set({ 
    isRinging: false, 
    isConnected: true 
  }),
  
  rejectCall: () => set({ 
    isRinging: false, 
    activeCall: null,
    isConnected: false 
  }),
  
  endCall: () => set({ 
    isRinging: false, 
    isConnected: false, 
    activeCall: null,
    callTimer: 0
  }),
  
  addTranscript: (transcript) => set((state) => ({ 
    transcripts: [...state.transcripts, transcript] 
  })),
  
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  toggleSpeaker: () => set((state) => ({ isSpeakerOn: !state.isSpeakerOn })),
  
  incrementTimer: () => set((state) => ({ callTimer: state.callTimer + 1 })),
}));

export default useCallStore;
