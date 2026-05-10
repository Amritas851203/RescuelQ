// Mock data for demo purposes - Intelligence Heavy
let teams = [
  { 
    id: 't1', 
    name: 'Alpha Team', 
    leader: 'Capt. Sarah Miller',
    type: 'ambulance', 
    status: 'AVAILABLE', 
    location: [28.6139, 77.2090], 
    fuel: 85, 
    health: 100, 
    oxygen: 90, 
    battery: 95,
    medkits: 12,
    crewCount: 4,
    speed: 0,
    droneAvailable: true,
    commSignal: 98,
    lastSync: '2s ago',
    members: ['Dr. Sharma (Medic)', 'EMT Ravi (Trauma)', 'Officer Blake (Security)', 'Zoe (Drone Op)'] 
  },
  { 
    id: 't2', 
    name: 'Bravo Team', 
    leader: 'Cmdr. James Chen',
    type: 'fire_truck', 
    status: 'AVAILABLE', 
    location: [28.6200, 77.2200], 
    fuel: 92, 
    health: 100, 
    oxygen: 100, 
    battery: 88,
    medkits: 8,
    crewCount: 6,
    speed: 0,
    droneAvailable: false,
    commSignal: 85,
    lastSync: '5s ago',
    members: ['Capt. Singh', 'Officer Amit', 'L. Rogers', 'S. Park', 'D. Wilson', 'M. Knight'] 
  },
  { 
    id: 't3', 
    name: 'Charlie Team', 
    leader: 'Lt. Marcus Thorne',
    type: 'rescue_boat', 
    status: 'AVAILABLE', 
    location: [28.6100, 77.2300], 
    fuel: 78, 
    health: 95, 
    oxygen: 85, 
    battery: 72,
    medkits: 15,
    crewCount: 5,
    speed: 0,
    droneAvailable: true,
    commSignal: 92,
    lastSync: '1s ago',
    members: ['Cmdr. Gupta', 'Diver Sonu', 'R. Miller', 'J. Doe', 'K. Varma'] 
  },
  { 
    id: 't4', 
    name: 'Delta Team', 
    leader: 'Pilot Elena Rossi',
    type: 'helicopter', 
    status: 'AVAILABLE', 
    location: [28.6300, 77.2000], 
    fuel: 65, 
    health: 100, 
    oxygen: 100, 
    battery: 100,
    medkits: 20,
    crewCount: 3,
    speed: 0,
    droneAvailable: true,
    commSignal: 100,
    lastSync: 'Now',
    members: ['Pilot Vikrant', 'Medic Ananya', 'Tech S. Lee'] 
  },
];

let missions = [];

class DispatchService {
  async getAllTeams() {
    return teams;
  }

  async getActiveMissions() {
    return missions;
  }

  async assignMission(teamId, sosId) {
    const teamIndex = teams.findIndex(t => t.id === teamId);
    if (teamIndex === -1) throw new Error('Team not found');
    
    // In a real app, you'd fetch SOS details from DB
    const sosLocation = [28.6500, 77.2500];
    
    teams[teamIndex].status = 'DISPATCHED';
    teams[teamIndex].speed = 45; // Simulated speed km/h
    
    const mission = {
      id: `m-${Date.now()}`,
      teamId,
      sosId,
      status: 'EN_ROUTE',
      startTime: new Date(),
      origin: [...teams[teamIndex].location],
      destination: sosLocation,
      currentLocation: [...teams[teamIndex].location],
      route: this.generateMockRoute(teams[teamIndex].location, sosLocation),
      eta: '8 mins',
      progress: 0
    };
    
    missions.push(mission);
    return mission;
  }

  async autoAssignNearestTeam(sosId) {
    const availableTeams = teams.filter(t => t.status === 'AVAILABLE');
    if (availableTeams.length === 0) return null;

    const sosLocation = [28.6500, 77.2500];
    
    let nearestTeam = availableTeams[0];
    let minDistance = this.calculateDistance(nearestTeam.location, sosLocation);

    for (let i = 1; i < availableTeams.length; i++) {
      const dist = this.calculateDistance(availableTeams[i].location, sosLocation);
      if (dist < minDistance) {
        minDistance = dist;
        nearestTeam = availableTeams[i];
      }
    }

    return await this.assignMission(nearestTeam.id, sosId);
  }

  calculateDistance(p1, p2) {
    return Math.sqrt(Math.pow(p1[0] - p2[0], 2) + Math.pow(p1[1] - p2[1], 2));
  }

  generateMockRoute(start, end) {
    const points = [];
    const steps = 100;
    // Add some "tactical" jitter to the route
    for (let i = 0; i <= steps; i++) {
      const ratio = i / steps;
      const lat = start[0] + (end[0] - start[0]) * ratio;
      const lng = start[1] + (end[1] - start[1]) * ratio;
      
      // Add slight curves
      const curve = Math.sin(ratio * Math.PI) * 0.002;
      points.push([lat + curve, lng + curve]);
    }
    return points;
  }

  updateMissionProgress(missionId) {
    const missionIndex = missions.findIndex(m => m.id === missionId);
    if (missionIndex === -1) return null;

    const mission = missions[missionIndex];
    const team = teams.find(t => t.id === mission.teamId);

    const route = mission.route;
    const currentIndex = Math.floor(mission.progress * (route.length - 1));
    
    if (mission.progress < 1) {
      mission.progress += 0.005; // Advance 0.5% each second
      const nextIndex = Math.min(Math.floor(mission.progress * (route.length - 1)), route.length - 1);
      mission.currentLocation = route[nextIndex];
      
      if (team) {
        team.location = mission.currentLocation;
        team.speed = 40 + Math.random() * 20; // Varied speed
        team.fuel -= 0.01;
        team.battery -= 0.005;
      }
      return mission;
    } else {
      mission.status = 'RESCUING';
      if (team) {
        team.status = 'RESCUING';
        team.speed = 0;
      }
      return mission;
    }
  }
}

export default new DispatchService();
