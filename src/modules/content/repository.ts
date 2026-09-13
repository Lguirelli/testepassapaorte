import {asc,ne} from 'drizzle-orm';
import {db} from '@/core/db';
import {sanitizeId,sanitizeSearchQuery,sanitizeText} from '@/core/security/sanitize';
import {
  editorialDrafts,events,experiences,partners,placeCategories,placeCategoryLinks,placeMedia,places,placeSources,sources,type ContentData,
} from '@/core/db/schema';
import real from '../../../seed/tourism-real.json';

export const kinds=['places','partners','experiences','events','categories','sources'] as const;
export type Kind=typeof kinds[number];
type Database=Awaited<ReturnType<typeof db>>;

async function relationalDataset(providedDatabase?:Database){
 const database=providedDatabase??await db();
 const [placeRows,partnerRows,experienceRows,eventRows,categoryRows,sourceRows,categoryLinks,sourceLinks,mediaRows]=await Promise.all([
  database.select().from(places).where(ne(places.status,'archived')).orderBy(asc(places.id)),
  database.select().from(partners).where(ne(partners.status,'archived')).orderBy(asc(partners.id)),
  database.select().from(experiences).where(ne(experiences.status,'archived')).orderBy(asc(experiences.id)),
  database.select().from(events).where(ne(events.status,'archived')).orderBy(asc(events.id)),
  database.select().from(placeCategories).where(ne(placeCategories.status,'archived')).orderBy(asc(placeCategories.id)),
  database.select().from(sources).where(ne(sources.status,'archived')).orderBy(asc(sources.id)),
  database.select().from(placeCategoryLinks),database.select().from(placeSources),database.select().from(placeMedia),
 ]);
 const categories:ContentData[]=categoryRows.map(row=>({id:row.id,slug:row.slug,name:row.name,icon:row.icon||undefined,enabled:row.enabled,sortOrder:row.sortOrder,status:row.status,synthetic:row.synthetic}));
 const sourceData:ContentData[]=sourceRows.map(row=>({id:row.id,name:row.name,sourceName:row.name,sourceType:row.sourceType,sourceUrl:row.url,verificationStatus:row.verificationStatus,verifiedAt:row.verifiedAt?.toISOString(),notes:row.notes||undefined,status:row.status,synthetic:row.synthetic}));
 const placeData:ContentData[]=placeRows.map(row=>{
  const image=mediaRows.find(media=>media.placeId===row.id&&media.kind==='cover');
  return {id:row.id,cityId:row.cityId,slug:row.slug,name:row.name,placeType:row.placeType,commercialRelation:row.commercialRelation,shortDescription:row.shortDescription||undefined,longDescription:row.longDescription||undefined,environment:row.environment||undefined,costType:row.costType||undefined,durationMinutes:row.durationMinutes||undefined,durationIsEstimate:row.durationIsEstimate,openingHours:row.openingHoursText?{type:row.openingHoursType||'researched',text:row.openingHoursText}:undefined,location:row.locationDisplay?{display:row.locationDisplay,...(row.locationLat===null?{}:{lat:row.locationLat}),...(row.locationLng===null?{}:{lng:row.locationLng})}:undefined,accessibility:row.accessibility||undefined,priceNote:row.priceNote||undefined,requirements:row.requirements||undefined,imagePlaceholder:row.imagePlaceholder||undefined,discoveryVisible:row.discoveryVisible,status:row.status,synthetic:row.synthetic,categoryIds:categoryLinks.filter(link=>link.placeId===row.id).map(link=>link.categoryId),sourceIds:sourceLinks.filter(link=>link.placeId===row.id).map(link=>link.sourceId),imageAsset:image?{src:image.src||undefined,fallbackSrc:image.fallbackSrc||undefined,sourcePage:image.sourcePage||undefined,author:image.author||undefined,provider:image.provider||undefined,license:image.license||undefined,alt:image.alt||undefined,position:image.position||undefined,illustrative:image.illustrative,notActualPlace:image.notActualPlace}:undefined};
 });
 const placeById=new Map(placeData.map(place=>[place.id,place]));
 const partnerData:ContentData[]=partnerRows.map(row=>{const place=placeById.get(row.placeId);return{id:row.id,placeId:row.placeId,name:place?.name,slug:place?.slug,responseTime:row.responseTime||undefined,demoContacts:{whatsapp:row.whatsapp||undefined,phone:row.phone||undefined,instagram:row.instagram||undefined,website:row.website||undefined,booking:row.bookingUrl||undefined},status:row.status,synthetic:row.synthetic};});
 const experienceData:ContentData[]=experienceRows.map(row=>({id:row.id,placeId:row.placeId||undefined,partnerId:row.partnerId||undefined,slug:row.slug,name:row.name,shortDescription:row.shortDescription||undefined,longDescription:row.longDescription||undefined,costType:row.costType||undefined,bookingType:row.bookingType||undefined,durationMinutes:row.durationMinutes||undefined,environment:row.environment||undefined,accessibility:row.accessibility||undefined,status:row.status,synthetic:row.synthetic}));
 const eventData:ContentData[]=eventRows.map(row=>({id:row.id,cityId:row.cityId,placeId:row.placeId||undefined,slug:row.slug,name:row.name,shortDescription:row.shortDescription||undefined,startsAt:row.startsAt?.toISOString(),endsAt:row.endsAt?.toISOString(),costType:row.costType||undefined,environment:row.environment||undefined,status:row.status,synthetic:row.synthetic}));
 return{places:placeData,partners:partnerData,experiences:experienceData,events:eventData,categories,sources:sourceData};
}
export type Dataset=Awaited<ReturnType<typeof relationalDataset>>;

