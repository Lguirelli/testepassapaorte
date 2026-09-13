import {
  pgTable,
  text,
  jsonb,
  integer,
  timestamp,
  boolean,
  uniqueIndex,
  primaryKey,
  doublePrecision,
  date,
} from 'drizzle-orm/pg-core';

export type ContentData = {
  id: string;
  name?: string;
  slug?: string;
  shortDescription?: string;
  longDescription?: string;
  placeId?: string;
  categoryIds?: string[];
  sourceIds?: string[];
  placeType?: string;
  commercialRelation?: string;
  partnerId?: string;
  environment?: string;
  costType?: string;
  durationMinutes?: number;
  durationIsEstimate?: boolean;
  openingHours?: {type:string;text:string};
  location?: {lat?:number;lng?:number;display:string};
  accessibility?: string[];
  responseTime?: string;
  demoContacts?: Record<string,string|undefined>;
  bookingType?: string;
  startsAt?: string;
  endsAt?: string;
  icon?: string;
  enabled?: boolean;
  sortOrder?: number;
  sourceName?: string;
  sourceType?: string;
  sourceUrl?: string|null;
  verificationStatus?: string;
  verifiedAt?: string;
  notes?: string;
  synthetic?: boolean;
  cityId?: string;
  status?: string;
  discoveryVisible?: boolean;
  priceNote?: string;
  requirements?: string[];
  imagePlaceholder?: string;
  imageAsset?: {
    src?: string;
    fallbackSrc?: string;
    sourcePage?: string;
    author?: string;
    provider?: string;
    license?: string;
    alt?: string;
    position?: string;
    illustrative?: boolean;
    notActualPlace?: boolean;
  };
};

export const cities = pgTable('cities', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull(),
  name: text('name').notNull(),
  stateCode: text('state_code').notNull(),
  countryCode: text('country_code').notNull(),
  timezone: text('timezone').notNull(),
  status: text('status').notNull().default('preparation'),
  centerLat: doublePrecision('center_lat'),
  centerLng: doublePrecision('center_lng'),
  createdAt: timestamp('created_at',{withTimezone:true}).notNull().defaultNow(),
  updatedAt: timestamp('updated_at',{withTimezone:true}).notNull().defaultNow(),
}, t=>[uniqueIndex('cities_slug_unique').on(t.slug)]);

export const sources = pgTable('sources', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  sourceType: text('source_type').notNull(),
  url: text('url'),
  verificationStatus: text('verification_status').notNull().default('needs_review'),
  verifiedAt: timestamp('verified_at',{withTimezone:true}),
  notes: text('notes'),
  status: text('status').notNull().default('draft'),
  synthetic: boolean('synthetic').notNull().default(false),
  version: integer('version').notNull().default(1),
}, t=>[uniqueIndex('sources_url_unique').on(t.url)]);

export const placeCategories = pgTable('place_categories', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull(),
  name: text('name').notNull(),
  icon: text('icon'),
  enabled: boolean('enabled').notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  status: text('status').notNull().default('published'),
  synthetic: boolean('synthetic').notNull().default(false),
  version: integer('version').notNull().default(1),
}, t=>[uniqueIndex('place_categories_slug_unique').on(t.slug)]);

export const places = pgTable('places', {
  id: text('id').primaryKey(),
  cityId: text('city_id').notNull().references(()=>cities.id,{onDelete:'restrict'}),
  slug: text('slug').notNull(),
  name: text('name').notNull(),
  placeType: text('place_type').notNull(),
  commercialRelation: text('commercial_relation').notNull(),
  shortDescription: text('short_description'),
  longDescription: text('long_description'),
  environment: text('environment'),
  costType: text('cost_type'),
  durationMinutes: integer('duration_minutes'),
  durationIsEstimate: boolean('duration_is_estimate').notNull().default(false),
  openingHoursType: text('opening_hours_type'),
  openingHoursText: text('opening_hours_text'),
  locationDisplay: text('location_display'),
  locationLat: doublePrecision('location_lat'),
  locationLng: doublePrecision('location_lng'),
  accessibility: text('accessibility').array(),
  priceNote: text('price_note'),
  requirements: text('requirements').array(),
  imagePlaceholder: text('image_placeholder'),
  discoveryVisible: boolean('discovery_visible').notNull().default(true),
  status: text('status').notNull().default('draft'),
  synthetic: boolean('synthetic').notNull().default(false),
  version: integer('version').notNull().default(1),
  createdAt: timestamp('created_at',{withTimezone:true}).notNull().defaultNow(),
  updatedAt: timestamp('updated_at',{withTimezone:true}).notNull().defaultNow(),
}, t=>[uniqueIndex('places_city_slug_unique').on(t.cityId,t.slug)]);

