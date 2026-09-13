import type {ContentData} from '@/core/db/schema';
import {trySanitizeSlug} from '@/core/security/sanitize';
export function placeUrl(place:ContentData){const slug=trySanitizeSlug(place.slug);return slug?`/${place.commercialRelation==='partner'?'parceiros':'lugares'}/${slug}`:'/explorar';}