/**
 * Canonical, researched public content bundled with the application.
 * This is deliberately read-only and contains no partner/demo relationship data.
 * It keeps discovery usable during a database outage while authenticated and
 * write flows remain database-strict.
 */
export function canonicalPublicDataset():Dataset{
 const categories:ContentData[]=real.categories.map(category=>({...category,status:'published',synthetic:false} as ContentData));
 const sourceData:ContentData[]=real.sources.map(source=>({
  id:source.id,
  name:source.name,
  sourceName:source.name,
  sourceType:source.sourceType,
  sourceUrl:source.url,
  verificationStatus:source.verificationStatus,
  verifiedAt:source.verifiedAt,
  status:'published',
  synthetic:false,
 }));
 const placeData:ContentData[]=real.places.map(raw=>{
  const {research:_research,...place}=raw;
  return {...place,cityId:real.city.id,status:'published',synthetic:false,discoveryVisible:place.discoveryVisible!==false} as ContentData;
 });
 return visibleDataset({places:placeData,partners:[],experiences:[],events:[],categories,sources:sourceData});
}

function reportPublicFallback(reason:'database_unavailable'|'database_empty'){
 // Keep operational detail in server logs without serializing errors, secrets or connection strings.
 console.warn(`[public-content] ${reason}; serving bundled canonical content.`);
}

// Admin preview overlays staging drafts over canonical relational entities.
export async function editorialDataset(){
 const data=await relationalDataset();const database=await db();const drafts=await database.select().from(editorialDrafts).where(ne(editorialDrafts.status,'archived'));
 const next={...data};
 for(const kind of kinds){const staged=drafts.filter(row=>row.kind===kind).map(row=>row.draft);if(staged.length)next[kind]=[...data[kind].filter(item=>!staged.some(draft=>draft.id===item.id)),...staged] as ContentData[];}
 return next;
}
export function visibleDataset(data:Dataset):Dataset{
 const categories=data.categories.filter(c=>c.enabled!==false).map(c=>c.icon==='passaporte-descobertas'?{...c,icon:'perfil-relaxar'}:c).sort((a,b)=>(a.sortOrder??0)-(b.sortOrder??0)||a.id.localeCompare(b.id));
 const categoryIds=new Set(categories.map(c=>c.id));
 const linkedPlaces=new Set(data.partners.map(p=>p.placeId));
 const places=data.places.filter(p=>p.commercialRelation!=='partner'||linkedPlaces.has(p.id));
 const placeIds=new Set(places.map(p=>p.id));
 const clean=(items:ContentData[])=>items.map(item=>({...item,categoryIds:item.categoryIds?.filter(id=>categoryIds.has(id))}));
 return {...data,categories,places:clean(places),partners:data.partners.filter(p=>placeIds.has(p.placeId||'')&&places.some(place=>place.id===p.placeId&&place.commercialRelation==='partner')),experiences:clean(data.experiences.filter(e=>!e.placeId||placeIds.has(e.placeId))),events:clean(data.events.filter(e=>!e.placeId||placeIds.has(e.placeId)))};
}
export async function publicDataset(){
 try{
  const data=visibleDataset(await relationalDataset());
  if(data.places.length>0)return data;
  reportPublicFallback('database_empty');
 }catch{
  reportPublicFallback('database_unavailable');
 }
 return canonicalPublicDataset();
}
export async function publicContent(kind:Kind):Promise<ContentData[]>{return(await publicDataset())[kind];}
export {placeUrl} from './urls';
export function normalize(value:string){return value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR');}
export type Filters={q:string;category:string;environment:string;cost:string;relation:string;accessible:string};
const allowedEnvironment=new Set(['indoor','outdoor','mixed']);const allowedCost=new Set(['free','paid','paid_with_booking','free_with_booking','mixed','unknown']);const allowedRelation=new Set(['public_point','listed_business','partner']);const allowedAccessible=new Set(['partial','full']);
export function parseFilters(input:Record<string,string|undefined>):Filters{let category='';if(input.category){try{category=sanitizeId(input.category,'Categoria');}catch{category='';}}const pick=(value:string|undefined,allowed:Set<string>)=>{const clean=sanitizeText(value||'',64,{multiline:false});return allowed.has(clean)?clean:'';};return{q:sanitizeSearchQuery(input.q||''),category,environment:pick(input.environment,allowedEnvironment),cost:pick(input.cost,allowedCost),relation:pick(input.relation,allowedRelation),accessible:pick(input.accessible,allowedAccessible)};}
export function filterPlaces(data:Dataset,f:Filters){return data.places.filter(p=>{
 if(p.discoveryVisible===false)return false;
 const text=[p.name,p.shortDescription,...data.categories.filter(c=>p.categoryIds?.includes(c.id)).map(c=>c.name),...data.experiences.filter(e=>e.placeId===p.id).map(e=>e.name)].join(' ');
 return (!f.q||normalize(text).includes(normalize(f.q)))&&(!f.category||p.categoryIds?.includes(f.category))&&(!f.environment||p.environment===f.environment)&&(!f.cost||p.costType===f.cost||data.experiences.some(e=>e.placeId===p.id&&e.costType===f.cost))&&(!f.relation||p.commercialRelation===f.relation)&&(!f.accessible||p.accessibility?.includes(f.accessible));
});}
