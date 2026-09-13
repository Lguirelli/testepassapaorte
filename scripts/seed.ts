import real from '../seed/tourism-real.json';
import demo from '../seed/validation-content.json';
import {eq} from 'drizzle-orm';
import {db} from '../src/core/db';
import {cities,editorialDrafts,pageSections,partnerMaturityHistory,qrCodes,sectionDefinitions,type ContentData} from '../src/core/db/schema';
import {canonicalExists,upsertCanonical} from '../src/modules/content/persistence';
import {validateContent} from '../src/modules/admin/validation';
import type {Kind} from '../src/modules/content/repository';

const database=await db();
const canonicalCity={...real.city};
const hiddenLegacyPlaces=new Set(['place-mirante-araucarias','place-jardim-nascentes','place-centro-cultural']);

type Tx=Parameters<Parameters<Awaited<ReturnType<typeof db>>['transaction']>[0]>[0];
function sourceDraft(raw:Record<string,unknown>,synthetic:boolean):ContentData{return{id:String(raw.id),name:String(raw.name||raw.sourceName||raw.id),sourceName:String(raw.name||raw.sourceName||raw.id),sourceType:String(raw.sourceType||'secondary_source'),sourceUrl:(raw.url??raw.sourceUrl??null) as string|null,verificationStatus:String(raw.verificationStatus||'needs_review'),verifiedAt:raw.verifiedAt?String(raw.verifiedAt):undefined,notes:raw.notes?String(raw.notes):undefined,status:'published',synthetic,cityId:canonicalCity.id};}
async function stage(tx:Tx,kind:Kind,data:ContentData){const [existing]=await tx.select().from(editorialDrafts).where(eq(editorialDrafts.id,data.id));if(!existing){await tx.insert(editorialDrafts).values({id:data.id,kind,slug:data.slug||data.id,draft:data,published:data,status:'published',synthetic:data.synthetic===true});return;}const normalized={...existing.draft,cityId:existing.draft.cityId==='city-demo-serra-negra'?canonicalCity.id:(existing.draft.cityId||data.cityId),...(kind==='places'&&data.discoveryVisible===false?{discoveryVisible:false}:{})};await tx.update(editorialDrafts).set({draft:normalized,published:existing.published?{...existing.published,cityId:canonicalCity.id,...(kind==='places'&&data.discoveryVisible===false?{discoveryVisible:false}:{})}:existing.published}).where(eq(editorialDrafts.id,data.id));}
async function seedEntity(tx:Tx,kind:Kind,data:ContentData){const clean=validateContent(kind,data);if(!await canonicalExists(tx,kind,clean.id))await upsertCanonical(tx,kind,clean);await stage(tx,kind,clean);}

await database.transaction(async tx=>{
  await tx.insert(cities).values(canonicalCity).onConflictDoUpdate({target:cities.id,set:{slug:canonicalCity.slug,name:canonicalCity.name,stateCode:canonicalCity.stateCode,countryCode:canonicalCity.countryCode,timezone:canonicalCity.timezone,status:canonicalCity.status,updatedAt:new Date()}});
  for(const raw of real.categories)await seedEntity(tx,'categories',{...raw,status:'published',synthetic:false,cityId:canonicalCity.id});
  for(const raw of real.sources)await seedEntity(tx,'sources',sourceDraft(raw as unknown as Record<string,unknown>,false));
  for(const raw of demo.sources)await seedEntity(tx,'sources',sourceDraft(raw as unknown as Record<string,unknown>,true));
  for(const raw of real.places){const {research,...place}=raw as typeof raw & {research?:{checkedAt?:string;officialSource?:{url?:string}}};const officialSource=real.sources.find(source=>source.url===research?.officialSource?.url);await seedEntity(tx,'places',{...place,sourceIds:officialSource?[officialSource.id]:place.sourceIds,verifiedAt:research?.checkedAt?`${research.checkedAt}T12:00:00-03:00`:undefined,status:'published',synthetic:false,cityId:canonicalCity.id,discoveryVisible:true});}
  for(const raw of demo.places)await seedEntity(tx,'places',{...raw,status:'published',synthetic:true,cityId:canonicalCity.id,discoveryVisible:!hiddenLegacyPlaces.has(raw.id)});
  for(const raw of demo.partners){const place=demo.places.find(item=>item.id===raw.placeId);await seedEntity(tx,'partners',{...raw,name:place?.name,slug:place?.slug,status:'active',synthetic:true,cityId:canonicalCity.id});}
  for(const raw of demo.experiences)await seedEntity(tx,'experiences',{...raw,status:'published',synthetic:true,cityId:canonicalCity.id});
  for(const raw of demo.events)await seedEntity(tx,'events',{...raw,status:'published',synthetic:true,cityId:canonicalCity.id});

  const allPlaces=[...real.places,...demo.places];
  for(const place of allPlaces){const code=`sn-${place.slug}`;await tx.insert(qrCodes).values({id:`qr-${place.id}`,code,placeId:place.id,status:'active',dedupeWindowMinutes:30}).onConflictDoUpdate({target:qrCodes.code,set:{placeId:place.id,status:'active'}});}

  const definitions=[
    ['home-hero','hero','HomeHero'],['home-discovery','discovery','HomeDiscovery'],['home-encounters','encounters','CircularGallery'],['home-route-callout','route_callout','RouteCallout'],['home-route-types','route_types','RouteTypes'],['home-route-cards','route_cards','RouteCards'],['home-context','contextual_discovery','ContextualDiscovery'],['home-interest','interest_grid','InterestGrid'],['home-faq','faq','FaqAccordion'],['home-passport','passport_intro','PassportIntro'],['home-map','territorial_map','TerritorialMap'],['home-final','final_cta','FinalCta'],
  ] as const;
  for(const [id,type,componentKey] of definitions)await tx.insert(sectionDefinitions).values({id,type,schemaVersion:1,enabled:true,audience:'public',componentKey,status:'published'}).onConflictDoUpdate({target:sectionDefinitions.id,set:{type,componentKey,enabled:true,status:'published'}});
  for(const [index,[definitionId]] of definitions.entries())await tx.insert(pageSections).values({id:`home-section-${index+1}`,pageScope:'home',sectionDefinitionId:definitionId,sortOrder:index,content:{},status:'published'}).onConflictDoUpdate({target:pageSections.id,set:{sectionDefinitionId:definitionId,sortOrder:index,status:'published'}});
  for(const partner of demo.partners)await tx.insert(partnerMaturityHistory).values({id:`maturity-${partner.id}-initial`,partnerId:partner.id,stage:'Entrada',dataMaturity:'DADO INICIAL',reason:'Registro sintético inicial para demonstração do fluxo de maturação.'}).onConflictDoNothing();
});
console.log(`Seed aplicado: ${real.places.length} atrativos reais, ${demo.partners.length} parceiros demo, QR e Section Registry.`);
process.exit(0);
