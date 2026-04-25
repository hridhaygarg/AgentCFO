export interface LayeroiConfig {
  apiKey: string;
  endpoint?: string;
  debug?: boolean;
}

export interface WrapOptions {
  agent: string;
  metadata?: Record<string, unknown>;
}

export interface TaskContext {
  taskId: string;
  metadata?: Record<string, unknown>;
}

export interface LogRecord {
  sdk_record_id: string;
  agent: string;
  task_id?: string;
  model: string;
  provider: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  cost_usd: number;
  latency_ms: number;
  status: 'success' | 'error';
  error_message?: string;
  metadata?: Record<string, unknown>;
  sdk_version: string;
  timestamp: string;
}

export interface IngestPayload {
  records: LogRecord[];
}

export interface IngestResponse {
  accepted: number;
  rejected: number;
}
