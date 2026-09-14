'use client';

import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import type {CSSProperties,PointerEvent as ReactPointerEvent,WheelEvent as ReactWheelEvent} from 'react';
import type {ContentData} from '@/core/db/schema';
import {PlaceCard,MockMap} from '@/components/content';
import {Icon} from '@/design-system/icons';
import type {IconName} from '@/design-system/icons/icon.types';
import {placeUrl} from '@/modules/content/urls';
import {READY_ROUTES,type ReadyRoutePreset} from '@/modules/trips/ready-routes';
import styles from '@/app/home.module.css';

type Props={featured:ContentData[];partners:ContentData[];categories:ContentData[];routePlaces:ContentData[]};
type GalleryStyle=CSSProperties&Record<'--x'|'--y'|'--z'|'--rot'|'--opacity'|'--stack'|'--blur'|'--side-scale'|'--hover-shift',string>;

const routeTypes=READY_ROUTES.slice(0,4);

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
  ['Preciso responder perguntas para começar?','Não. Você pode começar por um roteiro pronto e adaptar depois. Se preferir mais controle desde o início, use o planejamento personalizado.'],
  ['Os roteiros prontos ficam engessados?','Não. Eles funcionam como ponto de partida: você pode mover, trocar, remover, fixar e adicionar paradas.'],
  ['Qual é a diferença entre roteiro e Passaporte?','O roteiro organiza o que você pretende viver. O Passaporte registra o que realmente fez parte da viagem, sem misturar plano com presença.'],
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
      const node=ref.current;if(!node)return;
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
    if(event.pointerType==='touch'||!window.matchMedia('(hover:hover) and (pointer:fine)').matches||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const rect=event.currentTarget.getBoundingClientRect();
    setWarp(((event.clientX-rect.left)/Math.max(rect.width,1))*2-1,((event.clientY-rect.top)/Math.max(rect.height,1))*2-1);
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
    if(next===active)return;if(timer.current)clearTimeout(timer.current);
    const forward=(next-active+routeTypes.length)%routeTypes.length;
    setDirection(forward>0&&forward<=routeTypes.length/2?1:-1);setPrevious(active);setActive(next);
    timer.current=setTimeout(()=>setPrevious(null),700);
  };
  const onTabKey=(event:React.KeyboardEvent<HTMLButtonElement>,index:number)=>{
    if(!['ArrowRight','ArrowLeft','Home','End'].includes(event.key))return;
    event.preventDefault();let next=index;
    if(event.key==='ArrowRight')next=(index+1)%routeTypes.length;
    if(event.key==='ArrowLeft')next=(index-1+routeTypes.length)%routeTypes.length;
    if(event.key==='Home')next=0;if(event.key==='End')next=routeTypes.length-1;
    change(next);
    tabRefs.current[next]?.focus();
  };
  useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);
  const current=routeTypes[active];const previousItem=previous===null?null:routeTypes[previous];
  return <section className={`${styles.section} ${styles.routeTypes}`} aria-labelledby="route-types-title">
    <div className={styles.centerHead}>
      <p className="eyebrow">Roteiros para começar</p>
      <h2 id="route-types-title">Escolha um ponto de partida que combine com a sua viagem.</h2>
      <p>Cada roteiro parte de uma situação real e organiza uma primeira versão possível. Você adapta o ritmo, as paradas e a ordem conforme a viagem ganha forma.</p>
    </div>
    <div className={styles.routeTabs} role="tablist" aria-label="Roteiros prontos">
      {routeTypes.map((item,index)=><button ref={node=>{tabRefs.current[index]=node}} key={item.slug} type="button" role="tab" data-testid={`home-route-tab-${index}`} aria-selected={active===index} tabIndex={active===index?0:-1} className={active===index?styles.routeTabActive:styles.routeTab} onKeyDown={event=>onTabKey(event,index)} onClick={()=>change(index)}>{item.eyebrow}</button>)}
    </div>
    <div className={styles.slideViewport} data-testid="home-route-slider" aria-live="polite">
      {previousItem&&<article aria-hidden="true" inert className={`${styles.routeSlide} ${direction===1?styles.slideOutLeft:styles.slideOutRight}`}><RouteSlideContent item={previousItem}/></article>}
      <article key={current.slug} className={`${styles.routeSlide} ${direction===1?styles.slideInRight:styles.slideInLeft}`}><RouteSlideContent item={current}/></article>
    </div>
    <div className="actions" style={{justifyContent:'center',marginTop:'1.25rem'}}><Link className="button" href="/roteiros">Ver todos os roteiros</Link><Link className="button" href="/roteiro">Planejar minha viagem</Link></div>
  </section>;
}

