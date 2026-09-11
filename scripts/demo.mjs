import {spawn} from 'node:child_process';
import {createServer} from 'node:net';
import {resolve} from 'node:path';

// Dedicated presentation data keeps previous validation sessions intact.
const env={...process.env,DB_MODE:'pglite',ALLOW_DEMO:'true',PGLITE_PATH:resolve(process.env.DEMO_DATA_PATH||'.data/demo-presentation')};
const prepareOnly=process.argv.includes('--prepare-only');
let child;
let interrupted=false;
for(const signal of ['SIGINT','SIGTERM']) process.on(signal,()=>{interrupted=true;child?.kill(signal);});
function run(args){
 return new Promise((resolve,reject)=>{
  child=spawn(process.execPath,args,{env,stdio:'inherit'});
  child.once('error',reject);
  child.once('exit',code=>code===0&&!interrupted?resolve():reject(new Error(`Demo subprocess stopped (exit ${code}).`)));
 });
}
try{
 // Refuse setup when this application's usual port is already occupied.
 await new Promise((resolve,reject)=>{
  const probe=createServer();
  probe.once('error',()=>reject(new Error('Porta 4173 indisponível. Pare a outra instância antes de preparar a demonstração.')));
  probe.listen(4173,'0.0.0.0',()=>probe.close(resolve));
 });
 console.log('DEMO: dados sintéticos, PGlite sem PostGIS. Banco:',env.PGLITE_PATH);
 await run(['--import','tsx','scripts/migrate.ts']);
 await run(['--import','tsx','scripts/seed.ts']);
 if(!prepareOnly){
  console.log('Abra http://localhost:4173. Ctrl+C encerra a demonstração.');
  await run(['scripts/dev.mjs']);
 }
}catch(error){console.error(error.message);process.exitCode=interrupted?130:1;}
