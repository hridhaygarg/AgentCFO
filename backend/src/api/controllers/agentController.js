import { getAllAgents } from '../../database/queries/index.js';
import { logger } from '../../utils/logger.js';

export async function listAllAgents(req, res) {
  try {
    const agents = await getAllAgents();
    res.json({ agents });
  } catch (err) {
    logger.error('Get agents failed', err);
    res.status(500).json({ error: err.message });
  }
}
