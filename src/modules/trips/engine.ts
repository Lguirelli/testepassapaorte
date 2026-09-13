import {z} from 'zod';
import type {ContentData} from '@/core/db/schema';
import type {TripData,TripDay,TripItem,TripProfile} from './types';

const isoDate=/^\d{4}-\d{2}-\d{2}$/;
function utcDay(value:string){if(!isoDate.test(value))throw new Error('Data inválida.');const d=new Date(`${value}T12:00:00Z`);if(Number.isNaN(d.getTime())||d.toISOString().slice(0,10)!==value)throw new Error('Data inválida.');return d;}
const dateField=z.string().regex(isoDate,'Data inválida.').refine(value=>{try{utcDay(value);return true;}catch{return false;}},'Data inválida.');
function dayDiff(a:string,b:string){return Math.round((utcDay(b).getTime()-utcDay(a).getTime())/86400000);}
export const profileSchema=z.object({
  startsOn:dateField,
  endsOn:dateField,
  party:z.enum(['couple','family','friends','solo']),
  interests:z.array(z.string().regex(/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/,'Interesse inválido.')).min(1,'Selecione ao menos um interesse.').max(20),
  intentions:z.array(z.enum(['classics','different','food','relax','landscapes','children','budget','local_producers'])).min(1,'Selecione ao menos uma intenção.').max(8),
  pace:z.enum(['slow','balanced','active']),
  transport:z.enum(['car','walk','taxi_app','unknown']),
  needs:z.array(z.enum(['avoid_outdoor','free','accessibility','small_child','diet'])).max(5).default([]),
}).strict().superRefine((p,ctx)=>{const diff=dayDiff(p.startsOn,p.endsOn);if(diff<0)ctx.addIssue({code:'custom',message:'A saída deve ser igual ou posterior à chegada.',path:['endsOn']});if(diff>13)ctx.addIssue({code:'custom',message:'O MVP monta viagens de até 14 dias por vez.',path:['endsOn']});});
export type Profile=z.infer<typeof profileSchema>;

