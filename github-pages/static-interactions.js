(() => {
  'use strict';
  const reduced=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  let dockRaf=0,dockX=0;

  function initDock(){
    const nav=document.getElementById('main-nav');
    if(!nav||nav.dataset.dockReady==='1')return;
    nav.dataset.dockReady='1';
    const motions=()=>[...nav.querySelectorAll('[data-dock-motion]')];
    const reset=()=>motions().forEach(el=>{el.style.setProperty('--dock-scale','1');el.style.setProperty('--dock-lift','0px');});
    nav.addEventListener('pointermove',event=>{
      if(event.pointerType==='touch'||reduced()||window.matchMedia('(max-width: 980px)').matches)return;
      dockX=event.clientX;if(dockRaf)return;
      dockRaf=requestAnimationFrame(()=>{dockRaf=0;const x=dockX;motions().forEach(el=>{const rect=el.getBoundingClientRect();const center=rect.left+rect.width/2;const distance=Math.abs(x-center);const proximity=Math.max(0,1-distance/128);el.style.setProperty('--dock-scale',(1+proximity*.17).toFixed(3));el.style.setProperty('--dock-lift',`${(-proximity*4.5).toFixed(2)}px`);});});
    });
    nav.addEventListener('pointerleave',()=>{if(dockRaf){cancelAnimationFrame(dockRaf);dockRaf=0;}reset();});
    window.addEventListener('resize',()=>{if(window.innerWidth<=980)reset();},{passive:true});
  }

  let warpCleanup=null;
  function initWarp(){
    warpCleanup?.();warpCleanup=null;
    const title=document.querySelector('[data-warp-title]');
    if(!title||reduced()||window.matchMedia('(max-width: 760px)').matches)return;
    const chars=[...title.querySelectorAll('[data-warp-char]')];if(!chars.length)return;
    let raf=0,lastX=0,lastY=0;
    const reset=()=>chars.forEach(ch=>{ch.style.removeProperty('--warp-x');ch.style.removeProperty('--warp-y');ch.style.removeProperty('--warp-sx');ch.style.removeProperty('--warp-sy');ch.style.removeProperty('--warp-r');});
    const paint=()=>{raf=0;const radius=window.innerWidth<1100?88:118;chars.forEach(ch=>{const r=ch.getBoundingClientRect();const cx=r.left+r.width/2,cy=r.top+r.height/2;const dx=lastX-cx,dy=lastY-cy,dist=Math.hypot(dx,dy);const p=Math.max(0,1-dist/radius);if(p<=0){ch.style.setProperty('--warp-x','0px');ch.style.setProperty('--warp-y','0px');ch.style.setProperty('--warp-sx','1');ch.style.setProperty('--warp-sy','1');ch.style.setProperty('--warp-r','0deg');return;}const nx=dx/(dist||1),ny=dy/(dist||1);ch.style.setProperty('--warp-x',`${(-nx*p*6.5).toFixed(2)}px`);ch.style.setProperty('--warp-y',`${(-ny*p*5).toFixed(2)}px`);ch.style.setProperty('--warp-sx',(1+p*.09).toFixed(3));ch.style.setProperty('--warp-sy',(1-p*.045).toFixed(3));ch.style.setProperty('--warp-r',`${(-nx*ny*p*4).toFixed(2)}deg`);});};
    const move=e=>{lastX=e.clientX;lastY=e.clientY;if(!raf)raf=requestAnimationFrame(paint);};
    title.addEventListener('pointermove',move);title.addEventListener('pointerleave',reset);
    warpCleanup=()=>{if(raf)cancelAnimationFrame(raf);title.removeEventListener('pointermove',move);title.removeEventListener('pointerleave',reset);reset();};
  }

  function initMobileNav(){
    const button=document.querySelector('.mobile-menu');const nav=document.getElementById('main-nav');if(!button||!nav||button.dataset.cardNavReady==='1')return;
    button.dataset.cardNavReady='1';
    nav.setAttribute('aria-label','Navegação principal');
    const desktopTheme=document.getElementById('theme-select');
    const mobileTheme=document.getElementById('theme-select-mobile');
    if(desktopTheme&&mobileTheme){mobileTheme.value=desktopTheme.value;mobileTheme.addEventListener('change',()=>{desktopTheme.value=mobileTheme.value;desktopTheme.dispatchEvent(new Event('change',{bubbles:true}));});desktopTheme.addEventListener('change',()=>{mobileTheme.value=desktopTheme.value;});}
    const focusables=()=>[...nav.querySelectorAll('a[href],button:not([disabled]),select:not([disabled]),input:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(el=>!el.hidden&&el.getClientRects().length);
    const close=({restore=true}={})=>{
      if(!nav.classList.contains('open'))return;
      nav.classList.remove('open');document.body.classList.remove('menu-open');button.setAttribute('aria-expanded','false');
      if(window.PSN_ICON)button.innerHTML=`${window.PSN_ICON.html('nav.menu','',{size:20})}<span>Menu</span>`;
      if(restore)requestAnimationFrame(()=>button.focus({preventScroll:true}));
    };
    nav.addEventListener('click',e=>{if(e.target.closest('a'))close();});
    document.addEventListener('pointerdown',e=>{if(nav.classList.contains('open')&&!nav.contains(e.target)&&!button.contains(e.target))close({restore:false});});
    document.addEventListener('keydown',e=>{
      if(!nav.classList.contains('open'))return;
      if(e.key==='Escape'){e.preventDefault();close();return;}
      if(e.key!=='Tab')return;
      const items=focusables();if(!items.length){e.preventDefault();button.focus();return;}
      const first=items[0],last=items.at(-1);
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    });
    const compact=window.matchMedia('(max-width: 68rem)');
    const sync=()=>{if(!compact.matches)close({restore:false});};
    compact.addEventListener?.('change',sync);
  }

  function enhance(){initDock();initMobileNav();initWarp();}
  const app=document.getElementById('app');
  if(app){const observer=new MutationObserver(()=>requestAnimationFrame(enhance));observer.observe(app,{childList:true,subtree:false});}
  window.addEventListener('hashchange',()=>requestAnimationFrame(enhance));
  window.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(enhance),{once:true});
  requestAnimationFrame(enhance);
})();
