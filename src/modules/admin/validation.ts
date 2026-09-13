import {z} from 'zod';
import {iconRegistry} from '@/design-system/icons/icon-registry';
import {sanitizeAssetReference,sanitizeHttpsUrl,sanitizeId,sanitizeInstagram,sanitizePhone,sanitizeSlug,sanitizeText,sanitizeWhatsApp,safeObjectPosition} from '@/core/security/sanitize';
import type {ContentData} from '@/core/db/schema';import type {Kind} from '@/modules/content/repository';

const text=z.string().max(5000);const short=z.string().max(512);const id=z.string().min(1).max(128);const ids=z.array(id).max(100);
const imageAsset=z.object({src:z.string().max(2048).optional(),fallbackSrc:z.string().max(2048).optional(),sourcePage:z.string().max(2048).optional(),author:short.optional(),provider:short.optional(),license:short.optional(),alt:z.string().max(1000).optional(),position:z.string().max(100).optional(),illustrative:z.boolean().optional(),notActualPlace:z.boolean().optional()}).strict();
const contacts=z.object({whatsapp:z.string().max(2048).optional(),phone:z.string().max(64).optional(),instagram:z.string().max(2048).optional(),website:z.string().max(2048).optional(),booking:z.string().max(2048).optional()}).strict();
const schema=z.object({
  id,name:text.optional(),slug:z.string().max(120).optional(),shortDescription:text.optional(),longDescription:text.optional(),placeId:id.optional(),categoryIds:ids.optional(),sourceIds:ids.optional(),
  placeType:z.enum(['tourist_point','business']).optional(),commercialRelation:z.enum(['public_point','listed_business','partner']).optional(),partnerId:id.optional(),environment:z.enum(['indoor','outdoor','mixed']).optional(),costType:z.enum(['free','paid','paid_with_booking','free_with_booking','mixed','unknown']).optional(),durationMinutes:z.number().int().min(1).max(1440).optional(),durationIsEstimate:z.boolean().optional(),
  openingHours:z.object({type:z.string().max(100),text:z.string().max(2000)}).strict().optional(),location:z.object({lat:z.number().min(-90).max(90).optional(),lng:z.number().min(-180).max(180).optional(),display:z.string().max(1000).optional()}).strict().optional(),accessibility:z.array(short).max(50).optional(),responseTime:z.enum(['within_1_hour','within_few_hours','same_day','one_business_day']).optional(),demoContacts:contacts.optional(),bookingType:z.enum(['none','external_optional','external_required']).optional(),
  startsAt:short.optional(),endsAt:short.optional(),icon:short.optional(),enabled:z.boolean().optional(),sortOrder:z.number().int().min(0).max(10000).optional(),sourceName:text.optional(),sourceType:z.enum(['official_source','verified','secondary_source','synthetic_validation']).optional(),sourceUrl:z.union([z.string().max(2048),z.null()]).optional(),verificationStatus:z.enum(['official_source','verified','secondary_source','conflicting','needs_review','demo_only']).optional(),verifiedAt:short.optional(),notes:text.optional(),synthetic:z.boolean().optional(),cityId:id.optional(),status:z.enum(['draft','published','archived','needs_review','active']).optional(),discoveryVisible:z.boolean().optional(),priceNote:text.optional(),requirements:z.array(short).max(50).optional(),imagePlaceholder:short.optional(),imageAsset:imageAsset.optional(),
}).strict();

const cleanString=(value:string|undefined,max=5000)=>value===undefined?undefined:sanitizeText(value,max);
const cleanIds=(values:string[]|undefined,label:string)=>values?.map(value=>sanitizeId(value,label));

