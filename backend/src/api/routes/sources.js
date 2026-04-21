import express from 'express';
import { supabase } from '../../config/database.js';
import { encryptCredential } from '../../lib/crypto.js';
import { syncSource } from '../../importers/runner.js';
import { logger } from '../../utils/logger.js';

const router = express.Router();

// GET /api/sources — list sources for org
router.get('/api/sources', async (req, res) => {
  try {
    const orgId = req.query.orgId;
    if (!orgId) return res.status(400).json({ error: 'orgId required' });

    const { data, error } = await supabase
      .from('billing_sources')
      .select('id, provider, nickname, status, last_synced_at, last_error, created_at')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, sources: data || [] });
  } catch (err) {
    logger.error('List sources error', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/sources — create new source
router.post('/api/sources', async (req, res) => {
  try {
    const { orgId, provider, nickname, credentials } = req.body;
    if (!orgId) return res.status(400).json({ error: 'orgId required' });
    if (!['openai', 'anthropic', 'bedrock'].includes(provider)) return res.status(400).json({ error: 'Invalid provider' });
    if (!credentials || typeof credentials !== 'object') return res.status(400).json({ error: 'credentials required' });

    const encrypted = encryptCredential(JSON.stringify(credentials));

    const { data, error } = await supabase.from('billing_sources').insert({
      org_id: orgId, provider, nickname: nickname || null,
      credentials_encrypted: encrypted, status: 'pending',
    }).select('id, provider, nickname, status, created_at').single();

    if (error) return res.status(500).json({ error: error.message });

    // Fire-and-forget first sync
    syncSource(data.id).catch(err => logger.error('Initial sync failed', err));

    res.json({ success: true, source: data });
  } catch (err) {
    logger.error('Create source error', err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/sources/:id/sync — manual sync trigger
router.post('/api/sources/:id/sync', async (req, res) => {
  try {
    const result = await syncSource(req.params.id);
    res.json({ success: true, ...result });
  } catch (err) {
    logger.error('Manual sync error', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/sources/:id — disable source
router.delete('/api/sources/:id', async (req, res) => {
  try {
    await supabase.from('billing_sources').update({ status: 'disabled', updated_at: new Date().toISOString() }).eq('id', req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
