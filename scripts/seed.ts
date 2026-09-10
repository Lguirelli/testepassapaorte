import seed from '../seed/validation-content.json';
import tripFixture from '../seed/validation-trip.json';
import { db } from '../src/core/db';
import { content, trips, type ContentData } from '../src/core/db/schema';
import { ensureVisitStampSnapshots } from '../src/modules/passport/stamp-lifecycle';
import type { TripData } from '../src/modules/trips/types';

const database = await db();
const places = seed.places.map((item) => ({ ...item, synthetic: true, cityId: seed.city.id })) as ContentData[];
const categories = seed.categories.map((item) => ({ ...item, synthetic: true, cityId: seed.city.id })) as ContentData[];
const trip = structuredClone(tripFixture) as TripData;
trip.visits = ensureVisitStampSnapshots(trip.visits, places, categories);

await database.transaction(async (tx) => {
  for (const kind of ['places', 'partners', 'experiences', 'events', 'categories', 'sources'] as const) {
    for (const raw of seed[kind]) {
      const data: ContentData = { ...raw, synthetic: true, cityId: seed.city.id };
      if (kind === 'partners') {
        const place = seed.places.find((item) => item.id === data.placeId);
        data.name = place?.name;
        data.slug = place?.slug;
      }
      if (kind === 'sources') data.name = data.sourceName;
      await tx
        .insert(content)
        .values({ id: data.id, kind, slug: data.slug || data.id, draft: data, published: data, status: 'published' })
        .onConflictDoNothing();
    }
  }
  await tx.insert(trips).values({ id: trip.trip.id, owner: 'demo-tourist', data: trip }).onConflictDoNothing();
});

console.log('Synthetic seed applied idempotently with deterministic stamp snapshots; existing content preserved.');
process.exit(0);
