import content from "../../../seed/validation-content.json" with {type:"json"};
import tripBundle from "../../../seed/validation-trip.json" with {type:"json"};
import type {EntityKind, TripBundle} from "@/core/domain/types";
import type {EntityRecord} from "./repository";

export function seedRecords():EntityRecord[] {
  const now = "2026-09-09T00:00:00-03:00";
  const placesById = new Map((content.places as any[]).map(p=>[p.id,p]));
  const groups:[EntityKind, any[]][] = [
    ["categories",content.categories],["places",content.places],["partners",content.partners],
    ["experiences",content.experiences],["events",content.events],["sources",content.sources],
  ];
  return groups.flatMap(([kind,rows])=>rows.map((data:any)=>{
    const related = kind === "partners" ? placesById.get(data.placeId) : undefined;
    const slug = data.slug ?? related?.slug ?? data.id;
    const status = kind === "partners" ? (data.status === "active" ? "published" : data.status) : (data.status ?? "published");
    return {id:data.id,kind,slug,status,synthetic:true,data:{...data,synthetic:true},updatedAt:now};
  }));
}
export function seedTripBundle(){ return structuredClone(tripBundle) as TripBundle; }
