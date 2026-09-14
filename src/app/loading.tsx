import {t} from '@/core/i18n';

const cards=[0,1,2];

export default function Loading(){
  return <section className="skeleton-shell" role="status" aria-live="polite" aria-busy="true">
    <span className="sr-only">{t('loading')}</span>

    <div className="skeleton-copy" aria-hidden="true">
      <span className="skeleton-line skeleton-kicker"/>
      <span className="skeleton-line skeleton-title"/>
      <span className="skeleton-line skeleton-title skeleton-title-short"/>
      <span className="skeleton-line skeleton-body"/>
      <span className="skeleton-line skeleton-body skeleton-body-short"/>
      <div className="skeleton-actions">
        <span className="skeleton-button"/>
        <span className="skeleton-button skeleton-button-secondary"/>
      </div>
    </div>

    <div className="skeleton-grid" aria-hidden="true">
      {cards.map(card=><article className="skeleton-card" key={card}>
        <span className="skeleton-media"/>
        <div className="skeleton-card-copy">
          <span className="skeleton-chip"/>
          <span className="skeleton-line skeleton-card-title"/>
          <span className="skeleton-line skeleton-card-text"/>
          <span className="skeleton-line skeleton-card-text skeleton-card-text-short"/>
        </div>
      </article>)}
    </div>
  </section>;
}
