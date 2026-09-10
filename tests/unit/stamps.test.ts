import { test } from 'node:test';
import assert from 'node:assert/strict';
import tripFixture from '../../seed/validation-trip.json';
import contentFixture from '../../seed/validation-content.json';
import type { ContentData } from '../../src/core/db/schema';
import type { TripData, Visit } from '../../src/modules/trips/types';
import {
  ensureVisitStampSnapshots,
  isGeneratedStamp,
  stampForNewVisit,
} from '../../src/modules/passport/stamp-lifecycle';
import { renderStampSVG } from '../../src/features/stamps/renderer';

const trip = structuredClone(tripFixture) as TripData;
const places = structuredClone(contentFixture.places) as ContentData[];
const categories = structuredClone(contentFixture.categories) as ContentData[];

test('seed visits receive deterministic visit number, seed and stamp snapshot', () => {
  const first = ensureVisitStampSnapshots(trip.visits, places, categories);
  const second = ensureVisitStampSnapshots(trip.visits, places, categories);
  assert.equal(first.length, trip.visits.length);
  assert.deepEqual(first, second);
  for (const visit of first) {
    assert.equal(visit.visitNumber, 1);
    assert.ok(visit.stampSeed);
    assert.ok(isGeneratedStamp(visit.stampSnapshot));
  }
});

test('return visit increments number without mutating the historical snapshot', () => {
  const existing = ensureVisitStampSnapshots(trip.visits, places, categories);
  const first = existing.find((visit) => visit.placeId === 'place-cafe-neblina');
  assert.ok(first && isGeneratedStamp(first.stampSnapshot));
  const previousSnapshot = structuredClone(first.stampSnapshot);
  const next: Visit = {
    id: 'visit-return-test',
    placeId: 'place-cafe-neblina',
    occurredAt: '2026-09-13T10:00:00-03:00',
    evidence: 'unit_test',
    tripId: trip.trip.id,
    visitNumber: 2,
    isReturn: true,
  };
  const place = places.find((item) => item.id === next.placeId);
  assert.ok(place);
  const stamp = stampForNewVisit(next, existing, place, categories);
  assert.equal(stamp.data.visitNumber, 2);
  assert.notEqual(stamp.seed, first.stampSeed);
  assert.deepEqual(first.stampSnapshot, previousSnapshot);
});

test('renderer emits accessible SVG without embedded font payloads', () => {
  const [visit] = ensureVisitStampSnapshots(trip.visits, places, categories);
  assert.ok(isGeneratedStamp(visit.stampSnapshot));
  const svg = renderStampSVG(visit.stampSnapshot, { idPrefix: 'unit-stamp', size: 320 });
  assert.match(svg, /<title id="unit-stamp-title">/);
  assert.match(svg, /data-stamp-icon=/);
  assert.doesNotMatch(svg, /@font-face|data:font|\.woff/i);
});
