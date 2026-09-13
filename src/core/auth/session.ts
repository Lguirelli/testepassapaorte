import {isVisualMode} from '@/core/app-mode';
import {createHash,createHmac,timingSafeEqual} from 'node:crypto';
import {cookies} from 'next/headers';
import {and,eq,gt,isNull} from 'drizzle-orm';
import {db} from '@/core/db';
import {authSessions,partnerUsers,travelerUsers,trips} from '@/core/db/schema';
import {sanitizeEmail,sanitizeId,sanitizePassword,trySanitizeId} from '@/core/security/sanitize';
import {authSubjectForEmail,preferredActorId} from './identity';
import type {Actor,Role} from './permissions';

const COOKIE='psn_session';
const MAX_AGE=60*60*12;
type Credential={email:string;password:string;role:Role;partnerId?:string};

function localAuthEnabled(){return process.env.NODE_ENV!=='production'&&process.env.ALLOW_INSECURE_LOCAL_AUTH==='true';}
function configured(name:string,fallback:string){const value=process.env[name];return value||(localAuthEnabled()?fallback:'');}
function credentials():Credential[]{
  const rows:Credential[]=[
    {email:configured('TOURIST_EMAIL','turista@passaporte.local'),password:configured('TOURIST_PASSWORD','turista-local'),role:'tourist'},
    {email:configured('PARTNER_EMAIL','parceiro@passaporte.local'),password:configured('PARTNER_PASSWORD','parceiro-local'),role:'partner',partnerId:process.env.PARTNER_ID||'partner-cafe-neblina'},
    {email:configured('ADMIN_EMAIL','admin@passaporte.local'),password:configured('ADMIN_PASSWORD','admin-local'),role:'admin'},
  ];
  const active=rows.filter(row=>row.email&&row.password);
  if(process.env.NODE_ENV==='production'){for(const row of active){if(row.email.endsWith('@passaporte.local')||/^(?:change-me|replace-with)/i.test(row.password)||['turista-local','parceiro-local','admin-local'].includes(row.password))throw new Error('Credenciais locais/de demonstração não são permitidas em produção.');}}
  return active;
}
function secret(){
  const value=process.env.SESSION_SECRET||(localAuthEnabled()?'local-development-session-secret-change-me-2026':'');
  if(!value||value.length<32)throw new Error('SESSION_SECRET deve possuir ao menos 32 caracteres.');
  if(process.env.NODE_ENV==='production'&&(/replace-with|change-me/i.test(value)||value==='local-development-session-secret-change-me-2026'))throw new Error('SESSION_SECRET de demonstração não é permitida em produção.');
  return value;
}
function digest(value:string){return createHash('sha256').update(value).digest();}
function equal(a:string,b:string){return timingSafeEqual(digest(a),digest(b));}
function sign(id:string,expires:number){const body=`${id}.${expires}`;return `${body}.${createHmac('sha256',secret()).update(body).digest('hex')}`;}
function verify(value:string|undefined){
  if(!value)return null;const parts=value.split('.');if(parts.length!==3)return null;
  const [id,expiresRaw,signature]=parts;const expires=Number(expiresRaw);if(!id||!Number.isFinite(expires)||expires<Date.now()||!/^[a-f0-9]{64}$/.test(signature))return null;
  const expected=createHmac('sha256',secret()).update(`${id}.${expires}`).digest('hex');
  if(!timingSafeEqual(Buffer.from(expected,'hex'),Buffer.from(signature,'hex')))return null;
  return{id,expires};
}

export async function authenticateCredentials(emailRaw:string,passwordRaw:string):Promise<Actor|null>{
  let email:string;let password:string;try{email=sanitizeEmail(emailRaw);password=sanitizePassword(passwordRaw);}catch{return null;}
  const credential=credentials().find(row=>row.email.toLowerCase()===email);if(!credential||!equal(password,credential.password))return null;
  const database=await db();const authSubject=authSubjectForEmail(email);
  if(credential.role==='tourist'){
    const preferredId=preferredActorId('tourist',authSubject);
    let [user]=await database.select().from(travelerUsers).where(eq(travelerUsers.authSubject,authSubject));
    if(!user)[user]=await database.select().from(travelerUsers).where(eq(travelerUsers.authSubject,email));
    if(!user)[user]=await database.select().from(travelerUsers).where(eq(travelerUsers.id,preferredId));
    const id=user?.id||preferredId;
    if(!trySanitizeId(id,'Viajante'))throw new Error('Identificador legado de viajante requer migração antes do login.');
    if(user)await database.update(travelerUsers).set({authSubject,status:'active'}).where(eq(travelerUsers.id,id));
    else await database.insert(travelerUsers).values({id,authSubject,displayName:'Viajante local'});
    await database.update(trips).set({owner:id}).where(eq(trips.owner,email));
    return{id,role:'tourist'};
  }
  if(credential.role==='partner'){
    const partnerId=sanitizeId(credential.partnerId!,'Parceiro');const preferredId=preferredActorId('partner',authSubject);
    let [user]=await database.select().from(partnerUsers).where(eq(partnerUsers.authSubject,authSubject));
    if(!user)[user]=await database.select().from(partnerUsers).where(eq(partnerUsers.authSubject,email));
    if(!user)[user]=await database.select().from(partnerUsers).where(eq(partnerUsers.id,preferredId));
    const id=user?.id||preferredId;
    if(!trySanitizeId(id,'Usuário parceiro'))throw new Error('Identificador legado de parceiro requer migração antes do login.');
    if(user)await database.update(partnerUsers).set({authSubject,partnerId,status:'active'}).where(eq(partnerUsers.id,id));
    else await database.insert(partnerUsers).values({id,partnerId,authSubject,role:'partner'});
    return{id,role:'partner',partnerId};
  }
  return{id:preferredActorId('admin',authSubject),role:'admin'};
}

export async function createSession(actor:Actor){
  const database=await db();const id=crypto.randomUUID();const expiresAt=new Date(Date.now()+MAX_AGE*1000);
  const travelerUserId=actor.role==='tourist'?actor.id:undefined;
  await database.insert(authSessions).values({id,authSubject:actor.id,role:actor.role,partnerId:actor.partnerId||null,travelerUserId:travelerUserId||null,expiresAt});
  const jar=await cookies();jar.set(COOKIE,sign(id,expiresAt.getTime()),{httpOnly:true,sameSite:'strict',secure:process.env.NODE_ENV==='production',path:'/',maxAge:MAX_AGE,priority:'high'});
}

export async function currentActor():Promise<Actor|null>{
  if(isVisualMode())return null;
  const parsed=verify((await cookies()).get(COOKIE)?.value);if(!parsed)return null;
  const database=await db();const [row]=await database.select().from(authSessions).where(and(eq(authSessions.id,parsed.id),gt(authSessions.expiresAt,new Date()),isNull(authSessions.revokedAt)));
  if(!row||!['tourist','partner','admin'].includes(row.role))return null;
  const actorId=trySanitizeId(row.authSubject,'Sessão');if(!actorId)return null;
  return{id:actorId,role:row.role as Role,partnerId:row.partnerId||undefined};
}

export async function requireActor(role?:Role){const actor=await currentActor();if(!actor||role&&actor.role!==role)throw new Error('Acesso não autorizado.');return actor;}
export async function endSession(){
  const jar=await cookies();const parsed=verify(jar.get(COOKIE)?.value);if(parsed){const database=await db();await database.update(authSessions).set({revokedAt:new Date()}).where(eq(authSessions.id,parsed.id));}
  jar.delete(COOKIE);
}
