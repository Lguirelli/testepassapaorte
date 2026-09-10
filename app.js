(() => {
  'use strict';

  const DATA = window.PSN_DATA;
  const STORE = 'psn-functional-demo-v1';
  const THEME_STORE = 'psn-theme-v1';
  const app = document.getElementById('app');
  const toastEl = document.getElementById('toast');
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const clone = (v) => JSON.parse(JSON.stringify(v));
  const esc = (v='') => String(v).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const icon = (name, alt='') => `<img src="./assets/icons/${name}.svg" alt="${esc(alt)}" />`;
  const fmtDate = (date) => new Intl.DateTimeFormat('pt-BR',{weekday:'short',day:'2-digit',month:'short'}).format(new Date(`${date}T12:00:00`));
  const fmtFullDate = (date) => new Intl.DateTimeFormat('pt-BR',{weekday:'long',day:'2-digit',month:'long'}).format(new Date(`${date}T12:00:00`));
  const byId = (arr,id) => arr.find(x=>x.id===id);
  const categoryName = id => byId(DATA.content.categories,id)?.name || id;
  const costLabel = v => ({free:'Sem custo',paid:'Pago',mixed:'Misto',paid_with_booking:'Pago · reserva'}[v] || v);
  const environmentLabel = v => ({indoor:'Ambiente interno',outdoor:'Ao ar livre',mixed:'Misto'}[v] || v);
  const relationLabel = v => v === 'partner' ? 'Parceiro demo' : 'Ponto turístico demo';
  const responseLabel = v => ({within_1_hour:'Em até 1 hora (demo)',same_day:'No mesmo dia (demo)',within_few_hours:'Em algumas horas (demo)'}[v] || 'Tempo não informado');
  const weatherLabel = v => ({partly_cloudy:'Parcialmente nublado',rain:'Chuva',clear:'Céu aberto'}[v] || v);
  const weatherIcon = v => ({partly_cloudy:'clima-parcialmente-nublado',rain:'clima-chuva',clear:'sol'}[v] || 'clima-nublado');

  const defaultState = () => ({
    version: 1,
    trip: clone(DATA.trip),
    adminOverrides: {places:{},partners:{},experiences:{},events:{},categories:{},sources:{}},
    drafts: {places:{},partners:{},experiences:{},events:{},categories:{},sources:{}},
    adminCreated: {places:[],partners:[],experiences:[],events:[],categories:[],sources:[]},
    audit: [{at:new Date().toISOString(), action:'demo_started', label:'Ambiente local iniciado'}]
  });
  function loadState(){
    try { const s=JSON.parse(localStorage.getItem(STORE)||'null'); return s?.version===1 ? s : defaultState(); }
    catch { return defaultState(); }
  }
  let state = loadState();
  const save = () => localStorage.setItem(STORE, JSON.stringify(state));
  const ui = {
    explore:{q:'',category:'',relation:'',environment:'',cost:''},
    onboarding:{step:0,answers:{dates:'12 a 14 de setembro',party:'Casal',interests:['cat-natureza','cat-gastronomia','cat-cultura'],intent:'Conhecer e descobrir',pace:'Equilibrado',transport:'Carro',needs:'Nenhuma necessidade específica'}},
    activeDay: state.trip.days[0].date,
    calendarMode:'day',
    passportPage:0,
    adminKind:'places',
    adminEdit:null,
    adminPreview:null,
    homeSpotIndex:0,
    homePartnerIndex:0,
    homeRouteType:'primeira-visita',
    homeFaqOpen:0
  };

  function mergedCollection(kind){
    const base = clone(DATA.content[kind] || []);
    const created = clone(state.adminCreated[kind] || []);
    const overrides = state.adminOverrides[kind] || {};
    return [...base,...created].map(item => ({...item,...(overrides[item.id]||{})}));
  }
  const allPlaces = () => mergedCollection('places');
  const publicPlaces = () => allPlaces().filter(p => p.status !== 'archived');
  const placeById = id => allPlaces().find(p=>p.id===id);
  const placeBySlug = slug => allPlaces().find(p=>p.slug===slug);
  const partnerForPlace = pid => mergedCollection('partners').find(p=>p.placeId===pid);
  const experiencesFor = pid => mergedCollection('experiences').filter(e=>e.placeId===pid && e.status!=='archived');
  const eventsFor = pid => mergedCollection('events').filter(e=>e.placeId===pid && e.status!=='archived');
  const visitFor = pid => state.trip.visits.find(v=>v.placeId===pid);
  const plannedItemFor = pid => state.trip.days.flatMap(d=>d.items.map(i=>({...i,date:d.date}))).find(i=>i.placeId===pid && i.state!=='removed');

  function toast(msg){
    toastEl.textContent = msg; toastEl.classList.add('show');
    clearTimeout(toastEl._t); toastEl._t=setTimeout(()=>toastEl.classList.remove('show'),2800);
  }
  function statusBadges(place){
    const out=[];
    if(plannedItemFor(place.id)) out.push('<span class="badge warn">Planejado</span>');
    if(visitFor(place.id)) out.push('<span class="badge ok">Visita registrada</span>');
    return out.join(' ');
  }
  const categoryIconById = (id) => ({
    'cat-natureza':'explorar','cat-gastronomia':'parceiros','cat-cafes':'lugar-informacao','cat-cultura':'passaporte-categorias','cat-compras':'parceiros','cat-bem-estar':'passaporte-historico'
  }[id] || 'explorar');
  const categoryIconName = (place) => {
    const ids=place?.categoryIds||[];
    if(ids.includes('cat-natureza')) return 'mapa-ponto-turistico';
    if(ids.includes('cat-cafes')) return 'lugar-informacao';
    if(ids.includes('cat-gastronomia')) return 'parceiros';
    if(ids.includes('cat-cultura')) return 'passaporte-categorias';
    if(ids.includes('cat-compras')) return 'parceiros';
    if(ids.includes('cat-bem-estar')) return 'passaporte-historico';
    return place?.commercialRelation==='partner' ? 'parceiros' : 'explorar';
  };
  function scenicMedia(place,variant='card'){
    const cls=(place?.imagePlaceholder||'landscape-01').replace(/[^a-z0-9-]/gi,'');
    const relation=place?.commercialRelation==='partner'?'Parceiro demo':'Ponto demo';
    const title=place?.name||'Serra Negra';
    return `<div class="scenic-media scenic-${variant} media-${cls}" role="img" aria-label="Mídia visual demonstrativa de ${esc(title)}">
      <span class="scenic-ridge ridge-a"></span><span class="scenic-ridge ridge-b"></span><span class="scenic-sun"></span>
      <span class="scenic-grain"></span><span class="scenic-caption">${esc(relation)} · mídia ilustrativa</span>
    </div>`;
  }
  function cardMedia(place){
    return scenicMedia(place,'card');
  }
  function placeCard(place,variant='default'){
    const href = place.commercialRelation==='partner' ? `#/parceiros/${place.slug}` : `#/lugares/${place.slug}`;
    const cats=(place.categoryIds||[]).slice(0,2).map(categoryName).join(' · ');
    return `<article class="place-card ${variant==='editorial'?'place-card-editorial':''}">
      <a class="place-card-media" href="${href}" aria-label="Abrir ${esc(place.name)}">${cardMedia(place)}</a>
      <div class="place-card-body">
        <div class="place-card-meta"><span>${esc(cats||relationLabel(place.commercialRelation))}</span><span>${esc(place.durationMinutes)} min</span></div>
        <h3><a href="${href}">${esc(place.name)}</a></h3>
        <p>${esc(place.shortDescription)}</p>
        <div class="place-card-foot"><div>${statusBadges(place)}</div><span class="place-card-arrow" aria-hidden="true">${icon('avancar')}</span></div>
      </div>
    </article>`;
  }
  function mockMap(places){
    const pts=places.slice(0,6).map((p,i)=>{
      const x=12 + ((i*29)%76), y=18 + ((i*37)%65);
      return `<span class="map-dot" style="left:${x}%;top:${y}%"></span><span class="map-label" style="left:${x}%;top:${y}%">${esc(p.name)}</span>`;
    }).join('');
    return `<div class="mock-map" role="img" aria-label="Mapa demonstrativo sem geografia definitiva">${pts}</div>`;
  }
  function weatherStrip(date = state.trip.days[0].date){
    const w=state.trip.weather.find(x=>x.date===date) || state.trip.weather[0];
    return `<div class="weather-strip"><div class="actions">${icon(weatherIcon(w.condition))}<div><strong>${esc(weatherLabel(w.condition))}</strong><div class="muted">Clima simulado · ${fmtDate(w.date)}</div></div></div><div><strong>${w.temperatureC} °C</strong> · ${w.rainProbability}% de chuva</div></div>`;
  }
  function section(title,eyebrow,body,side=''){
    return `<section class="section"><div class="section-head"><div>${eyebrow?`<p class="eyebrow">${esc(eyebrow)}</p>`:''}<h2>${title}</h2></div>${side}</div>${body}</section>`;
  }
  function pageTitle(title,eyebrow,lead=''){
    return `${eyebrow?`<p class="eyebrow">${esc(eyebrow)}</p>`:''}<h1 class="compact">${title}</h1>${lead?`<p class="lead">${lead}</p>`:''}`;
  }

  const HOME_ROUTE_TYPES = [
    {id:'primeira-visita',label:'Primeira visita',title:'Um começo sem pressa',body:'Uma seleção demonstrativa que combina paisagem, centro e uma pausa gastronômica.',placeIds:['place-mirante-araucarias','place-centro-cultural','place-cafe-neblina']},
    {id:'natureza',label:'Natureza',title:'Verde e horizonte',body:'Paradas ao ar livre e tempo livre para caminhar sem transformar o dia em uma corrida.',placeIds:['place-jardim-nascentes','place-mirante-araucarias','place-casa-mel']},
    {id:'gastronomia',label:'Gastronomia',title:'Sabores pelo caminho',body:'Uma sequência demonstrativa de café, almoço e produção local, sempre com dados fictícios.',placeIds:['place-cafe-neblina','place-bistro-estacao','place-casa-mel']},
    {id:'chuva',label:'Dia de chuva',title:'Descobertas em ambiente interno',body:'Alternativas demonstrativas para reorganizar a viagem quando o clima muda.',placeIds:['place-centro-cultural','place-atelie-pedra-folha','place-aguas-claras']}
  ];
  function homeHeroSection(){
    return `<section class="v2-hero full-bleed" aria-labelledby="home-title">
      <div class="v2-hero-art" aria-hidden="true"><span class="hero-mountain hero-mountain-a"></span><span class="hero-mountain hero-mountain-b"></span><span class="hero-glow"></span><span class="hero-route-line"></span></div>
      <div class="v2-container v2-hero-content">
        <p class="v2-kicker">Passaporte Serra Negra · validação visual v2</p>
        <h1 id="home-title">Serra Negra,<br><em>no seu ritmo.</em></h1>
        <p class="v2-hero-lead">Descubra possibilidades, monte uma viagem flexível e transforme os lugares vividos em memória.</p>
        <form class="v2-search" id="home-search-form" role="search">
          <label for="home-search">O que você quer encontrar?</label>
          <div class="v2-search-row">${icon('busca')}<input id="home-search" name="q" type="search" autocomplete="off" placeholder="Lugar, experiência, café, natureza…"><button class="primary" type="submit">Explorar</button></div>
        </form>
        <div class="v2-quick-search" aria-label="Sugestões rápidas">
          ${['Natureza','Cafés','Cultura','Sem custo'].map(x=>`<button class="v2-suggestion" data-action="home-search-suggestion" data-query="${esc(x)}">${esc(x)}</button>`).join('')}
        </div>
        <div class="v2-hero-note"><span class="hero-scroll-line" aria-hidden="true"></span><p>Role para descobrir a cidade por caminhos, não por rankings.</p></div>
      </div>
    </section>`;
  }
  function homeTouristSpotsSection(){
    const spots=publicPlaces().filter(p=>p.placeType==='tourist_point');
    const idx=Math.min(ui.homeSpotIndex,Math.max(0,spots.length-1)); const active=spots[idx]||spots[0];
    if(!active)return '';
    return `<section class="v2-section v2-spots" aria-labelledby="spots-title"><div class="v2-container">
      <div class="v2-section-heading"><div><p class="v2-kicker">Primeiros caminhos</p><h2 id="spots-title">Conheça Serra Negra</h2></div><p>Uma leitura editorial dos pontos de demonstração. Selecione um cartão para mudar o destaque.</p></div>
      <div class="spot-showcase">
        <article class="spot-feature">${scenicMedia(active,'feature')}<div class="spot-feature-copy"><span>${esc((active.categoryIds||[]).map(categoryName).join(' · '))}</span><h3>${esc(active.name)}</h3><p>${esc(active.shortDescription)}</p><a class="text-link" href="#/lugares/${active.slug}">Conhecer este lugar ${icon('avancar')}</a></div></article>
        <div class="spot-rail" role="list" aria-label="Pontos turísticos">${spots.map((p,i)=>`<button role="listitem" class="spot-mini ${i===idx?'active':''}" data-home-spot="${i}" aria-pressed="${i===idx}">${scenicMedia(p,'mini')}<span><small>${esc((p.categoryIds||[]).map(categoryName).join(' · '))}</small><strong>${esc(p.name)}</strong></span></button>`).join('')}</div>
      </div>
    </div></section>`;
  }
  function homePartnerLoopSection(){
    const partners=publicPlaces().filter(p=>p.commercialRelation==='partner').slice(0,6); if(!partners.length)return '';
    const idx=ui.homePartnerIndex%partners.length;
    const ordered=[-2,-1,0,1,2].map(offset=>{const originalIndex=(idx+offset+partners.length)%partners.length;return {p:partners[originalIndex],originalIndex,offset}});
    return `<section class="v2-section partner-loop-section full-bleed"><div class="v2-container">
      <div class="v2-section-heading light"><div><p class="v2-kicker">Encontros pelo caminho</p><h2>Parceiros que entram na viagem</h2></div><p>Nenhuma posição indica ranking. O destaque muda para validar o comportamento do índice.</p></div>
      <div class="partner-stage"><button class="round-control" data-action="partner-prev" aria-label="Parceiro anterior">${icon('chevron-esquerda')}</button><div class="partner-loop">${ordered.map(({p,originalIndex,offset})=>{const d=Math.abs(offset);return `<article class="partner-loop-card depth-${Math.min(d,2)} ${offset===0?'is-center':''}" data-partner-index="${originalIndex}">${scenicMedia(p,'partner')}<div><span>${esc((p.categoryIds||[]).map(categoryName).join(' · '))}</span><h3>${esc(p.name)}</h3><p>${esc(p.location?.display||'Área de demonstração')}</p>${offset===0?`<a href="#/parceiros/${p.slug}" class="button light-button">Abrir página</a>`:`<button data-home-partner="${originalIndex}">Centralizar</button>`}</div></article>`}).join('')}</div><button class="round-control" data-action="partner-next" aria-label="Próximo parceiro">${icon('chevron-direita')}</button></div>
    </div></section>`;
  }
  function homeRouteVisualSection(){
    const day=state.trip.days[0]; const items=day.items.filter(i=>i.state!=='removed').slice(0,5);
    return `<section class="v2-section route-story"><div class="v2-container"><div class="route-story-grid"><div><p class="v2-kicker">A linha conecta a experiência</p><h2>Um roteiro é uma sequência que pode mudar.</h2><p class="v2-copy">A viagem demonstrativa compartilha os mesmos dados com calendário e Passaporte. Alterar uma parada não reconstrói silenciosamente o restante.</p><a class="button primary" href="#/viagens/demo-trip-001/roteiro">Abrir roteiro pronto</a></div><div class="route-canvas" aria-label="Rota demonstrativa">${items.map((i,n)=>{const p=placeById(i.placeId);return `<div class="route-stop stop-${n+1}"><span>${n+1}</span><div><small>${esc(i.startsAt)}</small><strong>${esc(p?.name||i.placeId)}</strong></div></div>`}).join('')}<svg viewBox="0 0 700 360" aria-hidden="true"><path d="M62 290 C155 220, 130 112, 260 120 S420 305, 505 215 S575 75, 655 82" /></svg></div></div></div></section>`;
  }
  function homeRouteTypesSection(){
    const selected=HOME_ROUTE_TYPES.find(x=>x.id===ui.homeRouteType)||HOME_ROUTE_TYPES[0];
    const places=selected.placeIds.map(placeById).filter(Boolean);
    return `<section class="v2-section route-types full-bleed"><div class="v2-container"><div class="route-types-main"><div class="route-type-media">${scenicMedia(places[0]||{},'route-type')}<div class="route-type-index">0${HOME_ROUTE_TYPES.indexOf(selected)+1}</div></div><div class="route-type-copy"><p class="v2-kicker">Tipos de roteiro</p><h2>${esc(selected.title)}</h2><p>${esc(selected.body)}</p><div class="route-type-stats"><span>3 paradas</span><span>1 dia</span><span>editável</span></div><a class="button primary" href="#/roteiro">Montar o meu</a></div></div><div class="route-type-tabs" role="tablist">${HOME_ROUTE_TYPES.map(x=>`<button role="tab" aria-selected="${x.id===selected.id}" class="${x.id===selected.id?'active':''}" data-route-type="${x.id}"><small>${String(HOME_ROUTE_TYPES.indexOf(x)+1).padStart(2,'0')}</small><span>${esc(x.label)}</span></button>`).join('')}</div></div></section>`;
  }
  function homeRouteCardsSection(){
    const cards=HOME_ROUTE_TYPES.slice(0,3);
    return `<section class="v2-section"><div class="v2-container"><div class="v2-section-heading"><div><p class="v2-kicker">Escolha um ponto de partida</p><h2>Roteiros para diferentes intenções</h2></div><a href="#/roteiro" class="text-link">Criar do zero ${icon('avancar')}</a></div><div class="route-card-grid">${cards.map((r,i)=>{const p=placeById(r.placeIds[0]);return `<article class="route-type-card">${scenicMedia(p,'poster')}<div class="route-card-number">0${i+1}</div><div class="route-card-copy"><small>${esc(r.label)}</small><h3>${esc(r.title)}</h3><div><span>1 dia</span><span>3 lugares</span></div><button data-route-type="${r.id}" data-action="route-type-to-onboarding">Usar como inspiração</button></div></article>`}).join('')}</div></div></section>`;
  }
  function homeEditorialSection(){
    const event=mergedCollection('events').find(e=>e.status!=='archived');
    return `<section class="v2-section editorial-discovery"><div class="v2-container"><div class="editorial-split"><div class="editorial-media">${scenicMedia(placeById('place-jardim-nascentes')||{},'editorial')}<span class="editorial-tag">Para hoje · demo</span></div><div class="editorial-copy"><p class="v2-kicker">Descoberta contextual</p><h2>O mesmo destino pode pedir um dia diferente.</h2><p>Clima, tempo disponível e intenção podem reorganizar a leitura da cidade. Nesta versão, o contexto é inteiramente simulado.</p>${weatherStrip()}<a class="text-link" href="#/explorar">Ver possibilidades ${icon('avancar')}</a></div></div>${event?`<div class="editorial-event"><span>${fmtDate(event.startsAt.slice(0,10))}</span><strong>${esc(event.name)}</strong><p>Evento de demonstração associado ao conteúdo sintético.</p></div>`:''}</div></section>`;
  }
  function homeCategoriesSection(){
    const cats=mergedCollection('categories').filter(c=>c.enabled!==false);
    const mediaMap={'cat-natureza':'place-jardim-nascentes','cat-gastronomia':'place-bistro-estacao','cat-cafes':'place-cafe-neblina','cat-cultura':'place-centro-cultural','cat-compras':'place-atelie-pedra-folha','cat-bem-estar':'place-aguas-claras'};
    return `<section class="v2-section categories-section"><div class="v2-container"><div class="v2-section-heading"><div><p class="v2-kicker">Explore por interesse</p><h2>O que combina com a sua viagem?</h2></div><p>As categorias filtram o conteúdo existente sem criar uma hierarquia de importância.</p></div><div class="category-grid">${cats.map(c=>{const p=placeById(mediaMap[c.id])||publicPlaces()[0];return `<a href="#/explorar?category=${encodeURIComponent(c.id)}" class="category-tile">${scenicMedia(p,'category')}<span class="category-icon">${icon(categoryIconById(c.id))}</span><strong>${esc(c.name)}</strong><small>Explorar</small></a>`}).join('')}<a href="#/explorar" class="category-tile category-all"><span>${icon('explorar')}</span><strong>Ver todos</strong><small>Busca e filtros</small></a></div></div></section>`;
  }
  function homeFaqSection(){
    const faqs=[
      ['Preciso criar conta?','Não nesta demonstração. O estado é salvo somente no navegador para permitir validar os fluxos.'],
      ['Como funcionam os roteiros?','Você responde ao onboarding, recebe um roteiro demonstrativo e pode mover, fixar, remover ou adicionar paradas sem reconstrução automática.'],
      ['Como funciona o Passaporte?','Planejamento e visita registrada são estados diferentes. O Passaporte reúne apenas os registros demonstrativos confirmados.'],
      ['Como funciona o QR?','O QR real ainda não está integrado nesta fase. O registro manual existe somente para validar a experiência e permanece identificado como demonstração.'],
      ['Posso alterar o roteiro?','Sim. As mudanças locais são persistidas no navegador e refletidas também no calendário.']
    ];
    return `<section class="v2-section faq-section full-bleed"><div class="v2-container faq-grid"><div><p class="v2-kicker">Perguntas frequentes</p><h2>Entenda antes de começar.</h2><p>Esta interface é uma validação funcional. Recursos ainda não integrados são mostrados como tal, sem simular disponibilidade real.</p></div><div class="faq-list">${faqs.map((f,i)=>`<div class="faq-item ${ui.homeFaqOpen===i?'open':''}"><button data-home-faq="${i}" aria-expanded="${ui.homeFaqOpen===i}"><span>${esc(f[0])}</span><span aria-hidden="true">${ui.homeFaqOpen===i?'−':'+'}</span></button>${ui.homeFaqOpen===i?`<div class="faq-answer"><p>${esc(f[1])}</p></div>`:''}</div>`).join('')}</div></div></section>`;
  }
  function homePassportIntroSection(){
    const steps=['Explorar','Montar','Visitar','Registrar','Construir o Passaporte'];
    return `<section class="v2-section passport-intro"><div class="v2-container passport-intro-grid"><div class="passport-mock"><div class="passport-cover"><span>PASSAPORTE</span><strong>SERRA<br>NEGRA</strong><small>memórias da viagem</small></div><div class="passport-page-demo"><div class="passport-stamp-demo">VISITA<br><strong>12 SET</strong><br>DEMO</div><p>${state.trip.visits.length} registros demonstrativos</p></div></div><div><p class="v2-kicker">Da intenção à memória</p><h2>O roteiro organiza. O Passaporte guarda.</h2><p class="v2-copy">A experiência separa claramente o que você pretende fazer daquilo que registrou como vivido.</p><ol class="passport-steps">${steps.map((x,i)=>`<li><span>0${i+1}</span><strong>${esc(x)}</strong></li>`).join('')}</ol><a class="button primary" href="#/meu-passaporte">Abrir meu Passaporte</a></div></div></section>`;
  }
  function homeMapSection(){
    const ps=publicPlaces().slice(0,5);
    return `<section class="v2-section map-explore-section"><div class="v2-container"><div class="v2-section-heading"><div><p class="v2-kicker">Visão territorial</p><h2>Explore também pelo mapa</h2></div><p>O mapa desta validação é abstrato. Ele demonstra vínculo entre pins, cards e filtros sem afirmar geografia real.</p></div><div class="map-explore-grid"><div>${mockMap(ps)}</div><div class="map-side-list">${ps.slice(0,3).map(p=>`<a href="${p.commercialRelation==='partner'?'#/parceiros/':'#/lugares/'}${p.slug}"><span>${icon(categoryIconName(p))}</span><div><small>${esc((p.categoryIds||[]).map(categoryName).join(' · '))}</small><strong>${esc(p.name)}</strong></div>${icon('chevron-direita')}</a>`).join('')}<a class="button primary" href="#/explorar">Abrir exploração completa</a></div></div></div></section>`;
  }
  function homeFinalCtaSection(){
    return `<section class="final-cta full-bleed"><div class="final-cta-art" aria-hidden="true"></div><div class="v2-container final-cta-copy"><p class="v2-kicker">Seu próximo caminho</p><h2>Comece pela curiosidade.<br>O roteiro vem depois.</h2><div class="actions"><a class="button light-button" href="#/roteiro">Montar meu roteiro</a><a class="button ghost-light" href="#/explorar">Explorar primeiro</a></div></div></section>`;
  }
  const sectionRegistry={
    homeHero:homeHeroSection,touristSpots:homeTouristSpotsSection,partnerLoop:homePartnerLoopSection,routeVisual:homeRouteVisualSection,routeTypesShowcase:homeRouteTypesSection,routeTypeCards:homeRouteCardsSection,editorialDiscovery:homeEditorialSection,partnerCategories:homeCategoriesSection,homeFaq:homeFaqSection,passportIntro:homePassportIntroSection,mapExplore:homeMapSection,finalCta:homeFinalCtaSection
  };
  const HOME_SECTIONS=[
    {id:'hero',type:'homeHero',version:2,enabled:true,order:10},{id:'spots',type:'touristSpots',version:2,enabled:true,order:20},{id:'partners',type:'partnerLoop',version:2,enabled:true,order:30},{id:'route-visual',type:'routeVisual',version:2,enabled:true,order:40},{id:'route-types',type:'routeTypesShowcase',version:2,enabled:true,order:50},{id:'route-cards',type:'routeTypeCards',version:2,enabled:true,order:60},{id:'editorial',type:'editorialDiscovery',version:2,enabled:true,order:70},{id:'categories',type:'partnerCategories',version:2,enabled:true,order:80},{id:'faq',type:'homeFaq',version:2,enabled:true,order:90},{id:'passport',type:'passportIntro',version:2,enabled:true,order:100},{id:'map',type:'mapExplore',version:2,enabled:true,order:110},{id:'final',type:'finalCta',version:2,enabled:true,order:120}
  ];
  function renderHome(){
    app.innerHTML=`<div class="home-v2">${HOME_SECTIONS.filter(x=>x.enabled).sort((a,b)=>a.order-b.order).map(def=>sectionRegistry[def.type]?.(def)||'').join('')}</div>`;
  }

  function parseQueryFromHash(){
    const raw=location.hash.slice(1); const qidx=raw.indexOf('?');
    return new URLSearchParams(qidx>=0?raw.slice(qidx+1):'');
  }
  function renderExplore(){
    const qs=parseQueryFromHash();
    if(qs.get('category')) ui.explore.category=qs.get('category');
    if(qs.get('q')) ui.explore.q=qs.get('q');
    if(qs.get('relation')) ui.explore.relation=qs.get('relation');
    const cats=mergedCollection('categories').filter(c=>c.enabled!==false);
    app.innerHTML = `${pageTitle('O que você quer descobrir?','Lugares · experiências · eventos','Busque e combine filtros. Lista e mapa usam exatamente o mesmo conjunto de resultados.')}
      <section class="panel" aria-label="Filtros">
        <label class="field">Buscar<input class="searchbox" id="explore-q" type="search" placeholder="Experimente buscar café" value="${esc(ui.explore.q)}"></label>
        <div class="chips" id="category-chips"><button class="chip ${!ui.explore.category?'active':''}" data-filter-category="">Tudo</button>${cats.map(c=>`<button class="chip ${ui.explore.category===c.id?'active':''}" data-filter-category="${esc(c.id)}">${esc(c.name)}</button>`).join('')}</div>
        <div class="filters"><label class="field">Relação<select id="explore-relation"><option value="">Todos</option><option value="partner" ${ui.explore.relation==='partner'?'selected':''}>Parceiros</option><option value="public_point" ${ui.explore.relation==='public_point'?'selected':''}>Pontos turísticos</option></select></label><label class="field">Ambiente<select id="explore-environment"><option value="">Qualquer</option><option value="indoor" ${ui.explore.environment==='indoor'?'selected':''}>Interno</option><option value="outdoor" ${ui.explore.environment==='outdoor'?'selected':''}>Ao ar livre</option><option value="mixed" ${ui.explore.environment==='mixed'?'selected':''}>Misto</option></select></label><label class="field">Custo<select id="explore-cost"><option value="">Qualquer</option><option value="free" ${ui.explore.cost==='free'?'selected':''}>Sem custo</option><option value="paid" ${ui.explore.cost==='paid'?'selected':''}>Pago</option><option value="mixed" ${ui.explore.cost==='mixed'?'selected':''}>Misto</option></select></label></div>
        <div class="actions"><button data-action="clear-filters">Limpar filtros</button></div>
      </section>
      <div id="explore-results"></div>`;
    bindExploreInputs(); renderExploreResults();
  }
  function exploreFiltered(){
    const q=ui.explore.q.trim().toLocaleLowerCase('pt-BR');
    return publicPlaces().filter(p=>{
      const text=[p.name,p.shortDescription,...(p.categoryIds||[]).map(categoryName)].join(' ').toLocaleLowerCase('pt-BR');
      return (!q||text.includes(q)) && (!ui.explore.category||(p.categoryIds||[]).includes(ui.explore.category)) && (!ui.explore.relation||p.commercialRelation===ui.explore.relation) && (!ui.explore.environment||p.environment===ui.explore.environment) && (!ui.explore.cost||p.costType===ui.explore.cost);
    });
  }
  function renderExploreResults(){
    const el=$('#explore-results'); if(!el)return; const places=exploreFiltered();
    el.innerHTML = `${section(`${places.length} ${places.length===1?'lugar encontrado':'lugares encontrados'}`,'Resultado',`${weatherStrip()}<div style="height:1rem"></div><div class="two-col"><div>${places.length?`<div class="grid two">${places.map(placeCard).join('')}</div>`:'<div class="empty">Nenhum lugar corresponde aos filtros.</div>'}</div>${mockMap(places)}</div>`)}${renderEventsSection()}`;
  }
  function bindExploreInputs(){
    $('#explore-q')?.addEventListener('input',e=>{ui.explore.q=e.target.value;renderExploreResults()});
    $('#explore-relation')?.addEventListener('change',e=>{ui.explore.relation=e.target.value;renderExploreResults()});
    $('#explore-environment')?.addEventListener('change',e=>{ui.explore.environment=e.target.value;renderExploreResults()});
    $('#explore-cost')?.addEventListener('change',e=>{ui.explore.cost=e.target.value;renderExploreResults()});
  }
  function renderEventsSection(){
    const events=mergedCollection('events').filter(e=>e.status!=='archived');
    return section('Eventos de demonstração','Agenda',`<div class="grid">${events.map(e=>{const p=placeById(e.placeId);return `<article class="panel"><span class="badge">${fmtDate(e.startsAt.slice(0,10))}</span><h3>${esc(e.name)}</h3><p class="muted">${esc(p?.name||'Local demo')} · ${esc(environmentLabel(e.environment))}</p>${p?`<a href="${p.commercialRelation==='partner'?'#/parceiros/':'#/lugares/'}${p.slug}">Ver local</a>`:''}</article>`}).join('')}</div>`);
  }

  function addToTrip(placeId){
    if(plannedItemFor(placeId)){toast('Este lugar já está no roteiro.');return;}
    const day=state.trip.days[0]; const idx=day.items.length;
    day.items.push({id:`local-item-${Date.now()}`,placeId,startsAt:`${Math.min(17,9+idx*2).toString().padStart(2,'0')}:00`,durationMinutes:placeById(placeId)?.durationMinutes||60,source:'added_by_user',state:'planned'});
    save();toast('Lugar adicionado ao roteiro de demonstração.');render();
  }
  function registerVisit(placeId){
    if(visitFor(placeId)){toast('Já existe uma visita demo registrada para este lugar.');return;}
    state.trip.visits.push({id:`visit-local-${Date.now()}`,placeId,occurredAt:'2026-09-12T16:30:00-03:00',evidence:'manual_demo',tripId:'demo-trip-001',isReturn:false,outsidePlannedRoute:!plannedItemFor(placeId)});
    state.audit.unshift({at:new Date().toISOString(),action:'visit_registered',label:placeById(placeId)?.name||placeId});
    save();toast('Visita de demonstração registrada.');render();
  }

  function renderPlace(slug,asPartner=false){
    const p=placeBySlug(slug); if(!p){return renderNotFound();}
    const isPartner=asPartner || p.commercialRelation==='partner';
    if(isPartner) return renderPartner(p);
    const exps=experiencesFor(p.id), evs=eventsFor(p.id); const suggestions=publicPlaces().filter(x=>x.id!==p.id).slice(0,4);
    app.innerHTML = `<a href="#/explorar">← Voltar a explorar</a><section class="hero"><div><p class="eyebrow">Ponto turístico · demonstração</p><h1 class="compact">${esc(p.name)}</h1><p class="lead">${esc(p.shortDescription)}</p><div class="actions">${statusBadges(p)}<button class="primary" data-action="add-trip" data-place="${p.id}">${plannedItemFor(p.id)?'Já está no roteiro':'Adicionar ao roteiro'}</button><button data-action="register-visit" data-place="${p.id}">${visitFor(p.id)?'Visita registrada':'Registrar visita demo'}</button></div></div><div class="hero-visual"><div class="mark">PONTO<br><strong>DEMO</strong></div></div></section>
      <section class="section two-col"><div><p class="eyebrow">Sobre o lugar</p><h2>Conheça este ponto</h2><p class="lead">${esc(p.longDescription||p.shortDescription)}</p><div class="gallery"><div></div><div></div><div></div></div></div><aside class="sidebar"><div class="panel"><h3>Informações rápidas</h3><dl class="info-list"><div><dt>Horário</dt><dd>${esc(p.openingHours?.text||'Demo')}</dd></div><div><dt>Duração</dt><dd>${p.durationMinutes} min</dd></div><div><dt>Ambiente</dt><dd>${esc(environmentLabel(p.environment))}</dd></div><div><dt>Custo</dt><dd>${esc(costLabel(p.costType))}</dd></div></dl></div>${weatherStrip()}</aside></section>
      ${section('Experiências neste lugar','O que fazer',exps.length?`<div class="grid">${exps.map(e=>`<article class="panel"><span class="badge">${esc(costLabel(e.costType))}</span><h3>${esc(e.name)}</h3><p class="muted">${e.durationMinutes} min · ${esc(environmentLabel(e.environment))}</p></article>`).join('')}</div>`:'<div class="empty">Nenhuma experiência associada.</div>')}
      ${evs.length?section('Eventos','Agenda',`<div class="grid">${evs.map(e=>`<article class="panel"><span class="badge">${fmtDate(e.startsAt.slice(0,10))}</span><h3>${esc(e.name)}</h3><p>${esc(costLabel(e.costType))}</p></article>`).join('')}</div>`):''}
      ${section('Localização','Mapa demonstrativo',mockMap([p,...suggestions.slice(0,2)]))}
      ${section('Continue explorando','Próximos lugares',`<div class="grid">${suggestions.slice(0,3).map(placeCard).join('')}</div>`)}
    `;
  }

  function partnerQuickInfo(p,partner){
    const rows=[['lugar-horario','Hoje',p.openingHours?.text],['lugar-duracao-sugerida','Tempo sugerido',`${p.durationMinutes} min`],['lugar-informacao','Ambiente',environmentLabel(p.environment)],['lugar-informacao','Custo',costLabel(p.costType)],['lugar-tempo-de-resposta','Resposta',responseLabel(partner?.responseTime)]];
    return `<div class="partner-quick-info">${rows.filter(x=>x[2]).map(x=>`<div>${icon(x[0])}<span><small>${esc(x[1])}</small><strong>${esc(x[2])}</strong></span></div>`).join('')}</div>`;
  }
  function renderPartner(p){
    const partner=partnerForPlace(p.id); const exps=experiencesFor(p.id); const suggestions=publicPlaces().filter(x=>x.id!==p.id).slice(0,4);
    const visited=visitFor(p.id), planned=plannedItemFor(p.id);
    app.innerHTML = `<div class="partner-page-v2">
      <section class="partner-hero-v2 full-bleed">${scenicMedia(p,'partner-hero')}<div class="partner-hero-overlay"></div><div class="v2-container partner-hero-copy"><a class="back-on-dark" href="#/explorar">${icon('voltar')} Voltar a explorar</a><p class="v2-kicker">${esc((p.categoryIds||[]).map(categoryName).join(' · '))} · parceiro demo</p><h1>${esc(p.name)}</h1><p>${esc(p.shortDescription)}</p><div class="partner-hero-actions"><button class="light-button" data-action="add-trip" data-place="${p.id}">${planned?'Já está no roteiro':'Adicionar ao roteiro'}</button><span class="partner-stamp">PARCEIRO<br><strong>DEMO</strong></span></div></div></section>
      <div class="v2-container partner-quick-wrap">${partnerQuickInfo(p,partner)}</div>
      <section class="v2-section"><div class="v2-container partner-about-grid"><div><p class="v2-kicker">Sobre este lugar</p><h2>Uma parada que entra no contexto da viagem.</h2><p class="v2-copy">${esc(p.shortDescription)}</p><p class="muted">Conteúdo sintético para validação. Nenhum dado de atendimento ou localização representa um estabelecimento real.</p></div><div class="partner-about-media">${scenicMedia(p,'about')}<div class="partner-mini-media">${scenicMedia(p,'mini')}</div></div></div></section>
      ${exps.length?`<section class="v2-section partner-features full-bleed"><div class="v2-container"><div class="v2-section-heading light"><div><p class="v2-kicker">O que você encontra aqui</p><h2>Experiências associadas</h2></div><p>Os módulos abaixo são derivados das experiências existentes no seed demonstrativo.</p></div><div class="partner-feature-grid">${exps.map((e,i)=>`<article class="partner-feature ${i%2?'reverse':''}"><div class="feature-media">${scenicMedia(p,'feature-block')}</div><div><span class="badge">${esc(costLabel(e.costType))}</span><h3>${esc(e.name)}</h3><p>${e.durationMinutes} min · ${esc(environmentLabel(e.environment))}</p>${e.bookingType==='external_required'?'<button class="light-button" data-action="demo-contact">Solicitar reserva demo</button>':''}</div></article>`).join('')}</div></div></section>`:''}
      <section class="v2-section"><div class="v2-container partner-details-grid"><div><p class="v2-kicker">Antes de visitar</p><h2>Informações e ações</h2><div class="details-list"><div><span>Horário</span><strong>${esc(p.openingHours?.text||'Não informado')}</strong></div><div><span>Localização</span><strong>${esc(p.location?.display||'Não informada')}</strong></div><div><span>Ambiente</span><strong>${esc(environmentLabel(p.environment))}</strong></div><div><span>Duração sugerida</span><strong>${p.durationMinutes} min</strong></div></div><p class="muted">Links de contato são bloqueados nesta demo para evitar confusão com canais reais.</p><div class="contact-row"><button data-action="demo-contact">${icon('lugar-whatsapp')} WhatsApp</button><button data-action="demo-contact">${icon('lugar-instagram')} Instagram</button><button data-action="demo-contact">${icon('link-externo')} Site</button></div></div><aside class="sticky-summary"><p class="v2-kicker">Na sua viagem</p><h3>${planned?'Este lugar já está no roteiro.':'Quer incluir esta parada?'}</h3><p>${visited?'Há uma visita demonstrativa registrada.':planned?'Planejado não significa visitado. O registro continua separado.':'Você pode adicioná-lo à viagem sem alterar as outras paradas.'}</p><button class="primary" data-action="add-trip" data-place="${p.id}">${planned?'Já adicionado':'Adicionar ao roteiro'}</button><button data-action="register-visit" data-place="${p.id}">${visited?'Visita registrada':'Registrar visita demo'}</button></aside></div></section>
      <section class="v2-section partner-location"><div class="v2-container"><div class="v2-section-heading"><div><p class="v2-kicker">Localização</p><h2>Onde esta parada entra no mapa</h2></div><p>Mapa abstrato de validação, sem geografia definitiva.</p></div><div class="map-explore-grid"><div>${mockMap([p,...suggestions.slice(0,3)])}</div><div class="location-copy"><span>${icon('lugar-localizacao')}</span><h3>${esc(p.location?.display||'Localização não informada')}</h3><p>O endereço textual permanece acessível mesmo quando o mapa não representa um provedor real.</p><button data-action="demo-contact">Abrir rota demo ${icon('mapa-abrir-navegacao')}</button></div></div></div></section>
      <section class="v2-section"><div class="v2-container"><div class="v2-section-heading"><div><p class="v2-kicker">Continue explorando</p><h2>Outros caminhos</h2></div><a class="text-link" href="#/explorar">Ver todos ${icon('avancar')}</a></div><div class="grid">${suggestions.slice(0,3).map(x=>placeCard(x,'editorial')).join('')}</div></div></section>
    </div>`;
  }

  function renderPartnerAcquisition(){
    app.innerHTML=`<div class="partner-acquisition"><section class="acquisition-hero full-bleed"><div class="v2-container"><p class="v2-kicker">Para parceiros</p><h1>Faça parte do caminho,<br>não de uma lista.</h1><p>Uma demonstração da proposta de presença dentro da jornada do turista. Nenhuma condição comercial é final nesta versão.</p><a class="button light-button" href="#/parceiros/cafe-neblina-alta">Ver uma página de parceiro</a></div></section><section class="v2-section"><div class="v2-container"><div class="v2-section-heading"><div><p class="v2-kicker">Jornada visual</p><h2>Descoberta → interesse → visita → memória</h2></div></div><div class="journey-steps">${['Descoberta','Página','Contato','Roteiro','Visita','Passaporte'].map((x,i)=>`<div><span>0${i+1}</span><strong>${x}</strong></div>`).join('')}</div></div></section><section class="v2-section"><div class="v2-container partner-about-grid"><div><p class="v2-kicker">Valor demonstrado</p><h2>O parceiro aparece no contexto certo.</h2><p class="v2-copy">A proposta visual v2 integra o negócio ao ecossistema do Passaporte, preservando a identidade da plataforma e separando ações internas de links externos.</p></div><div class="panel"><h3>O que esta demo permite validar</h3><p>Página pública, informações práticas, experiências, inclusão no roteiro, registro demonstrativo de visita e continuidade da exploração.</p><a class="button primary" href="#/parceiros/cafe-neblina-alta">Abrir exemplo funcional</a></div></div></section></div>`;
  }

  const onboardingSteps = [
    {key:'dates',title:'Quando você vai?',lead:'A demo usa o período de 12 a 14 de setembro de 2026.',choices:['12 a 14 de setembro','13 a 14 de setembro','Ainda não sei']},
    {key:'party',title:'Com quem você viaja?',choices:['Casal','Família','Amigos','Sozinho']},
    {key:'interests',title:'O que você quer encontrar?',multi:true,choices:()=>mergedCollection('categories').filter(c=>c.enabled!==false).map(c=>({value:c.id,label:c.name}))},
    {key:'intent',title:'Qual é a intenção da viagem?',choices:['Conhecer e descobrir','Relaxar','Comer bem','Ver paisagens']},
    {key:'pace',title:'Qual ritmo combina com vocês?',choices:['Tranquilo','Equilibrado','Ativo']},
    {key:'transport',title:'Como vocês vão circular?',choices:['Carro','A pé','Táxi / app']},
    {key:'needs',title:'Alguma necessidade importante?',choices:['Nenhuma necessidade específica','Preferir opções sem custo','Acessibilidade parcial ou completa','Restrição alimentar']},
    {key:'review',title:'Pronto para montar?',review:true}
  ];
  function renderOnboarding(){
    const s=onboardingSteps[ui.onboarding.step]; const pct=((ui.onboarding.step+1)/onboardingSteps.length)*100;
    const choices=typeof s.choices==='function'?s.choices():(s.choices||[]).map(v=>({value:v,label:v}));
    const answer=ui.onboarding.answers[s.key];
    app.innerHTML = `<div class="onboarding"><p class="eyebrow">Roteiro demo · etapa ${ui.onboarding.step+1} de ${onboardingSteps.length}</p><div class="progress"><span style="width:${pct}%"></span></div><h1 class="compact">${esc(s.title)}</h1>${s.lead?`<p class="lead">${esc(s.lead)}</p>`:''}${s.review?renderReview():`<div class="choices">${choices.map(c=>{const selected=s.multi?(answer||[]).includes(c.value):answer===c.value;return `<button class="choice ${selected?'selected':''}" data-onboard-key="${s.key}" data-onboard-value="${esc(c.value)}" data-onboard-multi="${s.multi?'1':'0'}">${esc(c.label)}</button>`}).join('')}</div>`}<div class="trip-toolbar"><button ${ui.onboarding.step===0?'disabled':''} data-action="onboard-prev">Voltar</button>${s.review?`<button class="primary" data-action="generate-trip">Gerar roteiro demo</button>`:`<button class="primary" data-action="onboard-next">Continuar</button>`}</div></div>`;
  }
  function renderReview(){
    const a=ui.onboarding.answers; return `<div class="panel"><h3>Suas escolhas</h3><dl class="info-list"><div><dt>Quando</dt><dd>${esc(a.dates)}</dd></div><div><dt>Com quem</dt><dd>${esc(a.party)}</dd></div><div><dt>Interesses</dt><dd>${(a.interests||[]).map(categoryName).map(esc).join(', ')}</dd></div><div><dt>Intenção</dt><dd>${esc(a.intent)}</dd></div><div><dt>Ritmo</dt><dd>${esc(a.pace)}</dd></div><div><dt>Transporte</dt><dd>${esc(a.transport)}</dd></div><div><dt>Necessidades</dt><dd>${esc(a.needs)}</dd></div></dl><p class="muted">O motor desta versão é determinístico e usa conteúdo sintético.</p></div>`;
  }
  function generateTrip(){
    state.trip=clone(DATA.trip); state.trip.trip.party=ui.onboarding.answers.party; state.trip.trip.pace=ui.onboarding.answers.pace; state.trip.trip.transport=ui.onboarding.answers.transport; state.trip.trip.interests=clone(ui.onboarding.answers.interests||[]);
    state.audit.unshift({at:new Date().toISOString(),action:'trip_generated',label:'Roteiro demo gerado'}); save(); toast('Roteiro de demonstração gerado.'); location.hash='#/viagens/demo-trip-001/roteiro';
  }

  function renderRoute(){
    if(!state.trip.days.some(d=>d.date===ui.activeDay)) ui.activeDay=state.trip.days[0].date;
    const day=state.trip.days.find(d=>d.date===ui.activeDay); const items=day.items.filter(i=>i.state!=='removed');
    app.innerHTML = `${pageTitle('Seu roteiro de demonstração','Viagem · 12 a 14 de setembro','Edite uma parada sem reconstruir silenciosamente o restante da viagem.')}${weatherStrip(day.date)}<div class="trip-toolbar"><div class="day-tabs">${state.trip.days.map(d=>`<button data-day="${d.date}" class="${d.date===day.date?'primary':''}">${fmtDate(d.date)}</button>`).join('')}</div><div class="actions"><a class="button" href="#/viagens/demo-trip-001/calendario">Ver calendário</a><a class="button" href="#/meu-passaporte">Meu Passaporte</a></div></div>
      <section class="two-col"><div><div class="timeline">${items.length?items.map(i=>routeItem(i,day.date)).join(''):'<div class="empty">Este dia está livre.</div>'}</div></div><aside class="sidebar"><div class="panel"><h3>Adicionar uma parada</h3><label class="field">Lugar<select id="route-add-place"><option value="">Escolha um lugar</option>${publicPlaces().filter(p=>!plannedItemFor(p.id)).map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('')}</select></label><button data-action="route-add-selected">Adicionar ao dia</button></div><div class="panel"><h3>Como editar</h3><p class="muted">Mover altera apenas o horário da parada. Fixar preserva a escolha. Remover não reorganiza automaticamente o restante.</p></div>${mockMap(items.map(i=>placeById(i.placeId)).filter(Boolean))}</aside></section>`;
  }
  function routeItem(i,date){
    const p=placeById(i.placeId); const fixed=i.state==='fixed'; const visited=!!visitFor(i.placeId);
    return `<article class="card route-item ${fixed?'fixed':''}"><time>${esc(i.startsAt)}</time><div><div class="actions"><span class="badge">${fixed?'Fixo':'Planejado'}</span>${visited?'<span class="badge ok">Registrado</span>':''}</div><h3>${esc(p?.name||i.placeId)}</h3><p class="muted">${p?esc(p.shortDescription):''}</p><a href="${p?.commercialRelation==='partner'?'#/parceiros/':'#/lugares/'}${p?.slug||''}">Abrir página</a></div><div class="route-actions"><button data-route-action="earlier" data-item="${i.id}" data-date="${date}" aria-label="Mover 30 minutos antes">−30 min</button><button data-route-action="later" data-item="${i.id}" data-date="${date}" aria-label="Mover 30 minutos depois">+30 min</button><button data-route-action="fix" data-item="${i.id}" data-date="${date}">${fixed?'Desfixar':'Fixar'}</button><button class="danger" data-route-action="remove" data-item="${i.id}" data-date="${date}" ${fixed?'disabled title="Desfixe antes de remover"':''}>Remover</button></div></article>`;
  }
  function shiftTime(t,mins){const [h,m]=t.split(':').map(Number);let total=h*60+m+mins;total=Math.max(7*60,Math.min(22*60,total));return `${String(Math.floor(total/60)).padStart(2,'0')}:${String(total%60).padStart(2,'0')}`}
  function routeAction(action,date,id){
    const day=state.trip.days.find(d=>d.date===date); const item=day?.items.find(i=>i.id===id); if(!item)return;
    if(action==='earlier')item.startsAt=shiftTime(item.startsAt,-30); if(action==='later')item.startsAt=shiftTime(item.startsAt,30); if(action==='fix')item.state=item.state==='fixed'?'planned':'fixed'; if(action==='remove'&&item.state!=='fixed')item.state='removed'; save();renderRoute();
  }
  function addSelectedToDay(){
    const pid=$('#route-add-place')?.value;if(!pid){toast('Escolha um lugar para adicionar.');return;} const day=state.trip.days.find(d=>d.date===ui.activeDay);day.items.push({id:`local-${Date.now()}`,placeId:pid,startsAt:'17:00',durationMinutes:placeById(pid)?.durationMinutes||60,source:'added_by_user',state:'planned'});save();toast('Parada adicionada apenas a este dia.');renderRoute();
  }

  function renderCalendar(){
    const mode=ui.calendarMode; const active=state.trip.days.find(d=>d.date===ui.activeDay)||state.trip.days[0];
    app.innerHTML = `${pageTitle('Calendário da viagem','A mesma viagem, outra leitura','Roteiro e calendário compartilham o mesmo estado. Alterações feitas no roteiro aparecem aqui.')}${weatherStrip(active.date)}<div class="trip-toolbar"><div class="calendar-mode"><button class="${mode==='day'?'primary':''}" data-calendar-mode="day">Dia</button><button class="${mode==='week'?'primary':''}" data-calendar-mode="week">Semana</button><button class="${mode==='month'?'primary':''}" data-calendar-mode="month">Mês</button></div><a class="button" href="#/viagens/demo-trip-001/roteiro">Voltar ao roteiro</a></div><section class="section">${mode==='day'?calendarDay(active):mode==='week'?calendarWeek():calendarMonth()}</section>`;
  }
  function calendarItem(i){const p=placeById(i.placeId);return `<article class="panel"><div class="actions"><strong>${esc(i.startsAt)}</strong><span class="badge ${visitFor(i.placeId)?'ok':''}">${visitFor(i.placeId)?'Presença registrada':i.state==='fixed'?'Fixo':'Planejado'}</span></div><h3>${esc(p?.name||i.placeId)}</h3><p class="muted">${i.durationMinutes} min</p></article>`}
  function calendarDay(day){return `<div class="day-tabs">${state.trip.days.map(d=>`<button data-day-calendar="${d.date}" class="${d.date===day.date?'primary':''}">${fmtDate(d.date)}</button>`).join('')}</div><h2 style="margin-top:1.5rem">${fmtFullDate(day.date)}</h2><div class="calendar-day">${day.items.filter(i=>i.state!=='removed').map(calendarItem).join('')||'<div class="empty">Sem atividades.</div>'}</div>`}
  function calendarWeek(){return `<div class="calendar-week">${state.trip.days.map(d=>`<div><p class="eyebrow">${fmtDate(d.date)}</p>${d.items.filter(i=>i.state!=='removed').map(calendarItem).join('')||'<div class="empty">Livre</div>'}</div>`).join('')}</div>`}
  function calendarMonth(){
    const start=1,days=30; const weekdays=['Seg','Ter','Qua','Qui','Sex','Sáb','Dom']; let cells=''; for(let d=1;d<=days;d++){const date=`2026-09-${String(d).padStart(2,'0')}`;const tripDay=state.trip.days.find(x=>x.date===date);cells+=`<div class="month-day"><b>${d}</b>${tripDay?tripDay.items.filter(i=>i.state!=='removed').map(i=>`<div class="month-event">${esc(i.startsAt)} ${esc(placeById(i.placeId)?.name||'')}</div>`).join(''):''}</div>`} return `<div class="calendar-month">${weekdays.map(w=>`<strong>${w}</strong>`).join('')}<div></div>${cells}</div>`;
  }

  const passportPages = () => {
    const visits=state.trip.visits; const planned=state.trip.days.flatMap(d=>d.items.filter(i=>i.state!=='removed')); const categories=[...new Set(visits.flatMap(v=>placeById(v.placeId)?.categoryIds||[]))];
    return [
      {title:'Passaporte Serra Negra',eyebrow:'Capa de validação',body:`<div class="stamp"><span>PASSAPORTE<br><strong>SERRA NEGRA</strong><br>DEMO 2026</span></div><p>Um registro da viagem vivida, separado do que foi apenas planejado.</p>`},
      {title:'Identificação',eyebrow:'Viajante demo',body:`<dl class="info-list"><div><dt>Perfil</dt><dd>${esc(state.trip.trip.party||'Casal')}</dd></div><div><dt>Período</dt><dd>12–14 SET 2026</dd></div><div><dt>Ritmo</dt><dd>${esc(state.trip.trip.pace||'Equilibrado')}</dd></div><div><dt>Transporte</dt><dd>${esc(state.trip.trip.transport||'Carro')}</dd></div></dl>`},
      {title:'Bilhete da viagem',eyebrow:'Viagem demo 001',body:`<div class="ticket"><strong>Serra Negra · SP</strong><p>12 SET 2026 → 14 SET 2026</p><p>${planned.length} paradas planejadas · ${visits.length} presenças registradas</p></div>`},
      {title:'Marcas da viagem',eyebrow:'Carimbos demo',body:visits.slice(0,2).map(v=>stampHtml(v)).join('')||'<p>Nenhuma visita registrada.</p>'},
      {title:'Descobertas',eyebrow:'Fora do roteiro',body:visits.filter(v=>v.outsidePlannedRoute).map(v=>`<div class="ticket"><strong>${esc(placeById(v.placeId)?.name||v.placeId)}</strong><p>Descoberta registrada fora da rota planejada.</p></div>`).join('')||'<p>Nenhuma descoberta fora do roteiro.</p>'},
      {title:'Categorias vividas',eyebrow:'Interesses encontrados',body:`<div class="chips">${categories.map(c=>`<span class="badge">${esc(categoryName(c))}</span>`).join('')}</div><p>Estas categorias são derivadas das visitas registradas, não das intenções de viagem.</p>`},
      {title:'Caminho vivido',eyebrow:'Memória',body:`${visits.map(v=>`<p><strong>${new Date(v.occurredAt).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</strong> · ${esc(placeById(v.placeId)?.name||v.placeId)}</p>`).join('')}`},
      {title:'Arquivo de viagens',eyebrow:'Viagens demo',body:`<div class="ticket"><strong>Serra Negra · setembro 2026</strong><p>${visits.length} registros · ${planned.length} planejamentos ativos</p></div>`},
      {title:'Resumo',eyebrow:'Planejado ≠ registrado',body:`<h3>${planned.length} planejado(s)</h3><p>Itens que continuam no roteiro.</p><h3>${visits.length} registrado(s)</h3><p>Presenças explicitamente gravadas no Passaporte.</p><button data-action="share-passport">Compartilhar resumo demo</button>`}
    ];
  };
  function stampHtml(v){const p=placeById(v.placeId);return `<div class="stamp"><span>VISITA DEMO<br><strong>${esc(p?.name||v.placeId)}</strong><br>12 SET 2026</span></div>`}
  function renderPassport(){
    const pages=passportPages(); ui.passportPage=Math.max(0,Math.min(ui.passportPage,pages.length-1)); const a=pages[ui.passportPage],b=pages[ui.passportPage+1];
    app.innerHTML = `${pageTitle('Meu Passaporte','Memória digital da viagem','Planejamento e presença continuam visualmente separados nesta versão.')}<div class="book-wrap"><nav class="book-index" aria-label="Capítulos">${pages.map((p,i)=>`<button class="${ui.passportPage===i?'primary':''}" data-passport-page="${i}">${i+1}. ${esc(p.title)}</button>`).join('')}</nav><div><div class="book"><article class="book-page active"><p class="eyebrow">${esc(a.eyebrow)}</p><h2>${esc(a.title)}</h2>${a.body}<span class="page-number">${ui.passportPage+1}</span></article>${b?`<article class="book-page"><p class="eyebrow">${esc(b.eyebrow)}</p><h2>${esc(b.title)}</h2>${b.body}<span class="page-number">${ui.passportPage+2}</span></article>`:''}</div><div class="trip-toolbar"><button data-action="passport-prev" ${ui.passportPage===0?'disabled':''}>Página anterior</button><button data-action="passport-next" ${ui.passportPage>=pages.length-1?'disabled':''}>Próxima página</button></div><section class="panel"><h3>Registrar presença fictícia</h3><p class="muted">Este controle existe apenas para validar a diferença entre planejamento e presença registrada.</p><div class="actions"><select id="passport-place"><option value="">Escolha um lugar</option>${publicPlaces().filter(p=>!visitFor(p.id)).map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('')}</select><button data-action="passport-register">Registrar visita demo</button></div></section></div></div>`;
  }

  const adminKinds = {places:'Lugares',partners:'Parceiros',experiences:'Experiências',events:'Eventos',categories:'Categorias',sources:'Fontes'};
  function adminLabel(kind,item){if(kind==='places'||kind==='experiences'||kind==='events'||kind==='categories')return item.name; if(kind==='sources')return item.sourceName; if(kind==='partners')return placeById(item.placeId)?.name||item.id; return item.id}
  function renderAdmin(){
    const kind=ui.adminKind, list=mergedCollection(kind); if(ui.adminEdit&&!list.find(x=>x.id===ui.adminEdit))ui.adminEdit=null;
    app.innerHTML = `${pageTitle('Admin de demonstração','Controle operacional local','Edite, salve rascunho, visualize e publique no navegador. Nada é enviado a um servidor.')}<div class="admin-layout"><nav class="admin-nav" aria-label="Tipos de conteúdo">${Object.entries(adminKinds).map(([k,l])=>`<button class="${k===kind?'active':''}" data-admin-kind="${k}">${l}<span class="badge">${mergedCollection(k).length}</span></button>`).join('')}</nav><section>${ui.adminEdit?renderAdminEditor(kind,list.find(x=>x.id===ui.adminEdit)):renderAdminList(kind,list)}</section></div>`;
  }
  function renderAdminList(kind,list){
    return `<div class="panel"><div class="section-head"><div><p class="eyebrow">${esc(adminKinds[kind])}</p><h2>Conteúdo</h2></div>${kind==='places'?'<button data-action="admin-create">Criar lugar demo</button>':''}</div><div class="admin-list">${list.map(item=>`<div class="admin-row"><div><strong>${esc(adminLabel(kind,item))}</strong><div class="actions"><span class="badge">${esc(item.status||'ativo')}</span>${state.drafts[kind]?.[item.id]?'<span class="badge warn">rascunho salvo</span>':''}</div></div><button data-admin-edit="${item.id}">Editar</button></div>`).join('')}</div></div><section class="section"><h2>Histórico desta sessão</h2><div class="audit">${state.audit.slice(0,8).map(a=>`<div class="audit-item"><strong>${esc(a.action)}</strong><div>${esc(a.label)}</div><span class="muted">${new Date(a.at).toLocaleString('pt-BR')}</span></div>`).join('')}</div></section>`;
  }
  function renderAdminEditor(kind,item){
    if(!item)return ''; const draft=state.drafts[kind]?.[item.id]||{}; const current={...item,...draft}; const label=adminLabel(kind,current); const editableNameKey=kind==='sources'?'sourceName':'name'; const hasName=current[editableNameKey]!==undefined; const hasStatus=current.status!==undefined;
    return `<button data-action="admin-back">← Voltar à lista</button><div class="admin-editor" style="margin-top:1rem"><form class="panel" id="admin-form" data-kind="${kind}" data-id="${item.id}"><p class="eyebrow">Editor local</p><h2>${esc(label)}</h2>${hasName?`<label class="field">Nome<input name="${editableNameKey}" value="${esc(current[editableNameKey])}"></label>`:''}${kind==='places'?`<label class="field">Slug<input name="slug" value="${esc(current.slug||'')}"></label><label class="field">Descrição curta<textarea name="shortDescription">${esc(current.shortDescription||'')}</textarea></label><label class="field">Horário<input name="openingHours" value="${esc(current.openingHours?.text||'')}"></label>`:''}${hasStatus?`<label class="field">Status<select name="status"><option value="published" ${current.status==='published'?'selected':''}>published</option><option value="draft" ${current.status==='draft'?'selected':''}>draft</option><option value="archived" ${current.status==='archived'?'selected':''}>archived</option><option value="active" ${current.status==='active'?'selected':''}>active</option></select></label>`:''}<div class="actions"><button type="button" data-action="admin-save-draft">Salvar rascunho</button><button type="button" data-action="admin-preview">Preview</button><button type="button" class="primary" data-action="admin-publish">Publicar localmente</button>${hasStatus?'<button type="button" class="danger" data-action="admin-archive">Arquivar</button>':''}</div></form><aside class="sidebar"><div class="panel"><h3>Somente leitura</h3><p><strong>ID:</strong> ${esc(item.id)}</p><p><strong>Fonte:</strong> seed sintético + alterações locais</p></div><div class="panel"><h3>Preview</h3>${ui.adminPreview===item.id?adminPreviewCard(kind,current):'<p class="muted">Clique em Preview para conferir o rascunho antes de publicar.</p>'}</div><div class="panel"><h3>Regra da demo</h3><p class="muted">Rascunho não altera a página pública. Publicar grava a alteração em localStorage e ela passa a aparecer na navegação.</p></div></aside></div>`;
  }
  function adminPreviewCard(kind,item){
    if(kind==='places')return `<strong>${esc(item.name)}</strong><p>${esc(item.shortDescription||'')}</p><span class="badge">${esc(item.status||'')}</span>`;
    return `<strong>${esc(adminLabel(kind,item))}</strong><p class="muted">Preview simplificado desta entidade.</p>`;
  }
  function adminFormData(){
    const f=$('#admin-form'); if(!f)return null; const fd=new FormData(f), out={}; for(const [k,v] of fd)out[k]=v; if(out.openingHours!==undefined){out.openingHours={type:'demo',text:out.openingHours};delete out.openingHoursText;} return {kind:f.dataset.kind,id:f.dataset.id,out};
  }
  function adminSaveDraft(preview=false){const x=adminFormData();if(!x)return;state.drafts[x.kind][x.id]={...x.out};state.audit.unshift({at:new Date().toISOString(),action:'draft_saved',label:adminLabel(x.kind,{...mergedCollection(x.kind).find(i=>i.id===x.id),...x.out})});save();ui.adminPreview=preview?x.id:ui.adminPreview;toast(preview?'Rascunho salvo e aberto em preview.':'Rascunho salvo. A página pública não mudou.');renderAdmin()}
  function adminPublish(){const x=adminFormData();if(!x)return;state.adminOverrides[x.kind][x.id]={...(state.adminOverrides[x.kind][x.id]||{}),...x.out};delete state.drafts[x.kind][x.id];state.audit.unshift({at:new Date().toISOString(),action:'published',label:adminLabel(x.kind,{...mergedCollection(x.kind).find(i=>i.id===x.id),...x.out})});save();toast('Alteração publicada localmente. A página pública já usa esta versão.');renderAdmin()}
  function adminArchive(){const x=adminFormData();if(!x)return;state.adminOverrides[x.kind][x.id]={...(state.adminOverrides[x.kind][x.id]||{}),status:'archived'};delete state.drafts[x.kind][x.id];state.audit.unshift({at:new Date().toISOString(),action:'archived',label:adminLabel(x.kind,mergedCollection(x.kind).find(i=>i.id===x.id))});save();ui.adminEdit=null;toast('Item arquivado na demonstração.');renderAdmin()}
  function adminCreatePlace(){const id=`place-local-${Date.now()}`;state.adminCreated.places.push({id,slug:`novo-lugar-${Date.now()}`,name:'Novo lugar demo',placeType:'tourist_point',commercialRelation:'public_point',categoryIds:['cat-cultura'],shortDescription:'Novo conteúdo criado localmente no Admin de demonstração.',environment:'indoor',costType:'free',durationMinutes:60,openingHours:{type:'demo',text:'09:00–17:00'},location:{lat:-22.61,lng:-46.70,display:'Área de demonstração, Serra Negra, SP'},status:'draft',sourceIds:['source-synthetic']});save();ui.adminEdit=id;renderAdmin();toast('Novo lugar demo criado como rascunho.')}

  function renderNotFound(){app.innerHTML=`${pageTitle('Página não encontrada','Demonstração','A rota solicitada não existe nesta versão.')}<a class="button primary" href="#/">Voltar ao início</a>`}

  function render(){
    window.scrollTo(0,0); const hash=(location.hash||'#/').slice(1).split('?')[0]; const parts=hash.split('/').filter(Boolean);
    document.title='Passaporte Serra Negra · Demo Visual v2';
    document.body.dataset.page=parts[0]||'home';
    if(parts.length===0)renderHome();
    else if(parts[0]==='explorar')renderExplore();
    else if(parts[0]==='lugares'&&parts[1])renderPlace(parts[1],false);
    else if(parts[0]==='parceiros'&&parts[1])renderPlace(parts[1],true);
    else if(parts[0]==='roteiro'&&parts.length===1)renderOnboarding();
    else if(parts[0]==='viagens'&&parts[2]==='roteiro')renderRoute();
    else if(parts[0]==='viagens'&&parts[2]==='calendario')renderCalendar();
    else if(parts[0]==='meu-passaporte')renderPassport();
    else if(parts[0]==='admin')renderAdmin();
    else if(parts[0]==='para-parceiros')renderPartnerAcquisition();
    else renderNotFound();
    app.focus({preventScroll:true});
  }

  document.addEventListener('click',e=>{
    const t=e.target.closest('button,[data-action],[data-filter-category],[data-day],[data-day-calendar],[data-calendar-mode],[data-passport-page],[data-admin-kind],[data-admin-edit],[data-route-action],[data-onboard-key],[data-home-spot],[data-home-partner],[data-route-type],[data-home-faq]'); if(!t)return;
    if(t.dataset.homeSpot!==undefined){ui.homeSpotIndex=Number(t.dataset.homeSpot);renderHome();return}
    if(t.dataset.homePartner!==undefined){ui.homePartnerIndex=Number(t.dataset.homePartner);renderHome();return}
    if(t.dataset.routeType){ui.homeRouteType=t.dataset.routeType;if(t.dataset.action==='route-type-to-onboarding'){location.hash='#/roteiro';return}renderHome();return}
    if(t.dataset.homeFaq!==undefined){const i=Number(t.dataset.homeFaq);ui.homeFaqOpen=ui.homeFaqOpen===i?-1:i;renderHome();return}
    if(t.matches('[data-filter-category]')){ui.explore.category=t.dataset.filterCategory;$$('[data-filter-category]').forEach(b=>b.classList.toggle('active',b===t));renderExploreResults();return}
    if(t.dataset.day){ui.activeDay=t.dataset.day;renderRoute();return}
    if(t.dataset.dayCalendar){ui.activeDay=t.dataset.dayCalendar;renderCalendar();return}
    if(t.dataset.calendarMode){ui.calendarMode=t.dataset.calendarMode;renderCalendar();return}
    if(t.dataset.passportPage!==undefined){ui.passportPage=Number(t.dataset.passportPage);renderPassport();return}
    if(t.dataset.adminKind){ui.adminKind=t.dataset.adminKind;ui.adminEdit=null;ui.adminPreview=null;renderAdmin();return}
    if(t.dataset.adminEdit){ui.adminEdit=t.dataset.adminEdit;ui.adminPreview=null;renderAdmin();return}
    if(t.dataset.routeAction){routeAction(t.dataset.routeAction,t.dataset.date,t.dataset.item);return}
    if(t.dataset.onboardKey){const k=t.dataset.onboardKey,v=t.dataset.onboardValue;if(t.dataset.onboardMulti==='1'){const arr=ui.onboarding.answers[k]||[];ui.onboarding.answers[k]=arr.includes(v)?arr.filter(x=>x!==v):[...arr,v]}else ui.onboarding.answers[k]=v;renderOnboarding();return}
    const a=t.dataset.action; if(!a)return;
    if(a==='toggle-menu'){const nav=$('#main-nav');const open=nav.classList.toggle('open');t.setAttribute('aria-expanded',String(open));document.body.classList.toggle('menu-open',open);return}
    if(a==='home-search-suggestion'){const q=t.dataset.query||'';location.hash=`#/explorar?q=${encodeURIComponent(q)}`;return}
    if(a==='partner-prev'){const n=publicPlaces().filter(p=>p.commercialRelation==='partner').slice(0,6).length;ui.homePartnerIndex=(ui.homePartnerIndex-1+n)%n;renderHome();return}
    if(a==='partner-next'){const n=publicPlaces().filter(p=>p.commercialRelation==='partner').slice(0,6).length;ui.homePartnerIndex=(ui.homePartnerIndex+1)%n;renderHome();return}
    if(a==='clear-filters'){ui.explore={q:'',category:'',relation:'',environment:'',cost:''};renderExplore();return}
    if(a==='demo-contact'){toast('Contato fictício: nenhuma ação externa foi aberta.');return}
    if(a==='add-trip'){addToTrip(t.dataset.place);return}
    if(a==='register-visit'){registerVisit(t.dataset.place);return}
    if(a==='onboard-prev'){ui.onboarding.step=Math.max(0,ui.onboarding.step-1);renderOnboarding();return}
    if(a==='onboard-next'){const s=onboardingSteps[ui.onboarding.step];const ans=ui.onboarding.answers[s.key];if(!ans||(Array.isArray(ans)&&!ans.length)){toast('Escolha pelo menos uma opção.');return;}ui.onboarding.step=Math.min(onboardingSteps.length-1,ui.onboarding.step+1);renderOnboarding();return}
    if(a==='generate-trip'){generateTrip();return}
    if(a==='route-add-selected'){addSelectedToDay();return}
    if(a==='passport-prev'){ui.passportPage=Math.max(0,ui.passportPage-1);renderPassport();return}
    if(a==='passport-next'){ui.passportPage=Math.min(passportPages().length-1,ui.passportPage+1);renderPassport();return}
    if(a==='passport-register'){const pid=$('#passport-place')?.value;if(pid)registerVisit(pid);else toast('Escolha um lugar.');return}
    if(a==='share-passport'){const txt=`Passaporte Serra Negra Demo: ${state.trip.visits.length} visitas registradas.`;navigator.clipboard?.writeText(txt).then(()=>toast('Resumo demo copiado.')).catch(()=>toast(txt));return}
    if(a==='admin-back'){ui.adminEdit=null;ui.adminPreview=null;renderAdmin();return}
    if(a==='admin-create'){adminCreatePlace();return}
    if(a==='admin-save-draft'){adminSaveDraft(false);return}
    if(a==='admin-preview'){adminSaveDraft(true);return}
    if(a==='admin-publish'){adminPublish();return}
    if(a==='admin-archive'){adminArchive();return}
    if(a==='reset-demo'){if(confirm('Restaurar todos os dados locais da demonstração?')){state=defaultState();save();ui.activeDay=state.trip.days[0].date;ui.passportPage=0;toast('Demonstração restaurada.');render()}return}
  });


  document.addEventListener('submit',e=>{
    if(e.target?.id==='home-search-form'){
      e.preventDefault();
      const q=$('#home-search')?.value?.trim()||'';
      location.hash=`#/explorar${q?`?q=${encodeURIComponent(q)}`:''}`;
    }
  });

  window.addEventListener('hashchange',()=>{const nav=$('#main-nav');nav?.classList.remove('open');document.body.classList.remove('menu-open');$('.mobile-menu')?.setAttribute('aria-expanded','false');render()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){const nav=$('#main-nav');if(nav?.classList.contains('open')){nav.classList.remove('open');document.body.classList.remove('menu-open');$('.mobile-menu')?.setAttribute('aria-expanded','false');$('.mobile-menu')?.focus();}}});
  const themeSelect=$('#theme-select');
  const themeMeta=document.querySelector('meta[name="theme-color"]');
  const syncThemeMeta=(theme)=>{if(!themeMeta)return;const dark=theme==='dark'||(theme==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);themeMeta.setAttribute('content',dark?'#161618':'#E8E8E0')};
  const savedTheme=localStorage.getItem(THEME_STORE)||'system'; document.documentElement.dataset.theme=savedTheme; themeSelect.value=savedTheme; syncThemeMeta(savedTheme);
  themeSelect.addEventListener('change',()=>{document.documentElement.dataset.theme=themeSelect.value;localStorage.setItem(THEME_STORE,themeSelect.value);syncThemeMeta(themeSelect.value)});
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',()=>{if(themeSelect.value==='system')syncThemeMeta('system')});

  render();
})();
