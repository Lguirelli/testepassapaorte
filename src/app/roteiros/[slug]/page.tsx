import Link from 'next/link';
import {notFound} from 'next/navigation';
import {publicDataset} from '@/modules/content/repository';
import {scorePlace} from '@/modules/trips/engine';
import {READY_ROUTES,profileForReadyRoute,readyRouteBySlug} from '@/modules/trips/ready-routes';
import {ReadyRouteStart} from '@/components/ReadyRouteStart';
import styles from '../ready-routes.module.css';

export const dynamic='force-dynamic';

function today(){return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}

export function generateStaticParams(){return READY_ROUTES.map(route=>({slug:route.slug}));}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const route=readyRouteBySlug(slug);
  if(!route)return {title:'Roteiro não encontrado'};
  return {title:route.title,description:route.summary,alternates:{canonical:`/roteiros/${route.slug}`}};
}

export default async function ReadyRouteDetail({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const route=readyRouteBySlug(slug);
  if(!route)notFound();
  const data=await publicDataset();
  const places=data.places.filter(place=>place.discoveryVisible!==false&&place.status!=='archived');
  const defaultStart=today();
  const previewProfile=profileForReadyRoute(route,defaultStart);
  const previewPlaces=places.map((place,index)=>({place,score:scorePlace(place,previewProfile,index)})).filter(item=>Number.isFinite(item.score)&&item.score>-Infinity).sort((a,b)=>b.score-a.score).slice(0,6).map(item=>item.place);

  return <>
    <Link className={styles.back} href="/roteiros">← Todos os roteiros</Link>
    <section className={styles.detailHero}>
      <img src={route.image} alt=""/>
      <div className={styles.detailCopy}>
        <p className="eyebrow">{route.eyebrow}</p>
        <h1>{route.title}</h1>
        <p>{route.summary}</p>
        <div className={styles.meta}><span>{route.durationDays} {route.durationDays===1?'dia':'dias'}</span><span>{route.paceLabel}</span><span>{route.audience}</span></div>
      </div>
    </section>

    <div className={styles.detailLayout}>
      <div>
        <p className="eyebrow">A lógica deste roteiro</p>
        <h2>Uma base pronta, não uma sequência engessada.</h2>
        <p className="lead">A curadoria define a intenção e o ritmo. Quando você usa o roteiro, o Passaporte combina essa base com os lugares disponíveis e cria uma versão editável para a sua viagem.</p>

        <div className={styles.principles}>
          <article><strong>Curadoria</strong><p>O roteiro começa por uma situação de viagem real, não por uma lista genérica de atrações.</p></article>
          <article><strong>Adaptação</strong><p>Paradas podem mudar conforme suas escolhas, restrições e o contexto da viagem.</p></article>
          <article><strong>Controle</strong><p>Depois de criado, o roteiro é seu: mover, trocar, remover e adicionar continuam disponíveis.</p></article>
        </div>

        <h2>O que esta base prioriza</h2>
        <ul className={styles.highlightList}>{route.highlights.map(item=><li key={item}>{item}</li>)}</ul>

        <section className="section" aria-labelledby="preview-title">
          <p className="eyebrow">Possíveis encontros</p>
          <h2 id="preview-title">Lugares compatíveis com esta proposta</h2>
          <p>Esta seleção é uma prévia de compatibilidade. A versão da sua viagem é montada quando você escolhe a data de início.</p>
          <div className="grid">{previewPlaces.slice(0,3).map(place=><article className="card" key={place.id}><span className="eyebrow">{place.categoryIds?.map(id=>data.categories.find(category=>category.id===id)?.name).filter(Boolean).slice(0,2).join(' · ')}</span><h3>{place.name}</h3><p>{place.shortDescription}</p><Link href={place.commercialRelation==='partner'?`/parceiros/${place.slug}`:`/lugares/${place.slug}`}>Conhecer lugar</Link></article>)}</div>
        </section>

        <div className={styles.customBox}>
          <p className="eyebrow">Prefere decidir tudo?</p>
          <h2>Você também pode começar com uma página em branco.</h2>
          <p>O construtor completo pergunta datas, companhia, interesses, intenção, ritmo, transporte e necessidades para montar uma viagem do zero.</p>
          <Link className="button" href="/roteiro">Criar roteiro do zero</Link>
        </div>
      </div>

      <aside className={styles.startCard}>
        <p className="eyebrow">Usar esta base</p>
        <h2>Quando começa a viagem?</h2>
        <ReadyRouteStart route={route} places={places} defaultStart={defaultStart}/>
      </aside>
    </div>
  </>;
}
