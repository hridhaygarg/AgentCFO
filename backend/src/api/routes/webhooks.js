import express from 'express';
import { logger } from '../../utils/logger.js';
import { registerWebhook, getWebhooks, deleteWebhook } from '../../services/webhookService.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(optionalAuth);

router.post('/api/webhooks', async (req, res) => {
  try {
    const orgId = req.orgId || req.body.orgId;
    const { eventType, url } = req.body;

    if (!orgId || !eventType || !url) {
      return res.status(400).json({ error: 'orgId, eventType, url required' });
    }

    const webhook = await registerWebhook(orgId, eventType, url);
    res.status(201).json(webhook);
  } catch (err) {
    logger.error('Register webhook failed', err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/api/webhooks', async (req, res) => {
  try {
    const orgId = req.orgId || req.query.orgId;
    if (!orgId) return res.status(400).json({ error: 'Organization ID required' });

    const webhooks = await getWebhooks(orgId);
    res.json({ orgId, count: webhooks.length, webhooks });
  } catch (err) {
    logger.error('Get webhooks failed', err);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/api/webhooks/:webhookId', async (req, res) => {
  try {
    const success = await deleteWebhook(req.params.webhookId);
    res.json({ success, webhookId: req.params.webhookId });
  } catch (err) {
    logger.error('Delete webhook failed', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
