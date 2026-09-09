import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import type {AuditEntry, ContentEntity, EntityKind, TrackingEvent, TrackingEventName, TripBundle} from "@/core/domain/types";
import type {EntityRecord,Repository} from "./repository";
import {seedRecords,seedTripBundle} from "./seed";

type LocalStore={entities:Record<string,EntityRecord>;drafts:Record<string,EntityRecord>;history:AuditEntry[];trips:Record<string,TripBundle>;tracking:TrackingEvent[]};
const key=(kind:EntityKind,id:string)=>`${kind}:${id}`;
function storePath(){return path.resolve(process.cwd(),process.env.LOCAL_STORE_PATH||".data/validation-store.json");}
async function readStore():Promise<LocalStore>{
  const file=storePath();
  try{return JSON.parse(await fs.readFile(file,"utf8"));}catch(err:any){if(err?.code!=="ENOENT")throw err;}
  const records=seedRecords(); const trip=seedTripBundle();
  const store:LocalStore={entities:Object.fromEntries(records.map(r=>[key(r.kind,r.id),r])),drafts:{},history:[],trips:{[trip.trip.id]:trip},tracking:[]};
  await writeStore(store); return store;
}
async function writeStore(store:LocalStore){const file=storePath();await fs.mkdir(path.dirname(file),{recursive:true});const tmp=`${file}.tmp`;await fs.writeFile(tmp,JSON.stringify(store,null,2));await fs.rename(tmp,file);}
function audit(store:LocalStore,kind:EntityKind,id:string,action:string,before:unknown,after:unknown,actor="mock-admin"){
  store.history.unshift({id:crypto.randomUUID(),actor,action,entityKind:kind,entityId:id,timestamp:new Date().toISOString(),before,after});
}
export class LocalRepository implements Repository{
  mode="local" as const;
  async list<T=ContentEntity>(kind:EntityKind,options:{publishedOnly?:boolean}={}){const s=await readStore();return Object.values(s.entities).filter(e=>e.kind===kind&&(!options.publishedOnly||e.status==="published")) as EntityRecord<T>[];}
  async get<T=ContentEntity>(kind:EntityKind,id:string,options:{draft?:boolean}={}){const s=await readStore();const k=key(kind,id);return ((options.draft&&s.drafts[k])||s.entities[k]||null) as EntityRecord<T>|null;}
  async findBySlug<T=ContentEntity>(kind:EntityKind,slug:string,options:{draft?:boolean}={}){const s=await readStore();const base=Object.values(s.entities).find(e=>e.kind===kind&&e.slug===slug);if(!base)return null;const k=key(kind,base.id);return ((options.draft&&s.drafts[k])||base) as EntityRecord<T>;}
  async createDraft(kind:EntityKind,data:Record<string,unknown>,actor="mock-admin") {const s=await readStore();const id=String(data.id||`${kind}-${crypto.randomUUID().slice(0,8)}`);const rec:EntityRecord={id,kind,slug:String(data.slug||id),status:"draft",synthetic:true,data:{...data,id,synthetic:true},updatedAt:new Date().toISOString()};s.entities[key(kind,id)]={...rec,status:"draft"};s.drafts[key(kind,id)]=rec;audit(s,kind,id,"create_draft",null,rec.data,actor);await writeStore(s);return rec;}
  async saveDraft(kind:EntityKind,id:string,patch:Record<string,unknown>,actor="mock-admin"){const s=await readStore();const k=key(kind,id),base=s.drafts[k]||s.entities[k];if(!base)throw new Error("Entidade não encontrada");const before=base.data;const data={...(base.data as any),...patch,id};const rec:EntityRecord={...base,data,status:"draft",slug:String((data as any).slug||base.slug||id),updatedAt:new Date().toISOString()};s.drafts[k]=rec;audit(s,kind,id,"save_draft",before,data,actor);await writeStore(s);return rec;}
  async publish(kind:EntityKind,id:string,actor="mock-admin"){const s=await readStore();const k=key(kind,id),draft=s.drafts[k];if(!draft)throw new Error("Nenhum rascunho para publicar");const before=s.entities[k]?.data??null;const data={...(draft.data as any)};const rec:EntityRecord={...draft,status:"published",data,updatedAt:new Date().toISOString()};s.entities[k]=rec;delete s.drafts[k];audit(s,kind,id,"publish",before,data,actor);await writeStore(s);return rec;}
  async archive(kind:EntityKind,id:string,actor="mock-admin"){const s=await readStore();const k=key(kind,id),base=s.entities[k];if(!base)throw new Error("Entidade não encontrada");const before=base.data;const data={...(base.data as any)};const rec:EntityRecord={...base,status:"archived",data,updatedAt:new Date().toISOString()};s.entities[k]=rec;delete s.drafts[k];audit(s,kind,id,"archive",before,data,actor);await writeStore(s);return rec;}
  async history(kind:EntityKind,id:string){const s=await readStore();return s.history.filter(h=>h.entityKind===kind&&h.entityId===id);}
  async getTripBundle(id:string){const s=await readStore();return structuredClone(s.trips[id]||null);}
  async saveTripBundle(bundle:TripBundle){const s=await readStore();s.trips[bundle.trip.id]=structuredClone(bundle);await writeStore(s);}
  async track(name:TrackingEventName,payload:Record<string,unknown>){const s=await readStore();const event={id:crypto.randomUUID(),name,payload,createdAt:new Date().toISOString()};s.tracking.unshift(event);s.tracking=s.tracking.slice(0,1000);await writeStore(s);return event;}
  async recentTracking(limit=100){const s=await readStore();return s.tracking.slice(0,limit);}
}
export async function resetLocalStore(){try{await fs.unlink(storePath());}catch(err:any){if(err?.code!=="ENOENT")throw err;}await readStore();}
