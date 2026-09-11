'use client';

import {useEffect,useMemo,useRef,useState} from 'react';
import Link from 'next/link';
import type {CSSProperties,PointerEvent as ReactPointerEvent,WheelEvent as ReactWheelEvent} from 'react';
import type {ContentData} from '@/core/db/schema';
import {PlaceCard,MockMap} from '@/components/content';
import {Icon} from '@/design-system/icons';
import type {IconName} from '@/design-system/icons/icon.types';
import styles from '@/app/home.module.css';

type Props={
  featured:ContentData[];
  partners:ContentData[];
  categories:ContentData[];
  routePlaces:ContentData[];
};

const routeTypes=[
  {name:'Primeira visita',title:'Um começo equilibrado',copy:'Misture referências da cidade, pausas e descobertas sem concentrar tudo no mesmo período.',icon:'roteiro'},
  {name:'Natureza',title:'Mais tempo ao ar livre',copy:'Priorize mirantes, jardins e experiências abertas, deixando margem para o ritmo do dia.',icon:'lugar-outdoor'},
  {name:'Gastronomia',title:'Paradas que também contam a viagem',copy:'Distribua cafés, refeições e produtores locais entre os deslocamentos do roteiro.',icon:'perfil-relaxar'},
  {name:'Dia de chuva',title:'Um plano que continua funcionando',copy:'Reorganize o dia com experiências cobertas e mantenha alternativas para quando o tempo mudar.',icon:'clima-chuva'},
] as const;

function categoryIcon(category:ContentData):IconName{
  const value=`${category.id} ${category.name||''}`.toLowerCase();
  if(value.includes('nature'))return 'lugar-outdoor';
  if(value.includes('gastro')||value.includes('caf'))return 'perfil-relaxar';
  if(value.includes('cultur'))return 'admin-conteudo-cms';
  if(value.includes('compra'))return 'parceiros';
  if(value.includes('bem'))return 'passaporte';
  return 'explorar';
}

const faqs=[
  ['Os lugares desta versão são reais?','Não. Todo o conteúdo desta base é sintético e existe para validar o funcionamento da plataforma.'],
  ['Existe reserva ou pagamento nesta versão?','Não. Os contatos, condições comerciais e ações de reserva são demonstrativos.'],
  ['O roteiro muda quando eu ajusto minhas escolhas?','Sim. A experiência foi preparada para reorganizar a viagem preservando decisões importantes do usuário.'],
] as const;

function circularOffset(index:number,active:number,total:number){
  const raw=(index-active+total)%total;
  return raw>total/2?raw-total:raw;
}

function RouteTypeSlider(){
  const [active,setActive]=useState(0);
  const [previous,setPrevious]=useState<number|null>(null);
  const [direction,setDirection]=useState<1|-1>(1);
  const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const change=(next:number)=>{
    if(next===active)return;
    if(timer.current)clearTimeout(timer.current);
    setDirection(next>active?1:-1);
    setPrevious(active);
    setActive(next);
    timer.current=setTimeout(()=>setPrevious(null),430);
  };
  useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);
  const current=routeTypes[active];
  const previousItem=previous===null?null:routeTypes[previous];
  return <section className={`${styles.section} ${styles.routeTypes}`} aria-labelledby="route-types-title">
    <div className={styles.centerHead}>
      <p className="eyebrow">Tipos de roteiro</p>
      <h2 id="route-types-title">Encontre um ritmo para os seus dias</h2>
      <p>Troque o foco sem perder a sensação de continuidade entre texto, imagem e informações.</p>
    </div>
    <div className={styles.routeTabs} role="tablist" aria-label="Tipos de roteiro">
      {routeTypes.map((item,index)=><button key={item.name} type="button" role="tab" aria-selected={active===index} className={active===index?styles.routeTabActive:styles.routeTab} onClick={()=>change(index)}>{item.name}</button>)}
    </div>
    <div className={styles.slideViewport} data-testid="home-route-slider" aria-live="polite">
      {previousItem&&<article aria-hidden="true" className={`${styles.routeSlide} ${direction===1?styles.slideOutLeft:styles.slideOutRight}`}>
        <RouteSlideContent item={previousItem}/>
      </article>}
      <article key={current.name} className={`${styles.routeSlide} ${direction===1?styles.slideInRight:styles.slideInLeft}`}>
        <RouteSlideContent item={current}/>
      </article>
    </div>
  </section>;
}

