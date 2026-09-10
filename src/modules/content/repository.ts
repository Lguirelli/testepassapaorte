import {and,eq,ne,asc} from 'drizzle-orm';
import {db} from '@/core/db';
import {content,type ContentData} from '@/core/db/schema';
export const kinds=['places','partners','experiences','events','categories','sources'] as const;
export type Kind=typeof kinds[number];
export async function publicContent(kind:Kind):Promise<ContentData[]>{const rows=await(await db()).select().from(content).where(and(eq(content.kind,kind),ne(content.status,'archived'))).orderBy(asc(content.id));return rows.flatMap(r=>r.published?[r.published]:[]);}
export async function publicDataset(){const [places,partners,experiences,events,categories,sources]=await Promise.all(kinds.map(publicContent));return{places,partners,experiences,events,categories,sources};}
export type Dataset=Awaited<ReturnType<typeof publicDataset>>;
export function placeUrl(place:ContentData){return `/${place.commercialRelation==='partner'?'parceiros':'lugares'}/${place.slug}`;}
export function normalize(value:string){return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR');}
export type Filters={q:string;category:string;environment:string;cost:string;relation:string;accessible:string};
export function filterPlaces(data:Dataset,f:Filters){return data.places.filter(p=>{
 const text=[p.name,p.shortDescription,...data.categories.filter(c=>p.categoryIds?.includes(c.id)).map(c=>c.name),...data.experiences.filter(e=>e.placeId===p.id).map(e=>e.name)].join(' ');
 return (!f.q||normalize(text).includes(normalize(f.q)))&&(!f.category||p.categoryIds?.includes(f.category))&&(!f.environment||p.environment===f.environment)&&(!f.cost||p.costType===f.cost||data.experiences.some(e=>e.placeId===p.id&&e.costType===f.cost))&&(!f.relation||p.commercialRelation===f.relation)&&(!f.accessible||p.accessibility?.includes(f.accessible));
});}
