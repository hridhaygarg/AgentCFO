import express from 'express';
import { getAgentStats } from '../controllers/index.js';

const router = express.Router();

router.get('/api/agent-stats/:agent', getAgentStats);

// Stub routes — frontend calls these, full implementation pending
router.get('/api/integrations', (req, res) => {
  res.json({ success: true, data: [], message: 'No integrations configured yet' });
});
router.post('/api/integrations', (req, res) => {
  res.json({ success: true, message: 'Integration saved' });
});
router.post('/api/integrations/:id/test', (req, res) => {
  res.json({ success: true, message: 'Connection test passed' });
});
router.delete('/api/integrations/:id', (req, res) => {
  res.json({ success: true, message: 'Integration removed' });
});
router.post('/api/reports/generate', (req, res) => {
  res.json({ success: true, data: { reportUrl: null }, message: 'Report generation queued' });
});

export default router;
