'use client';

import {useEffect,useMemo,useRef,useState} from 'react';
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
  ['Preciso responder perguntas para começar?','Não. O caminho principal é escolher um roteiro pronto e adaptá-lo. O questionário completo aparece apenas quando você decide criar uma viagem do zero.'],
  ['Os roteiros prontos ficam engessados?','Não. Ao usar uma base, ela vira uma viagem editável. Você pode mover, trocar, remover, fixar e adicionar paradas sem perder suas escolhas manuais.'],
  ['Qual é a diferença entre roteiro e Passaporte?','O roteiro organiza o que você pretende viver. O Passaporte registra o que realmente fez parte da viagem, mantendo planejamento e presença como coisas diferentes.'],
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
    change(next);requestAnimationFrame(()=>tabRefs.current[next]?.focus());
  };
  useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);
  const current=routeTypes[active];const previousItem=previous===null?null:routeTypes[previous];
  return <section className={`${styles.section} ${styles.routeTypes}`} aria-labelledby="route-types-title">
    <div className={styles.centerHead}>
      <p className="eyebrow">Roteiros para começar</p>
      <h2 id="route-types-title">Escolha uma boa base antes de pensar em cada detalhe.</h2>
      <p>Os roteiros partem de situações reais de viagem. Você escolhe um, cria sua própria versão e muda o que quiser depois.</p>
    </div>
    <div className={styles.routeTabs} role="tablist" aria-label="Roteiros prontos">
      {routeTypes.map((item,index)=><button ref={node=>{tabRefs.current[index]=node}} key={item.slug} type="button" role="tab" data-testid={`home-route-tab-${index}`} aria-selected={active===index} tabIndex={active===index?0:-1} className={active===index?styles.routeTabActive:styles.routeTab} onKeyDown={event=>onTabKey(event,index)} onClick={()=>change(index)}>{item.eyebrow}</button>)}
    </div>
    <div className={styles.slideViewport} data-testid="home-route-slider" aria-live="polite">
      {previousItem&&<article aria-hidden="true" inert className={`${styles.routeSlide} ${direction===1?styles.slideOutLeft:styles.slideOutRight}`}><RouteSlideContent item={previousItem}/></article>}
      <article key={current.slug} className={`${styles.routeSlide} ${direction===1?styles.slideInRight:styles.slideInLeft}`}><RouteSlideContent item={current}/></article>
    </div>
    <div className="actions" style={{justifyContent:'center',marginTop:'1.25rem'}}><Link className="button" href="/roteiros">Ver todos os roteiros</Link><Link className="button" href="/roteiro">Criar do zero</Link></div>
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
  const startCategories=useMemo(()=>categories.slice(0,4),[categories]);
  return <>
    <section className={styles.hero} data-testid="home-hero">
      <div className={styles.heroBackdrop} aria-hidden="true"><img src="/assets/brand/hero/serra-negra-header-2048.webp" alt=""/></div>
      <div className={styles.heroContent}>
        <p className="eyebrow">Roteiros prontos · liberdade para adaptar · memória</p>
        <WarpTitle/>
        <p className="lead">Comece por uma viagem já pensada para diferentes formas de viver a cidade. Use como está, adapte para você ou crie tudo do zero.</p>
        <div className="actions"><Link className="button primary" href="/roteiros">Explorar roteiros</Link><Link className="button" href="/roteiro">Criar do zero</Link></div>
        <form className={styles.heroSearch} action="/explorar" method="get" role="search">
          <label className="sr-only" htmlFor="home-search">Buscar lugares e experiências</label><Icon name="busca"/><input id="home-search" name="q" type="search" placeholder="Ou busque um lugar, café, mirante…"/><button type="submit">Explorar</button>
        </form>
      </div>
    </section>

    <RouteTypeSlider/>

    <section className={`${styles.section} ${styles.routeLine}`} aria-labelledby="route-line-title">
      <div className={styles.centerHead}><p className="eyebrow">Comece pronto. Depois faça virar seu.</p><h2 id="route-line-title">Uma boa base reduz decisões sem tirar seu controle.</h2><p>O roteiro organiza uma primeira sequência possível. A partir daí, cada parada pode ser trocada, movida, fixada ou removida.</p></div>
      <div className={styles.routeTrack} data-testid="home-route-track">{routePlaces.slice(0,4).map((place,index)=><Link className={styles.routeStop} href={placeUrl(place)} key={place.id}><span className={styles.routeDot}>{index+1}</span><strong>{place.name}</strong><small>{place.durationMinutes||60} min</small></Link>)}</div>
      <div className="actions" style={{justifyContent:'center',marginTop:'1.5rem'}}><Link className="button primary" href="/roteiros">Escolher um roteiro</Link></div>
    </section>

    <section className={`${styles.section} ${styles.meetings}`} aria-labelledby="meetings-title">
      <div className={styles.centerHead}><p className="eyebrow">Encontros pelo caminho</p><h2 id="meetings-title">Negócios locais entram quando fazem sentido para a viagem.</h2><p>O objetivo não é transformar o roteiro em uma lista de anúncios. Parceiros aparecem como descobertas compatíveis com o percurso, interesse e contexto.</p></div>
      <PartnerGallery partners={partners}/>
    </section>

    <section className={`${styles.section} ${styles.contextual}`} aria-labelledby="contextual-title">
      <div className={styles.centerHead}><p className="eyebrow">O roteiro acompanha o contexto</p><h2 id="contextual-title">Planejar ajuda. Poder mudar é o que torna o plano útil.</h2><p>Clima, ritmo e escolhas ao longo do dia podem mudar. A viagem deve continuar legível mesmo quando a ordem original deixa de fazer sentido.</p></div>
      <div className={styles.contextGrid}>
        <article className="panel"><Icon name="clima-parcialmente-nublado"/><h3>Contexto do dia</h3><p>Alternativas podem fazer mais sentido conforme clima e condições disponíveis.</p></article>
        <article className="panel"><Icon name="roteiro"/><h3>Ritmo real</h3><p>Você pode diminuir, acelerar ou reorganizar o dia sem recomeçar a viagem inteira.</p></article>
        <article className="panel"><Icon name="passaporte"/><h3>O que aconteceu</h3><p>O Passaporte registra a experiência vivida, não apenas aquilo que estava no plano.</p></article>
      </div>
    </section>

    <section className={`${styles.section} ${styles.firstPaths}`} aria-labelledby="first-paths-title">
      <div className={styles.sectionHead}><div><p className="eyebrow">Descubra antes de decidir</p><h2 id="first-paths-title">Conheça lugares que podem entrar no seu caminho</h2></div><Link className={styles.secondaryLink} href="/pontos-turisticos">Conhecer todos os pontos <Icon name="avancar" size="sm"/></Link></div>
      <div className={styles.featuredGrid} data-testid="home-featured-grid">{featured.map(place=><PlaceCard key={place.id} place={place}/>)}</div>
    </section>

    <section className={`${styles.section} ${styles.interests}`} aria-labelledby="interests-title">
      <div className={styles.centerHead}><p className="eyebrow">Coleções para explorar</p><h2 id="interests-title">Ainda não quer um roteiro? Comece pelo que chama sua atenção.</h2><p>Interesses funcionam como descoberta livre. Quando algo fizer sentido, você pode levar essas escolhas para a viagem.</p><Link className="button" href="/explorar">Explorar tudo</Link></div>
      <div className={styles.interestGrid}>{categories.map(category=><Link className={styles.interestCard} key={category.id} href={`/explorar?category=${category.id}`}><span><Icon name={categoryIcon(category)}/></span><strong>{category.name}</strong><small>Explorar interesse</small></Link>)}</div>
    </section>

    <section className={`${styles.section} ${styles.passportIntro}`} aria-labelledby="passport-intro-title">
      <div className={styles.passportPaper} aria-hidden="true"><img src="/assets/brand/passport/folha-passaporte.svg" alt=""/></div>
      <div><p className="eyebrow">Meu Passaporte</p><h2 id="passport-intro-title">Planejar é uma coisa. Viver é outra.</h2><p>Seu roteiro começa como intenção. O Passaporte guarda os registros do que realmente entrou para a viagem e transforma o percurso vivido em memória.</p><div className="actions"><Link className="button primary" href="/meu-passaporte">Conhecer o Passaporte</Link><Link className="button" href="/roteiros">Escolher roteiro</Link></div></div>
    </section>

    <section className={`${styles.section} ${styles.mapSection}`} aria-labelledby="map-context-title">
      <div className={styles.centerHead}><p className="eyebrow">Serra Negra pelo território</p><h2 id="map-context-title">Entenda proximidades antes de gastar tempo se deslocando.</h2><p>Mapa, lugares e roteiro compartilham o mesmo contexto territorial para ajudar a construir dias mais coerentes.</p><Link className="button" href="/mapa">Abrir mapa</Link></div>
      <div className={styles.mapWrap}><MockMap places={routePlaces.slice(0,6)}/></div>
    </section>

    <section className={`${styles.section} ${styles.faqOnly}`} aria-labelledby="faq-title">
      <div className={styles.centerHead}><p className="eyebrow">Antes de começar</p><h2 id="faq-title">Pronto não significa fechado.</h2><p>O essencial para entender a diferença entre escolher uma base, adaptar uma viagem e registrar o que foi vivido.</p></div><FAQ/>
    </section>

    <section className={`${styles.section} ${styles.finalCta}`} aria-labelledby="next-path-title" data-testid="home-final-cta">
      <p className="eyebrow">Seu próximo caminho</p>
      <h2 id="next-path-title"><span>Escolha uma boa base.</span><span>Faça a viagem virar sua.</span></h2>
      <p>Comece com um roteiro pronto para a situação que mais combina com você ou construa tudo do zero quando quiser controle total desde a primeira escolha.</p>
      <div className="actions"><Link className="button primary" href="/roteiros">Explorar roteiros</Link><Link className="button" href="/roteiro">Criar do zero</Link></div>
    </section>
  </>;
}