function RouteSlideContent({item}:{item:ReadyRoutePreset}){
  return <>
    <div className={styles.slideCopy}>
      <span className={styles.slideIcon}><Icon name="roteiro"/></span>
      <p className="eyebrow">{item.durationDays} {item.durationDays===1?'dia':'dias'} · {item.paceLabel}</p>
      <h3>{item.title}</h3>
      <p>{item.summary}</p>
      <Link href={`/roteiros/${item.slug}`}>Conhecer este roteiro</Link>
    </div>
    <div className={styles.slideVisual} aria-hidden="true"><img src={item.image} alt=""/></div>
    <aside className={styles.slideMeta}>
      <strong>O que você pode mudar</strong>
      <span>paradas e ordem</span><span>horários e ritmo</span><span>novas descobertas</span>
    </aside>
  </>;
}

function PartnerGallery({partners}:{partners:ContentData[]}){
  const items=partners.length?partners:[];
  const [active,setActive]=useState(0);const [centerHover,setCenterHover]=useState(false);
  const stageRef=useRef<HTMLDivElement>(null);
  const drag=useRef<{startX:number;lastX:number;lastTime:number;velocity:number}|null>(null);
  const dragged=useRef(false);const pointerFrame=useRef<number|null>(null);const wheelLock=useRef(false);const wheelTimer=useRef<number|null>(null);
  useEffect(()=>()=>{if(wheelTimer.current)window.clearTimeout(wheelTimer.current);if(pointerFrame.current!==null)cancelAnimationFrame(pointerFrame.current);},[]);
  const move=(delta:number)=>{if(items.length)setActive(value=>(value+delta+items.length)%items.length);};
  if(!items.length)return <p className="empty">Nenhum parceiro publicado nesta seleção.</p>;
  const writeDrag=(px:number)=>{if(pointerFrame.current!==null)cancelAnimationFrame(pointerFrame.current);pointerFrame.current=requestAnimationFrame(()=>{stageRef.current?.style.setProperty('--drag-shift',`${Math.max(-90,Math.min(90,px))}px`);pointerFrame.current=null;});};
  const resetDrag=()=>{stageRef.current?.style.setProperty('--drag-shift','0px');stageRef.current?.removeAttribute('data-dragging');};
  const onPointerDown=(event:ReactPointerEvent<HTMLDivElement>)=>{const now=performance.now();drag.current={startX:event.clientX,lastX:event.clientX,lastTime:now,velocity:0};dragged.current=false;event.currentTarget.setPointerCapture(event.pointerId);event.currentTarget.dataset.dragging='true';};
  const onPointerMove=(event:ReactPointerEvent<HTMLDivElement>)=>{const state=drag.current;if(!state)return;const now=performance.now();const delta=event.clientX-state.startX;state.velocity=(event.clientX-state.lastX)/Math.max(1,now-state.lastTime);state.lastX=event.clientX;state.lastTime=now;if(Math.abs(delta)>8)dragged.current=true;writeDrag(delta*.34);};
  const onPointerUp=(event:ReactPointerEvent<HTMLDivElement>)=>{const state=drag.current;if(!state)return;const projected=(event.clientX-state.startX)+state.velocity*180;drag.current=null;if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);resetDrag();const magnitude=Math.abs(projected)>190?2:Math.abs(projected)>42?1:0;if(magnitude)move(projected<0?magnitude:-magnitude);};
  const onWheel=(event:ReactWheelEvent<HTMLDivElement>)=>{if(wheelLock.current||Math.abs(event.deltaY)+Math.abs(event.deltaX)<12)return;wheelLock.current=true;move((event.deltaY||event.deltaX)>0?1:-1);if(wheelTimer.current)window.clearTimeout(wheelTimer.current);wheelTimer.current=window.setTimeout(()=>{wheelLock.current=false;wheelTimer.current=null;},280);};
  const centerCard=(index:number)=>{setActive(index);requestAnimationFrame(()=>stageRef.current?.focus({preventScroll:true}));};
  return <>
    <div className={styles.galleryViewport}><div ref={stageRef} className={styles.galleryStage} data-testid="home-partner-gallery" data-center-hover={centerHover?'true':'false'} tabIndex={0} aria-label="Galeria de parceiros. Arraste, role, clique em um card lateral ou use as setas do teclado." onKeyDown={event=>{if(event.key==='ArrowLeft'){event.preventDefault();move(-1);}if(event.key==='ArrowRight'){event.preventDefault();move(1);}}} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={()=>{drag.current=null;dragged.current=false;resetDrag();}} onWheel={onWheel} onClickCapture={event=>{if(dragged.current){event.preventDefault();event.stopPropagation();dragged.current=false;}}}>
      {items.map((place,index)=>{const offset=circularOffset(index,active,items.length);const visible=Math.abs(offset)<=2;const distance=Math.abs(offset);const style={'--x':`calc(${offset} * clamp(230px, 34cqi, 440px))`,'--y':`${distance*24}px`,'--z':`${distance*-110}px`,'--rot':`${offset*-4}deg`,'--opacity':String(Math.max(.48,1-distance*.2)),'--stack':String(10-distance),'--blur':`${distance*2.5}px`,'--side-scale':String(1-distance*.08),'--hover-shift':`calc(${offset} * clamp(42px, 6cqi, 86px))`} as GalleryStyle;return <div key={place.id} className={styles.galleryPosition} data-offset={offset} data-visible={visible?'true':'false'} style={style}><div className={styles.galleryMotion} aria-hidden={offset!==0} inert={offset!==0} onPointerEnter={()=>offset===0&&setCenterHover(true)} onPointerLeave={()=>offset===0&&setCenterHover(false)}><PlaceCard place={place}/></div>{visible&&offset!==0&&<button type="button" data-testid={`home-gallery-center-${index}`} className={styles.gallerySideActivate} aria-label={`Centralizar ${place.name}`} onPointerDown={event=>event.stopPropagation()} onClick={()=>centerCard(index)}/>}</div>;})}
    </div></div>
    <p className="sr-only" aria-live="polite">Parceiro em destaque: {items[active]?.name}</p>
    <div className={styles.galleryControls}><button type="button" aria-label="Parceiro anterior" onClick={()=>move(-1)}><Icon name="chevron-esquerda"/></button><p>ARRASTE · ROLE · CLIQUE · USE AS SETAS</p><button type="button" aria-label="Próximo parceiro" onClick={()=>move(1)}><Icon name="chevron-direita"/></button></div>
    <div className={styles.galleryDots} aria-label="Posição da galeria">{items.map((place,index)=><button key={place.id} type="button" data-testid={`home-gallery-dot-${index}`} aria-label={`Mostrar ${place.name}`} aria-pressed={index===active} onClick={()=>centerCard(index)}/>)}</div>
  </>;
}

