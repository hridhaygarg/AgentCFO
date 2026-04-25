-- SDK ingestion columns on api_logs
ALTER TABLE api_logs ADD COLUMN IF NOT EXISTS sdk_record_id UUID;
ALTER TABLE api_logs ADD COLUMN IF NOT EXISTS task_id VARCHAR(64);
ALTER TABLE api_logs ADD COLUMN IF NOT EXISTS sdk_version VARCHAR(32);
ALTER TABLE api_logs ADD COLUMN IF NOT EXISTS metadata JSONB;
ALTER TABLE api_logs ADD COLUMN IF NOT EXISTS error_message TEXT;

-- Partial unique index for SDK record deduplication
CREATE UNIQUE INDEX IF NOT EXISTS idx_api_logs_sdk_dedup
  ON api_logs (org_id, sdk_record_id) WHERE sdk_record_id IS NOT NULL;

-- Organisation columns for SDK auth + RIF wedge
ALTER TABLE organisations ADD COLUMN IF NOT EXISTS api_key VARCHAR(64);
ALTER TABLE organisations ADD COLUMN IF NOT EXISTS rif_enrolled BOOLEAN DEFAULT false;
ALTER TABLE organisations ADD COLUMN IF NOT EXISTS rif_daily_burst_threshold_usd NUMERIC DEFAULT 0;

-- Index on api_key for fast auth lookup
CREATE INDEX IF NOT EXISTS idx_organisations_api_key ON organisations(api_key) WHERE api_key IS NOT NULL;
