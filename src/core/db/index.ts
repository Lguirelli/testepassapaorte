import {isVisualMode} from '@/core/app-mode';
import {drizzle} from 'drizzle-orm/node-postgres';
import {Pool} from 'pg';
import * as schema from './schema';
// PGlite is an explicit local/demo fallback only, never silently selected in production.
export async function database(){
  if(isVisualMode())throw new Error('Persistência desativada no modo de desenvolvimento visual.');
  if(process.env.DB_MODE==='pglite'){
    if(process.env.NODE_ENV==='production')throw new Error('PGlite não é permitido como banco de produção. Configure DATABASE_URL.');
    const {embedded}=await import('./pglite');return embedded();
  }
  const connectionString=process.env.DATABASE_URL||(process.env.NODE_ENV!=='production'?'postgres://passaporte:passaporte@localhost:5432/passaporte':'');
  if(!connectionString)throw new Error('DATABASE_URL é obrigatório em produção.');
  return drizzle(new Pool({connectionString,max:4}),{schema});
}
const scope=globalThis as typeof globalThis&{passaporteDatabase?:ReturnType<typeof database>};
export function db(){return scope.passaporteDatabase??=database();}
