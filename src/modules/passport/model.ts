import type { TripData, Visit } from '@/modules/trips/types';
import type { ContentData } from '@/core/db/schema';

export function passportSummary(trip: TripData, places: ContentData[]) {
  const visits = [...trip.visits].sort((a, b) => a.occurredAt.localeCompare(b.occurredAt));
  const recordedIds = [...new Set(visits.map((visit) => visit.placeId))];
  return {
    visits,
    recordedIds,
    discoveries: visits.filter((visit) => !visit.isReturn).length,
    returns: visits.filter((visit) => visit.isReturn).length,
    planned: trip.days.flatMap((day) => day.items).filter((item) => item.state !== 'removed'),
    categories: [
      ...new Set(
        places
          .filter((place) => recordedIds.includes(place.id))
          .flatMap((place) => place.categoryIds || []),
      ),
    ],
  };
}

export function appendDemoVisit(trip: TripData, placeId: string, date: string, newId: string): TripData {
  if (!trip.days.some((day) => day.date === date)) {
    throw new Error('Selecione um dia desta viagem demo.');
  }
  if (trip.visits.some((visit) => visit.placeId === placeId && visit.occurredAt.slice(0, 10) === date)) {
    throw new Error('Já existe um registro demo para este lugar neste dia.');
  }

  const result = structuredClone(trip);
  const priorVisits = trip.visits.filter((visit) => visit.placeId === placeId);
  const visitNumber = priorVisits.length + 1;
  const visit: Visit = {
    id: newId,
    placeId,
    occurredAt: `${date}T16:30:00-03:00`,
    evidence: 'manual_demo',
    tripId: trip.trip.id,
    visitNumber,
    isReturn: visitNumber > 1,
    outsidePlannedRoute: !trip.days
      .find((day) => day.date === date)
      ?.items.some((item) => item.placeId === placeId && item.state !== 'removed'),
  };
  result.visits.push(visit);
  return result;
}
