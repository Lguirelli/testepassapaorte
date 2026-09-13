'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useEffect,useRef,useState} from 'react';
import {MAIN_NAV,ROUTES,type MainNavKey} from '@/core/routing/routes';
import {Icon} from '@/design-system/icons';
import {ThemePicker} from './ThemePicker';

function activeKey(pathname:string):MainNavKey|undefined{
  if(pathname==='/explorar')return'explore';
  if(pathname==='/pontos-turisticos'||pathname.startsWith('/lugares/'))return'touristPoints';
  if(pathname==='/mapa')return'map';
  if(pathname==='/parceiros'||pathname.startsWith('/parceiros/'))return'partnerProgram';
  if(pathname==='/roteiro'||/^\/viagens\/[^/]+\/(roteiro|calendario)\/?$/.test(pathname))return'routes';
  return undefined;
}

export function MainNavigation({initialTheme,accountHref,accountLabel}:{initialTheme:'system'|'light'|'dark';accountHref:string;accountLabel:string}){
  const pathname=usePathname();
  const active=activeKey(pathname);
  const [open,setOpen]=useState(false);
  const navRef=useRef<HTMLElement>(null);
  const mobileCardRef=useRef<HTMLElement>(null);
  const triggerRef=useRef<HTMLButtonElement>(null);
  const dockFrame=useRef<number|null>(null);

  const [previousPath,setPreviousPath]=useState(pathname);
  if(previousPath!==pathname){setPreviousPath(pathname);setOpen(false);}

  useEffect(()=>{
    if(!open)return;
    const prev=document.body.style.overflow;
    document.body.style.overflow='hidden';
    const card=mobileCardRef.current;
    const focusables=()=>Array.from(card?.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),select:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])')||[]).filter(el=>!el.hasAttribute('inert'));
    requestAnimationFrame(()=>focusables()[0]?.focus());
    const onKey=(event:KeyboardEvent)=>{
      if(event.key==='Escape'){
        event.preventDefault();
        setOpen(false);
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

  return <>
    <button ref={triggerRef} className="mobile-menu-trigger" type="button" aria-label={open?'Fechar menu':'Abrir menu'} aria-expanded={open} aria-controls="mobile-navigation" onClick={()=>setOpen(value=>!value)}><Icon name={open?'fechar':'menu'}/></button>
    <nav ref={navRef} data-testid="main-dock-navigation" aria-label="Navegação principal" className="main-nav dock-nav" onPointerMove={event=>{if(event.pointerType!=='touch')updateDock(event.clientX)}} onPointerLeave={resetDock}>
      <Link href={ROUTES.home} aria-current={pathname===ROUTES.home?'page':undefined}>Início</Link>
      {MAIN_NAV.map(item=><Link key={item.key} href={item.href} aria-current={active===item.key?'page':undefined}>{item.label}</Link>)}
      <Link className="button header-cta" href={ROUTES.tripBuilder}>Montar meu roteiro</Link>
    </nav>
    <div id="mobile-navigation" data-testid="mobile-navigation" className="mobile-nav-layer" data-open={open?'true':'false'} aria-hidden={!open} role="dialog" aria-modal={open?'true':undefined} aria-label="Menu principal">
      <button className="mobile-nav-backdrop" aria-label="Fechar menu" tabIndex={open?0:-1} onClick={()=>{setOpen(false);requestAnimationFrame(()=>triggerRef.current?.focus())}}/>
      <nav ref={mobileCardRef} className="mobile-nav-card" aria-label="Navegação mobile" inert={!open}>
        <div className="mobile-nav-title"><span>Explorar Serra Negra</span><button type="button" aria-label="Fechar menu" tabIndex={open?0:-1} onClick={()=>{setOpen(false);requestAnimationFrame(()=>triggerRef.current?.focus())}}><Icon name="fechar"/></button></div>
        <Link style={{'--stagger':'0ms'} as React.CSSProperties} href={ROUTES.home} tabIndex={open?0:-1} aria-current={pathname===ROUTES.home?'page':undefined} onClick={()=>setOpen(false)}><span>Início</span><Icon name="avancar" size="sm"/></Link>
        {MAIN_NAV.map((item,index)=><Link key={item.key} style={{'--stagger':`${(index+1)*38}ms`} as React.CSSProperties} href={item.href} tabIndex={open?0:-1} aria-current={active===item.key?'page':undefined} onClick={()=>setOpen(false)}><span>{item.label}</span><Icon name="avancar" size="sm"/></Link>)}
        <Link className="mobile-nav-account" style={{'--stagger':`${(MAIN_NAV.length+1)*38}ms`} as React.CSSProperties} href={accountHref} tabIndex={open?0:-1} onClick={()=>setOpen(false)}><span className="mobile-nav-account-label"><Icon name="conta" size="sm"/><span>{accountLabel}</span></span><Icon name="avancar" size="sm"/></Link>
        <div className="mobile-nav-preferences"><span>Aparência</span><ThemePicker initialTheme={initialTheme}/></div>
        <Link className="button primary mobile-route-cta" href={ROUTES.tripBuilder} tabIndex={open?0:-1} onClick={()=>setOpen(false)}>Montar meu roteiro</Link>
      </nav>
    </div>
  </>;
}
