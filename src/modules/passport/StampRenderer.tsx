import type { ContentData } from '@/core/db/schema';
import { StampPreview, TourismStamp } from '@/features/stamps/react';
import type { Visit } from '@/modules/trips/types';
import { isGeneratedStamp, visitNumberFor } from './stamp-lifecycle';

export function StampRenderer({
  visit,
  visits,
  place,
  categories,
}: {
  visit: Visit;
  visits: Visit[];
  place: ContentData;
  categories: ContentData[];
}) {
  const visitNumber = visitNumberFor(visit, visits);
  const category = categories.find((item) => place.categoryIds?.includes(item.id));

  return (
    <article className="stamp-record" data-stamp-generated={isGeneratedStamp(visit.stampSnapshot) ? 'snapshot' : 'fallback'}>
      <div className="stamp-art" aria-label={`Carimbo de ${place.name || 'lugar'}`}>
        {isGeneratedStamp(visit.stampSnapshot) ? (
          <StampPreview stamp={visit.stampSnapshot} />
        ) : (
          <TourismStamp
            data={{
              partnerId: place.id,
              partnerName: place.name || 'Lugar sem nome',
              category: category?.slug || 'destination',
              visitId: visit.id,
              visitDate: visit.occurredAt.slice(0, 10),
              visitNumber,
              city: 'Serra Negra',
              state: 'SP',
              status: visitNumber > 1 ? 'return' : 'first_visit',
              seed: visit.stampSeed,
            }}
            options={{
              size: 220,
              textureLevel: 0.58,
              showLocation: true,
              showVisitNumber: true,
              animated: true,
              variationMode: 'visit',
            }}
          />
        )}
      </div>
      <details className="stamp-meta">
        <summary>
          <strong>{place.name}</strong>{' '}
          <small>
            {new Date(visit.occurredAt).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
            {' · '}visita {visitNumber}
          </small>
        </summary>
        <p>Presença registrada em modo de demonstração.</p>
        <p>{visit.evidence === 'qr_demo' ? 'Evidência sintética do seed QR demo.' : 'Registro manual de teste.'}</p>
        {visit.outsidePlannedRoute ? <p>Descoberta fora do planejamento no momento do registro.</p> : null}
        <p>Não comprova compra ou consumo.</p>
      </details>
    </article>
  );
}
