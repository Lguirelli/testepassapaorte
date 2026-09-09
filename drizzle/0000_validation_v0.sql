CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS content_entities (
  id text PRIMARY KEY,
  kind text NOT NULL,
  slug text,
  status text NOT NULL DEFAULT 'published',
  synthetic boolean NOT NULL DEFAULT true,
  data jsonb NOT NULL,
  geom geometry(Point,4326),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS content_entities_kind_idx ON content_entities(kind);
CREATE INDEX IF NOT EXISTS content_entities_slug_idx ON content_entities(slug);
CREATE INDEX IF NOT EXISTS content_entities_geom_gix ON content_entities USING GIST(geom);

CREATE TABLE IF NOT EXISTS content_drafts (
  entity_id text PRIMARY KEY REFERENCES content_entities(id) ON DELETE CASCADE,
  kind text NOT NULL,
  data jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS audit_logs (
  id text PRIMARY KEY,
  actor text NOT NULL,
  action text NOT NULL,
  entity_kind text NOT NULL,
  entity_id text NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now(),
  before_json jsonb,
  after_json jsonb
);
CREATE INDEX IF NOT EXISTS audit_logs_entity_idx ON audit_logs(entity_kind, entity_id, timestamp DESC);
CREATE TABLE IF NOT EXISTS trip_bundles (
  id text PRIMARY KEY,
  synthetic boolean NOT NULL DEFAULT true,
  data jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS tracking_events (
  id text PRIMARY KEY,
  event_name text NOT NULL,
  payload jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS tracking_events_name_idx ON tracking_events(event_name, created_at DESC);
