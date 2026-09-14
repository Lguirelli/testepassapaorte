(() => {
  'use strict';
  const app=document.getElementById('app');
  const DATA=window.PSN_DATA||{};
  const content=DATA.content||{};
  const esc=(v='')=>String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const isHome=()=>!location.hash||location.hash==='#'||location.hash==='#/'||location.hash.startsWith('#/?');
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
  const routeTypes=[
    {name:'Primeira visita',title:'Um começo equilibrado',copy:'Misture referências da cidade, pausas e descobertas sem concentrar tudo no mesmo período.',image:'./assets/tourism/fontana-di-trevi.jpg'},
    {name:'Natureza',title:'Mais tempo ao ar livre',copy:'Priorize mirantes, jardins e experiências abertas, deixando margem para o ritmo do dia.',image:'./assets/tourism/mirante-alto-da-serra.jpg'},
    {name:'Gastronomia',title:'Paradas que também contam a viagem',copy:'Distribua cafés, refeições e produtores locais entre os deslocamentos do roteiro.',image:'./assets/tourism/feira-artesanato.jpg'},
    {name:'Dia de chuva',title:'Um plano que continua funcionando',copy:'Reorganize o dia com experiências cobertas e mantenha alternativas para quando o tempo mudar.',image:'./assets/tourism/igreja-nossa-senhora-rosario.jpg'}
  ];
  const faqs=[
    ['Os pontos turísticos são reais?','Sim. A descoberta pública usa atrativos pesquisados de Serra Negra com proveniência registrada. Parceiros ainda não confirmados aparecem explicitamente como demonstração.'],
    ['É possível reservar ou pagar pelo Passaporte?','Não nesta fase. Quando um local oferece reserva externa, o Passaporte apenas encaminha para o canal informado e preserva o contexto da viagem.'],
    ['O roteiro muda quando eu ajusto minhas escolhas?','Sim. O roteiro pode ser reorganizado sem apagar silenciosamente paradas fixadas ou alterações manuais feitas por você.']
  ];
  function render(){
    if(!app||!isHome())return;
    const cats=categories();
    const points=touristPoints();
    const featured=points.slice(0,3);
    const partnerList=partners().slice(0,8);
    const routePlaces=[...points,...partnerList].slice(0,6);
    const startCats=cats.slice(0,4);
    app.innerHTML=`<div class="current-home" data-current-home="true">
      <section class="ch-hero" data-testid="home-hero">
        <img class="ch-hero-bg" src="./assets/brand/hero/serra-negra-header-2048.webp" alt="">
        <div class="ch-hero-inner"><p class="ch-eyebrow">Descoberta · planejamento · memória</p><h1 data-current-warp aria-label="Descubra Serra Negra do seu jeito."><span>Descubra Serra Negra</span><span>do seu jeito.</span></h1><p class="ch-lead">Organize os dias da sua viagem e guarde os lugares que fizeram parte dela.</p>
          <form class="ch-search" data-current-search><span aria-hidden="true">⌕</span><input name="q" type="search" aria-label="Buscar lugares e experiências" placeholder="O que você gostaria de encontrar?"><button class="ch-button ch-button-primary" type="submit">Explorar</button></form>
          <div class="ch-filters">${cats.slice(0,5).map(c=>`<a href="#/explorar?category=${encodeURIComponent(c.id)}">${esc(c.name)}</a>`).join('')}</div>
        </div>
      </section>
      <section class="ch-section"><div class="ch-shell"><header class="ch-section-head"><div><p class="ch-eyebrow">Primeiros caminhos</p><h2>Conheça Serra Negra</h2></div><a href="#/explorar?relation=public_point">Conhecer todos os pontos →</a></header><div class="ch-grid3">${featured.map(card).join('')}</div></div></section>
      <section class="ch-section ch-meetings"><div class="ch-shell"><div class="ch-center"><p class="ch-eyebrow">Encontros pelo caminho</p><h2>Descobertas que podem entrar no seu percurso</h2><p>Negócios locais confirmados poderão fazer parte desta rede. Enquanto a relação comercial não é confirmada, qualquer parceiro de teste permanece claramente identificado como DEMO.</p></div>
        <div class="ch-gallery" data-current-gallery>${partnerList.map((p,i)=>`<article class="ch-partner" data-gallery-index="${i}"><div class="ch-partner-card"><img src="${esc(imageFor(p,i+2))}" alt="" loading="lazy"><div><small>${esc((p.categoryIds||[]).map(categoryName).slice(0,2).join(' · ')||'Parceiro')}</small><h3>${esc(p.name)}</h3><p>${esc(p.shortDescription||'Uma descoberta local que pode entrar no percurso.')}</p><a class="ch-button" href="${hrefFor(p)}">Conhecer experiência</a></div></div></article>`).join('')}</div>
        <div class="ch-gallery-controls"><button type="button" data-gallery-prev aria-label="Parceiro anterior">←</button><span>ARRASTE · ROLE · CLIQUE · USE AS SETAS</span><button type="button" data-gallery-next aria-label="Próximo parceiro">→</button></div>
      </div></section>
      <section class="ch-section"><div class="ch-shell"><div class="ch-center"><p class="ch-eyebrow">A linha conecta a experiência</p><h2>Veja como as escolhas se encontram</h2><p>Cada parada permanece no percurso; a interação destaca o ponto e abre seu contexto sem deslocar a linha.</p></div><div class="ch-route-track">${routePlaces.slice(0,4).map((p,i)=>`<a class="ch-route-stop" href="${hrefFor(p)}"><span class="ch-route-dot">${i+1}</span><strong>${esc(p.name)}</strong><small>${esc(p.durationMinutes||60)} min</small></a>`).join('')}</div></div></section>
      <section class="ch-section ch-route-types"><div class="ch-shell"><div class="ch-center"><p class="ch-eyebrow">Tipos de roteiro</p><h2>Encontre um ritmo para os seus dias</h2><p>Troque o foco sem perder a sensação de continuidade entre texto, imagem e informações.</p></div><div class="ch-tabs" role="tablist">${routeTypes.map((r,i)=>`<button class="ch-tab" role="tab" aria-selected="${i===0}" data-route-tab="${i}">${esc(r.name)}</button>`).join('')}</div><div data-route-slide></div></div></section>
      <section class="ch-section"><div class="ch-shell"><div class="ch-center"><p class="ch-eyebrow">Escolha um ponto de partida</p><h2>Comece por aquilo que combina com você</h2><p>Use um interesse como primeiro filtro. O restante do roteiro pode ser ajustado depois.</p></div><div class="ch-card-grid4">${startCats.map(c=>`<a class="ch-choice-card" href="#/roteiro?interest=${encodeURIComponent(c.id)}"><span class="ch-card-icon">✦</span><strong>${esc(c.name)}</strong><small>Explorar este caminho</small></a>`).join('')}</div></div></section>
      <section class="ch-section"><div class="ch-shell"><div class="ch-center"><p class="ch-eyebrow">Descoberta contextual</p><h2>O mesmo lugar pode fazer sentido em momentos diferentes.</h2><p>O contexto da viagem ajuda a organizar possibilidades sem transformar a descoberta em uma sequência fixa.</p><div class="ch-actions" style="justify-content:center"><a class="ch-button" href="#/explorar">Ver possibilidades</a></div></div><div class="ch-context-grid"><article class="ch-panel"><span class="ch-card-icon">☁</span><h3>Contexto do dia</h3><p>Clima e disponibilidade ajudam a decidir quando uma parada faz mais sentido.</p></article><article class="ch-panel"><span class="ch-card-icon">↝</span><h3>Ritmo da viagem</h3><p>O roteiro pode equilibrar atividades, pausas e deslocamentos.</p></article><article class="ch-panel"><span class="ch-card-icon">◇</span><h3>Memória depois</h3><p>O Passaporte separa aquilo que foi planejado do que realmente foi vivido.</p></article></div></div></section>
      <section class="ch-section"><div class="ch-shell"><div class="ch-center"><p class="ch-eyebrow">Explore por interesse</p><h2>Encontre um caminho pelo que chama sua atenção</h2><p>Comece por um tema e continue explorando a cidade sem perder o contexto.</p><div class="ch-actions" style="justify-content:center"><a class="ch-button" href="#/explorar">Ver todos</a></div></div><div class="ch-card-grid4">${cats.map(c=>`<a class="ch-interest-card" href="#/explorar?category=${encodeURIComponent(c.id)}"><span class="ch-card-icon">○</span><strong>${esc(c.name)}</strong><small>Explorar interesse</small></a>`).join('')}</div></div></section>
      <section class="ch-section"><div class="ch-shell"><div class="ch-center"><p class="ch-eyebrow">Perguntas frequentes</p><h2>Antes de começar</h2><p>O essencial para entender como descoberta, roteiro e registro se conectam.</p></div><div class="ch-faq">${faqs.map(([q,a],i)=>`<article class="ch-faq-item"><h3><button type="button" aria-expanded="false" data-faq="${i}">${esc(q)}<span>⌄</span></button></h3><div class="ch-faq-answer" data-faq-answer="${i}" data-open="false"><div><p>${esc(a)}</p></div></div></article>`).join('')}</div></div></section>
      <section class="ch-section"><div class="ch-shell ch-passport"><div class="ch-passport-paper" aria-hidden="true"><img src="./assets/brand/passport/folha-passaporte.svg" alt=""></div><div><p class="ch-eyebrow">Meu Passaporte</p><h2>Planejar é uma coisa. Viver é outra.</h2><p>O roteiro organiza a intenção. O Passaporte guarda registros de presença e transforma a viagem em uma memória visual, sem confundir planejamento com visita realizada.</p><div class="ch-actions"><a class="ch-button ch-button-primary" href="#/meu-passaporte">Conhecer o Passaporte</a><a class="ch-button" href="#/roteiro">Montar roteiro</a></div></div></div></section>
      <section class="ch-section"><div class="ch-shell"><div class="ch-center"><p class="ch-eyebrow">Serra Negra pelo território</p><h2>Veja os lugares no mesmo contexto.</h2><p>Mapa e lista compartilham a mesma base de lugares. A posição territorial ajuda a entender proximidades sem exigir rastreamento contínuo.</p><div class="ch-actions" style="justify-content:center"><a class="ch-button" href="#/explorar?view=map">Abrir mapa</a></div></div><div class="ch-map">${routePlaces.slice(0,6).map((p,i)=>`<a class="ch-pin" title="${esc(p.name)}" href="${hrefFor(p)}" style="left:${12+(i*15)%78}%;top:${22+(i*19)%58}%">${i+1}</a>`).join('')}</div></div></section>
      <section class="ch-section ch-final"><div class="ch-shell"><p class="ch-eyebrow">Seu próximo caminho</p><h2><span>Comece pela curiosidade.</span><span>O roteiro vem depois.</span></h2><p>Explore primeiro, organize quando fizer sentido e guarde o que realmente entrou para a sua viagem.</p><div class="ch-actions"><a class="ch-button ch-button-primary" href="#/roteiro">Montar meu roteiro</a><a class="ch-button" href="#/explorar">Continuar explorando</a></div></div></section>
    </div>`;
    bind(partnerList);
  }
  function bind(partnerList){
    const form=app.querySelector('[data-current-search]');
    form?.addEventListener('submit',e=>{e.preventDefault();const q=new FormData(form).get('q')||'';location.hash=`#/explorar?q=${encodeURIComponent(q)}`;});
    app.querySelectorAll('[data-faq]').forEach(btn=>btn.addEventListener('click',()=>{const id=btn.dataset.faq;const answer=app.querySelector(`[data-faq-answer="${id}"]`);const next=btn.getAttribute('aria-expanded')!=='true';btn.setAttribute('aria-expanded',String(next));answer?.setAttribute('data-open',String(next));}));
    const slide=app.querySelector('[data-route-slide]');
    const drawRoute=index=>{const r=routeTypes[index]||routeTypes[0];slide.innerHTML=`<article class="ch-route-slide"><div class="ch-route-copy"><p class="ch-eyebrow">${esc(r.name)}</p><h3>${esc(r.title)}</h3><p>${esc(r.copy)}</p><a class="ch-button ch-button-primary" href="#/roteiro?profile=${encodeURIComponent(r.name.toLowerCase())}">Montar este roteiro</a></div><img src="${esc(r.image)}" alt=""><aside class="ch-route-meta"><strong>O que muda</strong><span>ordem das paradas</span><span>tempo entre atividades</span><span>alternativas para o contexto</span></aside></article>`;};
    app.querySelectorAll('[data-route-tab]').forEach(btn=>btn.addEventListener('click',()=>{app.querySelectorAll('[data-route-tab]').forEach(x=>x.setAttribute('aria-selected','false'));btn.setAttribute('aria-selected','true');drawRoute(Number(btn.dataset.routeTab||0));}));drawRoute(0);
    let active=0;const items=[...app.querySelectorAll('[data-gallery-index]')];
    const updateGallery=()=>items.forEach((el,i)=>{let off=i-active;const total=items.length;if(total){if(off>total/2)off-=total;if(off<-total/2)off+=total;}const d=Math.abs(off);el.style.setProperty('--x',`${off*360}px`);el.style.setProperty('--y',`${d*26}px`);el.style.setProperty('--z',`${d*-90}px`);el.style.setProperty('--rot',`${off*-5}deg`);el.style.setProperty('--scale',String(Math.max(.76,1-d*.09)));el.style.setProperty('--opacity',String(d>2?0:Math.max(.5,1-d*.2)));el.style.setProperty('--zindex',String(20-d));el.style.pointerEvents=d>2?'none':'auto';});
    const move=delta=>{if(!items.length)return;active=(active+delta+items.length)%items.length;updateGallery();};
    app.querySelector('[data-gallery-prev]')?.addEventListener('click',()=>move(-1));app.querySelector('[data-gallery-next]')?.addEventListener('click',()=>move(1));items.forEach((el,i)=>el.addEventListener('click',e=>{if(i!==active){e.preventDefault();active=i;updateGallery();}}));
    app.querySelector('[data-current-gallery]')?.addEventListener('wheel',e=>{if(Math.abs(e.deltaY)<8)return;e.preventDefault();move(e.deltaY>0?1:-1);},{passive:false});updateGallery();
    const warp=app.querySelector('[data-current-warp]');warp?.addEventListener('pointermove',e=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const r=warp.getBoundingClientRect();const x=((e.clientX-r.left)/Math.max(r.width,1)-.5);warp.children[0].style.transform=`translate(${x*10}px,${x*-2}px) rotate(${x*-.5}deg)`;warp.children[1].style.transform=`translate(${x*-12}px,${x*2}px) rotate(${x*.6}deg)`;});warp?.addEventListener('pointerleave',()=>[...warp.children].forEach(x=>x.style.transform=''));
  }
  const schedule=()=>setTimeout(()=>{if(isHome())render();},0);
  window.addEventListener('hashchange',schedule);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();
})();
