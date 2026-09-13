import {z} from 'zod';
import type {ContentData} from '@/core/db/schema';
import {dateRange,generatePlan,profileSchema} from './engine';
import type {TripData,TripProfile,Visit} from './types';

export const GUEST_TRIP_STORAGE_KEY='psn-guest-trip-v1';
export const GUEST_SAVE_PENDING_KEY='psn-guest-save-pending-v1';
const GUEST_TRIP_CHANGE_EVENT='psn-guest-trip-change';

const id=z.string().min(1).max(160).regex(/^[A-Za-z0-9][A-Za-z0-9._:-]{0,159}$/);
const time=z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
const itemSchema=z.object({
  id,
  placeId:id,
  startsAt:time,
  durationMinutes:z.number().int().min(5).max(1440),
  source:z.enum(['recommended_by_engine','added_by_user','changed_by_user','fixed']),
  state:z.enum(['planned','fixed','moved','removed']),
  previousState:z.enum(['planned','fixed','moved','removed']).optional(),
  sortOrder:z.number().int().optional(),
}).strict();
const daySchema=z.object({id:z.string().max(200).optional(),date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),items:z.array(itemSchema).max(30)}).strict();
const visitSchema=z.object({id,placeId:id,occurredAt:z.string().max(40),evidence:z.string().max(80),visitNumber:z.number().int().min(1).max(100),isReturn:z.boolean(),outsidePlannedRoute:z.boolean().optional()}).strict();
const tripSchema=z.object({
  id:z.string().min(1).max(200),synthetic:z.boolean(),cityId:z.string().min(1).max(160),startsOn:z.string(),endsOn:z.string(),
  party:z.enum(['couple','family','friends','solo']),pace:z.enum(['slow','balanced','active']),transport:z.enum(['car','walk','taxi_app','unknown']),
  interests:z.array(id).max(20),intentions:z.array(z.string().max(80)).max(8),needs:z.array(z.string().max(80)).max(5),
}).strict();
export const guestDraftSchema=z.object({version:z.literal(1),createdAt:z.string(),updatedAt:z.string(),data:z.object({trip:tripSchema,days:z.array(daySchema).min(1).max(14),visits:z.array(visitSchema).max(200),weather:z.array(z.object({date:z.string(),condition:z.string().optional(),temperatureC:z.number().optional(),rainProbability:z.number().optional(),sourceId:z.string().optional()}).strict()).max(14)}).strict()}).strict().superRefine((draft,ctx)=>{
  const profile=profileFromTrip(draft.data);
  const parsed=profileSchema.safeParse(profile);
  if(!parsed.success){ctx.addIssue({code:'custom',message:'Perfil temporário inválido.'});return;}
  const expected=dateRange(profile.startsOn,profile.endsOn);
  const actual=draft.data.days.map(day=>day.date);
  if(expected.length!==actual.length||expected.some((date,index)=>date!==actual[index]))ctx.addIssue({code:'custom',message:'Os dias do roteiro temporário não correspondem ao período escolhido.'});
});

export type GuestTripDraft=z.infer<typeof guestDraftSchema>;

export function profileFromTrip(data:TripData):TripProfile{return{startsOn:data.trip.startsOn,endsOn:data.trip.endsOn,party:data.trip.party,interests:[...data.trip.interests],intentions:[...data.trip.intentions],pace:data.trip.pace,transport:data.trip.transport,needs:[...data.trip.needs]};}

export function createGuestDraft(profileInput:TripProfile,places:ContentData[]):GuestTripDraft{
  const profile=profileSchema.parse(profileInput);const now=new Date().toISOString();const guestId=`guest-${crypto.randomUUID()}`;
  return{version:1,createdAt:now,updatedAt:now,data:{trip:{id:guestId,synthetic:true,cityId:'city-serra-negra-sp',...profile},days:generatePlan(profile,places),visits:[],weather:[]}};
}

export function withUpdatedGuestData(draft:GuestTripDraft,data:TripData):GuestTripDraft{return{...draft,updatedAt:new Date().toISOString(),data};}

export function addGuestVisit(draft:GuestTripDraft,placeId:string,date:string):GuestTripDraft{
  const data=structuredClone(draft.data);const samePlace=data.visits.filter(v=>v.placeId===placeId);const existing=data.visits.find(v=>v.placeId===placeId&&v.occurredAt.slice(0,10)===date);
  if(existing)data.visits=data.visits.filter(v=>v.id!==existing.id);else{
    const visit:Visit={id:`demo-${crypto.randomUUID()}`,placeId,occurredAt:`${date}T12:00:00.000Z`,evidence:'presentation-demo',visitNumber:samePlace.length+1,isReturn:samePlace.length>0,outsidePlannedRoute:false};data.visits.push(visit);
  }
  return withUpdatedGuestData(draft,data);
}

function emitGuestDraftChange(){if(typeof window!=='undefined')window.dispatchEvent(new Event(GUEST_TRIP_CHANGE_EVENT));}
export function readGuestDraft():GuestTripDraft|null{
  if(typeof window==='undefined')return null;try{const raw=localStorage.getItem(GUEST_TRIP_STORAGE_KEY);if(!raw)return null;const parsed=guestDraftSchema.safeParse(JSON.parse(raw));if(parsed.success)return parsed.data;localStorage.removeItem(GUEST_TRIP_STORAGE_KEY);return null;}catch{return null;}
}
export function subscribeGuestDraft(callback:()=>void){if(typeof window==='undefined')return()=>{};const onStorage=(event:StorageEvent)=>{if(event.key===GUEST_TRIP_STORAGE_KEY)callback();};window.addEventListener('storage',onStorage);window.addEventListener(GUEST_TRIP_CHANGE_EVENT,callback);return()=>{window.removeEventListener('storage',onStorage);window.removeEventListener(GUEST_TRIP_CHANGE_EVENT,callback);};}
export function writeGuestDraft(draft:GuestTripDraft){if(typeof window!=='undefined'){localStorage.setItem(GUEST_TRIP_STORAGE_KEY,JSON.stringify(draft));emitGuestDraftChange();}}
export function clearGuestDraft(){if(typeof window!=='undefined'){localStorage.removeItem(GUEST_TRIP_STORAGE_KEY);localStorage.removeItem(GUEST_SAVE_PENDING_KEY);emitGuestDraftChange();}}
export function markGuestSavePending(){if(typeof window!=='undefined')localStorage.setItem(GUEST_SAVE_PENDING_KEY,'1');}