function RouteSlideContent({item}:{item:(typeof routeTypes)[number]}){
  return <>
    <div className={styles.slideCopy}>
      <span className={styles.slideIcon}><Icon name={item.icon}/></span>
      <p className="eyebrow">{item.name}</p>
      <h3>{item.title}</h3>
      <p>{item.copy}</p>
      <Link href={`/roteiro?profile=${encodeURIComponent(item.name.toLowerCase())}`}>Montar este roteiro</Link>
    </div>
    <div className={styles.slideVisual} aria-hidden="true"><img src="/placeholders/gallery.svg" alt=""/></div>
    <aside className={styles.slideMeta}>
      <strong>O que muda</strong>
      <span>ordem das paradas</span>
      <span>tempo entre atividades</span>
      <span>alternativas para o contexto</span>
    </aside>
  </>;
}

function PartnerGallery({partners}:{partners:ContentData[]}){
  const items=partners.length?partners:[];
  const [active,setActive]=useState(0);
  const [centerHover,setCenterHover]=useState(false);
  const dragStart=useRef<number|null>(null);
  const dragged=useRef(false);
  const wheelLock=useRef(false);
  const move=(delta:number)=>setActive(value=>(value+delta+items.length)%items.length);
  if(!items.length)return <p className="empty">Nenhum parceiro publicado nesta seleção.</p>;
  const onPointerDown=(event:ReactPointerEvent<HTMLDivElement>)=>{dragStart.current=event.clientX;dragged.current=false;event.currentTarget.setPointerCapture(event.pointerId);};
  const onPointerMove=(event:ReactPointerEvent<HTMLDivElement>)=>{if(dragStart.current!==null&&Math.abs(event.clientX-dragStart.current)>10)dragged.current=true;};
  const onPointerUp=(event:ReactPointerEvent<HTMLDivElement>)=>{
    if(dragStart.current===null)return;
    const delta=event.clientX-dragStart.current;
    dragStart.current=null;
    if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);
    if(Math.abs(delta)>45)move(delta<0?1:-1);
  };
  const onWheel=(event:ReactWheelEvent<HTMLDivElement>)=>{
    if(wheelLock.current||Math.abs(event.deltaY)+Math.abs(event.deltaX)<12)return;
    wheelLock.current=true;
    move((event.deltaY||event.deltaX)>0?1:-1);
    window.setTimeout(()=>{wheelLock.current=false;},320);
  };
  return <>
    <div className={styles.galleryViewport}>
      <div className={styles.galleryStage} data-testid="home-partner-gallery" data-center-hover={centerHover?'true':'false'} tabIndex={0} aria-label="Galeria de parceiros. Arraste, role ou use as setas do teclado." onKeyDown={event=>{if(event.key==='ArrowLeft'){event.preventDefault();move(-1);}if(event.key==='ArrowRight'){event.preventDefault();move(1);}}} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={()=>{dragStart.current=null;dragged.current=false;}} onWheel={onWheel} onClickCapture={event=>{if(dragged.current){event.preventDefault();event.stopPropagation();dragged.current=false;}}}>
        {items.map((place,index)=>{
          const offset=circularOffset(index,active,items.length);
          const visible=Math.abs(offset)<=2;
          const distance=Math.abs(offset);
          const style={
            '--x':`${offset*285}px`,
            '--y':`${distance*34}px`,
            '--z':`${distance*-95}px`,
            '--rot':`${offset*-4}deg`,
            '--opacity':String(1-distance*.18),
            '--stack':String(10-distance),
          } as CSSProperties;
          return <div key={place.id} className={styles.galleryPosition} data-offset={offset} data-visible={visible?'true':'false'} style={style} aria-hidden={!visible}>
            <div className={styles.galleryMotion} onPointerEnter={()=>offset===0&&setCenterHover(true)} onPointerLeave={()=>offset===0&&setCenterHover(false)}>
              <PlaceCard place={place}/>
            </div>
          </div>;
        })}
      </div>
    </div>
    <div className={styles.galleryControls}>
      <button type="button" aria-label="Parceiro anterior" onClick={()=>move(-1)}><Icon name="chevron-esquerda"/></button>
      <p>ARRASTE · ROLE · USE AS SETAS</p>
      <button type="button" aria-label="Próximo parceiro" onClick={()=>move(1)}><Icon name="chevron-direita"/></button>
    </div>
    <div className={styles.galleryDots} aria-label="Posição da galeria">{items.map((place,index)=><button key={place.id} type="button" aria-label={`Mostrar ${place.name}`} aria-pressed={index===active} onClick={()=>setActive(index)}/>)}</div>
  </>;
}

