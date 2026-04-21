import { ImporterResult } from './base.js';

export async function run(source, { since }) {
  const { access_key_id, secret_access_key, region } = source.credentials;

  // Dynamic import to avoid requiring aws-sdk if not used
  const { CostExplorerClient, GetCostAndUsageCommand } = await import('@aws-sdk/client-cost-explorer');

  const client = new CostExplorerClient({
    region: region || 'us-east-1',
    credentials: { accessKeyId: access_key_id, secretAccessKey: secret_access_key },
  });

  const startDate = (since || new Date(Date.now() - 7 * 86400000)).toISOString().slice(0, 10);
  const endDate = new Date().toISOString().slice(0, 10);

  const response = await client.send(new GetCostAndUsageCommand({
    TimePeriod: { Start: startDate, End: endDate },
    Granularity: 'DAILY',
    Metrics: ['UnblendedCost'],
    Filter: { Dimensions: { Key: 'SERVICE', Values: ['Amazon Bedrock'] } },
    GroupBy: [{ Type: 'DIMENSION', Key: 'USAGE_TYPE' }],
  }));

  const rows = [];
  for (const byTime of response.ResultsByTime || []) {
    for (const group of byTime.Groups || []) {
      const cost = parseFloat(group.Metrics?.UnblendedCost?.Amount || '0');
      if (cost === 0) continue;
      const usageType = group.Keys?.[0] || 'unknown';
      const model = usageType.split(':').pop() || 'unknown-bedrock';
      rows.push({
        external_id: `bedrock:${byTime.TimePeriod.Start}:${usageType}`,
        agent_name: `bedrock:${model}`, provider: 'bedrock', model,
        cost_usd: cost, value: 0, prompt_tokens: 0, completion_tokens: 0,
        created_at: new Date(byTime.TimePeriod.Start).toISOString(),
      });
    }
  }

  return new ImporterResult({ rows, periodStart: new Date(startDate), periodEnd: new Date() });
}
