import {eq} from 'drizzle-orm';
import {db} from '@/core/db';
import {
  events,
  experiences,
  partners,
  placeCategories,
  placeCategoryLinks,
  placeMedia,
  places,
  placeSources,
  sources,
  type ContentData,
} from '@/core/db/schema';
import type {Kind} from './repository';

type Database=Awaited<ReturnType<typeof db>>;
type Transaction=Parameters<Parameters<Database['transaction']>[0]>[0];
type Writer=Database|Transaction;

const cityId=(data:ContentData)=>data.cityId||'city-serra-negra-sp';
const stringOrNull=(value:string|undefined)=>value||null;

export async function upsertCanonical(writer:Writer,kind:Kind,data:ContentData,version=1){
  if(kind==='categories'){
    await writer.insert(placeCategories).values({
      id:data.id,slug:data.slug||data.id,name:data.name||data.id,icon:data.icon||null,
      enabled:data.enabled!==false,sortOrder:data.sortOrder||0,status:data.status||'published',
      synthetic:data.synthetic===true,version,
    }).onConflictDoUpdate({target:placeCategories.id,set:{slug:data.slug||data.id,name:data.name||data.id,icon:data.icon||null,enabled:data.enabled!==false,sortOrder:data.sortOrder||0,status:data.status||'published',synthetic:data.synthetic===true,version}});
    return;
  }
  if(kind==='sources'){
    await writer.insert(sources).values({
      id:data.id,name:data.sourceName||data.name||data.id,sourceType:data.sourceType||'secondary_source',url:data.sourceUrl||null,
      verificationStatus:data.verificationStatus||'needs_review',verifiedAt:data.verifiedAt?new Date(data.verifiedAt):null,notes:data.notes||null,
      status:data.status||'published',synthetic:data.synthetic===true,version,
    }).onConflictDoUpdate({target:sources.id,set:{name:data.sourceName||data.name||data.id,sourceType:data.sourceType||'secondary_source',url:data.sourceUrl||null,verificationStatus:data.verificationStatus||'needs_review',verifiedAt:data.verifiedAt?new Date(data.verifiedAt):null,notes:data.notes||null,status:data.status||'published',synthetic:data.synthetic===true,version}});
    return;
  }
  if(kind==='places'){
    await writer.insert(places).values({
      id:data.id,cityId:cityId(data),slug:data.slug||data.id,name:data.name||data.id,placeType:data.placeType||'tourist_point',commercialRelation:data.commercialRelation||'public_point',
      shortDescription:stringOrNull(data.shortDescription),longDescription:stringOrNull(data.longDescription),environment:stringOrNull(data.environment),costType:stringOrNull(data.costType),durationMinutes:data.durationMinutes||null,durationIsEstimate:data.durationIsEstimate===true,
      openingHoursType:data.openingHours?.type||null,openingHoursText:data.openingHours?.text||null,locationDisplay:data.location?.display||null,locationLat:data.location?.lat??null,locationLng:data.location?.lng??null,
      accessibility:data.accessibility||null,priceNote:data.priceNote||null,requirements:data.requirements||null,imagePlaceholder:data.imagePlaceholder||null,discoveryVisible:data.discoveryVisible!==false,status:data.status||'published',synthetic:data.synthetic===true,version,
      updatedAt:new Date(),
    }).onConflictDoUpdate({target:places.id,set:{cityId:cityId(data),slug:data.slug||data.id,name:data.name||data.id,placeType:data.placeType||'tourist_point',commercialRelation:data.commercialRelation||'public_point',shortDescription:stringOrNull(data.shortDescription),longDescription:stringOrNull(data.longDescription),environment:stringOrNull(data.environment),costType:stringOrNull(data.costType),durationMinutes:data.durationMinutes||null,durationIsEstimate:data.durationIsEstimate===true,openingHoursType:data.openingHours?.type||null,openingHoursText:data.openingHours?.text||null,locationDisplay:data.location?.display||null,locationLat:data.location?.lat??null,locationLng:data.location?.lng??null,accessibility:data.accessibility||null,priceNote:data.priceNote||null,requirements:data.requirements||null,imagePlaceholder:data.imagePlaceholder||null,discoveryVisible:data.discoveryVisible!==false,status:data.status||'published',synthetic:data.synthetic===true,version,updatedAt:new Date()}});
    await writer.delete(placeCategoryLinks).where(eq(placeCategoryLinks.placeId,data.id));
    if(data.categoryIds?.length)await writer.insert(placeCategoryLinks).values(data.categoryIds.map(categoryId=>({placeId:data.id,categoryId}))).onConflictDoNothing();
    await writer.delete(placeSources).where(eq(placeSources.placeId,data.id));
    if(data.sourceIds?.length)await writer.insert(placeSources).values(data.sourceIds.map(sourceId=>({placeId:data.id,sourceId,verifiedAt:data.verifiedAt?new Date(data.verifiedAt):null}))).onConflictDoNothing();
    if(data.imageAsset){
      const image=data.imageAsset;
      await writer.insert(placeMedia).values({id:`media-${data.id}-cover`,placeId:data.id,kind:'cover',src:image.src||null,fallbackSrc:image.fallbackSrc||null,sourcePage:image.sourcePage||null,author:image.author||null,provider:image.provider||null,license:image.license||null,alt:image.alt||null,position:image.position||null,illustrative:image.illustrative===true,notActualPlace:image.notActualPlace===true,status:'published'})
        .onConflictDoUpdate({target:placeMedia.id,set:{src:image.src||null,fallbackSrc:image.fallbackSrc||null,sourcePage:image.sourcePage||null,author:image.author||null,provider:image.provider||null,license:image.license||null,alt:image.alt||null,position:image.position||null,illustrative:image.illustrative===true,notActualPlace:image.notActualPlace===true,status:'published'}});
    }
    return;
  }
  if(kind==='partners'){
    if(!data.placeId)throw new Error('Parceiro sem lugar relacionado.');
    const contacts=data.demoContacts||{};
    await writer.insert(partners).values({id:data.id,placeId:data.placeId,responseTime:data.responseTime||null,whatsapp:contacts.whatsapp||null,phone:contacts.phone||null,instagram:contacts.instagram||null,website:contacts.website||null,bookingUrl:contacts.booking||null,status:data.status||'active',synthetic:data.synthetic===true,version})
      .onConflictDoUpdate({target:partners.id,set:{placeId:data.placeId,responseTime:data.responseTime||null,whatsapp:contacts.whatsapp||null,phone:contacts.phone||null,instagram:contacts.instagram||null,website:contacts.website||null,bookingUrl:contacts.booking||null,status:data.status||'active',synthetic:data.synthetic===true,version}});
    return;
  }
  if(kind==='experiences'){
    await writer.insert(experiences).values({id:data.id,placeId:data.placeId||null,partnerId:data.partnerId||null,slug:data.slug||data.id,name:data.name||data.id,shortDescription:data.shortDescription||null,longDescription:data.longDescription||null,costType:data.costType||null,bookingType:data.bookingType||null,durationMinutes:data.durationMinutes||null,environment:data.environment||null,accessibility:data.accessibility||null,status:data.status||'published',synthetic:data.synthetic===true,version})
      .onConflictDoUpdate({target:experiences.id,set:{placeId:data.placeId||null,partnerId:data.partnerId||null,slug:data.slug||data.id,name:data.name||data.id,shortDescription:data.shortDescription||null,longDescription:data.longDescription||null,costType:data.costType||null,bookingType:data.bookingType||null,durationMinutes:data.durationMinutes||null,environment:data.environment||null,accessibility:data.accessibility||null,status:data.status||'published',synthetic:data.synthetic===true,version}});
    return;
  }
  if(kind==='events'){
    await writer.insert(events).values({id:data.id,cityId:cityId(data),placeId:data.placeId||null,slug:data.slug||data.id,name:data.name||data.id,shortDescription:data.shortDescription||null,startsAt:data.startsAt?new Date(data.startsAt):null,endsAt:data.endsAt?new Date(data.endsAt):null,costType:data.costType||null,environment:data.environment||null,status:data.status||'published',synthetic:data.synthetic===true,version})
      .onConflictDoUpdate({target:events.id,set:{cityId:cityId(data),placeId:data.placeId||null,slug:data.slug||data.id,name:data.name||data.id,shortDescription:data.shortDescription||null,startsAt:data.startsAt?new Date(data.startsAt):null,endsAt:data.endsAt?new Date(data.endsAt):null,costType:data.costType||null,environment:data.environment||null,status:data.status||'published',synthetic:data.synthetic===true,version}});
  }
}