function FAQ(){
  const [open,setOpen]=useState(-1);
  return <div className={styles.faqList} data-testid="home-faq">{faqs.map(([question,answer],index)=>{const expanded=open===index;const answerId=`faq-answer-${index}`;return <article className={styles.faqItem} key={question}><h3><button type="button" data-testid={`home-faq-trigger-${index}`} aria-expanded={expanded} aria-controls={answerId} onClick={()=>setOpen(expanded?-1:index)}>{question}<span className={styles.faqChevron} aria-hidden="true"><Icon name="chevron-baixo"/></span></button></h3><div id={answerId} data-testid={`home-faq-answer-${index}`} className={styles.faqAnswerGrid} data-open={expanded?'true':'false'}><div><p>{answer}</p></div></div></article>;})}</div>;
}

export default function HomeExperience({featured,partners,categories,routePlaces}:Props){
  return <>
    <section className={styles.hero} data-testid="home-hero">
      <div className={styles.heroBackdrop} aria-hidden="true"><img src="/assets/brand/hero/serra-negra-header-2048.webp" alt=""/></div>
      <div className={styles.heroContent}>
        <p className="eyebrow">Descubra · organize · adapte · registre</p>
        <WarpTitle/>
        <p className="lead">O Passaporte conecta o que você quer viver com lugares, experiências e negócios locais para transformar intenção em um caminho possível por Serra Negra.</p>
        <div className="actions"><Link className="button primary" href="/roteiros">Explorar roteiros</Link><Link className="button" href="/roteiro">Planejar minha viagem</Link></div>
        <form className={styles.heroSearch} action="/explorar" method="get" role="search">
          <label className="sr-only" htmlFor="home-search">Buscar lugares e experiências</label><Icon name="busca"/><input id="home-search" name="q" type="search" placeholder="Busque um lugar, café, mirante…"/><button type="submit">Buscar</button>
        </form>
      </div>
    </section>

    <RouteTypeSlider/>

    <section className={`${styles.section} ${styles.routeLine}`} aria-labelledby="route-line-title">
      <div className={styles.centerHead}><p className="eyebrow">Da intenção ao caminho</p><h2 id="route-line-title">Transforme escolhas soltas em um dia que faz sentido.</h2><p>O Passaporte ajuda a aproximar lugares, tempo e deslocamento para que o roteiro funcione como caminho, não como lista.</p></div>
      <div className={styles.routeTrack} data-testid="home-route-track">{routePlaces.slice(0,4).map((place,index)=><Link className={styles.routeStop} href={placeUrl(place)} key={place.id}><span className={styles.routeDot}>{index+1}</span><strong>{place.name}</strong><small>{place.durationMinutes||60} min</small></Link>)}</div>
      <div className="actions" style={{justifyContent:'center',marginTop:'1.5rem'}}><Link className="button primary" href="/roteiros">Escolher um roteiro</Link></div>
    </section>

    <section className={`${styles.section} ${styles.meetings}`} aria-labelledby="meetings-title">
      <div className={styles.centerHead}><p className="eyebrow">Descobertas no momento certo</p><h2 id="meetings-title">Negócios locais aparecem quando acrescentam algo ao seu caminho.</h2><p>Cafés, produtores, restaurantes e experiências entram como descobertas compatíveis com o percurso e com o que você procura, não como anúncios soltos.</p></div>
      <PartnerGallery partners={partners}/>
    </section>

    <section className={`${styles.section} ${styles.contextual}`} aria-labelledby="contextual-title">
      <div className={styles.centerHead}><p className="eyebrow">O dia muda. O roteiro também.</p><h2 id="contextual-title">Seu plano continua útil quando a viagem muda.</h2><p>Clima, horários, ritmo e novas descobertas podem alterar o dia. Você reorganiza o percurso sem perder o que já decidiu.</p></div>
      <div className={styles.contextGrid}>
        <article className="panel"><Icon name="clima-parcialmente-nublado"/><h3>Contexto do dia</h3><p>Compare alternativas conforme clima, horários e o tempo disponível.</p></article>
        <article className="panel"><Icon name="roteiro"/><h3>Ritmo da viagem</h3><p>Mude a ordem, reduza ou acrescente paradas sem reconstruir tudo.</p></article>
        <article className="panel"><Icon name="passaporte"/><h3>Memória do que foi vivido</h3><p>O Passaporte separa o que estava planejado do que realmente aconteceu.</p></article>
      </div>
    </section>

    <section className={`${styles.section} ${styles.firstPaths}`} aria-labelledby="first-paths-title">
      <div className={styles.sectionHead}><div><p className="eyebrow">Explore o território</p><h2 id="first-paths-title">Descubra lugares antes de decidir o que entra no roteiro</h2></div><Link className={styles.secondaryLink} href="/pontos-turisticos">Ver todos os pontos <Icon name="avancar" size="sm"/></Link></div>
      <div className={styles.featuredGrid} data-testid="home-featured-grid">{featured.map(place=><PlaceCard key={place.id} place={place}/>)}</div>
    </section>

    <section className={`${styles.section} ${styles.interests}`} aria-labelledby="interests-title">
      <div className={styles.centerHead}><p className="eyebrow">Explore do seu jeito</p><h2 id="interests-title">Ainda sem roteiro? Comece pelo que desperta sua curiosidade.</h2><p>Navegue por interesses e encontre descobertas que podem ganhar lugar na sua viagem quando fizer sentido.</p><Link className="button" href="/explorar">Explorar por interesse</Link></div>
      <div className={styles.interestGrid}>{categories.map(category=><Link className={styles.interestCard} key={category.id} href={`/explorar?category=${category.id}`}><span><Icon name={categoryIcon(category)}/></span><strong>{category.name}</strong><small>Ver descobertas</small></Link>)}</div>
    </section>

    <section className={`${styles.section} ${styles.passportIntro}`} aria-labelledby="passport-intro-title">
      <div className={styles.passportPaper} aria-hidden="true"><img src="/assets/brand/passport/folha-passaporte.svg" alt=""/></div>
      <div><p className="eyebrow">De roteiro a memória</p><h2 id="passport-intro-title">O plano termina. A experiência fica.</h2><p>O roteiro registra intenção. O Passaporte guarda os lugares que realmente fizeram parte da viagem e transforma o percurso vivido em memória.</p><div className="actions"><Link className="button primary" href="/meu-passaporte">Ver meu Passaporte</Link><Link className="button" href="/roteiros">Escolher um roteiro</Link></div></div>
    </section>

    <section className={`${styles.section} ${styles.mapSection}`} aria-labelledby="map-context-title">
      <div className={styles.centerHead}><p className="eyebrow">Proximidade importa</p><h2 id="map-context-title">Veja o que cabe no mesmo dia antes de atravessar a cidade.</h2><p>Use o mapa para entender distâncias, combinar paradas próximas e construir um percurso mais coerente.</p><Link className="button" href="/mapa">Explorar no mapa</Link></div>
      <div className={styles.mapWrap}><MockMap places={routePlaces.slice(0,6)}/></div>
    </section>

    <section className={`${styles.section} ${styles.faqOnly}`} aria-labelledby="faq-title">
      <div className={styles.centerHead}><p className="eyebrow">Como funciona</p><h2 id="faq-title">Você escolhe quanto quer planejar.</h2><p>Comece por uma base pronta ou personalize desde o início. Em qualquer caminho, o roteiro continua editável e o Passaporte registra o que foi vivido.</p></div><FAQ/>
    </section>

    <section className={`${styles.section} ${styles.finalCta}`} aria-labelledby="next-path-title" data-testid="home-final-cta">
      <p className="eyebrow">Seu próximo caminho</p>
      <h2 id="next-path-title"><span>Comece com uma direção.</span><span>Faça a viagem ganhar a sua forma.</span></h2>
      <p>Escolha um roteiro que combine com o momento da sua viagem ou planeje uma versão personalizada. O Passaporte acompanha suas escolhas até elas virarem experiência.</p>
      <div className="actions"><Link className="button primary" href="/roteiros">Explorar roteiros</Link><Link className="button" href="/roteiro">Planejar minha viagem</Link></div>
    </section>
  </>;
}
