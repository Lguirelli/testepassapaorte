import {asc,and,eq} from 'drizzle-orm';
import {z} from 'zod';
import {db} from '@/core/db';
import {pageSections,sectionDefinitions} from '@/core/db/schema';
import {sanitizeStructuredValue,sanitizeText} from '@/core/security/sanitize';

const genericContent=z.record(z.string(),z.unknown());
export const sectionRegistry={
  HomeHero:genericContent,
  HomeDiscovery:genericContent,
  CircularGallery:genericContent,
  RouteCallout:genericContent,
  RouteTypes:genericContent,
  RouteCards:genericContent,
  ContextualDiscovery:genericContent,
  InterestGrid:genericContent,
  FaqAccordion:genericContent,
  PassportIntro:genericContent,
  TerritorialMap:genericContent,
  FinalCta:genericContent,
} as const;
export type SectionComponentKey=keyof typeof sectionRegistry;
export type RuntimeSection={id:string;componentKey:SectionComponentKey;sortOrder:number;variant?:string|null;theme?:string|null;content:Record<string,unknown>;dataSource?:string|null};

export async function loadPageSections(pageScope:string):Promise<RuntimeSection[]>{
 pageScope=sanitizeText(pageScope,128,{multiline:false});if(!pageScope)throw new Error('Escopo de página inválido.');
 const database=await db();
 const rows=await database.select({id:pageSections.id,componentKey:sectionDefinitions.componentKey,sortOrder:pageSections.sortOrder,variant:pageSections.variant,theme:pageSections.theme,content:pageSections.content,dataSource:pageSections.dataSource})
  .from(pageSections).innerJoin(sectionDefinitions,eq(pageSections.sectionDefinitionId,sectionDefinitions.id))
  .where(and(eq(pageSections.pageScope,pageScope),eq(pageSections.status,'published'),eq(sectionDefinitions.status,'published'),eq(sectionDefinitions.enabled,true)))
  .orderBy(asc(pageSections.sortOrder));
 return rows.map(row=>{
  if(!(row.componentKey in sectionRegistry))throw new Error(`Section Registry: componente não registrado: ${row.componentKey}`);
  const componentKey=row.componentKey as SectionComponentKey;
  const parsed=sectionRegistry[componentKey].parse(row.content);const safe=sanitizeStructuredValue(parsed);const content=safe&&typeof safe==='object'&&!Array.isArray(safe)?safe as Record<string,unknown>:{};
  return{...row,componentKey,content};
 });
}
