import type {AuditEntry, ContentEntity, EntityKind, TrackingEvent, TrackingEventName, TripBundle} from "@/core/domain/types";

export type EntityRecord<T = ContentEntity> = {id:string; kind:EntityKind; slug?:string; status:string; synthetic:boolean; data:T; updatedAt:string};
export interface Repository {
  mode: "local"|"postgres";
  list<T=ContentEntity>(kind:EntityKind, options?:{publishedOnly?:boolean}):Promise<EntityRecord<T>[]>;
  get<T=ContentEntity>(kind:EntityKind,id:string,options?:{draft?:boolean}):Promise<EntityRecord<T>|null>;
  findBySlug<T=ContentEntity>(kind:EntityKind,slug:string,options?:{draft?:boolean}):Promise<EntityRecord<T>|null>;
  createDraft(kind:EntityKind,data:Record<string,unknown>,actor?:string):Promise<EntityRecord>;
  saveDraft(kind:EntityKind,id:string,patch:Record<string,unknown>,actor?:string):Promise<EntityRecord>;
  publish(kind:EntityKind,id:string,actor?:string):Promise<EntityRecord>;
  archive(kind:EntityKind,id:string,actor?:string):Promise<EntityRecord>;
  history(kind:EntityKind,id:string):Promise<AuditEntry[]>;
  getTripBundle(id:string):Promise<TripBundle|null>;
  saveTripBundle(bundle:TripBundle):Promise<void>;
  track(name:TrackingEventName,payload:Record<string,unknown>):Promise<TrackingEvent>;
  recentTracking(limit?:number):Promise<TrackingEvent[]>;
}
