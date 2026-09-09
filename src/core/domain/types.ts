export type PublicationStatus = "draft" | "published" | "archived" | "needs_review";
export type EntityKind = "places" | "experiences" | "partners" | "events" | "categories" | "sources";

export type Location = { lat: number; lng: number; display: string };
export type Place = {
  id: string; slug: string; name: string; placeType: string; commercialRelation: string;
  partnerId?: string; categoryIds: string[]; shortDescription: string; longDescription?: string;
  environment: "indoor" | "outdoor" | "mixed"; costType: string; durationMinutes: number;
  accessibility?: string[]; openingHours?: {type: string; text: string}; location?: Location;
  imagePlaceholder?: string; status: PublicationStatus; sourceIds?: string[]; synthetic?: boolean;
};
export type Category = {id:string; slug:string; name:string; icon:string; enabled:boolean; sortOrder:number; status?:PublicationStatus; synthetic?:boolean};
export type Partner = {id:string; placeId:string; status:string; responseTime?:string; demoContacts?:Record<string,string>; synthetic?:boolean};
export type Experience = {id:string; slug:string; placeId:string; name:string; costType:string; bookingType:string; durationMinutes:number; environment:string; status:PublicationStatus; synthetic?:boolean};
export type EventEntity = {id:string; slug:string; name:string; placeId:string; startsAt:string; endsAt:string; costType:string; environment:string; status:PublicationStatus; sourceIds?:string[]; synthetic?:boolean};
export type SourceEntity = {id:string; sourceName:string; sourceType:string; sourceUrl:string|null; verificationStatus:string; verifiedAt:string; notes:string; status?:PublicationStatus; synthetic?:boolean};
export type ContentEntity = Place | Category | Partner | Experience | EventEntity | SourceEntity | Record<string, unknown>;

export type TripItem = {id:string; placeId:string; startsAt:string; durationMinutes:number; source:"recommended_by_engine"|"added_by_user"|"changed_by_user"|"fixed"; state:"planned"|"fixed"|"moved"|"removed"|"registered"|"no_evidence"};
export type TripDay = {date:string; items:TripItem[]};
export type Trip = {id:string; synthetic:boolean; cityId:string; startsOn:string; endsOn:string; party:string; pace:string; transport:string; interests:string[]; intentions:string[]};
export type Visit = {id:string; placeId:string; occurredAt:string; evidence:string; tripId:string; isReturn:boolean; outsidePlannedRoute?:boolean; stampSeed?:string; stampSnapshot?:unknown};
export type WeatherSnapshot = {date:string; condition:string; temperatureC:number; rainProbability:number; demo:boolean};
export type TripBundle = {trip:Trip; days:TripDay[]; visits:Visit[]; weather:WeatherSnapshot[]};
export type AuditEntry = {id:string; actor:string; action:string; entityKind:EntityKind; entityId:string; timestamp:string; before:unknown; after:unknown};
export type TrackingEventName = "PAGE_VIEWED"|"PLACE_VIEWED"|"SEARCH_PERFORMED"|"FILTER_APPLIED"|"PARTNER_CARD_CLICK"|"ROUTE_STARTED"|"TRIP_CREATED"|"PLACE_ADDED"|"PLACE_REMOVED"|"PLACE_SWAPPED"|"VISIT_CONFIRMED"|"PASSPORT_SHARED";
export type TrackingEvent = {id:string; name:TrackingEventName; payload:Record<string,unknown>; createdAt:string};
