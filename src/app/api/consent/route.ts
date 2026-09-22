import {isVisualMode} from '@/core/app-mode';
import {cookies} from 'next/headers';
import {z} from 'zod';
import {db} from '@/core/db';
import {anonymousVisitors,consentRecords} from '@/core/db/schema';
import {assertSameOrigin,readJsonBody} from '@/core/security/sanitize';

const schema=z.object({status:z.enum(['granted','denied'])}).strict();
const uuid=z.string().uuid();
const POLICY_VERSION='2026-09-12';
function cookieMaxAge(){const days=Number(process.env.ANALYTICS_COOKIE_DAYS||180);const safe=Number.isFinite(days)?Math.min(365,Math.max(1,Math.trunc(days))):180;return safe*24*60*60;}

export async function POST(req:Request){
  if(isVisualMode())return new Response(null,{status:204,headers:{'Cache-Control':'no-store'}});
  try{
    assertSameOrigin(req);
    const {status}=schema.parse(await readJsonBody(req));
    const jar=await cookies();
    const existingVisitorId=uuid.safeParse(jar.get('psn_anon')?.value).data;
    const database=await db();
    let visitorId=existingVisitorId;

    if(status==='granted'){
      if(!visitorId){visitorId=crypto.randomUUID();await database.insert(anonymousVisitors).values({id:visitorId});}
      jar.set('psn_anon',visitorId,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:cookieMaxAge(),priority:'medium'});
    }

    await database.insert(consentRecords).values({id:crypto.randomUUID(),anonymousVisitorId:(existingVisitorId||status==='granted')?(visitorId||null):null,purpose:'analytics_optional',status,policyVersion:POLICY_VERSION});
    jar.set('psn_analytics',status,{httpOnly:false,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:cookieMaxAge(),priority:'medium'});

    if(status==='denied'){
      jar.delete('psn_anon');
      jar.delete('psn_tracking_session');
    }
    return Response.json({ok:true},{headers:{'Cache-Control':'no-store'}});
  }catch{
    return Response.json({error:'Preferência inválida'},{status:400,headers:{'Cache-Control':'no-store'}});
  }
}