export const placeCategoryLinks = pgTable('place_category_links', {
  placeId: text('place_id').notNull().references(()=>places.id,{onDelete:'cascade'}),
  categoryId: text('category_id').notNull().references(()=>placeCategories.id,{onDelete:'restrict'}),
}, t=>[primaryKey({columns:[t.placeId,t.categoryId]})]);

export const placeSources = pgTable('place_sources', {
  placeId: text('place_id').notNull().references(()=>places.id,{onDelete:'cascade'}),
  sourceId: text('source_id').notNull().references(()=>sources.id,{onDelete:'restrict'}),
  relationType: text('relation_type').notNull().default('content'),
  verifiedAt: timestamp('verified_at',{withTimezone:true}),
  notes: text('notes'),
}, t=>[primaryKey({columns:[t.placeId,t.sourceId,t.relationType]})]);

export const placeMedia = pgTable('place_media', {
  id: text('id').primaryKey(),
  placeId: text('place_id').notNull().references(()=>places.id,{onDelete:'cascade'}),
  kind: text('kind').notNull().default('image'),
  src: text('src'),
  fallbackSrc: text('fallback_src'),
  sourcePage: text('source_page'),
  author: text('author'),
  provider: text('provider'),
  license: text('license'),
  alt: text('alt'),
  position: text('position'),
  illustrative: boolean('illustrative').notNull().default(false),
  notActualPlace: boolean('not_actual_place').notNull().default(false),
  status: text('status').notNull().default('published'),
}, t=>[uniqueIndex('place_media_place_kind_unique').on(t.placeId,t.kind)]);

export const partners = pgTable('partners', {
  id: text('id').primaryKey(),
  placeId: text('place_id').notNull().references(()=>places.id,{onDelete:'restrict'}),
  responseTime: text('response_time'),
  whatsapp: text('whatsapp'),
  phone: text('phone'),
  instagram: text('instagram'),
  website: text('website'),
  bookingUrl: text('booking_url'),
  status: text('status').notNull().default('draft'),
  synthetic: boolean('synthetic').notNull().default(false),
  version: integer('version').notNull().default(1),
}, t=>[uniqueIndex('partners_place_unique').on(t.placeId)]);

export const partnerUsers = pgTable('partner_users', {
  id: text('id').primaryKey(),
  partnerId: text('partner_id').notNull().references(()=>partners.id,{onDelete:'cascade'}),
  authSubject: text('auth_subject').notNull(),
  role: text('role').notNull().default('partner'),
  status: text('status').notNull().default('active'),
}, t=>[uniqueIndex('partner_users_auth_subject_unique').on(t.authSubject)]);

export const travelerUsers = pgTable('traveler_users', {
  id: text('id').primaryKey(),
  authSubject: text('auth_subject').notNull(),
  displayName: text('display_name'),
  preferredLocale: text('preferred_locale').notNull().default('pt-BR'),
  status: text('status').notNull().default('active'),
}, t=>[uniqueIndex('traveler_users_auth_subject_unique').on(t.authSubject)]);

export const anonymousVisitors = pgTable('anonymous_visitors', {
  id: text('id').primaryKey(),
  createdAt: timestamp('created_at',{withTimezone:true}).notNull().defaultNow(),
  lastSeenAt: timestamp('last_seen_at',{withTimezone:true}).notNull().defaultNow(),
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  anonymousVisitorId: text('anonymous_visitor_id').references(()=>anonymousVisitors.id,{onDelete:'set null'}),
  travelerUserId: text('traveler_user_id').references(()=>travelerUsers.id,{onDelete:'set null'}),
  startedAt: timestamp('started_at',{withTimezone:true}).notNull().defaultNow(),
  endedAt: timestamp('ended_at',{withTimezone:true}),
});


