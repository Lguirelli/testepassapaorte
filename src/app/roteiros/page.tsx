import Link from 'next/link';
import {READY_ROUTES} from '@/modules/trips/ready-routes';
import styles from './ready-routes.module.css';

export const metadata={title:'Roteiros prontos',description:'Comece por uma direção que combine com a sua viagem e adapte o caminho até ele ficar seu.',alternates:{canonical:'/roteiros'}};

export default function ReadyRoutesPage(){
  return <>
    <section className={styles.hero}>
      <div>
        <p className="eyebrow">Roteiros prontos</p>
        <h1>Comece com uma direção. Adapte até a viagem ficar sua.</h1>
        <p className="lead">Escolha uma base pensada para uma situação real: primeira visita, fim de semana a dois, família, chuva, natureza ou sabores. Depois, ajuste ritmo, paradas e ordem conforme a sua viagem ganha forma.</p>
        <div className={styles.actions}><a className="button primary" href="#roteiros">Ver roteiros</a><Link className="button trip-planner-cta" href="/roteiro">Planejar minha viagem</Link></div>
      </div>
      <aside className={styles.heroAside}>
        <p className="eyebrow">Como funciona</p>
        <strong>Curadoria para começar. Liberdade para adaptar.</strong>
        <p>Você não precisa responder um questionário para ter uma primeira versão. Escolha uma base, informe quando a viagem começa e personalize o percurso depois.</p>
      </aside>
    </section>

    <section id="roteiros" aria-labelledby="ready-routes-title">
      <div className="section-head"><div><p className="eyebrow">Escolha pela situação</p><h2 id="ready-routes-title">Que Serra Negra combina com a sua viagem?</h2></div></div>
      <div className={styles.grid} data-ready-route-grid>
        {READY_ROUTES.map(route=><article className={styles.card} data-ready-route-card key={route.slug}>
          <img src={route.image} alt="" loading="lazy"/>
          <div className={styles.cardBody}>
            <p className="eyebrow">{route.eyebrow}</p>
            <h2>{route.title}</h2>
            <p>{route.summary}</p>
            <div className={styles.meta}><span>{route.durationDays} {route.durationDays===1?'dia':'dias'}</span><span>{route.paceLabel}</span><span>{route.audience}</span></div>
            <Link className={styles.cardLink} href={`/roteiros/${route.slug}`}>Conhecer este roteiro →</Link>
          </div>
        </article>)}
      </div>
    </section>

    <section className={styles.story} aria-label="Etapas da experiência">
      <article><span>01 · Escolha</span><h2>Encontre uma direção</h2><p>Parta de uma base adequada ao tempo, companhia ou intenção da viagem.</p></article>
      <article><span>02 · Adapte</span><h2>Faça o caminho ficar seu</h2><p>Troque paradas, reorganize horários, fixe o que importa e acrescente novas descobertas.</p></article>
      <article><span>03 · Viva</span><h2>Guarde o que aconteceu</h2><p>O roteiro organiza a intenção. O Passaporte registra o que realmente entrou para a viagem.</p></article>
    </section>
  </>;
}
