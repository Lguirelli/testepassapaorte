import { customType, index, jsonb, pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";

const geometryPoint = customType<{ data: string }>({ dataType() { return "geometry(Point,4326)"; } });

export const contentEntities = pgTable("content_entities", {
  id: text("id").primaryKey(),
  kind: text("kind").notNull(),
  slug: text("slug"),
  status: text("status").notNull().default("published"),
  synthetic: boolean("synthetic").notNull().default(true),
  data: jsonb("data").notNull(),
  geom: geometryPoint("geom"),
  createdAt: timestamp("created_at", {withTimezone:true}).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", {withTimezone:true}).notNull().defaultNow(),
}, (table) => [index("content_entities_kind_idx").on(table.kind), index("content_entities_slug_idx").on(table.slug)]);

export const contentDrafts = pgTable("content_drafts", {
  entityId: text("entity_id").primaryKey(),
  kind: text("kind").notNull(),
  data: jsonb("data").notNull(),
  updatedAt: timestamp("updated_at", {withTimezone:true}).notNull().defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: text("id").primaryKey(), actor: text("actor").notNull(), action: text("action").notNull(),
  entityKind: text("entity_kind").notNull(), entityId: text("entity_id").notNull(),
  timestamp: timestamp("timestamp", {withTimezone:true}).notNull().defaultNow(), before: jsonb("before_json"), after: jsonb("after_json")
});
export const tripBundles = pgTable("trip_bundles", { id:text("id").primaryKey(), synthetic:boolean("synthetic").notNull().default(true), data:jsonb("data").notNull(), updatedAt:timestamp("updated_at",{withTimezone:true}).notNull().defaultNow() });
export const trackingEvents = pgTable("tracking_events", { id:text("id").primaryKey(), eventName:text("event_name").notNull(), payload:jsonb("payload").notNull(), createdAt:timestamp("created_at",{withTimezone:true}).notNull().defaultNow() });
