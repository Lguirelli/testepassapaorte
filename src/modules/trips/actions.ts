'use server';
import {revalidatePath} from 'next/cache';
import {currentActor} from '@/core/auth/session';
import {publicContent} from '@/modules/content/repository';
import {analyticsProvider} from '@/modules/tracking/service';import {sanitizeId,publicErrorMessage} from '@/core/security/sanitize';
import {applyOperation} from './engine';
import {replaceTripPlan} from './persistence';
import {getCurrentTrip} from './repository';
export async function addPlace(_previous:{message:string},form:FormData){try{const actor=await currentActor();if(!actor||actor.role!=='tourist')return{message:'Entre para adicionar lugares ao seu roteiro.'};const placeId=sanitizeId(form.get('placeId'),'Lugar');const place=(await publicContent('places')).find(p=>p.id===placeId&&p.discoveryVisible!==false);if(!place)return{message:'Lugar indisponível.'};const row=await getCurrentTrip(actor);if(!row)return{message:'Crie um roteiro antes de adicionar.'};if(row.data.days.some(d=>d.items.some(i=>i.placeId===placeId&&i.state!=='removed')))return{message:'Este lugar já está no roteiro.'};const date=row.data.days[0]?.date;if(!date)return{message:'Crie um dia de viagem antes de adicionar.'};const data=applyOperation(row.data,{action:'add',placeId,date,time:'17:00',newId:crypto.randomUUID()},await publicContent('places'));await replaceTripPlan(actor,row.id,row.version,data);await analyticsProvider.record('PLACE_ADDED',{placeId},actor);revalidatePath(`/viagens/${row.id}`,'layout');return{message:'Lugar adicionado ao roteiro.'};}catch(error){return{message:publicErrorMessage(error,'Não foi possível salvar.')};}}
