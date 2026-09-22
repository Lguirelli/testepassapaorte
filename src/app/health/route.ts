import {isVisualMode} from '@/core/app-mode';
import {sql} from 'drizzle-orm';
import {db} from '@/core/db';
export const dynamic='force-dynamic';
export async function GET(){
 if(isVisualMode())return Response.json({ok:true,mode:'visual',database:'not_used',persistence:false},{headers:{'Cache-Control':'no-store'}});
 try{await (await db()).execute(sql`select 1`);return Response.json({ok:true,database:process.env.DB_MODE==='pglite'?'pglite':'postgres'});}
 catch{return Response.json({ok:false,error:'database_unavailable'},{status:503});}
}
