import {and,isNotNull,lt,or} from 'drizzle-orm';
import {db} from '../src/core/db';
import {anonymousVisitors,audit,authSessions,consentRecords,sessions,trackingEvents} from '../src/core/db/schema';

function retentionDays(name:string,fallback:number,max:number){
  const raw=Number(process.env[name]||fallback);
  if(!Number.isFinite(raw))return fallback;
  return Math.min(max,Math.max(1,Math.trunc(raw)));
}
function cutoff(days:number){return new Date(Date.now()-days*24*60*60*1000);}

const analyticsDays=retentionDays('ANALYTICS_RETENTION_DAYS',180,730);
const consentDays=retentionDays('CONSENT_RETENTION_DAYS',730,3650);
const authDays=retentionDays('AUTH_SESSION_RETENTION_DAYS',30,365);
const auditDays=retentionDays('AUDIT_RETENTION_DAYS',730,3650);
const database=await db();

await database.transaction(async tx=>{
  await tx.delete(trackingEvents).where(lt(trackingEvents.at,cutoff(analyticsDays)));
  await tx.delete(sessions).where(lt(sessions.startedAt,cutoff(analyticsDays)));
  await tx.delete(anonymousVisitors).where(lt(anonymousVisitors.lastSeenAt,cutoff(analyticsDays)));
  await tx.delete(consentRecords).where(lt(consentRecords.recordedAt,cutoff(consentDays)));
  await tx.delete(authSessions).where(or(lt(authSessions.expiresAt,cutoff(authDays)),and(isNotNull(authSessions.revokedAt),lt(authSessions.revokedAt,cutoff(authDays)))));
  await tx.delete(audit).where(lt(audit.at,cutoff(auditDays)));
});

console.log(JSON.stringify({status:'ok',retentionDays:{analytics:analyticsDays,consent:consentDays,authSessions:authDays,audit:auditDays}}));
