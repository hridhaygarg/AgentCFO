import { getAgentCosts, getAllAgents } from '../../database/queries/index.js';
import { logger } from '../../utils/logger.js';

export async function getAgentCostsSummary(req, res) {
  try {
    const { agent } = req.params;
    const costs = await getAgentCosts(agent);
    res.json(costs);
  } catch (err) {
    logger.error('Get costs failed', err);
    res.status(500).json({ error: err.message });
  }
}

export async function getAllCosts(req, res) {
  try {
    const agents = await getAllAgents();
    const costs = {};
    for (const agent of agents) {
      costs[agent] = await getAgentCosts(agent);
    }
    res.json({ costs });
  } catch (err) {
    logger.error('Get all costs failed', err);
    res.status(500).json({ error: err.message });
  }
}
