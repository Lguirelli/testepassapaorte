import {db} from '@/core/db';
import {sql} from 'drizzle-orm';
import {assertDemo} from '@/providers';
export const dynamic='force-dynamic';
export async function GET(){try{assertDemo();await (await db()).execute(sql`select 1`);return Response.json({ok:true,demo:true,database:process.env.DB_MODE||'postgres',postgis:process.env.DB_MODE==='pglite'?'unavailable':'configured'});}catch{return Response.json({ok:false,error:'Validation database unavailable'},{status:503});}}
