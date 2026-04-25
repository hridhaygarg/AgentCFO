import express from 'express';
import rateLimit from 'express-rate-limit';
import { supabase } from '../../config/database.js';
import { logger } from '../../utils/logger.js';

const router = express.Router();

// Rate limit: 1000 records/min per API key
const ingestLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 1000,
  keyGenerator: (req) => req.headers['x-layeroi-key'] || req.ip,
  message: { error: 'Rate limited', retry_after: 60 },
  standardHeaders: true,
});

// Auth: resolve org from X-Layeroi-Key header
async function resolveOrg(req, res, next) {
  const key = req.headers['x-layeroi-key'];
  if (!key) return res.status(401).json({ error: 'X-Layeroi-Key header required' });

  const { data: org, error } = await supabase
    .from('organisations')
    .select('id')
    .eq('api_key', key)
    .single();

  if (error || !org) return res.status(401).json({ error: 'Invalid API key' });

  req.orgId = org.id;
  next();
}

// Cache for agent and source lookups within a request
const agentCache = new Map();
const sourceCache = new Map();

async function findOrCreateAgent(orgId, name, provider) {
  const cacheKey = `${orgId}:${name}`;
  if (agentCache.has(cacheKey)) return agentCache.get(cacheKey);

  const { data: existing } = await supabase
    .from('agents')
    .select('id')
    .eq('org_id', orgId)
    .eq('name', name)
    .single();

  if (existing) {
    agentCache.set(cacheKey, existing.id);
    return existing.id;
  }

  const { data: created } = await supabase
    .from('agents')
    .insert({ org_id: orgId, name, provider: provider || 'openai' })
    .select('id')
    .single();

  if (created) {
    agentCache.set(cacheKey, created.id);
    return created.id;
  }

  // Race condition: another request created it
  const { data: retry } = await supabase
    .from('agents')
    .select('id')
    .eq('org_id', orgId)
    .eq('name', name)
    .single();

  const id = retry?.id;
  if (id) agentCache.set(cacheKey, id);
  return id;
}

async function findOrCreateSdkSource(orgId) {
  if (sourceCache.has(orgId)) return sourceCache.get(orgId);

  const { data: existing } = await supabase
    .from('billing_sources')
    .select('id')
    .eq('org_id', orgId)
    .eq('provider', 'sdk')
    .single();

  if (existing) {
    sourceCache.set(orgId, existing.id);
    return existing.id;
  }

  const { data: created } = await supabase
    .from('billing_sources')
    .insert({
      org_id: orgId,
      provider: 'sdk',
      nickname: 'SDK Ingestion',
      status: 'active',
      credentials_encrypted: 'sdk',
    })
    .select('id')
    .single();

  if (created) {
    sourceCache.set(orgId, created.id);
    return created.id;
  }

  const { data: retry } = await supabase
    .from('billing_sources')
    .select('id')
    .eq('org_id', orgId)
    .eq('provider', 'sdk')
    .single();

  const id = retry?.id;
  if (id) sourceCache.set(orgId, id);
  return id;
}

// POST /v1/log
router.post('/v1/log', ingestLimiter, resolveOrg, async (req, res) => {
  try {
    const { records } = req.body;
    if (!records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ error: 'records array required' });
    }

    if (records.length > 500) {
      return res.status(400).json({ error: 'Max 500 records per batch' });
    }

    const orgId = req.orgId;
    const sourceId = await findOrCreateSdkSource(orgId);

    let accepted = 0;
    const errors = [];

    // Process in batches of 100 for Supabase insert efficiency
    for (let i = 0; i < records.length; i += 100) {
      const batch = records.slice(i, i + 100);
      const rows = [];

      for (let j = 0; j < batch.length; j++) {
        const r = batch[j];
        try {
          const agentId = await findOrCreateAgent(orgId, r.agent, r.provider);

          rows.push({
            org_id: orgId,
            source_id: sourceId,
            agent_id: agentId,
            agent_name: r.agent,
            external_id: r.sdk_record_id,
            sdk_record_id: r.sdk_record_id,
            task_id: r.task_id || null,
            provider: r.provider || 'openai',
            model: r.model,
            prompt_tokens: r.prompt_tokens || 0,
            completion_tokens: r.completion_tokens || 0,
            total_tokens: r.total_tokens || 0,
            cost_usd: r.cost_usd || 0,
            latency_ms: r.latency_ms || 0,
            status: r.status || 'success',
            error_message: r.error_message || null,
            metadata: r.metadata || null,
            sdk_version: r.sdk_version || null,
            created_at: r.timestamp || new Date().toISOString(),
          });
        } catch (err) {
          errors.push({ index: i + j, error: err.message });
        }
      }

      if (rows.length > 0) {
        const { error: insertErr } = await supabase
          .from('api_logs')
          .upsert(rows, {
            onConflict: 'org_id,sdk_record_id',
            ignoreDuplicates: true,
          });

        if (insertErr) {
          logger.error('Ingest batch insert error', insertErr);
          errors.push({ batch: i, error: insertErr.message });
        } else {
          accepted += rows.length;
        }
      }
    }

    if (errors.length > 0 && accepted > 0) {
      return res.status(207).json({ accepted, rejected: errors.length, errors });
    }
    if (errors.length > 0 && accepted === 0) {
      return res.status(500).json({ accepted: 0, rejected: errors.length, errors });
    }

    res.json({ accepted, rejected: 0 });
  } catch (err) {
    logger.error('Ingest endpoint error', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
