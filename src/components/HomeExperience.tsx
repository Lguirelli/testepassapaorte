'use client';

import {useEffect,useMemo,useRef,useState} from 'react';
import Link from 'next/link';
import type {CSSProperties,PointerEvent as ReactPointerEvent,WheelEvent as ReactWheelEvent} from 'react';
import type {ContentData} from '@/core/db/schema';
import {PlaceCard,MockMap} from '@/components/content';
import {Icon} from '@/design-system/icons';
import type {IconName} from '@/design-system/icons/icon.types';
import {placeUrl} from '@/modules/content/urls';
import styles from '@/app/home.module.css';

type Props={featured:ContentData[];partners:ContentData[];categories:ContentData[];routePlaces:ContentData[]};

type GalleryStyle=CSSProperties&Record<'--x'|'--y'|'--z'|'--rot'|'--opacity'|'--stack'|'--blur'|'--side-scale'|'--hover-shift',string>;

const routeTypes=[
  {name:'Primeira visita',title:'Um começo equilibrado',copy:'Misture referências da cidade, pausas e descobertas sem concentrar tudo no mesmo período.',icon:'roteiro',image:'/assets/tourism/fontana-di-trevi.jpg',imagePosition:'center 52%'},
  {name:'Natureza',title:'Mais tempo ao ar livre',copy:'Priorize mirantes, jardins e experiências abertas, deixando margem para o ritmo do dia.',icon:'lugar-outdoor',image:'/assets/tourism/mirante-alto-da-serra.jpg',imagePosition:'center 54%'},
  {name:'Gastronomia',title:'Paradas que também contam a viagem',copy:'Distribua cafés, refeições e produtores locais entre os deslocamentos do roteiro.',icon:'perfil-relaxar',image:'/assets/tourism/feira-artesanato.jpg',imagePosition:'center'},
  {name:'Dia de chuva',title:'Um plano que continua funcionando',copy:'Reorganize o dia com experiências cobertas e mantenha alternativas para quando o tempo mudar.',icon:'clima-chuva',image:'/assets/tourism/igreja-nossa-senhora-rosario.jpg',imagePosition:'center'},
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
  ['Os pontos turísticos são reais?','Sim. A descoberta pública usa atrativos pesquisados de Serra Negra com proveniência registrada. Parceiros ainda não confirmados aparecem explicitamente como demonstração.'],
  ['É possível reservar ou pagar pelo Passaporte?','Não nesta fase. Quando um local oferece reserva externa, o Passaporte apenas encaminha para o canal informado e preserva o contexto da viagem.'],
  ['O roteiro muda quando eu ajusto minhas escolhas?','Sim. O roteiro pode ser reorganizado sem apagar silenciosamente paradas fixadas ou alterações manuais feitas por você.'],
] as const;

function circularOffset(index:number,active:number,total:number){
  const raw=(index-active+total)%total;
  return raw>total/2?raw-total:raw;
}

function WarpTitle(){
  const ref=useRef<HTMLHeadingElement>(null);
  const frame=useRef<number|null>(null);

  useEffect(()=>()=>{if(frame.current!==null)cancelAnimationFrame(frame.current);},[]);

  const setWarp=(x:number,y:number)=>{
    if(frame.current!==null)cancelAnimationFrame(frame.current);
    frame.current=requestAnimationFrame(()=>{
      const node=ref.current;
      if(!node)return;
      node.style.setProperty('--warp-a-x',`${x*10}px`);
      node.style.setProperty('--warp-a-y',`${y*4}px`);
      node.style.setProperty('--warp-a-rot',`${x*-.7}deg`);
      node.style.setProperty('--warp-b-x',`${x*-13}px`);
      node.style.setProperty('--warp-b-y',`${y*-5}px`);
      node.style.setProperty('--warp-b-rot',`${x*.9}deg`);
      node.style.setProperty('--warp-glow-x',`${50+x*13}%`);
      node.style.setProperty('--warp-glow-y',`${45+y*10}%`);
      frame.current=null;
    });
  };

  const onPointerMove=(event:ReactPointerEvent<HTMLHeadingElement>)=>{
    if(event.pointerType==='touch')return;
    if(!window.matchMedia('(hover:hover) and (pointer:fine)').matches)return;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const rect=event.currentTarget.getBoundingClientRect();
    const x=((event.clientX-rect.left)/Math.max(rect.width,1))*2-1;
    const y=((event.clientY-rect.top)/Math.max(rect.height,1))*2-1;
    setWarp(x,y);
  };

  return <h1 ref={ref} data-testid="home-warp-title" className={styles.warpTitle} onPointerMove={onPointerMove} onPointerLeave={()=>setWarp(0,0)} aria-label="Descubra Serra Negra do seu jeito.">
    <span className={styles.warpLineA} aria-hidden="true">Descubra Serra Negra</span>
    <span className={styles.warpLineB} aria-hidden="true">do seu jeito.</span>
  </h1>;
}

