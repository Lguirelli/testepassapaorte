'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { confirmDemoVisit } from './actions';
import type { TripData } from '@/modules/trips/types';
import type { ContentData } from '@/core/db/schema';

export function VisitDemoControl({
  trip,
  places,
  version,
}: {
  trip: TripData;
  places: ContentData[];
  version: number;
}) {
  const [state, action, pending] = useActionState(confirmDemoVisit, { ok: false, message: '' });
  const router = useRouter();

  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state, router]);

  return (
    <details className="panel">
      <summary>Registrar visita de demonstração</summary>
      <p>
        Controle exclusivo de teste. Usa horário sintético 16h30, impede duplicar lugar e dia e gera automaticamente
        número, seed e snapshot do carimbo. Não implementa QR ou comprovação física real.
      </p>
      <form action={action}>
        <input type="hidden" name="version" value={version} />
        <label className="field">
          Lugar
          <select aria-label="Lugar da visita demo" name="placeId">
            {places.map((place) => <option key={place.id} value={place.id}>{place.name}</option>)}
          </select>
        </label>
        <label className="field">
          Data
          <select aria-label="Data da visita demo" name="date">
            {trip.days.map((day) => <option key={day.date} value={day.date}>{day.date}</option>)}
          </select>
        </label>
        <button disabled={pending}>{pending ? 'Gerando carimbo…' : 'Salvar registro demo'}</button>
        <p role={state.ok ? 'status' : 'alert'}>{state.message}</p>
      </form>
    </details>
  );
}
