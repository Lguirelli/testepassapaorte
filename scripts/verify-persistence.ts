import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { PGlite } from '@electric-sql/pglite';
import assert from 'node:assert/strict';

const directory = mkdtempSync(join(tmpdir(), 'passaporte-verify-'));
const dataPath = join(directory, 'db');
const env = { ...process.env, DB_MODE: 'pglite', PGLITE_PATH: dataPath, ALLOW_DEMO: 'true' };

try {
  for (const script of ['migrate', 'seed', 'migrate', 'seed']) {
    const result = spawnSync(process.execPath, ['--import', 'tsx', `scripts/${script}.ts`], { env, encoding: 'utf8' });
    process.stdout.write(result.stdout);
    assert.equal(result.status, 0, result.stderr);
  }

  const db = new PGlite(dataPath);
  const before = await db.query<{ n: number }>('select count(*)::int as n from content');
  const fixtures = (await import('../seed/validation-content.json', { with: { type: 'json' } })).default;
  const expected = ['places', 'partners', 'experiences', 'events', 'categories', 'sources']
    .reduce((n, key) => n + (fixtures as unknown as Record<string, unknown[]>)[key].length, 0);
  assert.equal(before.rows[0].n, expected);
  assert.equal((await db.query<{ n: number }>('select count(*)::int as n from trips')).rows[0].n, 1);

  const tripRows = await db.query<{ data: unknown }>('select data from trips');
  const trip = tripRows.rows[0].data as { visits?: Array<{ visitNumber?: number; stampSeed?: string; stampSnapshot?: unknown }> };
  assert.ok(Array.isArray(trip.visits) && trip.visits.length > 0);
  for (const visit of trip.visits) {
    assert.ok((visit.visitNumber || 0) >= 1, 'visitNumber must be persisted');
    assert.ok(visit.stampSeed, 'stampSeed must be persisted');
    assert.ok(visit.stampSnapshot && typeof visit.stampSnapshot === 'object', 'stampSnapshot must be persisted');
  }

  await db.exec("update content set version=2 where id='place-cafe-neblina'");
  await db.close();
  const seedAgain = spawnSync(process.execPath, ['--import', 'tsx', 'scripts/seed.ts'], { env, encoding: 'utf8' });
  assert.equal(seedAgain.status, 0, seedAgain.stderr);

  const reopened = new PGlite(dataPath);
  assert.equal((await reopened.query<{ version: number }>("select version from content where id='place-cafe-neblina'")).rows[0].version, 2);
  await reopened.close();
  console.log(`PASS: migration repeated; ${expected} content records and 1 trip; stamp snapshots persisted; edited version preserved after reopen.`);
} finally {
  rmSync(directory, { recursive: true, force: true });
}
