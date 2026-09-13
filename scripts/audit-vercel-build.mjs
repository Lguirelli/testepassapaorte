import fs from 'node:fs';

const read=(p)=>fs.readFileSync(p,'utf8');
const pkg=JSON.parse(read('package.json'));
const partner=read('src/modules/partners/service.ts');
const trips=read('src/modules/trips/persistence.ts');
const onboarding=read('src/modules/trips/Onboarding.tsx');
const og=read('src/app/opengraph-image.tsx');
const origin=read('src/core/security/origin.ts');
const failures=[];
const check=(name,ok,detail)=>{if(!ok)failures.push({name,detail});};

check('node-engine',pkg.engines?.node==='22.x',`esperado 22.x; atual ${pkg.engines?.node}`);
check('drizzle-returning-partner',!partner.includes('.returning({'),'Drizzle 0.45.2 nesta base usa returning() sem seleção neste fluxo');
check('drizzle-returning-trips',!trips.includes('.returning({'),'Drizzle 0.45.2 nesta base usa returning() sem seleção neste fluxo');
check('onboarding-no-never-cast',!onboarding.includes('as never'),'Onboarding não pode depender de coerção never');
check('onboarding-explicit-unions',onboarding.includes("type Intention=Profile['intentions'][number]")&&onboarding.includes("type Need=Profile['needs'][number]"),'tipos de opções precisam vir de Profile');
check('opengraph-node-runtime',!og.includes("runtime='edge'")&&og.includes("runtime='nodejs'"),'Edge runtime está deprecated no Next 16.3.4');
check('opengraph-flex-layout',og.includes("<div style={{display:'flex',flexDirection:'column'}}><div style={{fontSize:78"),'next/og exige display explícito em divs com múltiplos filhos');
check('vercel-origin-fallback',origin.includes('VERCEL_PROJECT_PRODUCTION_URL')&&origin.includes('VERCEL_URL'),'origem deve reconhecer URL de sistema da Vercel');

const report={at:new Date().toISOString(),status:failures.length?'FAIL':'PASS',checks:8,failures};
console.log(JSON.stringify(report,null,2));
process.exit(failures.length?1:0);
