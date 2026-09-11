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
    adminPreview:null
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
  function cardMedia(place){
    const ico = place.commercialRelation==='partner' ? 'parceiros' : 'mapa-ponto-turistico';
    return `<div class="card-media">${icon(ico)}<span class="media-label">Imagem final pendente</span></div>`;
  }
  function placeCard(place){
    const href = place.commercialRelation==='partner' ? `#/parceiros/${place.slug}` : `#/lugares/${place.slug}`;
    return `<article class="card">
      ${cardMedia(place)}
      <div class="actions"><span class="badge">${esc(relationLabel(place.commercialRelation))}</span>${statusBadges(place)}</div>
      <a class="stretched" href="${href}">${esc(place.name)}</a>
      <p class="muted">${esc(place.shortDescription)}</p>
      <div class="actions"><span class="badge">${esc(costLabel(place.costType))}</span><span class="badge">${esc(place.durationMinutes)} min</span></div>
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

  function renderHome(){
    const tourists=publicPlaces().filter(p=>p.placeType==='tourist_point').slice(0,3);
    const partners=publicPlaces().filter(p=>p.commercialRelation==='partner').slice(0,3);
    const cats=mergedCollection('categories').filter(c=>c.enabled!==false).slice(0,6);
    const visits=state.trip.visits.length;
    app.innerHTML = `
      <section class="hero">
        <div><p class="eyebrow">Descoberta · planejamento · memória</p><h1>Descubra Serra Negra do seu jeito.</h1><p class="lead">Uma demonstração navegável para explorar lugares, organizar uma viagem e guardar o que foi vivido.</p><p class="muted">Todos os locais, contatos, clima e registros desta versão são fictícios.</p><div class="actions"><a class="button primary" href="#/explorar">Explorar demonstração ${icon('avancar')}</a><a class="button" href="#/roteiro">Montar roteiro</a></div></div>
        <div class="hero-visual" aria-label="Placeholder visual"><div class="mark">PASSAPORTE<br><strong>DEMO</strong><br>12 SET 2026</div></div>
      </section>
      ${section('Conheça Serra Negra','Primeiros caminhos',`<div class="grid">${tourists.map(placeCard).join('')}</div>`,`<a href="#/explorar">Ver todos</a>`)}
      ${section('Encontros pelo caminho','Parceiros de demonstração',`<p class="lead">Negócios fictícios permitem validar descoberta, contato e inclusão no roteiro sem publicar dados reais.</p><div class="grid">${partners.map(placeCard).join('')}</div>`)}
      ${section('Uma viagem com espaço para você','Planejamento',`<div class="grid">${cats.slice(0,3).map(c=>`<article class="panel"><span class="badge">${esc(c.name)}</span><h3>Explore ${esc(c.name.toLowerCase())}</h3><p class="muted">Use este interesse para filtrar lugares e compor a viagem.</p><a href="#/roteiro" class="button">Usar no roteiro</a></article>`).join('')}</div>`)}
      ${section('Explore por interesse','Categorias',`<div class="chips">${cats.map(c=>`<a class="button chip" href="#/explorar?category=${encodeURIComponent(c.id)}">${esc(c.name)}</a>`).join('')}</div>`)}
      ${section('Seu Passaporte','Memória da viagem',`<div class="two-col"><div><p class="lead">O roteiro guarda o que foi planejado. O Passaporte guarda o que foi registrado.</p><p>Esta demo já contém <strong>${visits} registros de visita</strong>, incluindo uma descoberta fora do roteiro.</p><a href="#/meu-passaporte" class="button primary">Abrir meu Passaporte</a></div>${mockMap(publicPlaces().slice(0,4))}</div>`)}
      ${section('Por onde começa a sua viagem?','Próximo passo',`<div class="actions"><a class="button primary" href="#/roteiro">Começar planejamento</a><a class="button" href="#/viagens/demo-trip-001/roteiro">Abrir viagem pronta</a></div>`)}
    `;
  }

  function parseQueryFromHash(){
    const raw=location.hash.slice(1); const qidx=raw.indexOf('?');
    return new URLSearchParams(qidx>=0?raw.slice(qidx+1):'');
  }
  function renderExplore(){
    const qs=parseQueryFromHash();
    if(qs.get('category')) ui.explore.category=qs.get('category');
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

  function renderPartner(p){
    const partner=partnerForPlace(p.id); const exps=experiencesFor(p.id); const suggestions=publicPlaces().filter(x=>x.id!==p.id).slice(0,3);
    app.innerHTML = `<a href="#/explorar">← Voltar a explorar</a><section class="hero"><div><p class="eyebrow">Parceiro fictício · estabelecimento</p><h1 class="compact">${esc(p.name)}</h1><p class="lead">${esc(p.shortDescription)}</p><div class="actions">${statusBadges(p)}<button class="primary" data-action="add-trip" data-place="${p.id}">${plannedItemFor(p.id)?'Já está no roteiro':'Adicionar ao roteiro'}</button></div></div><div class="hero-visual"><div class="mark">PARCEIRO<br><strong>DEMO</strong></div></div></section>
      <section class="section two-col"><div><p class="eyebrow">Conheça o negócio</p><h2>${esc(p.name)}</h2><p class="lead">Este conteúdo comercial é inteiramente sintético e serve para validar a experiência de parceiros.</p><div class="grid two">${exps.map(e=>`<article class="panel"><span class="badge">Experiência</span><h3>${esc(e.name)}</h3><p class="muted">${e.durationMinutes} min · ${esc(costLabel(e.costType))}</p>${e.bookingType==='external_required'?'<button data-action="demo-contact">Solicitar reserva demo</button>':''}</article>`).join('')}</div></div><aside class="sidebar"><div class="panel"><h3>Informações práticas</h3><dl class="info-list"><div><dt>Horário</dt><dd>${esc(p.openingHours?.text||'Demo')}</dd></div><div><dt>Tempo sugerido</dt><dd>${p.durationMinutes} min</dd></div><div><dt>Ambiente</dt><dd>${esc(environmentLabel(p.environment))}</dd></div><div><dt>Custo</dt><dd>${esc(costLabel(p.costType))}</dd></div></dl><h3>Contato de demonstração</h3><div class="actions"><button data-action="demo-contact">WhatsApp</button><button data-action="demo-contact">Instagram</button><button data-action="demo-contact">Site</button></div><p class="muted"><strong>Tempo de resposta declarado:</strong> ${esc(responseLabel(partner?.responseTime))}</p></div><div class="panel"><h3>No seu Passaporte</h3><p>${visitFor(p.id)?'Há uma visita demo registrada para este parceiro.':plannedItemFor(p.id)?'Este parceiro está planejado, mas ainda não foi registrado como visita.':'Ainda não está no roteiro nem no Passaporte.'}</p><button data-action="register-visit" data-place="${p.id}">${visitFor(p.id)?'Visita registrada':'Registrar visita demo'}</button></div></aside></section>
      ${section('Localização','Área de demonstração',mockMap([p,...suggestions]))}
      ${section('Outros caminhos','Continue explorando',`<div class="grid">${suggestions.map(placeCard).join('')}</div>`)}
    `;
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
    document.title='Passaporte Serra Negra — Demo';
    if(parts.length===0)renderHome();
    else if(parts[0]==='explorar')renderExplore();
    else if(parts[0]==='lugares'&&parts[1])renderPlace(parts[1],false);
    else if(parts[0]==='parceiros'&&parts[1])renderPlace(parts[1],true);
    else if(parts[0]==='roteiro'&&parts.length===1)renderOnboarding();
    else if(parts[0]==='viagens'&&parts[2]==='roteiro')renderRoute();
    else if(parts[0]==='viagens'&&parts[2]==='calendario')renderCalendar();
    else if(parts[0]==='meu-passaporte')renderPassport();
    else if(parts[0]==='admin')renderAdmin();
    else renderNotFound();
    app.focus({preventScroll:true});
  }

  document.addEventListener('click',e=>{
    const t=e.target.closest('button,[data-action],[data-filter-category],[data-day],[data-day-calendar],[data-calendar-mode],[data-passport-page],[data-admin-kind],[data-admin-edit],[data-route-action],[data-onboard-key]'); if(!t)return;
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
    if(a==='toggle-menu'){const nav=$('#main-nav');const open=nav.classList.toggle('open');t.setAttribute('aria-expanded',String(open));return}
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

  window.addEventListener('hashchange',()=>{const nav=$('#main-nav');nav?.classList.remove('open');render()});
  const themeSelect=$('#theme-select');
  const savedTheme=localStorage.getItem(THEME_STORE)||'system'; document.documentElement.dataset.theme=savedTheme; themeSelect.value=savedTheme;
  themeSelect.addEventListener('change',()=>{document.documentElement.dataset.theme=themeSelect.value;localStorage.setItem(THEME_STORE,themeSelect.value)});

  render();
})();
