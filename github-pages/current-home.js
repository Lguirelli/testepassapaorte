(() => {
  'use strict';
  const app=document.getElementById('app');
  const DATA=window.PSN_DATA||{};
  const CONFIG=window.PSN_UI_CONFIG||{};
  const content=DATA.content||{};
  const esc=(v='')=>String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const path=()=>String(location.hash||'#/').slice(1).split('?')[0];
  const isHome=()=>['','/'].includes(path());
  const isReadyRoutes=()=>path()==='/roteiros'||path().startsWith('/roteiros/');
  const normalizeAsset=(src='')=>src.startsWith('/assets/')?`.${src}`:src;
  const fallbackImages=['./assets/tourism/fontana-di-trevi.jpg','./assets/tourism/mirante-alto-da-serra.jpg','./assets/tourism/parque-fonte-santo-agostinho.jpg','./assets/tourism/igreja-nossa-senhora-rosario.jpg','./assets/tourism/feira-artesanato.jpg','./assets/tourism/teleferico-serra-negra.jpg'];
  const imageFor=(place,index=0)=>normalizeAsset(place?.imageAsset?.src||place?.image?.src||fallbackImages[index%fallbackImages.length]);
  const categories=()=>Array.isArray(content.categories)?content.categories:[];
  const places=()=>Array.isArray(content.places)?content.places:[];
  const categoryName=id=>categories().find(c=>c.id===id)?.name||id||'Descoberta';
  const visible=p=>p&&p.status!=='archived'&&p.discoveryVisible!==false;
  const touristPoints=()=>places().filter(p=>visible(p)&&(p.placeType==='tourist_point'||p.commercialRelation==='public_point'));
  const partners=()=>places().filter(p=>visible(p)&&p.commercialRelation==='partner');
  const hrefFor=p=>p?.commercialRelation==='partner'?`#/parceiros/${esc(p.slug||p.id)}`:`#/lugares/${esc(p.slug||p.id)}`;
  const card=(p,i)=>`<a class="ch-place-card" href="${hrefFor(p)}"><img src="${esc(imageFor(p,i))}" alt="" loading="lazy"><div class="ch-place-card-body"><small>${esc((p.categoryIds||[]).map(categoryName).slice(0,2).join(' · ')||'Serra Negra')}</small><h3>${esc(p.name||'Lugar em Serra Negra')}</h3><p>${esc(p.shortDescription||'Descubra este lugar e considere como ele pode entrar no seu percurso.')}</p></div></a>`;

  const configRoutes=Array.isArray(CONFIG.home?.routeTypes)?CONFIG.home.routeTypes:[];
  const readyRoutes=configRoutes.map((route,index)=>({
    ...route,
    slug:route.slug||route.id,
    eyebrow:route.eyebrow||route.label||'Roteiro pronto',
    days:route.days||'1 dia',
    audience:route.audience||'Serra Negra',
    image:normalizeAsset(route.image||fallbackImages[index%fallbackImages.length])
  }));
  const faqs=(Array.isArray(CONFIG.home?.faq)?CONFIG.home.faq:[]).map(item=>[item.question,item.answer]);

  function syncCurrentNav(key){
    document.querySelectorAll('#main-nav a').forEach(link=>link.removeAttribute('aria-current'));
    const href=key==='home'?'#/':key==='routes'?'#/roteiros':null;
    if(href)document.querySelector(`#main-nav a[href="${href}"]`)?.setAttribute('aria-current','page');
  }

  function renderHome(){
    if(!app||!isHome())return;
    syncCurrentNav('home');
    document.body.dataset.page='home';
    document.title='Passaporte Serra Negra';
    const cats=categories();const points=touristPoints();const featured=points.slice(0,3);const partnerList=partners().slice(0,8);const routePlaces=[...points,...partnerList].slice(0,6);
    app.innerHTML=`<div class="current-home" data-current-home="true">
      <section class="ch-hero" data-testid="home-hero"><img class="ch-hero-bg" src="./assets/brand/hero/serra-negra-header-2048.webp" alt=""><div class="ch-hero-inner">
        <p class="ch-eyebrow">DESCUBRA · ORGANIZE · ADAPTE · REGISTRE</p>
        <h1 data-current-warp aria-label="Descubra Serra Negra do seu jeito."><span>Descubra Serra Negra</span><span>do seu jeito.</span></h1>
        <p class="ch-lead">O Passaporte conecta o que você quer viver com lugares, experiências e negócios locais para transformar intenção em um caminho possível por Serra Negra.</p>
        <form class="ch-search" data-current-search><span aria-hidden="true">⌕</span><input name="q" type="search" aria-label="Buscar lugares e experiências" placeholder="Busque um lugar, café, mirante…"><button class="ch-button" type="submit">Buscar</button></form>
      </div></section>

      <section class="ch-section ch-route-types"><div class="ch-shell"><div class="ch-center"><p class="ch-eyebrow">ROTEIROS PARA COMEÇAR</p><h2>Escolha um ponto de partida que combine com a sua viagem.</h2><p>Cada roteiro parte de uma situação real e organiza uma primeira versão possível. Você adapta o ritmo, as paradas e a ordem conforme a viagem ganha forma.</p></div><div class="ch-tabs" role="tablist" aria-label="Roteiros prontos">${readyRoutes.map((r,i)=>`<button class="ch-tab" role="tab" aria-selected="${i===0}" tabindex="${i===0?0:-1}" data-route-tab="${i}">${esc(r.eyebrow)}</button>`).join('')}</div><div data-route-slide></div><div class="ch-actions" style="justify-content:center"><a class="ch-button" href="#/roteiros">Ver todos os roteiros</a><a class="ch-button ch-trip-planner-cta" href="#/roteiro">Planejar minha viagem</a></div></div></section>

      <section class="ch-section"><div class="ch-shell"><div class="ch-center"><p class="ch-eyebrow">DA INTENÇÃO AO CAMINHO</p><h2>Transforme escolhas soltas em um dia que faz sentido.</h2><p>O Passaporte ajuda a aproximar lugares, tempo e deslocamento para que o roteiro funcione como caminho, não como lista.</p></div><div class="ch-route-track">${routePlaces.slice(0,4).map((p,i)=>`<a class="ch-route-stop" href="${hrefFor(p)}"><span class="ch-route-dot">${i+1}</span><strong>${esc(p.name)}</strong><small>${esc(p.durationMinutes||60)} min</small></a>`).join('')}</div><div class="ch-actions" style="justify-content:center"><a class="ch-button ch-button-primary" href="#/roteiros">Escolher um roteiro</a></div></div></section>

      <section class="ch-section ch-meetings"><div class="ch-shell"><div class="ch-center"><p class="ch-eyebrow">DESCOBERTAS NO MOMENTO CERTO</p><h2>Negócios locais aparecem quando acrescentam algo ao seu caminho.</h2><p>Cafés, produtores, restaurantes e experiências entram como descobertas compatíveis com o percurso e com o que você procura, não como anúncios soltos.</p></div><div class="ch-gallery" data-current-gallery tabindex="0" aria-label="Parceiros ao longo do caminho">${partnerList.map((p,i)=>`<article class="ch-partner" data-gallery-index="${i}"><div class="ch-partner-card"><img src="${esc(imageFor(p,i+2))}" alt="" loading="lazy"><div><small>${esc((p.categoryIds||[]).map(categoryName).slice(0,2).join(' · ')||'Parceiro')}</small><h3>${esc(p.name)}</h3><p>${esc(p.shortDescription||'Uma descoberta local que pode entrar no percurso.')}</p><a class="ch-button" href="${hrefFor(p)}">Conhecer experiência</a></div></div></article>`).join('')}</div><div class="ch-gallery-controls"><button type="button" data-gallery-prev aria-label="Parceiro anterior">←</button><span>ARRASTE · ROLE · CLIQUE · USE AS SETAS</span><button type="button" data-gallery-next aria-label="Próximo parceiro">→</button></div></div></section>

      <section class="ch-section"><div class="ch-shell"><div class="ch-center"><p class="ch-eyebrow">O DIA MUDA. O ROTEIRO TAMBÉM.</p><h2>Seu plano continua útil quando a viagem muda.</h2><p>Clima, horários, ritmo e novas descobertas podem alterar o dia. Você reorganiza o percurso sem perder o que já decidiu.</p></div><div class="ch-context-grid"><article class="ch-panel"><span class="ch-card-icon">☁</span><h3>Contexto do dia</h3><p>Compare alternativas conforme clima, horários e o tempo disponível.</p></article><article class="ch-panel"><span class="ch-card-icon">↝</span><h3>Ritmo da viagem</h3><p>Mude a ordem, reduza ou acrescente paradas sem reconstruir tudo.</p></article><article class="ch-panel"><span class="ch-card-icon">◇</span><h3>Memória do que foi vivido</h3><p>O Passaporte separa o que estava planejado do que realmente aconteceu.</p></article></div></div></section>

      <section class="ch-section"><div class="ch-shell"><header class="ch-section-head"><div><p class="ch-eyebrow">EXPLORE O TERRITÓRIO</p><h2>Descubra lugares antes de decidir o que entra no roteiro</h2></div><a href="#/explorar?relation=public_point">Ver todos os pontos →</a></header><div class="ch-grid3">${featured.map(card).join('')}</div></div></section>

      <section class="ch-section"><div class="ch-shell"><div class="ch-center"><p class="ch-eyebrow">EXPLORE DO SEU JEITO</p><h2>Ainda sem roteiro? Comece pelo que desperta sua curiosidade.</h2><p>Navegue por interesses e encontre descobertas que podem ganhar lugar na sua viagem quando fizer sentido.</p><div class="ch-actions" style="justify-content:center"><a class="ch-button" href="#/explorar">Explorar por interesse</a></div></div><div class="ch-card-grid4">${cats.map(c=>`<a class="ch-interest-card" href="#/explorar?category=${encodeURIComponent(c.id)}"><span class="ch-card-icon">○</span><strong>${esc(c.name)}</strong><small>Ver descobertas</small></a>`).join('')}</div></div></section>

      <section class="ch-section"><div class="ch-shell ch-passport"><div class="ch-passport-paper" aria-hidden="true"><img src="./assets/brand/passport/folha-passaporte.svg" alt=""></div><div><p class="ch-eyebrow">DE ROTEIRO A MEMÓRIA</p><h2>O plano termina. A experiência fica.</h2><p>O roteiro registra intenção. O Passaporte guarda os lugares que realmente fizeram parte da viagem e transforma o percurso vivido em memória.</p><div class="ch-actions"><a class="ch-button ch-button-primary" href="#/meu-passaporte">Ver meu Passaporte</a><a class="ch-button" href="#/roteiros">Escolher um roteiro</a></div></div></div></section>

      <section class="ch-section"><div class="ch-shell"><div class="ch-center"><p class="ch-eyebrow">PROXIMIDADE IMPORTA</p><h2>Veja o que cabe no mesmo dia antes de atravessar a cidade.</h2><p>Use o mapa para entender distâncias, combinar paradas próximas e construir um percurso mais coerente.</p><div class="ch-actions" style="justify-content:center"><a class="ch-button" href="#/explorar?view=map">Explorar no mapa</a></div></div><div class="ch-map">${routePlaces.slice(0,6).map((p,i)=>`<a class="ch-pin" title="${esc(p.name)}" href="${hrefFor(p)}" style="left:${12+(i*15)%78}%;top:${22+(i*19)%58}%">${i+1}</a>`).join('')}</div></div></section>

      <section class="ch-section"><div class="ch-shell"><div class="ch-center"><p class="ch-eyebrow">COMO FUNCIONA</p><h2>Você escolhe quanto quer planejar.</h2><p>Comece por uma base pronta ou personalize desde o início. Em qualquer caminho, o roteiro continua editável e o Passaporte registra o que foi vivido.</p></div><div class="ch-faq">${faqs.map(([q,a],i)=>`<article class="ch-faq-item"><h3><button type="button" aria-expanded="false" data-faq="${i}">${esc(q)}<span>⌄</span></button></h3><div class="ch-faq-answer" data-faq-answer="${i}" data-open="false"><div><p>${esc(a)}</p></div></div></article>`).join('')}</div></div></section>

      <section class="ch-section ch-final"><div class="ch-shell"><p class="ch-eyebrow">SEU PRÓXIMO CAMINHO</p><h2><span>Comece com uma direção.</span><span>Faça a viagem ganhar a sua forma.</span></h2><p>Escolha um roteiro que combine com o momento da sua viagem ou planeje uma versão personalizada. O Passaporte acompanha suas escolhas até elas virarem experiência.</p><div class="ch-actions"><a class="ch-button ch-button-primary" href="#/roteiros">Explorar roteiros</a><a class="ch-button ch-trip-planner-cta" href="#/roteiro">Planejar minha viagem</a></div></div></section>
    </div>`;
    bindHome(partnerList);
  }

  function routeCard(r){return `<a class="ch-choice-card" href="#/roteiros/${esc(r.slug||r.id)}"><span class="ch-card-icon">✦</span><small>${esc(r.days)} · ${esc(r.audience)}</small><strong>${esc(r.title)}</strong><span>${esc(r.body)}</span></a>`;}
  function renderReadyRoutes(){
    if(!app||!isReadyRoutes())return;
    syncCurrentNav('routes');document.body.dataset.page='roteiros';
    const parts=path().split('/').filter(Boolean);const selected=parts[1]?readyRoutes.find(route=>(route.slug||route.id)===parts[1]):null;
    if(selected){
      document.title=`${selected.title} · Passaporte Serra Negra`;
      app.innerHTML=`<div class="current-home"><section class="ch-section"><div class="ch-shell"><a class="ch-button" href="#/roteiros">← Todos os roteiros</a><div class="ch-passport" style="margin-top:1.5rem"><div class="ch-passport-paper" aria-hidden="true"><img src="${esc(selected.image)}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:18px"></div><div><p class="ch-eyebrow">${esc(selected.eyebrow)}</p><h1 style="font-size:clamp(2.4rem,6vw,5rem);line-height:.98">${esc(selected.title)}</h1><p class="ch-lead">${esc(selected.body)}</p><div class="ch-filters"><span>${esc(selected.days)}</span><span>${esc(selected.audience)}</span></div><div class="ch-actions"><a class="ch-button ch-button-primary" href="#/viagens/demo-trip-001/roteiro">Usar este roteiro na demonstração</a><a class="ch-button ch-trip-planner-cta" href="#/roteiro">Planejar minha viagem</a></div></div></div></div></section><section class="ch-section"><div class="ch-shell"><div class="ch-center"><p class="ch-eyebrow">UMA BASE, NÃO UMA REGRA</p><h2>Curadoria para começar. Liberdade para adaptar.</h2><p>Na versão completa, escolher este roteiro cria uma cópia editável da viagem. A prévia estática abre o roteiro demonstrativo existente para mostrar a experiência de edição.</p></div><div class="ch-context-grid"><article class="ch-panel"><h3>Escolha</h3><p>Comece por uma situação de viagem real.</p></article><article class="ch-panel"><h3>Adapte</h3><p>Troque e reorganize paradas conforme sua necessidade.</p></article><article class="ch-panel"><h3>Viva</h3><p>O Passaporte mantém separado o planejado do que foi registrado.</p></article></div></div></section></div>`;
      return;
    }
    document.title='Roteiros prontos · Passaporte Serra Negra';
    app.innerHTML=`<div class="current-home"><section class="ch-section"><div class="ch-shell"><div class="ch-center"><p class="ch-eyebrow">ROTEIROS PRONTOS</p><h1 style="font-size:clamp(2.7rem,7vw,6.4rem);line-height:.94;max-width:14ch;margin-inline:auto">Comece com uma direção. Adapte até a viagem ficar sua.</h1><p class="ch-lead" style="margin-inline:auto">Escolha uma base pensada para uma situação real. O roteiro vira seu ponto de partida e continua editável conforme a viagem ganha forma.</p><div class="ch-actions" style="justify-content:center"><a class="ch-button ch-trip-planner-cta" href="#/roteiro">Planejar minha viagem</a></div></div><div class="ch-card-grid4" style="margin-top:3rem">${readyRoutes.map(routeCard).join('')}</div></div></section><section class="ch-section"><div class="ch-shell"><div class="ch-context-grid"><article class="ch-panel"><p class="ch-eyebrow">01 · ESCOLHA</p><h2>Encontre uma direção</h2><p>Parta de uma base adequada ao tempo, companhia ou intenção da viagem.</p></article><article class="ch-panel"><p class="ch-eyebrow">02 · ADAPTE</p><h2>Faça o caminho ficar seu</h2><p>Reorganize e acrescente descobertas sem reconstruir tudo.</p></article><article class="ch-panel"><p class="ch-eyebrow">03 · VIVA</p><h2>Guarde o que aconteceu</h2><p>O Passaporte registra a experiência vivida.</p></article></div></div></section></div>`;
  }

  function bindHome(partnerList){
    const form=app.querySelector('[data-current-search]');form?.addEventListener('submit',e=>{e.preventDefault();const q=new FormData(form).get('q')||'';location.hash=`#/explorar?q=${encodeURIComponent(q)}`;});
    app.querySelectorAll('[data-faq]').forEach(btn=>btn.addEventListener('click',()=>{const id=btn.dataset.faq;const answer=app.querySelector(`[data-faq-answer="${id}"]`);const next=btn.getAttribute('aria-expanded')!=='true';btn.setAttribute('aria-expanded',String(next));answer?.setAttribute('data-open',String(next));}));
    const slide=app.querySelector('[data-route-slide]');
    const tabs=[...app.querySelectorAll('[data-route-tab]')];
    const drawRoute=index=>{const r=readyRoutes[index]||readyRoutes[0];if(!r||!slide)return;slide.innerHTML=`<article class="ch-route-slide"><div class="ch-route-copy"><p class="ch-eyebrow">${esc(r.days)} · ${esc(r.audience)}</p><h3>${esc(r.title)}</h3><p>${esc(r.body)}</p><a class="ch-button ch-button-primary" href="#/roteiros/${esc(r.slug||r.id)}">Conhecer este roteiro</a></div><img src="${esc(r.image)}" alt=""><aside class="ch-route-meta"><strong>O que você pode mudar</strong><span>paradas e ordem</span><span>horários e ritmo</span><span>novas descobertas</span></aside></article>`;};
    const activateRouteTab=(index,focus=false)=>{const safe=(index+tabs.length)%Math.max(tabs.length,1);tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===safe));tab.tabIndex=i===safe?0:-1;});drawRoute(safe);if(focus)tabs[safe]?.focus();};
    tabs.forEach((btn,index)=>{btn.addEventListener('click',()=>activateRouteTab(index));btn.addEventListener('keydown',e=>{let next=index;if(e.key==='ArrowRight')next=index+1;else if(e.key==='ArrowLeft')next=index-1;else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;else return;e.preventDefault();activateRouteTab(next,true);});});drawRoute(0);
    let active=0;const items=[...app.querySelectorAll('[data-gallery-index]')];
    const gallery=app.querySelector('[data-current-gallery]');
    const updateGallery=()=>items.forEach((el,i)=>{let off=i-active;const total=items.length;if(total){if(off>total/2)off-=total;if(off<-total/2)off+=total;}const d=Math.abs(off);el.style.setProperty('--x',`${off*360}px`);el.style.setProperty('--y',`${d*26}px`);el.style.setProperty('--z',`${d*-90}px`);el.style.setProperty('--rot',`${off*-5}deg`);el.style.setProperty('--scale',String(Math.max(.76,1-d*.09)));el.style.setProperty('--opacity',String(d>2?0:Math.max(.5,1-d*.2)));el.style.setProperty('--zindex',String(20-d));el.style.pointerEvents=d>2?'none':'auto';});
    const move=delta=>{if(!items.length)return;active=(active+delta+items.length)%items.length;updateGallery();};
    app.querySelector('[data-gallery-prev]')?.addEventListener('click',()=>move(-1));app.querySelector('[data-gallery-next]')?.addEventListener('click',()=>move(1));items.forEach((el,i)=>el.addEventListener('click',e=>{if(i!==active){e.preventDefault();active=i;updateGallery();}}));gallery?.addEventListener('wheel',e=>{if(Math.abs(e.deltaY)<8)return;e.preventDefault();move(e.deltaY>0?1:-1);},{passive:false});gallery?.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();move(1);}if(e.key==='ArrowLeft'){e.preventDefault();move(-1);}});
    let pointerId=null,startX=0,lastX=0,lastAt=0,velocity=0;
    gallery?.addEventListener('pointerdown',e=>{pointerId=e.pointerId;startX=lastX=e.clientX;lastAt=performance.now();velocity=0;gallery.setPointerCapture?.(e.pointerId);});
    gallery?.addEventListener('pointermove',e=>{if(pointerId!==e.pointerId)return;const now=performance.now();const dt=Math.max(1,now-lastAt);velocity=(e.clientX-lastX)/dt;lastX=e.clientX;lastAt=now;});
    const release=e=>{if(pointerId!==e.pointerId)return;const delta=e.clientX-startX;const projected=delta+velocity*180;if(Math.abs(projected)>45)move(projected<0?1:-1);pointerId=null;};
    gallery?.addEventListener('pointerup',release);gallery?.addEventListener('pointercancel',release);updateGallery();
    const warp=app.querySelector('[data-current-warp]');warp?.addEventListener('pointermove',e=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const r=warp.getBoundingClientRect();const x=((e.clientX-r.left)/Math.max(r.width,1)-.5);warp.children[0].style.transform=`translate(${x*10}px,${x*-2}px) rotate(${x*-.5}deg)`;warp.children[1].style.transform=`translate(${x*-12}px,${x*2}px) rotate(${x*.6}deg)`;});warp?.addEventListener('pointerleave',()=>[...warp.children].forEach(x=>x.style.transform=''));
  }

  function render(){if(isHome())renderHome();else if(isReadyRoutes())renderReadyRoutes();}
  const schedule=()=>setTimeout(render,0);
  window.addEventListener('hashchange',schedule);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();
})();
