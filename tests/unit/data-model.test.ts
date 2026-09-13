import test from 'node:test';
import assert from 'node:assert/strict';
import {access,readFile} from 'node:fs/promises';
import tourism from '../../seed/tourism-real.json';

test('researched tourism seed has twelve unique real attractions with provenance',async()=>{
 assert.equal(tourism.places.length,12);
 assert.equal(new Set(tourism.places.map(place=>place.slug)).size,12);
 const sourceIds=new Set(tourism.sources.map(source=>source.id));
 for(const place of tourism.places){
  assert.equal(place.status,'published');
  assert.equal(place.discoveryVisible,true);
  assert.ok(place.sourceIds.every(id=>sourceIds.has(id)));
  assert.ok(place.imageAsset.fallbackSrc);
  await access(`public/${place.imageAsset.fallbackSrc}`);
 }
});

test('relational migration defines the phase-02 domain and removes JSONB public content as canonical source',async()=>{
 const migration=await readFile('drizzle/0001_relational_domain.sql','utf8');
 for(const table of ['cities','places','place_categories','place_category_links','experiences','partners','partner_users','traveler_users','anonymous_visitors','sessions','trip_days','trip_items','visits','qr_codes','reviews','events','weather_snapshots','sources','section_definitions','page_sections','content_versions','partner_requests','tracking_events','partner_maturity_history','alerts','consent_records','shared_artifacts'])assert.match(migration,new RegExp(`(?:CREATE TABLE|ALTER TABLE) ${table}\\b`));
 const repository=await readFile('src/modules/content/repository.ts','utf8');
 assert.doesNotMatch(repository,/publishedRows\(|from\(content\)/);
 assert.match(repository,/from\(places\)/);
 assert.match(repository,/editorialDrafts/);
});