function FAQ(){
  const [open,setOpen]=useState(0);
  return <div className={styles.faqList} data-testid="home-faq">{faqs.map(([question,answer],index)=>{
    const expanded=open===index;
    const answerId=`faq-answer-${index}`;
    return <article className={styles.faqItem} key={question}>
      <h3><button type="button" aria-expanded={expanded} aria-controls={answerId} onClick={()=>setOpen(expanded?-1:index)}>{question}<span className={styles.faqChevron} aria-hidden="true"><Icon name="chevron-baixo"/></span></button></h3>
      <div id={answerId} className={styles.faqAnswerGrid} data-open={expanded?'true':'false'}><div><p>{answer}</p></div></div>
    </article>;
  })}</div>;
}

export default function HomeExperience({featured,partners,categories,routePlaces}:Props){
  const startCategories=useMemo(()=>categories.slice(0,4),[categories]);
  return <>
    <section className={styles.hero} data-testid="home-hero">
      <div className={styles.heroBackdrop} aria-hidden="true"><img src="/placeholders/hero.svg" alt=""/></div>
      <div className={styles.heroContent}>
        <p className="eyebrow">Descoberta · planejamento · memória</p>
        <h1>Descubra Serra Negra do seu jeito.</h1>
        <p className="lead">Organize os dias da sua viagem e guarde os lugares que fizeram parte dela.</p>
        <form className={styles.heroSearch} action="/explorar" method="get" role="search">
          <label className="sr-only" htmlFor="home-search">Buscar lugares e experiências</label>
          <Icon name="busca"/>
          <input id="home-search" name="q" type="search" placeholder="O que você gostaria de encontrar?"/>
          <button className="primary" type="submit">Explorar</button>
        </form>
        <div className={styles.heroFilters} aria-label="Atalhos por interesse">{categories.slice(0,5).map(category=><Link key={category.id} href={`/explorar?category=${category.id}`}>{category.name}</Link>)}</div>
      </div>
    </section>

    <section className={`${styles.section} ${styles.firstPaths}`} aria-labelledby="first-paths-title">
      <div className={styles.sectionHead}>
        <div><p className="eyebrow">Primeiros caminhos</p><h2 id="first-paths-title">Conheça Serra Negra</h2></div>
        <Link className={styles.secondaryLink} href="/explorar?relation=public_point">Conhecer todos os pontos <Icon name="avancar" size="sm"/></Link>
      </div>
      <div className={styles.featuredGrid} data-testid="home-featured-grid">{featured.map(place=><PlaceCard key={place.id} place={place}/>)}</div>
    </section>

    <section className={`${styles.section} ${styles.meetings}`} aria-labelledby="meetings-title">
      <div className={styles.centerHead}><p className="eyebrow">Encontros pelo caminho</p><h2 id="meetings-title">Parceiros de demonstração</h2><p>Descubra negócios e experiências que podem entrar no caminho sem transformar a viagem em uma lista rígida.</p></div>
      <PartnerGallery partners={partners}/>
    </section>

    <section className={`${styles.section} ${styles.routeLine}`} aria-labelledby="route-line-title">
      <div className={styles.centerHead}><p className="eyebrow">A linha conecta a experiência</p><h2 id="route-line-title">Veja como as escolhas se encontram</h2><p>Cada parada continua no mesmo lugar; a interação apenas destaca o ponto e ajuda a ler o percurso.</p></div>
      <div className={styles.routeTrack} data-testid="home-route-track">{routePlaces.slice(0,4).map((place,index)=><div className={styles.routeStop} key={place.id}>
        <span className={styles.routeDot}>{index+1}</span><strong>{place.name}</strong><small>{place.durationMinutes||60} min</small>
      </div>)}</div>
    </section>

    <RouteTypeSlider/>

    <section className={`${styles.section} ${styles.startPoint}`} aria-labelledby="start-point-title">
      <div className={styles.centerHead}><p className="eyebrow">Escolha um ponto de partida</p><h2 id="start-point-title">Comece por aquilo que combina com você</h2><p>Use um interesse como primeiro filtro. O restante do roteiro pode ser ajustado depois.</p></div>
      <div className={styles.startGrid}>{startCategories.map(category=><Link className={styles.startCard} key={category.id} href={`/roteiro?interest=${category.id}`}><span className={styles.startIcon}><Icon name={categoryIcon(category)}/></span><strong>{category.name}</strong><span>Explorar este caminho</span></Link>)}</div>
    </section>

    <section className={`${styles.section} ${styles.contextual}`} aria-labelledby="contextual-title">
      <div className={styles.centerHead}><p className="eyebrow">Descoberta contextual</p><h2 id="contextual-title">O mesmo lugar pode fazer sentido em momentos diferentes.</h2><p>O contexto da viagem ajuda a organizar possibilidades sem transformar a descoberta em uma sequência fixa.</p><Link className="button" href="/explorar">Ver possibilidades</Link></div>
      <div className={styles.contextGrid}>
        <article className="panel"><Icon name="clima-parcialmente-nublado"/><h3>Contexto do dia</h3><p>Clima e disponibilidade ajudam a decidir quando uma parada faz mais sentido.</p></article>
        <article className="panel"><Icon name="roteiro"/><h3>Ritmo da viagem</h3><p>O roteiro pode equilibrar atividades, pausas e deslocamentos.</p></article>
        <article className="panel"><Icon name="passaporte"/><h3>Memória depois</h3><p>O Passaporte separa aquilo que foi planejado do que realmente foi vivido.</p></article>
      </div>
    </section>

    <section className={`${styles.section} ${styles.interests}`} aria-labelledby="interests-title">
      <div className={styles.centerHead}><p className="eyebrow">Explore por interesse</p><h2 id="interests-title">Encontre um caminho pelo que chama sua atenção</h2><p>Comece por um tema e continue explorando a cidade sem perder o contexto.</p><Link className="button" href="/explorar">Ver todos</Link></div>
      <div className={styles.interestGrid}>{categories.map(category=><Link className={styles.interestCard} key={category.id} href={`/explorar?category=${category.id}`}><span><Icon name={categoryIcon(category)}/></span><strong>{category.name}</strong><small>Explorar interesse</small></Link>)}</div>
    </section>

    <section className={`${styles.section} ${styles.faqMap}`} aria-labelledby="faq-title">
      <div><p className="eyebrow">Perguntas frequentes</p><h2 id="faq-title">Antes de começar</h2><FAQ/></div>
      <div className={styles.mapWrap}><MockMap places={routePlaces.slice(0,4)}/></div>
    </section>

    <section className={`${styles.section} ${styles.finalCta}`} aria-labelledby="next-path-title" data-testid="home-final-cta">
      <p className="eyebrow">Seu próximo caminho</p>
      <h2 id="next-path-title"><span>Comece pela curiosidade.</span><span>O roteiro vem depois.</span></h2>
      <p>Explore primeiro, organize quando fizer sentido e guarde o que realmente entrou para a sua viagem.</p>
      <div className="actions"><Link className="button primary" href="/roteiro">Montar meu roteiro</Link><Link className="button" href="/explorar">Continuar explorando</Link></div>
    </section>
  </>;
}
