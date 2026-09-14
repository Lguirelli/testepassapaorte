(() => {
  'use strict';
  const C=window.PSN_UI_CONFIG;
  const I=window.PSN_ICON;
  const header=document.getElementById('site-header-slot');
  const footer=document.getElementById('site-footer-slot');
  if(!C||!I||!header||!footer) return;
  const esc=(v='')=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]));
  const brand=()=>`<a class="brand" href="#/" aria-label="Passaporte Serra Negra, página inicial"><img class="brand-logo" src="./assets/brand/logo-passaporte-serra-negra.svg" alt=""><span><small>Passaporte</small><strong>Serra Negra</strong></span></a>`;
  const normalizedNav=[
    {label:'Início',href:'#/',iconKey:'nav.home'},
    ...C.navigation.main.map(item=>item.label==='Roteiros'?{...item,href:'#/roteiros'}:item.label==='Montar meu roteiro'?{...item,label:'Criar do zero',href:'#/roteiro'}:item)
  ];
  const nav=normalizedNav.map(item=>`<a class="${item.cta?'button primary nav-cta':''}" href="${item.href}" data-nav-key="${esc(item.label)}"><span class="nav-dock-motion" data-dock-motion>${I.html(item.iconKey,'',{size:18})}<span>${esc(item.label)}</span></span></a>`).join('');
  const themeOptions=C.themeOptions.map(x=>`<option value="${x.value}">${esc(x.label)}</option>`).join('');
  header.innerHTML=`<header class="site-header">${brand()}<button class="mobile-menu" type="button" data-action="toggle-menu" aria-expanded="false" aria-controls="main-nav">${I.html('nav.menu','',{size:20})}<span>Menu</span></button><nav id="main-nav" class="main-nav" aria-label="Navegação principal">${nav}<label class="mobile-theme-picker"><span>${I.html('theme.system','',{size:16})} Aparência</span><select id="theme-select-mobile" aria-label="Aparência no menu mobile">${themeOptions}</select></label></nav><label class="theme-picker"><span class="theme-picker-label"><span id="theme-current-icon">${I.html('theme.system','',{size:16})}</span><span>Aparência</span></span><select id="theme-select" aria-label="Aparência">${themeOptions}</select></label></header>`;
  const groups=C.footer.groups.map(group=>`<nav aria-label="${esc(group.label)}"><strong>${esc(group.label)}</strong>${group.items.map(item=>item.href?`<a href="${item.href}">${esc(item.label)}</a>`:`<button class="linklike" data-action="${esc(item.action)}">${esc(item.label)}</button>`).join('')}</nav>`).join('');
  footer.innerHTML=`<footer class="v2-footer"><div class="footer-brand">${brand()}<p>${esc(C.footer.description)}</p></div><div class="footer-cols">${groups}</div></footer>`;
  window.PSN_SHELL={
    syncThemeIcon(theme){const el=document.getElementById('theme-current-icon');const def=C.themeOptions.find(x=>x.value===theme)||C.themeOptions[0];if(el)el.innerHTML=I.html(def.iconKey,'',{size:16});}
  };
})();