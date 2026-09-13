import {and,eq} from 'drizzle-orm';
import {db} from '@/core/db';
import {tripDays,tripItems,trips} from '@/core/db/schema';
import type {Actor} from '@/core/auth/permissions';
import type {TripData,TripProfile} from './types';

export async function createTrip(actor:Actor,profile:TripProfile,days:TripData['days']){
  if(actor.role!=='tourist')throw new Error('Apenas viajantes podem criar viagens.');const database=await db();const id=crypto.randomUUID();
  await database.transaction(async tx=>{await tx.insert(trips).values({id,owner:actor.id,version:1,synthetic:false,cityId:'city-serra-negra-sp',startsOn:profile.startsOn,endsOn:profile.endsOn,party:profile.party,pace:profile.pace,transport:profile.transport,interests:profile.interests,intentions:profile.intentions,needs:profile.needs,updatedAt:new Date()});await insertDays(tx,id,days);});return id;
}
export async function replaceTripPlan(actor:Actor,tripId:string,expectedVersion:number,data:TripData){
  const database=await db();await database.transaction(async tx=>{const updated=await tx.update(trips).set({startsOn:data.trip.startsOn,endsOn:data.trip.endsOn,party:data.trip.party,pace:data.trip.pace,transport:data.trip.transport,interests:data.trip.interests,intentions:data.trip.intentions,needs:data.trip.needs,version:expectedVersion+1,updatedAt:new Date()}).where(and(eq(trips.id,tripId),eq(trips.owner,actor.id),eq(trips.version,expectedVersion))).returning({id:trips.id});if(!updated.length)throw new Error('Outra edição foi salva. Atualize a página.');await tx.delete(tripDays).where(eq(tripDays.tripId,tripId));await insertDays(tx,tripId,data.days);});
}
type Tx=Parameters<Parameters<Awaited<ReturnType<typeof db>>['transaction']>[0]>[0];
async function insertDays(tx:Tx,tripId:string,days:TripData['days']){for(const [dayIndex,day] of days.entries()){const dayId=day.id&&day.id.startsWith(tripId)?day.id:`${tripId}-day-${dayIndex+1}-${day.date}`;await tx.insert(tripDays).values({id:dayId,tripId,date:day.date,sortOrder:dayIndex});for(const [itemIndex,item] of day.items.entries())await tx.insert(tripItems).values({id:item.id,tripDayId:dayId,placeId:item.placeId,startsAt:item.startsAt,durationMinutes:item.durationMinutes,source:item.source,state:item.state,previousState:item.previousState||null,sortOrder:itemIndex});}}
