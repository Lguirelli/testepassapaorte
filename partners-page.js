(() => {
  'use strict';

  const esc = (v='') => String(v).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const icon = (key, size=18) => window.PSN_ICON?.html(key,'',{size}) || '';
  const photo = (media, cls='') => `<figure class="partners-photo ${cls}"><img src="${esc(media.src)}" alt="${esc(media.alt)}" loading="eager" decoding="async"><figcaption>${esc(media.caption||'Foto ilustrativa de banco')}</figcaption></figure>`;
  const media=(src,alt,caption='Foto ilustrativa de banco')=>({src,alt,caption});

  const content = {
    hero: {
      eyebrow:'PARA NEGÓCIOS LOCAIS',
      title:'Faça parte do caminho de quem visita Serra Negra.',
      text:'Conecte seu negócio aos momentos em que o visitante decide onde ir, o que fazer e quais experiências incluir na viagem.',
      image:media('assets/stock/01-mirante-vale-araucarias.jpg','Paisagem montanhosa brasileira usada como fotografia ilustrativa para a página de parceiros.'),
      actions:[
        {label:'Quero ser parceiro',scroll:'contato-parceiro',kind:'button',iconKey:'nav.partners'},
        {label:'Entender como funciona',scroll:'como-funciona',kind:'text',iconKey:'nav.forward'}
      ],
      index:['rede local','jornada','experiência']
    },
    ecosystem:{
      eyebrow:'ECOSSISTEMA DE PARCEIROS',title:'Negócios diferentes fazem parte da mesma viagem.',text:'Hospedagem, gastronomia, comércio, experiências e serviços podem aparecer em diferentes momentos da jornada.',
      categories:[
        {label:'Hospedagem',iconKey:'nav.partners'},{label:'Gastronomia',iconKey:'place.info'},{label:'Cafés',iconKey:'place.info'},{label:'Compras locais',iconKey:'passport.categories'},{label:'Vinhos e produtores',iconKey:'nav.partners'},{label:'Cultura',iconKey:'passport.categories'},{label:'Natureza',iconKey:'nav.explore'},{label:'Aventura',iconKey:'nav.route'},{label:'Bem-estar',iconKey:'passport.history'},{label:'Serviços',iconKey:'admin.cms'}
      ]
    },
    moments:{
      eyebrow:'PRESENÇA CONTEXTUAL',title:'Mais do que aparecer. Fazer sentido naquele momento.',text:'A proposta é aproximar o visitante de opções relevantes durante o planejamento e também enquanto ele vive a cidade.',
      items:[
        {title:'Descoberta',text:'O visitante encontra opções relacionadas aos seus interesses.',image:media('assets/stock/02-jardim-nascentes.jpg','Jardim usado como imagem ilustrativa de descoberta.')},
        {title:'Roteiro',text:'O negócio pode entrar como parada coerente com o caminho planejado.',image:media('assets/stock/04-cafe-neblina-alta.jpg','Café usado como imagem ilustrativa de roteiro.')},
        {title:'Durante a viagem',text:'Novas sugestões podem surgir conforme contexto, disponibilidade e localização.',tone:'cocoa'},
        {title:'Memória',text:'A experiência pode continuar registrada no Passaporte depois da visita.',tone:'sand'}
      ]
    },
    benefits:{
      eyebrow:'POR QUE PARTICIPAR',title:'Sua empresa entra na experiência, não apenas em uma lista.',text:'O objetivo é criar conexões mais úteis entre visitantes e negócios locais, respeitando o perfil da viagem e o contexto de cada escolha.',
      leftImage:media('assets/stock/08-bem-estar-aguas-claras.jpg','Ambiente de hospitalidade e bem-estar usado como fotografia ilustrativa.'),
      rightImage:media('assets/stock/03-centro-cultural.jpg','Interior de espaço cultural usado como fotografia ilustrativa.'),
      items:[
        {title:'Presença contextual',text:'Apareça quando sua categoria realmente fizer sentido para o visitante.'},
        {title:'Descoberta qualificada',text:'Faça parte de roteiros, interesses e momentos relacionados ao seu negócio.'},
        {title:'Condição especial',text:'Se desejar, ofereça um benefício exclusivo para visitantes da rede.'},
        {title:'Aprendizado agregado',text:'Entenda padrões de interesse e circulação sem depender da identificação individual do turista.'}
      ]
    },
    story:{
      eyebrow:'COMO A REDE FUNCIONA',title:'A jornada muda de forma. A conexão acompanha.',text:'Uma leitura simples da relação entre intenção, descoberta e presença de negócios locais.',
      items:[
        {eyebrow:'01 · DESCOBERTA',title:'O visitante começa pela intenção.',text:'Interesses, tipo de viagem, tempo disponível e contexto ajudam a organizar opções mais relevantes.',image:media('assets/stock/02-jardim-nascentes.jpg','Caminho em jardim, usado como imagem ilustrativa de descoberta.')},
        {eyebrow:'02 · CONEXÃO',title:'Seu negócio pode entrar no momento certo.',text:'Em vez de aparecer para todo mundo da mesma forma, o parceiro pode fazer parte de sugestões compatíveis com aquela experiência.',image:media('assets/stock/04-cafe-neblina-alta.jpg','Interior de café, usado como imagem ilustrativa de negócio local.')},
        {eyebrow:'03 · EXPERIÊNCIA',title:'A descoberta pode virar uma parada real.',text:'O visitante inclui a opção no roteiro, consulta informações e segue sua jornada pela cidade.',image:media('assets/stock/06-atelie-pedra-folha.jpg','Ateliê artesanal, usado como imagem ilustrativa de experiência local.')}
      ]
    },
    participation:{
      eyebrow:'FORMAS DE PARTICIPAÇÃO',title:'Como sua empresa pode participar',text:'Modelos conceituais para aprovação. Esta versão não implementa cobrança, planos ou contratação.',
      cta:'Conversar sobre esta possibilidade',
      items:[
        {title:'Presença na plataforma',text:'Página própria com informações, imagens, localização e contexto do negócio.',image:media('assets/stock/03-centro-cultural.jpg','Espaço cultural usado como fotografia ilustrativa.')},
        {title:'Roteiros e descoberta',text:'Possibilidade de aparecer em experiências e sugestões relacionadas ao perfil da viagem.',image:media('assets/stock/02-jardim-nascentes.jpg','Jardim usado como fotografia ilustrativa.')},
        {title:'Benefício para visitantes',text:'Condição especial, cortesia, desconto ou vantagem definida pelo próprio parceiro.',image:media('assets/stock/07-casa-mel-serra.jpg','Produto local usado como fotografia ilustrativa.')},
        {title:'Contato ou reserva',text:'Quando aplicável, direcionamento para o canal de atendimento definido pelo estabelecimento.',image:media('assets/stock/05-bistro-estacao-verde.jpg','Restaurante usado como fotografia ilustrativa.')},
        {title:'Experiências especiais',text:'Atividades, visitas, degustações, passeios ou produtos que possam virar uma experiência dentro da rede.',image:media('assets/stock/06-atelie-pedra-folha.jpg','Ateliê usado como fotografia ilustrativa.')}
      ]
    },
    manifesto:{eyebrow:'PRESENÇA NO MOMENTO CERTO',title:'Você não precisa disputar atenção o tempo todo.',text:'Precisa estar presente quando o visitante procura exatamente o tipo de experiência que você oferece.',cta:'Conhecer a proposta'},
    features:{
      eyebrow:'PRESENÇA DO PARCEIRO',title:'O que pode fazer parte da presença do parceiro',text:'Os módulos abaixo representam possibilidades de produto, sem afirmar disponibilidade comercial definitiva.',
      items:[
        {title:'Página do negócio',text:'Informações, imagens, localização, características e formas de contato.',iconKey:'place.info'},
        {title:'Presença em roteiros',text:'Seu negócio pode aparecer como opção em jornadas compatíveis.',iconKey:'nav.route'},
        {title:'Benefício especial',text:'Condições exclusivas podem ajudar a transformar descoberta em visita.',iconKey:'nav.partners',tone:'gold'},
        {title:'Experiências',text:'Produtos, atividades ou momentos específicos podem ganhar destaque próprio.',iconKey:'nav.explore'},
        {title:'Passaporte',text:'A visita pode participar da memória de viagem e das mecânicas de experiência da plataforma.',iconKey:'nav.passport',tone:'blue'},
        {title:'Inteligência agregada',text:'Indicadores podem ajudar a entender interesse, descoberta e circulação sem expor individualmente o visitante.',iconKey:'admin.dashboard'}
      ]
    },
    final:{
      eyebrow:'DA DESCOBERTA À VISITA',title:'A parceria acompanha a jornada.',timeline:['Descoberta','Interesse','Entrada no roteiro','Visita','Memória e relacionamento'],note:'Timeline conceitual. Esta demonstração não afirma que todas as etapas sejam rastreadas ou mensuradas.',image:media('assets/stock/01-mirante-vale-araucarias.jpg','Paisagem montanhosa usada como fotografia ilustrativa de jornada.'),
      contact:{eyebrow:'CONVERSA INICIAL',title:'Quer entender como seu negócio pode entrar nessa rede?',text:'Esta versão ainda está em validação. A ideia é conversar com negócios locais para construir um modelo que faça sentido para visitantes e parceiros.',primary:'Quero conversar sobre parceria',secondary:'Ver como funciona para o visitante',note:'CTA demonstrativo nesta fase. Nenhum formulário ou contato real é enviado.'}
    },
    sections:['hero','ecosystem','moments','benefits','story','participation','manifesto','features','final']
  };

  function hero(){const c=content.hero;return `<section class="partners-b2b-hero" aria-labelledby="partners-hero-title"><img class="partners-b2b-hero-image" src="${esc(c.image.src)}" alt="${esc(c.image.alt)}"><div class="partners-b2b-hero-shade" aria-hidden="true"></div><div class="partners-shell partners-b2b-hero-copy"><p class="partners-eyebrow">${esc(c.eyebrow)}</p><h1 id="partners-hero-title">${esc(c.title)}</h1><p>${esc(c.text)}</p><div class="partners-actions">${c.actions.map((a,i)=>a.kind==='button'?`<button class="button partners-button-light" type="button" data-partner-scroll="${a.scroll}">${icon(a.iconKey)}${esc(a.label)}</button>`:`<button class="partners-text-button" type="button" data-partner-scroll="${a.scroll}">${esc(a.label)}${icon(a.iconKey,16)}</button>`).join('')}</div></div><div class="partners-hero-index" aria-hidden="true">${c.index.map(x=>`<span>${esc(x)}</span>`).join('')}</div></section>`}
  function ecosystem(){const c=content.ecosystem;return `<section class="partners-section partners-ecosystem" aria-labelledby="partners-ecosystem-title"><div class="partners-shell"><div class="partners-editorial-heading"><div><p class="partners-eyebrow">${esc(c.eyebrow)}</p><h2 id="partners-ecosystem-title">${esc(c.title)}</h2></div><p>${esc(c.text)}</p></div><div class="partners-category-rail" aria-label="Categorias possíveis de parceiros">${c.categories.map(x=>`<div class="partners-category-chip">${icon(x.iconKey)}<span>${esc(x.label)}</span></div>`).join('')}</div></div></section>`}
  function moments(){const c=content.moments;const x=c.items;return `<section class="partners-section partners-mosaic" aria-labelledby="partners-mosaic-title"><div class="partners-shell"><div class="partners-editorial-heading compact"><div><p class="partners-eyebrow">${esc(c.eyebrow)}</p><h2 id="partners-mosaic-title">${esc(c.title)}</h2></div><p>${esc(c.text)}</p></div><div class="partners-mosaic-grid">${x.map((item,i)=>{const cls=i===0?'partners-mosaic-main':`partners-mosaic-small${i===1?' has-photo':''}${item.tone?` partners-tone-${item.tone}`:''}`;return `<article class="${cls}">${item.image?photo(item.image,i===0?'is-wide':''):''}<div><span>${String(i+1).padStart(2,'0')}</span><h3>${esc(item.title)}</h3><p>${esc(item.text)}</p></div></article>`}).join('')}</div></div></section>`}
  function benefits(){const c=content.benefits;return `<section class="partners-section partners-benefits" aria-labelledby="partners-benefits-title"><div class="partners-shell partners-benefits-grid">${photo(c.leftImage,'partners-benefit-photo')}<div class="partners-benefit-copy"><p class="partners-eyebrow">${esc(c.eyebrow)}</p><h2 id="partners-benefits-title">${esc(c.title)}</h2><p>${esc(c.text)}</p></div>${photo(c.rightImage,'partners-benefit-photo')}</div><div class="partners-shell partners-benefit-cards">${c.items.map((x,i)=>`<article><span>${String(i+1).padStart(2,'0')}</span><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p></article>`).join('')}</div></section>`}
  function story(){const c=content.story;return `<section class="partners-story" id="como-funciona" aria-labelledby="partners-story-title"><div class="partners-shell"><div class="partners-editorial-heading inverted"><div><p class="partners-eyebrow">${esc(c.eyebrow)}</p><h2 id="partners-story-title">${esc(c.title)}</h2></div><p>${esc(c.text)}</p></div></div><div class="partners-shell partners-story-list">${c.items.map((x,i)=>`<article class="partners-story-row ${i%2?'is-reverse':''}">${photo(x.image)}<div class="partners-story-copy"><p class="partners-eyebrow">${esc(x.eyebrow)}</p><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p><span class="partners-story-line" aria-hidden="true"></span></div></article>`).join('')}</div></section>`}
  function participation(active=0){const c=content.participation,current=c.items[active]||c.items[0];return `<section class="partners-section partners-participation" aria-labelledby="partners-participation-title"><div class="partners-shell"><div class="partners-centered-heading"><p class="partners-eyebrow">${esc(c.eyebrow)}</p><h2 id="partners-participation-title">${esc(c.title)}</h2><p>${esc(c.text)}</p></div><div class="partners-tabs-layout"><div class="partners-tabs" role="tablist" aria-label="Formas de participação">${c.items.map((x,i)=>`<button role="tab" aria-selected="${i===active}" tabindex="${i===active?'0':'-1'}" data-participation-tab="${i}">${esc(x.title)}</button>`).join('')}</div><div class="partners-tab-visual" role="tabpanel" tabindex="0">${photo(current.image)}<div><p class="partners-eyebrow">OPÇÃO ${String(active+1).padStart(2,'0')}</p><h3>${esc(current.title)}</h3><p>${esc(current.text)}</p><button class="partners-text-button dark" type="button" data-partner-scroll="contato-parceiro">${esc(c.cta)}${icon('nav.forward',16)}</button></div></div></div></div></section>`}
  function manifesto(){const c=content.manifesto;return `<section class="partners-manifesto" aria-labelledby="partners-manifesto-title"><div class="partners-shell"><div><p class="partners-eyebrow">${esc(c.eyebrow)}</p><h2 id="partners-manifesto-title">${esc(c.title)}</h2></div><div><p>${esc(c.text)}</p><button class="partners-text-button light" type="button" data-partner-scroll="o-que-o-parceiro-recebe">${esc(c.cta)}${icon('nav.forward',16)}</button></div></div></section>`}
  function features(){const c=content.features;return `<section class="partners-section partners-features" id="o-que-o-parceiro-recebe" aria-labelledby="partners-features-title"><div class="partners-shell"><div class="partners-editorial-heading compact"><div><p class="partners-eyebrow">${esc(c.eyebrow)}</p><h2 id="partners-features-title">${esc(c.title)}</h2></div><p>${esc(c.text)}</p></div><div class="partners-feature-grid">${c.items.map((x,i)=>`<article class="partners-feature-card ${x.tone?`tone-${x.tone}`:''}"><div class="partners-feature-top"><span>${String(i+1).padStart(2,'0')}</span>${icon(x.iconKey)}</div><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p></article>`).join('')}</div></div></section>`}
  function finalSection(){const c=content.final,contact=c.contact;return `<section class="partners-final" aria-labelledby="partners-final-title"><div class="partners-shell partners-final-grid"><div><p class="partners-eyebrow">${esc(c.eyebrow)}</p><h2 id="partners-final-title">${esc(c.title)}</h2><ol class="partners-timeline">${c.timeline.map((x,i)=>`<li><span>${String(i+1).padStart(2,'0')}</span><strong>${esc(x)}</strong></li>`).join('')}</ol><p class="partners-final-note">${esc(c.note)}</p></div>${photo(c.image,'partners-final-photo')}</div><div class="partners-shell partners-contact" id="contato-parceiro"><div><p class="partners-eyebrow">${esc(contact.eyebrow)}</p><h2>${esc(contact.title)}</h2></div><div><p>${esc(contact.text)}</p><div class="partners-actions"><button class="button partners-button-light" type="button" data-action="partner-contact-demo">${icon('nav.partners')}${esc(contact.primary)}</button><a class="partners-text-button light as-link" href="#/">${esc(contact.secondary)}${icon('nav.external',16)}</a></div><small>${esc(contact.note)}</small></div></div></section>`}

  const renderers={hero,ecosystem,moments,benefits,story,participation,manifesto,features,final:finalSection};
  function render(activeTab=0){return `<div class="partners-b2b-page">${content.sections.map(name=>name==='participation'?renderers[name](activeTab):renderers[name]()).join('')}</div>`}
  window.PSN_PARTNER_PAGE={render,content};
})();
