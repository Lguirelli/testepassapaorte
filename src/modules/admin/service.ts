import {eq,and} from 'drizzle-orm';
import {db} from '@/core/db';
import {content,audit,type ContentData} from '@/core/db/schema';
import {formDataToContent} from './fields';
import {validateContent} from './validation';
import type {Kind} from '@/modules/content/repository';
// Internal service: caller must authorize before invoking. Not a server action.
export async function commitContent(kind:Kind,operation:string,id:string,version:number,form:FormData,actor:{id:string},providedDatabase?:Awaited<ReturnType<typeof db>>){
const database=providedDatabase??await db();await database.transaction(async tx=>{
const [row]=await tx.select().from(content).where(and(eq(content.id,id),eq(content.kind,kind)));
if(row&&row.version!==version)throw new Error('Outra edição foi salva. Atualize antes de continuar.');if(!row&&operation!=='draft')throw new Error('Salve o rascunho antes.');
let draft:ContentData=row?.draft||{id,synthetic:true,cityId:'city-demo-serra-negra'};
if(operation==='draft')draft=validateContent(kind,formDataToContent(kind,form,draft));
if(operation==='restore'){const [entry]=await tx.select().from(audit).where(and(eq(audit.id,String(form.get('restoreId'))),eq(audit.entity,id)));const restored=entry?.after as {draft?:ContentData}|null;if(!restored?.draft)throw new Error('Versão indisponível.');draft=validateContent(kind,restored.draft);}
if(operation==='publish')draft=validateContent(kind,draft);
if(['draft','publish','restore'].includes(operation)){
for(const [relation,ids] of [['places',draft.placeId?[draft.placeId]:[]],['categories',draft.categoryIds||[]],['sources',draft.sourceIds||[]]] as [string,string[]][]){for(const ref of ids){const [linked]=await tx.select().from(content).where(and(eq(content.id,ref),eq(content.kind,relation)));if(!linked||linked.status==='archived'||(operation==='publish'&&!linked.published))throw new Error(`Relacionamento indisponível: ${ref}`);}}
if(kind==='partners'&&draft.placeId){const [linked]=await tx.select().from(content).where(eq(content.id,draft.placeId));draft.name=linked?.draft.name;draft.slug=linked?.draft.slug;}
}
const values={id,kind,slug:draft.slug||id,draft,status:operation==='publish'?'published':operation==='archive'||row?.status==='archived'?'archived':operation==='review'?'needs_review':'draft',published:operation==='publish'?draft:row?.published||null,version:(row?.version||0)+1,synthetic:true};
if(row){const updated=await tx.update(content).set(values).where(and(eq(content.id,id),eq(content.version,version))).returning();if(!updated.length)throw new Error('Conflito de versão. Atualize a página.');}else await tx.insert(content).values(values);
await tx.insert(audit).values({id:crypto.randomUUID(),actor:actor.id,action:operation,entity:id,before:row||null,after:values});
});
}
