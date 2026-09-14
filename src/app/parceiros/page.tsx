import Link from 'next/link';
import {Icon} from '@/design-system/icons';
import {PlaceCard} from '@/components/content';
import {publicDataset} from '@/modules/content/repository';
import {ROUTES} from '@/core/routing/routes';
import styles from './page.module.css';
import {trySanitizeHttpsUrl} from '@/core/security/sanitize';

export const dynamic='force-dynamic';
export const metadata={title:'Para parceiros'};

export default async function PartnerProgram(){
  const data=await publicDataset();
  const partners=data.places.filter(place=>place.discoveryVisible!==false&&place.commercialRelation==='partner');
  const partnerContactUrl=trySanitizeHttpsUrl(process.env.NEXT_PUBLIC_PARTNER_CONTACT_URL);
  return <div className={styles.page}>
    <section className={styles.hero}>
      <div>
        <p className="eyebrow">Ecossistema local</p>
        <h1>Faça parte do caminho de quem visita Serra Negra.</h1>
        <p className="lead">O Passaporte conecta descoberta, planejamento e visita. A proposta para parceiros é aparecer no contexto certo da jornada, sem transformar a experiência em uma vitrine genérica.</p>
        <div className="actions">
          <Link className="button primary" href={`${ROUTES.explore}?relation=partner`}>Ver parceiros na experiência <Icon name="avancar" size="sm"/></Link>
          <Link className="button" href={ROUTES.tripBuilder}>Ver como o roteiro funciona</Link>
        </div>
      </div>
      <aside className={`panel ${styles.summary}`}>
        <p className="eyebrow">Fluxo da plataforma</p>
        <ol>
          <li>O visitante descobre lugares por interesse e contexto.</li>
          <li>O roteiro combina pontos públicos e experiências relevantes.</li>
          <li>O parceiro pode participar da jornada sem perder sua identidade própria.</li>
          <li>Visitas e interações futuras podem alimentar inteligência agregada da rede.</li>
        </ol>
      </aside>
    </section>

    <section className="section">
      <div className="section-head">
        <div><p className="eyebrow">Integração contextual</p><h2>Onde um parceiro pode aparecer</h2></div>
      </div>
      <div className="grid">
        <article className={`panel ${styles.benefit}`}><Icon name="explorar"/><h3>Descoberta</h3><p>Em buscas, categorias e recomendações relacionadas ao interesse do visitante.</p></article>
        <article className={`panel ${styles.benefit}`}><Icon name="roteiro"/><h3>Roteiro</h3><p>Como parada coerente com tempo, perfil, localização e intenção da viagem.</p></article>
        <article className={`panel ${styles.benefit}`}><Icon name="passaporte"/><h3>Memória</h3><p>Como parte registrada da experiência, separando planejamento de visita efetivamente registrada.</p></article>
      </div>
    </section>

    <section className="section">
      <div className="section-head"><div><p className="eyebrow">Demonstração</p><h2>Parceiros já representados no ambiente dinâmico</h2></div><Link href="/explorar?relation=partner">Explorar todos</Link></div>
      <div className="grid">{partners.slice(0,6).map(place=><PlaceCard key={place.id} place={place}/>)}</div>
    </section>
    <section className="section">
      <div className="section-head"><div><p className="eyebrow">Inteligência própria</p><h2>O parceiro acompanha sinais do próprio negócio.</h2><p>Sem ranking competitivo público e sem prometer causalidade de venda.</p></div></div>
      <div className={styles.metrics}>
        <article className={`panel ${styles.metric}`}><Icon name="parceiro-visitantes"/><strong>Descoberta</strong><p>Visualizações, origens de descoberta e interações com a página.</p></article>
        <article className={`panel ${styles.metric}`}><Icon name="roteiro-adicionar-parada"/><strong>Intenção</strong><p>Inclusões em roteiro e sinais de interesse relacionados ao negócio.</p></article>
        <article className={`panel ${styles.metric}`}><Icon name="parceiro-visita-registrada"/><strong>Presença</strong><p>Visitas registradas por evidência, sem tratar QR como prova de compra.</p></article>
        <article className={`panel ${styles.metric}`}><Icon name="parceiro-desempenho"/><strong>Evolução</strong><p>Séries temporais e afinidades agregadas quando houver volume suficiente.</p></article>
      </div>
    </section>

    <section className="section">
      <p className="eyebrow">Maturação</p><h2>Entrar na rede é o começo, não uma promessa de resultado imediato.</h2><p className="lead">A leitura amadurece conforme existem sinais suficientes e consistentes. Os estágios são operacionais e podem avançar, permanecer ou regredir.</p>
      <div className={styles.maturity}>{['Entrada','Ativação','Primeiros dados','Engajamento','Consistência','Maturação'].map(stage=><div className={styles.stage} key={stage}><strong>{stage}</strong></div>)}</div>
    </section>

    <section className="section" id="contato">
      <div className="two"><div><p className="eyebrow">Entrar em contato</p><h2>Quer entender como seu negócio pode participar?</h2><p>O canal comercial definitivo é configurável no ambiente de produção. Nenhum preço, SLA ou resultado é prometido nesta apresentação.</p></div><aside className="panel"><h3>Próximo passo</h3><p>Configure <code>NEXT_PUBLIC_PARTNER_CONTACT_URL</code> para conectar este CTA ao canal comercial oficial.</p>{partnerContactUrl?<a className="button primary" href={partnerContactUrl} target="_blank" rel="noreferrer">Abrir canal comercial <Icon name="link-externo" size="sm"/></a>:<p className="notice">Canal comercial ainda não publicado.</p>}</aside></div>
    </section>

  </div>;
}
