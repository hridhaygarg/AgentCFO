import type { LogRecord, IngestPayload } from './types.js';

const MAX_BATCH = 50;
const FLUSH_INTERVAL_MS = 5000;
const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

export class Transport {
  private buffer: LogRecord[] = [];
  private timer: ReturnType<typeof setTimeout> | null = null;
  private endpoint: string;
  private apiKey: string;
  private debug: boolean;

  constructor(endpoint: string, apiKey: string, debug = false) {
    this.endpoint = endpoint;
    this.apiKey = apiKey;
    this.debug = debug;
  }

  push(record: LogRecord): void {
    this.buffer.push(record);
    if (this.buffer.length >= MAX_BATCH) {
      this.flush();
    } else if (!this.timer) {
      this.timer = setTimeout(() => this.flush(), FLUSH_INTERVAL_MS);
    }
  }

  flush(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.buffer.length === 0) return;

    const batch = this.buffer.splice(0);
    this.send(batch).catch(() => {
      // Silently drop on final failure — never interrupt customer code
    });
  }

  private async send(records: LogRecord[], attempt = 0): Promise<void> {
    const payload: IngestPayload = { records };

    try {
      const res = await fetch(`${this.endpoint}/v1/log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Layeroi-Key': this.apiKey,
        },
        body: JSON.stringify(payload),
      });

      if (this.debug) {
        console.log(`[layeroi] flush ${records.length} records → ${res.status}`);
      }

      if (res.status === 429 || res.status >= 500) {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (err) {
      if (attempt < MAX_RETRIES) {
        const delay = BASE_DELAY_MS * Math.pow(2, attempt);
        if (this.debug) {
          console.log(`[layeroi] retry ${attempt + 1}/${MAX_RETRIES} in ${delay}ms`);
        }
        await new Promise(r => setTimeout(r, delay));
        return this.send(records, attempt + 1);
      }
      if (this.debug) {
        console.error(`[layeroi] dropped ${records.length} records after ${MAX_RETRIES} retries`);
      }
      // Drop silently
    }
  }

  destroy(): void {
    this.flush();
  }
}
