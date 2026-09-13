import {and,asc,desc,eq,gte,lte} from 'drizzle-orm';
import {db} from '@/core/db';
import {tripDays,tripItems,trips,visits,weatherSnapshots} from '@/core/db/schema';
import type {Actor} from '@/core/auth/permissions';
import {currentActor} from '@/core/auth/session';import {sanitizeId} from '@/core/security/sanitize';
import type {TripData,TripRecord,TripItemState,TripItemSource} from './types';

export async function getTripById(id:string,providedActor?:Actor):Promise<TripRecord>{
  id=sanitizeId(id,'Viagem');const actor=providedActor??await currentActor();if(!actor)throw new Error('Acesso não autorizado.');const database=await db();
  const conditions=actor.role==='admin'?eq(trips.id,id):and(eq(trips.id,id),eq(trips.owner,actor.id));
  const [trip]=await database.select().from(trips).where(conditions);if(!trip)throw new Error('Viagem não encontrada.');
  const days=await database.select().from(tripDays).where(eq(tripDays.tripId,id)).orderBy(asc(tripDays.sortOrder));
  const items=days.length?(await database.select().from(tripItems)).filter(item=>days.some(day=>day.id===item.tripDayId)):[];
  const visitRows=await database.select().from(visits).where(eq(visits.tripId,id)).orderBy(asc(visits.occurredAt));
  const weather=trip.cityId&&trip.startsOn&&trip.endsOn?(await database.select().from(weatherSnapshots).where(and(eq(weatherSnapshots.cityId,trip.cityId),gte(weatherSnapshots.observedFor,new Date(`${trip.startsOn}T00:00:00-03:00`)),lte(weatherSnapshots.observedFor,new Date(`${trip.endsOn}T23:59:59-03:00`))))).filter(row=>!row.synthetic):[];
  const data:TripData={trip:{id:trip.id,synthetic:trip.synthetic,cityId:trip.cityId||'city-serra-negra-sp',startsOn:trip.startsOn||'',endsOn:trip.endsOn||'',party:(trip.party||'couple') as TripData['trip']['party'],pace:(trip.pace||'balanced') as TripData['trip']['pace'],transport:(trip.transport||'unknown') as TripData['trip']['transport'],interests:trip.interests||[],intentions:trip.intentions||[],needs:trip.needs||[]},days:days.map(day=>({id:day.id,date:day.date,items:items.filter(item=>item.tripDayId===day.id).sort((a,b)=>a.sortOrder-b.sortOrder).map(item=>({id:item.id,placeId:item.placeId,startsAt:item.startsAt||'09:00',durationMinutes:item.durationMinutes||60,source:item.source as TripItemSource,state:item.state as TripItemState,previousState:item.previousState as TripItemState|undefined,sortOrder:item.sortOrder}))})),visits:visitRows.map(row=>({id:row.id,placeId:row.placeId,occurredAt:row.occurredAt.toISOString(),evidence:row.evidence,visitNumber:row.visitNumber,isReturn:row.visitNumber>1,outsidePlannedRoute:row.outsidePlannedRoute})),weather:weather.map(row=>({date:row.observedFor.toISOString().slice(0,10),condition:row.condition||undefined,temperatureC:row.temperatureC??undefined,rainProbability:row.rainProbability??undefined,sourceId:row.sourceId||undefined}))};
  return{id:trip.id,owner:trip.owner,version:trip.version,data};
}
export async function getCurrentTrip(providedActor?:Actor){const actor=providedActor??await currentActor();if(!actor||actor.role!=='tourist')return null;const database=await db();const [row]=await database.select({id:trips.id}).from(trips).where(eq(trips.owner,actor.id)).orderBy(desc(trips.updatedAt)).limit(1);return row?getTripById(row.id,actor):null;}
export async function listTrips(providedActor?:Actor){const actor=providedActor??await currentActor();if(!actor)return[];const database=await db();const rows=actor.role==='admin'?await database.select().from(trips).orderBy(desc(trips.updatedAt)):await database.select().from(trips).where(eq(trips.owner,actor.id)).orderBy(desc(trips.updatedAt));return rows;}
