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
  const relationLabel = v => fromMap(CONFIG.labels.relation,v,'Ponto turístico');
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
    const fallback=PAGE_META[key]||['Página · Passaporte Serra Negra','Explore Serra Negra pelo Passaporte Serra Negra.'];
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
    const hash=location.hash||'#/' ;
    const qs=parseQueryFromHash?.()||new URLSearchParams();
    let href=CONFIG.navigation.pageMap[page];
    if(page==='explorar'){
      if(qs.get('view')==='map') href='#/explorar?view=map';
      else if(qs.get('relation')==='public_point') href='#/explorar?relation=public_point';
      else href='#/explorar';
    }
    if(href){const link=$(`#main-nav a[href="${href}"]`); link?.setAttribute('aria-current','page');}
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
    explore:{q:'',category:'',relation:'',environment:'',cost:'',view:'list',previewPlace:null},
    onboarding:{step:0,answers:{dates:tripPeriodLabel(DATA.trip),party:'Casal',interests:['cat-natureza','cat-gastronomia','cat-cultura'],intent:'Conhecer e descobrir',pace:'Equilibrado',transport:'Carro',needs:'Nenhuma necessidade específica'}},
    activeDay: state.trip.days[0].date,
    calendarMode:'day',
    passportPage:0,
    adminKind:'places',
    adminEdit:null,
    adminPreview:null,
    homeSpotIndex:0,
    homeSpotSelection:[],
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

  const isPersonalizedTrip = () => state.trip?.trip?.personalized === true;
  const tripInterests = () => state.trip?.trip?.interests || [];
  function rankPlacesForTrip(places){
    const interests=tripInterests();
    if(!isPersonalizedTrip()||!interests.length) return [...places];
    return [...places].sort((a,b)=>{
      const as=(a.categoryIds||[]).filter(id=>interests.includes(id)).length;
      const bs=(b.categoryIds||[]).filter(id=>interests.includes(id)).length;
      return bs-as;
    });
  }
  const rad = deg => deg * Math.PI / 180;
  function distanceKm(a,b){
    const lat1=Number(a?.location?.lat),lng1=Number(a?.location?.lng),lat2=Number(b?.location?.lat),lng2=Number(b?.location?.lng);
    if(![lat1,lng1,lat2,lng2].every(Number.isFinite)) return null;
    const dLat=rad(lat2-lat1),dLng=rad(lng2-lng1);
    const h=Math.sin(dLat/2)**2+Math.cos(rad(lat1))*Math.cos(rad(lat2))*Math.sin(dLng/2)**2;
    return 6371*2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h));
  }
  function nearbyPlaces(place,count=3){
    return discoverablePlaces().filter(x=>x.id!==place.id).map(x=>({place:x,distance:distanceKm(place,x)})).sort((a,b)=>{
      if(a.distance==null&&b.distance==null)return 0;if(a.distance==null)return 1;if(b.distance==null)return -1;return a.distance-b.distance;
    }).slice(0,count);
  }
  function routeInsight(day){
    const items=(day?.items||[]).filter(i=>i.state!=='removed');
    if(!items.length)return 'Seu dia está livre. Adicione uma primeira parada e o restante do horário será organizado a partir dela.';
    const places=items.map(i=>placeById(i.placeId)).filter(Boolean);
    let total=0,legs=0;
    for(let i=1;i<places.length;i++){const d=distanceKm(places[i-1],places[i]);if(d!=null){total+=d;legs++;}}
    const last=items.at(-1); const next=nextAvailableStart(day);
    if(legs)return `${items.length} paradas · cerca de ${total.toFixed(1).replace('.',',')} km entre a sequência atual · próximo espaço sugerido às ${next}.`;
    return `${items.length} paradas planejadas · próximo espaço sugerido às ${next}.`;
  }

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
  const transitionNameForPlace = id => `explore-${String(id||'place').replace(/[^a-zA-Z0-9_-]/g,'-')}`;
  function scenicMedia(place,variant='card'){
    const cls=(place?.imagePlaceholder||'landscape-01').replace(/[^a-z0-9-]/gi,'');
    const relation=place?.commercialRelation==='partner'?'Parceiro':(place?.research?.verified?'Ponto turístico':'Lugar sugerido');
    const title=place?.name||'Serra Negra';
    const asset=place?.imageAsset;
    const stockStyle=asset?.src ? ` style="--stock-position:${esc(asset.position||'center')}"` : '';
    const source=asset?.provider ? `${asset.provider} · ${asset.notActualPlace?'foto ilustrativa':'foto temporária'}` : 'mídia ilustrativa';
    const label=asset?.alt || `Imagem de referência de ${title}`;
    const fallback=asset?.fallbackSrc || 'assets/placeholders/card.svg';
    const photo=asset?.src ? `<img class="scenic-photo" src="${esc(asset.src)}" alt="" loading="lazy" decoding="async" onload="this.classList.add('is-loaded')" onerror="this.onerror=null;this.src='${esc(fallback)}';this.classList.add('is-loaded')">` : '';
    return `<div class="scenic-media scenic-${variant} media-${cls}${asset?.src?' has-stock-photo':''}" data-place-media="${esc(place?.id||'')}" role="img" aria-label="${esc(label)}"${stockStyle}>
      ${photo}<span class="scenic-ridge ridge-a"></span><span class="scenic-ridge ridge-b"></span><span class="scenic-sun"></span>
      <span class="scenic-grain"></span><span class="scenic-caption">${esc(relation)} · ${esc(source)}</span>
    </div>`;
  }
  function cardMedia(place){
    return scenicMedia(place,'card');
  }
  function placeCard(place,variant='default',options={}){
    const href = place.commercialRelation==='partner' ? `#/parceiros/${place.slug}` : `#/lugares/${place.slug}`;
    const cats=(place.categoryIds||[]).slice(0,2).map(categoryName).join(' · ');
    const vt=options.transitionName?` style="view-transition-name:${transitionNameForPlace(place.id)}"`:'';
    const distance=options.fromPlace?distanceKm(options.fromPlace,place):null;
    return `<article class="place-card ${variant==='editorial'?'place-card-editorial':''}" data-map-place="${esc(place.id)}" data-shared-place="${esc(place.id)}"${vt}>
      <a class="place-card-media" href="${href}" aria-label="Abrir ${esc(place.name)}">${cardMedia(place)}</a>
      <div class="place-card-body">
        <div class="place-card-meta"><span>${esc(cats||relationLabel(place.commercialRelation))}</span><span>${distance!=null?`${distance.toFixed(1).replace('.',',')} km`: `${esc(place.durationMinutes)} min`}</span></div>
        <h3><a href="${href}">${esc(place.name)}</a></h3>
        <p>${esc(place.shortDescription)}</p>
        <div class="place-card-foot"><div>${statusBadges(place)}</div><span class="place-card-arrow" aria-hidden="true"><span class="place-card-action-label">Explorar</span>${icon('avancar')}</span></div>
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
  function mockMap(places,options={}){
    const list=places.slice(0,8);
    const positions=mapPositions(list);
    const pts=list.map((p,i)=>{
      const {x,y}=positions[i]; const key=p?.commercialRelation==='partner'?'nav.partners':'map.place';
      const href=p?.commercialRelation==='partner'?`#/parceiros/${p.slug}`:`#/lugares/${p.slug}`;
      const vt=options.transitionNames?` style="left:${x.toFixed(2)}%;top:${y.toFixed(2)}%;view-transition-name:${transitionNameForPlace(p.id)}"`:` style="left:${x.toFixed(2)}%;top:${y.toFixed(2)}%"`;
      const pin=options.preview?`<button type="button" class="map-dot-icon premium-map-pin ${options.activeId===p.id?'is-selected':''}" data-map-preview="${esc(p.id)}" data-map-place="${esc(p.id)}"${vt} aria-label="Pré-visualizar ${esc(p.name)}">${icon(key,'',{size:17})}</button>`:`<a href="${href}" class="map-dot-icon premium-map-pin" data-map-place="${esc(p.id)}" data-shared-place="${esc(p.id)}"${vt} aria-label="Abrir ${esc(p.name)}">${icon(key,'',{size:17})}</a>`;
      return `${pin}<span class="map-label" data-map-place="${esc(p.id)}" style="left:${x.toFixed(2)}%;top:${y.toFixed(2)}%">${esc(p.name)}</span>`;
    }).join('');
    return `<div class="mock-map premium-map" role="region" aria-label="Mapa de exploração com os pontos disponíveis">${pts}</div>`;
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
  const warpMarkup=(text,{emphasis=false}={})=>{
    const chars=[...String(text)];
    const inner=chars.map((char,index)=>char===' '
      ? '<span class="warp-space" aria-hidden="true">&nbsp;</span>'
      : `<span class="warp-char" aria-hidden="true" data-warp-char="${index}">${esc(char)}</span>`).join('');
    return `<span class="warp-line${emphasis?' warp-line-emphasis':''}" aria-hidden="true">${inner}</span>`;
  };
  function homeHeroSection(){
    const personalized=isPersonalizedTrip();
    const trip=state.trip.trip||{};
    const titleText=personalized?'Sua Serra Negra, no seu ritmo.':'Serra Negra, no seu ritmo.';
    const title=personalized?`${warpMarkup('Sua Serra Negra,')}<br>${warpMarkup('no seu ritmo.',{emphasis:true})}`:`${warpMarkup('Serra Negra,')}<br>${warpMarkup('no seu ritmo.',{emphasis:true})}`;
    const lead=personalized?`Um roteiro para ${esc(String(trip.party||'você').toLocaleLowerCase('pt-BR'))}, ritmo ${esc(String(trip.pace||'equilibrado').toLocaleLowerCase('pt-BR'))}, organizado para continuar flexível.`:'Descubra possibilidades, monte uma viagem flexível e transforme os lugares vividos em memória.';
    const personalizedStrip=personalized?`<div class="home-personal-strip" aria-label="Resumo personalizado da viagem">${icon('nav.route','',{size:18})}<span><small>Sua viagem</small><strong>${esc(tripPeriodLabel(state.trip))}</strong></span><span><small>Perfil</small><strong>${esc(trip.party||'Viajante')}</strong></span><span><small>Ritmo</small><strong>${esc(trip.pace||'Equilibrado')}</strong></span><a href="#/viagens/demo-trip-001/roteiro">Continuar roteiro ${icon('nav.forward','',{size:15})}</a></div>`:'';
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
      </div>
      <div class="psd-container home-hero-content">
        <p class="psd-kicker">Descubra Serra Negra do seu jeito</p>
        <h1 id="home-title" class="warp-title" data-warp-title aria-label="${esc(titleText)}">${title}</h1>
        <p class="home-hero-lead">${lead}</p>
        <form class="home-search" id="home-search-form" role="search">
          <label for="home-search">O que você quer encontrar?</label>
          <div class="home-search-row">${icon('busca')}<input id="home-search" name="q" type="search" autocomplete="off" placeholder="Lugar, experiência, café, natureza…"><button class="primary" type="submit">Explorar</button></div>
        </form>
        <div class="home-quick-search" aria-label="Sugestões rápidas">${CONFIG.home.quickSearch.map(x=>`<button data-action="home-search-suggestion" data-query="${esc(x)}">${esc(x)}</button>`).join('')}</div>
        ${personalizedStrip}
        <p class="home-scroll-note"><span aria-hidden="true"></span>Role para descobrir a cidade por caminhos, não por rankings.</p>
      </div>
    </section>`;
  }
  function homeTouristSpotsSection(){
    const spots=rankPlacesForTrip(researchedTouristPlaces());
    if(!spots.length)return '';
    if(ui.homeSpotSelection.length!==Math.min(3,spots.length)||ui.homeSpotSelection.some(id=>!spots.some(p=>p.id===id))){
      const shuffled=[...spots];
      for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];}
      ui.homeSpotSelection=shuffled.slice(0,3).map(p=>p.id);
    }
    const selected=ui.homeSpotSelection.map(placeById).filter(Boolean).slice(0,3);
    const backdrop=selected[0]||spots[0];
    return `<section class="home-section home-spots" data-psd-layer="02" aria-labelledby="spots-title">
      <div class="spots-backdrop">${scenicMedia(backdrop,'spots-backdrop')}</div>
      <div class="psd-container spots-random-layout">
        <header class="spots-random-heading">
          <p class="psd-kicker">Primeiros caminhos</p><h2 id="spots-title">Conheça Serra Negra</h2>
          <p>Comece por três caminhos e descubra outros pontos conforme sua curiosidade.</p>
          <a class="button light-button" href="#/explorar?relation=public_point">Conhecer todos os pontos ${icon('nav.forward','',{size:16})}</a>
        </header>
        <div class="spots-random-grid" role="list" aria-label="Três primeiros caminhos">
          ${selected.map((p,i)=>`<a role="listitem" class="spot-random-card" href="#/lugares/${p.slug}" data-shared-place="${esc(p.id)}">
            <div class="spot-random-media">${scenicMedia(p,'spot-card')}</div>
            <div class="spot-random-body"><small>0${i+1} · ${esc((p.categoryIds||[]).map(categoryName).join(' · '))}</small><h3>${esc(p.name)}</h3><p>${esc(p.shortDescription)}</p><span>${esc(p.durationMinutes)} min · ${p.costType==='free'?'sem custo':esc(costLabel(p.costType))}</span></div>
          </a>`).join('')}
        </div>
      </div>
    </section>`;
  }

  function homePartnerLoopSection(){
    const partners=rankPlacesForTrip(publicPlaces().filter(p=>p.commercialRelation==='partner')).slice(0,8); if(!partners.length)return '';
    const active=((ui.homePartnerIndex%partners.length)+partners.length)%partners.length;
    return `<section class="home-section home-partners encounter-section" data-psd-layer="03" aria-labelledby="partners-title"><div class="psd-container encounter-shell">
      <div class="partners-heading encounter-heading"><p class="psd-kicker">Encontros pelo caminho</p><h2 id="partners-title">Parceiros que entram na viagem</h2><p>Arraste para percorrer a seleção. Abra o card central para conhecer a experiência.</p></div>
      <div class="encounter-carousel-shell">
        <button class="carousel-arrow encounter-arrow encounter-arrow-prev" data-action="partner-prev" aria-label="Parceiro anterior">${icon('chevron-esquerda')}</button>
        <div class="encounter-carousel" data-encounter-carousel data-initial-index="${active}" aria-label="Parceiros pelo caminho. Arraste, role ou use as setas esquerda e direita.">
          ${partners.map((p,i)=>{const cats=(p.categoryIds||[]).map(categoryName).join(' · ');const href=`#/parceiros/${p.slug}`;return `<article class="encounter-card" data-encounter-card data-encounter-index="${i}" data-shared-place="${esc(p.id)}">
            <a class="encounter-card-link" href="${href}" aria-label="Conhecer ${esc(p.name)}">
              <div class="encounter-card-media">${scenicMedia(p,'encounter-card')}</div>
              <div class="encounter-card-body">
                <div class="encounter-card-kicker"><span>0${i+1}</span><span>${esc(cats||'Parceiro')}</span></div>
                <h3>${esc(p.name)}</h3>
                <p>${esc(p.shortDescription)}</p>
                <div class="encounter-card-meta"><span>${icon('place.duration','',{size:15})}${esc(p.durationMinutes)} min</span><span>${icon('place.location','',{size:15})}${esc((p.location?.display||'Serra Negra').replace(/,\s*SP$/i,''))}</span></div>
                <span class="encounter-card-cta">Conhecer experiência ${icon('avancar','',{size:16})}</span>
              </div>
            </a>
          </article>`}).join('')}
        </div>
        <button class="carousel-arrow encounter-arrow encounter-arrow-next" data-action="partner-next" aria-label="Próximo parceiro">${icon('chevron-direita')}</button>
      </div>
      <div class="encounter-footer" aria-hidden="true"><span data-encounter-counter>${String(active+1).padStart(2,'0')} / ${String(partners.length).padStart(2,'0')}</span><span class="encounter-line"></span><span>ARRASTE · ROLE · USE AS SETAS</span></div>
    </div></section>`;
  }
  function homeRouteVisualSection(){
    const day=state.trip.days[0]; const items=day.items.filter(i=>i.state!=='removed').slice(0,5);
    const point=(i,count)=>{const t=(i+1)/(count+1);return {x:5+90*t,y:76-48*Math.sin(Math.PI*t)+8*Math.sin(2*Math.PI*t)}};
    return `<section class="home-section home-route-visual" data-psd-layer="04" aria-labelledby="route-visual-title"><div class="route-visual-art" aria-hidden="true"><span class="route-desert-horizon"></span></div><div class="psd-container route-visual-layout"><div class="route-visual-copy"><p class="psd-kicker">A linha conecta a experiência</p><h2 id="route-visual-title">Um roteiro é uma sequência que pode mudar.</h2><p>Roteiro, calendário e Passaporte compartilham o mesmo contexto. Você pode ajustar uma parada sem perder as demais escolhas.</p><a class="button primary" href="#/viagens/demo-trip-001/roteiro">${icon('nav.route','',{size:18})}Abrir roteiro</a></div><div class="route-visual-map" aria-label="Sequência demonstrativa do primeiro dia"><svg viewBox="0 0 760 420" aria-hidden="true"><path d="M70 328 C168 260 180 106 310 138 S432 328 560 220 S618 72 700 84"/></svg>${items.map((i,n)=>{const p=placeById(i.placeId);const pos=point(n,items.length);return `<a href="${p?.commercialRelation==='partner'?'#/parceiros/':'#/lugares/'}${p?.slug||''}" class="route-visual-stop-position" data-shared-place="${esc(p?.id||'')}" style="left:${pos.x.toFixed(2)}%;top:${pos.y.toFixed(2)}%"><span class="route-visual-stop">${icon('map.place','',{size:16})}<span>0${n+1}</span><small>${esc(i.startsAt)}</small><strong>${esc(p?.name||i.placeId)}</strong></span></a>`}).join('')}</div></div></section>`;
  }
  function homeRouteTypesSection(){
    const activeIndex=Math.max(0,HOME_ROUTE_TYPES.findIndex(x=>x.id===ui.homeRouteType));
    return `<section class="home-section home-route-types" data-psd-layer="05" aria-labelledby="route-types-title"><div class="psd-container">
      <div class="route-types-tabs" role="tablist" aria-label="Tipos de roteiro">${HOME_ROUTE_TYPES.map((x,i)=>`<button role="tab" aria-selected="${i===activeIndex}" tabindex="${i===activeIndex?'0':'-1'}" data-route-type="${x.id}" class="${i===activeIndex?'active':''}"><span>0${i+1}</span>${esc(x.label)}</button>`).join('')}</div>
      <div class="route-types-slider" data-route-types-slider>
        ${HOME_ROUTE_TYPES.map((item,i)=>{const places=item.placeIds.map(placeById).filter(Boolean);return `<article class="route-types-slide ${i===activeIndex?'active':''}" data-route-slide="${item.id}" style="--route-slide-offset:${i-activeIndex};--route-slide-opacity:${i===activeIndex?1:0}" aria-hidden="${i!==activeIndex}" ${i===activeIndex?'':'inert'}>
          <div class="route-types-intro"><p class="psd-kicker">Tipos de roteiro</p><h2 ${i===activeIndex?'id="route-types-title"':''}>${esc(item.title)}</h2><p>${esc(item.body)}</p></div>
          <div class="route-types-poster">${scenicMedia(places[0]||{},'route-types-poster')}<span class="route-types-number">0${i+1}</span></div>
          <aside class="route-types-summary"><span class="route-summary-label">${esc(item.label)}</span><p>Uma forma de começar sem transformar a viagem em uma sequência rígida.</p><dl><div><dt>Paradas</dt><dd>3</dd></div><div><dt>Duração</dt><dd>1 dia</dd></div><div><dt>Estado</dt><dd>editável</dd></div></dl><a class="button primary" href="#/roteiro">Montar o meu</a></aside>
        </article>`}).join('')}
      </div>
    </div></section>`;
  }

  function homeRouteCardsSection(){
    const cards=HOME_ROUTE_TYPES.slice(0,3);
    return `<section class="home-section home-route-cards" data-psd-layer="06" aria-labelledby="route-cards-title"><div class="psd-container"><header class="route-cards-heading"><div><p class="psd-kicker">Escolha um ponto de partida</p><h2 id="route-cards-title">Roteiros para diferentes intenções</h2></div><a class="text-link" href="#/roteiro">Criar do zero ${icon('avancar')}</a></header><div class="route-cards-grid">${cards.map((r,i)=>{const p=placeById(r.placeIds[0]);return `<article class="route-reference-card"><div class="route-card-media">${scenicMedia(p,'route-card')}</div><div class="route-card-body"><span class="route-card-number">0${i+1}</span><small>${esc(r.label)}</small><h3>${esc(r.title)}</h3><div class="route-card-meta"><span>1 dia</span><span>3 lugares</span></div><button data-route-type="${r.id}" data-action="route-type-to-onboarding">Usar como inspiração</button></div></article>`}).join('')}</div></div></section>`;
  }
  function homeEditorialSection(){
    const event=mergedCollection('events').find(e=>e.status!=='archived'); const weather=state.trip.weather.slice(0,3);
    return `<section class="home-section home-editorial" data-psd-layer="07" aria-labelledby="editorial-title"><div class="psd-container"><div class="editorial-top"><div><p class="psd-kicker">Descoberta contextual</p><h2 id="editorial-title">O mesmo destino pode pedir um dia diferente.</h2></div><p>Clima, tempo disponível e intenção podem mudar a melhor ordem do dia. Nesta prévia, clima e eventos aparecem como exemplos contextuais.</p></div><div class="editorial-modules"><article class="editorial-route-tile"><span>Seu caminho muda com o contexto</span><svg viewBox="0 0 260 180" aria-hidden="true"><path d="M18 145 C62 92 84 126 116 76 S190 52 238 24"/><circle cx="116" cy="76" r="7"/><circle cx="238" cy="24" r="7"/></svg></article><article class="editorial-photo-tile">${scenicMedia(placeById('place-jardim-nascentes')||{},'editorial-photo')}</article><article class="editorial-event-tile"><small>${event?fmtDate(event.startsAt.slice(0,10)):'Exemplo contextual'}</small><strong>${esc(event?.name||'Feira Criativa da Serra')}</strong><p>Uma possibilidade contextual, não um ranking.</p></article><article class="editorial-weather-tile"><small>Clima de exemplo</small>${weather.map(w=>`<div><strong>${w.temperatureC}°</strong><span>${fmtDate(w.date)} · ${w.rainProbability}% chuva</span></div>`).join('')}</article><article class="editorial-photo-tile alt">${scenicMedia(placeById('place-centro-cultural')||{},'editorial-photo')}</article></div><a class="button primary editorial-cta" href="#/explorar">Ver possibilidades</a></div></section>`;
  }
  function homeCategoriesSection(){
    let cats=mergedCollection('categories').filter(c=>c.enabled!==false).sort((a,b)=>(a.sortOrder||0)-(b.sortOrder||0));
    if(isPersonalizedTrip()){const interests=tripInterests();cats=[...cats].sort((a,b)=>(interests.includes(b.id)?1:0)-(interests.includes(a.id)?1:0));}
    const all=rankPlacesForTrip(discoverablePlaces());
    return `<section class="home-section home-categories" data-psd-layer="08" aria-labelledby="categories-title"><div class="psd-container"><div class="categories-heading"><div><p class="psd-kicker">Explore por interesse</p><h2 id="categories-title">O que combina com a sua viagem?</h2></div><p>As categorias filtram o conteúdo existente sem criar uma hierarquia de importância.</p></div><div class="categories-grid">${cats.map((c,i)=>{const p=all.find(x=>(x.categoryIds||[]).includes(c.id))||all[i%Math.max(all.length,1)]||{};return `<a href="#/explorar?category=${encodeURIComponent(c.id)}" class="category-reference-tile niche-${(i%6)+1}"><div>${scenicMedia(p,'category-ref')}</div><span class="category-reference-icon">${icon(categoryIconById(c.id),'',{size:18})}</span><strong>${esc(c.name)}</strong><small>Explorar interesse</small></a>`}).join('')}<a href="#/explorar" class="category-reference-tile category-reference-all"><span class="category-reference-icon">${icon('nav.explore','',{size:18})}</span><strong>Ver todos</strong><small>Busca e filtros</small></a></div></div></section>`;
  }
  function homeFaqSection(){
    const faqs=CONFIG.home.faq;
    const active=Math.max(0,Math.min(faqs.length-1,ui.homeFaqOpen<0?0:ui.homeFaqOpen));
    return `<section class="home-section home-faq" data-psd-layer="09" aria-labelledby="faq-title"><div class="psd-container faq-reference-layout"><div class="faq-reference-copy"><p class="psd-kicker">Perguntas frequentes</p><h2 id="faq-title">Entenda antes de começar.</h2><p>Encontre respostas rápidas antes de começar e aprofunde apenas o que for necessário.</p><div class="faq-reference-list">${faqs.map((f,i)=>`<div class="faq-reference-item ${ui.homeFaqOpen===i?'open':''}" data-faq-item="${i}"><button data-home-faq="${i}" aria-expanded="${ui.homeFaqOpen===i}" aria-controls="home-faq-answer-${i}"><span>0${i+1}</span><strong>${esc(f.question)}</strong><span class="faq-chevron">${icon('nav.chevronDown','',{size:18})}</span></button><div id="home-faq-answer-${i}" class="faq-reference-answer" aria-hidden="${ui.homeFaqOpen!==i}"><div><p>${esc(f.answer)}</p></div></div></div>`).join('')}</div></div><aside class="faq-reference-preview" aria-live="polite"><div class="faq-preview-art"><span class="faq-preview-horizon"></span><span class="faq-preview-marker" data-faq-preview-marker>0${active+1}</span></div><small>Resposta em destaque</small><h3 data-faq-preview-question>${esc(faqs[active].question)}</h3><p data-faq-preview-answer>${esc(faqs[active].answer)}</p></aside></div></section>`;
  }

  function homePassportIntroSection(){
    const steps=CONFIG.home.passportSteps;
    const dates=tripDates(state.trip); const stampDate=dates[0]?fmtCapsDate(dates[0]).replace(/\s\d{4}$/,''):'DATA';
    return `<section class="home-section home-passport-intro" data-psd-layer="10" aria-labelledby="passport-intro-title"><div class="psd-container passport-reference-layout"><div class="passport-reference-mock"><div class="passport-wire" aria-hidden="true"><span></span><span></span><span></span><span></span></div><div class="passport-book"><div class="passport-book-cover"><img src="./assets/brand/logo-passaporte-serra-negra.svg" alt=""><small>PASSAPORTE</small><strong>SERRA<br>NEGRA</strong><span>memórias da viagem</span></div><div class="passport-book-page"><small>VISITA</small><strong>${esc(stampDate)}</strong><span>PRÉVIA</span><em>${state.trip.visits.length} registros locais</em></div></div></div><div class="passport-reference-copy"><p class="psd-kicker">Da intenção à memória</p><h2 id="passport-intro-title">O roteiro organiza.<br>O Passaporte guarda.</h2><p>A experiência separa claramente o que você pretende fazer daquilo que registrou como vivido.</p><ol>${steps.map((x,i)=>`<li><span>0${i+1}</span>${icon(x.iconKey,'',{size:18})}<strong>${esc(x.label)}</strong></li>`).join('')}</ol><a class="button light-button" href="#/meu-passaporte">${icon('nav.passport','',{size:18})}Abrir meu Passaporte</a></div></div></section>`;
  }
  function homeMapSection(){
    const ps=rankPlacesForTrip(researchedTouristPlaces()).slice(0,8); const positions=mapPositions(ps);
    return `<section class="home-section home-map" data-psd-layer="11" aria-labelledby="map-title"><div class="home-map-landscape" aria-hidden="true"><span></span><span></span></div><div class="psd-container map-reference-layout"><div class="map-reference-panel"><p class="psd-kicker">Visão territorial</p><div class="map-reference-list">${ps.slice(0,3).map((p,i)=>`<a data-map-place="${p.id}" href="${p.commercialRelation==='partner'?'#/parceiros/':'#/lugares/'}${p.slug}"><span>0${i+1}</span><div><small>${esc((p.categoryIds||[]).map(categoryName).join(' · '))}</small><strong>${esc(p.name)}</strong></div></a>`).join('')}</div><a class="button light-button" href="#/explorar">${icon('nav.map','',{size:18})}Abrir exploração completa</a></div><div class="map-reference-canvas" aria-label="Mapa de exploração com os pontos disponíveis"><svg viewBox="0 0 1000 600" aria-hidden="true"><path d="M88 510 C190 430 202 260 348 308 S536 468 610 334 S726 150 900 92"/></svg>${ps.map((p,i)=>`<a data-map-place="${p.id}" class="territory-pin-position" data-shared-place="${esc(p.id)}" style="left:${positions[i].x.toFixed(2)}%;top:${positions[i].y.toFixed(2)}%" href="${p.commercialRelation==='partner'?'#/parceiros/':'#/lugares/'}${p.slug}" aria-label="Abrir ${esc(p.name)}"><span class="territory-pin">${icon(p.commercialRelation==='partner'?'nav.partners':'map.place','',{size:20})}</span></a>`).join('')}</div><div class="map-reference-title"><small>Visão do território</small><h2 id="map-title">Explore também<br>pelo mapa</h2><p>Use os pontos do mapa para entender a distribuição dos lugares e continuar a exploração.</p></div></div></section>`;
  }
  function homeFinalCtaSection(){
    return `<section class="home-section home-final-cta" data-psd-layer="12" aria-labelledby="final-title"><div class="psd-container final-reference-copy"><p class="psd-kicker">Seu próximo caminho</p><h2 id="final-title">Comece pela curiosidade.<br>O roteiro vem depois.</h2><div><a class="button primary" href="#/roteiro">Montar meu roteiro</a><a class="button ghost" href="#/explorar">Explorar primeiro</a></div></div></section>`;
  }
  function setHomeRouteType(id){
    const nextIndex=HOME_ROUTE_TYPES.findIndex(x=>x.id===id); if(nextIndex<0)return;
    ui.homeRouteType=id;
    const tabs=$$('.route-types-tabs [data-route-type]');
    tabs.forEach((tab,index)=>{const active=index===nextIndex;tab.classList.toggle('active',active);tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;});
    $$('.route-types-slide').forEach((slide,index)=>{const active=index===nextIndex;slide.classList.toggle('active',active);slide.setAttribute('aria-hidden',String(!active));slide.inert=!active;slide.style.setProperty('--route-slide-offset',String(index-nextIndex));slide.style.setProperty('--route-slide-opacity',active?'1':'0');const h=slide.querySelector('h2');if(h){if(active)h.id='route-types-title';else h.removeAttribute('id');}});
  }
  function setHomeFaq(index){
    const next=ui.homeFaqOpen===index?-1:index; ui.homeFaqOpen=next;
    $$('.faq-reference-item').forEach((item,i)=>{const open=i===next;item.classList.toggle('open',open);const button=item.querySelector('[data-home-faq]');button?.setAttribute('aria-expanded',String(open));const answer=item.querySelector('.faq-reference-answer');answer?.setAttribute('aria-hidden',String(!open));});
    const previewIndex=Math.max(0,next); const def=CONFIG.home.faq[previewIndex];
    const marker=$('[data-faq-preview-marker]'),question=$('[data-faq-preview-question]'),answer=$('[data-faq-preview-answer]');
    if(marker)marker.textContent=`0${previewIndex+1}`; if(question)question.textContent=def?.question||''; if(answer)answer.textContent=def?.answer||'';
  }

  const sectionRegistry={
    homeHero:homeHeroSection,touristSpots:homeTouristSpotsSection,partnerLoop:homePartnerLoopSection,routeVisual:homeRouteVisualSection,routeTypesShowcase:homeRouteTypesSection,routeTypeCards:homeRouteCardsSection,editorialDiscovery:homeEditorialSection,partnerCategories:homeCategoriesSection,homeFaq:homeFaqSection,passportIntro:homePassportIntroSection,mapExplore:homeMapSection,finalCta:homeFinalCtaSection
  };
  const HOME_SECTIONS=CONFIG.home.sections;
  let encounterCarouselCleanup=null;
  let encounterCarouselApi=null;
  function destroyEncounterCarousel(){
    if(encounterCarouselCleanup){encounterCarouselCleanup();encounterCarouselCleanup=null;}
    encounterCarouselApi=null;
  }
  function initEncounterCarousel(){
    destroyEncounterCarousel();
    const carousel=document.querySelector('[data-encounter-carousel]');
    if(!carousel)return;
    const cards=[...carousel.querySelectorAll('[data-encounter-card]')];
    const section=carousel.closest('.encounter-section');
    const prev=section?.querySelector('[data-action="partner-prev"]');
    const next=section?.querySelector('[data-action="partner-next"]');
    const counter=section?.querySelector('[data-encounter-counter]');
    const count=cards.length; if(!count)return;
    const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const clamp=(n,min,max)=>Math.min(Math.max(n,min),max);
    const lerp=(a,b,t)=>a+(b-a)*t;
    const normalize=i=>((i%count)+count)%count;
    let currentIndex=normalize(Number(carousel.dataset.initialIndex)||0);
    let rafId=0, snapId=0;
    let pointerDown=false,startX=0,lastX=0,lastT=0,startTarget=currentIndex,velocity=0;
    const scroll={current:currentIndex,target:currentIndex,ease:reduced?1:.105};

    function spacing(){
      const cardWidth=cards[0]?.getBoundingClientRect().width||360;
      const width=carousel.getBoundingClientRect().width||1200;
      return Math.max(220,Math.min(width*.315,cardWidth*1.04));
    }
    function apply(){
      const gap=spacing(); let closest=0,closestDistance=Infinity;
      cards.forEach((card,index)=>{
        let offset=index-scroll.current;
        while(offset>count/2)offset-=count;
        while(offset<-count/2)offset+=count;
        const abs=Math.abs(offset), limited=clamp(offset,-3.15,3.15);
        const arc=Math.min(abs*abs*17.8,106);
        const scale=1-Math.min(abs*.088,.265);
        const opacity=abs>3.1?0:1-Math.min(abs*.18,.54);
        const blur=abs<.18?0:Math.min((abs-.12)*1.34,4.4);
        const rotation=clamp(-limited*7.4,-19,19);
        const shade=Math.min(abs*.092,.24);
        if(abs<closestDistance){closestDistance=abs;closest=index;}
        const active=abs<.42;
        card.classList.toggle('is-center',active);
        card.style.setProperty('--enc-x',`${limited*gap}px`);
        card.style.setProperty('--enc-y',`${arc}px`);
        card.style.setProperty('--enc-r',`${rotation}deg`);
        card.style.setProperty('--enc-s',String(scale));
        card.style.setProperty('--enc-o',String(opacity));
        card.style.setProperty('--enc-blur',`${blur}px`);
        card.style.setProperty('--enc-shade',String(shade));
        card.style.setProperty('--enc-side', String(limited===0?0:(limited>0?1:-1)));
        card.style.setProperty('--enc-z',String(40-Math.round(abs*6)));
        card.style.pointerEvents=abs<2.7?'auto':'none';
        card.setAttribute('aria-hidden',String(!active));
        card.inert=!active;
        const link=card.querySelector('.encounter-card-link');
        if(link){link.tabIndex=active?0:-1;link.style.pointerEvents=active?'auto':'none';}
      });
      if(currentIndex!==closest){currentIndex=closest;ui.homePartnerIndex=closest;}
      if(counter)counter.textContent=`${String(currentIndex+1).padStart(2,'0')} / ${String(count).padStart(2,'0')}`;
    }
    function animate(){
      scroll.current=lerp(scroll.current,scroll.target,scroll.ease);
      if(Math.abs(scroll.current-scroll.target)<.001)scroll.current=scroll.target;
      apply(); rafId=requestAnimationFrame(animate);
    }
    function goTo(index){
      const target=normalize(index); let delta=target-scroll.target;
      while(delta>count/2)delta-=count;
      while(delta<-count/2)delta+=count;
      scroll.target+=delta; currentIndex=target; ui.homePartnerIndex=target;
    }
    function snap(){clearTimeout(snapId);snapId=setTimeout(()=>goTo(Math.round(scroll.target)),130);}
    function setCenterExpanded(force){
      const shouldExpand = typeof force === 'boolean'
        ? force
        : !!carousel.querySelector('[data-encounter-card].is-center:hover, [data-encounter-card].is-center:focus-within');
      carousel.classList.toggle('is-center-expanded', shouldExpand);
    }
    function onClick(event){
      const card=event.target.closest('[data-encounter-card]'); if(!card)return;
      const index=cards.indexOf(card); if(index<0)return;
      if(index!==currentIndex){event.preventDefault();goTo(index);}
    }
    function onKey(event){
      if(event.key==='ArrowLeft'){event.preventDefault();goTo(currentIndex-1);}
      if(event.key==='ArrowRight'){event.preventDefault();goTo(currentIndex+1);}
      if(event.key==='Home'){event.preventDefault();goTo(0);}
      if(event.key==='End'){event.preventDefault();goTo(count-1);}
    }
    function onWheel(event){
      if(Math.abs(event.deltaX)<1&&Math.abs(event.deltaY)<1)return;
      event.preventDefault();
      const delta=Math.abs(event.deltaX)>Math.abs(event.deltaY)?event.deltaX:event.deltaY;
      scroll.target+=clamp(delta,-90,90)*.00265;snap();
    }
    function onPointerDown(event){
      if(event.button!==undefined&&event.button!==0)return;
      pointerDown=true;startX=lastX=event.clientX;lastT=performance.now();startTarget=scroll.target;velocity=0;
      carousel.classList.add('is-dragging');carousel.setPointerCapture?.(event.pointerId);
    }
    function onPointerMove(event){
      if(!pointerDown)return;
      const now=performance.now(),frameDx=event.clientX-lastX,frameDt=Math.max(now-lastT,16);
      velocity=frameDx/frameDt;scroll.target=startTarget-(event.clientX-startX)/spacing();lastX=event.clientX;lastT=now;
    }
    function onRelease(event){
      if(!pointerDown)return;pointerDown=false;carousel.classList.remove('is-dragging');carousel.releasePointerCapture?.(event.pointerId);
      scroll.target-=velocity*4.2;goTo(Math.round(scroll.target));
    }
    function onPrev(event){event?.preventDefault();goTo(currentIndex-1);}
    function onNext(event){event?.preventDefault();goTo(currentIndex+1);}
    const onHoverMove=()=>setCenterExpanded();
    const onHoverLeave=()=>setCenterExpanded(false);
    const onFocusIn=()=>setCenterExpanded();
    const onFocusOut=()=>requestAnimationFrame(()=>setCenterExpanded());

    carousel.tabIndex=0;
    carousel.setAttribute('role','region');
    carousel.addEventListener('click',onClick);
    carousel.addEventListener('keydown',onKey);
    carousel.addEventListener('wheel',onWheel,{passive:false});
    carousel.addEventListener('pointermove',onHoverMove);
    carousel.addEventListener('pointerleave',onHoverLeave);
    carousel.addEventListener('focusin',onFocusIn);
    carousel.addEventListener('focusout',onFocusOut);
    carousel.addEventListener('pointerdown',onPointerDown);
    carousel.addEventListener('pointermove',onPointerMove);
    carousel.addEventListener('pointerup',onRelease);
    carousel.addEventListener('pointercancel',onRelease);
    apply();animate();
    encounterCarouselApi={prev:onPrev,next:onNext,goTo};
    encounterCarouselCleanup=()=>{
      cancelAnimationFrame(rafId);clearTimeout(snapId);
      carousel.removeEventListener('click',onClick);carousel.removeEventListener('keydown',onKey);carousel.removeEventListener('wheel',onWheel);
      carousel.removeEventListener('pointermove',onHoverMove);carousel.removeEventListener('pointerleave',onHoverLeave);carousel.removeEventListener('focusin',onFocusIn);carousel.removeEventListener('focusout',onFocusOut);
      carousel.removeEventListener('pointerdown',onPointerDown);carousel.removeEventListener('pointermove',onPointerMove);carousel.removeEventListener('pointerup',onRelease);carousel.removeEventListener('pointercancel',onRelease);
    };
  }
  function renderHome(){
    destroyEncounterCarousel();
    // Recria os três destaques a cada entrada/renderização apropriada da home.
    // A seleção usa cópia dos dados, sem duplicar nem alterar a fonte original.
    ui.homeSpotSelection=[];
    const sections=HOME_SECTIONS.filter(x=>x.enabled).map(x=>({...x}));
    if(isPersonalizedTrip()){
      const route=sections.find(x=>x.type==='routeVisual'); if(route) route.order=15;
      const spots=sections.find(x=>x.type==='touristSpots'); if(spots) spots.order=25;
    }
    app.innerHTML=`<div class="home-v3 ${isPersonalizedTrip()?'is-personalized':''}">${sections.sort((a,b)=>a.order-b.order).map(def=>sectionRegistry[def.type]?.(def)||'').join('')}</div>`;
    requestAnimationFrame(initEncounterCarousel);
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
    if(['list','map'].includes(qs.get('view'))) ui.explore.view=qs.get('view');
    const cats=mergedCollection('categories').filter(c=>c.enabled!==false).sort((a,b)=>(a.sortOrder||0)-(b.sortOrder||0));
    const filterHtml=CONFIG.explore.filters.map(def=>`<label class="field"><span class="icon-label">${icon(def.iconKey,'',{size:16})}${esc(def.label)}</span><select id="${def.id}" data-explore-state="${def.stateKey}">${def.options.map(([value,label])=>`<option value="${esc(value)}" ${ui.explore[def.stateKey]===value?'selected':''}>${esc(label)}</option>`).join('')}</select></label>`).join('');
    app.innerHTML = `${pageTitle('O que você quer descobrir?','Lugares · experiências · eventos','Busque e combine filtros. Lista e mapa usam exatamente o mesmo conjunto de resultados.')}
      <section class="panel" aria-label="Filtros">
        <label class="field"><span class="icon-label">${icon('nav.search','',{size:18})}Buscar</span><input class="searchbox" id="explore-q" type="search" placeholder="Experimente buscar café" value="${esc(ui.explore.q)}"></label>
        <div class="chips" id="category-chips"><button class="chip ${!ui.explore.category?'active':''}" data-filter-category="">${icon('nav.explore','',{size:15})}Tudo</button>${cats.map(c=>`<button class="chip ${ui.explore.category===c.id?'active':''}" data-filter-category="${esc(c.id)}">${icon(categoryIconById(c.id),'',{size:15})}${esc(c.name)}</button>`).join('')}</div>
        <div class="filters">${filterHtml}</div>
        <div class="explore-toolbar"><div class="actions"><button data-action="clear-filters">${icon('calendar.filter','',{size:16})}Limpar filtros</button></div><div class="explore-view-switch" role="group" aria-label="Visualização"><button data-explore-view="list" class="${ui.explore.view==='list'?'primary':''}" aria-pressed="${ui.explore.view==='list'}">${icon('map.list','',{size:16})}Lista</button><button data-explore-view="map" class="${ui.explore.view==='map'?'primary':''}" aria-pressed="${ui.explore.view==='map'}">${icon('nav.map','',{size:16})}Mapa</button></div></div>
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
    const summary=`${places.length} ${places.length===1?'lugar encontrado':'lugares encontrados'}`;
    if(ui.explore.view==='map'&&!places.some(p=>p.id===ui.explore.previewPlace)) ui.explore.previewPlace=places[0]?.id||null;
    const preview=places.find(p=>p.id===ui.explore.previewPlace);
    const previewHref=preview?(preview.commercialRelation==='partner'?`#/parceiros/${preview.slug}`:`#/lugares/${preview.slug}`):'#';
    const content=ui.explore.view==='map'
      ? `<div class="explore-map-premium"><div class="explore-map-copy"><p class="eyebrow">Exploração territorial</p><h3>Os mesmos resultados, vistos pela cidade.</h3><p class="muted">Passe sobre um pin para relacionar mapa e lista. Clique para abrir uma prévia sem perder o contexto.</p><div class="explore-map-index">${places.slice(0,8).map((p,i)=>`<button type="button" data-map-preview="${esc(p.id)}" data-map-place="${esc(p.id)}" class="${p.id===ui.explore.previewPlace?'is-selected':''}"><span>${String(i+1).padStart(2,'0')}</span><strong>${esc(p.name)}</strong></button>`).join('')}</div>${preview?`<article class="explore-map-preview" data-shared-place="${esc(preview.id)}" tabindex="-1"><div class="explore-map-preview-media">${scenicMedia(preview,'map-preview')}</div><small>${esc((preview.categoryIds||[]).map(categoryName).join(' · '))}</small><h3>${esc(preview.name)}</h3><p>${esc(preview.shortDescription)}</p><div class="actions"><a class="button primary" href="${previewHref}">Ver experiência ${icon('nav.forward','',{size:16})}</a><button data-action="add-trip" data-place="${esc(preview.id)}">${icon('route.add','',{size:16})}Adicionar</button></div></article>`:''}</div>${mockMap(places,{transitionNames:true,preview:true,activeId:ui.explore.previewPlace})}</div>`
      : (places.length?`<div class="grid two explore-premium-grid">${places.map(p=>placeCard(p,'default',{transitionName:true})).join('')}</div>`:'<div class="empty">Nenhum lugar corresponde aos filtros.</div>');
    el.innerHTML = `${section(summary,'Resultado',`${weatherStrip()}<div style="height:1rem"></div><div class="explore-view-stage" data-explore-view-stage="${ui.explore.view}">${content}</div>`)}${renderEventsSection()}`;
  }
  function transitionExploreView(view){
    if(!['list','map'].includes(view)||view===ui.explore.view)return;
    const apply=()=>{ui.explore.view=view;renderExplore();};
    if(reducedMotion()||typeof document.startViewTransition!=='function'){apply();return;}
    document.documentElement.dataset.exploreTransition=`${ui.explore.view}-to-${view}`;
    document.startViewTransition(apply).finished.finally(()=>delete document.documentElement.dataset.exploreTransition);
  }
  function bindExploreInputs(){
    $('#explore-q')?.addEventListener('input',e=>{ui.explore.q=e.target.value;renderExploreResults()});
    $$('[data-explore-state]').forEach(el=>el.addEventListener('change',e=>{ui.explore[e.target.dataset.exploreState]=e.target.value;renderExploreResults()}));
  }
  function renderEventsSection(){
    const events=mergedCollection('events').filter(e=>e.status!=='archived');
    return section('Eventos da viagem','Agenda',`<div class="grid">${events.map(e=>{const p=placeById(e.placeId);return `<article class="panel"><span class="badge status-with-icon">${icon('map.event','',{size:14})}${fmtDate(e.startsAt.slice(0,10))}</span><h3>${esc(e.name)}</h3><p class="muted icon-label">${icon(e.environment==='outdoor'?'place.outdoor':'nav.home','',{size:16})}${esc(p?.name||'Local')} · ${esc(environmentLabel(e.environment))}</p>${p?`<a class="icon-label" href="${p.commercialRelation==='partner'?'#/parceiros/':'#/lugares/'}${p.slug}">Ver local ${icon('nav.forward','',{size:16})}</a>`:''}</article>`}).join('')}</div>`);
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
    const day=state.trip.days[0]; const start=nextAvailableStart(day); const place=placeById(placeId);
    day.items.push({id:`local-item-${Date.now()}`,placeId,startsAt:start,durationMinutes:place?.durationMinutes||60,source:'added_by_user',state:'planned'});
    save();toast(`${place?.name||'Lugar'} entrou em ${fmtDate(day.date)}, às ${start}.`);render();
  }
  function registerVisit(placeId){
    if(visitFor(placeId)){toast('Já existe uma visita registrada para este lugar nesta prévia.');return;}
    const newVisit={id:`visit-local-${Date.now()}`,placeId,occurredAt:demoOccurredAt(),evidence:'manual_demo',tripId:state.trip.trip?.id||'demo-trip-001',isReturn:false,outsidePlannedRoute:!plannedItemFor(placeId)}; state.trip.visits.push(newVisit); ui.recentVisitId=newVisit.id;
    state.audit.unshift({at:new Date().toISOString(),action:'visit_registered',label:placeById(placeId)?.name||placeId});
    save();toast('Visita registrada localmente nesta prévia.');render();
  }
  function renderResearchedTourist(p){
    const suggestionRows=nearbyPlaces(p,3); const suggestions=suggestionRows.map(x=>x.place);
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
          <div class="tourism-hero-actions">${statusBadges(p)}<button class="light-button" data-action="add-trip" data-place="${p.id}">${icon('route.add','',{size:18})}${plannedItemFor(p.id)?'Já está no roteiro':'Adicionar ao roteiro'}</button><button class="light-button" data-action="register-visit" data-place="${p.id}">${icon(visitFor(p.id)?'qr.already':'qr.visited','',{size:18})}${visitFor(p.id)?'Visita registrada':'Registrar visita'}</button></div>
        </div>
        <div class="tourism-photo-credit">${esc(photoStatus)} · ${asset.sourcePage?`<a href="${esc(asset.sourcePage)}" target="_blank" rel="noopener noreferrer">${esc(asset.provider||'Fonte')} · ${esc(asset.author||'crédito')}</a>`:esc(asset.provider||'mídia temporária')}</div>
      </section>
      <section class="tourism-intro">
        <div class="tourism-intro-copy"><p class="v2-kicker">Conheça o lugar</p><h2>Uma parada real dentro da leitura da cidade.</h2><p>${esc(p.longDescription||p.shortDescription)}</p></div>
        <aside class="tourism-practical" aria-label="Informações práticas">${factList(practical)}</aside>
      </section>
      <section class="tourism-section"><div class="tourism-container"><div class="tourism-heading"><div><p class="v2-kicker">O que vale observar</p><h2>Pontos para orientar a visita.</h2></div><p>Os destaques abaixo foram sintetizados a partir de fontes públicas de turismo. Onde a informação não estava publicada, a página sinaliza a ausência em vez de inventar dados.</p></div><div class="tourism-highlights">${(r.highlights||[]).map((h,i)=>`<article class="tourism-highlight"><span>0${i+1}</span><p>${esc(h)}</p></article>`).join('')}</div></div></section>
      <section class="tourism-media-story full-bleed"><div class="tourism-story-image">${scenicMedia(p,'tourism-story')}</div><div class="tourism-story-copy"><p class="v2-kicker">Antes de sair</p><h2>Planeje com informação verificável.</h2><p>Horários, preços, acesso e regras operacionais podem mudar. Consulte a fonte oficial antes da visita para confirmar informações sensíveis a alteração.</p><a class="button light-button" href="${esc(src.url||'#')}" target="_blank" rel="noopener noreferrer">Consultar fonte oficial ${icon('nav.external','',{size:18})}</a></div></section>
      <section class="tourism-section"><div class="tourism-container"><div class="tourism-heading"><div><p class="v2-kicker">Informações práticas</p><h2>O que saber antes da visita.</h2></div><p>O essencial aparece primeiro. Detalhes operacionais ficam disponíveis quando você precisar.</p></div><details class="premium-disclosure"><summary>${icon('place.info','',{size:18})}<span>Ver observações e limites de informação</span>${icon('nav.chevronDown','',{size:17})}</summary><div class="tourism-notes">${notes.length?notes.map(n=>`<article class="tourism-note">${icon('place.info','',{size:22})}<p>${esc(n)}</p></article>`).join(''):`<article class="tourism-note">${icon('place.info','',{size:22})}<p>Não foram identificadas observações adicionais na fonte consultada.</p></article>`}</div></details><div class="tourism-source-box"><div><small>Fonte principal da página</small><strong>${esc(src.label||'Fonte pública consultada')}</strong><p>Pesquisa realizada em ${esc(r.checkedAt||DATA.content?.meta?.lastResearchAt||'data não informada')}. Reconfirme informações sensíveis a mudança antes de publicar em produção.</p></div>${src.url?`<a class="button" href="${esc(src.url)}" target="_blank" rel="noopener noreferrer">${icon('nav.external','',{size:17})}Abrir fonte</a>`:''}</div></div></section>
      <section class="tourism-section"><div class="tourism-container"><div class="tourism-heading"><div><p class="v2-kicker">Localização</p><h2>Use o endereço como referência.</h2></div><p>O mapa organiza os pontos disponíveis para apoiar a exploração e o roteiro.</p></div><div class="tourism-location-grid"><div>${mockMap([p,...suggestions.slice(0,2)])}</div><aside class="tourism-location-copy">${icon('place.location','',{size:26})}<h3>${esc(p.location?.display||'Localização não informada')}</h3><p>Adicione este ponto ao roteiro para validar a continuidade entre descoberta, planejamento, calendário e Passaporte.</p><button class="primary" data-action="add-trip" data-place="${p.id}">${icon('map.addRoute','',{size:18})}${plannedItemFor(p.id)?'Já está no roteiro':'Adicionar ao roteiro'}</button></aside></div></div></section>
      <section class="tourism-section"><div class="tourism-container"><div class="tourism-heading"><div><p class="v2-kicker">Continue explorando</p><h2>Outros pontos próximos deste caminho.</h2></div><a class="text-link" href="#/explorar?relation=public_point">Ver todos ${icon('nav.forward','',{size:17})}</a></div><div class="tourism-more-grid">${suggestions.map(x=>placeCard(x,'editorial',{fromPlace:p})).join('')}</div></div></section>
    </article>`;
  }

  function renderPlace(slug,asPartner=false){
    const p=placeBySlug(slug); if(!p){return renderNotFound();}
    const isPartner=asPartner || p.commercialRelation==='partner';
    if(isPartner) return renderPartner(p);
    if(p.research?.verified) return renderResearchedTourist(p);
    const exps=experiencesFor(p.id), evs=eventsFor(p.id); const suggestions=nearbyPlaces(p,4).map(x=>x.place);
    const facts=[
      {iconKey:'place.hours',label:'Horário',value:p.openingHours?.text||'Demo'},
      {iconKey:'place.duration',label:'Duração',value:`${p.durationMinutes} min`},
      {iconKey:p.environment==='outdoor'?'place.outdoor':'nav.home',label:'Ambiente',value:environmentLabel(p.environment)},
      {iconKey:p.costType==='free'?'place.free':'place.cost',label:'Custo',value:costLabel(p.costType)}
    ];
    app.innerHTML = `${breadcrumbs([{label:'Início',href:'#/'},{label:'Explorar',href:'#/explorar'},{label:p.name}])}<section class="hero"><div><p class="eyebrow">Ponto turístico · demonstração</p><h1 class="compact">${esc(p.name)}</h1><p class="lead">${esc(p.shortDescription)}</p><div class="actions">${statusBadges(p)}<button class="primary" data-action="add-trip" data-place="${p.id}">${icon('route.add','',{size:18})}${plannedItemFor(p.id)?'Já está no roteiro':'Adicionar ao roteiro'}</button><button data-action="register-visit" data-place="${p.id}">${icon(visitFor(p.id)?'qr.already':'qr.visited','',{size:18})}${visitFor(p.id)?'Visita registrada':'Registrar visita'}</button></div></div><div class="hero-visual premium-generic-hero">${scenicMedia(p,'generic-hero')}<div class="mark">PONTO<br><strong>DEMO</strong></div></div></section>
      <section class="section two-col"><div><p class="eyebrow">Sobre o lugar</p><h2>Conheça este ponto</h2><p class="lead">${esc(p.longDescription||p.shortDescription)}</p><div class="gallery"><div></div><div></div><div></div></div></div><aside class="sidebar"><div class="panel"><h3>Informações rápidas</h3>${factList(facts)}</div>${weatherStrip()}</aside></section>
      ${section('Experiências neste lugar','O que fazer',exps.length?`<div class="grid">${exps.map(e=>`<article class="panel"><span class="badge status-with-icon">${icon('map.experience','',{size:14})}${esc(costLabel(e.costType))}</span><h3>${esc(e.name)}</h3><p class="muted icon-label">${icon(e.environment==='outdoor'?'place.outdoor':'nav.home','',{size:16})}${e.durationMinutes} min · ${esc(environmentLabel(e.environment))}</p></article>`).join('')}</div>`:'<div class="empty">Nenhuma experiência associada.</div>')}
      ${evs.length?section('Eventos','Agenda',`<div class="grid">${evs.map(e=>`<article class="panel"><span class="badge status-with-icon">${icon('map.event','',{size:14})}${fmtDate(e.startsAt.slice(0,10))}</span><h3>${esc(e.name)}</h3><p>${esc(costLabel(e.costType))}</p></article>`).join('')}</div>`):''}
      ${section('Localização','Mapa de exploração',mockMap([p,...suggestions.slice(0,2)]))}
      ${section('Continue explorando','Próximos lugares por proximidade',`<div class="grid">${suggestions.slice(0,3).map(x=>placeCard(x,'default',{fromPlace:p})).join('')}</div>`)}
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
    const partner=partnerForPlace(p.id); const exps=experiencesFor(p.id); const suggestions=nearbyPlaces(p,4).map(x=>x.place);
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
      <section class="v2-section"><div class="v2-container partner-details-grid"><div><p class="v2-kicker">Antes de visitar</p><h2>Informações e ações</h2>${factList(detailFacts)}<p class="muted">Links de contato são bloqueados nesta demo para evitar confusão com canais reais.</p><div class="contact-row"><button data-action="demo-contact">${icon('place.whatsapp','',{size:18})} WhatsApp</button><button data-action="demo-contact">${icon('place.instagram','',{size:18})} Instagram</button><button data-action="demo-contact">${icon('nav.external','',{size:18})} Site</button></div></div><aside class="sticky-summary"><p class="v2-kicker">Na sua viagem</p><h3>${planned?'Este lugar já está no roteiro.':'Quer incluir esta parada?'}</h3><p>${visited?'Há uma visita demonstrativa registrada.':planned?'Planejado não significa visitado. O registro continua separado.':'Você pode adicioná-lo à viagem sem alterar as outras paradas.'}</p><button class="primary" data-action="add-trip" data-place="${p.id}">${icon('map.addRoute','',{size:18})}${planned?'Já adicionado':'Adicionar ao roteiro'}</button><button data-action="register-visit" data-place="${p.id}">${icon(visited?'qr.already':'qr.visited','',{size:18})}${visited?'Visita registrada':'Registrar visita'}</button></aside></div></section>
      <section class="v2-section partner-location"><div class="v2-container"><div class="v2-section-heading"><div><p class="v2-kicker">Localização</p><h2>Onde esta parada entra no mapa</h2></div><p>Mapa abstrato de validação, derivado das coordenadas disponíveis.</p></div><div class="map-explore-grid"><div>${mockMap([p,...suggestions.slice(0,3)])}</div><div class="location-copy">${icon('place.location','',{size:25})}<h3>${esc(p.location?.display||'Localização não informada')}</h3><p>O endereço textual permanece acessível mesmo quando o mapa não representa um provedor real.</p><button data-action="demo-contact">Abrir rota ${icon('map.navigate','',{size:18})}</button></div></div></div></section>
      <section class="v2-section"><div class="v2-container"><div class="v2-section-heading"><div><p class="v2-kicker">Continue explorando</p><h2>Próximos caminhos por perto</h2></div><a class="text-link" href="#/explorar">Ver todos ${icon('nav.forward','',{size:17})}</a></div><div class="grid">${suggestions.slice(0,3).map(x=>placeCard(x,'editorial',{fromPlace:p})).join('')}</div></div></section>
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
    app.innerHTML = `<div class="onboarding"><p class="eyebrow icon-label">${icon(s.iconKey||'nav.route','',{size:16})}Roteiro · etapa ${ui.onboarding.step+1} de ${onboardingSteps.length}</p><div class="progress"><span style="width:${pct}%"></span></div><h1 class="compact">${esc(s.title)}</h1>${s.lead?`<p class="lead">${esc(s.lead)}</p>`:''}${s.review?renderReview():`<div class="choices">${choices.map(c=>{const selected=s.multi?(answer||[]).includes(c.value):answer===c.value;return `<button class="choice ${selected?'selected':''}" data-onboard-key="${s.key}" data-onboard-value="${esc(c.value)}" data-onboard-multi="${s.multi?'1':'0'}">${icon(c.iconKey||'nav.forward','',{size:22})}<span>${esc(c.label)}</span></button>`}).join('')}</div>`}<div class="trip-toolbar"><button ${ui.onboarding.step===0?'disabled':''} data-action="onboard-prev">${icon('nav.back','',{size:17})}Voltar</button>${s.review?`<button class="primary" data-action="generate-trip">${icon('route.save','',{size:18})}Gerar roteiro</button>`:`<button class="primary" data-action="onboard-next">Continuar${icon('nav.forward','',{size:17})}</button>`}</div></div>`;
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
    state.trip=clone(DATA.trip); state.trip.trip.party=ui.onboarding.answers.party; state.trip.trip.pace=ui.onboarding.answers.pace; state.trip.trip.transport=ui.onboarding.answers.transport; state.trip.trip.interests=clone(ui.onboarding.answers.interests||[]); state.trip.trip.personalized=true; state.trip.trip.intent=ui.onboarding.answers.intent; state.trip.trip.needs=ui.onboarding.answers.needs;
    state.audit.unshift({at:new Date().toISOString(),action:'trip_generated',label:'Roteiro demo gerado'}); save(); toast('Roteiro gerado.'); location.hash='#/viagens/demo-trip-001/roteiro';
  }

  function renderRoute(){
    if(!state.trip.days.some(d=>d.date===ui.activeDay)) ui.activeDay=state.trip.days[0].date;
    const day=state.trip.days.find(d=>d.date===ui.activeDay); const items=day.items.filter(i=>i.state!=='removed');
    app.innerHTML = `${pageTitle('Seu roteiro',`Viagem · ${tripPeriodLabel(state.trip)}`,'Edite uma parada sem reconstruir silenciosamente o restante da viagem.')}${weatherStrip(day.date)}<div class="trip-toolbar"><div class="day-tabs">${state.trip.days.map(d=>`<button data-day="${d.date}" class="${d.date===day.date?'primary':''}">${icon('calendar.day','',{size:16})}${fmtDate(d.date)}</button>`).join('')}</div><div class="actions"><span class="badge status-with-icon">${icon('route.autosave','',{size:14})}salvo localmente</span><a class="button" href="#/viagens/demo-trip-001/calendario">${icon('nav.calendar','',{size:17})}Ver calendário</a><a class="button" href="#/meu-passaporte">${icon('nav.passport','',{size:17})}Meu Passaporte</a></div></div>
      <section class="two-col"><div><div class="route-premium-insight">${icon('route.reorder','',{size:20})}<div><small>Leitura inteligente do dia</small><strong>${esc(routeInsight(day))}</strong></div></div><div class="timeline premium-route-list" data-route-list="${day.date}">${items.length?items.map(i=>routeItem(i,day.date)).join(''):'<div class="empty">Este dia está livre.</div>'}</div></div><aside class="sidebar"><div class="panel"><h3 class="icon-label">${icon('route.add','',{size:20})}Adicionar uma parada</h3><label class="field">Lugar<select id="route-add-place"><option value="">Escolha um lugar</option>${discoverablePlaces().filter(p=>!plannedItemFor(p.id)).map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('')}</select></label><button data-action="route-add-selected">${icon('route.add','',{size:18})}Adicionar ao dia</button></div><div class="panel"><h3 class="icon-label">${icon('route.edit','',{size:20})}Como editar</h3><p class="muted">Mover altera apenas o horário da parada. Fixar preserva a escolha. Remover não reorganiza automaticamente o restante.</p></div>${mockMap(items.map(i=>placeById(i.placeId)).filter(Boolean))}</aside></section>`;
  }
  function routeItem(i,date){
    const p=placeById(i.placeId); const fixed=i.state==='fixed'; const visited=!!visitFor(i.placeId);
    return `<article class="card route-item ${fixed?'fixed':''}" draggable="true" data-route-drag-id="${i.id}" data-route-date="${date}" aria-label="${esc(p?.name||i.placeId)}, arraste para reorganizar"><div class="route-drag-handle" aria-hidden="true">${icon('route.drag','',{size:18})}</div><time>${esc(i.startsAt)}</time><div><div class="actions">${statusBadge(fixed?'fixed':'planned')}${visited?statusBadge('visited'):''}</div><h3>${esc(p?.name||i.placeId)}</h3><p class="muted">${p?esc(p.shortDescription):''}</p><a class="icon-label" href="${p?.commercialRelation==='partner'?'#/parceiros/':'#/lugares/'}${p?.slug||''}">Abrir página ${icon('nav.forward','',{size:15})}</a></div><div class="route-actions"><button class="route-order-control" data-route-action="up" data-item="${i.id}" data-date="${date}" aria-label="Mover parada para cima">${icon('nav.chevronUp','',{size:17})}<span>Subir</span></button><button class="route-order-control" data-route-action="down" data-item="${i.id}" data-date="${date}" aria-label="Mover parada para baixo">${icon('nav.chevronDown','',{size:17})}<span>Descer</span></button><button data-route-action="earlier" data-item="${i.id}" data-date="${date}" aria-label="Mover 30 minutos antes">${icon('route.move','',{size:17})}<span>30 min antes</span></button><button data-route-action="later" data-item="${i.id}" data-date="${date}" aria-label="Mover 30 minutos depois">${icon('route.move','',{size:17})}<span>30 min depois</span></button><button data-route-action="fix" data-item="${i.id}" data-date="${date}">${icon(fixed?'route.unlock':'route.fix','',{size:17})}${fixed?'Desfixar':'Fixar'}</button><button class="danger" data-route-action="remove" data-item="${i.id}" data-date="${date}" ${fixed?'disabled title="Desfixe antes de remover"':''}>${icon('route.remove','',{size:17})}Remover</button></div></article>`;
  }
  const timeToMinutes=t=>{const [h,m]=String(t||'09:00').split(':').map(Number);return (h||0)*60+(m||0)};
  const minutesToTime=mins=>`${String(Math.floor(mins/60)).padStart(2,'0')}:${String(mins%60).padStart(2,'0')}`;
  function reflowDaySchedule(day){
    const active=day.items.filter(i=>i.state!=='removed');
    if(!active.length)return;
    let cursor=Math.max(7*60,Math.min(...active.map(i=>timeToMinutes(i.startsAt))));
    active.forEach(item=>{
      if(item.state==='fixed'){
        cursor=Math.max(cursor,timeToMinutes(item.startsAt)+(Number(item.durationMinutes)||60)+15);
        return;
      }
      item.startsAt=minutesToTime(Math.min(cursor,21*60+30));
      cursor=timeToMinutes(item.startsAt)+(Number(item.durationMinutes)||60)+15;
    });
  }
  function reorderRouteItem(date,sourceId,targetId){
    const day=state.trip.days.find(d=>d.date===date); if(!day||sourceId===targetId)return;
    const sourceIndex=day.items.findIndex(i=>i.id===sourceId),targetIndex=day.items.findIndex(i=>i.id===targetId);
    if(sourceIndex<0||targetIndex<0)return;
    const [item]=day.items.splice(sourceIndex,1); const adjusted=sourceIndex<targetIndex?targetIndex-1:targetIndex;
    day.items.splice(adjusted,0,item); reflowDaySchedule(day); save(); toast('Roteiro reorganizado e horários recalculados.'); renderRoute();
  }
  function shiftTime(t,mins){const [h,m]=t.split(':').map(Number);let total=h*60+m+mins;total=Math.max(7*60,Math.min(22*60,total));return `${String(Math.floor(total/60)).padStart(2,'0')}:${String(total%60).padStart(2,'0')}`}
  function moveRouteItemByStep(day,id,delta){
    const active=day.items.filter(i=>i.state!=='removed'); const current=active.findIndex(i=>i.id===id); const target=current+delta;
    if(current<0||target<0||target>=active.length)return false;
    const sourceIndex=day.items.findIndex(i=>i.id===id); const targetIndex=day.items.findIndex(i=>i.id===active[target].id);
    const [item]=day.items.splice(sourceIndex,1); const adjusted=sourceIndex<targetIndex?targetIndex-1:targetIndex; day.items.splice(adjusted,0,item); reflowDaySchedule(day); return true;
  }
  function routeAction(action,date,id){
    const day=state.trip.days.find(d=>d.date===date); const item=day?.items.find(i=>i.id===id); if(!item)return;
    if(action==='up'||action==='down'){if(moveRouteItemByStep(day,id,action==='up'?-1:1)){save();toast('Sequência atualizada e horários recalculados.');renderRoute();}return;}
    if(action==='earlier')item.startsAt=shiftTime(item.startsAt,-30); if(action==='later')item.startsAt=shiftTime(item.startsAt,30); if(action==='fix')item.state=item.state==='fixed'?'planned':'fixed'; if(action==='remove'&&item.state!=='fixed')item.state='removed'; save();renderRoute();
  }
  function addSelectedToDay(){
    const pid=$('#route-add-place')?.value;if(!pid){toast('Escolha um lugar para adicionar.');return;}
    const day=state.trip.days.find(d=>d.date===ui.activeDay); if(!day)return;
    const start=nextAvailableStart(day); const place=placeById(pid);
    day.items.push({id:`local-${Date.now()}`,placeId:pid,startsAt:start,durationMinutes:place?.durationMinutes||60,source:'added_by_user',state:'planned'});
    save();toast(`${place?.name||'Parada'} adicionada às ${start}. O restante do dia foi preservado.`);renderRoute();
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
    return `<div class="stamp ${ui.recentVisitId===v.id?'is-new-stamp':''}"><span>${icon('qr.visited','',{size:20})}<br>VISITA DEMO<br><strong>${esc(p?.name||v.placeId)}</strong><br>${esc(date?fmtCapsDate(date):'DATA NÃO INFORMADA')}</span></div>`;
  }
  const passportPages = () => {
    const visits=state.trip.visits; const planned=state.trip.days.flatMap(d=>d.items.filter(i=>i.state!=='removed')); const categories=[...new Set(visits.flatMap(v=>placeById(v.placeId)?.categoryIds||[]))];
    const dates=tripDates(state.trip); const year=dates[0]?new Date(`${dates[0]}T12:00:00`).getFullYear():new Date().getFullYear();
    const archiveLabel=dates[0]?new Intl.DateTimeFormat('pt-BR',{month:'long',year:'numeric'}).format(new Date(`${dates[0]}T12:00:00`)):'período atual';
    const bodies={
      cover:`<div class="stamp"><span>${icon('nav.passport','',{size:24})}<br>PASSAPORTE<br><strong>SERRA NEGRA</strong><br>DEMO ${year}</span></div><p>Um registro da viagem vivida, separado do que foi apenas planejado.</p>`,
      identity:`${factList([{iconKey:'nav.account',label:'Perfil',value:state.trip.trip.party||'Casal'},{iconKey:'nav.calendar',label:'Período',value:tripPeriodLabel(state.trip)},{iconKey:'profile.paceBalanced',label:'Ritmo',value:state.trip.trip.pace||'Equilibrado'},{iconKey:'profile.car',label:'Transporte',value:state.trip.trip.transport||'Carro'}])}`,
      ticket:`<div class="ticket">${icon('passport.ticket','',{size:22})}<strong>Serra Negra · SP</strong><p>${esc(tripPeriodCaps(state.trip))}</p><p>${planned.length} paradas planejadas · ${visits.length} presenças registradas</p></div>`,
      stamps:visits.length?`<div class="passport-stamp-grid">${visits.slice(0,6).map(v=>stampHtml(v)).join('')}</div>`:'<p>Nenhuma visita registrada.</p>',
      discoveries:visits.filter(v=>v.outsidePlannedRoute).map(v=>`<div class="ticket">${icon('nav.explore','',{size:20})}<strong>${esc(placeById(v.placeId)?.name||v.placeId)}</strong><p>Descoberta registrada fora da rota planejada.</p></div>`).join('')||'<p>Nenhuma descoberta fora do roteiro.</p>',
      categories:`<div class="chips">${categories.map(c=>`<span class="badge status-with-icon">${icon(categoryIconById(c),'',{size:14})}${esc(categoryName(c))}</span>`).join('')}</div><p>Estas categorias são derivadas das visitas registradas, não das intenções de viagem.</p>`,
      path:`${visits.map(v=>`<p class="icon-label">${icon('nav.route','',{size:16})}<strong>${new Date(v.occurredAt).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</strong> · ${esc(placeById(v.placeId)?.name||v.placeId)}</p>`).join('')||'<p>Nenhuma visita registrada.</p>'}`,
      archive:`<div class="ticket">${icon('passport.history','',{size:22})}<strong>Serra Negra · ${esc(archiveLabel)}</strong><p>${visits.length} registros · ${planned.length} planejamentos ativos</p></div>`,
      summary:`<h3>${planned.length} planejado(s)</h3><p>Itens que continuam no roteiro.</p><h3>${visits.length} registrado(s)</h3><p>Presenças explicitamente gravadas no Passaporte.</p><button data-action="share-passport">${icon('passport.shareTicket','',{size:18})}Compartilhar resumo demo</button>`
    };
    return CONFIG.passport.chapters.map(ch=>({...ch,body:bodies[ch.id]||''}));
  };
  function turnPassportPage(direction){
    const pages=passportPages(); const next=Math.max(0,Math.min(pages.length-1,ui.passportPage+direction)); if(next===ui.passportPage)return;
    const apply=()=>{ui.passportPage=next;renderPassport();};
    document.documentElement.dataset.passportTurn=direction<0?'back':'forward';
    if(!reducedMotion()&&typeof document.startViewTransition==='function'){
      document.startViewTransition(apply).finished.finally(()=>delete document.documentElement.dataset.passportTurn);
    }else{apply();setTimeout(()=>delete document.documentElement.dataset.passportTurn,360);}
  }
  function renderPassport(){
    const pages=passportPages(); ui.passportPage=Math.max(0,Math.min(ui.passportPage,pages.length-1)); const a=pages[ui.passportPage],b=pages[ui.passportPage+1];
    app.innerHTML = `${pageTitle('Meu Passaporte','Memória digital da viagem','Planejamento e presença continuam visualmente separados nesta versão.')}<div class="book-wrap"><nav class="book-index" aria-label="Capítulos">${pages.map((p,i)=>`<button class="${ui.passportPage===i?'primary':''}" data-passport-page="${i}">${icon(p.iconKey,'',{size:16})}<span>${i+1}. ${esc(p.title)}</span></button>`).join('')}</nav><div><div class="book"><article class="book-page active"><p class="eyebrow icon-label">${icon(a.iconKey,'',{size:16})}${esc(a.eyebrow)}</p><h2>${esc(a.title)}</h2>${a.body}<span class="page-number">${ui.passportPage+1}</span></article>${b?`<article class="book-page"><p class="eyebrow icon-label">${icon(b.iconKey,'',{size:16})}${esc(b.eyebrow)}</p><h2>${esc(b.title)}</h2>${b.body}<span class="page-number">${ui.passportPage+2}</span></article>`:''}</div><div class="trip-toolbar"><button data-action="passport-prev" ${ui.passportPage===0?'disabled':''}>${icon('nav.chevronLeft','',{size:17})}Página anterior</button><button data-action="passport-next" ${ui.passportPage>=pages.length-1?'disabled':''}>Próxima página${icon('nav.chevronRight','',{size:17})}</button></div><section class="panel"><h3 class="icon-label">${icon('qr.code','',{size:20})}Registrar presença fictícia</h3><p class="muted">Este controle existe apenas para validar a diferença entre planejamento e presença registrada.</p><div class="actions"><select id="passport-place"><option value="">Escolha um lugar</option>${discoverablePlaces().filter(p=>!visitFor(p.id)).map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('')}</select><button data-action="passport-register">${icon('qr.visited','',{size:18})}Registrar visita</button></div></section></div></div>`;
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
    return `<div class="panel"><div class="section-head"><div><p class="eyebrow icon-label">${icon(module.iconKey,'',{size:16})}${esc(module.label)}</p><h2>Conteúdo</h2></div>${kind==='places'?`<button data-action="admin-create">${icon('route.add','',{size:17})}Criar lugar</button>`:''}</div><div class="admin-list">${list.map(item=>{const status=item.status||'active'; return `<div class="admin-row"><div><strong>${esc(adminLabel(kind,item))}</strong><div class="actions">${statusBadge(status)}${state.drafts[kind]?.[item.id]?statusBadge('draft'):''}</div></div><button data-admin-edit="${item.id}">${icon('route.edit','',{size:16})}Editar</button></div>`}).join('')}</div></div><section class="section"><h2 class="icon-label">${icon('admin.audit','',{size:20})}Histórico desta sessão</h2><div class="audit">${state.audit.slice(0,8).map(a=>`<div class="audit-item"><strong>${esc(a.action)}</strong><div>${esc(a.label)}</div><span class="muted">${new Date(a.at).toLocaleString('pt-BR')}</span></div>`).join('')}</div></section>`;
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

  function renderNotFound(){app.innerHTML=`${breadcrumbs([{label:'Início',href:'#/'},{label:'Página não encontrada'}])}${pageTitle('Página não encontrada','Passaporte Serra Negra','A rota solicitada não existe nesta versão.')}<form class="not-found-search" id="not-found-search" role="search"><label class="field" for="not-found-q">Pesquisar no Passaporte</label><div class="search-inline">${icon('nav.search','',{size:19})}<input id="not-found-q" type="search" placeholder="Café, natureza, cultura…"><button class="primary" type="submit">${icon('nav.explore','',{size:17})}Explorar</button></div></form><div class="not-found-actions"><a class="button primary" href="#/">${icon('nav.home','',{size:17})}Voltar ao início</a><a class="button" href="#/explorar">${icon('nav.explore','',{size:17})}Explorar lugares</a><a class="button" href="#/roteiro">${icon('route.add','',{size:17})}Montar roteiro</a></div>`}


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
    const page=parts[0]||'home'; if(page!=='home')destroyEncounterCarousel(); document.body.dataset.page=page; updateNavCurrent(page);
    const route=ROUTES.find(candidate=>candidate.match(parts));
    if(route?.redirect){location.replace(route.redirect);return;}
    if(route){if(!route.customMeta)setPageMeta(route.meta);route.run(parts);}
    else {setPageMeta('home','Página não encontrada · Passaporte Serra Negra','A rota solicitada não existe nesta demonstração.');renderNotFound();}
    applySharedTransitionTarget();
    syncPremiumHeader();
    app.focus({preventScroll:true});
  }

  let routeTransitionSequence=0;
  let previousRouteHash=location.hash||'#/';
  let pendingRouteDirection=null;
  let pendingSharedPlaceId=null;
  let pendingSharedSource=null;
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
  function prepareSharedTransitionFromClick(target){
    const host=target?.closest?.('[data-shared-place]'); if(!host)return;
    const id=host.dataset.sharedPlace; if(!id)return;
    const media=host.matches('[data-place-media]')?host:host.querySelector?.(`[data-place-media="${id}"]`)||host.querySelector?.('[data-place-media]')||host;
    if(host!==media&&host.style?.viewTransitionName)host.style.viewTransitionName='';
    pendingSharedPlaceId=id; pendingSharedSource=media;
    if(media?.style)media.style.viewTransitionName='place-media';
  }
  function applySharedTransitionTarget(){
    if(!pendingSharedPlaceId)return;
    const selectors=[`.tourism-hero [data-place-media="${pendingSharedPlaceId}"]`,`.partner-hero-v2 [data-place-media="${pendingSharedPlaceId}"]`,`[data-place-media="${pendingSharedPlaceId}"]`];
    const target=selectors.map(sel=>document.querySelector(sel)).find(Boolean);
    if(target?.style)target.style.viewTransitionName='place-media';
  }
  function clearSharedTransition(){
    if(pendingSharedSource?.style)pendingSharedSource.style.viewTransitionName='';
    const current=document.querySelector('[style*="view-transition-name: place-media"], [style*="view-transition-name:place-media"]');
    if(current?.style)current.style.viewTransitionName='';
    pendingSharedSource=null; pendingSharedPlaceId=null;
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
      clearSharedTransition();
      return;
    }

    /* #app has its own view-transition-name, so route motion is isolated to
       content while the persistent header and footer remain stationary. */
    if(typeof document.startViewTransition==='function'){
      const transition=document.startViewTransition(()=>{
        if(sequence===routeTransitionSequence) render();
      });
      transition.finished.finally(()=>{
        if(sequence===routeTransitionSequence){delete root.dataset.routeSlide;clearSharedTransition();}
      });
      return;
    }

    /* Fallback for browsers without View Transitions: horizontal movement
       only, with no opacity animation. */
    if(typeof app.animate!=='function'){
      render();
      delete root.dataset.routeSlide;
      clearSharedTransition();
      return;
    }
    app.classList.add('is-route-transitioning');
    const sign=direction<0?-1:1;
    const easing='cubic-bezier(.16,1,.3,1)';
    for(const animation of app.getAnimations()) animation.cancel();

    /* Fallback stays softer by using a shorter departure and a long landing.
       The incoming screen begins close to the edge rather than performing a
       second abrupt full-width sweep. */
    app.animate(
      [
        {transform:'translate3d(0,0,0)',offset:0},
        {transform:`translate3d(${-sign*18}vw,0,0)`,offset:1}
      ],
      {duration:260,easing,fill:'forwards'}
    ).finished.catch(()=>{}).then(()=>{
      if(sequence!==routeTransitionSequence) return;
      render();
      for(const animation of app.getAnimations()) animation.cancel();
      return app.animate(
        [
          {transform:`translate3d(${sign*32}vw,0,0)`,offset:0},
          {transform:'translate3d(0,0,0)',offset:1}
        ],
        {duration:520,easing,fill:'both'}
      ).finished.catch(()=>{});
    }).finally(()=>{
      if(sequence===routeTransitionSequence){
        app.classList.remove('is-route-transitioning');
        app.style.transform='';
        delete root.dataset.routeSlide;
        clearSharedTransition();
      }
    });
  }

  document.addEventListener('click',e=>{
    const link=e.target.closest?.('a[href^="#/"]');
    if(!link) return;
    prepareSharedTransitionFromClick(e.target);
    pendingRouteDirection=inferRouteDirection(previousRouteHash,link.getAttribute('href'));
  },{capture:true});


  document.addEventListener('click',e=>{
    const t=e.target.closest('button,[data-action],[data-filter-category],[data-day],[data-day-calendar],[data-calendar-mode],[data-passport-page],[data-admin-kind],[data-admin-edit],[data-route-action],[data-onboard-key],[data-home-spot],[data-home-partner],[data-route-type],[data-home-faq],[data-participation-tab],[data-partner-scroll],[data-explore-view],[data-map-preview]'); if(!t)return;
    if(t.dataset.exploreView){transitionExploreView(t.dataset.exploreView);return}
    if(t.dataset.mapPreview){ui.explore.previewPlace=t.dataset.mapPreview;renderExploreResults();requestAnimationFrame(()=>document.querySelector('.explore-map-preview')?.focus?.({preventScroll:true}));return}
    if(t.dataset.homeSpot!==undefined){ui.homeSpotIndex=Number(t.dataset.homeSpot);renderHome();return}
    if(t.dataset.homePartner!==undefined){ui.homePartnerIndex=Number(t.dataset.homePartner);renderHome();return}
    if(t.dataset.routeType){if(t.dataset.action==='route-type-to-onboarding'){ui.homeRouteType=t.dataset.routeType;location.hash='#/roteiro';return}if(t.closest('.route-types-tabs')){setHomeRouteType(t.dataset.routeType);return}ui.homeRouteType=t.dataset.routeType;renderHome();return}
    if(t.dataset.homeFaq!==undefined){setHomeFaq(Number(t.dataset.homeFaq));return}
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
    if(a==='partner-prev'){encounterCarouselApi?.prev?.(e);return}
    if(a==='partner-next'){encounterCarouselApi?.next?.(e);return}
    if(a==='clear-filters'){ui.explore={...ui.explore,q:'',category:'',relation:'',environment:'',cost:''};renderExplore();return}
    if(a==='demo-contact'){toast('Este contato estará disponível quando a integração externa estiver ativa.');return}
    if(a==='add-trip'){addToTrip(t.dataset.place);return}
    if(a==='register-visit'){registerVisit(t.dataset.place);return}
    if(a==='onboard-prev'){ui.onboarding.step=Math.max(0,ui.onboarding.step-1);renderOnboarding();return}
    if(a==='onboard-next'){const s=onboardingSteps[ui.onboarding.step];const ans=ui.onboarding.answers[s.key];if(!ans||(Array.isArray(ans)&&!ans.length)){toast('Escolha pelo menos uma opção.');return;}ui.onboarding.step=Math.min(onboardingSteps.length-1,ui.onboarding.step+1);renderOnboarding();return}
    if(a==='generate-trip'){generateTrip();return}
    if(a==='route-add-selected'){addSelectedToDay();return}
    if(a==='passport-prev'){turnPassportPage(-1);return}
    if(a==='passport-next'){turnPassportPage(1);return}
    if(a==='passport-register'){const pid=$('#passport-place')?.value;if(pid)registerVisit(pid);else toast('Escolha um lugar.');return}
    if(a==='share-passport'){const txt=`Passaporte Serra Negra: ${state.trip.visits.length} visitas registradas em ${tripPeriodLabel(state.trip)}.`;if(navigator.share){navigator.share({title:'Meu Passaporte Serra Negra',text:txt}).catch(()=>{});}else{navigator.clipboard?.writeText(txt).then(()=>toast('Resumo copiado.')).catch(()=>toast(txt));}return}
    if(a==='admin-back'){ui.adminEdit=null;ui.adminPreview=null;renderAdmin();return}
    if(a==='admin-create'){adminCreatePlace();return}
    if(a==='admin-save-draft'){adminSaveDraft(false);return}
    if(a==='admin-preview'){adminSaveDraft(true);return}
    if(a==='admin-publish'){adminPublish();return}
    if(a==='admin-archive'){adminArchive();return}
    if(a==='reset-demo'){if(confirm('Restaurar o estado inicial desta prévia? Suas alterações locais serão apagadas.')){state=defaultState();save();ui.activeDay=state.trip.days[0].date;ui.passportPage=0;toast('Prévia restaurada.');render()}return}
    if(a==='clear-local-data'){if(confirm('Apagar o estado e as preferências salvas neste navegador?')){localStorage.removeItem(STORE);localStorage.removeItem(THEME_STORE);state=defaultState();document.documentElement.dataset.theme='system';themeSelect.value='system';syncThemeMeta('system');window.PSN_SHELL?.syncThemeIcon?.('system');toast('Dados locais apagados.');if(location.hash==='#/'||!location.hash)render();else location.hash='#/'}return}
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
  let routeDragId=null;
  document.addEventListener('dragstart',e=>{const item=e.target.closest?.('[data-route-drag-id]');if(!item)return;routeDragId=item.dataset.routeDragId;item.classList.add('is-dragging');e.dataTransfer?.setData('text/plain',routeDragId);if(e.dataTransfer)e.dataTransfer.effectAllowed='move';});
  document.addEventListener('dragend',e=>{e.target.closest?.('[data-route-drag-id]')?.classList.remove('is-dragging');$$('[data-route-drag-id]').forEach(x=>x.classList.remove('is-drop-target'));routeDragId=null;});
  document.addEventListener('dragover',e=>{const item=e.target.closest?.('[data-route-drag-id]');if(!item||!routeDragId||item.dataset.routeDragId===routeDragId)return;e.preventDefault();$$('[data-route-drag-id]').forEach(x=>x.classList.toggle('is-drop-target',x===item));});
  document.addEventListener('drop',e=>{const target=e.target.closest?.('[data-route-drag-id]');if(!target||!routeDragId)return;e.preventDefault();const source=routeDragId;routeDragId=null;reorderRouteItem(target.dataset.routeDate,source,target.dataset.routeDragId);});

  const headerEl=()=>document.querySelector('.site-header');
  let headerTick=0;
  function syncPremiumHeader(){
    if(headerTick)return; headerTick=requestAnimationFrame(()=>{headerTick=0;const h=headerEl();if(!h)return;const scrolled=window.scrollY>64;h.classList.toggle('is-scrolled',scrolled);h.classList.toggle('is-over-hero',document.body.dataset.page==='home'&&!scrolled);});
  }
  window.addEventListener('scroll',syncPremiumHeader,{passive:true});
  window.addEventListener('resize',syncPremiumHeader,{passive:true});
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
  syncPremiumHeader();
})();
