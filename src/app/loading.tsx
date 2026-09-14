import {t} from '@/core/i18n';

export default function Loading(){
  return <section className="route-loading" role="status" aria-live="polite" aria-busy="true">
    <span className="sr-only">{t('loading')}</span>
    <div className="route-loading-copy" aria-hidden="true">
      <span className="route-loading-line route-loading-line-short"/>
      <span className="route-loading-line route-loading-line-title"/>
      <span className="route-loading-line route-loading-line-body"/>
    </div>
    <div className="route-loading-grid" aria-hidden="true">
      <span/><span/><span/>
    </div>
  </section>;
}
