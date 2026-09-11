import { readFile } from 'node:fs/promises';
import { sql } from 'drizzle-orm';
import { db } from '../src/core/db';
const database = await db();
await database.transaction(async tx => {
 if(process.env.DB_MODE !== 'pglite') await tx.execute(sql.raw('CREATE EXTENSION IF NOT EXISTS postgis;'));
 for(const statement of (await readFile('drizzle/0000_validation.sql','utf8')).split(';').map(s=>s.trim()).filter(Boolean)) await tx.execute(sql.raw(statement));
});
console.log('Validation v0 migration applied; PostGIS:',process.env.DB_MODE !== 'pglite');
process.exit(0);
