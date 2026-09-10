CREATE TABLE IF NOT EXISTS content (id text PRIMARY KEY, kind text NOT NULL, slug text NOT NULL, status text NOT NULL DEFAULT 'draft', draft jsonb NOT NULL, published jsonb, version integer NOT NULL DEFAULT 1, synthetic boolean NOT NULL DEFAULT true, CONSTRAINT content_state CHECK (status IN ('draft','published','archived','needs_review')));
CREATE UNIQUE INDEX IF NOT EXISTS content_kind_slug ON content(kind,slug);
CREATE TABLE IF NOT EXISTS audit (id text PRIMARY KEY, actor text NOT NULL, action text NOT NULL, entity text NOT NULL, at timestamptz NOT NULL DEFAULT now(), before jsonb, after jsonb);
CREATE TABLE IF NOT EXISTS trips (id text PRIMARY KEY, owner text NOT NULL, data jsonb NOT NULL, version integer NOT NULL DEFAULT 1, synthetic boolean NOT NULL DEFAULT true);
CREATE TABLE IF NOT EXISTS tracking (id text PRIMARY KEY, event text NOT NULL, at timestamptz NOT NULL DEFAULT now(), payload jsonb NOT NULL, synthetic boolean NOT NULL DEFAULT true);
