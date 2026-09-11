(() => {
  'use strict';

  const DATA = window.PSN_DATA;
  const CONFIG = window.PSN_UI_CONFIG;
  const ICON = window.PSN_ICON;
  const STORE = 'psn-functional-demo-v1';
  const THEME_STORE = 'psn-theme-v1';
  const app = document.getElementById('app');
  const toastEl = document.getElementById('toast');
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const clone = (v) => JSON.parse(JSON.stringify(v));
  const esc = (v='') => String(v).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const icon = (key, alt='', options={}) => ICON?.html(key, alt, options) || '';
  const fmtDate = (date) => new Intl.DateTimeFormat('pt-BR',{weekday:'short',day:'2-digit',month:'short'}).format(new Date(`${date}T12:00:00`));
  const fmtFullDate = (date) => new Intl.DateTimeFormat('pt-BR',{weekday:'long',day:'2-digit',month:'long'}).format(new Date(`${date}T12:00:00`));
  const fmtCapsDate = (date) => new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'short',year:'numeric'}).format(new Date(`${date}T12:00:00`)).replace(/\./g,'').toLocaleUpperCase('pt-BR');
  const byId = (arr,id) => arr.find(x=>x.id===id);
  const categoryName = id => byId(DATA.content.categories,id)?.name || id;
  const fromMap = (map,v,fallback=v) => map?.[v] || fallback;
  const costLabel = v => fromMap(CONFIG.labels.cost,v,v);
  const environmentLabel = v => fromMap(CONFIG.labels.environment,v,v);
  const relationLabel = v => fromMap(CONFIG.labels.relation,v,'Ponto turístico demo');
  const responseLabel = v => fromMap(CONFIG.labels.response,v,'Tempo não informado');
  const weatherDef = v => CONFIG.weather[v] || {label:v||'Clima',iconKey:'weather.cloudy'};
  const weatherLabel = v => weatherDef(v).label;
  const weatherIcon = v => weatherDef(v).iconKey;
  const PAGE_META = CONFIG.pageMeta;
  const tripDates = (trip=DATA.trip) => (trip?.days||[]).map(d=>d.date).filter(Boolean).sort();
  const tripPeriodLabel = (trip=DATA.trip) => {
    const dates=tripDates(trip); if(!dates.length)return 'Período não definido';
    const first=new Date(`${dates[0]}T12:00:00`), last=new Date(`${dates.at(-1)}T12:00:00`);
    if(dates[0]===dates.at(-1))return new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'long',year:'numeric'}).format(first);
    if(first.getMonth()===last.getMonth()&&first.getFullYear()===last.getFullYear())return `${first.getDate()} a ${last.getDate()} de ${new Intl.DateTimeFormat('pt-BR',{month:'long',year:'numeric'}).format(first)}`;
    return `${new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'short'}).format(first)} a ${new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'short',year:'numeric'}).format(last)}`;
  };
  const tripPeriodCaps = (trip=DATA.trip) => { const dates=tripDates(trip); return dates.length ? `${fmtCapsDate(dates[0])}${dates.length>1?` → ${fmtCapsDate(dates.at(-1))}`:''}` : 'PERÍODO NÃO DEFINIDO'; };
  const demoOccurredAt = () => {
    const now=new Date();
    const day=(typeof ui!=='undefined'&&ui.activeDay)||tripDates(state?.trip||DATA.trip)[0]||now.toISOString().slice(0,10);
    const configured=DATA.content?.meta?.demoClock||'';
    if(configured.includes('T')) return `${day}T${configured.slice(configured.indexOf('T')+1)}`;
    const pad=n=>String(n).padStart(2,'0'), offsetMinutes=-now.getTimezoneOffset(), sign=offsetMinutes>=0?'+':'-', abs=Math.abs(offsetMinutes), offset=`${sign}${pad(Math.floor(abs/60))}:${pad(abs%60)}`;
    return `${day}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}${offset}`;
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
    const href=CONFIG.navigation.pageMap[page]; if(href){const link=$(`#main-nav a[href="${href}"]`); link?.setAttribute('aria-current','page');}
  }

  const defaultState = () => ({
    version: CONFIG.storeVersion,
    trip: clone(DATA.trip),
    adminOverrides: {places:{},partners:{},experiences:{},events:{},categories:{},sources:{}},
    drafts: {places:{},partners:{},experiences:{},events:{},categories:{},sources:{}},
    adminCreated: {places:[],partners:[],experiences:[],events:[],categories:[],sources:[]},
    audit: [{at:new Date().toISOString(), action:'demo_started', label:'Ambiente local iniciado'}]
  });
  function migrateState(previous){
    if(!previous||typeof previous!=='object') return defaultState();
    const base=defaultState();
    return {
      ...base,...previous,version:CONFIG.storeVersion,
      trip:{...base.trip,...(previous.trip||{})},
      adminOverrides:{...base.adminOverrides,...(previous.adminOverrides||{})},
      drafts:{...base.drafts,...(previous.drafts||{})},
      adminCreated:{...base.adminCreated,...(previous.adminCreated||{})},
      audit:Array.isArray(previous.audit)?previous.audit:base.audit
    };
  }
  function loadState(){
    try { const stored=JSON.parse(localStorage.getItem(STORE)||'null'); return stored?.version===CONFIG.storeVersion ? stored : migrateState(stored); }
    catch { return defaultState(); }
  }
  let state = loadState();
  const save = () => localStorage.setItem(STORE, JSON.stringify(state));
  const ui = {
    explore:{q:'',category:'',relation:'',environment:'',cost:''},
    onboarding:{step:0,answers:{dates:tripPeriodLabel(DATA.trip),party:'Casal',interests:['cat-natureza','cat-gastronomia','cat-cultura'],intent:'Conhecer e descobrir',pace:'Equilibrado',transport:'Carro',needs:'Nenhuma necessidade específica'}},
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
    if(plannedItemFor(place.id)) out.push(statusBadge('planned'));
    if(visitFor(place.id)) out.push(statusBadge('visited'));
    return out.join(' ');
  }
  const categoryIconById = id => CONFIG.categoryUi[id]?.iconKey || byId(DATA.content.categories,id)?.iconKey || 'nav.explore';
  const categoryIconName = place => {
    const id=(place?.categoryIds||[])[0];
    return id ? categoryIconById(id) : (place?.commercialRelation==='partner' ? 'nav.partners' : 'map.place');
  };
  const statusBadge = (type,labelOverride='') => {
    const def=CONFIG.labels.status[type]||{label:type,iconKey:'place.info',tone:'neutral'};
    const cls=def.tone==='success'?'ok':def.tone==='warning'?'warn':def.tone==='danger'?'danger':'';
    return `<span class="badge ${cls} status-with-icon">${icon(def.iconKey,'',{size:14})}${esc(labelOverride||def.label)}</span>`;
  };
  const factList = rows => `<div class="fact-list">${rows.filter(r=>r.value!==undefined&&r.value!==null&&r.value!=='').map(r=>`<div class="fact-row">${icon(r.iconKey||'place.info','',{size:20})}<small>${esc(r.label)}</small><strong>${esc(r.value)}</strong></div>`).join('')}</div>`;
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
  function mapPositions(places){
    const valid=places.map((p,i)=>({p,i,lat:Number(p?.location?.lat),lng:Number(p?.location?.lng)})).filter(x=>Number.isFinite(x.lat)&&Number.isFinite(x.lng));
    const minLat=Math.min(...valid.map(x=>x.lat)), maxLat=Math.max(...valid.map(x=>x.lat));
    const minLng=Math.min(...valid.map(x=>x.lng)), maxLng=Math.max(...valid.map(x=>x.lng));
    const latSpan=maxLat-minLat, lngSpan=maxLng-minLng;
    const hash=(txt)=>[...String(txt)].reduce((a,c)=>(a*31+c.charCodeAt(0))>>>0,2166136261);
    return places.map((p,i)=>{
      const lat=Number(p?.location?.lat),lng=Number(p?.location?.lng);
      if(Number.isFinite(lat)&&Number.isFinite(lng)&&latSpan>0&&lngSpan>0){
        return {x:10+80*((lng-minLng)/lngSpan),y:10+80*((maxLat-lat)/latSpan)};
      }
      const h=hash(p?.id||p?.slug||i); return {x:12+(h%73),y:14+((h>>>8)%69)};
    });
  }
  function mockMap(places){
    const positions=mapPositions(places.slice(0,8));
    const pts=places.slice(0,8).map((p,i)=>{
      const {x,y}=positions[i]; const key=p?.commercialRelation==='partner'?'nav.partners':'map.place';
      return `<span class="map-dot-icon" style="left:${x.toFixed(2)}%;top:${y.toFixed(2)}%">${icon(key,'',{size:17})}</span><span class="map-label" style="left:${x.toFixed(2)}%;top:${y.toFixed(2)}%">${esc(p.name)}</span>`;
    }).join('');
    return `<div class="mock-map" role="img" aria-label="Mapa demonstrativo derivado dos dados disponíveis, sem cartografia definitiva">${pts}</div>`;
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

  const HOME_ROUTE_TYPES = CONFIG.home.routeTypes;
  function homeHeroSection(){
    return `<section class="home-section home-hero" data-psd-layer="01" aria-labelledby="home-title">
      <div class="home-hero-art" aria-hidden="true">
        <picture class="home-hero-photo">
          <source type="image/webp" media="(min-width: 1800px)" srcset="./assets/brand/hero/serra-negra-header-2048.webp">
          <source type="image/jpeg" media="(min-width: 1800px)" srcset="./assets/brand/hero/serra-negra-header-2048.jpg">
          <source type="image/webp" media="(min-width: 1360px)" srcset="./assets/brand/hero/serra-negra-header-1600.webp">
          <source type="image/jpeg" media="(min-width: 1360px)" srcset="./assets/brand/hero/serra-negra-header-1600.jpg">
          <source type="image/webp" media="(min-width: 1024px)" srcset="./assets/brand/hero/serra-negra-header-1280.webp">
          <source type="image/jpeg" media="(min-width: 1024px)" srcset="./assets/brand/hero/serra-negra-header-1280.jpg">
          <source type="image/webp" media="(min-width: 700px)" srcset="./assets/brand/hero/serra-negra-header-960.webp">
          <source type="image/jpeg" media="(min-width: 700px)" srcset="./assets/brand/hero/serra-negra-header-960.jpg">
          <source type="image/webp" srcset="./assets/brand/hero/serra-negra-header-640.webp">
          <img src="./assets/brand/hero/serra-negra-header-640.jpg" alt="" loading="eager" fetchpriority="high" decoding="async">
        </picture>
        <span class="home-hero-overlay"></span>
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
        <div class="home-quick-search" aria-label="Sugestões rápidas">${CONFIG.home.quickSearch.map(x=>`<button data-action="home-search-suggestion" data-query="${esc(x)}">${esc(x)}</button>`).join('')}</div>
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
    const day=state.trip.days[0]; const items=day.items.filter(i=>i.state!=='removed').slice(0,5);
    const point=(i,count)=>{const t=(i+1)/(count+1);return {x:5+90*t,y:76-48*Math.sin(Math.PI*t)+8*Math.sin(2*Math.PI*t)}};
    return `<section class="home-section home-route-visual" data-psd-layer="04" aria-labelledby="route-visual-title"><div class="route-visual-art" aria-hidden="true"><span class="route-desert-horizon"></span></div><div class="psd-container route-visual-layout"><div class="route-visual-copy"><p class="psd-kicker">A linha conecta a experiência</p><h2 id="route-visual-title">Um roteiro é uma sequência que pode mudar.</h2><p>A viagem demonstrativa compartilha os mesmos dados com calendário e Passaporte. Alterar uma parada não reconstrói silenciosamente o restante.</p><a class="button primary" href="#/viagens/demo-trip-001/roteiro">${icon('nav.route','',{size:18})}Abrir roteiro pronto</a></div><div class="route-visual-map" aria-label="Sequência demonstrativa do primeiro dia"><svg viewBox="0 0 760 420" aria-hidden="true"><path d="M70 328 C168 260 180 106 310 138 S432 328 560 220 S618 72 700 84"/></svg>${items.map((i,n)=>{const p=placeById(i.placeId);const pos=point(n,items.length);return `<a href="${p?.commercialRelation==='partner'?'#/parceiros/':'#/lugares/'}${p?.slug||''}" class="route-visual-stop" style="left:${pos.x.toFixed(2)}%;top:${pos.y.toFixed(2)}%">${icon('map.place','',{size:16})}<span>0${n+1}</span><small>${esc(i.startsAt)}</small><strong>${esc(p?.name||i.placeId)}</strong></a>`}).join('')}</div></div></section>`;
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
    const cats=mergedCollection('categories').filter(c=>c.enabled!==false).sort((a,b)=>(a.sortOrder||0)-(b.sortOrder||0));
    const all=discoverablePlaces();
    return `<section class="home-section home-categories" data-psd-layer="08" aria-labelledby="categories-title"><div class="psd-container"><div class="categories-heading"><div><p class="psd-kicker">Explore por interesse</p><h2 id="categories-title">O que combina com a sua viagem?</h2></div><p>As categorias filtram o conteúdo existente sem criar uma hierarquia de importância.</p></div><div class="categories-grid">${cats.map((c,i)=>{const p=all.find(x=>(x.categoryIds||[]).includes(c.id))||all[i%Math.max(all.length,1)]||{};return `<a href="#/explorar?category=${encodeURIComponent(c.id)}" class="category-reference-tile niche-${(i%6)+1}"><div>${scenicMedia(p,'category-ref')}</div><span class="category-reference-icon">${icon(categoryIconById(c.id),'',{size:18})}</span><strong>${esc(c.name)}</strong><small>Explorar interesse</small></a>`}).join('')}<a href="#/explorar" class="category-reference-tile category-reference-all"><span class="category-reference-icon">${icon('nav.explore','',{size:18})}</span><strong>Ver todos</strong><small>Busca e filtros</small></a></div></div></section>`;
  }
  function homeFaqSection(){
    const faqs=CONFIG.home.faq;
    const active=Math.max(0,Math.min(faqs.length-1,ui.homeFaqOpen<0?0:ui.homeFaqOpen));
    return `<section class="home-section home-faq" data-psd-layer="09" aria-labelledby="faq-title"><div class="psd-container faq-reference-layout"><div class="faq-reference-copy"><p class="psd-kicker">Perguntas frequentes</p><h2 id="faq-title">Entenda antes de começar.</h2><p>Esta interface é uma validação funcional. Recursos ainda não integrados são mostrados como tal, sem simular disponibilidade real.</p><div class="faq-reference-list">${faqs.map((f,i)=>`<div class="faq-reference-item ${ui.homeFaqOpen===i?'open':''}"><button data-home-faq="${i}" aria-expanded="${ui.homeFaqOpen===i}"><span>0${i+1}</span><strong>${esc(f.question)}</strong>${icon(ui.homeFaqOpen===i?'nav.chevronUp':'nav.chevronDown','',{size:18})}</button>${ui.homeFaqOpen===i?`<div class="faq-reference-answer"><p>${esc(f.answer)}</p></div>`:''}</div>`).join('')}</div></div><aside class="faq-reference-preview" aria-live="polite"><div class="faq-preview-art"><span class="faq-preview-horizon"></span><span class="faq-preview-marker">0${active+1}</span></div><small>Resposta em destaque</small><h3>${esc(faqs[active].question)}</h3><p>${esc(faqs[active].answer)}</p></aside></div></section>`;
  }
  function homePassportIntroSection(){
    const steps=CONFIG.home.passportSteps;
    const dates=tripDates(state.trip); const stampDate=dates[0]?fmtCapsDate(dates[0]).replace(/\s\d{4}$/,''):'DATA';
    return `<section class="home-section home-passport-intro" data-psd-layer="10" aria-labelledby="passport-intro-title"><div class="psd-container passport-reference-layout"><div class="passport-reference-mock"><div class="passport-wire" aria-hidden="true"><span></span><span></span><span></span><span></span></div><div class="passport-book"><div class="passport-book-cover"><img src="./assets/brand/logo-passaporte-serra-negra.svg" alt=""><small>PASSAPORTE</small><strong>SERRA<br>NEGRA</strong><span>memórias da viagem</span></div><div class="passport-book-page"><small>VISITA</small><strong>${esc(stampDate)}</strong><span>DEMO</span><em>${state.trip.visits.length} registros demonstrativos</em></div></div></div><div class="passport-reference-copy"><p class="psd-kicker">Da intenção à memória</p><h2 id="passport-intro-title">O roteiro organiza.<br>O Passaporte guarda.</h2><p>A experiência separa claramente o que você pretende fazer daquilo que registrou como vivido.</p><ol>${steps.map((x,i)=>`<li><span>0${i+1}</span>${icon(x.iconKey,'',{size:18})}<strong>${esc(x.label)}</strong></li>`).join('')}</ol><a class="button light-button" href="#/meu-passaporte">${icon('nav.passport','',{size:18})}Abrir meu Passaporte</a></div></div></section>`;
  }
  function homeMapSection(){
    const ps=researchedTouristPlaces().slice(0,8); const positions=mapPositions(ps);
    return `<section class="home-section home-map" data-psd-layer="11" aria-labelledby="map-title"><div class="home-map-landscape" aria-hidden="true"><span></span><span></span></div><div class="psd-container map-reference-layout"><div class="map-reference-panel"><p class="psd-kicker">Visão territorial</p><div class="map-reference-list">${ps.slice(0,3).map((p,i)=>`<a data-map-place="${p.id}" href="${p.commercialRelation==='partner'?'#/parceiros/':'#/lugares/'}${p.slug}"><span>0${i+1}</span><div><small>${esc((p.categoryIds||[]).map(categoryName).join(' · '))}</small><strong>${esc(p.name)}</strong></div></a>`).join('')}</div><a class="button light-button" href="#/explorar">${icon('nav.map','',{size:18})}Abrir exploração completa</a></div><div class="map-reference-canvas" aria-label="Mapa demonstrativo derivado das coordenadas disponíveis"><svg viewBox="0 0 1000 600" aria-hidden="true"><path d="M88 510 C190 430 202 260 348 308 S536 468 610 334 S726 150 900 92"/></svg>${ps.map((p,i)=>`<a data-map-place="${p.id}" class="territory-pin" style="left:${positions[i].x.toFixed(2)}%;top:${positions[i].y.toFixed(2)}%" href="${p.commercialRelation==='partner'?'#/parceiros/':'#/lugares/'}${p.slug}" aria-label="Abrir ${esc(p.name)}">${icon(p.commercialRelation==='partner'?'nav.partners':'map.place','',{size:20})}</a>`).join('')}</div><div class="map-reference-title"><small>Mapa demonstrativo</small><h2 id="map-title">Explore também<br>pelo mapa</h2><p>Os pins são posicionados dinamicamente a partir das coordenadas disponíveis. A camada visual continua abstrata e não substitui cartografia real.</p></div></div></section>`;
  }
  function homeFinalCtaSection(){
    return `<section class="home-section home-final-cta" data-psd-layer="12" aria-labelledby="final-title"><div class="psd-container final-reference-copy"><p class="psd-kicker">Seu próximo caminho</p><h2 id="final-title">Comece pela curiosidade.<br>O roteiro vem depois.</h2><div><a class="button primary" href="#/roteiro">Montar meu roteiro</a><a class="button ghost" href="#/explorar">Explorar primeiro</a></div></div></section>`;
  }
  const sectionRegistry={
    homeHero:homeHeroSection,touristSpots:homeTouristSpotsSection,partnerLoop:homePartnerLoopSection,routeVisual:homeRouteVisualSection,routeTypesShowcase:homeRouteTypesSection,routeTypeCards:homeRouteCardsSection,editorialDiscovery:homeEditorialSection,partnerCategories:homeCategoriesSection,homeFaq:homeFaqSection,passportIntro:homePassportIntroSection,mapExplore:homeMapSection,finalCta:homeFinalCtaSection
  };
  const HOME_SECTIONS=CONFIG.home.sections;
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
    const cats=mergedCollection('categories').filter(c=>c.enabled!==false).sort((a,b)=>(a.sortOrder||0)-(b.sortOrder||0));
    const filterHtml=CONFIG.explore.filters.map(def=>`<label class="field"><span class="icon-label">${icon(def.iconKey,'',{size:16})}${esc(def.label)}</span><select id="${def.id}" data-explore-state="${def.stateKey}">${def.options.map(([value,label])=>`<option value="${esc(value)}" ${ui.explore[def.stateKey]===value?'selected':''}>${esc(label)}</option>`).join('')}</select></label>`).join('');
    app.innerHTML = `${pageTitle('O que você quer descobrir?','Lugares · experiências · eventos','Busque e combine filtros. Lista e mapa usam exatamente o mesmo conjunto de resultados.')}
      <section class="panel" aria-label="Filtros">
        <label class="field"><span class="icon-label">${icon('nav.search','',{size:18})}Buscar</span><input class="searchbox" id="explore-q" type="search" placeholder="Experimente buscar café" value="${esc(ui.explore.q)}"></label>
        <div class="chips" id="category-chips"><button class="chip ${!ui.explore.category?'active':''}" data-filter-category="">${icon('nav.explore','',{size:15})}Tudo</button>${cats.map(c=>`<button class="chip ${ui.explore.category===c.id?'active':''}" data-filter-category="${esc(c.id)}">${icon(categoryIconById(c.id),'',{size:15})}${esc(c.name)}</button>`).join('')}</div>
        <div class="filters">${filterHtml}</div>
        <div class="actions"><button data-action="clear-filters">${icon('calendar.filter','',{size:16})}Limpar filtros</button></div>
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
    $$('[data-explore-state]').forEach(el=>el.addEventListener('change',e=>{ui.explore[e.target.dataset.exploreState]=e.target.value;renderExploreResults()}));
  }
  function renderEventsSection(){
    const events=mergedCollection('events').filter(e=>e.status!=='archived');
    return section('Eventos de demonstração','Agenda',`<div class="grid">${events.map(e=>{const p=placeById(e.placeId);return `<article class="panel"><span class="badge status-with-icon">${icon('map.event','',{size:14})}${fmtDate(e.startsAt.slice(0,10))}</span><h3>${esc(e.name)}</h3><p class="muted icon-label">${icon(e.environment==='outdoor'?'place.outdoor':'nav.home','',{size:16})}${esc(p?.name||'Local demo')} · ${esc(environmentLabel(e.environment))}</p>${p?`<a class="icon-label" href="${p.commercialRelation==='partner'?'#/parceiros/':'#/lugares/'}${p.slug}">Ver local ${icon('nav.forward','',{size:16})}</a>`:''}</article>`}).join('')}</div>`);
  }
  function nextAvailableStart(day){
    const active=(day?.items||[]).filter(i=>i.state!=='removed');
    if(!active.length) return '09:00';
    const end=Math.max(...active.map(i=>{const [h,m]=(i.startsAt||'09:00').split(':').map(Number);return h*60+m+(Number(i.durationMinutes)||60)}));
    const rounded=Math.ceil((end+15)/30)*30; const safe=Math.max(7*60,Math.min(21*60+30,rounded));
    return `${String(Math.floor(safe/60)).padStart(2,'0')}:${String(safe%60).padStart(2,'0')}`;
  }
  function addToTrip(placeId){
    if(plannedItemFor(placeId)){toast('Este lugar já está no roteiro.');return;}
    const day=state.trip.days[0];
    day.items.push({id:`local-item-${Date.now()}`,placeId,startsAt:nextAvailableStart(day),durationMinutes:placeById(placeId)?.durationMinutes||60,source:'added_by_user',state:'planned'});
    save();toast('Lugar adicionado ao roteiro de demonstração.');render();
  }
  function registerVisit(placeId){
    if(visitFor(placeId)){toast('Já existe uma visita demo registrada para este lugar.');return;}
    state.trip.visits.push({id:`visit-local-${Date.now()}`,placeId,occurredAt:demoOccurredAt(),evidence:'manual_demo',tripId:state.trip.trip?.id||'demo-trip-001',isReturn:false,outsidePlannedRoute:!plannedItemFor(placeId)});
    state.audit.unshift({at:new Date().toISOString(),action:'visit_registered',label:placeById(placeId)?.name||placeId});
    save();toast('Visita de demonstração registrada.');render();
  }
  function renderResearchedTourist(p){
    const suggestions=researchedTouristPlaces().filter(x=>x.id!==p.id).slice(0,3);
    const r=p.research||{}; const src=r.officialSource||{}; const asset=p.imageAsset||{};
    const categories=(p.categoryIds||[]).map(categoryName).join(' · ');
    const duration=p.durationIsEstimate?`${p.durationMinutes} min · estimativa`:`${p.durationMinutes} min`;
    const price=p.priceNote||costLabel(p.costType);
    const notes=[...(r.practicalNotes||[]),...(p.requirements||[])];
    const photoStatus=asset.notActualPlace?'Foto temporária relacionada ao tema, não ao local específico':'Foto do atrativo · uso temporário';
    const practical=[
      {iconKey:'place.hours',label:'Horário',value:p.openingHours?.text||'Não informado'},
      {iconKey:'place.location',label:'Localização',value:p.location?.display||'Não informada'},
      {iconKey:'place.duration',label:'Tempo',value:duration},
      {iconKey:p.costType==='free'?'place.free':'place.cost',label:'Custo',value:price}
    ];
    app.innerHTML=`<article class="tourism-page">
      <section class="tourism-hero full-bleed">
        ${scenicMedia(p,'tourism-hero')}
        <div class="tourism-hero-copy">
          ${breadcrumbs([{label:'Início',href:'#/'},{label:'Pontos turísticos',href:'#/explorar?relation=public_point'},{label:p.name}])}
          <span class="tourism-research-badge">${icon('place.info','',{size:14})}Informação pública pesquisada</span>
          <p class="v2-kicker">${esc(categories||'Ponto turístico')} · Serra Negra</p>
          <h1>${esc(p.name)}</h1>
          <p class="lead">${esc(p.shortDescription)}</p>
          <div class="tourism-hero-actions">${statusBadges(p)}<button class="light-button" data-action="add-trip" data-place="${p.id}">${icon('route.add','',{size:18})}${plannedItemFor(p.id)?'Já está no roteiro':'Adicionar ao roteiro'}</button><button class="light-button" data-action="register-visit" data-place="${p.id}">${icon(visitFor(p.id)?'qr.already':'qr.visited','',{size:18})}${visitFor(p.id)?'Visita registrada':'Registrar visita demo'}</button></div>
        </div>
        <div class="tourism-photo-credit">${esc(photoStatus)} · ${asset.sourcePage?`<a href="${esc(asset.sourcePage)}" target="_blank" rel="noopener noreferrer">${esc(asset.provider||'Fonte')} · ${esc(asset.author||'crédito')}</a>`:esc(asset.provider||'mídia temporária')}</div>
      </section>
      <section class="tourism-intro">
        <div class="tourism-intro-copy"><p class="v2-kicker">Conheça o lugar</p><h2>Uma parada real dentro da leitura da cidade.</h2><p>${esc(p.longDescription||p.shortDescription)}</p></div>
        <aside class="tourism-practical" aria-label="Informações práticas">${factList(practical)}</aside>
      </section>
      <section class="tourism-section"><div class="tourism-container"><div class="tourism-heading"><div><p class="v2-kicker">O que vale observar</p><h2>Pontos para orientar a visita.</h2></div><p>Os destaques abaixo foram sintetizados a partir de fontes públicas de turismo. Onde a informação não estava publicada, a página sinaliza a ausência em vez de inventar dados.</p></div><div class="tourism-highlights">${(r.highlights||[]).map((h,i)=>`<article class="tourism-highlight"><span>0${i+1}</span><p>${esc(h)}</p></article>`).join('')}</div></div></section>
      <section class="tourism-media-story full-bleed"><div class="tourism-story-image">${scenicMedia(p,'tourism-story')}</div><div class="tourism-story-copy"><p class="v2-kicker">Antes de sair</p><h2>Planeje com informação verificável.</h2><p>Esta página já usa pesquisa real sobre Serra Negra, mas continua sendo uma build de validação. Horários, preços, acesso e regras operacionais podem mudar. A fonte oficial consultada fica disponível abaixo para conferência.</p><a class="button light-button" href="${esc(src.url||'#')}" target="_blank" rel="noopener noreferrer">Consultar fonte oficial ${icon('nav.external','',{size:18})}</a></div></section>
      <section class="tourism-section"><div class="tourism-container"><div class="tourism-heading"><div><p class="v2-kicker">Informações práticas</p><h2>O que saber antes da visita.</h2></div><p>Notas editoriais e limites de informação desta primeira versão.</p></div><div class="tourism-notes">${notes.length?notes.map(n=>`<article class="tourism-note">${icon('place.info','',{size:22})}<p>${esc(n)}</p></article>`).join(''):`<article class="tourism-note">${icon('place.info','',{size:22})}<p>Não foram identificadas observações adicionais na fonte consultada.</p></article>`}</div><div class="tourism-source-box"><div><small>Fonte principal da página</small><strong>${esc(src.label||'Fonte pública consultada')}</strong><p>Pesquisa realizada em ${esc(r.checkedAt||DATA.content?.meta?.lastResearchAt||'data não informada')}. Reconfirme informações sensíveis a mudança antes de publicar em produção.</p></div>${src.url?`<a class="button" href="${esc(src.url)}" target="_blank" rel="noopener noreferrer">${icon('nav.external','',{size:17})}Abrir fonte</a>`:''}</div></div></section>
      <section class="tourism-section"><div class="tourism-container"><div class="tourism-heading"><div><p class="v2-kicker">Localização</p><h2>Use o endereço como referência.</h2></div><p>O mapa desta demo continua abstrato. Ele demonstra integração com o roteiro sem se apresentar como cartografia definitiva.</p></div><div class="tourism-location-grid"><div>${mockMap([p,...suggestions.slice(0,2)])}</div><aside class="tourism-location-copy">${icon('place.location','',{size:26})}<h3>${esc(p.location?.display||'Localização não informada')}</h3><p>Adicione este ponto ao roteiro para validar a continuidade entre descoberta, planejamento, calendário e Passaporte.</p><button class="primary" data-action="add-trip" data-place="${p.id}">${icon('map.addRoute','',{size:18})}${plannedItemFor(p.id)?'Já está no roteiro':'Adicionar ao roteiro'}</button></aside></div></div></section>
      <section class="tourism-section"><div class="tourism-container"><div class="tourism-heading"><div><p class="v2-kicker">Continue explorando</p><h2>Outros pontos de Serra Negra.</h2></div><a class="text-link" href="#/explorar?relation=public_point">Ver todos ${icon('nav.forward','',{size:17})}</a></div><div class="tourism-more-grid">${suggestions.map(x=>placeCard(x,'editorial')).join('')}</div></div></section>
    </article>`;
  }

  function renderPlace(slug,asPartner=false){
    const p=placeBySlug(slug); if(!p){return renderNotFound();}
    const isPartner=asPartner || p.commercialRelation==='partner';
    if(isPartner) return renderPartner(p);
    if(p.research?.verified) return renderResearchedTourist(p);
    const exps=experiencesFor(p.id), evs=eventsFor(p.id); const suggestions=publicPlaces().filter(x=>x.id!==p.id).slice(0,4);
    const facts=[
      {iconKey:'place.hours',label:'Horário',value:p.openingHours?.text||'Demo'},
      {iconKey:'place.duration',label:'Duração',value:`${p.durationMinutes} min`},
      {iconKey:p.environment==='outdoor'?'place.outdoor':'nav.home',label:'Ambiente',value:environmentLabel(p.environment)},
      {iconKey:p.costType==='free'?'place.free':'place.cost',label:'Custo',value:costLabel(p.costType)}
    ];
    app.innerHTML = `${breadcrumbs([{label:'Início',href:'#/'},{label:'Explorar',href:'#/explorar'},{label:p.name}])}<section class="hero"><div><p class="eyebrow">Ponto turístico · demonstração</p><h1 class="compact">${esc(p.name)}</h1><p class="lead">${esc(p.shortDescription)}</p><div class="actions">${statusBadges(p)}<button class="primary" data-action="add-trip" data-place="${p.id}">${icon('route.add','',{size:18})}${plannedItemFor(p.id)?'Já está no roteiro':'Adicionar ao roteiro'}</button><button data-action="register-visit" data-place="${p.id}">${icon(visitFor(p.id)?'qr.already':'qr.visited','',{size:18})}${visitFor(p.id)?'Visita registrada':'Registrar visita demo'}</button></div></div><div class="hero-visual"><div class="mark">PONTO<br><strong>DEMO</strong></div></div></section>
      <section class="section two-col"><div><p class="eyebrow">Sobre o lugar</p><h2>Conheça este ponto</h2><p class="lead">${esc(p.longDescription||p.shortDescription)}</p><div class="gallery"><div></div><div></div><div></div></div></div><aside class="sidebar"><div class="panel"><h3>Informações rápidas</h3>${factList(facts)}</div>${weatherStrip()}</aside></section>
      ${section('Experiências neste lugar','O que fazer',exps.length?`<div class="grid">${exps.map(e=>`<article class="panel"><span class="badge status-with-icon">${icon('map.experience','',{size:14})}${esc(costLabel(e.costType))}</span><h3>${esc(e.name)}</h3><p class="muted icon-label">${icon(e.environment==='outdoor'?'place.outdoor':'nav.home','',{size:16})}${e.durationMinutes} min · ${esc(environmentLabel(e.environment))}</p></article>`).join('')}</div>`:'<div class="empty">Nenhuma experiência associada.</div>')}
      ${evs.length?section('Eventos','Agenda',`<div class="grid">${evs.map(e=>`<article class="panel"><span class="badge status-with-icon">${icon('map.event','',{size:14})}${fmtDate(e.startsAt.slice(0,10))}</span><h3>${esc(e.name)}</h3><p>${esc(costLabel(e.costType))}</p></article>`).join('')}</div>`):''}
      ${section('Localização','Mapa demonstrativo',mockMap([p,...suggestions.slice(0,2)]))}
      ${section('Continue explorando','Próximos lugares',`<div class="grid">${suggestions.slice(0,3).map(placeCard).join('')}</div>`)}
    `;
  }

  function partnerQuickInfo(p,partner){
    const rows=[
      {iconKey:'place.hours',label:'Hoje',value:p.openingHours?.text},
      {iconKey:'place.duration',label:'Tempo sugerido',value:`${p.durationMinutes} min`},
      {iconKey:p.environment==='outdoor'?'place.outdoor':'nav.home',label:'Ambiente',value:environmentLabel(p.environment)},
      {iconKey:p.costType==='free'?'place.free':'place.cost',label:'Custo',value:costLabel(p.costType)},
      {iconKey:'place.response',label:'Resposta',value:responseLabel(partner?.responseTime)}
    ];
    return `<div class="partner-quick-info">${rows.filter(x=>x.value).map(x=>`<div>${icon(x.iconKey,'',{size:22})}<span><small>${esc(x.label)}</small><strong>${esc(x.value)}</strong></span></div>`).join('')}</div>`;
  }
  function renderPartner(p){
    const partner=partnerForPlace(p.id); const exps=experiencesFor(p.id); const suggestions=publicPlaces().filter(x=>x.id!==p.id).slice(0,4);
    const visited=visitFor(p.id), planned=plannedItemFor(p.id);
    const detailFacts=[
      {iconKey:'place.hours',label:'Horário',value:p.openingHours?.text||'Não informado'},
      {iconKey:'place.location',label:'Localização',value:p.location?.display||'Não informada'},
      {iconKey:p.environment==='outdoor'?'place.outdoor':'nav.home',label:'Ambiente',value:environmentLabel(p.environment)},
      {iconKey:'place.duration',label:'Duração sugerida',value:`${p.durationMinutes} min`}
    ];
    app.innerHTML = `<div class="partner-page-v2">
      <section class="partner-hero-v2 full-bleed">${scenicMedia(p,'partner-hero')}<div class="partner-hero-overlay"></div><div class="v2-container partner-hero-copy">${breadcrumbs([{label:'Início',href:'#/'},{label:'Explorar',href:'#/explorar'},{label:p.name}])}<p class="v2-kicker">${esc((p.categoryIds||[]).map(categoryName).join(' · '))} · parceiro demo</p><h1>${esc(p.name)}</h1><p>${esc(p.shortDescription)}</p><div class="partner-hero-actions"><button class="light-button" data-action="add-trip" data-place="${p.id}">${icon('route.add','',{size:18})}${planned?'Já está no roteiro':'Adicionar ao roteiro'}</button><span class="partner-stamp">PARCEIRO<br><strong>DEMO</strong></span></div></div></section>
      <div class="v2-container partner-quick-wrap">${partnerQuickInfo(p,partner)}</div>
      <section class="v2-section"><div class="v2-container partner-about-grid"><div><p class="v2-kicker">Sobre este lugar</p><h2>Uma parada que entra no contexto da viagem.</h2><p class="v2-copy">${esc(p.shortDescription)}</p><p class="muted">Conteúdo sintético para validação. Nenhum dado de atendimento ou localização representa um estabelecimento real.</p></div><div class="partner-about-media">${scenicMedia(p,'about')}<div class="partner-mini-media">${scenicMedia(p,'mini')}</div></div></div></section>
      ${exps.length?`<section class="v2-section partner-features full-bleed"><div class="v2-container"><div class="v2-section-heading light"><div><p class="v2-kicker">O que você encontra aqui</p><h2>Experiências associadas</h2></div><p>Os módulos abaixo são derivados das experiências existentes no seed demonstrativo.</p></div><div class="partner-feature-grid">${exps.map((e,i)=>`<article class="partner-feature ${i%2?'reverse':''}"><div class="feature-media">${scenicMedia(p,'feature-block')}</div><div><span class="badge status-with-icon">${icon('map.experience','',{size:14})}${esc(costLabel(e.costType))}</span><h3>${esc(e.name)}</h3><p>${e.durationMinutes} min · ${esc(environmentLabel(e.environment))}</p>${e.bookingType==='external_required'?`<button class="light-button" data-action="demo-contact">${icon('place.booking','',{size:18})}Solicitar reserva demo</button>`:''}</div></article>`).join('')}</div></div></section>`:''}
      <section class="v2-section"><div class="v2-container partner-details-grid"><div><p class="v2-kicker">Antes de visitar</p><h2>Informações e ações</h2>${factList(detailFacts)}<p class="muted">Links de contato são bloqueados nesta demo para evitar confusão com canais reais.</p><div class="contact-row"><button data-action="demo-contact">${icon('place.whatsapp','',{size:18})} WhatsApp</button><button data-action="demo-contact">${icon('place.instagram','',{size:18})} Instagram</button><button data-action="demo-contact">${icon('nav.external','',{size:18})} Site</button></div></div><aside class="sticky-summary"><p class="v2-kicker">Na sua viagem</p><h3>${planned?'Este lugar já está no roteiro.':'Quer incluir esta parada?'}</h3><p>${visited?'Há uma visita demonstrativa registrada.':planned?'Planejado não significa visitado. O registro continua separado.':'Você pode adicioná-lo à viagem sem alterar as outras paradas.'}</p><button class="primary" data-action="add-trip" data-place="${p.id}">${icon('map.addRoute','',{size:18})}${planned?'Já adicionado':'Adicionar ao roteiro'}</button><button data-action="register-visit" data-place="${p.id}">${icon(visited?'qr.already':'qr.visited','',{size:18})}${visited?'Visita registrada':'Registrar visita demo'}</button></aside></div></section>
      <section class="v2-section partner-location"><div class="v2-container"><div class="v2-section-heading"><div><p class="v2-kicker">Localização</p><h2>Onde esta parada entra no mapa</h2></div><p>Mapa abstrato de validação, derivado das coordenadas disponíveis.</p></div><div class="map-explore-grid"><div>${mockMap([p,...suggestions.slice(0,3)])}</div><div class="location-copy">${icon('place.location','',{size:25})}<h3>${esc(p.location?.display||'Localização não informada')}</h3><p>O endereço textual permanece acessível mesmo quando o mapa não representa um provedor real.</p><button data-action="demo-contact">Abrir rota demo ${icon('map.navigate','',{size:18})}</button></div></div></div></section>
      <section class="v2-section"><div class="v2-container"><div class="v2-section-heading"><div><p class="v2-kicker">Continue explorando</p><h2>Outros caminhos</h2></div><a class="text-link" href="#/explorar">Ver todos ${icon('nav.forward','',{size:17})}</a></div><div class="grid">${suggestions.slice(0,3).map(x=>placeCard(x,'editorial')).join('')}</div></div></section>
    </div>`;
  }

  function renderPartnerAcquisition(){
    const view=window.PSN_PARTNER_PAGE;
    if(!view){app.innerHTML=pageTitle('Para parceiros','Erro de carregamento','A página institucional não pôde ser carregada.');return;}
    app.innerHTML=view.render(ui.partnerLandingTab);
  }

  const onboardingSteps = CONFIG.onboarding;
  function onboardingChoices(step){
    if(step.choiceMode==='tripDates') return [{value:tripPeriodLabel(state.trip),label:tripPeriodLabel(state.trip),iconKey:'nav.calendar'},{value:'Ainda não sei',label:'Ainda não sei',iconKey:'profile.unknown'}];
    if(step.choiceMode==='categories') return mergedCollection('categories').filter(c=>c.enabled!==false).sort((a,b)=>(a.sortOrder||0)-(b.sortOrder||0)).map(c=>({value:c.id,label:c.name,iconKey:categoryIconById(c.id)}));
    return (step.choices||[]).map(c=>Array.isArray(c)?{value:c[0],label:c[0],iconKey:c[1]}:{value:c.value,label:c.label||c.value,iconKey:c.iconKey});
  }

  function renderOnboarding(){
    const s=onboardingSteps[ui.onboarding.step]; const pct=((ui.onboarding.step+1)/onboardingSteps.length)*100;
    const choices=onboardingChoices(s); const answer=ui.onboarding.answers[s.key];
    app.innerHTML = `<div class="onboarding"><p class="eyebrow icon-label">${icon(s.iconKey||'nav.route','',{size:16})}Roteiro demo · etapa ${ui.onboarding.step+1} de ${onboardingSteps.length}</p><div class="progress"><span style="width:${pct}%"></span></div><h1 class="compact">${esc(s.title)}</h1>${s.lead?`<p class="lead">${esc(s.lead)}</p>`:''}${s.review?renderReview():`<div class="choices">${choices.map(c=>{const selected=s.multi?(answer||[]).includes(c.value):answer===c.value;return `<button class="choice ${selected?'selected':''}" data-onboard-key="${s.key}" data-onboard-value="${esc(c.value)}" data-onboard-multi="${s.multi?'1':'0'}">${icon(c.iconKey||'nav.forward','',{size:22})}<span>${esc(c.label)}</span></button>`}).join('')}</div>`}<div class="trip-toolbar"><button ${ui.onboarding.step===0?'disabled':''} data-action="onboard-prev">${icon('nav.back','',{size:17})}Voltar</button>${s.review?`<button class="primary" data-action="generate-trip">${icon('route.save','',{size:18})}Gerar roteiro demo</button>`:`<button class="primary" data-action="onboard-next">Continuar${icon('nav.forward','',{size:17})}</button>`}</div></div>`;
  }
  function renderReview(){
    const a=ui.onboarding.answers;
    return `<div class="panel"><h3>Suas escolhas</h3>${factList([
      {iconKey:'nav.calendar',label:'Quando',value:a.dates},
      {iconKey:a.party==='Casal'?'profile.couple':a.party==='Família'?'profile.family':a.party==='Amigos'?'profile.friends':'nav.account',label:'Com quem',value:a.party},
      {iconKey:'nav.explore',label:'Interesses',value:(a.interests||[]).map(categoryName).join(', ')},
      {iconKey:'profile.relax',label:'Intenção',value:a.intent},
      {iconKey:a.pace==='Ativo'?'profile.paceActive':a.pace==='Tranquilo'?'profile.paceSlow':'profile.paceBalanced',label:'Ritmo',value:a.pace},
      {iconKey:a.transport==='A pé'?'profile.walk':a.transport==='Táxi / app'?'profile.taxi':'profile.car',label:'Transporte',value:a.transport},
      {iconKey:'profile.none',label:'Necessidades',value:a.needs}
    ])}<p class="muted">O motor desta versão é determinístico e usa conteúdo sintético.</p></div>`;
  }
  function generateTrip(){
    state.trip=clone(DATA.trip); state.trip.trip.party=ui.onboarding.answers.party; state.trip.trip.pace=ui.onboarding.answers.pace; state.trip.trip.transport=ui.onboarding.answers.transport; state.trip.trip.interests=clone(ui.onboarding.answers.interests||[]);
    state.audit.unshift({at:new Date().toISOString(),action:'trip_generated',label:'Roteiro demo gerado'}); save(); toast('Roteiro de demonstração gerado.'); location.hash='#/viagens/demo-trip-001/roteiro';
  }

  function renderRoute(){
    if(!state.trip.days.some(d=>d.date===ui.activeDay)) ui.activeDay=state.trip.days[0].date;
    const day=state.trip.days.find(d=>d.date===ui.activeDay); const items=day.items.filter(i=>i.state!=='removed');
    app.innerHTML = `${pageTitle('Seu roteiro de demonstração',`Viagem · ${tripPeriodLabel(state.trip)}`,'Edite uma parada sem reconstruir silenciosamente o restante da viagem.')}${weatherStrip(day.date)}<div class="trip-toolbar"><div class="day-tabs">${state.trip.days.map(d=>`<button data-day="${d.date}" class="${d.date===day.date?'primary':''}">${icon('calendar.day','',{size:16})}${fmtDate(d.date)}</button>`).join('')}</div><div class="actions"><span class="badge status-with-icon">${icon('route.autosave','',{size:14})}salvo localmente</span><a class="button" href="#/viagens/demo-trip-001/calendario">${icon('nav.calendar','',{size:17})}Ver calendário</a><a class="button" href="#/meu-passaporte">${icon('nav.passport','',{size:17})}Meu Passaporte</a></div></div>
      <section class="two-col"><div><div class="timeline">${items.length?items.map(i=>routeItem(i,day.date)).join(''):'<div class="empty">Este dia está livre.</div>'}</div></div><aside class="sidebar"><div class="panel"><h3 class="icon-label">${icon('route.add','',{size:20})}Adicionar uma parada</h3><label class="field">Lugar<select id="route-add-place"><option value="">Escolha um lugar</option>${discoverablePlaces().filter(p=>!plannedItemFor(p.id)).map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('')}</select></label><button data-action="route-add-selected">${icon('route.add','',{size:18})}Adicionar ao dia</button></div><div class="panel"><h3 class="icon-label">${icon('route.edit','',{size:20})}Como editar</h3><p class="muted">Mover altera apenas o horário da parada. Fixar preserva a escolha. Remover não reorganiza automaticamente o restante.</p></div>${mockMap(items.map(i=>placeById(i.placeId)).filter(Boolean))}</aside></section>`;
  }
  function routeItem(i,date){
    const p=placeById(i.placeId); const fixed=i.state==='fixed'; const visited=!!visitFor(i.placeId);
    return `<article class="card route-item ${fixed?'fixed':''}"><time>${esc(i.startsAt)}</time><div><div class="actions">${statusBadge(fixed?'fixed':'planned')}${visited?statusBadge('visited'):''}</div><h3>${esc(p?.name||i.placeId)}</h3><p class="muted">${p?esc(p.shortDescription):''}</p><a class="icon-label" href="${p?.commercialRelation==='partner'?'#/parceiros/':'#/lugares/'}${p?.slug||''}">Abrir página ${icon('nav.forward','',{size:15})}</a></div><div class="route-actions"><button data-route-action="earlier" data-item="${i.id}" data-date="${date}" aria-label="Mover 30 minutos antes">${icon('route.move','',{size:17})}<span>30 min antes</span></button><button data-route-action="later" data-item="${i.id}" data-date="${date}" aria-label="Mover 30 minutos depois">${icon('route.move','',{size:17})}<span>30 min depois</span></button><button data-route-action="fix" data-item="${i.id}" data-date="${date}">${icon(fixed?'route.unlock':'route.fix','',{size:17})}${fixed?'Desfixar':'Fixar'}</button><button class="danger" data-route-action="remove" data-item="${i.id}" data-date="${date}" ${fixed?'disabled title="Desfixe antes de remover"':''}>${icon('route.remove','',{size:17})}Remover</button></div></article>`;
  }
  function shiftTime(t,mins){const [h,m]=t.split(':').map(Number);let total=h*60+m+mins;total=Math.max(7*60,Math.min(22*60,total));return `${String(Math.floor(total/60)).padStart(2,'0')}:${String(total%60).padStart(2,'0')}`}
  function routeAction(action,date,id){
    const day=state.trip.days.find(d=>d.date===date); const item=day?.items.find(i=>i.id===id); if(!item)return;
    if(action==='earlier')item.startsAt=shiftTime(item.startsAt,-30); if(action==='later')item.startsAt=shiftTime(item.startsAt,30); if(action==='fix')item.state=item.state==='fixed'?'planned':'fixed'; if(action==='remove'&&item.state!=='fixed')item.state='removed'; save();renderRoute();
  }
  function addSelectedToDay(){
    const pid=$('#route-add-place')?.value;if(!pid){toast('Escolha um lugar para adicionar.');return;}
    const day=state.trip.days.find(d=>d.date===ui.activeDay); if(!day)return;
    day.items.push({id:`local-${Date.now()}`,placeId:pid,startsAt:nextAvailableStart(day),durationMinutes:placeById(pid)?.durationMinutes||60,source:'added_by_user',state:'planned'});
    save();toast('Parada adicionada apenas a este dia.');renderRoute();
  }
  function renderCalendar(){
    const mode=ui.calendarMode; const active=state.trip.days.find(d=>d.date===ui.activeDay)||state.trip.days[0];
    const modes=[['day','calendar.day','Dia'],['week','calendar.week','Semana'],['month','calendar.month','Mês']];
    app.innerHTML = `${pageTitle('Calendário da viagem','A mesma viagem, outra leitura','Roteiro e calendário compartilham o mesmo estado. Alterações feitas no roteiro aparecem aqui.')}${weatherStrip(active.date)}<div class="trip-toolbar"><div class="calendar-mode">${modes.map(([id,ico,label])=>`<button class="${mode===id?'primary':''}" data-calendar-mode="${id}">${icon(ico,'',{size:17})}${label}</button>`).join('')}</div><a class="button" href="#/viagens/demo-trip-001/roteiro">${icon('nav.back','',{size:17})}Voltar ao roteiro</a></div><section class="section">${mode==='day'?calendarDay(active):mode==='week'?calendarWeek():calendarMonth(active.date)}</section>`;
  }
  function calendarItem(i){
    const p=placeById(i.placeId); const visited=!!visitFor(i.placeId); const type=visited?'visited':i.state==='fixed'?'fixed':'planned';
    return `<article class="panel"><div class="actions"><strong class="icon-label">${icon('calendar.day','',{size:15})}${esc(i.startsAt)}</strong>${statusBadge(type)}</div><h3>${esc(p?.name||i.placeId)}</h3><p class="muted icon-label">${icon('place.duration','',{size:15})}${i.durationMinutes} min</p></article>`;
  }
  function calendarDay(day){return `<div class="day-tabs">${state.trip.days.map(d=>`<button data-day-calendar="${d.date}" class="${d.date===day.date?'primary':''}">${icon(d.date===new Date().toISOString().slice(0,10)?'calendar.today':'calendar.day','',{size:16})}${fmtDate(d.date)}</button>`).join('')}</div><h2 style="margin-top:1.5rem">${fmtFullDate(day.date)}</h2><div class="calendar-day">${day.items.filter(i=>i.state!=='removed').map(calendarItem).join('')||`<div class="empty icon-label">${icon('calendar.free','',{size:18})}Sem atividades.</div>`}</div>`}
  function calendarWeek(){return `<div class="calendar-week">${state.trip.days.map(d=>`<div><p class="eyebrow icon-label">${icon('calendar.day','',{size:15})}${fmtDate(d.date)}</p>${d.items.filter(i=>i.state!=='removed').map(calendarItem).join('')||`<div class="empty icon-label">${icon('calendar.free','',{size:17})}Livre</div>`}</div>`).join('')}</div>`}
  function calendarMonth(anchorDate){
    const anchor=new Date(`${anchorDate||state.trip.days[0].date}T12:00:00`); const year=anchor.getFullYear(), month=anchor.getMonth();
    const daysInMonth=new Date(year,month+1,0).getDate(); const mondayOffset=(new Date(year,month,1).getDay()+6)%7;
    const weekdays=['Seg','Ter','Qua','Qui','Sex','Sáb','Dom']; let cells='';
    for(let i=0;i<mondayOffset;i++) cells+='<div class="month-day month-day-empty" aria-hidden="true"></div>';
    for(let d=1;d<=daysInMonth;d++){
      const date=`${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`; const tripDay=state.trip.days.find(x=>x.date===date); const isTrip=!!tripDay;
      cells+=`<div class="month-day ${isTrip?'is-trip-day':''}"><b>${d}</b>${tripDay?tripDay.items.filter(i=>i.state!=='removed').map(i=>`<div class="month-event">${icon(visitFor(i.placeId)?'calendar.visited':'calendar.planned','',{size:13})}${esc(i.startsAt)} ${esc(placeById(i.placeId)?.name||'')}</div>`).join(''):''}</div>`;
    }
    const monthTitle=new Intl.DateTimeFormat('pt-BR',{month:'long',year:'numeric'}).format(anchor);
    return `<h2 class="calendar-month-title">${esc(monthTitle.charAt(0).toUpperCase()+monthTitle.slice(1))}</h2><div class="calendar-month">${weekdays.map(w=>`<strong>${w}</strong>`).join('')}${cells}</div>`;
  }

  function stampHtml(v){
    const p=placeById(v.placeId); const date=(v.occurredAt||'').slice(0,10);
    return `<div class="stamp"><span>${icon('qr.visited','',{size:20})}<br>VISITA DEMO<br><strong>${esc(p?.name||v.placeId)}</strong><br>${esc(date?fmtCapsDate(date):'DATA NÃO INFORMADA')}</span></div>`;
  }
  const passportPages = () => {
    const visits=state.trip.visits; const planned=state.trip.days.flatMap(d=>d.items.filter(i=>i.state!=='removed')); const categories=[...new Set(visits.flatMap(v=>placeById(v.placeId)?.categoryIds||[]))];
    const dates=tripDates(state.trip); const year=dates[0]?new Date(`${dates[0]}T12:00:00`).getFullYear():new Date().getFullYear();
    const archiveLabel=dates[0]?new Intl.DateTimeFormat('pt-BR',{month:'long',year:'numeric'}).format(new Date(`${dates[0]}T12:00:00`)):'período atual';
    const bodies={
      cover:`<div class="stamp"><span>${icon('nav.passport','',{size:24})}<br>PASSAPORTE<br><strong>SERRA NEGRA</strong><br>DEMO ${year}</span></div><p>Um registro da viagem vivida, separado do que foi apenas planejado.</p>`,
      identity:`${factList([{iconKey:'nav.account',label:'Perfil',value:state.trip.trip.party||'Casal'},{iconKey:'nav.calendar',label:'Período',value:tripPeriodLabel(state.trip)},{iconKey:'profile.paceBalanced',label:'Ritmo',value:state.trip.trip.pace||'Equilibrado'},{iconKey:'profile.car',label:'Transporte',value:state.trip.trip.transport||'Carro'}])}`,
      ticket:`<div class="ticket">${icon('passport.ticket','',{size:22})}<strong>Serra Negra · SP</strong><p>${esc(tripPeriodCaps(state.trip))}</p><p>${planned.length} paradas planejadas · ${visits.length} presenças registradas</p></div>`,
      stamps:visits.slice(0,6).map(v=>stampHtml(v)).join('')||'<p>Nenhuma visita registrada.</p>',
      discoveries:visits.filter(v=>v.outsidePlannedRoute).map(v=>`<div class="ticket">${icon('nav.explore','',{size:20})}<strong>${esc(placeById(v.placeId)?.name||v.placeId)}</strong><p>Descoberta registrada fora da rota planejada.</p></div>`).join('')||'<p>Nenhuma descoberta fora do roteiro.</p>',
      categories:`<div class="chips">${categories.map(c=>`<span class="badge status-with-icon">${icon(categoryIconById(c),'',{size:14})}${esc(categoryName(c))}</span>`).join('')}</div><p>Estas categorias são derivadas das visitas registradas, não das intenções de viagem.</p>`,
      path:`${visits.map(v=>`<p class="icon-label">${icon('nav.route','',{size:16})}<strong>${new Date(v.occurredAt).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</strong> · ${esc(placeById(v.placeId)?.name||v.placeId)}</p>`).join('')||'<p>Nenhuma visita registrada.</p>'}`,
      archive:`<div class="ticket">${icon('passport.history','',{size:22})}<strong>Serra Negra · ${esc(archiveLabel)}</strong><p>${visits.length} registros · ${planned.length} planejamentos ativos</p></div>`,
      summary:`<h3>${planned.length} planejado(s)</h3><p>Itens que continuam no roteiro.</p><h3>${visits.length} registrado(s)</h3><p>Presenças explicitamente gravadas no Passaporte.</p><button data-action="share-passport">${icon('passport.shareTicket','',{size:18})}Compartilhar resumo demo</button>`
    };
    return CONFIG.passport.chapters.map(ch=>({...ch,body:bodies[ch.id]||''}));
  };
  function renderPassport(){
    const pages=passportPages(); ui.passportPage=Math.max(0,Math.min(ui.passportPage,pages.length-1)); const a=pages[ui.passportPage],b=pages[ui.passportPage+1];
    app.innerHTML = `${pageTitle('Meu Passaporte','Memória digital da viagem','Planejamento e presença continuam visualmente separados nesta versão.')}<div class="book-wrap"><nav class="book-index" aria-label="Capítulos">${pages.map((p,i)=>`<button class="${ui.passportPage===i?'primary':''}" data-passport-page="${i}">${icon(p.iconKey,'',{size:16})}<span>${i+1}. ${esc(p.title)}</span></button>`).join('')}</nav><div><div class="book"><article class="book-page active"><p class="eyebrow icon-label">${icon(a.iconKey,'',{size:16})}${esc(a.eyebrow)}</p><h2>${esc(a.title)}</h2>${a.body}<span class="page-number">${ui.passportPage+1}</span></article>${b?`<article class="book-page"><p class="eyebrow icon-label">${icon(b.iconKey,'',{size:16})}${esc(b.eyebrow)}</p><h2>${esc(b.title)}</h2>${b.body}<span class="page-number">${ui.passportPage+2}</span></article>`:''}</div><div class="trip-toolbar"><button data-action="passport-prev" ${ui.passportPage===0?'disabled':''}>${icon('nav.chevronLeft','',{size:17})}Página anterior</button><button data-action="passport-next" ${ui.passportPage>=pages.length-1?'disabled':''}>Próxima página${icon('nav.chevronRight','',{size:17})}</button></div><section class="panel"><h3 class="icon-label">${icon('qr.code','',{size:20})}Registrar presença fictícia</h3><p class="muted">Este controle existe apenas para validar a diferença entre planejamento e presença registrada.</p><div class="actions"><select id="passport-place"><option value="">Escolha um lugar</option>${discoverablePlaces().filter(p=>!visitFor(p.id)).map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('')}</select><button data-action="passport-register">${icon('qr.visited','',{size:18})}Registrar visita demo</button></div></section></div></div>`;
  }

  const ADMIN_MODULES = CONFIG.admin.modules;
  const adminKinds = Object.fromEntries(ADMIN_MODULES.map(module=>[module.key,module.label]));
  const adminModule = kind => ADMIN_MODULES.find(module=>module.key===kind) || {key:kind,label:kind,iconKey:'admin.cms'};
  const adminSchema = kind => CONFIG.admin.schemas?.[kind] || [];
  function adminLabel(kind,item){if(kind==='places'||kind==='experiences'||kind==='events'||kind==='categories')return item.name; if(kind==='sources')return item.sourceName; if(kind==='partners')return placeById(item.placeId)?.name||item.id; return item.id}
  function readPath(obj,path){return String(path||'').split('.').filter(Boolean).reduce((value,key)=>value?.[key],obj)}
  function renderAdminField(field,current){
    const raw=readPath(current,field.path||field.name); const value=raw??''; const id=`admin-${field.name}`;
    if(field.type==='textarea') return `<label class="field" for="${id}">${esc(field.label)}<textarea id="${id}" name="${field.name}">${esc(value)}</textarea></label>`;
    if(field.type==='select'){
      const options=(field.options||CONFIG.admin.statusOptions).map(option=>Array.isArray(option)?option:[option,option]);
      return `<label class="field" for="${id}">${esc(field.label)}<select id="${id}" name="${field.name}" data-coerce="${esc(field.coerce||'')}">${options.map(([v,l])=>`<option value="${esc(v)}" ${String(value)===String(v)?'selected':''}>${esc(l)}</option>`).join('')}</select></label>`;
    }
    return `<label class="field" for="${id}">${esc(field.label)}<input id="${id}" type="${esc(field.type||'text')}" name="${field.name}" value="${esc(value)}"></label>`;
  }
  function renderAdmin(){
    const kind=ui.adminKind, list=mergedCollection(kind); if(ui.adminEdit&&!list.find(x=>x.id===ui.adminEdit))ui.adminEdit=null;
    app.innerHTML = `${pageTitle('Admin de demonstração','Controle operacional local','Edite, salve rascunho, visualize e publique no navegador. Nada é enviado a um servidor.')}<div class="security-demo-note"><strong>Segurança desta build:</strong> esta área é somente uma simulação local e não possui autenticação real. Em produção, acesso administrativo exige RBAC validado tanto na interface quanto no backend; ocultar elementos no navegador não é autorização.</div><div class="admin-layout"><nav class="admin-nav" aria-label="Tipos de conteúdo">${ADMIN_MODULES.map(module=>`<button class="${module.key===kind?'active':''}" data-admin-kind="${module.key}">${icon(module.iconKey,'',{size:17})}<span>${esc(module.label)}</span><span class="badge">${mergedCollection(module.key).length}</span></button>`).join('')}</nav><section>${ui.adminEdit?renderAdminEditor(kind,list.find(x=>x.id===ui.adminEdit)):renderAdminList(kind,list)}</section></div>`;
  }
  function renderAdminList(kind,list){
    const module=adminModule(kind);
    return `<div class="panel"><div class="section-head"><div><p class="eyebrow icon-label">${icon(module.iconKey,'',{size:16})}${esc(module.label)}</p><h2>Conteúdo</h2></div>${kind==='places'?`<button data-action="admin-create">${icon('route.add','',{size:17})}Criar lugar demo</button>`:''}</div><div class="admin-list">${list.map(item=>{const status=item.status||'active'; return `<div class="admin-row"><div><strong>${esc(adminLabel(kind,item))}</strong><div class="actions">${statusBadge(status)}${state.drafts[kind]?.[item.id]?statusBadge('draft'):''}</div></div><button data-admin-edit="${item.id}">${icon('route.edit','',{size:16})}Editar</button></div>`}).join('')}</div></div><section class="section"><h2 class="icon-label">${icon('admin.audit','',{size:20})}Histórico desta sessão</h2><div class="audit">${state.audit.slice(0,8).map(a=>`<div class="audit-item"><strong>${esc(a.action)}</strong><div>${esc(a.label)}</div><span class="muted">${new Date(a.at).toLocaleString('pt-BR')}</span></div>`).join('')}</div></section>`;
  }
  function renderAdminEditor(kind,item){
    if(!item)return ''; const draft=state.drafts[kind]?.[item.id]||{}; const current={...item,...draft}; const label=adminLabel(kind,current); const fields=adminSchema(kind); const hasStatus=current.status!==undefined;
    return `<button data-action="admin-back">${icon('nav.back','',{size:17})}Voltar à lista</button><div class="admin-editor" style="margin-top:1rem"><form class="panel" id="admin-form" data-kind="${kind}" data-id="${item.id}"><p class="eyebrow icon-label">${icon('admin.cms','',{size:16})}Editor local</p><h2>${esc(label)}</h2>${fields.map(field=>renderAdminField(field,current)).join('')}<div class="actions"><button type="button" data-action="admin-save-draft">${icon('admin.draft','',{size:17})}Salvar rascunho</button><button type="button" data-action="admin-preview">${icon('share.visibility','',{size:17})}Preview</button><button type="button" class="primary" data-action="admin-publish">${icon('admin.publish','',{size:17})}Publicar localmente</button>${hasStatus?`<button type="button" class="danger" data-action="admin-archive">${icon('admin.archive','',{size:17})}Arquivar</button>`:''}</div></form><aside class="sidebar"><div class="panel"><h3 class="icon-label">${icon('place.info','',{size:18})}Somente leitura</h3><p><strong>ID:</strong> ${esc(item.id)}</p><p><strong>Fonte:</strong> seed sintético + alterações locais</p></div><div class="panel"><h3 class="icon-label">${icon('share.visibility','',{size:18})}Preview</h3>${ui.adminPreview===item.id?adminPreviewCard(kind,current):'<p class="muted">Clique em Preview para conferir o rascunho antes de publicar.</p>'}</div><div class="panel"><h3>Regra da demo</h3><p class="muted">Rascunho não altera a página pública. Publicar grava a alteração em localStorage e ela passa a aparecer na navegação.</p></div></aside></div>`;
  }
  function adminPreviewCard(kind,item){
    if(kind==='places')return `<strong>${esc(item.name)}</strong><p>${esc(item.shortDescription||'')}</p><span class="badge">${esc(item.status||'')}</span>`;
    return `<strong>${esc(adminLabel(kind,item))}</strong><p class="muted">Preview simplificado desta entidade.</p>`;
  }
  function adminFormData(){
    const f=$('#admin-form'); if(!f)return null; const fd=new FormData(f), out={};
    for(const [k,v] of fd){const field=adminSchema(f.dataset.kind).find(x=>x.name===k);out[k]=field?.coerce==='boolean'?v==='true':v;}
    if(out.openingHours!==undefined) out.openingHours={type:'demo',text:out.openingHours};
    return {kind:f.dataset.kind,id:f.dataset.id,out};
  }
  function adminSaveDraft(preview=false){const x=adminFormData();if(!x)return;state.drafts[x.kind][x.id]={...x.out};state.audit.unshift({at:new Date().toISOString(),action:'draft_saved',label:adminLabel(x.kind,{...mergedCollection(x.kind).find(i=>i.id===x.id),...x.out})});save();ui.adminPreview=preview?x.id:ui.adminPreview;toast(preview?'Rascunho salvo e aberto em preview.':'Rascunho salvo. A página pública não mudou.');renderAdmin()}
  function adminPublish(){const x=adminFormData();if(!x)return;state.adminOverrides[x.kind][x.id]={...(state.adminOverrides[x.kind][x.id]||{}),...x.out};delete state.drafts[x.kind][x.id];state.audit.unshift({at:new Date().toISOString(),action:'published',label:adminLabel(x.kind,{...mergedCollection(x.kind).find(i=>i.id===x.id),...x.out})});save();toast('Alteração publicada localmente. A página pública já usa esta versão.');renderAdmin()}
  function adminArchive(){const x=adminFormData();if(!x)return;state.adminOverrides[x.kind][x.id]={...(state.adminOverrides[x.kind][x.id]||{}),status:'archived'};delete state.drafts[x.kind][x.id];state.audit.unshift({at:new Date().toISOString(),action:'archived',label:adminLabel(x.kind,mergedCollection(x.kind).find(i=>i.id===x.id))});save();ui.adminEdit=null;toast('Item arquivado na demonstração.');renderAdmin()}
  function adminCreatePlace(){const now=Date.now(),id=`place-local-${now}`,template=clone(CONFIG.admin.createTemplates?.places||{});state.adminCreated.places.push({...template,id,slug:`novo-lugar-${now}`,name:'Novo lugar demo'});save();ui.adminEdit=id;renderAdmin();toast('Novo lugar demo criado como rascunho.')}


  function legalShell(title,eyebrow,lead,body){
    app.innerHTML=`<article class="legal-page">${breadcrumbs([{label:'Início',href:'#/'},{label:title}])}${pageTitle(title,eyebrow,lead)}${body}</article>`;
  }
  function renderLegalPage(key){
    const def=CONFIG.legal[key]; if(!def){renderNotFound();return;}
    const body=def.sections.map(([title,text,action])=>`<section><h2>${esc(title)}</h2><p>${esc(text)}</p>${action==='clear-local-data'?`<button data-action="clear-local-data">${icon('admin.archive','',{size:17})}Apagar dados locais da demonstração</button>`:''}</section>`).join('');
    legalShell(def.title,def.eyebrow,def.lead,body);
  }
  const renderPrivacy=()=>renderLegalPage('privacidade');
  const renderTerms=()=>renderLegalPage('termos');
  const renderCookies=()=>renderLegalPage('cookies');
  const renderAccessibility=()=>renderLegalPage('acessibilidade');

  function renderNotFound(){app.innerHTML=`${breadcrumbs([{label:'Início',href:'#/'},{label:'Página não encontrada'}])}${pageTitle('Página não encontrada','Demonstração','A rota solicitada não existe nesta versão.')}<form class="not-found-search" id="not-found-search" role="search"><label class="field" for="not-found-q">Pesquisar no Passaporte</label><div class="search-inline">${icon('nav.search','',{size:19})}<input id="not-found-q" type="search" placeholder="Café, natureza, cultura…"><button class="primary" type="submit">${icon('nav.explore','',{size:17})}Explorar</button></div></form><div class="not-found-actions"><a class="button primary" href="#/">${icon('nav.home','',{size:17})}Voltar ao início</a><a class="button" href="#/explorar">${icon('nav.explore','',{size:17})}Explorar lugares</a><a class="button" href="#/roteiro">${icon('route.add','',{size:17})}Montar roteiro</a></div>`}


  const ROUTES = [
    {match:p=>p.length===0, meta:'home', run:()=>renderHome()},
    {match:p=>p[0]==='explorar', meta:'explorar', run:()=>renderExplore()},
    {match:p=>p[0]==='lugares'&&p[1], meta:'explorar', run:p=>{const place=placeBySlug(p[1]);setPageMeta('explorar',place?`${place.name} · Passaporte Serra Negra`:'Lugar · Passaporte Serra Negra',place?.shortDescription||'Página de lugar na demonstração.');renderPlace(p[1],false)}, customMeta:true},
    {match:p=>p[0]==='parceiros'&&p.length===1, meta:'parceiros', run:()=>renderPartnerAcquisition()},
    {match:p=>p[0]==='parceiros'&&p[1], meta:'explorar', run:p=>{const place=placeBySlug(p[1]);setPageMeta('explorar',place?`${place.name} · Passaporte Serra Negra`:'Parceiro · Passaporte Serra Negra',place?.shortDescription||'Página de parceiro na demonstração.');renderPlace(p[1],true)}, customMeta:true},
    {match:p=>p[0]==='roteiro'&&p.length===1, meta:'roteiro', run:()=>renderOnboarding()},
    {match:p=>p[0]==='viagens'&&p[2]==='roteiro', meta:'viagens', run:()=>{setPageMeta('viagens','Roteiro da viagem · Passaporte Serra Negra');renderRoute()}, customMeta:true},
    {match:p=>p[0]==='viagens'&&p[2]==='calendario', meta:'viagens', run:()=>{setPageMeta('viagens','Calendário da viagem · Passaporte Serra Negra');renderCalendar()}, customMeta:true},
    {match:p=>p[0]==='meu-passaporte', meta:'meu-passaporte', run:()=>renderPassport()},
    {match:p=>p[0]==='admin', meta:'admin', run:()=>renderAdmin()},
    {match:p=>p[0]==='para-parceiros', redirect:'#/parceiros'},
    {match:p=>p[0]==='privacidade', meta:'privacidade', run:()=>renderPrivacy()},
    {match:p=>p[0]==='termos', meta:'termos', run:()=>renderTerms()},
    {match:p=>p[0]==='cookies', meta:'cookies', run:()=>renderCookies()},
    {match:p=>p[0]==='acessibilidade', meta:'acessibilidade', run:()=>renderAccessibility()}
  ];
  function render(){
    window.scrollTo(0,0); const hash=(location.hash||'#/').slice(1).split('?')[0]; const parts=hash.split('/').filter(Boolean);
    const page=parts[0]||'home'; document.body.dataset.page=page; updateNavCurrent(page);
    const route=ROUTES.find(candidate=>candidate.match(parts));
    if(route?.redirect){location.replace(route.redirect);return;}
    if(route){if(!route.customMeta)setPageMeta(route.meta);route.run(parts);}
    else {setPageMeta('home','Página não encontrada · Passaporte Serra Negra','A rota solicitada não existe nesta demonstração.');renderNotFound();}
    app.focus({preventScroll:true});
  }

  let routeTransitionSequence=0;
  let previousRouteHash=location.hash||'#/';
  let pendingRouteDirection=null;
  const reducedMotion=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const routeParts=(hash)=>String(hash||'#/').replace(/^#/,'').split('?')[0].split('/').filter(Boolean);
  function inferRouteDirection(fromHash,toHash){
    const from=routeParts(fromHash), to=routeParts(toHash);
    if(to.length<from.length) return -1;
    if(to.length>from.length) return 1;
    if((to[0]||'')==='' && (from[0]||'')!=='') return -1;
    return 1;
  }
  function closeMobileNavigation(){
    const nav=$('#main-nav');
    nav?.classList.remove('open');
    document.body.classList.remove('menu-open');
    const menu=$('.mobile-menu');
    menu?.setAttribute('aria-expanded','false');
    if(menu) menu.innerHTML=`${icon('nav.menu','',{size:20})}<span>Menu</span>`;
  }
  function renderWithRouteTransition(direction=1){
    closeMobileNavigation();
    const sequence=++routeTransitionSequence;
    const root=document.documentElement;
    const dir=direction<0?'back':'forward';
    root.dataset.routeSlide=dir;

    if(reducedMotion()){
      render();
      delete root.dataset.routeSlide;
      return;
    }

    /* View Transitions captures the whole viewport, so header, content and
       footer move as one opaque screen instead of fading independently. */
    if(typeof document.startViewTransition==='function'){
      const transition=document.startViewTransition(()=>{
        if(sequence===routeTransitionSequence) render();
      });
      transition.finished.finally(()=>{
        if(sequence===routeTransitionSequence) delete root.dataset.routeSlide;
      });
      return;
    }

    /* Fallback for browsers without View Transitions: horizontal movement
       only, with no opacity animation. */
    if(typeof app.animate!=='function'){
      render();
      delete root.dataset.routeSlide;
      return;
    }
    app.classList.add('is-route-transitioning');
    const sign=direction<0?-1:1;
    for(const animation of app.getAnimations()) animation.cancel();
    app.animate(
      [{transform:'translateX(0)'},{transform:`translateX(${-sign*100}vw)`}],
      {duration:260,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'}
    ).finished.catch(()=>{}).then(()=>{
      if(sequence!==routeTransitionSequence) return;
      render();
      for(const animation of app.getAnimations()) animation.cancel();
      return app.animate(
        [{transform:`translateX(${sign*100}vw)`},{transform:'translateX(0)'}],
        {duration:320,easing:'cubic-bezier(.4,0,.2,1)',fill:'both'}
      ).finished.catch(()=>{});
    }).finally(()=>{
      if(sequence===routeTransitionSequence){
        app.classList.remove('is-route-transitioning');
        delete root.dataset.routeSlide;
      }
    });
  }

  document.addEventListener('click',e=>{
    const link=e.target.closest?.('a[href^="#/"]');
    if(!link) return;
    pendingRouteDirection=inferRouteDirection(previousRouteHash,link.getAttribute('href'));
  },{capture:true});


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
    if(a==='toggle-menu'){const nav=$('#main-nav');const open=nav.classList.toggle('open');t.setAttribute('aria-expanded',String(open));t.innerHTML=`${icon(open?'nav.close':'nav.menu','',{size:20})}<span>${open?'Fechar':'Menu'}</span>`;document.body.classList.toggle('menu-open',open);return}
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
    if(a==='clear-local-data'){if(confirm('Apagar estado e preferências locais desta demonstração?')){localStorage.removeItem(STORE);localStorage.removeItem(THEME_STORE);state=defaultState();document.documentElement.dataset.theme='system';themeSelect.value='system';syncThemeMeta('system');window.PSN_SHELL?.syncThemeIcon?.('system');toast('Dados locais apagados.');if(location.hash==='#/'||!location.hash)render();else location.hash='#/'}return}
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

  window.addEventListener('hashchange',()=>{const next=location.hash||'#/';const direction=pendingRouteDirection??inferRouteDirection(previousRouteHash,next);pendingRouteDirection=null;previousRouteHash=next;renderWithRouteTransition(direction);});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){const nav=$('#main-nav');if(nav?.classList.contains('open')){nav.classList.remove('open');document.body.classList.remove('menu-open');const menu=$('.mobile-menu');menu?.setAttribute('aria-expanded','false');if(menu)menu.innerHTML=`${icon('nav.menu','',{size:20})}<span>Menu</span>`;menu?.focus();}}});
  const themeSelect=$('#theme-select');
  const themeMeta=document.querySelector('meta[name="theme-color"]');
  const resolveTheme=(theme)=>theme==='dark'||(theme==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light';
  const applyTheme=(theme,{persist=false}={})=>{
    const resolved=resolveTheme(theme);
    document.documentElement.dataset.theme=theme;
    document.documentElement.dataset.resolvedTheme=resolved;
    if(themeMeta)themeMeta.setAttribute('content',resolved==='dark'?'#161618':'#E8E8E0');
    if(themeSelect)themeSelect.value=theme;
    if(persist)localStorage.setItem(THEME_STORE,theme);
    window.PSN_SHELL?.syncThemeIcon?.(theme);
  };
  const syncThemeMeta=(theme)=>applyTheme(theme);
  const savedTheme=localStorage.getItem(THEME_STORE)||'system'; applyTheme(savedTheme);
  themeSelect.addEventListener('change',()=>applyTheme(themeSelect.value,{persist:true}));
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',()=>{if(themeSelect.value==='system')applyTheme('system')});

  render();
})();
