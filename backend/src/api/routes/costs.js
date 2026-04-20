import express from 'express';
import { getAgentCostsSummary, getAllCosts } from '../controllers/index.js';

const router = express.Router();

router.get('/api/costs/:agent', getAgentCostsSummary);
router.get('/api/costs', getAllCosts);
router.get('/api/stats', getAllCosts);
router.get('/api/stats/:agent', getAgentCostsSummary);

export default router;