export async function canonicalExists(writer:Writer,kind:Kind,id:string){
  if(kind==='places')return (await writer.select({id:places.id}).from(places).where(eq(places.id,id))).length>0;
  if(kind==='partners')return (await writer.select({id:partners.id}).from(partners).where(eq(partners.id,id))).length>0;
  if(kind==='experiences')return (await writer.select({id:experiences.id}).from(experiences).where(eq(experiences.id,id))).length>0;
  if(kind==='events')return (await writer.select({id:events.id}).from(events).where(eq(events.id,id))).length>0;
  if(kind==='categories')return (await writer.select({id:placeCategories.id}).from(placeCategories).where(eq(placeCategories.id,id))).length>0;
  return (await writer.select({id:sources.id}).from(sources).where(eq(sources.id,id))).length>0;
}

export async function archiveCanonical(writer:Writer,kind:Kind,id:string){
  const status='archived';
  if(kind==='places')await writer.update(places).set({status,updatedAt:new Date()}).where(eq(places.id,id));
  else if(kind==='partners')await writer.update(partners).set({status}).where(eq(partners.id,id));
  else if(kind==='experiences')await writer.update(experiences).set({status}).where(eq(experiences.id,id));
  else if(kind==='events')await writer.update(events).set({status}).where(eq(events.id,id));
  else if(kind==='categories')await writer.update(placeCategories).set({status}).where(eq(placeCategories.id,id));
  else await writer.update(sources).set({status}).where(eq(sources.id,id));
}
