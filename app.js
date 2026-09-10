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
  const costLabel = v => ({free:'Sem custo',paid:'Pago',mixed:'Misto',paid_with_booking:'Pago · reserva',not_informed:'Confirmar'}[v] || v);
  const environmentLabel = v => ({indoor:'Ambiente interno',outdoor:'Ao ar livre',mixed:'Misto'}[v] || v);
  const relationLabel = v => v === 'partner' ? 'Parceiro demo' : 'Ponto turístico demo';
  const responseLabel = v => ({within_1_hour:'Em até 1 hora (demo)',same_day:'No mesmo dia (demo)',within_few_hours:'Em algumas horas (demo)'}[v] || 'Tempo não informado');
  const weatherLabel = v => ({partly_cloudy:'Parcialmente nublado',rain:'Chuva',clear:'Céu aberto'}[v] || v);
  const weatherIcon = v => ({partly_cloudy:'clima-parcialmente-nublado',rain:'clima-chuva',clear:'sol'}[v] || 'clima-nublado');
  const PAGE_META = {
    home:['Passaporte Serra Negra','Explore possibilidades e monte um roteiro demonstrativo por Serra Negra.'],
    explorar:['Explorar · Passaporte Serra Negra','Busque lugares, experiências e categorias na demonstração do Passaporte Serra Negra.'],
    roteiro:['Montar roteiro · Passaporte Serra Negra','Responda às etapas e gere um roteiro demonstrativo editável.'],
    viagens:['Minha viagem · Passaporte Serra Negra','Consulte roteiro e calendário usando o mesmo estado demonstrativo da viagem.'],
    'meu-passaporte':['Meu Passaporte · Passaporte Serra Negra','Veja registros demonstrativos separados dos itens apenas planejados.'],
    admin:['Admin demo · Passaporte Serra Negra','Controle operacional local da demonstração. Não representa autorização de produção.'],
    parceiros:['Para parceiros · Passaporte Serra Negra','Entenda como negócios locais podem entrar de forma contextual na jornada de quem visita Serra Negra.'],
    'para-parceiros':['Para parceiros · Passaporte Serra Negra','Entenda como negócios locais podem entrar de forma contextual na jornada de quem visita Serra Negra.'],
    privacidade:['Privacidade · Passaporte Serra Negra','Como esta demonstração local trata estado, preferências e dados no navegador.'],
    termos:['Termos de uso · Passaporte Serra Negra','Condições aplicáveis à demonstração funcional do Passaporte Serra Negra.'],
    cookies:['Cookies e armazenamento · Passaporte Serra Negra','Tecnologias de armazenamento utilizadas nesta demonstração funcional.'],
    acessibilidade:['Acessibilidade · Passaporte Serra Negra','Recursos e critérios de acessibilidade considerados nesta demonstração.']
  };
  function setPageMeta(key,titleOverride='',descriptionOverride=''){
    const fallback=PAGE_META[key]||['Página · Passaporte Serra Negra','Demonstração funcional do Passaporte Serra Negra.'];
    document.title=titleOverride||fallback[0];
    const meta=document.querySelector('meta[name="description"]'); if(meta) meta.setAttribute('content',descriptionOverride||fallback[1]);
    const ogTitle=document.querySelector('meta[property="og:title"]'); if(ogTitle) ogTitle.setAttribute('content',document.title);
    const ogDescription=document.querySelector('meta[property="og:description"]'); if(ogDescription) ogDescription.setAttribute('content',descriptionOverride||fallback[1]);
  }
  function breadcrumbs(items){
    return `<nav class="breadcrumbs" aria-label="Breadcrumb">${items.map((item,i)=>`${i?'<span aria-hidden="true">›</span>':''}${item.href?`<a href="${item.href}">${esc(item.label)}</a>`:`<span class="current" aria-current="page">${esc(item.label)}</span>`}`).join('')}</nav>`;
  }
  function updateNavCurrent(page){
    $$('#main-nav a').forEach(a=>a.removeAttribute('aria-current'));
    const map={explorar:'#/explorar',roteiro:'#/viagens/demo-trip-001/roteiro',parceiros:'#/parceiros','para-parceiros':'#/parceiros'};
    const href=map[page]; if(href){const link=$(`#main-nav a[href="${href}"]`); link?.setAttribute('aria-current','page');}
  }

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
    homeFaqOpen:0,
    partnerLandingTab:0
  };

  function mergedCollection(kind){
    const base = clone(DATA.content[kind] || []);
    const created = clone(state.adminCreated[kind] || []);
    const overrides = state.adminOverrides[kind] || {};
    return [...base,...created].map(item => ({...item,...(overrides[item.id]||{})}));
  }
  const allPlaces = () => mergedCollection('places');
  const publicPlaces = () => allPlaces().filter(p => p.status !== 'archived');
  const discoverablePlaces = () => publicPlaces().filter(p => p.discoveryVisible !== false);
  const researchedTouristPlaces = () => discoverablePlaces().filter(p => p.commercialRelation==='public_point' && p.research?.verified);
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
    const relation=place?.commercialRelation==='partner'?'Parceiro demo':(place?.research?.verified?'Ponto turístico':'Ponto demo');
    const title=place?.name||'Serra Negra';
    const asset=place?.imageAsset;
    const stockStyle=asset?.src ? ` style="--stock-position:${esc(asset.position||'center')}"` : '';
    const source=asset?.provider ? `${asset.provider} · ${asset.notActualPlace?'foto ilustrativa':'foto temporária'}` : 'mídia ilustrativa';
    const label=asset?.alt || `Mídia visual demonstrativa de ${title}`;
    const fallback=asset?.fallbackSrc || 'assets/placeholders/card.svg';
    const photo=asset?.src ? `<img class="scenic-photo" src="${esc(asset.src)}" alt="" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='${esc(fallback)}'">` : '';
    return `<div class="scenic-media scenic-${variant} media-${cls}${asset?.src?' has-stock-photo':''}" role="img" aria-label="${esc(label)}"${stockStyle}>
      ${photo}<span class="scenic-ridge ridge-a"></span><span class="scenic-ridge ridge-b"></span><span class="scenic-sun"></span>
      <span class="scenic-grain"></span><span class="scenic-caption">${esc(relation)} · ${esc(source)}</span>
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
    return `<section class="home-section home-hero" data-psd-layer="01" aria-labelledby="home-title">
      <div class="home-hero-art" aria-hidden="true">
        <span class="home-hero-sky"></span><span class="home-hero-sun"></span>
        <span class="home-hero-ridge ridge-back"></span><span class="home-hero-ridge ridge-mid"></span><span class="home-hero-ridge ridge-front"></span>
        <svg class="home-hero-route" viewBox="0 0 1000 420" preserveAspectRatio="none"><path d="M45 330 C210 205 315 290 455 188 S720 72 952 140"/><circle cx="455" cy="188" r="7"/></svg>
      </div>
      <div class="psd-container home-hero-content">
        <p class="psd-kicker">Passaporte Serra Negra · validação visual v2</p>
        <h1 id="home-title">Serra Negra,<br><em>no seu ritmo.</em></h1>
        <p class="home-hero-lead">Descubra possibilidades, monte uma viagem flexível e transforme os lugares vividos em memória.</p>
        <form class="home-search" id="home-search-form" role="search">
          <label for="home-search">O que você quer encontrar?</label>
          <div class="home-search-row">${icon('busca')}<input id="home-search" name="q" type="search" autocomplete="off" placeholder="Lugar, experiência, café, natureza…"><button class="primary" type="submit">Explorar</button></div>
        </form>
        <div class="home-quick-search" aria-label="Sugestões rápidas">${['Natureza','Cafés','Cultura','Sem custo'].map(x=>`<button data-action="home-search-suggestion" data-query="${esc(x)}">${esc(x)}</button>`).join('')}</div>
        <p class="home-scroll-note"><span aria-hidden="true"></span>Role para descobrir a cidade por caminhos, não por rankings.</p>
      </div>
    </section>`;
  }
  function homeTouristSpotsSection(){
    const spots=researchedTouristPlaces();
    const idx=Math.min(ui.homeSpotIndex,Math.max(0,spots.length-1)); const active=spots[idx]||spots[0];
    if(!active)return '';
    return `<section class="home-section home-spots" data-psd-layer="02" aria-labelledby="spots-title">
      <div class="spots-backdrop">${scenicMedia(active,'spots-backdrop')}</div>
      <div class="psd-container spots-layout">
        <div class="spots-copy">
          <p class="psd-kicker">Primeiros caminhos</p><h2 id="spots-title">Conheça Serra Negra</h2>
          <p>Uma leitura editorial dos pontos de demonstração. Selecione um cartão para mudar o destaque.</p>
          <div class="spots-active-meta"><span>${esc((active.categoryIds||[]).map(categoryName).join(' · '))}</span><span>${esc(active.durationMinutes)} min</span><span>${active.cost==='free'?'sem custo':esc(costLabel(active.cost))}</span></div>
          <h3>${esc(active.name)}</h3><p>${esc(active.shortDescription)}</p>
          <a class="button light-button" href="#/lugares/${active.slug}">Conhecer este lugar</a>
        </div>
        <div class="spots-rail" role="list" aria-label="Pontos turísticos">${spots.map((p,i)=>`<button role="listitem" class="spot-reference-card ${i===idx?'active':''}" data-home-spot="${i}" aria-pressed="${i===idx}">${scenicMedia(p,'spot-card')}<span><small>0${i+1} · ${esc((p.categoryIds||[]).map(categoryName).join(' · '))}</small><strong>${esc(p.name)}</strong><em>${esc(p.durationMinutes)} min</em></span></button>`).join('')}</div>
      </div>
    </section>`;
  }
  function homePartnerLoopSection(){
    const partners=publicPlaces().filter(p=>p.commercialRelation==='partner').slice(0,6); if(!partners.length)return '';
    const idx=ui.homePartnerIndex%partners.length;
    const ordered=[-2,-1,0,1,2].map(offset=>{const originalIndex=(idx+offset+partners.length)%partners.length;return {p:partners[originalIndex],originalIndex,offset}});
    return `<section class="home-section home-partners" data-psd-layer="03" aria-labelledby="partners-title"><div class="psd-container">
      <div class="partners-heading"><p class="psd-kicker">Encontros pelo caminho</p><h2 id="partners-title">Parceiros que entram na viagem</h2><p>Nenhuma posição indica ranking. O destaque muda para validar o comportamento do índice.</p></div>
      <div class="partners-carousel"><button class="carousel-arrow" data-action="partner-prev" aria-label="Parceiro anterior">${icon('chevron-esquerda')}</button><div class="partners-track">${ordered.map(({p,originalIndex,offset})=>`<article class="partner-reference-card depth-${Math.abs(offset)} ${offset===0?'is-center':''}">${scenicMedia(p,'partner-card')}<div class="partner-card-overlay"><small>${esc((p.categoryIds||[]).map(categoryName).join(' · '))}</small><h3>${esc(p.name)}</h3>${offset===0?`<a class="button light-button" href="#/parceiros/${p.slug}">Abrir página</a>`:`<button data-home-partner="${originalIndex}">Centralizar</button>`}</div></article>`).join('')}</div><button class="carousel-arrow" data-action="partner-next" aria-label="Próximo parceiro">${icon('chevron-direita')}</button></div>
    </div></section>`;
  }
  function homeRouteVisualSection(){
    const day=state.trip.days[0]; const items=day.items.filter(i=>i.state!=='removed').slice(0,3);
    return `<section class="home-section home-route-visual" data-psd-layer="04" aria-labelledby="route-visual-title"><div class="route-visual-art" aria-hidden="true"><span class="route-desert-horizon"></span></div><div class="psd-container route-visual-layout"><div class="route-visual-copy"><p class="psd-kicker">A linha conecta a experiência</p><h2 id="route-visual-title">Um roteiro é uma sequência que pode mudar.</h2><p>A viagem demonstrativa compartilha os mesmos dados com calendário e Passaporte. Alterar uma parada não reconstrói silenciosamente o restante.</p><a class="button primary" href="#/viagens/demo-trip-001/roteiro">Abrir roteiro pronto</a></div><div class="route-visual-map" aria-label="Sequência demonstrativa do primeiro dia"><svg viewBox="0 0 760 420" aria-hidden="true"><path d="M70 328 C168 260 180 106 310 138 S432 328 560 220 S618 72 700 84"/></svg>${items.map((i,n)=>{const p=placeById(i.placeId);const pos=[[8,76],[39,24],[76,55]][n];return `<a href="${p?.commercialRelation==='partner'?'#/parceiros/':'#/lugares/'}${p?.slug||''}" class="route-visual-stop" style="left:${pos[0]}%;top:${pos[1]}%"><span>0${n+1}</span><small>${esc(i.startsAt)}</small><strong>${esc(p?.name||i.placeId)}</strong></a>`}).join('')}</div></div></section>`;
  }
  function homeRouteTypesSection(){
    const selected=HOME_ROUTE_TYPES.find(x=>x.id===ui.homeRouteType)||HOME_ROUTE_TYPES[0];
    const places=selected.placeIds.map(placeById).filter(Boolean); const activeIndex=HOME_ROUTE_TYPES.indexOf(selected);
    return `<section class="home-section home-route-types" data-psd-layer="05" aria-labelledby="route-types-title"><div class="psd-container"><div class="route-types-tabs" role="tablist" aria-label="Tipos de roteiro">${HOME_ROUTE_TYPES.map((x,i)=>`<button role="tab" aria-selected="${x.id===selected.id}" tabindex="${x.id===selected.id?'0':'-1'}" data-route-type="${x.id}" class="${x.id===selected.id?'active':''}"><span>0${i+1}</span>${esc(x.label)}</button>`).join('')}</div><div class="route-types-editorial"><div class="route-types-intro"><p class="psd-kicker">Tipos de roteiro</p><h2 id="route-types-title">${esc(selected.title)}</h2><p>${esc(selected.body)}</p></div><div class="route-types-poster">${scenicMedia(places[0]||{},'route-types-poster')}<span class="route-types-number">0${activeIndex+1}</span><svg viewBox="0 0 360 520" aria-hidden="true"><path d="M42 430 C102 360 94 250 188 238 S256 128 316 74"/></svg></div><aside class="route-types-summary"><span class="route-summary-label">${esc(selected.label)}</span><p>Uma forma de começar sem transformar a viagem em uma sequência rígida.</p><dl><div><dt>Paradas</dt><dd>3</dd></div><div><dt>Duração</dt><dd>1 dia</dd></div><div><dt>Estado</dt><dd>editável</dd></div></dl><a class="button primary" href="#/roteiro">Montar o meu</a></aside></div></div></section>`;
  }
  function homeRouteCardsSection(){
    const cards=HOME_ROUTE_TYPES.slice(0,3);
    return `<section class="home-section home-route-cards" data-psd-layer="06" aria-labelledby="route-cards-title"><div class="psd-container"><header class="route-cards-heading"><div><p class="psd-kicker">Escolha um ponto de partida</p><h2 id="route-cards-title">Roteiros para diferentes intenções</h2></div><a class="text-link" href="#/roteiro">Criar do zero ${icon('avancar')}</a></header><div class="route-cards-grid">${cards.map((r,i)=>{const p=placeById(r.placeIds[0]);return `<article class="route-reference-card"><div class="route-card-media">${scenicMedia(p,'route-card')}</div><div class="route-card-body"><span class="route-card-number">0${i+1}</span><small>${esc(r.label)}</small><h3>${esc(r.title)}</h3><div class="route-card-meta"><span>1 dia</span><span>3 lugares</span></div><button data-route-type="${r.id}" data-action="route-type-to-onboarding">Usar como inspiração</button></div></article>`}).join('')}</div></div></section>`;
  }
  function homeEditorialSection(){
    const event=mergedCollection('events').find(e=>e.status!=='archived'); const weather=state.trip.weather.slice(0,3);
    return `<section class="home-section home-editorial" data-psd-layer="07" aria-labelledby="editorial-title"><div class="psd-container"><div class="editorial-top"><div><p class="psd-kicker">Descoberta contextual</p><h2 id="editorial-title">O mesmo destino pode pedir um dia diferente.</h2></div><p>Clima, tempo disponível e intenção podem reorganizar a leitura da cidade. Nesta versão, o contexto é inteiramente simulado.</p></div><div class="editorial-modules"><article class="editorial-route-tile"><span>Seu caminho muda com o contexto</span><svg viewBox="0 0 260 180" aria-hidden="true"><path d="M18 145 C62 92 84 126 116 76 S190 52 238 24"/><circle cx="116" cy="76" r="7"/><circle cx="238" cy="24" r="7"/></svg></article><article class="editorial-photo-tile">${scenicMedia(placeById('place-jardim-nascentes')||{},'editorial-photo')}</article><article class="editorial-event-tile"><small>${event?fmtDate(event.startsAt.slice(0,10)):'Contexto demo'}</small><strong>${esc(event?.name||'Feira Criativa da Serra — DEMO')}</strong><p>Uma possibilidade contextual, não um ranking.</p></article><article class="editorial-weather-tile"><small>Clima simulado</small>${weather.map(w=>`<div><strong>${w.temperatureC}°</strong><span>${fmtDate(w.date)} · ${w.rainProbability}% chuva</span></div>`).join('')}</article><article class="editorial-photo-tile alt">${scenicMedia(placeById('place-centro-cultural')||{},'editorial-photo')}</article></div><a class="button primary editorial-cta" href="#/explorar">Ver possibilidades</a></div></section>`;
  }
  function homeCategoriesSection(){
    const cats=mergedCollection('categories').filter(c=>c.enabled!==false);
    const mediaMap={'cat-natureza':'place-jardim-nascentes','cat-gastronomia':'place-bistro-estacao','cat-cafes':'place-cafe-neblina','cat-cultura':'place-centro-cultural','cat-compras':'place-atelie-pedra-folha','cat-bem-estar':'place-aguas-claras'};
    return `<section class="home-section home-categories" data-psd-layer="08" aria-labelledby="categories-title"><div class="psd-container"><div class="categories-heading"><div><p class="psd-kicker">Explore por interesse</p><h2 id="categories-title">O que combina com a sua viagem?</h2></div><p>As categorias filtram o conteúdo existente sem criar uma hierarquia de importância.</p></div><div class="categories-grid">${cats.map((c,i)=>{const p=placeById(mediaMap[c.id])||discoverablePlaces()[0];return `<a href="#/explorar?category=${encodeURIComponent(c.id)}" class="category-reference-tile niche-${i+1}"><div>${scenicMedia(p,'category-ref')}</div><span class="category-reference-icon">${icon(categoryIconById(c.id))}</span><strong>${esc(c.name)}</strong><small>Explorar interesse</small></a>`}).join('')}<a href="#/explorar" class="category-reference-tile category-reference-all"><span class="category-reference-icon">${icon('explorar')}</span><strong>Ver todos</strong><small>Busca e filtros</small></a></div></div></section>`;
  }
  function homeFaqSection(){
    const faqs=[
      ['Preciso criar conta?','Não nesta demonstração. O estado é salvo somente no navegador para permitir validar os fluxos.'],
      ['Como funcionam os roteiros?','Você responde ao onboarding, recebe um roteiro demonstrativo e pode mover, fixar, remover ou adicionar paradas sem reconstrução automática.'],
      ['Como funciona o Passaporte?','Planejamento e visita registrada são estados diferentes. O Passaporte reúne apenas os registros demonstrativos confirmados.'],
      ['Como funciona o QR?','O QR real ainda não está integrado nesta fase. O registro manual existe somente para validar a experiência e permanece identificado como demonstração.'],
      ['Posso alterar o roteiro?','Sim. As mudanças locais são persistidas no navegador e refletidas também no calendário.']
    ];
    const active=Math.max(0,Math.min(faqs.length-1,ui.homeFaqOpen<0?0:ui.homeFaqOpen));
    return `<section class="home-section home-faq" data-psd-layer="09" aria-labelledby="faq-title"><div class="psd-container faq-reference-layout"><div class="faq-reference-copy"><p class="psd-kicker">Perguntas frequentes</p><h2 id="faq-title">Entenda antes de começar.</h2><p>Esta interface é uma validação funcional. Recursos ainda não integrados são mostrados como tal, sem simular disponibilidade real.</p><div class="faq-reference-list">${faqs.map((f,i)=>`<div class="faq-reference-item ${ui.homeFaqOpen===i?'open':''}"><button data-home-faq="${i}" aria-expanded="${ui.homeFaqOpen===i}"><span>0${i+1}</span><strong>${esc(f[0])}</strong><em aria-hidden="true">${ui.homeFaqOpen===i?'−':'+'}</em></button>${ui.homeFaqOpen===i?`<div class="faq-reference-answer"><p>${esc(f[1])}</p></div>`:''}</div>`).join('')}</div></div><aside class="faq-reference-preview" aria-live="polite"><div class="faq-preview-art"><span class="faq-preview-horizon"></span><span class="faq-preview-marker">0${active+1}</span></div><small>Resposta em destaque</small><h3>${esc(faqs[active][0])}</h3><p>${esc(faqs[active][1])}</p></aside></div></section>`;
  }
  function homePassportIntroSection(){
    const steps=['Explorar','Montar','Visitar','Registrar','Construir o Passaporte'];
    return `<section class="home-section home-passport-intro" data-psd-layer="10" aria-labelledby="passport-intro-title"><div class="psd-container passport-reference-layout"><div class="passport-reference-mock"><div class="passport-wire" aria-hidden="true"><span></span><span></span><span></span><span></span></div><div class="passport-book"><div class="passport-book-cover"><img src="./assets/brand/logo-passaporte-serra-negra.svg" alt=""><small>PASSAPORTE</small><strong>SERRA<br>NEGRA</strong><span>memórias da viagem</span></div><div class="passport-book-page"><small>VISITA</small><strong>12 SET</strong><span>DEMO</span><em>${state.trip.visits.length} registros demonstrativos</em></div></div></div><div class="passport-reference-copy"><p class="psd-kicker">Da intenção à memória</p><h2 id="passport-intro-title">O roteiro organiza.<br>O Passaporte guarda.</h2><p>A experiência separa claramente o que você pretende fazer daquilo que registrou como vivido.</p><ol>${steps.map((x,i)=>`<li><span>0${i+1}</span><strong>${esc(x)}</strong></li>`).join('')}</ol><a class="button light-button" href="#/meu-passaporte">Abrir meu Passaporte</a></div></div></section>`;
  }
  function homeMapSection(){
    const ps=researchedTouristPlaces().slice(0,5); const positions=[[17,68],[32,31],[49,55],[67,24],[82,46]];
    return `<section class="home-section home-map" data-psd-layer="11" aria-labelledby="map-title"><div class="home-map-landscape" aria-hidden="true"><span></span><span></span></div><div class="psd-container map-reference-layout"><div class="map-reference-panel"><p class="psd-kicker">Visão territorial</p><div class="map-reference-list">${ps.slice(0,3).map((p,i)=>`<a data-map-place="${p.id}" href="${p.commercialRelation==='partner'?'#/parceiros/':'#/lugares/'}${p.slug}"><span>0${i+1}</span><div><small>${esc((p.categoryIds||[]).map(categoryName).join(' · '))}</small><strong>${esc(p.name)}</strong></div></a>`).join('')}</div><a class="button light-button" href="#/explorar">Abrir exploração completa</a></div><div class="map-reference-canvas" aria-label="Mapa demonstrativo sem geografia definitiva"><svg viewBox="0 0 1000 600" aria-hidden="true"><path d="M88 510 C190 430 202 260 348 308 S536 468 610 334 S726 150 900 92"/></svg>${ps.map((p,i)=>`<a data-map-place="${p.id}" class="territory-pin" style="left:${positions[i][0]}%;top:${positions[i][1]}%" href="${p.commercialRelation==='partner'?'#/parceiros/':'#/lugares/'}${p.slug}" aria-label="Abrir ${esc(p.name)}"><span>${i+1}</span></a>`).join('')}</div><div class="map-reference-title"><small>Mapa demonstrativo</small><h2 id="map-title">Explore também<br>pelo mapa</h2><p>O mapa desta validação é abstrato. Ele demonstra vínculo entre pins, cards e filtros sem afirmar geografia real.</p></div></div></section>`;
  }
  function homeFinalCtaSection(){
    return `<section class="home-section home-final-cta" data-psd-layer="12" aria-labelledby="final-title"><div class="psd-container final-reference-copy"><p class="psd-kicker">Seu próximo caminho</p><h2 id="final-title">Comece pela curiosidade.<br>O roteiro vem depois.</h2><div><a class="button primary" href="#/roteiro">Montar meu roteiro</a><a class="button ghost" href="#/explorar">Explorar primeiro</a></div></div></section>`;
  }
  const sectionRegistry={
    homeHero:homeHeroSection,touristSpots:homeTouristSpotsSection,partnerLoop:homePartnerLoopSection,routeVisual:homeRouteVisualSection,routeTypesShowcase:homeRouteTypesSection,routeTypeCards:homeRouteCardsSection,editorialDiscovery:homeEditorialSection,partnerCategories:homeCategoriesSection,homeFaq:homeFaqSection,passportIntro:homePassportIntroSection,mapExplore:homeMapSection,finalCta:homeFinalCtaSection
  };
  const HOME_SECTIONS=[
    {id:'hero',type:'homeHero',version:3,enabled:true,order:10},{id:'spots',type:'touristSpots',version:3,enabled:true,order:20},{id:'partners',type:'partnerLoop',version:3,enabled:true,order:30},{id:'route-visual',type:'routeVisual',version:3,enabled:true,order:40},{id:'route-types',type:'routeTypesShowcase',version:3,enabled:true,order:50},{id:'route-cards',type:'routeTypeCards',version:3,enabled:true,order:60},{id:'editorial',type:'editorialDiscovery',version:3,enabled:true,order:70},{id:'categories',type:'partnerCategories',version:3,enabled:true,order:80},{id:'faq',type:'homeFaq',version:3,enabled:true,order:90},{id:'passport',type:'passportIntro',version:3,enabled:true,order:100},{id:'map',type:'mapExplore',version:3,enabled:true,order:110},{id:'final',type:'finalCta',version:3,enabled:true,order:120}
  ];
  function renderHome(){
    app.innerHTML=`<div class="home-v3">${HOME_SECTIONS.filter(x=>x.enabled).sort((a,b)=>a.order-b.order).map(def=>sectionRegistry[def.type]?.(def)||'').join('')}</div>`;
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
    return discoverablePlaces().filter(p=>{
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

  function touristQuickInfo(p){
    const r=p.research||{};
    const duration=p.durationIsEstimate?`${p.durationMinutes} min · estimativa`:`${p.durationMinutes} min`;
    const rows=[
      ['lugar-horario','Horário',p.openingHours?.text||'Não informado'],
      ['lugar-duracao-sugerida','Tempo sugerido',duration],
      ['lugar-informacao','Ambiente',environmentLabel(p.environment)],
      ['lugar-sem-custo','Custo',p.priceNote||costLabel(p.costType)],
      ['link-externo','Pesquisa',r.officialSource?.label?'Fonte pública':'Conteúdo demo']
    ];
    return `<div class="partner-quick-info tourist-quick-info">${rows.map(x=>`<div>${icon(x[0])}<span><small>${esc(x[1])}</small><strong>${esc(x[2])}</strong></span></div>`).join('')}</div>`;
  }

  function renderResearchedTourist(p){
    const suggestions=researchedTouristPlaces().filter(x=>x.id!==p.id).slice(0,4);
    const r=p.research||{}; const src=r.officialSource||{}; const asset=p.imageAsset||{};
    const categories=(p.categoryIds||[]).map(categoryName).join(' · ');
    const duration=p.durationIsEstimate?`${p.durationMinutes} min · estimativa`:`${p.durationMinutes} min`;
    const price=p.priceNote||costLabel(p.costType);
    const notes=[...(r.practicalNotes||[]),...(p.requirements||[])];
    const visited=visitFor(p.id), planned=plannedItemFor(p.id);
    const photoStatus=asset.notActualPlace?'Imagem temporária relacionada ao tema':'Fotografia temporária do atrativo';
    const highlights=(r.highlights||[]).slice(0,4);

    app.innerHTML=`<div class="partner-page-v2 tourist-detail-v2">
      <section class="partner-hero-v2 tourism-partner-hero full-bleed">
        ${scenicMedia(p,'partner-hero')}
        <div class="partner-hero-overlay"></div>
        <div class="v2-container partner-hero-copy">
          ${breadcrumbs([{label:'Início',href:'#/'},{label:'Pontos turísticos',href:'#/explorar?relation=public_point'},{label:p.name}])}
          <p class="v2-kicker">${esc(categories||'Ponto turístico')} · Serra Negra</p>
          <h1>${esc(p.name)}</h1>
          <p>${esc(p.shortDescription)}</p>
          <div class="partner-hero-actions">
            <button class="light-button" data-action="add-trip" data-place="${p.id}">${planned?'Já está no roteiro':'Adicionar ao roteiro'}</button>
            <span class="partner-stamp tourist-stamp">PONTO<br><strong>TURÍSTICO</strong></span>
          </div>
        </div>
        <div class="tourism-photo-credit partner-style-credit">${esc(photoStatus)}${asset.sourcePage?` · <a href="${esc(asset.sourcePage)}" target="_blank" rel="noopener noreferrer">${esc(asset.provider||'Fonte')} · ${esc(asset.author||'crédito')}</a>`:''}</div>
      </section>

      <div class="v2-container partner-quick-wrap">${touristQuickInfo(p)}</div>

      <section class="v2-section">
        <div class="v2-container partner-about-grid">
          <div>
            <p class="v2-kicker">Sobre este lugar</p>
            <h2>Conheça esta parada de Serra Negra.</h2>
            <p class="v2-copy">${esc(p.longDescription||p.shortDescription)}</p>
            <div class="tourist-source-inline"><span>${icon('link-externo')}</span><div><small>Pesquisa pública</small><strong>${esc(src.label||'Fonte pública consultada')}</strong>${src.url?`<a href="${esc(src.url)}" target="_blank" rel="noopener noreferrer">Consultar fonte oficial</a>`:''}</div></div>
          </div>
          <div class="partner-about-media">${scenicMedia(p,'about')}<div class="partner-mini-media">${scenicMedia(p,'mini')}</div></div>
        </div>
      </section>

      <section class="v2-section partner-features full-bleed tourist-highlights-section">
        <div class="v2-container">
          <div class="v2-section-heading light">
            <div><p class="v2-kicker">O que vale observar</p><h2>Pontos para orientar a visita.</h2></div>
            <p>Informações sintetizadas a partir das fontes públicas registradas na página, sem transformar estimativas editoriais em dados oficiais.</p>
          </div>
          <div class="tourist-partner-highlights">
            ${highlights.length?highlights.map((h,i)=>`<article><span>0${i+1}</span><p>${esc(h)}</p></article>`).join(''):'<article><span>01</span><p>Consulte a descrição e a fonte oficial desta página antes da visita.</p></article>'}
          </div>
        </div>
      </section>

      <section class="v2-section">
        <div class="v2-container partner-details-grid">
          <div>
            <p class="v2-kicker">Antes de visitar</p>
            <h2>Informações práticas</h2>
            <div class="details-list">
              <div><span>Horário</span><strong>${esc(p.openingHours?.text||'Não informado')}</strong></div>
              <div><span>Localização</span><strong>${esc(p.location?.display||'Não informada')}</strong></div>
              <div><span>Ambiente</span><strong>${esc(environmentLabel(p.environment))}</strong></div>
              <div><span>Duração sugerida</span><strong>${esc(duration)}</strong></div>
              <div><span>Custo</span><strong>${esc(price)}</strong></div>
            </div>
            <div class="tourist-practical-notes">
              ${notes.length?notes.map(n=>`<div>${icon('lugar-informacao')}<p>${esc(n)}</p></div>`).join(''):`<div>${icon('lugar-informacao')}<p>Não foram identificadas observações adicionais na fonte consultada.</p></div>`}
            </div>
            ${src.url?`<a class="button" href="${esc(src.url)}" target="_blank" rel="noopener noreferrer">Abrir fonte oficial ${icon('link-externo')}</a>`:''}
          </div>
          <aside class="sticky-summary tourist-trip-summary">
            <p class="v2-kicker">Na sua viagem</p>
            <h3>${planned?'Este lugar já está no roteiro.':'Quer incluir esta parada?'}</h3>
            <p>${visited?'Há uma visita demonstrativa registrada para este ponto.':planned?'Planejado não significa visitado. O registro continua separado no Passaporte.':'Adicione o atrativo ao roteiro sem reorganizar automaticamente as outras paradas.'}</p>
            <button class="primary" data-action="add-trip" data-place="${p.id}">${planned?'Já adicionado':'Adicionar ao roteiro'}</button>
            <button data-action="register-visit" data-place="${p.id}">${visited?'Visita registrada':'Registrar visita demo'}</button>
          </aside>
        </div>
      </section>

      <section class="v2-section partner-location">
        <div class="v2-container">
          <div class="v2-section-heading">
            <div><p class="v2-kicker">Localização</p><h2>Onde esta parada entra no mapa</h2></div>
            <p>O endereço pesquisado é apresentado como texto. O mapa visual desta demo continua abstrato até a integração cartográfica definitiva.</p>
          </div>
          <div class="map-explore-grid">
            <div>${mockMap([p,...suggestions.slice(0,3)])}</div>
            <div class="location-copy">
              <span>${icon('lugar-localizacao')}</span>
              <h3>${esc(p.location?.display||'Localização não informada')}</h3>
              <p>Use as informações públicas desta página como referência e reconfirme horários, acesso e condições antes da visita.</p>
              ${src.url?`<a class="button" href="${esc(src.url)}" target="_blank" rel="noopener noreferrer">Ver informações oficiais ${icon('link-externo')}</a>`:''}
            </div>
          </div>
        </div>
      </section>

      <section class="v2-section">
        <div class="v2-container">
          <div class="v2-section-heading">
            <div><p class="v2-kicker">Continue explorando</p><h2>Outros pontos de Serra Negra</h2></div>
            <a class="text-link" href="#/explorar?relation=public_point">Ver todos ${icon('avancar')}</a>
          </div>
          <div class="grid">${suggestions.slice(0,3).map(x=>placeCard(x,'editorial')).join('')}</div>
        </div>
      </section>
    </div>`;
  }

  function renderPlace(slug,asPartner=false){
    const p=placeBySlug(slug); if(!p){return renderNotFound();}
    const isPartner=asPartner || p.commercialRelation==='partner';
    if(isPartner) return renderPartner(p);
    if(p.research?.verified) return renderResearchedTourist(p);
    const exps=experiencesFor(p.id), evs=eventsFor(p.id); const suggestions=publicPlaces().filter(x=>x.id!==p.id).slice(0,4);
    app.innerHTML = `${breadcrumbs([{label:'Início',href:'#/'},{label:'Explorar',href:'#/explorar'},{label:p.name}])}<section class="hero"><div><p class="eyebrow">Ponto turístico · demonstração</p><h1 class="compact">${esc(p.name)}</h1><p class="lead">${esc(p.shortDescription)}</p><div class="actions">${statusBadges(p)}<button class="primary" data-action="add-trip" data-place="${p.id}">${plannedItemFor(p.id)?'Já está no roteiro':'Adicionar ao roteiro'}</button><button data-action="register-visit" data-place="${p.id}">${visitFor(p.id)?'Visita registrada':'Registrar visita demo'}</button></div></div><div class="hero-visual"><div class="mark">PONTO<br><strong>DEMO</strong></div></div></section>
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
      <section class="partner-hero-v2 full-bleed">${scenicMedia(p,'partner-hero')}<div class="partner-hero-overlay"></div><div class="v2-container partner-hero-copy">${breadcrumbs([{label:'Início',href:'#/'},{label:'Explorar',href:'#/explorar'},{label:p.name}])}<p class="v2-kicker">${esc((p.categoryIds||[]).map(categoryName).join(' · '))} · parceiro demo</p><h1>${esc(p.name)}</h1><p>${esc(p.shortDescription)}</p><div class="partner-hero-actions"><button class="light-button" data-action="add-trip" data-place="${p.id}">${planned?'Já está no roteiro':'Adicionar ao roteiro'}</button><span class="partner-stamp">PARCEIRO<br><strong>DEMO</strong></span></div></div></section>
      <div class="v2-container partner-quick-wrap">${partnerQuickInfo(p,partner)}</div>
      <section class="v2-section"><div class="v2-container partner-about-grid"><div><p class="v2-kicker">Sobre este lugar</p><h2>Uma parada que entra no contexto da viagem.</h2><p class="v2-copy">${esc(p.shortDescription)}</p><p class="muted">Conteúdo sintético para validação. Nenhum dado de atendimento ou localização representa um estabelecimento real.</p></div><div class="partner-about-media">${scenicMedia(p,'about')}<div class="partner-mini-media">${scenicMedia(p,'mini')}</div></div></div></section>
      ${exps.length?`<section class="v2-section partner-features full-bleed"><div class="v2-container"><div class="v2-section-heading light"><div><p class="v2-kicker">O que você encontra aqui</p><h2>Experiências associadas</h2></div><p>Os módulos abaixo são derivados das experiências existentes no seed demonstrativo.</p></div><div class="partner-feature-grid">${exps.map((e,i)=>`<article class="partner-feature ${i%2?'reverse':''}"><div class="feature-media">${scenicMedia(p,'feature-block')}</div><div><span class="badge">${esc(costLabel(e.costType))}</span><h3>${esc(e.name)}</h3><p>${e.durationMinutes} min · ${esc(environmentLabel(e.environment))}</p>${e.bookingType==='external_required'?'<button class="light-button" data-action="demo-contact">Solicitar reserva demo</button>':''}</div></article>`).join('')}</div></div></section>`:''}
      <section class="v2-section"><div class="v2-container partner-details-grid"><div><p class="v2-kicker">Antes de visitar</p><h2>Informações e ações</h2><div class="details-list"><div><span>Horário</span><strong>${esc(p.openingHours?.text||'Não informado')}</strong></div><div><span>Localização</span><strong>${esc(p.location?.display||'Não informada')}</strong></div><div><span>Ambiente</span><strong>${esc(environmentLabel(p.environment))}</strong></div><div><span>Duração sugerida</span><strong>${p.durationMinutes} min</strong></div></div><p class="muted">Links de contato são bloqueados nesta demo para evitar confusão com canais reais.</p><div class="contact-row"><button data-action="demo-contact">${icon('lugar-whatsapp')} WhatsApp</button><button data-action="demo-contact">${icon('lugar-instagram')} Instagram</button><button data-action="demo-contact">${icon('link-externo')} Site</button></div></div><aside class="sticky-summary"><p class="v2-kicker">Na sua viagem</p><h3>${planned?'Este lugar já está no roteiro.':'Quer incluir esta parada?'}</h3><p>${visited?'Há uma visita demonstrativa registrada.':planned?'Planejado não significa visitado. O registro continua separado.':'Você pode adicioná-lo à viagem sem alterar as outras paradas.'}</p><button class="primary" data-action="add-trip" data-place="${p.id}">${planned?'Já adicionado':'Adicionar ao roteiro'}</button><button data-action="register-visit" data-place="${p.id}">${visited?'Visita registrada':'Registrar visita demo'}</button></aside></div></section>
      <section class="v2-section partner-location"><div class="v2-container"><div class="v2-section-heading"><div><p class="v2-kicker">Localização</p><h2>Onde esta parada entra no mapa</h2></div><p>Mapa abstrato de validação, sem geografia definitiva.</p></div><div class="map-explore-grid"><div>${mockMap([p,...suggestions.slice(0,3)])}</div><div class="location-copy"><span>${icon('lugar-localizacao')}</span><h3>${esc(p.location?.display||'Localização não informada')}</h3><p>O endereço textual permanece acessível mesmo quando o mapa não representa um provedor real.</p><button data-action="demo-contact">Abrir rota demo ${icon('mapa-abrir-navegacao')}</button></div></div></div></section>
      <section class="v2-section"><div class="v2-container"><div class="v2-section-heading"><div><p class="v2-kicker">Continue explorando</p><h2>Outros caminhos</h2></div><a class="text-link" href="#/explorar">Ver todos ${icon('avancar')}</a></div><div class="grid">${suggestions.slice(0,3).map(x=>placeCard(x,'editorial')).join('')}</div></div></section>
    </div>`;
  }

  function renderPartnerAcquisition(){
    const view=window.PSN_PARTNER_PAGE;
    if(!view){app.innerHTML=pageTitle('Para parceiros','Erro de carregamento','A página institucional não pôde ser carregada.');return;}
    app.innerHTML=view.render(ui.partnerLandingTab);
  }

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
      <section class="two-col"><div><div class="timeline">${items.length?items.map(i=>routeItem(i,day.date)).join(''):'<div class="empty">Este dia está livre.</div>'}</div></div><aside class="sidebar"><div class="panel"><h3>Adicionar uma parada</h3><label class="field">Lugar<select id="route-add-place"><option value="">Escolha um lugar</option>${discoverablePlaces().filter(p=>!plannedItemFor(p.id)).map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('')}</select></label><button data-action="route-add-selected">Adicionar ao dia</button></div><div class="panel"><h3>Como editar</h3><p class="muted">Mover altera apenas o horário da parada. Fixar preserva a escolha. Remover não reorganiza automaticamente o restante.</p></div>${mockMap(items.map(i=>placeById(i.placeId)).filter(Boolean))}</aside></section>`;
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
    app.innerHTML = `${pageTitle('Meu Passaporte','Memória digital da viagem','Planejamento e presença continuam visualmente separados nesta versão.')}<div class="book-wrap"><nav class="book-index" aria-label="Capítulos">${pages.map((p,i)=>`<button class="${ui.passportPage===i?'primary':''}" data-passport-page="${i}">${i+1}. ${esc(p.title)}</button>`).join('')}</nav><div><div class="book"><article class="book-page active"><p class="eyebrow">${esc(a.eyebrow)}</p><h2>${esc(a.title)}</h2>${a.body}<span class="page-number">${ui.passportPage+1}</span></article>${b?`<article class="book-page"><p class="eyebrow">${esc(b.eyebrow)}</p><h2>${esc(b.title)}</h2>${b.body}<span class="page-number">${ui.passportPage+2}</span></article>`:''}</div><div class="trip-toolbar"><button data-action="passport-prev" ${ui.passportPage===0?'disabled':''}>Página anterior</button><button data-action="passport-next" ${ui.passportPage>=pages.length-1?'disabled':''}>Próxima página</button></div><section class="panel"><h3>Registrar presença fictícia</h3><p class="muted">Este controle existe apenas para validar a diferença entre planejamento e presença registrada.</p><div class="actions"><select id="passport-place"><option value="">Escolha um lugar</option>${discoverablePlaces().filter(p=>!visitFor(p.id)).map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('')}</select><button data-action="passport-register">Registrar visita demo</button></div></section></div></div>`;
  }

  const adminKinds = {places:'Lugares',partners:'Parceiros',experiences:'Experiências',events:'Eventos',categories:'Categorias',sources:'Fontes'};
  function adminLabel(kind,item){if(kind==='places'||kind==='experiences'||kind==='events'||kind==='categories')return item.name; if(kind==='sources')return item.sourceName; if(kind==='partners')return placeById(item.placeId)?.name||item.id; return item.id}
  function renderAdmin(){
    const kind=ui.adminKind, list=mergedCollection(kind); if(ui.adminEdit&&!list.find(x=>x.id===ui.adminEdit))ui.adminEdit=null;
    app.innerHTML = `${pageTitle('Admin de demonstração','Controle operacional local','Edite, salve rascunho, visualize e publique no navegador. Nada é enviado a um servidor.')}<div class="security-demo-note"><strong>Segurança desta build:</strong> esta área é somente uma simulação local e não possui autenticação real. Em produção, acesso administrativo exige RBAC validado tanto na interface quanto no backend; ocultar elementos no navegador não é autorização.</div><div class="admin-layout"><nav class="admin-nav" aria-label="Tipos de conteúdo">${Object.entries(adminKinds).map(([k,l])=>`<button class="${k===kind?'active':''}" data-admin-kind="${k}">${l}<span class="badge">${mergedCollection(k).length}</span></button>`).join('')}</nav><section>${ui.adminEdit?renderAdminEditor(kind,list.find(x=>x.id===ui.adminEdit)):renderAdminList(kind,list)}</section></div>`;
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


  function legalShell(title,eyebrow,lead,body){
    app.innerHTML=`<article class="legal-page">${breadcrumbs([{label:'Início',href:'#/'},{label:title}])}${pageTitle(title,eyebrow,lead)}${body}</article>`;
  }
  function renderPrivacy(){
    legalShell('Política de Privacidade da demonstração','Transparência','Esta página descreve somente o comportamento desta versão de validação, sem presumir o funcionamento futuro da plataforma.',`
      <section><h2>Dados tratados nesta versão</h2><p>A demonstração não possui cadastro real, autenticação de produção, CRM, pixels publicitários, mapas externos ou envio de formulários para servidor. O roteiro, as alterações do Admin demo, as visitas demonstrativas e a preferência de tema ficam armazenados localmente no navegador.</p></section>
      <section><h2>Finalidade</h2><p>O armazenamento local existe exclusivamente para permitir validar continuidade de navegação e estados da interface. Esses dados não são apresentados como registros reais de viagem ou presença.</p></section>
      <section><h2>Compartilhamento e fornecedores</h2><p>Nesta build estática não há integração ativa com fornecedores externos para analytics, autenticação, publicidade, mapas, reservas ou atendimento. Quando qualquer integração real for adicionada, esta política deverá ser revista antes de produção.</p></section>
      <section><h2>Retenção e controle</h2><p>Os dados demonstrativos permanecem no armazenamento local deste navegador até serem limpos pelo usuário. Você pode usar “Restaurar demo” para recriar o estado inicial ou apagar todos os dados locais desta demonstração.</p><button data-action="clear-local-data">Apagar dados locais da demonstração</button></section>
      <section><h2>Contato e validação jurídica</h2><p>Dados do operador comercial e canal jurídico ainda não foram fornecidos para esta build de validação e, por isso, não são inventados aqui. Antes de produção, a política precisa refletir o operador real, fornecedores, bases legais e direitos aplicáveis, com revisão jurídica quando necessário.</p></section>`);
  }
  function renderTerms(){
    legalShell('Termos de uso da demonstração','Condições de uso','Estes termos descrevem a finalidade desta versão navegável e não substituem termos comerciais futuros.',`
      <section><h2>Finalidade</h2><p>Esta versão existe para validação visual e funcional. Lugares, parceiros, clima, visitas, contatos, eventos e demais dados exibidos são sintéticos.</p></section>
      <section><h2>Sem transação real</h2><p>Nenhuma ação desta demonstração conclui reserva, pagamento, contratação, visita presencial ou contato comercial. Botões externos demonstrativos são bloqueados justamente para evitar essa interpretação.</p></section>
      <section><h2>Contas e permissões</h2><p>Não há autenticação real nesta publicação estática. O Admin é um simulador local. Qualquer versão de produção com papéis diferentes deverá aplicar autorização no frontend e no backend.</p></section>
      <section><h2>Disponibilidade e responsabilidade</h2><p>A demonstração pode mudar ou ser reiniciada a qualquer momento e não oferece garantia de disponibilidade, conteúdo turístico atual ou funcionamento de integrações futuras.</p></section>
      <section><h2>Versão de produção</h2><p>Antes de uma operação comercial real, estes termos deverão ser substituídos ou ampliados conforme o modelo de negócio, operador, legislação e jurisdição aplicáveis.</p></section>`);
  }
  function renderCookies(){
    legalShell('Cookies e armazenamento','Preferências','A demonstração foi construída para evitar rastreamento externo e documentar as tecnologias que realmente utiliza.',`
      <section><h2>Cookies</h2><p>Esta build não instala cookies opcionais de analytics, publicidade ou remarketing e não carrega scripts de terceiros que dependam de consentimento.</p></section>
      <section><h2>Armazenamento local</h2><p>O navegador utiliza <code>localStorage</code> para salvar o estado da demonstração e a preferência de aparência. Isso permite que roteiro, Passaporte, alterações locais do Admin e tema persistam após recarregar a página.</p></section>
      <section><h2>Consentimento</h2><p>Como não há cookies opcionais nem ferramentas externas de rastreamento nesta build, não exibimos um banner de consentimento artificial. Caso ferramentas opcionais sejam adicionadas, elas deverão ser bloqueadas até o consentimento quando a legislação aplicável assim exigir.</p></section>
      <section><h2>Limpar preferências</h2><button data-action="clear-local-data">Apagar dados locais da demonstração</button></section>`);
  }
  function renderAccessibility(){
    legalShell('Acessibilidade','Experiência inclusiva','A acessibilidade é tratada como requisito da construção, não como acabamento posterior.',`
      <section><h2>Navegação</h2><p>A demo inclui link de salto para o conteúdo, foco visível, navegação por teclado, fechamento do menu móvel por Escape, labels em formulários e controles com nomes acessíveis.</p></section>
      <section><h2>Movimento e contraste</h2><p>As transições respeitam <code>prefers-reduced-motion</code>. Estados importantes não devem depender apenas de cor e a paleta usa os tokens oficiais de contraste da interface.</p></section>
      <section><h2>Imagens e mapas</h2><p>As mídias demonstrativas recebem descrição funcional. Mapas abstratos não substituem informação textual de localização.</p></section>
      <section><h2>Limites desta validação</h2><p>Esta página não declara certificação formal. Auditorias automatizadas e testes assistivos completos continuam necessários antes de produção.</p></section>`);
  }

  function renderNotFound(){app.innerHTML=`${breadcrumbs([{label:'Início',href:'#/'},{label:'Página não encontrada'}])}${pageTitle('Página não encontrada','Demonstração','A rota solicitada não existe nesta versão.')}<form class="not-found-search" id="not-found-search" role="search"><label class="field" for="not-found-q">Pesquisar no Passaporte</label><div class="search-inline"><input id="not-found-q" type="search" placeholder="Café, natureza, cultura…"><button class="primary" type="submit">Explorar</button></div></form><div class="not-found-actions"><a class="button primary" href="#/">Voltar ao início</a><a class="button" href="#/explorar">Explorar lugares</a><a class="button" href="#/roteiro">Montar roteiro</a></div>`}

  function render(){
    window.scrollTo(0,0); const hash=(location.hash||'#/').slice(1).split('?')[0]; const parts=hash.split('/').filter(Boolean);
    const page=parts[0]||'home'; document.body.dataset.page=page; updateNavCurrent(page);
    if(parts.length===0){setPageMeta('home');renderHome();}
    else if(parts[0]==='explorar'){setPageMeta('explorar');renderExplore();}
    else if(parts[0]==='lugares'&&parts[1]){const p=placeBySlug(parts[1]);setPageMeta('explorar',p?`${p.name} · Passaporte Serra Negra`:'Lugar · Passaporte Serra Negra',p?.shortDescription||'Página de lugar na demonstração.');renderPlace(parts[1],false);}
    else if(parts[0]==='parceiros'&&parts.length===1){setPageMeta('parceiros');renderPartnerAcquisition();}
    else if(parts[0]==='parceiros'&&parts[1]){const p=placeBySlug(parts[1]);setPageMeta('explorar',p?`${p.name} · Passaporte Serra Negra`:'Parceiro · Passaporte Serra Negra',p?.shortDescription||'Página de parceiro na demonstração.');renderPlace(parts[1],true);}
    else if(parts[0]==='roteiro'&&parts.length===1){setPageMeta('roteiro');renderOnboarding();}
    else if(parts[0]==='viagens'&&parts[2]==='roteiro'){setPageMeta('viagens','Roteiro da viagem · Passaporte Serra Negra');renderRoute();}
    else if(parts[0]==='viagens'&&parts[2]==='calendario'){setPageMeta('viagens','Calendário da viagem · Passaporte Serra Negra');renderCalendar();}
    else if(parts[0]==='meu-passaporte'){setPageMeta('meu-passaporte');renderPassport();}
    else if(parts[0]==='admin'){setPageMeta('admin');renderAdmin();}
    else if(parts[0]==='para-parceiros'){location.replace('#/parceiros');return;}
    else if(parts[0]==='privacidade'){setPageMeta('privacidade');renderPrivacy();}
    else if(parts[0]==='termos'){setPageMeta('termos');renderTerms();}
    else if(parts[0]==='cookies'){setPageMeta('cookies');renderCookies();}
    else if(parts[0]==='acessibilidade'){setPageMeta('acessibilidade');renderAccessibility();}
    else {setPageMeta('home','Página não encontrada · Passaporte Serra Negra','A rota solicitada não existe nesta demonstração.');renderNotFound();}
    app.focus({preventScroll:true});
  }

  document.addEventListener('click',e=>{
    const t=e.target.closest('button,[data-action],[data-filter-category],[data-day],[data-day-calendar],[data-calendar-mode],[data-passport-page],[data-admin-kind],[data-admin-edit],[data-route-action],[data-onboard-key],[data-home-spot],[data-home-partner],[data-route-type],[data-home-faq],[data-participation-tab],[data-partner-scroll]'); if(!t)return;
    if(t.dataset.homeSpot!==undefined){ui.homeSpotIndex=Number(t.dataset.homeSpot);renderHome();return}
    if(t.dataset.homePartner!==undefined){ui.homePartnerIndex=Number(t.dataset.homePartner);renderHome();return}
    if(t.dataset.routeType){ui.homeRouteType=t.dataset.routeType;if(t.dataset.action==='route-type-to-onboarding'){location.hash='#/roteiro';return}renderHome();return}
    if(t.dataset.homeFaq!==undefined){const i=Number(t.dataset.homeFaq);ui.homeFaqOpen=ui.homeFaqOpen===i?-1:i;renderHome();return}
    if(t.dataset.participationTab!==undefined){const idx=Number(t.dataset.participationTab);ui.partnerLandingTab=idx;renderPartnerAcquisition();requestAnimationFrame(()=>{document.querySelector(`[data-participation-tab="${idx}"]`)?.focus({preventScroll:true});document.querySelector('.partners-participation')?.scrollIntoView({block:'start'});});return}
    if(t.dataset.partnerScroll){document.getElementById(t.dataset.partnerScroll)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});return}
    if(t.dataset.action==='partner-contact-demo'){toast('Contato demonstrativo: nenhum dado foi enviado.');return}
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
    if(a==='clear-local-data'){if(confirm('Apagar estado e preferências locais desta demonstração?')){localStorage.removeItem(STORE);localStorage.removeItem(THEME_STORE);state=defaultState();document.documentElement.dataset.theme='system';themeSelect.value='system';syncThemeMeta('system');toast('Dados locais apagados.');location.hash='#/';render()}return}
  });


  document.addEventListener('submit',e=>{
    if(e.target?.id==='home-search-form'){
      e.preventDefault();
      const q=$('#home-search')?.value?.trim()||'';
      location.hash=`#/explorar${q?`?q=${encodeURIComponent(q)}`:''}`;
    }
    if(e.target?.id==='not-found-search'){
      e.preventDefault();
      const q=$('#not-found-q')?.value?.trim()||'';
      location.hash=`#/explorar${q?`?q=${encodeURIComponent(q)}`:''}`;
    }
  });

  const syncMapHighlight=(id,on)=>{if(!id)return;$$(`[data-map-place="${id}"]`).forEach(el=>el.classList.toggle('is-map-active',on));};
  document.addEventListener('pointerover',e=>{const el=e.target.closest?.('[data-map-place]');if(el)syncMapHighlight(el.dataset.mapPlace,true)});
  document.addEventListener('pointerout',e=>{const el=e.target.closest?.('[data-map-place]');if(el&&!el.contains(e.relatedTarget))syncMapHighlight(el.dataset.mapPlace,false)});
  document.addEventListener('focusin',e=>{const el=e.target.closest?.('[data-map-place]');if(el)syncMapHighlight(el.dataset.mapPlace,true)});
  document.addEventListener('focusout',e=>{const el=e.target.closest?.('[data-map-place]');if(el)syncMapHighlight(el.dataset.mapPlace,false)});
  document.addEventListener('keydown',e=>{
    const tab=e.target.closest?.('[role="tab"][data-route-type]'); if(!tab||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
    const tabs=$$('[role="tab"][data-route-type]'); if(!tabs.length)return; e.preventDefault();
    let i=tabs.indexOf(tab); if(e.key==='ArrowLeft')i=(i-1+tabs.length)%tabs.length; if(e.key==='ArrowRight')i=(i+1)%tabs.length; if(e.key==='Home')i=0; if(e.key==='End')i=tabs.length-1;
    tabs[i].focus(); tabs[i].click();
  });

  document.addEventListener('keydown',e=>{
    const tab=e.target.closest?.('[role="tab"][data-participation-tab]'); if(!tab||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key))return;
    const tabs=$$('[role="tab"][data-participation-tab]'); if(!tabs.length)return; e.preventDefault();
    let i=tabs.indexOf(tab); if(['ArrowLeft','ArrowUp'].includes(e.key))i=(i-1+tabs.length)%tabs.length; if(['ArrowRight','ArrowDown'].includes(e.key))i=(i+1)%tabs.length; if(e.key==='Home')i=0; if(e.key==='End')i=tabs.length-1;
    tabs[i].focus(); tabs[i].click();
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
