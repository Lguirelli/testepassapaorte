import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
// PGlite is an explicit fallback only, never silently selected.
export async function database() {
  if (process.env.DB_MODE === 'pglite') {
    const { embedded } = await import('./pglite');
    return embedded();
  }
  return drizzle(new Pool({connectionString:process.env.DATABASE_URL || 'postgres://validation:validation@localhost:5432/passaporte',max:4}),{schema});
}
const scope = globalThis as typeof globalThis & { passaporteDatabase?: ReturnType<typeof database> };
export function db() { return scope.passaporteDatabase ??= database(); }
