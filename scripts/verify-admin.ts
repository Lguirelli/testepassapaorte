import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';
import {drizzle} from 'drizzle-orm/pglite';
import {eq} from 'drizzle-orm';
import * as schema from '../src/core/db/schema';
import {commitContent} from '../src/modules/admin/service';
import {fields,fieldValue} from '../src/modules/admin/fields';
import {kinds,visibleDataset,type Kind,type Dataset} from '../src/modules/content/repository';
import fixture from '../seed/validation-content.json';
const client=new PGlite();const database=drizzle(client,{schema});
const actor={id:'admin-integration-demo'};
let checks=0;function pass(message:string){checks++;console.log(`PASS ${checks}: ${message}`);}
function formFor(kind:Kind,data:schema.ContentData){const form=new FormData();for(const field of fields[kind]){const value=fieldValue(data,field.key);if(Array.isArray(value))for(const item of value)form.append(field.key,String(item));else if(value!==undefined&&value!==null)form.set(field.key,String(value));}return form;}
async function row(id:string){return(await database.select().from(schema.content).where(eq(schema.content.id,id)))[0];}
async function act(kind:Kind,id:string,operation:string,data?:schema.ContentData,extra?:FormData){const current=await row(id);await commitContent(kind,operation,id,current?.version||0,extra||formFor(kind,data||current.draft),actor,database);return row(id);}
async function snapshot(){const rows=await database.select().from(schema.content);return Object.fromEntries(kinds.map(kind=>[kind,rows.filter(r=>r.kind===kind&&r.status!=='archived'&&r.published).map(r=>r.published)])) as Dataset;}
try{
 await client.exec(await readFile('drizzle/0000_validation.sql','utf8'));
 for(const kind of kinds)for(const raw of fixture[kind]){const data:schema.ContentData={...raw,synthetic:true};if(kind==='partners'){const place=fixture.places.find(p=>p.id===data.placeId);data.name=place?.name;data.slug=place?.slug;}if(kind==='sources')data.name=data.sourceName;await database.insert(schema.content).values({id:data.id,kind,slug:data.slug||data.id,draft:data,published:data,status:'published'});}
 // Real service/transactions, same as server action after authorization.
 for(const kind of ['sources','categories','places','experiences','events','partners'] as Kind[]){
  const raw=(fixture[kind][0]) as schema.ContentData;const id=`integration-${kind}`;
  const data={...raw,id,slug:`integration-${kind}`,name:`Demo ${kind}`,sourceName:kind==='sources'?'Fonte teste':raw.sourceName};
  if(kind==='partners')data.placeId='integration-places';
  if(kind==='places'){data.commercialRelation='partner';data.placeType='business';}
  let current=await act(kind,id,'draft',data);assert.equal(current.published,null);
  current=await act(kind,id,'publish');assert.equal(current.status,'published');const published=structuredClone(current.published);
  current=await act(kind,id,'draft',{...current.draft,notes:'revised',shortDescription:'Descrição revisada de demonstração.',name:`Editado ${kind}`,sourceName:kind==='sources'?'Fonte editada':current.draft.sourceName});assert.deepEqual(current.published,published);
  const auditBefore=(await database.select().from(schema.audit)).length;
  await assert.rejects(commitContent(kind,'publish',id,current.version-1,new FormData(),actor,database),/Outra edição/);assert.equal((await database.select().from(schema.audit)).length,auditBefore);
  const editAudit=(await database.select().from(schema.audit).where(eq(schema.audit.entity,id))).find(a=>a.action==='draft'&&(a.after as {version:number}).version===current.version)!;
  await act(kind,id,'publish');await act(kind,id,'review');await act(kind,id,'archive');assert.equal((await row(id)).status,'archived');assert.ok(!(await snapshot())[kind].some(d=>d.id===id));
  const restore=new FormData();restore.set('restoreId',editAudit.id);current=await act(kind,id,'restore',undefined,restore);assert.equal(current.status,'archived');assert.ok(!(await snapshot())[kind].some(d=>d.id===id));await act(kind,id,'publish');
  pass(`${kind}: create, draft isolation, publish, stale-version rollback, review, archive, restore and republish`);
 }
 const before=await snapshot();assert.ok(visibleDataset(before).places.some(p=>p.id==='integration-places'));
 await act('partners','integration-partners','archive');let data=visibleDataset(await snapshot());assert.ok(!data.places.some(p=>p.id==='integration-places'));assert.ok((await snapshot()).places.some(p=>p.id==='integration-places'));await act('partners','integration-partners','publish');assert.ok(visibleDataset(await snapshot()).places.some(p=>p.id==='integration-places'));pass('archived partner removed from discovery; editorial place preserved; republish recovers visibility');
 const cafe='place-cafe-neblina';await act('places',cafe,'archive');data=visibleDataset(await snapshot());assert.ok(!data.partners.some(p=>p.placeId===cafe));assert.ok(!data.experiences.some(p=>p.placeId===cafe));assert.ok(!data.events.some(p=>p.placeId===cafe));pass('archived place hides dependent public content');
 const category=await row('cat-natureza');await act('categories',category.id,'draft',{...category.draft,enabled:false});assert.ok(visibleDataset(await snapshot()).categories.some(c=>c.id===category.id));await act('categories',category.id,'publish');data=visibleDataset(await snapshot());assert.ok(!data.categories.some(c=>c.id===category.id));assert.ok(data.places.every(p=>!p.categoryIds?.includes(category.id)));pass('disabled category only disappears after publish, including references');
 const order=await row('cat-bem-estar');await act('categories',order.id,'draft',{...order.draft,sortOrder:0});await act('categories',order.id,'publish');assert.equal(visibleDataset(await snapshot()).categories[0].id,order.id);assert.equal((await row(order.id)).draft.icon,'perfil-relaxar');pass('published editorial category order is respected');
 const source=await row('source-synthetic');await act('sources',source.id,'archive');const p=await row('place-jardim-nascentes');const count=(await database.select().from(schema.audit)).length;await assert.rejects(act('places',p.id,'publish'),/Relacionamento indisponível/);assert.equal((await row(p.id)).version,p.version);assert.equal((await database.select().from(schema.audit)).length,count);pass('unavailable relation rejects transaction without version or audit changes');
 console.log(`COMPLETE: ${checks} integration scenarios passed; in-memory PGlite, no production DB, no browser or authorization claims.`);
}finally{await client.close();}
