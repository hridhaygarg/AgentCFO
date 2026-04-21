import { ImporterResult } from './base.js';

const PRICING = {
  'gpt-4o':        { input: 0.0025, output: 0.010 },
  'gpt-4o-mini':   { input: 0.00015, output: 0.0006 },
  'gpt-4-turbo':   { input: 0.010, output: 0.030 },
  'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
  'o1':            { input: 0.015, output: 0.060 },
  'o3-mini':       { input: 0.002, output: 0.008 },
};

function costFor(model, tokensIn, tokensOut) {
  const p = PRICING[model] || PRICING['gpt-4o-mini'];
  return (tokensIn / 1000) * p.input + (tokensOut / 1000) * p.output;
}

export async function run(source, { since }) {
  const sinceUnix = Math.floor((since || new Date(Date.now() - 7 * 86400000)).getTime() / 1000);
  const apiKey = source.credentials.api_key;

  const params = new URLSearchParams({ start_time: sinceUnix.toString(), bucket_width: '1d', group_by: 'model,project_id', limit: '180' });
  const res = await fetch(`https://api.openai.com/v1/organization/usage/completions?${params}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!res.ok) throw new Error(`OpenAI usage API ${res.status}: ${(await res.text()).slice(0, 200)}`);

  const data = await res.json();
  const rows = [];

  for (const bucket of data.data || []) {
    for (const result of bucket.results || []) {
      const tokensIn = result.input_tokens || 0;
      const tokensOut = result.output_tokens || 0;
      if (tokensIn === 0 && tokensOut === 0) continue;
      const model = result.model || 'gpt-4o-mini';
      const projectId = result.project_id || 'default';
      rows.push({
        external_id: `openai:${bucket.start_time}:${model}:${projectId}`,
        agent_name: `project:${projectId}`, // TODO: allow customer to rename agents
        provider: 'openai', model,
        cost: costFor(model, tokensIn, tokensOut), value: 0,
        tokens_input: tokensIn, tokens_output: tokensOut,
        created_at: new Date(bucket.start_time * 1000).toISOString(),
      });
    }
  }

  return new ImporterResult({ rows, periodStart: new Date(sinceUnix * 1000), periodEnd: new Date() });
}
