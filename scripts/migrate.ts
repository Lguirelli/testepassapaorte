import {readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {sql} from 'drizzle-orm';
import {db} from '../src/core/db';
const database=await db();
await database.transaction(async tx=>{
 // Serialize schema changes on PostgreSQL. Embedded PGlite runs a single process.
 if(process.env.DB_MODE!=='pglite')await tx.execute(sql`SELECT pg_advisory_xact_lock(730912)`);
 await tx.execute(sql`CREATE TABLE IF NOT EXISTS schema_migrations(name text PRIMARY KEY, checksum text NOT NULL, applied_at timestamptz NOT NULL DEFAULT now())`);
 if(process.env.ENABLE_POSTGIS==='true'&&process.env.DB_MODE!=='pglite')await tx.execute(sql`CREATE EXTENSION IF NOT EXISTS postgis`);
 for(const name of (await readdir('drizzle')).filter(n=>/^\d+.*\.sql$/.test(n)).sort()){
  const source=await readFile(`drizzle/${name}`,'utf8');
  const checksum=createHash('sha256').update(source).digest('hex');
  const previous=await tx.execute(sql`SELECT checksum FROM schema_migrations WHERE name=${name}`);
  if(previous.rows.length){if(previous.rows[0].checksum!==checksum)throw new Error(`Migration modificada após aplicação: ${name}`);continue;}
  for(const statement of source.split('--> statement-breakpoint').map(s=>s.trim()).filter(Boolean))await tx.execute(sql.raw(statement));
  await tx.execute(sql`INSERT INTO schema_migrations(name,checksum) VALUES(${name},${checksum})`);
 }
});
console.log('Migrations aplicadas.');
process.exit(0);
