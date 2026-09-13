import {db} from '@/core/db';
import {trackingEvents} from '@/core/db/schema';
import {sanitizeTrackingPayload,trySanitizeId} from '@/core/security/sanitize';
import type {Actor} from '@/core/auth/permissions';

export const events=['PAGE_VIEWED','SECTION_IMPRESSION','PLACE_VIEWED','CATEGORY_VIEWED','SEARCH_PERFORMED','FILTER_APPLIED','EXPERIENCE_VIEWED','EVENT_VIEWED','PARTNER_CARD_IMPRESSION','PARTNER_CARD_CENTERED','PARTNER_CARD_CLICK','CONTACT_CLICKED','WHATSAPP_CLICKED','PHONE_CLICKED','WEBSITE_CLICKED','EXTERNAL_BOOKING_CLICKED','MAP_OPENED','ROUTE_STARTED','ROUTE_STEP_VIEWED','ROUTE_STEP_COMPLETED','ROUTE_INTEREST_SELECTED','ROUTE_PROFILE_COMPLETED','ROUTE_AUTH_REQUESTED','TRIP_CREATED','PLACE_ADDED','PLACE_REMOVED','PLACE_SWAPPED','PLACE_MOVED','PLACE_FIXED','PLACE_RESTORED','QR_SCANNED','VISIT_CONFIRMED','REVIEW_SUBMITTED','PASSPORT_SHARED'] as const;
export type TrackingEvent=typeof events[number];

export const analyticsProvider={
  async record(event:string,payload:Record<string,unknown>,actor?:Actor|null){
    if(!events.includes(event as TrackingEvent))throw new Error('Evento de analytics inválido.');
    const clean=sanitizeTrackingPayload(payload);const database=await db();
    const placeId=typeof clean.placeId==='string'?trySanitizeId(clean.placeId):null;
    const payloadPartnerId=typeof clean.partnerId==='string'?trySanitizeId(clean.partnerId):null;
    // Product analytics intentionally avoids attaching the tourist identity. Entity IDs are enough
    // for aggregate product/partner metrics. Operational ownership remains in trips/visits/auth tables.
    await database.insert(trackingEvents).values({id:crypto.randomUUID(),event,payload:clean,travelerUserId:null,placeId:placeId||null,partnerId:payloadPartnerId||actor?.partnerId||null,synthetic:false});
  },
};
