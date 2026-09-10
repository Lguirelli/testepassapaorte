import type { ContentData } from '@/core/db/schema';
import { generateStamp } from '@/features/stamps/generateStamp';
import type { GeneratedStamp, StampData } from '@/features/stamps/types';
import type { Visit } from '@/modules/trips/types';

function categorySlug(place: ContentData, categories: ContentData[]) {
  const ids = place.categoryIds ?? [];
  const category = categories.find((item) => ids.includes(item.id));
  const slug = category?.slug || 'destination';
  const engineAliases: Record<string, string> = {
    cafes: 'cafe',
    gastronomia: 'restaurante',
    natureza: 'parque',
    cultura: 'cultural-center',
    compras: 'loja',
    'bem-estar': 'bem-estar',
  };
  return engineAliases[slug] || slug;
}

export function visitNumberFor(visit: Visit, visits: Visit[]) {
  if (visit.visitNumber && visit.visitNumber > 0) return visit.visitNumber;
  const ordered = [...visits]
    .filter((item) => item.placeId === visit.placeId)
    .sort((a, b) => a.occurredAt.localeCompare(b.occurredAt));
  return Math.max(1, ordered.findIndex((item) => item.id === visit.id) + 1);
}

export function stampDataForVisit(
  visit: Visit,
  visits: Visit[],
  place: ContentData,
  categories: ContentData[],
): StampData {
  const visitNumber = visitNumberFor(visit, visits);
  return {
    partnerId: place.id,
    partnerName: place.name || 'Lugar sem nome',
    category: categorySlug(place, categories),
    visitId: visit.id,
    visitDate: visit.occurredAt.slice(0, 10),
    visitNumber,
    city: 'Serra Negra',
    state: 'SP',
    status: visitNumber > 1 ? 'return' : 'first_visit',
    seed: visit.stampSeed,
    rendererVersion: 1,
  };
}

export function isGeneratedStamp(value: unknown): value is GeneratedStamp {
  if (!value || typeof value !== 'object') return false;
  const stamp = value as Partial<GeneratedStamp>;
  return Boolean(
    stamp.seed &&
      stamp.shape &&
      typeof stamp.shape === 'object' &&
      stamp.icon &&
      typeof stamp.icon === 'object' &&
      stamp.data &&
      typeof stamp.data === 'object' &&
      stamp.rendererVersion === 1,
  );
}

export function ensureVisitStampSnapshots(
  visits: Visit[],
  places: ContentData[],
  categories: ContentData[],
): Visit[] {
  const byPlace = new Map(places.map((place) => [place.id, place]));
  const ordered = [...visits].sort((a, b) => a.occurredAt.localeCompare(b.occurredAt));
  const enriched: Visit[] = [];

  for (const visit of ordered) {
    const visitNumber = visitNumberFor(visit, ordered);
    const next: Visit = { ...visit, visitNumber, isReturn: visitNumber > 1 };
    const place = byPlace.get(visit.placeId);
    if (!isGeneratedStamp(next.stampSnapshot) && place) {
      const stamp = stampForNewVisit(next, enriched, place, categories);
      next.stampSeed = stamp.seed;
      next.stampSnapshot = stamp;
    } else if (isGeneratedStamp(next.stampSnapshot)) {
      next.stampSeed = next.stampSnapshot.seed;
    }
    enriched.push(next);
  }

  const byId = new Map(enriched.map((visit) => [visit.id, visit]));
  return visits.map((visit) => byId.get(visit.id) || visit);
}

function createsTripleRepeat(candidate: GeneratedStamp, previous: GeneratedStamp[]) {
  if (previous.length < 2) return false;
  const last = previous.slice(-2);
  return (
    last.every((stamp) => stamp.color === candidate.color) ||
    last.every((stamp) => stamp.layout === candidate.layout) ||
    last.every((stamp) => stamp.shape.id === candidate.shape.id)
  );
}

export function stampForNewVisit(
  visit: Visit,
  visits: Visit[],
  place: ContentData,
  categories: ContentData[],
): GeneratedStamp {
  const ordered = [...visits, visit].sort((a, b) => a.occurredAt.localeCompare(b.occurredAt));
  const input = stampDataForVisit(visit, ordered, place, categories);
  const previous = ordered
    .filter((item) => item.id !== visit.id && isGeneratedStamp(item.stampSnapshot))
    .map((item) => item.stampSnapshot as GeneratedStamp);

  let candidate = generateStamp(input, {
    variationMode: 'visit',
    textureLevel: 0.58,
    showLocation: true,
    showVisitNumber: true,
    animated: true,
  });
  const baseSeed = candidate.seed;
  for (let attempt = 1; attempt <= 12 && createsTripleRepeat(candidate, previous); attempt += 1) {
    candidate = generateStamp({ ...input, seed: `${baseSeed}:${attempt}` }, {
      variationMode: 'visit',
      textureLevel: 0.58,
      showLocation: true,
      showVisitNumber: true,
      animated: true,
    });
  }
  return candidate;
}