export const authSessions = pgTable('auth_sessions', {
  id: text('id').primaryKey(),
  authSubject: text('auth_subject').notNull(),
  role: text('role').notNull(),
  partnerId: text('partner_id').references(()=>partners.id,{onDelete:'set null'}),
  travelerUserId: text('traveler_user_id').references(()=>travelerUsers.id,{onDelete:'set null'}),
  expiresAt: timestamp('expires_at',{withTimezone:true}).notNull(),
  createdAt: timestamp('created_at',{withTimezone:true}).notNull().defaultNow(),
  revokedAt: timestamp('revoked_at',{withTimezone:true}),
});

export const experiences = pgTable('experiences', {
  id: text('id').primaryKey(),
  placeId: text('place_id').references(()=>places.id,{onDelete:'cascade'}),
  partnerId: text('partner_id').references(()=>partners.id,{onDelete:'set null'}),
  slug: text('slug').notNull(),
  name: text('name').notNull(),
  shortDescription: text('short_description'),
  longDescription: text('long_description'),
  costType: text('cost_type'),
  bookingType: text('booking_type'),
  durationMinutes: integer('duration_minutes'),
  environment: text('environment'),
  weatherProfile: text('weather_profile'),
  accessibility: text('accessibility').array(),
  status: text('status').notNull().default('draft'),
  synthetic: boolean('synthetic').notNull().default(false),
  version: integer('version').notNull().default(1),
}, t=>[uniqueIndex('experiences_slug_unique').on(t.slug)]);

// Trip runtime is relational. The historical legacy_data column is intentionally not modeled.
// TripDay, TripItem and Visit tables below are the canonical runtime model.
export const trips = pgTable('trips', {
  id: text('id').primaryKey(),
  owner: text('owner').notNull(),
  version: integer('version').notNull().default(1),
  synthetic: boolean('synthetic').notNull().default(false),
  cityId: text('city_id').references(()=>cities.id,{onDelete:'restrict'}),
  startsOn: date('starts_on'),
  endsOn: date('ends_on'),
  party: text('party'),
  pace: text('pace'),
  transport: text('transport'),
  interests: text('interests').array(),
  intentions: text('intentions').array(),
  needs: text('needs').array(),
  updatedAt: timestamp('updated_at',{withTimezone:true}).notNull().defaultNow(),
});

export const tripDays = pgTable('trip_days', {
  id: text('id').primaryKey(),
  tripId: text('trip_id').notNull().references(()=>trips.id,{onDelete:'cascade'}),
  date: date('date').notNull(),
  sortOrder: integer('sort_order').notNull(),
}, t=>[uniqueIndex('trip_days_trip_date_unique').on(t.tripId,t.date)]);