function RouteTypeSlider(){
  const [active,setActive]=useState(0);
  const [previous,setPrevious]=useState<number|null>(null);
  const [direction,setDirection]=useState<1|-1>(1);
  const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const tabRefs=useRef<Array<HTMLButtonElement|null>>([]);

  const change=(next:number)=>{
    if(next===active)return;
    if(timer.current)clearTimeout(timer.current);
    const forward=(next-active+routeTypes.length)%routeTypes.length;
    setDirection(forward>0&&forward<=routeTypes.length/2?1:-1);
    setPrevious(active);
    setActive(next);
    timer.current=setTimeout(()=>setPrevious(null),700);
  };

  const onTabKey=(event:React.KeyboardEvent<HTMLButtonElement>,index:number)=>{
    if(!['ArrowRight','ArrowLeft','Home','End'].includes(event.key))return;
    event.preventDefault();
    let next=index;
    if(event.key==='ArrowRight')next=(index+1)%routeTypes.length;
    if(event.key==='ArrowLeft')next=(index-1+routeTypes.length)%routeTypes.length;
    if(event.key==='Home')next=0;
    if(event.key==='End')next=routeTypes.length-1;
    change(next);
    requestAnimationFrame(()=>tabRefs.current[next]?.focus());
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
      {routeTypes.map((item,index)=><button ref={node=>{tabRefs.current[index]=node}} key={item.name} type="button" role="tab" data-testid={`home-route-tab-${index}`} aria-selected={active===index} tabIndex={active===index?0:-1} className={active===index?styles.routeTabActive:styles.routeTab} onKeyDown={event=>onTabKey(event,index)} onClick={()=>change(index)}>{item.name}</button>)}
    </div>
    <div className={styles.slideViewport} data-testid="home-route-slider" aria-live="polite">
      {previousItem&&<article aria-hidden="true" inert className={`${styles.routeSlide} ${direction===1?styles.slideOutLeft:styles.slideOutRight}`}><RouteSlideContent item={previousItem}/></article>}
      <article key={current.name} className={`${styles.routeSlide} ${direction===1?styles.slideInRight:styles.slideInLeft}`}><RouteSlideContent item={current}/></article>
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
    <div className={styles.slideVisual} aria-hidden="true"><img src={item.image} style={{objectPosition:item.imagePosition}} alt=""/></div>
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
  const stageRef=useRef<HTMLDivElement>(null);
  const drag=useRef<{startX:number;startTime:number;lastX:number;lastTime:number;velocity:number}|null>(null);
  const dragged=useRef(false);
  const pointerFrame=useRef<number|null>(null);
  const wheelLock=useRef(false);
  const wheelTimer=useRef<number|null>(null);

  useEffect(()=>()=>{
    if(wheelTimer.current)window.clearTimeout(wheelTimer.current);
    if(pointerFrame.current!==null)cancelAnimationFrame(pointerFrame.current);
  },[]);
  useEffect(()=>{if(active>=items.length&&items.length)setActive(0);},[active,items.length]);

  const move=(delta:number)=>{
    if(!items.length)return;
    setActive(value=>(value+delta+items.length)%items.length);
  };

  if(!items.length)return <p className="empty">Nenhum parceiro publicado nesta seleção.</p>;

  const writeDrag=(px:number)=>{
    if(pointerFrame.current!==null)cancelAnimationFrame(pointerFrame.current);
    pointerFrame.current=requestAnimationFrame(()=>{
      stageRef.current?.style.setProperty('--drag-shift',`${Math.max(-90,Math.min(90,px))}px`);
      pointerFrame.current=null;
    });
  };

  const resetDrag=()=>{
    stageRef.current?.style.setProperty('--drag-shift','0px');
    stageRef.current?.removeAttribute('data-dragging');
  };

  const onPointerDown=(event:ReactPointerEvent<HTMLDivElement>)=>{
    const now=performance.now();
    drag.current={startX:event.clientX,startTime:now,lastX:event.clientX,lastTime:now,velocity:0};
    dragged.current=false;
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.dataset.dragging='true';
  };

  const onPointerMove=(event:ReactPointerEvent<HTMLDivElement>)=>{
    const state=drag.current;
    if(!state)return;
    const now=performance.now();
    const delta=event.clientX-state.startX;
    const elapsed=Math.max(1,now-state.lastTime);
    state.velocity=(event.clientX-state.lastX)/elapsed;
    state.lastX=event.clientX;
    state.lastTime=now;
    if(Math.abs(delta)>8)dragged.current=true;
    writeDrag(delta*.34);
  };

  const onPointerUp=(event:ReactPointerEvent<HTMLDivElement>)=>{
    const state=drag.current;
    if(!state)return;
    const delta=event.clientX-state.startX;
    const projected=delta+state.velocity*180;
    drag.current=null;
    if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);
    resetDrag();
    const magnitude=Math.abs(projected)>190?2:Math.abs(projected)>42?1:0;
    if(magnitude)move(projected<0?magnitude:-magnitude);
  };

  const onWheel=(event:ReactWheelEvent<HTMLDivElement>)=>{
    if(wheelLock.current||Math.abs(event.deltaY)+Math.abs(event.deltaX)<12)return;
    wheelLock.current=true;
    move((event.deltaY||event.deltaX)>0?1:-1);
    if(wheelTimer.current)window.clearTimeout(wheelTimer.current);
    wheelTimer.current=window.setTimeout(()=>{wheelLock.current=false;wheelTimer.current=null;},280);
  };

  const centerCard=(index:number)=>{
    setActive(index);
    requestAnimationFrame(()=>stageRef.current?.focus({preventScroll:true}));
  };

  return <>
    <div className={styles.galleryViewport}>
      <div ref={stageRef} className={styles.galleryStage} data-testid="home-partner-gallery" data-center-hover={centerHover?'true':'false'} tabIndex={0} aria-label="Galeria de parceiros. Arraste, role, clique em um card lateral ou use as setas do teclado." onKeyDown={event=>{if(event.key==='ArrowLeft'){event.preventDefault();move(-1);}if(event.key==='ArrowRight'){event.preventDefault();move(1);}}} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={()=>{drag.current=null;dragged.current=false;resetDrag();}} onWheel={onWheel} onClickCapture={event=>{if(dragged.current){event.preventDefault();event.stopPropagation();dragged.current=false;}}}>
        {items.map((place,index)=>{
          const offset=circularOffset(index,active,items.length);
          const visible=Math.abs(offset)<=2;
          const distance=Math.abs(offset);
          const style={
            '--x':`calc(${offset} * clamp(230px, 34cqi, 440px))`,
            '--y':`${distance*24}px`,
            '--z':`${distance*-110}px`,
            '--rot':`${offset*-4}deg`,
            '--opacity':String(Math.max(.48,1-distance*.2)),
            '--stack':String(10-distance),
            '--blur':`${distance*2.5}px`,
            '--side-scale':String(1-distance*.08),
            '--hover-shift':`calc(${offset} * clamp(42px, 6cqi, 86px))`,
          } as GalleryStyle;
          return <div key={place.id} className={styles.galleryPosition} data-offset={offset} data-visible={visible?'true':'false'} style={style}>
            <div className={styles.galleryMotion} aria-hidden={offset!==0} inert={offset!==0} onPointerEnter={()=>offset===0&&setCenterHover(true)} onPointerLeave={()=>offset===0&&setCenterHover(false)}><PlaceCard place={place}/></div>
            {visible&&offset!==0&&<button type="button" data-testid={`home-gallery-center-${index}`} className={styles.gallerySideActivate} aria-label={`Centralizar ${place.name}`} onPointerDown={event=>event.stopPropagation()} onClick={()=>centerCard(index)}/>} 
          </div>;
        })}
      </div>
    </div>
    <p className="sr-only" aria-live="polite">Parceiro em destaque: {items[active]?.name}</p>
    <div className={styles.galleryControls}>
      <button type="button" aria-label="Parceiro anterior" onClick={()=>move(-1)}><Icon name="chevron-esquerda"/></button>
      <p>ARRASTE · ROLE · CLIQUE · USE AS SETAS</p>
      <button type="button" aria-label="Próximo parceiro" onClick={()=>move(1)}><Icon name="chevron-direita"/></button>
    </div>
    <div className={styles.galleryDots} aria-label="Posição da galeria">{items.map((place,index)=><button key={place.id} type="button" data-testid={`home-gallery-dot-${index}`} aria-label={`Mostrar ${place.name}`} aria-pressed={index===active} onClick={()=>centerCard(index)}/>)}</div>
  </>;
}

