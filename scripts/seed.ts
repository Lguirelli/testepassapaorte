import seed from '../seed/validation-content.json';
import trip from '../seed/validation-trip.json';
import { db } from '../src/core/db';
import {content,trips, type ContentData} from '../src/core/db/schema';
const database=await db();
await database.transaction(async tx=>{
 for(const kind of ['places','partners','experiences','events','categories','sources'] as const){
  for(const raw of seed[kind]){
   const rawData=raw as ContentData;
   const d:ContentData={...rawData,synthetic:rawData.synthetic??true,cityId:seed.city.id};
   if(kind==='partners'){const place=seed.places.find(p=>p.id===d.placeId);d.name=place?.name;d.slug=place?.slug;}
   if(kind==='sources'){d.name=d.sourceName;}
   await tx.insert(content).values({id:d.id,kind,slug:d.slug||d.id,draft:d,published:d,status:'published',synthetic:d.synthetic!==false}).onConflictDoNothing();
  }
 }
 await tx.insert(trips).values({id:trip.trip.id,owner:'demo-tourist',data:trip}).onConflictDoNothing();
});
console.log('Synthetic seed applied idempotently; existing content preserved.');process.exit(0);
