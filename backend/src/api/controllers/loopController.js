import { checkRunawayLoop, getAgentCallStats } from '../../loopDetector.js';
import { logger } from '../../utils/logger.js';

export function checkForRunawayLoop(agentName, messages) {
  return checkRunawayLoop(agentName, messages);
}

export function getAgentStats(req, res) {
  try {
    const { agent } = req.params;
    const stats = getAgentCallStats(agent);
    res.json(stats);
  } catch (err) {
    logger.error('Get agent stats failed', err);
    res.status(500).json({ error: err.message });
  }
}
