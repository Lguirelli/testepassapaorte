export function aggregatePrivacyMinCount(){
  const raw=Number(process.env.TERRITORIAL_FLOW_MIN_COUNT||3);
  return Number.isFinite(raw)?Math.max(3,Math.min(1000,Math.trunc(raw))):3;
}

export function retentionDays(name:'ANALYTICS_RETENTION_DAYS'|'CONSENT_RETENTION_DAYS'|'AUTH_SESSION_RETENTION_DAYS'|'AUDIT_RETENTION_DAYS',fallback:number,max:number){
  const raw=Number(process.env[name]||fallback);
  return Number.isFinite(raw)?Math.max(1,Math.min(max,Math.trunc(raw))):fallback;
}