export function validateContent(kind:Kind,data:ContentData){
  if(kind==='categories'&&data.icon==='passaporte-descobertas')data={...data,icon:'perfil-relaxar'};
  // Legacy researched tourism content used "not_informed" before the canonical cost enum
  // was consolidated. Keep the persisted/admin representation canonical without rewriting source files.
  if(data.costType==='not_informed')data={...data,costType:'unknown'};
  const result=schema.safeParse(data);if(!result.success)throw new Error(result.error.issues.map(i=>`${i.path.join('.')}: ${i.message}`).join(' '));
  const parsed=result.data;
  const clean:ContentData={
    ...parsed,
    id:sanitizeId(parsed.id,'ID'),
    name:cleanString(parsed.name,500),slug:parsed.slug?sanitizeSlug(parsed.slug):undefined,shortDescription:cleanString(parsed.shortDescription,2000),longDescription:cleanString(parsed.longDescription,5000),
    placeId:parsed.placeId?sanitizeId(parsed.placeId,'Lugar relacionado'):undefined,partnerId:parsed.partnerId?sanitizeId(parsed.partnerId,'Parceiro relacionado'):undefined,categoryIds:cleanIds(parsed.categoryIds,'Categoria'),sourceIds:cleanIds(parsed.sourceIds,'Fonte'),
    openingHours:parsed.openingHours?{type:sanitizeText(parsed.openingHours.type,100,{multiline:false}),text:sanitizeText(parsed.openingHours.text,2000)}:undefined,
    location:parsed.location?{...(parsed.location.lat===undefined?{}:{lat:parsed.location.lat}),...(parsed.location.lng===undefined?{}:{lng:parsed.location.lng}),display:sanitizeText(parsed.location.display||'',1000)}:undefined,
    accessibility:parsed.accessibility?.map(value=>sanitizeText(value,100,{multiline:false})),requirements:parsed.requirements?.map(value=>sanitizeText(value,200,{multiline:false})),
    sourceName:cleanString(parsed.sourceName,500),sourceUrl:parsed.sourceUrl?sanitizeHttpsUrl(parsed.sourceUrl,{allowEmpty:false}):parsed.sourceUrl,notes:cleanString(parsed.notes,5000),cityId:parsed.cityId?sanitizeId(parsed.cityId,'Cidade'):undefined,
    imagePlaceholder:cleanString(parsed.imagePlaceholder,100),priceNote:cleanString(parsed.priceNote,1000),verifiedAt:cleanString(parsed.verifiedAt,100),startsAt:cleanString(parsed.startsAt,100),endsAt:cleanString(parsed.endsAt,100),icon:cleanString(parsed.icon,100),
    demoContacts:parsed.demoContacts?{
      whatsapp:parsed.demoContacts.whatsapp?sanitizeWhatsApp(parsed.demoContacts.whatsapp)||undefined:undefined,
      phone:parsed.demoContacts.phone?sanitizePhone(parsed.demoContacts.phone)||undefined:undefined,
      instagram:parsed.demoContacts.instagram?sanitizeInstagram(parsed.demoContacts.instagram)||undefined:undefined,
      website:parsed.demoContacts.website?sanitizeHttpsUrl(parsed.demoContacts.website,{allowEmpty:false})||undefined:undefined,
      booking:parsed.demoContacts.booking?sanitizeHttpsUrl(parsed.demoContacts.booking,{allowEmpty:false})||undefined:undefined,
    }:undefined,
    imageAsset:parsed.imageAsset?{
      src:parsed.imageAsset.src?sanitizeAssetReference(parsed.imageAsset.src)||undefined:undefined,
      fallbackSrc:parsed.imageAsset.fallbackSrc?sanitizeAssetReference(parsed.imageAsset.fallbackSrc)||undefined:undefined,
      sourcePage:parsed.imageAsset.sourcePage?sanitizeHttpsUrl(parsed.imageAsset.sourcePage,{allowEmpty:false})||undefined:undefined,
      author:cleanString(parsed.imageAsset.author,500),provider:cleanString(parsed.imageAsset.provider,500),license:cleanString(parsed.imageAsset.license,500),alt:cleanString(parsed.imageAsset.alt,1000),position:parsed.imageAsset.position?safeObjectPosition(parsed.imageAsset.position):undefined,illustrative:parsed.imageAsset.illustrative,notActualPlace:parsed.imageAsset.notActualPlace,
    }:undefined,
  };
  if(clean.verifiedAt&&!Number.isFinite(Date.parse(clean.verifiedAt)))throw new Error('Data de verificação inválida.');
  if(kind==='events'){if(!clean.startsAt||!clean.endsAt||!Number.isFinite(Date.parse(clean.startsAt))||!Number.isFinite(Date.parse(clean.endsAt))||Date.parse(clean.endsAt)<=Date.parse(clean.startsAt))throw new Error('Fim do evento deve ser posterior ao início.');}
  if(kind==='categories'&&clean.icon&&!(clean.icon in iconRegistry))throw new Error('Ícone inexistente no Icon System v2.');
  if(clean.synthetic!==false&&clean.demoContacts?.website){const parsedUrl=new URL(clean.demoContacts.website);if(parsedUrl.hostname!=='example.invalid')throw new Error('Contato sintético deve usar https://example.invalid.');}
  return clean;
}
