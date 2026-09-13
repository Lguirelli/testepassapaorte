import {eq,or} from 'drizzle-orm';
import {db} from '../src/core/db';
import {
  alerts,audit,authSessions,contentVersions,partnerMaturityHistory,partnerRequests,partnerUsers,
  trackingEvents,travelerUsers,trips,
} from '../src/core/db/schema';
import {authSubjectForEmail,preferredActorId} from '../src/core/auth/identity';
import {redactForAudit,sanitizeEmail,sanitizeStructuredValue,sanitizeTrackingPayload,trySanitizeId} from '../src/core/security/sanitize';
import type {Role} from '../src/core/auth/permissions';

function configuredEmail(name:string,localFallback:string){
  const raw=process.env[name]||(process.env.NODE_ENV!=='production'?localFallback:'');
  return raw?sanitizeEmail(raw):null;
}
function structuredRecord(value:unknown){
  const clean=sanitizeStructuredValue(value);
  return clean&&typeof clean==='object'&&!Array.isArray(clean)?clean as Record<string,unknown>:{};
}
function redactedRecord(value:unknown){
  const clean=redactForAudit(value);
  return clean&&typeof clean==='object'&&!Array.isArray(clean)?clean as Record<string,unknown>:{};
}

type Principal={role:Role;email:string;subject:string;actorId:string};
const principalInputs:[Role,string|null][]=[
  ['tourist',configuredEmail('TOURIST_EMAIL','turista@passaporte.local')],
  ['partner',configuredEmail('PARTNER_EMAIL','parceiro@passaporte.local')],
  ['admin',configuredEmail('ADMIN_EMAIL','admin@passaporte.local')],
];
const principals:Principal[]=principalInputs.filter((row):row is [Role,string]=>Boolean(row[1])).map(([role,email])=>{
  const subject=authSubjectForEmail(email);return{role,email,subject,actorId:preferredActorId(role,subject)};
});
const database=await db();
let changed=0;

await database.transaction(async tx=>{
  for(const principal of principals){
    let actorId=principal.actorId;
    if(principal.role==='tourist'){
      const rows=await tx.select().from(travelerUsers).where(or(eq(travelerUsers.authSubject,principal.subject),eq(travelerUsers.authSubject,principal.email),eq(travelerUsers.id,principal.actorId)));
      if(rows.length>1)throw new Error(`Duplicidade de identidade de viajante detectada para ${principal.role}; revisão manual necessária.`);
      const row=rows[0];
      if(row){if(!trySanitizeId(row.id,'Viajante'))throw new Error('Identificador legado de viajante contém informação insegura; revisão manual necessária.');actorId=row.id;await tx.update(travelerUsers).set({authSubject:principal.subject,status:'active'}).where(eq(travelerUsers.id,row.id));changed++;}
      await tx.update(trips).set({owner:actorId}).where(or(eq(trips.owner,principal.email),eq(trips.owner,principal.subject)));changed++;
    }
    if(principal.role==='partner'){
      const rows=await tx.select().from(partnerUsers).where(or(eq(partnerUsers.authSubject,principal.subject),eq(partnerUsers.authSubject,principal.email),eq(partnerUsers.id,principal.actorId)));
      if(rows.length>1)throw new Error(`Duplicidade de identidade de parceiro detectada; revisão manual necessária.`);
      const row=rows[0];
      if(row){if(!trySanitizeId(row.id,'Usuário parceiro'))throw new Error('Identificador legado de parceiro contém informação insegura; revisão manual necessária.');actorId=row.id;await tx.update(partnerUsers).set({authSubject:principal.subject,status:'active'}).where(eq(partnerUsers.id,row.id));changed++;}
    }
    const legacy=or(eq(authSessions.authSubject,principal.email),eq(authSessions.authSubject,principal.subject));
    await tx.update(authSessions).set({authSubject:actorId,revokedAt:new Date()}).where(legacy);changed++;
    await tx.update(contentVersions).set({actor:actorId}).where(or(eq(contentVersions.actor,principal.email),eq(contentVersions.actor,principal.subject)));changed++;
    await tx.update(partnerRequests).set({requesterId:actorId}).where(or(eq(partnerRequests.requesterId,principal.email),eq(partnerRequests.requesterId,principal.subject)));changed++;
    await tx.update(partnerRequests).set({reviewedBy:actorId}).where(or(eq(partnerRequests.reviewedBy,principal.email),eq(partnerRequests.reviewedBy,principal.subject)));changed++;
    await tx.update(audit).set({actor:actorId}).where(or(eq(audit.actor,principal.email),eq(audit.actor,principal.subject)));changed++;
  }

  for(const row of await tx.select().from(audit)){
    await tx.update(audit).set({before:row.before===null?null:redactForAudit(row.before),after:row.after===null?null:redactForAudit(row.after)}).where(eq(audit.id,row.id));
  }
  for(const row of await tx.select().from(trackingEvents))await tx.update(trackingEvents).set({payload:sanitizeTrackingPayload(row.payload)}).where(eq(trackingEvents.id,row.id));
  for(const row of await tx.select().from(partnerRequests))await tx.update(partnerRequests).set({requestedChanges:redactedRecord(row.requestedChanges)}).where(eq(partnerRequests.id,row.id));
  for(const row of await tx.select().from(alerts))if(row.metadata!==null)await tx.update(alerts).set({metadata:redactedRecord(row.metadata)}).where(eq(alerts.id,row.id));
  for(const row of await tx.select().from(partnerMaturityHistory))if(row.reason){const safe=redactForAudit(row.reason);await tx.update(partnerMaturityHistory).set({reason:typeof safe==='string'?safe:null}).where(eq(partnerMaturityHistory.id,row.id));}
  for(const row of await tx.select().from(contentVersions))await tx.update(contentVersions).set({payload:structuredRecord(row.payload) as typeof row.payload}).where(eq(contentVersions.id,row.id));
});

console.log(JSON.stringify({status:'ok',roles:principals.map(({role})=>role),operations:changed,note:'Sessões legadas identificadas foram revogadas; novo login cria sessão pseudonimizada.'}));
