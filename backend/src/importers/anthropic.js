import { ImporterResult } from './base.js';

const PRICING = {
  'claude-sonnet-4': { input: 0.003, output: 0.015 },
  'claude-opus-4':   { input: 0.015, output: 0.075 },
  'claude-haiku-4':  { input: 0.0008, output: 0.004 },
  'claude-3-5-sonnet': { input: 0.003, output: 0.015 },
  'claude-3-opus':   { input: 0.015, output: 0.075 },
};

function costFor(model, tokensIn, tokensOut) {
  const key = Object.keys(PRICING).find(k => model.includes(k)) || 'claude-haiku-4';
  const p = PRICING[key];
  return (tokensIn / 1000) * p.input + (tokensOut / 1000) * p.output;
}

export async function run(source, { since }) {
  const apiKey = source.credentials.api_key;
  const startingAt = (since || new Date(Date.now() - 7 * 86400000)).toISOString();

  const params = new URLSearchParams({ starting_at: startingAt, bucket_width: '1d', group_by: 'model,workspace_id', limit: '100' });
  const res = await fetch(`https://api.anthropic.com/v1/organizations/usage_report/messages?${params}`, {
    headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
  });

  if (!res.ok) throw new Error(`Anthropic usage API ${res.status}: ${(await res.text()).slice(0, 200)}`);

  const data = await res.json();
  const rows = [];

  for (const bucket of data.data || []) {
    for (const result of bucket.results || []) {
      const tokensIn = (result.uncached_input_tokens || 0) + (result.cache_read_input_tokens || 0);
      const tokensOut = result.output_tokens || 0;
      if (tokensIn === 0 && tokensOut === 0) continue;
      const model = result.model || 'claude-haiku-4';
      const workspaceId = result.workspace_id || 'default';
      rows.push({
        external_id: `anthropic:${bucket.starting_at}:${model}:${workspaceId}`,
        agent_name: `workspace:${workspaceId}`,
        provider: 'anthropic', model,
        cost: costFor(model, tokensIn, tokensOut), value: 0,
        tokens_input: tokensIn, tokens_output: tokensOut,
        created_at: bucket.starting_at,
      });
    }
  }

  return new ImporterResult({ rows, periodStart: new Date(startingAt), periodEnd: new Date() });
}
