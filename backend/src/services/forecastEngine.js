import { logger } from '../utils/logger.js';
import { supabase } from '../config/database.js';

export async function generateSpendForecast(orgId, daysAhead = 30) {
  try {
    // Get last 30 days of spend data
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const { data: historicalData, error } = await supabase
      .from('api_logs')
      .select('cost_usd, timestamp')
      .eq('org_id', orgId)
      .gte('timestamp', thirtyDaysAgo.toISOString())
      .order('timestamp');

    if (error) throw error;

    if (!historicalData || historicalData.length === 0) {
      logger.info('No historical data for forecast', { orgId });
      return [];
    }

    // Calculate daily averages
    const dailySpend = {};
    historicalData.forEach(log => {
      const date = new Date(log.timestamp).toISOString().split('T')[0];
      dailySpend[date] = (dailySpend[date] || 0) + (log.cost_usd || 0);
    });

    const avgDaily = Object.values(dailySpend).reduce((a, b) => a + b, 0) / Object.values(dailySpend).length;

    // Generate forecasts
    const forecasts = [];
    for (let i = 1; i <= daysAhead; i++) {
      const forecastDate = new Date(Date.now() + i * 24 * 60 * 60 * 1000);
      const predictedCost = avgDaily * (1 + (Math.random() - 0.5) * 0.1); // 10% variance

      const { data: stored } = await supabase
        .from('spend_forecasts')
        .upsert(
          [
            {
              organisation_id: orgId,
              forecast_month: forecastDate.toISOString().split('T')[0],
              predicted_cost: parseFloat(predictedCost.toFixed(2)),
              confidence_level: 0.85,
              based_on_days: 30,
            },
          ],
          { onConflict: 'organisation_id,forecast_month' }
        )
        .select();

      if (stored) forecasts.push(stored[0]);
    }

    logger.info('Forecast generated', { orgId, daysAhead, avgDaily: avgDaily.toFixed(2) });
    return forecasts;
  } catch (error) {
    logger.error('Forecast generation failed', error);
    return [];
  }
}

export async function getSpendForecasts(orgId, months = 3) {
  try {
    const { data, error } = await supabase
      .from('spend_forecasts')
      .select('*')
      .eq('organisation_id', orgId)
      .order('forecast_month')
      .limit(months);

    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error('Get forecasts failed', error);
    return [];
  }
}
