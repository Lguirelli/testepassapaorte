'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Icon } from '@/design-system/icons';

export type BookPage = { id: string; title: string; content: React.ReactNode };

function mediaStore(query: string) {
  return {
    subscribe(callback: () => void) {
      const media = window.matchMedia(query);
      media.addEventListener('change', callback);
      return () => media.removeEventListener('change', callback);
    },
    getSnapshot() {
      return window.matchMedia(query).matches;
    },
    getServerSnapshot() {
      return false;
    },
  };
}

const mobileStore = mediaStore('(max-width: 650px)');
const reducedMotionStore = mediaStore('(prefers-reduced-motion: reduce)');

export function Book({ pages }: { pages: BookPage[] }) {
  const [page, setPage] = useState(0);
  const [turning, setTurning] = useState<'next' | 'prev' | null>(null);
  const mobile = useSyncExternalStore(mobileStore.subscribe, mobileStore.getSnapshot, mobileStore.getServerSnapshot);
  const reducedMotion = useSyncExternalStore(
    reducedMotionStore.subscribe,
    reducedMotionStore.getSnapshot,
    reducedMotionStore.getServerSnapshot,
  );
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const step = mobile ? 1 : 2;

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function go(next: number) {
    const target = Math.max(0, Math.min(next, pages.length - 1));
    if (target === page || turning) return;
    const direction = target > page ? 'next' : 'prev';

    if (reducedMotion) {
      setPage(target);
      ref.current?.focus();
      return;
    }

    setTurning(direction);
    setPage(target);
    timer.current = setTimeout(() => {
      setTurning(null);
      ref.current?.focus();
    }, 760);
  }

  const shown = pages.slice(page, page + 2);

  return (
    <>
      <div className="actions passport-controls">
        <button
          aria-controls="passport-book"
          aria-label="Página anterior"
          disabled={page === 0 || Boolean(turning)}
          onClick={() => go(page - step)}
        >
          <Icon name="chevron-esquerda" />Página anterior
        </button>
        <label className="field" style={{ margin: 0 }}>
          Capítulo
          <select
            aria-label="Capítulo do Passaporte"
            value={page}
            disabled={Boolean(turning)}
            onChange={(event) => go(Number(event.target.value))}
          >
            {pages.map((item, index) => (
              <option key={item.id} value={index}>{index + 1}. {item.title}</option>
            ))}
          </select>
        </label>
        <button
          aria-controls="passport-book"
          aria-label="Próxima página"
          disabled={page + step >= pages.length || Boolean(turning)}
          onClick={() => go(page + step)}
        >
          Próxima página<Icon name="chevron-direita" />
        </button>
      </div>
      <p aria-live="polite" className="muted">
        {mobile ? `Página ${page + 1}` : `Páginas ${page + 1} e ${Math.min(page + 2, pages.length)}`} de {pages.length}
      </p>
      <div
        className={`book${turning ? ` is-turning turn-${turning}` : ''}`}
        id="passport-book"
        ref={ref}
        tabIndex={0}
        role="region"
        aria-label="Passaporte paginado"
        aria-busy={Boolean(turning)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') go(page + step);
          if (event.key === 'ArrowLeft') go(page - step);
        }}
      >
        {shown.map((item, index) => (
          <section
            className={`book-page ${index === 1 ? 'mobile-hidden' : ''}`}
            key={item.id}
            data-testid={`passport-page-${item.id}`}
          >
            <p className="eyebrow">Passaporte demo</p>
            <h2>{item.title}</h2>
            {item.content}
            <small className="page-number">{page + index + 1}</small>
          </section>
        ))}
        {turning ? <div className={`passport-turn-sheet ${turning}`} data-page-turn aria-hidden="true" /> : null}
      </div>
      <p className="muted passport-keyboard-hint">Use ← → para virar as páginas. Com movimento reduzido, a troca é imediata.</p>
    </>
  );
}