function FAQ(){
  const [open,setOpen]=useState(-1);
  return <div className={styles.faqList} data-testid="home-faq">{faqs.map(([question,answer],index)=>{
    const expanded=open===index;
    const answerId=`faq-answer-${index}`;
    return <article className={styles.faqItem} key={question}>
      <h3><button type="button" data-testid={`home-faq-trigger-${index}`} aria-expanded={expanded} aria-controls={answerId} onClick={()=>setOpen(expanded?-1:index)}>{question}<span className={styles.faqChevron} aria-hidden="true"><Icon name="chevron-baixo"/></span></button></h3>
      <div id={answerId} data-testid={`home-faq-answer-${index}`} className={styles.faqAnswerGrid} data-open={expanded?'true':'false'}><div><p>{answer}</p></div></div>
    </article>;
  })}</div>;
}

export default function HomeExperience({featured,partners,categories,routePlaces}:Props){
  const startCategories=useMemo(()=>categories.slice(0,4),[categories]);
  return <>
    <section className={styles.hero} data-testid="home-hero">
      <div className={styles.heroBackdrop} aria-hidden="true"><img src="/assets/brand/hero/serra-negra-header-2048.webp" alt=""/></div>
      <div className={styles.heroContent}>
        <p className="eyebrow">Descoberta · planejamento · memória</p>
        <WarpTitle/>
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
      <div className={styles.sectionHead}><div><p className="eyebrow">Primeiros caminhos</p><h2 id="first-paths-title">Conheça Serra Negra</h2></div><Link className={styles.secondaryLink} href="/explorar?relation=public_point">Conhecer todos os pontos <Icon name="avancar" size="sm"/></Link></div>
      <div className={styles.featuredGrid} data-testid="home-featured-grid">{featured.map(place=><PlaceCard key={place.id} place={place}/>)}</div>
    </section>

    <section className={`${styles.section} ${styles.meetings}`} aria-labelledby="meetings-title">
      <div className={styles.centerHead}><p className="eyebrow">Encontros pelo caminho</p><h2 id="meetings-title">Descobertas que podem entrar no seu percurso</h2><p>Negócios locais confirmados poderão fazer parte desta rede. Enquanto a relação comercial não é confirmada, qualquer parceiro de teste permanece claramente identificado como DEMO.</p></div>
      <PartnerGallery partners={partners}/>
    </section>

    <section className={`${styles.section} ${styles.routeLine}`} aria-labelledby="route-line-title">
      <div className={styles.centerHead}><p className="eyebrow">A linha conecta a experiência</p><h2 id="route-line-title">Veja como as escolhas se encontram</h2><p>Cada parada permanece no percurso; a interação destaca o ponto e abre seu contexto sem deslocar a linha.</p></div>
      <div className={styles.routeTrack} data-testid="home-route-track">{routePlaces.slice(0,4).map((place,index)=><Link className={styles.routeStop} href={placeUrl(place)} key={place.id}><span className={styles.routeDot}>{index+1}</span><strong>{place.name}</strong><small>{place.durationMinutes||60} min</small></Link>)}</div>
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

    <section className={`${styles.section} ${styles.faqOnly}`} aria-labelledby="faq-title">
      <div className={styles.centerHead}><p className="eyebrow">Perguntas frequentes</p><h2 id="faq-title">Antes de começar</h2><p>O essencial para entender como descoberta, roteiro e registro se conectam.</p></div>
      <FAQ/>
    </section>

    <section className={`${styles.section} ${styles.passportIntro}`} aria-labelledby="passport-intro-title">
      <div className={styles.passportPaper} aria-hidden="true"><img src="/assets/brand/passport/folha-passaporte.svg" alt=""/></div>
      <div><p className="eyebrow">Meu Passaporte</p><h2 id="passport-intro-title">Planejar é uma coisa. Viver é outra.</h2><p>O roteiro organiza a intenção. O Passaporte guarda registros de presença e transforma a viagem em uma memória visual, sem confundir planejamento com visita realizada.</p><div className="actions"><Link className="button primary" href="/meu-passaporte">Conhecer o Passaporte</Link><Link className="button" href="/roteiro">Montar roteiro</Link></div></div>
    </section>

    <section className={`${styles.section} ${styles.mapSection}`} aria-labelledby="map-context-title">
      <div className={styles.centerHead}><p className="eyebrow">Serra Negra pelo território</p><h2 id="map-context-title">Veja os lugares no mesmo contexto.</h2><p>Mapa e lista compartilham a mesma base de lugares. A posição territorial ajuda a entender proximidades sem exigir rastreamento contínuo.</p><Link className="button" href="/mapa">Abrir mapa</Link></div>
      <div className={styles.mapWrap}><MockMap places={routePlaces.slice(0,6)}/></div>
    </section>

    <section className={`${styles.section} ${styles.finalCta}`} aria-labelledby="next-path-title" data-testid="home-final-cta">
      <p className="eyebrow">Seu próximo caminho</p>
      <h2 id="next-path-title"><span>Comece pela curiosidade.</span><span>O roteiro vem depois.</span></h2>
      <p>Explore primeiro, organize quando fizer sentido e guarde o que realmente entrou para a sua viagem.</p>
      <div className="actions"><Link className="button primary" href="/roteiro">Montar meu roteiro</Link><Link className="button" href="/explorar">Continuar explorando</Link></div>
    </section>
  </>;
}
