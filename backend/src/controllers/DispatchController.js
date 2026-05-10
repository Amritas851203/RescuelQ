import DispatchService from '../services/DispatchService.js';

class DispatchController {
  async getTeams(req, res) {
    try {
      const teams = await DispatchService.getAllTeams();
      res.json(teams);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching teams', error: error.message });
    }
  }

  async getActiveMissions(req, res) {
    try {
      const missions = await DispatchService.getActiveMissions();
      res.json(missions);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching missions', error: error.message });
    }
  }

  async assignMission(req, res) {
    try {
      const { teamId, sosId } = req.body;
      const mission = await DispatchService.assignMission(teamId, sosId);
      
      // Notify via socket
      req.io.emit('mission_assigned', mission);
      
      res.status(201).json(mission);
    } catch (error) {
      res.status(400).json({ message: 'Error assigning mission', error: error.message });
    }
  }

  async autoAssignAI(req, res) {
    try {
      const { sosId } = req.body;
      const result = await DispatchService.autoAssignNearestTeam(sosId);
      
      if (result) {
        req.io.emit('mission_assigned', result);
        res.json(result);
      } else {
        res.status(404).json({ message: 'No available teams found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'AI Dispatch failed', error: error.message });
    }
  }
}

export default new DispatchController();
