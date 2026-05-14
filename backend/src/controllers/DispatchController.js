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
      
      if (sosId) {
        const result = await DispatchService.autoAssignNearestTeam(sosId);
        if (result) {
          req.io.emit('mission_assigned', result);
          return res.json(result);
        }
        return res.status(404).json({ message: 'No available teams found for this incident' });
      } else {
        // Global Auto-Assign
        const results = await DispatchService.globalAutoAssign();
        results.forEach(m => req.io.emit('mission_assigned', m));
        res.json({ message: `Successfully auto-assigned ${results.length} missions`, missions: results });
      }
    } catch (error) {
      res.status(500).json({ message: 'AI Dispatch failed', error: error.message });
    }
  }

  async recallMission(req, res) {
    try {
      const { teamId } = req.body;
      const result = await DispatchService.recallTeam(teamId);
      req.io.emit('team_recalled', result);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Recall failed', error: error.message });
    }
  }

  async holdMission(req, res) {
    try {
      const { teamId } = req.body;
      const result = await DispatchService.holdTeam(teamId);
      req.io.emit('team_held', result);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Hold failed', error: error.message });
    }
  }
}

export default new DispatchController();
