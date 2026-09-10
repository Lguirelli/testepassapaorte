import { eq } from 'drizzle-orm';
import { db } from '../src/core/db';
import { trips } from '../src/core/db/schema';
import { publicDataset } from '../src/modules/content/repository';
import { ensureVisitStampSnapshots, isGeneratedStamp } from '../src/modules/passport/stamp-lifecycle';
import type { TripData } from '../src/modules/trips/types';

const database = await db();
const dataset = await publicDataset();
const rows = await database.select().from(trips);
let updated = 0;
let visitsStamped = 0;

for (const row of rows) {
  const data = row.data as TripData;
  const before = data.visits.filter((visit) => isGeneratedStamp(visit.stampSnapshot)).length;
  const visits = ensureVisitStampSnapshots(data.visits, dataset.places, dataset.categories);
  const after = visits.filter((visit) => isGeneratedStamp(visit.stampSnapshot)).length;
  const changed = JSON.stringify(visits) !== JSON.stringify(data.visits);
  if (!changed) continue;

  await database
    .update(trips)
    .set({ data: { ...data, visits }, version: row.version + 1 })
    .where(eq(trips.id, row.id));
  updated += 1;
  visitsStamped += Math.max(0, after - before);
}

console.log(`Stamp backfill complete: ${updated} trip(s) updated, ${visitsStamped} visit(s) stamped.`);
process.exit(0);
