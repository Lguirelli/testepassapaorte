'use client';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useEffect,useRef,useState} from 'react';
import {MAIN_NAV,ROUTES,type MainNavKey} from '@/core/routing/routes';
import {Icon} from '@/design-system/icons';
import {ThemePicker} from './ThemePicker';

function activeKey(pathname:string):MainNavKey|undefined{
  if(pathname==='/explorar')return'explore'; if(pathname==='/pontos-turisticos'||pathname.startsWith('/lugares/'))return'touristPoints';
  if(pathname==='/mapa')return'map'; if(pathname==='/parceiros'||pathname.startsWith('/parceiros/'))return'partnerProgram';
  if(pathname==='/roteiro'||/^\/viagens\/[^/]+\/(roteiro|calendario)\/?$/.test(pathname))return'routes'; return undefined;
}

export function MainNavigation({initialTheme}:{initialTheme:'system'|'light'|'dark'}){
  const pathname=usePathname();
  const active=activeKey(pathname);
  const [open,setOpen]=useState(false);
  const [pointerX,setPointerX]=useState<number|null>(null);
  const navRef=useRef<HTMLElement>(null);
  const mobileCardRef=useRef<HTMLElement>(null);
  const triggerRef=useRef<HTMLButtonElement>(null);

  useEffect(()=>setOpen(false),[pathname]);
  useEffect(()=>{
    if(!open)return;
    const prev=document.body.style.overflow;
    document.body.style.overflow='hidden';
    const card=mobileCardRef.current;
    const focusables=()=>Array.from(card?.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),select:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])')||[]).filter(el=>!el.hasAttribute('inert'));
    const first=focusables()[0];
    requestAnimationFrame(()=>first?.focus());
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
      const firstItem=items[0];
      const lastItem=items[items.length-1];
      if(event.shiftKey&&document.activeElement===firstItem){event.preventDefault();lastItem.focus();}
      else if(!event.shiftKey&&document.activeElement===lastItem){event.preventDefault();firstItem.focus();}
    };
    document.addEventListener('keydown',onKey);
    return()=>{document.body.style.overflow=prev;document.removeEventListener('keydown',onKey)};
  },[open]);

  const dockScale=(el:HTMLElement)=>{
    if(pointerX===null)return 1;
    const r=el.getBoundingClientRect();
    const distance=Math.abs(pointerX-(r.left+r.width/2));
    return 1+Math.max(0,1-distance/125)*.08;
  };

  return <>
    <button ref={triggerRef} className="mobile-menu-trigger" type="button" aria-label={open?'Fechar menu':'Abrir menu'} aria-expanded={open} aria-controls="mobile-navigation" onClick={()=>setOpen(v=>!v)}><Icon name={open?'fechar':'menu'}/></button>
    <nav ref={navRef} aria-label="Navegação principal" className="main-nav dock-nav" onPointerMove={e=>{if(e.pointerType!=='touch'&&window.matchMedia('(hover:hover) and (pointer:fine)').matches)setPointerX(e.clientX)}} onPointerLeave={()=>setPointerX(null)}>
      {MAIN_NAV.map(item=><Link key={item.key} href={item.href} aria-current={active===item.key?'page':undefined} ref={node=>{if(node)node.style.setProperty('--dock-scale',String(dockScale(node)))}}>{item.label}</Link>)}
      <Link className="button header-cta" href={ROUTES.tripBuilder}>Montar meu roteiro</Link>
    </nav>
    <div id="mobile-navigation" className="mobile-nav-layer" data-open={open?'true':'false'} aria-hidden={!open} role="dialog" aria-modal={open?'true':undefined} aria-label="Menu principal">
      <button className="mobile-nav-backdrop" aria-label="Fechar menu" tabIndex={open?0:-1} onClick={()=>{setOpen(false);requestAnimationFrame(()=>triggerRef.current?.focus())}}/>
      <nav ref={mobileCardRef} className="mobile-nav-card" aria-label="Navegação mobile" inert={!open}>
        <div className="mobile-nav-title"><span>Explorar Serra Negra</span><button type="button" aria-label="Fechar menu" tabIndex={open?0:-1} onClick={()=>{setOpen(false);requestAnimationFrame(()=>triggerRef.current?.focus())}}><Icon name="fechar"/></button></div>
        {MAIN_NAV.map((item,index)=><Link key={item.key} style={{'--stagger':`${index*38}ms`} as React.CSSProperties} href={item.href} tabIndex={open?0:-1} aria-current={active===item.key?'page':undefined}><span>{item.label}</span><Icon name="avancar" size="sm"/></Link>)}
        <div className="mobile-nav-preferences"><span>Aparência</span><ThemePicker initialTheme={initialTheme}/></div>
        <Link className="button primary mobile-route-cta" href={ROUTES.tripBuilder} tabIndex={open?0:-1}>Montar meu roteiro</Link>
      </nav>
    </div>
  </>;
}
