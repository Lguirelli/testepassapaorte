ALTER TABLE trips RENAME COLUMN data TO legacy_data;
--> statement-breakpoint
ALTER TABLE trips ALTER COLUMN legacy_data DROP NOT NULL;
--> statement-breakpoint
ALTER TABLE trips ALTER COLUMN synthetic SET DEFAULT false;
--> statement-breakpoint
ALTER TABLE tracking_events ALTER COLUMN synthetic SET DEFAULT false;
--> statement-breakpoint
CREATE TABLE auth_sessions (
  id text PRIMARY KEY,
  auth_subject text NOT NULL,
  role text NOT NULL,
  partner_id text REFERENCES partners(id) ON DELETE SET NULL,
  traveler_user_id text REFERENCES traveler_users(id) ON DELETE SET NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz
);
--> statement-breakpoint
CREATE INDEX auth_sessions_subject_idx ON auth_sessions(auth_subject);
--> statement-breakpoint
CREATE INDEX auth_sessions_expires_idx ON auth_sessions(expires_at);
