interface LayeroiConfig {
    apiKey: string;
    endpoint?: string;
    debug?: boolean;
}
interface WrapOptions {
    agent: string;
    metadata?: Record<string, unknown>;
}
interface TaskContext {
    taskId: string;
    metadata?: Record<string, unknown>;
}
interface LogRecord {
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
interface IngestPayload {
    records: LogRecord[];
}
interface IngestResponse {
    accepted: number;
    rejected: number;
}

declare class LayeroiClient {
    private config;
    private transport;
    init(config: LayeroiConfig): void;
    wrap<T extends object>(client: T, options: WrapOptions): T;
    task<T>(taskId: string, metadata: Record<string, unknown> | null, fn: () => T | Promise<T>): Promise<T>;
    flush(): void;
    destroy(): void;
}

declare const PRICING: Record<string, {
    input: number;
    output: number;
}>;
declare function computeCost(model: string, promptTokens: number, completionTokens: number): number;
declare function getModelProvider(model: string): string;
declare function fetchPricing(): Promise<typeof PRICING>;

declare const layeroi: LayeroiClient;

export { type IngestPayload, type IngestResponse, LayeroiClient, type LayeroiConfig, type LogRecord, PRICING, type TaskContext, type WrapOptions, computeCost, fetchPricing, getModelProvider, layeroi };
