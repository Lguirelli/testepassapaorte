import {existsSync,readFileSync,readdirSync,statSync} from 'node:fs';
import {basename,dirname,extname,join,relative,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
process.chdir(root);
const failures=[];const checks=[];
const binary=new Set(['.png','.jpg','.jpeg','.webp','.gif','.ico','.woff','.woff2','.zip','.psd','.pdf','.mp4','.mov','.avif']);
const ignoredDirs=new Set(['node_modules','.next','.git','.data','coverage','playwright-report','test-results','artifacts']);
const textFiles=[];
function walk(dir){for(const name of readdirSync(dir)){if(ignoredDirs.has(name))continue;const path=join(dir,name);const stat=statSync(path);if(stat.isDirectory()){walk(path);continue;}if(binary.has(extname(path).toLowerCase()))continue;textFiles.push(path);}}
walk(root);
const pass=(name,detail)=>checks.push({name,status:'PASS',detail});
const fail=(name,detail)=>{checks.push({name,status:'FAIL',detail});failures.push(`${name}: ${detail}`)};
const combined=textFiles.map(path=>({path:relative(root,path),text:readFileSync(path,'utf8')}));

const forbidden=[
  ['container-path',/(?:\/mnt\/data\/|sandbox:\/)/i],
  ['chat-file-id',/\bfile_0{4,}[A-Za-z0-9]+\b/],
  ['tool-ref',/\bturn\d+(?:file|search|fetch|view|news|product|business)\d+\b/],
  ['dangerous-html',/dangerouslySetInnerHTML|\.innerHTML\s*=|document\.write\s*\(/],
  ['javascript-url',/(?:href|src)\s*[=:]\s*[`'\"]\s*javascript:/i],
  ['embedded-private-key',/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
];
const trustedStaticHtmlFiles=new Set(['src/components/reference-pages/ReferenceSurface.tsx','src/components/dashboards/dashboard-runtime.ts']);for(const [kind,pattern] of forbidden){const hits=combined.filter(({path,text})=>{if(path.endsWith('scripts/audit-sanitization.mjs'))return false;if(kind==='dangerous-html'){if(!path.startsWith('src/'))return false;if(trustedStaticHtmlFiles.has(path)&&text.startsWith('// TRUSTED_STATIC_HTML:'))return false;}return pattern.test(text);});if(hits.length)fail(kind,hits.map(h=>h.path).slice(0,10).join(', '));else pass(kind,kind==='dangerous-html'?'ausente fora das fronteiras estáticas revisadas':'ausente');}

const apiFiles=combined.filter(({path})=>path.startsWith('src/app/api/')&&path.endsWith('route.ts'));
for(const {path,text} of apiFiles){if(/req\.json\s*\(/.test(text))fail(`bounded-json:${path}`,'usa req.json() diretamente; prefira readJsonBody com limite');else pass(`bounded-json:${path}`,'body limitado/validado');}

const actionFiles=combined.filter(({path,text})=>path.startsWith('src/')&&/['\"]use server['\"]/.test(text));
for(const {path,text} of actionFiles){if(/error\s+instanceof\s+Error\s*\?\s*error\.message/.test(text))fail(`public-error:${path}`,'expõe error.message diretamente');else pass(`public-error:${path}`,'erros públicos filtrados ou não expostos');}

const realSeed='seed/tourism-real.json';
if(existsSync(realSeed)){
  const seed=JSON.parse(readFileSync(realSeed,'utf8'));
  const raw=JSON.stringify(seed);
  const forbiddenContactKeys=/"(?:email|phone|whatsapp|password|token|secret)"\s*:/i;
  if(forbiddenContactKeys.test(raw))fail('real-seed-contacts','seed turístico real contém contato/segredo não necessário');else pass('real-seed-contacts','seed real sem contatos pessoais/segredos');
  if(seed.places?.every(p=>p.synthetic!==true&&p.discoveryVisible===true))pass('real-seed-flags','registros reais explicitamente não sintéticos');else fail('real-seed-flags','flags de real/demo inconsistentes');
}

const demoSeed='seed/validation-content.json';
if(existsSync(demoSeed)){
  const seed=JSON.parse(readFileSync(demoSeed,'utf8'));
  const websites=(seed.partners||[]).flatMap(p=>Object.values(p.demoContacts||{})).filter(v=>typeof v==='string'&&v.startsWith('https://'));
  if(websites.every(v=>new URL(v).hostname==='example.invalid'))pass('demo-links','links demo usam domínio reservado');else fail('demo-links','link demo aponta para domínio potencialmente real');
  if(seed.meta?.synthetic===true)pass('demo-flags','dataset de validação marcado como sintético');else fail('demo-flags','dataset demo sem marcação sintética');
}

const sanitizeSource=readFileSync('src/core/security/sanitize.ts','utf8');
for(const fn of ['sanitizeText','sanitizeId','sanitizeHttpsUrl','sanitizeNarrative','sanitizeStructuredValue','redactForAudit','sanitizeTrackingPayload','readJsonBody','publicErrorMessage']){
  if(sanitizeSource.includes(`function ${fn}`)||sanitizeSource.includes(`const ${fn}=`))pass(`sanitizer:${fn}`,'presente');else fail(`sanitizer:${fn}`,'ausente');
}

const tracking=readFileSync('src/modules/tracking/service.ts','utf8');
if(/travelerUserId:null/.test(tracking))pass('analytics-deidentification','analytics de produto não anexa identidade do turista');else fail('analytics-deidentification','analytics pode anexar identidade do turista');

const consent=readFileSync('src/app/api/consent/route.ts','utf8');
if(/status==='denied'[\s\S]*jar\.delete\('psn_anon'\)/.test(consent))pass('consent-denied','negação remove identificador de analytics do navegador');else fail('consent-denied','negação mantém identificador persistente sem necessidade');



const auth=readFileSync('src/core/auth/session.ts','utf8');
const identity=readFileSync('src/core/auth/identity.ts','utf8');
if(/createHmac\('sha256',identityPepper\(\)\)/.test(identity)&&/IDENTITY_PEPPER/.test(identity))pass('identity-pseudonymization','HMAC com pepper separado');else fail('identity-pseudonymization','identidade não usa HMAC com pepper explícito');
if(/partner-user-/.test(identity)&&/traveler-/.test(identity)&&/preferredActorId/.test(auth))pass('identity-derived-ids','IDs operacionais derivados do subject pseudônimo');else fail('identity-derived-ids','IDs operacionais podem derivar diretamente de e-mail');
if(existsSync('scripts/sanitize-existing-data.ts'))pass('legacy-data-sanitization','migração idempotente de dados legados presente');else fail('legacy-data-sanitization','migração de dados legados ausente');

const envExample=readFileSync('.env.example','utf8');
if(/IDENTITY_PEPPER=/.test(envExample))pass('env:identity-pepper','documentado');else fail('env:identity-pepper','não documentado');
if(/TERRITORIAL_FLOW_MIN_COUNT=([3-9]|[1-9]\d+)/.test(envExample))pass('aggregation-threshold','limiar padrão >= 3');else fail('aggregation-threshold','limiar de agregação abaixo de 3 ou ausente');


for(const privateLayout of ['src/app/admin/layout.tsx','src/app/painel-parceiro/layout.tsx']){
  const source=readFileSync(privateLayout,'utf8');
  if(/export const dynamic=['"]force-dynamic['"]/.test(source))pass(`private-dynamic:${privateLayout}`,'renderização privada explicitamente dinâmica');else fail(`private-dynamic:${privateLayout}`,'layout privado sem force-dynamic explícito');
}
const legacySanitizer=readFileSync('scripts/sanitize-existing-data.ts','utf8');
if(/principals\.map\(\(\{role\}\)=>role\)/.test(legacySanitizer)&&!/principals\.map\(\(\{role,actorId\}\)/.test(legacySanitizer))pass('legacy-sanitization-log','log não expõe IDs pseudônimos individuais');else fail('legacy-sanitization-log','script de saneamento pode imprimir IDs individuais');

if(existsSync('src/components/PrivacyPreferences.tsx'))pass('consent-management','preferência pode ser revista na interface');else fail('consent-management','sem interface para rever consentimento');
if(existsSync('scripts/privacy-maintenance.ts'))pass('retention-maintenance','rotina de retenção presente');else fail('retention-maintenance','rotina de retenção ausente');

const report={at:new Date().toISOString(),status:failures.length?'FAIL':'PASS',checks,failures};
console.log(JSON.stringify(report,null,2));
process.exitCode=failures.length?1:0;