export function dateRange(startsOn:string,endsOn:string){const dates:string[]=[];const start=utcDay(startsOn);const end=utcDay(endsOn);for(let d=start;d<=end;d=new Date(d.getTime()+86400000))dates.push(d.toISOString().slice(0,10));return dates;}
const intentionCategory:Record<string,string[]>= {
  classics:['cat-cultura','cat-natureza'],different:['cat-cultura','cat-compras'],food:['cat-gastronomia','cat-cafes'],relax:['cat-bem-estar','cat-natureza'],landscapes:['cat-natureza'],children:['cat-natureza','cat-cultura'],budget:['cat-natureza','cat-cultura'],local_producers:['cat-compras','cat-gastronomia'],
};
export function scorePlace(place:ContentData,profile:TripProfile,index:number){
  if(place.status==='archived'||place.discoveryVisible===false||place.synthetic===true)return -Infinity;
  if(profile.needs.includes('avoid_outdoor')&&place.environment==='outdoor')return -Infinity;
  if(profile.needs.includes('accessibility')&&(!place.accessibility||place.accessibility.length===0))return -Infinity;
  if(profile.needs.includes('free')&&place.costType!=='free')return -Infinity;
  let score=0;for(const id of place.categoryIds||[])if(profile.interests.includes(id))score+=8;
  for(const intent of profile.intentions){for(const id of intentionCategory[intent]||[])if(place.categoryIds?.includes(id))score+=4;}
  if(profile.party==='family'&&place.environment!=='indoor')score+=1;
  if(profile.pace==='slow'&&(place.durationMinutes||60)<=90)score+=1;
  if(place.costType==='free')score+=profile.intentions.includes('budget')?3:1;
  score+=Math.max(0,1-index/1000);return score;
}
function slots(pace:TripProfile['pace']){return pace==='slow'?['09:30','14:00']:pace==='active'?['09:00','11:30','14:30','17:00']:['09:30','13:00','16:00'];}
export function generatePlan(profileInput:TripProfile,places:ContentData[],existing?:TripData):TripDay[]{
  const profile=profileSchema.parse(profileInput);const dates=dateRange(profile.startsOn,profile.endsOn);const protectedItems=(existing?.days||[]).flatMap(day=>day.items.filter(item=>item.state==='fixed'||item.source!=='recommended_by_engine').map(item=>({date:day.date,item:structuredClone(item)})));
  if(protectedItems.some(p=>!dates.includes(p.date)))throw new Error('Há escolhas manuais fora do novo período. Ajuste essas paradas antes de regenerar.');
  const ranked=places.map((place,index)=>({place,score:scorePlace(place,profile,index)})).filter(item=>Number.isFinite(item.score)&&item.score>-Infinity).sort((a,b)=>b.score-a.score||String(a.place.name).localeCompare(String(b.place.name),'pt-BR'));
  if(!ranked.length)throw new Error('Não há lugares publicados compatíveis com estas restrições.');
  const used=new Set(protectedItems.map(p=>p.item.placeId));let cursor=0;
  return dates.map((date,dayIndex)=>{const manual=protectedItems.filter(p=>p.date===date).map(p=>p.item);const times=slots(profile.pace);const items=[...manual];for(const time of times){if(items.length>=times.length)break;let choice;for(let attempts=0;attempts<ranked.length;attempts++){const candidate=ranked[(cursor+attempts)%ranked.length].place;if(!used.has(candidate.id)){choice=candidate;cursor=(cursor+attempts+1)%ranked.length;break;}}if(!choice)break;used.add(choice.id);items.push({id:crypto.randomUUID(),placeId:choice.id,startsAt:time,durationMinutes:choice.durationMinutes||60,source:'recommended_by_engine',state:'planned'});}
    return{id:`day-${dayIndex+1}`,date,items:items.sort((a,b)=>a.startsAt.localeCompare(b.startsAt))};});
}
export type TripOperation={action:'move'|'remove'|'swap'|'add'|'fix'|'unfix'|'restore';itemId?:string;placeId?:string;date?:string;time?:string;newId?:string};
export function applyOperation(existing:TripData,op:TripOperation,places:ContentData[]):TripData{const result=structuredClone(existing);const day=result.days.find(d=>d.items.some(i=>i.id===op.itemId));const item=day?.items.find(i=>i.id===op.itemId);const destination=result.days.find(d=>d.date===op.date);const place=places.find(p=>p.id===op.placeId&&p.discoveryVisible!==false);if(op.action==='add'){if(!destination||!place||!op.newId)throw new Error('Selecione dia e lugar disponíveis.');if(destination.items.some(i=>i.placeId===place.id&&i.state!=='removed'))throw new Error('Este lugar já está planejado neste dia.');destination.items.push({id:op.newId,placeId:place.id,startsAt:op.time||'17:00',durationMinutes:place.durationMinutes||60,source:'added_by_user',state:'planned'});}else{if(!day||!item)throw new Error('Parada indisponível.');if(item.state==='fixed'&&op.action!=='unfix')throw new Error('Desfixe esta parada antes de alterar.');if(op.action==='fix'){item.state='fixed';item.source='fixed';}if(op.action==='unfix'){item.state='planned';item.source='changed_by_user';}if(op.action==='remove'){item.previousState=item.state;item.state='removed';item.source='changed_by_user';}if(op.action==='restore'){item.state=item.previousState||'planned';delete item.previousState;item.source='changed_by_user';}if(op.action==='swap'){if(!place)throw new Error('Selecione um lugar disponível.');item.placeId=place.id;item.durationMinutes=place.durationMinutes||60;item.state='planned';item.source='changed_by_user';}if(op.action==='move'){if(!destination||!op.time)throw new Error('Selecione dia e horário.');day.items=day.items.filter(i=>i.id!==item.id);destination.items.push(item);item.startsAt=op.time;item.state='moved';item.source='changed_by_user';}}
  for(const d of result.days){for(const i of d.items)if(i.state!=='removed'&&minutes(i.startsAt)+i.durationMinutes>1440)throw new Error('A parada ultrapassa o fim do dia. Escolha outro horário.');d.items.sort((a,b)=>a.startsAt.localeCompare(b.startsAt));}
  return result;
}
export function minutes(time:string){const[h,m]=time.split(':').map(Number);return h*60+m;}
export function timeLabel(value:number){return `${Math.floor(value/60).toString().padStart(2,'0')}:${(value%60).toString().padStart(2,'0')}`;}
