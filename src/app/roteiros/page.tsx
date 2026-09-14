import Link from 'next/link';
import {READY_ROUTES} from '@/modules/trips/ready-routes';
import styles from './ready-routes.module.css';

export const metadata={title:'Roteiros prontos',description:'Comece por um roteiro pensado para diferentes formas de viver Serra Negra e adapte o que quiser.',alternates:{canonical:'/roteiros'}};

export default function ReadyRoutesPage(){
  return <>
    <section className={styles.hero}>
      <div>
        <p className="eyebrow">Roteiros prontos</p>
        <h1>Comece com uma boa base. Mude o que quiser.</h1>
        <p className="lead">Escolha uma viagem já pensada para uma situação real: primeira visita, fim de semana a dois, família, chuva, natureza ou sabores. O roteiro vira seu e continua editável.</p>
        <div className={styles.actions}><a className="button primary" href="#roteiros">Ver roteiros</a><Link className="button" href="/roteiro">Criar do zero</Link></div>
      </div>
      <aside className={styles.heroAside}>
        <p className="eyebrow">Como funciona</p>
        <strong>Curadoria primeiro. Personalização depois.</strong>
        <p>Você não precisa responder um questionário para começar. Escolha uma base, informe quando a viagem começa e ajuste as paradas na sua própria versão.</p>
      </aside>
    </section>

    <section id="roteiros" aria-labelledby="ready-routes-title">
      <div className="section-head"><div><p className="eyebrow">Escolha pela situação</p><h2 id="ready-routes-title">Que Serra Negra você quer viver?</h2></div></div>
      <div className={styles.grid}>
        {READY_ROUTES.map(route=><article className={styles.card} key={route.slug}>
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
      <article><span>01 · Escolha</span><h2>Comece pronto</h2><p>Encontre uma base pensada para o tempo, companhia ou intenção da viagem.</p></article>
      <article><span>02 · Adapte</span><h2>Faça virar seu</h2><p>Troque paradas, reorganize horários, fixe o que é importante e acrescente novas descobertas.</p></article>
      <article><span>03 · Viva</span><h2>Guarde o que aconteceu</h2><p>O roteiro organiza a intenção. O Passaporte registra o que realmente entrou para a viagem.</p></article>
    </section>
  </>;
}
