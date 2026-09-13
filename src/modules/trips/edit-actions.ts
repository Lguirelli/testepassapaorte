'use server';
import {revalidatePath} from 'next/cache';
import {currentActor} from '@/core/auth/session';
import {publicContent} from '@/modules/content/repository';
import {analyticsProvider} from '@/modules/tracking/service';import {sanitizeId,sanitizeText,publicErrorMessage} from '@/core/security/sanitize';
import {applyOperation,generatePlan,profileSchema,type TripOperation} from './engine';
import {createTrip,replaceTripPlan} from './persistence';
import {getTripById} from './repository';
import type {TripProfile} from './types';

type Result={ok:boolean;message:string;tripId?:string;requiresAuth?:boolean};
export async function generateTrip(input:unknown):Promise<Result>{
  try{
    const profile=profileSchema.parse(input);const actor=await currentActor();if(!actor||actor.role!=='tourist')return{ok:false,message:'Entre para salvar e gerar sua viagem.',requiresAuth:true};
    const places=await publicContent('places');const days=generatePlan(profile as TripProfile,places);const tripId=await createTrip(actor,profile as TripProfile,days);
    await analyticsProvider.record('TRIP_CREATED',{},actor);revalidatePath('/viagens','layout');return{ok:true,message:'Roteiro criado.',tripId};
  }catch(error){return{ok:false,message:publicErrorMessage(error,'Não foi possível gerar o roteiro.')};}
}
export async function regenerateTrip(tripId:string,input:unknown):Promise<Result>{
  try{tripId=sanitizeId(tripId,'Viagem');const profile=profileSchema.parse(input);const actor=await currentActor();if(!actor||actor.role!=='tourist')return{ok:false,message:'Acesso não autorizado.',requiresAuth:true};const row=await getTripById(tripId,actor);const data=structuredClone(row.data);data.trip={...data.trip,...profile};data.days=generatePlan(profile as TripProfile,await publicContent('places'),row.data);await replaceTripPlan(actor,tripId,row.version,data);await analyticsProvider.record('TRIP_CREATED',{regenerated:true},actor);revalidatePath(`/viagens/${tripId}`,'layout');return{ok:true,message:'Roteiro regenerado, preservando escolhas manuais.',tripId};}catch(error){return{ok:false,message:publicErrorMessage(error,'Não foi possível regenerar.')};}}
export async function editTrip(_state:{ok:boolean;message:string},form:FormData){
  try{const actor=await currentActor();if(!actor||actor.role!=='tourist')throw new Error('Acesso não autorizado.');const tripId=sanitizeId(form.get('tripId'),'Viagem');const row=await getTripById(tripId,actor);if(Number(form.get('version'))!==row.version)throw new Error('O roteiro mudou. Atualize a página antes de editar.');const action=String(form.get('operation')) as TripOperation['action'];if(!['move','remove','swap','add','fix','unfix','restore'].includes(action))throw new Error('Ação inválida.');const time=sanitizeText(form.get('time')||'17:00',5,{multiline:false});if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(time))throw new Error('Horário inválido.');const itemRaw=sanitizeText(form.get('itemId')||'',128,{multiline:false});const placeRaw=sanitizeText(form.get('placeId')||'',128,{multiline:false});const date=sanitizeText(form.get('date')||'',10,{multiline:false});const op:TripOperation={action,itemId:itemRaw?sanitizeId(itemRaw,'Item'):undefined,placeId:placeRaw?sanitizeId(placeRaw,'Lugar'):undefined,date,time,newId:crypto.randomUUID()};const data=applyOperation(row.data,op,await publicContent('places'));await replaceTripPlan(actor,tripId,row.version,data);const event=action==='remove'?'PLACE_REMOVED':action==='swap'?'PLACE_SWAPPED':action==='add'?'PLACE_ADDED':action==='move'?'PLACE_MOVED':action==='restore'?'PLACE_RESTORED':'PLACE_FIXED';await analyticsProvider.record(event,{placeId:op.placeId||''},actor);revalidatePath(`/viagens/${tripId}`,'layout');revalidatePath('/meu-passaporte');return{ok:true,message:'Alteração salva. As demais paradas foram preservadas.'};}catch(error){return{ok:false,message:publicErrorMessage(error,'Não foi possível alterar.')};}
}
