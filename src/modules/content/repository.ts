import {and,eq,ne,asc} from 'drizzle-orm';
import {db} from '@/core/db';
import {content,type ContentData} from '@/core/db/schema';
export const kinds=['places','partners','experiences','events','categories','sources'] as const;
export type Kind=typeof kinds[number];
async function publishedRows(kind:Kind):Promise<ContentData[]>{const rows=await(await db()).select().from(content).where(and(eq(content.kind,kind),ne(content.status,'archived'))).orderBy(asc(content.id));return rows.flatMap(r=>r.published?[r.published]:[]);}
// Editorial relation options retain unlinked places and disabled categories.
// Only authenticated Admin pages consume this dataset.
export async function editorialDataset(){const [places,partners,experiences,events,categories,sources]=await Promise.all(kinds.map(publishedRows));return{places,partners,experiences,events,categories,sources};}
export type Dataset=Awaited<ReturnType<typeof editorialDataset>>;
export function visibleDataset(data:Dataset):Dataset{
 const categories=data.categories.filter(c=>c.enabled!==false).map(c=>c.icon==='passaporte-descobertas'?{...c,icon:'perfil-relaxar'}:c).sort((a,b)=>(a.sortOrder??0)-(b.sortOrder??0)||a.id.localeCompare(b.id));
 const categoryIds=new Set(categories.map(c=>c.id));
 const linkedPlaces=new Set(data.partners.map(p=>p.placeId));
 const places=data.places.filter(p=>p.commercialRelation!=='partner'||linkedPlaces.has(p.id));
 const placeIds=new Set(places.map(p=>p.id));
 const clean=(items:ContentData[])=>items.map(item=>({...item,categoryIds:item.categoryIds?.filter(id=>categoryIds.has(id))}));
 return {...data,categories,places:clean(places),partners:data.partners.filter(p=>placeIds.has(p.placeId||'')&&places.some(place=>place.id===p.placeId&&place.commercialRelation==='partner')),experiences:clean(data.experiences.filter(e=>!e.placeId||placeIds.has(e.placeId))),events:clean(data.events.filter(e=>!e.placeId||placeIds.has(e.placeId)))};
}
export async function publicDataset(){return visibleDataset(await editorialDataset());}
export async function publicContent(kind:Kind):Promise<ContentData[]>{return(await publicDataset())[kind];}
export function placeUrl(place:ContentData){return `/${place.commercialRelation==='partner'?'parceiros':'lugares'}/${place.slug}`;}
export function normalize(value:string){return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR');}
export type Filters={q:string;category:string;environment:string;cost:string;relation:string;accessible:string};
export function filterPlaces(data:Dataset,f:Filters){return data.places.filter(p=>{
 const text=[p.name,p.shortDescription,...data.categories.filter(c=>p.categoryIds?.includes(c.id)).map(c=>c.name),...data.experiences.filter(e=>e.placeId===p.id).map(e=>e.name)].join(' ');
 return (!f.q||normalize(text).includes(normalize(f.q)))&&(!f.category||p.categoryIds?.includes(f.category))&&(!f.environment||p.environment===f.environment)&&(!f.cost||p.costType===f.cost||data.experiences.some(e=>e.placeId===p.id&&e.costType===f.cost))&&(!f.relation||p.commercialRelation===f.relation)&&(!f.accessible||p.accessibility?.includes(f.accessible));
});}
