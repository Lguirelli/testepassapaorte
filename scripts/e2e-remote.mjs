import {spawn} from 'node:child_process';

const args=process.argv.slice(2);
const full=args.includes('--full')||process.env.E2E_FULL==='1';
const raw=args.find(value=>!value.startsWith('--'))||process.env.BASE_URL;
if(!raw){
  console.error('Uso: npm run test:e2e:remote -- https://seu-deploy.vercel.app [--full]');
  process.exit(2);
}
let url;
try{url=new URL(raw);}catch{console.error('BASE_URL inválida.');process.exit(2);}
if(!['http:','https:'].includes(url.protocol)){console.error('BASE_URL deve usar http/https.');process.exit(2);}
if(process.env.CI&&url.protocol!=='https:'){console.error('Em CI, use uma URL HTTPS.');process.exit(2);}

const executable=process.platform==='win32'?'npx.cmd':'npx';
const testArgs=['playwright','test'];
if(!full)testArgs.push('tests/e2e/00-public.spec.ts','tests/e2e/05-responsive.spec.ts','tests/e2e/06-interactions.spec.ts');
console.log(full?'Playwright remoto: suíte completa.':'Playwright remoto: suíte pública/visual. Use --full para incluir autenticação.');
const child=spawn(executable,testArgs,{
  stdio:'inherit',
  env:{...process.env,BASE_URL:url.origin,EXTERNAL_SERVER:'1'},
});
child.on('exit',code=>process.exit(code??1));
child.on('error',error=>{console.error(error);process.exit(1);});
