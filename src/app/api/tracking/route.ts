import {isVisualMode} from '@/core/app-mode';
import {cookies} from 'next/headers';
import {eq} from 'drizzle-orm';
import {z} from 'zod';
import {db} from '@/core/db';
import {anonymousVisitors,sessions,trackingEvents} from '@/core/db/schema';
import {assertSameOrigin,readJsonBody,sanitizeTrackingPayload} from '@/core/security/sanitize';
import {events} from '@/modules/tracking/service';

const schema=z.object({event:z.enum(events),payload:z.record(z.string(),z.unknown()).default({})}).strict();
const uuid=z.string().uuid();
function analyticsCookieMaxAge(){const days=Number(process.env.ANALYTICS_COOKIE_DAYS||180);const safe=Number.isFinite(days)?Math.min(365,Math.max(1,Math.trunc(days))):180;return safe*24*60*60;}

export async function POST(req:Request){
  if(isVisualMode())return new Response(null,{status:204,headers:{'Cache-Control':'no-store'}});
  try{assertSameOrigin(req);}catch{return Response.json({error:'Requisição inválida'},{status:400});}
  const jar=await cookies();if(jar.get('psn_analytics')?.value!=='granted')return new Response(null,{status:204,headers:{'Cache-Control':'no-store'}});
  try{
    const data=schema.parse(await readJsonBody(req));const payload=sanitizeTrackingPayload(data.payload);const database=await db();
    let visitorId=uuid.safeParse(jar.get('psn_anon')?.value).data;
    if(!visitorId){visitorId=crypto.randomUUID();await database.insert(anonymousVisitors).values({id:visitorId});jar.set('psn_anon',visitorId,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:analyticsCookieMaxAge(),priority:'medium'});}
    else await database.update(anonymousVisitors).set({lastSeenAt:new Date()}).where(eq(anonymousVisitors.id,visitorId));
    let sessionId=uuid.safeParse(jar.get('psn_tracking_session')?.value).data;
    if(!sessionId){sessionId=crypto.randomUUID();await database.insert(sessions).values({id:sessionId,anonymousVisitorId:visitorId});jar.set('psn_tracking_session',sessionId,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:60*30,priority:'medium'});}
    await database.insert(trackingEvents).values({id:crypto.randomUUID(),event:data.event,payload,anonymousVisitorId:visitorId,sessionId,synthetic:false});
    return Response.json({ok:true},{headers:{'Cache-Control':'no-store'}});
  }catch{return Response.json({error:'Evento inválido'},{status:400});}
}
