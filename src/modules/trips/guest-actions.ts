'use server';
import {revalidatePath} from 'next/cache';
import {currentActor} from '@/core/auth/session';
import {publicContent} from '@/modules/content/repository';
import {analyticsProvider} from '@/modules/tracking/service';
import {publicErrorMessage} from '@/core/security/sanitize';
import {createTrip} from './persistence';
import {guestDraftSchema,profileFromTrip} from './guest-trip';

type SaveGuestResult={ok:boolean;message:string;tripId?:string;requiresAuth?:boolean};

export async function saveGuestTrip(input:unknown):Promise<SaveGuestResult>{
  try{
    const actor=await currentActor();
    if(!actor||actor.role!=='tourist')return{ok:false,message:'Entre para salvar sua viagem sem perder o que você montou.',requiresAuth:true};
    const draft=guestDraftSchema.parse(input);const places=await publicContent('places');const allowed=new Set(places.filter(p=>p.discoveryVisible!==false&&p.status!=='archived').map(p=>p.id));
    for(const day of draft.data.days)for(const item of day.items)if(!allowed.has(item.placeId))throw new Error('O roteiro contém um lugar que não está mais disponível.');
    const profile=profileFromTrip(draft.data);const tripId=await createTrip(actor,profile,draft.data.days);
    await analyticsProvider.record('TRIP_CREATED',{source:'guest_presentation',hadDemoVisits:draft.data.visits.length>0},actor);
    revalidatePath('/viagens','layout');revalidatePath('/meu-passaporte');
    return{ok:true,message:draft.data.visits.length?'Roteiro salvo. Os carimbos simulados ficaram apenas na demonstração; presenças reais precisam ser validadas durante a viagem.':'Roteiro salvo.',tripId};
  }catch(error){return{ok:false,message:publicErrorMessage(error,'Não foi possível salvar esta viagem.')};}
}