export const tripItems = pgTable('trip_items', {
  id: text('id').primaryKey(),
  tripDayId: text('trip_day_id').notNull().references(()=>tripDays.id,{onDelete:'cascade'}),
  placeId: text('place_id').notNull().references(()=>places.id,{onDelete:'restrict'}),
  startsAt: text('starts_at'),
  durationMinutes: integer('duration_minutes'),
  source: text('source').notNull(),
  state: text('state').notNull().default('planned'),
  previousState: text('previous_state'),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const visits = pgTable('visits', {
  id: text('id').primaryKey(),
  tripId: text('trip_id').references(()=>trips.id,{onDelete:'set null'}),
  travelerUserId: text('traveler_user_id').references(()=>travelerUsers.id,{onDelete:'set null'}),
  placeId: text('place_id').notNull().references(()=>places.id,{onDelete:'restrict'}),
  occurredAt: timestamp('occurred_at',{withTimezone:true}).notNull(),
  evidence: text('evidence').notNull(),
  visitNumber: integer('visit_number').notNull().default(1),
  outsidePlannedRoute: boolean('outside_planned_route').notNull().default(false),
  synthetic: boolean('synthetic').notNull().default(false),
});

export const qrCodes = pgTable('qr_codes', {
  id: text('id').primaryKey(),
  code: text('code').notNull(),
  placeId: text('place_id').notNull().references(()=>places.id,{onDelete:'restrict'}),
  status: text('status').notNull().default('active'),
  dedupeWindowMinutes: integer('dedupe_window_minutes').notNull().default(30),
  createdAt: timestamp('created_at',{withTimezone:true}).notNull().defaultNow(),
}, t=>[uniqueIndex('qr_codes_code_unique').on(t.code)]);

export const reviews = pgTable('reviews', {
  id: text('id').primaryKey(),
  placeId: text('place_id').notNull().references(()=>places.id,{onDelete:'cascade'}),
  travelerUserId: text('traveler_user_id').references(()=>travelerUsers.id,{onDelete:'set null'}),
  rating: integer('rating'),
  body: text('body'),
  status: text('status').notNull().default('published'),
  createdAt: timestamp('created_at',{withTimezone:true}).notNull().defaultNow(),
});

export const events = pgTable('events', {
  id: text('id').primaryKey(),
  cityId: text('city_id').notNull().references(()=>cities.id,{onDelete:'restrict'}),
  placeId: text('place_id').references(()=>places.id,{onDelete:'set null'}),
  slug: text('slug').notNull(),
  name: text('name').notNull(),
  shortDescription: text('short_description'),
  startsAt: timestamp('starts_at',{withTimezone:true}),
  endsAt: timestamp('ends_at',{withTimezone:true}),
  costType: text('cost_type'),
  environment: text('environment'),
  status: text('status').notNull().default('draft'),
  synthetic: boolean('synthetic').notNull().default(false),
  version: integer('version').notNull().default(1),
}, t=>[uniqueIndex('events_city_slug_unique').on(t.cityId,t.slug)]);

export const weatherSnapshots = pgTable('weather_snapshots', {
  id: text('id').primaryKey(),
  cityId: text('city_id').notNull().references(()=>cities.id,{onDelete:'cascade'}),
  observedFor: timestamp('observed_for',{withTimezone:true}).notNull(),
  condition: text('condition'),
  temperatureC: doublePrecision('temperature_c'),
  rainProbability: integer('rain_probability'),
  sourceId: text('source_id').references(()=>sources.id,{onDelete:'set null'}),
  synthetic: boolean('synthetic').notNull().default(false),
});

// `editorial_drafts` is a staging layer only. Public reads never use this table.
export const editorialDrafts = pgTable('editorial_drafts', {
  id: text('id').primaryKey(),
  kind: text('kind').notNull(),
  slug: text('slug').notNull(),
  status: text('status').notNull().default('draft'),
  draft: jsonb('draft').$type<ContentData>().notNull(),
  published: jsonb('published').$type<ContentData>(),
  version: integer('version').notNull().default(1),
  synthetic: boolean('synthetic').notNull().default(true),
}, t=>[uniqueIndex('editorial_drafts_kind_slug').on(t.kind,t.slug)]);
// Compatibility alias for the phase-01 Admin code while the editor is migrated incrementally.
export const content = editorialDrafts;

export const sectionDefinitions = pgTable('section_definitions', {
  id: text('id').primaryKey(),
  type: text('type').notNull(),
  schemaVersion: integer('schema_version').notNull().default(1),
  enabled: boolean('enabled').notNull().default(true),
  audience: text('audience').notNull().default('public'),
  componentKey: text('component_key').notNull(),
  status: text('status').notNull().default('draft'),
});

export const pageSections = pgTable('page_sections', {
  id: text('id').primaryKey(),
  pageScope: text('page_scope').notNull(),
  sectionDefinitionId: text('section_definition_id').notNull().references(()=>sectionDefinitions.id,{onDelete:'restrict'}),
  sortOrder: integer('sort_order').notNull().default(0),
  variant: text('variant'),
  theme: text('theme'),
  content: jsonb('content').$type<Record<string,unknown>>().notNull(),
  dataSource: text('data_source'),
  visibility: jsonb('visibility').$type<Record<string,unknown>>(),
  layout: jsonb('layout').$type<Record<string,unknown>>(),
  analytics: jsonb('analytics').$type<Record<string,unknown>>(),
  status: text('status').notNull().default('draft'),
});

export const contentVersions = pgTable('content_versions', {
  id: text('id').primaryKey(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id').notNull(),
  version: integer('version').notNull(),
  action: text('action').notNull(),
  actor: text('actor').notNull(),
  payload: jsonb('payload').$type<ContentData>().notNull(),
  createdAt: timestamp('created_at',{withTimezone:true}).notNull().defaultNow(),
}, t=>[uniqueIndex('content_versions_entity_version_unique').on(t.entityType,t.entityId,t.version)]);

export const partnerRequests = pgTable('partner_requests', {
  id: text('id').primaryKey(),
  partnerId: text('partner_id').notNull().references(()=>partners.id,{onDelete:'cascade'}),
  requesterId: text('requester_id').notNull(),
  requestType: text('request_type').notNull(),
  status: text('status').notNull().default('pending'),
  requestedChanges: jsonb('requested_changes').$type<Record<string,unknown>>().notNull(),
  reviewedBy: text('reviewed_by'),
  reviewedAt: timestamp('reviewed_at',{withTimezone:true}),
  createdAt: timestamp('created_at',{withTimezone:true}).notNull().defaultNow(),
});

export const trackingEvents = pgTable('tracking_events', {
  id: text('id').primaryKey(),
  event: text('event').notNull(),
  at: timestamp('at',{withTimezone:true}).notNull().defaultNow(),
  payload: jsonb('payload').$type<Record<string,unknown>>().notNull(),
  anonymousVisitorId: text('anonymous_visitor_id').references(()=>anonymousVisitors.id,{onDelete:'set null'}),
  sessionId: text('session_id').references(()=>sessions.id,{onDelete:'set null'}),
  travelerUserId: text('traveler_user_id').references(()=>travelerUsers.id,{onDelete:'set null'}),
  tripId: text('trip_id').references(()=>trips.id,{onDelete:'set null'}),
  placeId: text('place_id').references(()=>places.id,{onDelete:'set null'}),
  partnerId: text('partner_id').references(()=>partners.id,{onDelete:'set null'}),
  synthetic: boolean('synthetic').notNull().default(false),
});
export const tracking = trackingEvents;

export const partnerMaturityHistory = pgTable('partner_maturity_history', {
  id: text('id').primaryKey(),
  partnerId: text('partner_id').notNull().references(()=>partners.id,{onDelete:'cascade'}),
  stage: text('stage').notNull(),
  dataMaturity: text('data_maturity').notNull(),
  reason: text('reason'),
  recordedAt: timestamp('recorded_at',{withTimezone:true}).notNull().defaultNow(),
});

export const alerts = pgTable('alerts', {
  id: text('id').primaryKey(),
  partnerId: text('partner_id').references(()=>partners.id,{onDelete:'cascade'}),
  type: text('type').notNull(),
  status: text('status').notNull().default('open'),
  thresholdKey: text('threshold_key'),
  metadata: jsonb('metadata').$type<Record<string,unknown>>(),
  createdAt: timestamp('created_at',{withTimezone:true}).notNull().defaultNow(),
  resolvedAt: timestamp('resolved_at',{withTimezone:true}),
});

export const consentRecords = pgTable('consent_records', {
  id: text('id').primaryKey(),
  travelerUserId: text('traveler_user_id').references(()=>travelerUsers.id,{onDelete:'set null'}),
  anonymousVisitorId: text('anonymous_visitor_id').references(()=>anonymousVisitors.id,{onDelete:'set null'}),
  purpose: text('purpose').notNull(),
  status: text('status').notNull(),
  policyVersion: text('policy_version').notNull(),
  recordedAt: timestamp('recorded_at',{withTimezone:true}).notNull().defaultNow(),
});

export const sharedArtifacts = pgTable('shared_artifacts', {
  id: text('id').primaryKey(),
  tripId: text('trip_id').references(()=>trips.id,{onDelete:'set null'}),
  travelerUserId: text('traveler_user_id').references(()=>travelerUsers.id,{onDelete:'set null'}),
  type: text('type').notNull(),
  format: text('format').notNull(),
  privacyMode: text('privacy_mode').notNull().default('default'),
  storageKey: text('storage_key'),
  createdAt: timestamp('created_at',{withTimezone:true}).notNull().defaultNow(),
});

export const audit = pgTable('audit', {
  id: text('id').primaryKey(),
  actor: text('actor').notNull(),
  action: text('action').notNull(),
  entity: text('entity').notNull(),
  at: timestamp('at',{withTimezone:true}).notNull().defaultNow(),
  before: jsonb('before'),
  after: jsonb('after'),
});
