import {spawn} from 'node:child_process';
import {resolve} from 'node:path';

const env={
  ...process.env,
  DB_MODE:'pglite',
  PGLITE_PATH:resolve(process.env.PGLITE_PATH||'.data/e2e'),
  NEXT_PUBLIC_SITE_URL:'http://localhost:4173',
  SESSION_SECRET:process.env.SESSION_SECRET||'e2e-session-secret-with-at-least-thirty-two-characters',
  IDENTITY_PEPPER:process.env.IDENTITY_PEPPER||'e2e-identity-pepper-with-at-least-thirty-two-characters',
  TOURIST_EMAIL:process.env.TOURIST_EMAIL||'turista@passaporte.local',
  TOURIST_PASSWORD:process.env.TOURIST_PASSWORD||'turista-local',
  PARTNER_EMAIL:process.env.PARTNER_EMAIL||'parceiro@passaporte.local',
  PARTNER_PASSWORD:process.env.PARTNER_PASSWORD||'parceiro-local',
  PARTNER_ID:process.env.PARTNER_ID||'partner-cafe-neblina',
  ADMIN_EMAIL:process.env.ADMIN_EMAIL||'admin@passaporte.local',
  ADMIN_PASSWORD:process.env.ADMIN_PASSWORD||'admin-local',
};

const script=process.env.E2E_SKIP_PREP==='1'?'scripts/dev.mjs':'scripts/local.mjs';
console.log(`[e2e-server] starting ${script} on http://localhost:4173`);
const child=spawn(process.execPath,[script],{stdio:'inherit',env});
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>child.kill(signal));
child.on('exit',code=>process.exit(code??1));
