import { logger } from '../utils/logger.js';
import { supabase } from '../config/database.js';

const MAX_RETRIES = 3;
const RETRY_DELAYS = [5000, 30000, 120000]; // 5s, 30s, 2m

export async function registerWebhook(orgId, eventType, url) {
  try {
    const { data, error } = await supabase
      .from('webhooks')
      .insert([{ organisation_id: orgId, event_type: eventType, url, active: true }])
      .select();

    if (error) throw error;
    logger.info('Webhook registered', { orgId, eventType, url: url.substring(0, 50) });
    return data?.[0] || null;
  } catch (error) {
    logger.error('Register webhook failed', error);
    return null;
  }
}

export async function sendWebhookEvent(orgId, eventType, payload) {
  try {
    const { data: webhooks, error } = await supabase
      .from('webhooks')
      .select('*')
      .eq('organisation_id', orgId)
      .eq('event_type', eventType)
      .eq('active', true);

    if (error) throw error;

    for (const webhook of webhooks || []) {
      deliverWebhookWithRetry(webhook, payload, 0);
    }

    logger.info('Webhook events queued', { orgId, eventType, count: webhooks?.length || 0 });
  } catch (error) {
    logger.error('Send webhook failed', error);
  }
}

async function deliverWebhookWithRetry(webhook, payload, attempt) {
  try {
    const response = await fetch(webhook.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    });

    if (response.ok) {
      logger.info('Webhook delivered', { webhookId: webhook.id });
      return;
    }

    throw new Error(`HTTP ${response.status}`);
  } catch (error) {
    if (attempt < MAX_RETRIES) {
      const delay = RETRY_DELAYS[attempt];
      setTimeout(() => deliverWebhookWithRetry(webhook, payload, attempt + 1), delay);
      logger.warn('Webhook retry scheduled', { webhookId: webhook.id, attempt: attempt + 1 });
    } else {
      logger.error('Webhook delivery failed after retries', error, { webhookId: webhook.id });
    }
  }
}

export async function getWebhooks(orgId) {
  try {
    const { data, error } = await supabase.from('webhooks').select('*').eq('organisation_id', orgId);
    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error('Get webhooks failed', error);
    return [];
  }
}

export async function deleteWebhook(webhookId) {
  try {
    const { error } = await supabase.from('webhooks').delete().eq('id', webhookId);
    if (error) throw error;
    logger.info('Webhook deleted', { webhookId });
    return true;
  } catch (error) {
    logger.error('Delete webhook failed', error);
    return false;
  }
}
