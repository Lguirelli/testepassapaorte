'use server';

import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { db } from '@/core/db';
import { trips, tracking } from '@/core/db/schema';
import { authProvider } from '@/providers';
import { getTrip } from '@/modules/trips/repository';
import { publicDataset } from '@/modules/content/repository';
import { appendDemoVisit } from './model';
import { stampForNewVisit } from './stamp-lifecycle';

export async function confirmDemoVisit(
  _state: { ok: boolean; message: string },
  form: FormData,
) {
  try {
    const placeId = String(form.get('placeId'));
    const dataset = await publicDataset();
    const place = dataset.places.find((item) => item.id === placeId);
    if (!place) throw new Error('Lugar indisponível.');

    const row = await getTrip();
    if (row.version !== Number(form.get('version'))) {
      throw new Error('A viagem mudou. Atualize a página.');
    }

    const user = await authProvider.currentUser();
    const newId = crypto.randomUUID();
    const data = appendDemoVisit(row.data, placeId, String(form.get('date')), newId);
    const visit = data.visits.find((item) => item.id === newId);
    if (!visit) throw new Error('Não foi possível preparar o registro.');

    const stamp = stampForNewVisit(visit, row.data.visits, place, dataset.categories);
    visit.stampSeed = stamp.seed;
    visit.stampSnapshot = stamp;

    await (await db()).transaction(async (tx) => {
      const updated = await tx
        .update(trips)
        .set({ data, version: row.version + 1 })
        .where(and(eq(trips.id, row.id), eq(trips.owner, user.id), eq(trips.version, row.version)))
        .returning();
      if (!updated.length) throw new Error('Outra edição foi salva. Atualize antes de continuar.');

      await tx.insert(tracking).values({
        id: crypto.randomUUID(),
        event: 'VISIT_CONFIRMED',
        payload: {
          placeId,
          tripId: row.id,
          visitId: visit.id,
          visitNumber: visit.visitNumber || 1,
          evidence: 'manual_demo',
          stampSeed: stamp.seed,
          rendererVersion: stamp.rendererVersion,
        },
      });
    });

    revalidatePath('/meu-passaporte');
    revalidatePath(`/viagens/${row.id}/calendario`);
    revalidatePath(`/viagens/${row.id}/roteiro`);
    return {
      ok: true,
      message: 'Registro demo salvo e carimbo gerado automaticamente. Não é uma validação real de presença.',
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Não foi possível registrar.',
    };
  }
}
