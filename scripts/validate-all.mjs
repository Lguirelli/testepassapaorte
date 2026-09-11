/** Reproducible acceptance entry point. No browser downloads or infrastructure changes. */
import {existsSync,mkdirSync,writeFileSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const full=process.argv.includes('--run');
const reportDir=join(root,'artifacts','validation','acceptance-current');
mkdirSync(reportDir,{recursive:true});
const results=[];
const record=(name,status,detail)=>{results.push({name,status,detail});console.log(`${status}: ${name}: ${detail}`);};
const finish=code=>{writeFileSync(join(reportDir,'SUMMARY.json'),JSON.stringify({at:new Date().toISOString(),mode:full?'full':'preflight',status:code===0?'PASS':code===2?'BLOCKED':'FAIL',results},null,2));process.exitCode=code;};
const major=Number(process.versions.node.split('.')[0]);
record('Node',major>=22?'PASS':'BLOCKED',`Node ${process.versions.node}; required >=22`);
let browserPresent=false;
try{const {chromium}=await import('@playwright/test');browserPresent=existsSync(chromium.executablePath());record('Chromium',browserPresent?'PASS':'BLOCKED',browserPresent?'Installed executable found; launch is checked by E2E.':'Run npx playwright install chromium in a supported environment.');}catch{record('Chromium','BLOCKED','Dependencies absent; run npm ci first.');}
const connectionString=process.env.VALIDATION_DATABASE_URL;
let postgisReady=false;
if(!connectionString)record('PostGIS','BLOCKED','Set VALIDATION_DATABASE_URL to an isolated disposable PostgreSQL validation database.');
else{
 let pool;
 try{
  const {Pool}=await import('pg');pool=new Pool({connectionString,connectionTimeoutMillis:5000,query_timeout:5000,max:1});
  const result=await pool.query("select name from pg_available_extensions where name='postgis'");postgisReady=result.rows.length===1;
  record('PostGIS',postgisReady?'PASS':'BLOCKED',postgisReady?'Connection verified and PostGIS extension available.':'PostGIS extension is not available.');
 }catch{record('PostGIS','BLOCKED','Could not verify the validation database. Check connection and service; credentials are not logged.');}
 finally{if(pool)await pool.end();}
}
if(major<22||!browserPresent||!postgisReady){finish(2);}
else if(!full){finish(0);}
else{
 const childEnv={...process.env,DATABASE_URL:connectionString,DB_MODE:'postgres',ALLOW_DEMO:'true',CI:'1',NEXT_BUILD_DIR:'.next-acceptance'};
 delete childEnv.EXTERNAL_SERVER;delete childEnv.BASE_URL;
 const npm=process.platform==='win32'?'npm.cmd':'npm';
 async function step(name,command,args){
  const chunks=[];
  const code=await new Promise(resolveCode=>{
   const child=spawn(command,args,{cwd:root,env:childEnv,shell:process.platform==='win32'&&command===npm});
   child.stdout.on('data',data=>{chunks.push(data);process.stdout.write(data);});child.stderr.on('data',data=>{chunks.push(data);process.stderr.write(data);});
   child.on('error',()=>resolveCode(1));child.on('close',code=>resolveCode(code??1));
  });
  writeFileSync(join(reportDir,`${name}.log`),Buffer.concat(chunks));record(name,code===0?'PASS':'FAIL',`Exit code ${code}; see ${name}.log`);return code===0;
 }
 const steps=[['migrate',npm,['run','db:migrate']],['seed',npm,['run','db:seed']],['lint',npm,['run','lint']],['typecheck',npm,['run','typecheck']],['unit',npm,['test']],['admin-integration',process.execPath,['--import','tsx','scripts/verify-admin.ts']],['persistence',process.execPath,['--import','tsx','scripts/verify-persistence.ts']],['build',npm,['run','build']],['e2e',npm,['run','test:e2e']]];
 let passed=true;
 for(const [name,command,args] of steps){if(!await step(name,command,args)){passed=false;break;}}
 finish(passed?0:1);
}
