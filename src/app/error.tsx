'use client';

import Link from 'next/link';
import {t} from '@/core/i18n';

export default function ErrorPage({reset}:{reset:()=>void}){
  return <section className="route-state route-error" role="alert">
    <p className="eyebrow">Não foi possível abrir esta etapa</p>
    <h1>Falha temporária</h1>
    <p className="lead">{t('error')}</p>
    <div className="actions">
      <button className="primary" type="button" onClick={reset}>Tentar novamente</button>
      <Link className="button" href="/explorar">Continuar explorando</Link>
      <Link className="button" href="/">Voltar ao início</Link>
    </div>
  </section>;
}
