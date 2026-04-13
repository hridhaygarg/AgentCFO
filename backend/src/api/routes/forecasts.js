import express from 'express';
import { logger } from '../../utils/logger.js';
import { generateSpendForecast, getSpendForecasts } from '../../services/forecastEngine.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(optionalAuth);

router.post('/api/forecasts/generate', async (req, res) => {
  try {
    const orgId = req.orgId || req.body.orgId;
    const daysAhead = req.body.daysAhead || 30;

    if (!orgId) return res.status(400).json({ error: 'Organization ID required' });

    const forecasts = await generateSpendForecast(orgId, daysAhead);
    res.json({ success: true, count: forecasts.length, forecasts });
    logger.info('Forecasts generated', { orgId, daysAhead });
  } catch (err) {
    logger.error('Generate forecasts failed', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/api/forecasts', async (req, res) => {
  try {
    const orgId = req.orgId || req.query.orgId;
    const months = parseInt(req.query.months) || 3;

    if (!orgId) return res.status(400).json({ error: 'Organization ID required' });

    const forecasts = await getSpendForecasts(orgId, months);
    res.json({ orgId, count: forecasts.length, forecasts });
  } catch (err) {
    logger.error('Get forecasts failed', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
