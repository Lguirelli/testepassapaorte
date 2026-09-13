ALTER TABLE content RENAME TO editorial_drafts;
--> statement-breakpoint
ALTER INDEX content_kind_slug RENAME TO editorial_drafts_kind_slug;
--> statement-breakpoint
ALTER TABLE tracking RENAME TO tracking_events;
--> statement-breakpoint
CREATE TABLE cities (
  id text PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  state_code text NOT NULL,
  country_code text NOT NULL,
  timezone text NOT NULL,
  status text NOT NULL DEFAULT 'preparation',
  center_lat double precision,
  center_lng double precision,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE sources (
  id text PRIMARY KEY,
  name text NOT NULL,
  source_type text NOT NULL,
  url text UNIQUE,
  verification_status text NOT NULL DEFAULT 'needs_review',
  verified_at timestamptz,
  notes text,
  status text NOT NULL DEFAULT 'draft',
  synthetic boolean NOT NULL DEFAULT false,
  version integer NOT NULL DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE place_categories (
  id text PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  icon text,
  enabled boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'published',
  synthetic boolean NOT NULL DEFAULT false,
  version integer NOT NULL DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE places (
  id text PRIMARY KEY,
  city_id text NOT NULL REFERENCES cities(id) ON DELETE RESTRICT,
  slug text NOT NULL,
  name text NOT NULL,
  place_type text NOT NULL,
  commercial_relation text NOT NULL,
  short_description text,
  long_description text,
  environment text,
  cost_type text,
  duration_minutes integer,
  duration_is_estimate boolean NOT NULL DEFAULT false,
  opening_hours_type text,
  opening_hours_text text,
  location_display text,
  location_lat double precision,
  location_lng double precision,
  accessibility text[],
  price_note text,
  requirements text[],
  image_placeholder text,
  discovery_visible boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT 'draft',
  synthetic boolean NOT NULL DEFAULT false,
  version integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(city_id,slug)
);
--> statement-breakpoint
CREATE TABLE place_category_links (
  place_id text NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  category_id text NOT NULL REFERENCES place_categories(id) ON DELETE RESTRICT,
  PRIMARY KEY(place_id,category_id)
);
--> statement-breakpoint
CREATE TABLE place_sources (
  place_id text NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  source_id text NOT NULL REFERENCES sources(id) ON DELETE RESTRICT,
  relation_type text NOT NULL DEFAULT 'content',
  verified_at timestamptz,
  notes text,
  PRIMARY KEY(place_id,source_id,relation_type)
);
--> statement-breakpoint
CREATE TABLE place_media (
  id text PRIMARY KEY,
  place_id text NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  kind text NOT NULL DEFAULT 'image',
  src text,
  fallback_src text,
  source_page text,
  author text,
  provider text,
  license text,
  alt text,
  position text,
  illustrative boolean NOT NULL DEFAULT false,
  not_actual_place boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'published',
  UNIQUE(place_id,kind)
);
--> statement-breakpoint
CREATE TABLE partners (
  id text PRIMARY KEY,
  place_id text NOT NULL UNIQUE REFERENCES places(id) ON DELETE RESTRICT,
  response_time text,
  whatsapp text,
  phone text,
  instagram text,
  website text,
  booking_url text,
  status text NOT NULL DEFAULT 'draft',
  synthetic boolean NOT NULL DEFAULT false,
  version integer NOT NULL DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE partner_users (
  id text PRIMARY KEY,
  partner_id text NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  auth_subject text NOT NULL UNIQUE,
  role text NOT NULL DEFAULT 'partner',
  status text NOT NULL DEFAULT 'active'
);
--> statement-breakpoint
CREATE TABLE traveler_users (
  id text PRIMARY KEY,
  auth_subject text NOT NULL UNIQUE,
  display_name text,
  preferred_locale text NOT NULL DEFAULT 'pt-BR',
  status text NOT NULL DEFAULT 'active'
);
--> statement-breakpoint
CREATE TABLE anonymous_visitors (
  id text PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE sessions (
  id text PRIMARY KEY,
  anonymous_visitor_id text REFERENCES anonymous_visitors(id) ON DELETE SET NULL,
  traveler_user_id text REFERENCES traveler_users(id) ON DELETE SET NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz
);
--> statement-breakpoint
CREATE TABLE experiences (
  id text PRIMARY KEY,
  place_id text REFERENCES places(id) ON DELETE CASCADE,
  partner_id text REFERENCES partners(id) ON DELETE SET NULL,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  short_description text,
  long_description text,
  cost_type text,
  booking_type text,
  duration_minutes integer,
  environment text,
  weather_profile text,
  accessibility text[],
  status text NOT NULL DEFAULT 'draft',
  synthetic boolean NOT NULL DEFAULT false,
  version integer NOT NULL DEFAULT 1
);
--> statement-breakpoint
ALTER TABLE trips ADD COLUMN city_id text REFERENCES cities(id) ON DELETE RESTRICT;
--> statement-breakpoint
ALTER TABLE trips ADD COLUMN starts_on date;
--> statement-breakpoint
ALTER TABLE trips ADD COLUMN ends_on date;
--> statement-breakpoint
ALTER TABLE trips ADD COLUMN party text;
--> statement-breakpoint
ALTER TABLE trips ADD COLUMN pace text;
--> statement-breakpoint
ALTER TABLE trips ADD COLUMN transport text;
--> statement-breakpoint
ALTER TABLE trips ADD COLUMN interests text[];
--> statement-breakpoint
ALTER TABLE trips ADD COLUMN intentions text[];
--> statement-breakpoint
ALTER TABLE trips ADD COLUMN needs text[];
--> statement-breakpoint
ALTER TABLE trips ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
--> statement-breakpoint
CREATE TABLE trip_days (
  id text PRIMARY KEY,
  trip_id text NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  date date NOT NULL,
  sort_order integer NOT NULL,
  UNIQUE(trip_id,date)
);
--> statement-breakpoint
CREATE TABLE trip_items (
  id text PRIMARY KEY,
  trip_day_id text NOT NULL REFERENCES trip_days(id) ON DELETE CASCADE,
  place_id text NOT NULL REFERENCES places(id) ON DELETE RESTRICT,
  starts_at text,
  duration_minutes integer,
  source text NOT NULL,
  state text NOT NULL DEFAULT 'planned',
  previous_state text,
  sort_order integer NOT NULL DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE visits (
  id text PRIMARY KEY,
  trip_id text REFERENCES trips(id) ON DELETE SET NULL,
  traveler_user_id text REFERENCES traveler_users(id) ON DELETE SET NULL,
  place_id text NOT NULL REFERENCES places(id) ON DELETE RESTRICT,
  occurred_at timestamptz NOT NULL,
  evidence text NOT NULL,
  visit_number integer NOT NULL DEFAULT 1,
  outside_planned_route boolean NOT NULL DEFAULT false,
  synthetic boolean NOT NULL DEFAULT false
);
--> statement-breakpoint
CREATE TABLE qr_codes (
  id text PRIMARY KEY,
  code text NOT NULL UNIQUE,
  place_id text NOT NULL REFERENCES places(id) ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'active',
  dedupe_window_minutes integer NOT NULL DEFAULT 30,
  created_at timestamptz NOT NULL DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE reviews (
  id text PRIMARY KEY,
  place_id text NOT NULL REFERENCES places(id) ON DELETE CASCADE,
  traveler_user_id text REFERENCES traveler_users(id) ON DELETE SET NULL,
  rating integer,
  body text,
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE events (
  id text PRIMARY KEY,
  city_id text NOT NULL REFERENCES cities(id) ON DELETE RESTRICT,
  place_id text REFERENCES places(id) ON DELETE SET NULL,
  slug text NOT NULL,
  name text NOT NULL,
  short_description text,
  starts_at timestamptz,
  ends_at timestamptz,
  cost_type text,
  environment text,
  status text NOT NULL DEFAULT 'draft',
  synthetic boolean NOT NULL DEFAULT false,
  version integer NOT NULL DEFAULT 1,
  UNIQUE(city_id,slug)
);
--> statement-breakpoint
CREATE TABLE weather_snapshots (
  id text PRIMARY KEY,
  city_id text NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  observed_for timestamptz NOT NULL,
  condition text,
  temperature_c double precision,
  rain_probability integer,
  source_id text REFERENCES sources(id) ON DELETE SET NULL,
  synthetic boolean NOT NULL DEFAULT false
);
--> statement-breakpoint
CREATE TABLE section_definitions (
  id text PRIMARY KEY,
  type text NOT NULL,
  schema_version integer NOT NULL DEFAULT 1,
  enabled boolean NOT NULL DEFAULT true,
  audience text NOT NULL DEFAULT 'public',
  component_key text NOT NULL,
  status text NOT NULL DEFAULT 'draft'
);
--> statement-breakpoint
CREATE TABLE page_sections (
  id text PRIMARY KEY,
  page_scope text NOT NULL,
  section_definition_id text NOT NULL REFERENCES section_definitions(id) ON DELETE RESTRICT,
  sort_order integer NOT NULL DEFAULT 0,
  variant text,
  theme text,
  content jsonb NOT NULL,
  data_source text,
  visibility jsonb,
  layout jsonb,
  analytics jsonb,
  status text NOT NULL DEFAULT 'draft'
);
--> statement-breakpoint
CREATE TABLE content_versions (
  id text PRIMARY KEY,
  entity_type text NOT NULL,
  entity_id text NOT NULL,
  version integer NOT NULL,
  action text NOT NULL,
  actor text NOT NULL,
  payload jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(entity_type,entity_id,version)
);
--> statement-breakpoint
CREATE TABLE partner_requests (
  id text PRIMARY KEY,
  partner_id text NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  requester_id text NOT NULL,
  request_type text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  requested_changes jsonb NOT NULL,
  reviewed_by text,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE tracking_events ADD COLUMN anonymous_visitor_id text REFERENCES anonymous_visitors(id) ON DELETE SET NULL;
--> statement-breakpoint
ALTER TABLE tracking_events ADD COLUMN session_id text REFERENCES sessions(id) ON DELETE SET NULL;
--> statement-breakpoint
ALTER TABLE tracking_events ADD COLUMN traveler_user_id text REFERENCES traveler_users(id) ON DELETE SET NULL;
--> statement-breakpoint
ALTER TABLE tracking_events ADD COLUMN trip_id text REFERENCES trips(id) ON DELETE SET NULL;
--> statement-breakpoint
ALTER TABLE tracking_events ADD COLUMN place_id text REFERENCES places(id) ON DELETE SET NULL;
--> statement-breakpoint
ALTER TABLE tracking_events ADD COLUMN partner_id text REFERENCES partners(id) ON DELETE SET NULL;
--> statement-breakpoint
CREATE TABLE partner_maturity_history (
  id text PRIMARY KEY,
  partner_id text NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  stage text NOT NULL,
  data_maturity text NOT NULL,
  reason text,
  recorded_at timestamptz NOT NULL DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE alerts (
  id text PRIMARY KEY,
  partner_id text REFERENCES partners(id) ON DELETE CASCADE,
  type text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  threshold_key text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);
--> statement-breakpoint
CREATE TABLE consent_records (
  id text PRIMARY KEY,
  traveler_user_id text REFERENCES traveler_users(id) ON DELETE SET NULL,
  anonymous_visitor_id text REFERENCES anonymous_visitors(id) ON DELETE SET NULL,
  purpose text NOT NULL,
  status text NOT NULL,
  policy_version text NOT NULL,
  recorded_at timestamptz NOT NULL DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE shared_artifacts (
  id text PRIMARY KEY,
  trip_id text REFERENCES trips(id) ON DELETE SET NULL,
  traveler_user_id text REFERENCES traveler_users(id) ON DELETE SET NULL,
  type text NOT NULL,
  format text NOT NULL,
  privacy_mode text NOT NULL DEFAULT 'default',
  storage_key text,
  created_at timestamptz NOT NULL DEFAULT now()
);
