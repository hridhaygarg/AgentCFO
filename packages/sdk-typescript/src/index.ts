import { LayeroiClient } from './client.js';

export const layeroi = new LayeroiClient();

export { LayeroiClient } from './client.js';
export { computeCost, getModelProvider, fetchPricing, PRICING } from './pricing.js';
export type {
  LayeroiConfig,
  WrapOptions,
  TaskContext,
  LogRecord,
  IngestPayload,
  IngestResponse,
} from './types.js';
