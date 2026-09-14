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
  const routeImages={
    'primeira-visita':'./assets/tourism/fontana-di-trevi.jpg',
    natureza:'./assets/tourism/mirante-alto-da-serra.jpg',
    gastronomia:'./assets/tourism/feira-artesanato.jpg',
    chuva:'./assets/tourism/igreja-nossa-senhora-rosario.jpg'
  };
  const routeMeta={
    'primeira-visita':{eyebrow:'Primeira vez em Serra Negra',days:'2 dias',audience:'Primeira visita'},
    natureza:{eyebrow:'Mais tempo ao ar livre',days:'1 dia',audience:'Natureza e paisagens'},
    gastronomia:{eyebrow:'Sabores pelo caminho',days:'1 dia',audience:'Gastronomia'},
    chuva:{eyebrow:'Quando o tempo muda',days:'1 dia',audience:'Plano flexível'}
  };
  const readyRoutes=configRoutes.map((route,index)=>({...route,image:routeImages[route.id]||fallbackImages[index%fallbackImages.length],...(routeMeta[route.id]||{eyebrow:route.label,days:'1 dia',audience:'Serra Negra'})}));

  const faqs=[
    ['Preciso responder perguntas para começar?','Não. Você pode começar por um roteiro pronto. O questionário completo fica para quem prefere criar a viagem do zero.'],
    ['O roteiro pronto fica engessado?','Não. A proposta é usar a curadoria como base e continuar podendo trocar, mover, remover e adicionar paradas.'],
    ['Qual é a diferença entre roteiro e Passaporte?','O roteiro organiza a intenção. O Passaporte mantém separado aquilo que foi planejado do que realmente foi vivido.']
  ];

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
        <p class="ch-eyebrow">ROTEIROS PRONTOS · LIBERDADE PARA ADAPTAR · MEMÓRIA</p>
        <h1 data-current-warp aria-label="Descubra Serra Negra do seu jeito."><span>Descubra Serra Negra</span><span>do seu jeito.</span></h1>
        <p class="ch-lead">Comece por uma viagem já pensada para diferentes formas de viver a cidade. Use como está, adapte para você ou crie tudo do zero.</p>
        <div class="ch-actions"><a class="ch-button ch-button-primary" href="#/roteiros">Explorar roteiros</a><a class="ch-button" href="#/roteiro">Criar do zero</a></div>
        <form class="ch-search" data-current-search><span aria-hidden="true">⌕</span><input name="q" type="search" aria-label="Buscar lugares e experiências" placeholder="Ou busque um lugar, café, mirante…"><button class="ch-button" type="submit">Explorar</button></form>
      </div></section>

      <section class="ch-section ch-route-types"><div class="ch-shell"><div class="ch-center"><p class="ch-eyebrow">ROTEIROS PARA COMEÇAR</p><h2>Escolha uma boa base antes de pensar em cada detalhe.</h2><p>Os roteiros partem de situações reais de viagem. Você escolhe um, cria sua própria versão e muda o que quiser depois.</p></div><div class="ch-tabs" role="tablist">${readyRoutes.map((r,i)=>`<button class="ch-tab" role="tab" aria-selected="${i===0}" data-route-tab="${i}">${esc(r.eyebrow)}</button>`).join('')}</div><div data-route-slide></div><div class="ch-actions" style="justify-content:center"><a class="ch-button" href="#/roteiros">Ver todos os roteiros</a><a class="ch-button" href="#/roteiro">Criar do zero</a></div></div></section>

      <section class="ch-section"><div class="ch-shell"><div class="ch-center"><p class="ch-eyebrow">COMECE PRONTO. DEPOIS FAÇA VIRAR SEU.</p><h2>Uma boa base reduz decisões sem tirar seu controle.</h2><p>O roteiro organiza uma primeira sequência possível. A partir daí, cada parada pode ser trocada, movida, fixada ou removida.</p></div><div class="ch-route-track">${routePlaces.slice(0,4).map((p,i)=>`<a class="ch-route-stop" href="${hrefFor(p)}"><span class="ch-route-dot">${i+1}</span><strong>${esc(p.name)}</strong><small>${esc(p.durationMinutes||60)} min</small></a>`).join('')}</div><div class="ch-actions" style="justify-content:center"><a class="ch-button ch-button-primary" href="#/roteiros">Escolher um roteiro</a></div></div></section>

      <section class="ch-section ch-meetings"><div class="ch-shell"><div class="ch-center"><p class="ch-eyebrow">ENCONTROS PELO CAMINHO</p><h2>Negócios locais entram quando fazem sentido para a viagem.</h2><p>O objetivo não é transformar o roteiro em uma lista de anúncios. Parceiros aparecem como descobertas compatíveis com o percurso, interesse e contexto.</p></div><div class="ch-gallery" data-current-gallery>${partnerList.map((p,i)=>`<article class="ch-partner" data-gallery-index="${i}"><div class="ch-partner-card"><img src="${esc(imageFor(p,i+2))}" alt="" loading="lazy"><div><small>${esc((p.categoryIds||[]).map(categoryName).slice(0,2).join(' · ')||'Parceiro')}</small><h3>${esc(p.name)}</h3><p>${esc(p.shortDescription||'Uma descoberta local que pode entrar no percurso.')}</p><a class="ch-button" href="${hrefFor(p)}">Conhecer experiência</a></div></div></article>`).join('')}</div><div class="ch-gallery-controls"><button type="button" data-gallery-prev aria-label="Parceiro anterior">←</button><span>ARRASTE · ROLE · CLIQUE · USE AS SETAS</span><button type="button" data-gallery-next aria-label="Próximo parceiro">→</button></div></div></section>

      <section class="ch-section"><div class="ch-shell"><div class="ch-center"><p class="ch-eyebrow">O ROTEIRO ACOMPANHA O CONTEXTO</p><h2>Planejar ajuda. Poder mudar é o que torna o plano útil.</h2><p>Clima, ritmo e escolhas ao longo do dia podem mudar. A viagem deve continuar legível mesmo quando a ordem original deixa de fazer sentido.</p></div><div class="ch-context-grid"><article class="ch-panel"><span class="ch-card-icon">☁</span><h3>Contexto do dia</h3><p>Alternativas podem fazer mais sentido conforme clima e condições disponíveis.</p></article><article class="ch-panel"><span class="ch-card-icon">↝</span><h3>Ritmo real</h3><p>Diminua, acelere ou reorganize o dia sem recomeçar a viagem inteira.</p></article><article class="ch-panel"><span class="ch-card-icon">◇</span><h3>O que aconteceu</h3><p>O Passaporte registra a experiência vivida, não apenas aquilo que estava no plano.</p></article></div></div></section>

      <section class="ch-section"><div class="ch-shell"><header class="ch-section-head"><div><p class="ch-eyebrow">DESCUBRA ANTES DE DECIDIR</p><h2>Conheça lugares que podem entrar no seu caminho</h2></div><a href="#/explorar?relation=public_point">Conhecer todos os pontos →</a></header><div class="ch-grid3">${featured.map(card).join('')}</div></div></section>

      <section class="ch-section"><div class="ch-shell"><div class="ch-center"><p class="ch-eyebrow">COLEÇÕES PARA EXPLORAR</p><h2>Ainda não quer um roteiro? Comece pelo que chama sua atenção.</h2><p>Interesses funcionam como descoberta livre. Quando algo fizer sentido, leve essas escolhas para a viagem.</p><div class="ch-actions" style="justify-content:center"><a class="ch-button" href="#/explorar">Explorar tudo</a></div></div><div class="ch-card-grid4">${cats.map(c=>`<a class="ch-interest-card" href="#/explorar?category=${encodeURIComponent(c.id)}"><span class="ch-card-icon">○</span><strong>${esc(c.name)}</strong><small>Explorar interesse</small></a>`).join('')}</div></div></section>

      <section class="ch-section"><div class="ch-shell ch-passport"><div class="ch-passport-paper" aria-hidden="true"><img src="./assets/brand/passport/folha-passaporte.svg" alt=""></div><div><p class="ch-eyebrow">MEU PASSAPORTE</p><h2>Planejar é uma coisa. Viver é outra.</h2><p>Seu roteiro começa como intenção. O Passaporte guarda os registros do que realmente entrou para a viagem e transforma o percurso vivido em memória.</p><div class="ch-actions"><a class="ch-button ch-button-primary" href="#/meu-passaporte">Conhecer o Passaporte</a><a class="ch-button" href="#/roteiros">Escolher roteiro</a></div></div></div></section>

      <section class="ch-section"><div class="ch-shell"><div class="ch-center"><p class="ch-eyebrow">SERRA NEGRA PELO TERRITÓRIO</p><h2>Entenda proximidades antes de gastar tempo se deslocando.</h2><p>Mapa, lugares e roteiro compartilham o mesmo contexto territorial para ajudar a construir dias mais coerentes.</p><div class="ch-actions" style="justify-content:center"><a class="ch-button" href="#/explorar?view=map">Abrir mapa</a></div></div><div class="ch-map">${routePlaces.slice(0,6).map((p,i)=>`<a class="ch-pin" title="${esc(p.name)}" href="${hrefFor(p)}" style="left:${12+(i*15)%78}%;top:${22+(i*19)%58}%">${i+1}</a>`).join('')}</div></div></section>

      <section class="ch-section"><div class="ch-shell"><div class="ch-center"><p class="ch-eyebrow">ANTES DE COMEÇAR</p><h2>Pronto não significa fechado.</h2><p>Entenda a diferença entre escolher uma base, adaptar uma viagem e registrar o que foi vivido.</p></div><div class="ch-faq">${faqs.map(([q,a],i)=>`<article class="ch-faq-item"><h3><button type="button" aria-expanded="false" data-faq="${i}">${esc(q)}<span>⌄</span></button></h3><div class="ch-faq-answer" data-faq-answer="${i}" data-open="false"><div><p>${esc(a)}</p></div></div></article>`).join('')}</div></div></section>

      <section class="ch-section ch-final"><div class="ch-shell"><p class="ch-eyebrow">SEU PRÓXIMO CAMINHO</p><h2><span>Escolha uma boa base.</span><span>Faça a viagem virar sua.</span></h2><p>Comece com um roteiro pronto para a situação que mais combina com você ou construa tudo do zero quando quiser controle total desde a primeira escolha.</p><div class="ch-actions"><a class="ch-button ch-button-primary" href="#/roteiros">Explorar roteiros</a><a class="ch-button" href="#/roteiro">Criar do zero</a></div></div></section>
    </div>`;
    bindHome(partnerList);
  }

  function routeCard(r){return `<a class="ch-choice-card" href="#/roteiros/${esc(r.id)}"><span class="ch-card-icon">✦</span><small>${esc(r.days)} · ${esc(r.audience)}</small><strong>${esc(r.title)}</strong><span>${esc(r.body)}</span></a>`;}
  function renderReadyRoutes(){
    if(!app||!isReadyRoutes())return;
    syncCurrentNav('routes');document.body.dataset.page='roteiros';
    const parts=path().split('/').filter(Boolean);const selected=parts[1]?readyRoutes.find(route=>route.id===parts[1]):null;
    if(selected){
      document.title=`${selected.title} · Passaporte Serra Negra`;
      app.innerHTML=`<div class="current-home"><section class="ch-section"><div class="ch-shell"><a class="ch-button" href="#/roteiros">← Todos os roteiros</a><div class="ch-passport" style="margin-top:1.5rem"><div class="ch-passport-paper" aria-hidden="true"><img src="${esc(selected.image)}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:18px"></div><div><p class="ch-eyebrow">${esc(selected.eyebrow)}</p><h1 style="font-size:clamp(2.4rem,6vw,5rem);line-height:.98">${esc(selected.title)}</h1><p class="ch-lead">${esc(selected.body)}</p><div class="ch-filters"><span>${esc(selected.days)}</span><span>${esc(selected.audience)}</span></div><div class="ch-actions"><a class="ch-button ch-button-primary" href="#/viagens/demo-trip-001/roteiro">Usar este roteiro na demonstração</a><a class="ch-button" href="#/roteiro">Criar do zero</a></div></div></div></div></section><section class="ch-section"><div class="ch-shell"><div class="ch-center"><p class="ch-eyebrow">UMA BASE, NÃO UMA REGRA</p><h2>Curadoria primeiro. Liberdade depois.</h2><p>Na versão completa, escolher este roteiro cria uma cópia editável da viagem. A prévia estática abre o roteiro demonstrativo existente para mostrar a experiência de edição.</p></div><div class="ch-context-grid"><article class="ch-panel"><h3>Escolha</h3><p>Comece por uma situação de viagem real.</p></article><article class="ch-panel"><h3>Adapte</h3><p>Troque e reorganize paradas conforme sua necessidade.</p></article><article class="ch-panel"><h3>Viva</h3><p>O Passaporte mantém separado o planejado do que foi registrado.</p></article></div></div></section></div>`;
      return;
    }
    document.title='Roteiros prontos · Passaporte Serra Negra';
    app.innerHTML=`<div class="current-home"><section class="ch-section"><div class="ch-shell"><div class="ch-center"><p class="ch-eyebrow">ROTEIROS PRONTOS</p><h1 style="font-size:clamp(2.7rem,7vw,6.4rem);line-height:.94;max-width:14ch;margin-inline:auto">Comece com uma boa base. Mude o que quiser.</h1><p class="ch-lead" style="margin-inline:auto">Escolha uma viagem já pensada para uma situação real. O roteiro vira seu ponto de partida, não uma sequência fechada.</p><div class="ch-actions" style="justify-content:center"><a class="ch-button" href="#/roteiro">Criar do zero</a></div></div><div class="ch-card-grid4" style="margin-top:3rem">${readyRoutes.map(routeCard).join('')}</div></div></section><section class="ch-section"><div class="ch-shell"><div class="ch-context-grid"><article class="ch-panel"><p class="ch-eyebrow">01 · ESCOLHA</p><h2>Comece pronto</h2><p>Encontre uma base adequada ao tempo, companhia ou intenção da viagem.</p></article><article class="ch-panel"><p class="ch-eyebrow">02 · ADAPTE</p><h2>Faça virar seu</h2><p>Reorganize e acrescente descobertas sem reconstruir tudo.</p></article><article class="ch-panel"><p class="ch-eyebrow">03 · VIVA</p><h2>Guarde o que aconteceu</h2><p>O Passaporte registra a experiência vivida.</p></article></div></div></section></div>`;
  }

  function bindHome(partnerList){
    const form=app.querySelector('[data-current-search]');form?.addEventListener('submit',e=>{e.preventDefault();const q=new FormData(form).get('q')||'';location.hash=`#/explorar?q=${encodeURIComponent(q)}`;});
    app.querySelectorAll('[data-faq]').forEach(btn=>btn.addEventListener('click',()=>{const id=btn.dataset.faq;const answer=app.querySelector(`[data-faq-answer="${id}"]`);const next=btn.getAttribute('aria-expanded')!=='true';btn.setAttribute('aria-expanded',String(next));answer?.setAttribute('data-open',String(next));}));
    const slide=app.querySelector('[data-route-slide]');
    const drawRoute=index=>{const r=readyRoutes[index]||readyRoutes[0];if(!r||!slide)return;slide.innerHTML=`<article class="ch-route-slide"><div class="ch-route-copy"><p class="ch-eyebrow">${esc(r.days)} · ${esc(r.audience)}</p><h3>${esc(r.title)}</h3><p>${esc(r.body)}</p><a class="ch-button ch-button-primary" href="#/roteiros/${esc(r.id)}">Conhecer este roteiro</a></div><img src="${esc(r.image)}" alt=""><aside class="ch-route-meta"><strong>O que você pode mudar</strong><span>paradas e ordem</span><span>horários e ritmo</span><span>novas descobertas</span></aside></article>`;};
    app.querySelectorAll('[data-route-tab]').forEach(btn=>btn.addEventListener('click',()=>{app.querySelectorAll('[data-route-tab]').forEach(x=>x.setAttribute('aria-selected','false'));btn.setAttribute('aria-selected','true');drawRoute(Number(btn.dataset.routeTab||0));}));drawRoute(0);
    let active=0;const items=[...app.querySelectorAll('[data-gallery-index]')];
    const updateGallery=()=>items.forEach((el,i)=>{let off=i-active;const total=items.length;if(total){if(off>total/2)off-=total;if(off<-total/2)off+=total;}const d=Math.abs(off);el.style.setProperty('--x',`${off*360}px`);el.style.setProperty('--y',`${d*26}px`);el.style.setProperty('--z',`${d*-90}px`);el.style.setProperty('--rot',`${off*-5}deg`);el.style.setProperty('--scale',String(Math.max(.76,1-d*.09)));el.style.setProperty('--opacity',String(d>2?0:Math.max(.5,1-d*.2)));el.style.setProperty('--zindex',String(20-d));el.style.pointerEvents=d>2?'none':'auto';});
    const move=delta=>{if(!items.length)return;active=(active+delta+items.length)%items.length;updateGallery();};
    app.querySelector('[data-gallery-prev]')?.addEventListener('click',()=>move(-1));app.querySelector('[data-gallery-next]')?.addEventListener('click',()=>move(1));items.forEach((el,i)=>el.addEventListener('click',e=>{if(i!==active){e.preventDefault();active=i;updateGallery();}}));app.querySelector('[data-current-gallery]')?.addEventListener('wheel',e=>{if(Math.abs(e.deltaY)<8)return;e.preventDefault();move(e.deltaY>0?1:-1);},{passive:false});updateGallery();
    const warp=app.querySelector('[data-current-warp]');warp?.addEventListener('pointermove',e=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const r=warp.getBoundingClientRect();const x=((e.clientX-r.left)/Math.max(r.width,1)-.5);warp.children[0].style.transform=`translate(${x*10}px,${x*-2}px) rotate(${x*-.5}deg)`;warp.children[1].style.transform=`translate(${x*-12}px,${x*2}px) rotate(${x*.6}deg)`;});warp?.addEventListener('pointerleave',()=>[...warp.children].forEach(x=>x.style.transform=''));
  }

  function render(){if(isHome())renderHome();else if(isReadyRoutes())renderReadyRoutes();}
  const schedule=()=>setTimeout(render,0);
  window.addEventListener('hashchange',schedule);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();
})();