'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useEffect,useRef,useState} from 'react';
import {MAIN_NAV,ROUTES,type MainNavKey} from '@/core/routing/routes';
import {Icon,type IconName} from '@/design-system/icons';
import {ThemePicker} from './ThemePicker';

const NAV_ICON:Record<MainNavKey,IconName>={
  explore:'explorar',
  touristPoints:'mapa-ponto-turistico',
  routes:'roteiro',
  map:'mapa',
  partnerProgram:'parceiros',
};

function activeKey(pathname:string):MainNavKey|undefined{
  if(pathname==='/explorar')return'explore';
  if(pathname==='/pontos-turisticos'||pathname.startsWith('/lugares/'))return'touristPoints';
  if(pathname==='/mapa')return'map';
  if(pathname==='/parceiros'||pathname.startsWith('/parceiros/'))return'partnerProgram';
  if(pathname==='/roteiros'||pathname.startsWith('/roteiros/')||pathname==='/roteiro'||/^\/viagens\/[^/]+\/(roteiro|calendario)\/?$/.test(pathname))return'routes';
  return undefined;
}

export function MainNavigation({initialTheme,accountHref,accountLabel}:{initialTheme:'system'|'light'|'dark';accountHref:string;accountLabel:string}){
  const pathname=usePathname();
  const active=activeKey(pathname);
  const [menuPath,setMenuPath]=useState<string|null>(null);
  const open=menuPath===pathname;
  const navRef=useRef<HTMLElement>(null);
  const mobileCardRef=useRef<HTMLElement>(null);
  const triggerRef=useRef<HTMLButtonElement>(null);
  const dockFrame=useRef<number|null>(null);

  useEffect(()=>{
    if(!open)return;
    const prev=document.body.style.overflow;
    document.body.style.overflow='hidden';
    const card=mobileCardRef.current;
    const focusables=()=>Array.from(card?.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),select:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])')||[]).filter(el=>!el.hasAttribute('inert'));
    const initialFocus=requestAnimationFrame(()=>focusables()[0]?.focus());
    const trigger=triggerRef.current;
    const resizeObserver=new ResizeObserver(()=>{
      if(trigger&&trigger.getClientRects().length===0){
        setMenuPath(null);
        const destination=navRef.current?.querySelector<HTMLElement>('a[aria-current="page"]')||navRef.current?.querySelector<HTMLElement>('a');
        destination?.focus();
      }
    });
    if(trigger)resizeObserver.observe(trigger);
    const onKey=(event:KeyboardEvent)=>{
      if(event.key==='Escape'){
        event.preventDefault();
        setMenuPath(null);
        requestAnimationFrame(()=>triggerRef.current?.focus());
        return;
      }
      if(event.key!=='Tab')return;
      const items=focusables();
      if(!items.length)return;
      const first=items[0];
      const last=items[items.length-1];
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
    };
    document.addEventListener('keydown',onKey);
    return()=>{
      cancelAnimationFrame(initialFocus);
      resizeObserver.disconnect();
      document.body.style.overflow=prev;
      document.removeEventListener('keydown',onKey);
    };
  },[open]);

  useEffect(()=>()=>{if(dockFrame.current!==null)cancelAnimationFrame(dockFrame.current);},[]);

  const resetDock=()=>{
    if(dockFrame.current!==null)cancelAnimationFrame(dockFrame.current);
    dockFrame.current=requestAnimationFrame(()=>{
      navRef.current?.querySelectorAll<HTMLElement>('a').forEach(item=>item.style.setProperty('--dock-scale','1'));
      dockFrame.current=null;
    });
  };

  const updateDock=(clientX:number)=>{
    if(!window.matchMedia('(hover:hover) and (pointer:fine)').matches){resetDock();return;}
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){resetDock();return;}
    if(dockFrame.current!==null)cancelAnimationFrame(dockFrame.current);
    dockFrame.current=requestAnimationFrame(()=>{
      navRef.current?.querySelectorAll<HTMLElement>('a').forEach(item=>{
        const rect=item.getBoundingClientRect();
        const center=rect.left+rect.width/2;
        const normalized=Math.max(0,1-Math.abs(clientX-center)/150);
        const eased=normalized*normalized*(3-2*normalized);
        item.style.setProperty('--dock-scale',(1+eased*.14).toFixed(3));
      });
      dockFrame.current=null;
    });
  };

  const closeMenu=()=>setMenuPath(null);

  return <>
    <button ref={triggerRef} className="mobile-menu-trigger" type="button" aria-label={open?'Fechar menu':'Abrir menu'} aria-expanded={open} aria-controls="mobile-navigation" onClick={()=>setMenuPath(open?null:pathname)}><Icon name={open?'fechar':'menu'}/></button>
    <nav ref={navRef} data-testid="main-dock-navigation" aria-label="Navegação principal" className="main-nav dock-nav" onPointerMove={event=>{if(event.pointerType!=='touch')updateDock(event.clientX)}} onPointerLeave={resetDock}>
      <Link className="nav-icon-link" href={ROUTES.home} aria-label="Início" aria-current={pathname===ROUTES.home?'page':undefined}><span className="nav-dock-motion"><Icon name="home" size={26}/><span className="nav-hover-label" aria-hidden="true">Início</span></span></Link>
      {MAIN_NAV.map(item=><Link className="nav-icon-link" key={item.key} href={item.href} aria-label={item.label} aria-current={active===item.key?'page':undefined}><span className="nav-dock-motion"><Icon name={NAV_ICON[item.key]} size={26}/><span className="nav-hover-label" aria-hidden="true">{item.label}</span></span></Link>)}
      <Link className="button header-cta trip-planner-cta nav-icon-link" href={ROUTES.tripBuilder} aria-label="Planejar minha viagem"><span className="nav-dock-motion"><Icon name="roteiro-adicionar-parada" size={25}/><span className="nav-hover-label" aria-hidden="true">Planejar minha viagem</span></span></Link>
    </nav>
    <div id="mobile-navigation" data-testid="mobile-navigation" className="mobile-nav-layer" data-open={open?'true':'false'} aria-hidden={!open} role="dialog" aria-modal={open?'true':undefined} aria-label="Menu principal">
      <button className="mobile-nav-backdrop" aria-label="Fechar menu" tabIndex={open?0:-1} onClick={()=>{closeMenu();requestAnimationFrame(()=>triggerRef.current?.focus())}}/>
      <nav ref={mobileCardRef} className="mobile-nav-card" aria-label="Navegação mobile" inert={!open}>
        <div className="mobile-nav-title"><span>Explorar Serra Negra</span><button type="button" aria-label="Fechar menu" tabIndex={open?0:-1} onClick={()=>{closeMenu();requestAnimationFrame(()=>triggerRef.current?.focus())}}><Icon name="fechar"/></button></div>
        <Link style={{'--stagger':'0ms'} as React.CSSProperties} href={ROUTES.home} tabIndex={open?0:-1} aria-current={pathname===ROUTES.home?'page':undefined} onClick={closeMenu}><span>Início</span><Icon name="avancar" size="sm"/></Link>
        {MAIN_NAV.map((item,index)=><Link key={item.key} style={{'--stagger':`${(index+1)*38}ms`} as React.CSSProperties} href={item.href} tabIndex={open?0:-1} aria-current={active===item.key?'page':undefined} onClick={closeMenu}><span>{item.label}</span><Icon name="avancar" size="sm"/></Link>)}
        <Link className="mobile-nav-account" style={{'--stagger':`${(MAIN_NAV.length+1)*38}ms`} as React.CSSProperties} href={accountHref} tabIndex={open?0:-1} onClick={closeMenu}><span className="mobile-nav-account-label"><Icon name="conta" size="sm"/><span>{accountLabel}</span></span><Icon name="avancar" size="sm"/></Link>
        <div className="mobile-nav-preferences"><span>Aparência</span><ThemePicker initialTheme={initialTheme}/></div>
        <Link className="button primary mobile-route-cta trip-planner-cta" href={ROUTES.tripBuilder} tabIndex={open?0:-1} onClick={closeMenu}>Planejar minha viagem</Link>
      </nav>
    </div>
  </>;
}
