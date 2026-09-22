import {spawn} from 'node:child_process';
import {resolve} from 'node:path';

const env={
  ...process.env,
  APP_MODE:'database',
  DB_MODE:process.env.DB_MODE||'pglite',
  PGLITE_PATH:resolve(process.env.PGLITE_PATH||'.data/passaporte-local'),
};

let child;let interrupted=false;
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{interrupted=true;child?.kill(signal)});
function run(args){return new Promise((ok,fail)=>{child=spawn(process.execPath,args,{env,stdio:'inherit'});child.once('error',fail);child.once('exit',code=>code===0&&!interrupted?ok():fail(new Error(`Processo encerrado com código ${code}.`)))});}
try{await run(['--import','tsx','scripts/migrate.ts']);await run(['--import','tsx','scripts/sanitize-existing-data.ts']);await run(['--import','tsx','scripts/seed.ts']);if(!process.argv.includes('--prepare-only'))await run(['scripts/dev.mjs']);}catch(error){console.error(error instanceof Error?error.message:error);process.exitCode=interrupted?130:1;}
