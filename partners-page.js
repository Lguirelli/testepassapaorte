(() => {
  'use strict';

  const esc = (v='') => String(v).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const icon = (name) => `<img src="./assets/icons/${name}.svg" alt="" aria-hidden="true">`;
  const photo = (src, alt, cls='') => `<figure class="partners-photo ${cls}"><img src="${src}" alt="${esc(alt)}" loading="eager" decoding="async"><figcaption>Foto ilustrativa de banco</figcaption></figure>`;

  const content = {
    hero: {
      eyebrow: 'PARA NEGÓCIOS LOCAIS',
      title: 'Faça parte do caminho de quem visita Serra Negra.',
      text: 'Conecte seu negócio aos momentos em que o visitante decide onde ir, o que fazer e quais experiências incluir na viagem.',
      image: 'assets/stock/01-mirante-vale-araucarias.jpg'
    },
    categories: [
      ['Hospedagem','parceiros'],['Gastronomia','lugar-informacao'],['Cafés','lugar-informacao'],['Compras locais','passaporte-categorias'],['Vinhos e produtores','parceiros'],['Cultura','passaporte-categorias'],['Natureza','explorar'],['Aventura','roteiro'],['Bem-estar','passaporte-historico'],['Serviços','admin-conteudo-cms']
    ],
    moments: [
      ['Descoberta','O visitante encontra opções relacionadas aos seus interesses.','assets/stock/02-jardim-nascentes.jpg'],
      ['Roteiro','O negócio pode entrar como parada coerente com o caminho planejado.','assets/stock/04-cafe-neblina-alta.jpg'],
      ['Durante a viagem','Novas sugestões podem surgir conforme contexto, disponibilidade e localização.','assets/stock/06-atelie-pedra-folha.jpg'],
      ['Memória','A experiência pode continuar registrada no Passaporte depois da visita.','assets/stock/07-casa-mel-serra.jpg']
    ],
    benefits: [
      ['Presença contextual','Apareça quando sua categoria realmente fizer sentido para o visitante.'],
      ['Descoberta qualificada','Faça parte de roteiros, interesses e momentos relacionados ao seu negócio.'],
      ['Condição especial','Se desejar, ofereça um benefício exclusivo para visitantes da rede.'],
      ['Aprendizado agregado','Entenda padrões de interesse e circulação sem depender da identificação individual do turista.']
    ],
    story: [
      ['01 · DESCOBERTA','O visitante começa pela intenção.','Interesses, tipo de viagem, tempo disponível e contexto ajudam a organizar opções mais relevantes.','assets/stock/02-jardim-nascentes.jpg','Caminho em jardim, usado como imagem ilustrativa de descoberta.'],
      ['02 · CONEXÃO','Seu negócio pode entrar no momento certo.','Em vez de aparecer para todo mundo da mesma forma, o parceiro pode fazer parte de sugestões compatíveis com aquela experiência.','assets/stock/04-cafe-neblina-alta.jpg','Interior de café, usado como imagem ilustrativa de negócio local.'],
      ['03 · EXPERIÊNCIA','A descoberta pode virar uma parada real.','O visitante inclui a opção no roteiro, consulta informações e segue sua jornada pela cidade.','assets/stock/06-atelie-pedra-folha.jpg','Ateliê artesanal, usado como imagem ilustrativa de experiência local.']
    ],
    participation: [
      ['Presença na plataforma','Página própria com informações, imagens, localização e contexto do negócio.','assets/stock/03-centro-cultural.jpg'],
      ['Roteiros e descoberta','Possibilidade de aparecer em experiências e sugestões relacionadas ao perfil da viagem.','assets/stock/02-jardim-nascentes.jpg'],
      ['Benefício para visitantes','Condição especial, cortesia, desconto ou vantagem definida pelo próprio parceiro.','assets/stock/07-casa-mel-serra.jpg'],
      ['Contato ou reserva','Quando aplicável, direcionamento para o canal de atendimento definido pelo estabelecimento.','assets/stock/05-bistro-estacao-verde.jpg'],
      ['Experiências especiais','Atividades, visitas, degustações, passeios ou produtos que possam virar uma experiência dentro da rede.','assets/stock/06-atelie-pedra-folha.jpg']
    ],
    features: [
      ['Página do negócio','Informações, imagens, localização, características e formas de contato.','lugar-informacao'],
      ['Presença em roteiros','Seu negócio pode aparecer como opção em jornadas compatíveis.','roteiro'],
      ['Benefício especial','Condições exclusivas podem ajudar a transformar descoberta em visita.','parceiros'],
      ['Experiências','Produtos, atividades ou momentos específicos podem ganhar destaque próprio.','explorar'],
      ['Passaporte','A visita pode participar da memória de viagem e das mecânicas de experiência da plataforma.','passaporte'],
      ['Inteligência agregada','Indicadores podem ajudar a entender interesse, descoberta e circulação sem expor individualmente o visitante.','admin-dashboard']
    ]
  };

  function hero(){
    return `<section class="partners-b2b-hero" aria-labelledby="partners-hero-title">
      <img class="partners-b2b-hero-image" src="${content.hero.image}" alt="Paisagem montanhosa brasileira usada como fotografia ilustrativa para a página de parceiros.">
      <div class="partners-b2b-hero-shade" aria-hidden="true"></div>
      <div class="partners-shell partners-b2b-hero-copy">
        <p class="partners-eyebrow">${content.hero.eyebrow}</p>
        <h1 id="partners-hero-title">${content.hero.title}</h1>
        <p>${content.hero.text}</p>
        <div class="partners-actions">
          <button class="button partners-button-light" type="button" data-partner-scroll="contato-parceiro">Quero ser parceiro</button>
          <button class="partners-text-button" type="button" data-partner-scroll="como-funciona">Entender como funciona <span aria-hidden="true">↘</span></button>
        </div>
      </div>
      <div class="partners-hero-index" aria-hidden="true"><span>rede local</span><span>jornada</span><span>experiência</span></div>
    </section>`;
  }

  function ecosystem(){
    return `<section class="partners-section partners-ecosystem" aria-labelledby="partners-ecosystem-title">
      <div class="partners-shell">
        <div class="partners-editorial-heading">
          <div><p class="partners-eyebrow">ECOSSISTEMA DE PARCEIROS</p><h2 id="partners-ecosystem-title">Negócios diferentes fazem parte da mesma viagem.</h2></div>
          <p>Hospedagem, gastronomia, comércio, experiências e serviços podem aparecer em diferentes momentos da jornada.</p>
        </div>
        <div class="partners-category-rail" aria-label="Categorias possíveis de parceiros">
          ${content.categories.map(([label,ico])=>`<div class="partners-category-chip">${icon(ico)}<span>${label}</span></div>`).join('')}
        </div>
      </div>
    </section>`;
  }

  function moreThanShowcase(){
    const [a,b,c,d]=content.moments;
    return `<section class="partners-section partners-mosaic" aria-labelledby="partners-mosaic-title">
      <div class="partners-shell">
        <div class="partners-editorial-heading compact"><div><p class="partners-eyebrow">PRESENÇA CONTEXTUAL</p><h2 id="partners-mosaic-title">Mais do que aparecer. Fazer sentido naquele momento.</h2></div><p>A proposta é aproximar o visitante de opções relevantes durante o planejamento e também enquanto ele vive a cidade.</p></div>
        <div class="partners-mosaic-grid">
          <article class="partners-mosaic-main">${photo(a[2],a[0],'is-wide')}<div><span>01</span><h3>${a[0]}</h3><p>${a[1]}</p></div></article>
          <article class="partners-mosaic-small has-photo">${photo(b[2],b[0])}<div><span>02</span><h3>${b[0]}</h3><p>${b[1]}</p></div></article>
          <article class="partners-mosaic-small partners-tone-cocoa"><span>03</span><h3>${c[0]}</h3><p>${c[1]}</p></article>
          <article class="partners-mosaic-small partners-tone-sand"><span>04</span><h3>${d[0]}</h3><p>${d[1]}</p></article>
        </div>
      </div>
    </section>`;
  }

  function benefits(){
    return `<section class="partners-section partners-benefits" aria-labelledby="partners-benefits-title">
      <div class="partners-shell partners-benefits-grid">
        ${photo('assets/stock/08-bem-estar-aguas-claras.jpg','Ambiente de hospitalidade e bem-estar usado como fotografia ilustrativa.','partners-benefit-photo')}
        <div class="partners-benefit-copy"><p class="partners-eyebrow">POR QUE PARTICIPAR</p><h2 id="partners-benefits-title">Sua empresa entra na experiência, não apenas em uma lista.</h2><p>O objetivo é criar conexões mais úteis entre visitantes e negócios locais, respeitando o perfil da viagem e o contexto de cada escolha.</p></div>
        ${photo('assets/stock/03-centro-cultural.jpg','Interior de espaço cultural usado como fotografia ilustrativa.','partners-benefit-photo')}
      </div>
      <div class="partners-shell partners-benefit-cards">${content.benefits.map(([t,p],i)=>`<article><span>0${i+1}</span><h3>${t}</h3><p>${p}</p></article>`).join('')}</div>
    </section>`;
  }

  function howItWorks(){
    return `<section class="partners-story" id="como-funciona" aria-labelledby="partners-story-title">
      <div class="partners-shell"><div class="partners-editorial-heading inverted"><div><p class="partners-eyebrow">COMO A REDE FUNCIONA</p><h2 id="partners-story-title">A jornada muda de forma. A conexão acompanha.</h2></div><p>Uma leitura simples da relação entre intenção, descoberta e presença de negócios locais.</p></div></div>
      <div class="partners-shell partners-story-list">${content.story.map((s,i)=>`<article class="partners-story-row ${i%2?'is-reverse':''}">${photo(s[3],s[4])}<div class="partners-story-copy"><p class="partners-eyebrow">${s[0]}</p><h3>${s[1]}</h3><p>${s[2]}</p><span class="partners-story-line" aria-hidden="true"></span></div></article>`).join('')}</div>
    </section>`;
  }

  function participation(active=0){
    const current=content.participation[active]||content.participation[0];
    return `<section class="partners-section partners-participation" aria-labelledby="partners-participation-title">
      <div class="partners-shell"><div class="partners-centered-heading"><p class="partners-eyebrow">FORMAS DE PARTICIPAÇÃO</p><h2 id="partners-participation-title">Como sua empresa pode participar</h2><p>Modelos conceituais para aprovação. Esta versão não implementa cobrança, planos ou contratação.</p></div>
      <div class="partners-tabs-layout">
        <div class="partners-tabs" role="tablist" aria-label="Formas de participação">${content.participation.map((x,i)=>`<button role="tab" aria-selected="${i===active}" tabindex="${i===active?'0':'-1'}" data-participation-tab="${i}">${x[0]}</button>`).join('')}</div>
        <div class="partners-tab-visual" role="tabpanel" tabindex="0">${photo(current[2],current[0])}<div><p class="partners-eyebrow">OPÇÃO ${String(active+1).padStart(2,'0')}</p><h3>${current[0]}</h3><p>${current[1]}</p><button class="partners-text-button dark" type="button" data-partner-scroll="contato-parceiro">Conversar sobre esta possibilidade <span aria-hidden="true">↘</span></button></div></div>
      </div></div>
    </section>`;
  }

  function manifesto(){
    return `<section class="partners-manifesto" aria-labelledby="partners-manifesto-title"><div class="partners-shell"><div><p class="partners-eyebrow">PRESENÇA NO MOMENTO CERTO</p><h2 id="partners-manifesto-title">Você não precisa disputar atenção o tempo todo.</h2></div><div><p>Precisa estar presente quando o visitante procura exatamente o tipo de experiência que você oferece.</p><button class="partners-text-button light" type="button" data-partner-scroll="o-que-o-parceiro-recebe">Conhecer a proposta <span aria-hidden="true">↘</span></button></div></div></section>`;
  }

  function features(){
    return `<section class="partners-section partners-features" id="o-que-o-parceiro-recebe" aria-labelledby="partners-features-title"><div class="partners-shell"><div class="partners-editorial-heading compact"><div><p class="partners-eyebrow">PRESENÇA DO PARCEIRO</p><h2 id="partners-features-title">O que pode fazer parte da presença do parceiro</h2></div><p>Os módulos abaixo representam possibilidades de produto, sem afirmar disponibilidade comercial definitiva.</p></div><div class="partners-feature-grid">${content.features.map(([t,p,ico],i)=>`<article class="partners-feature-card ${i===2?'tone-gold':i===4?'tone-blue':''}"><div class="partners-feature-top"><span>0${i+1}</span>${icon(ico)}</div><h3>${t}</h3><p>${p}</p></article>`).join('')}</div></div></section>`;
  }

  function journeyContact(){
    const timeline=['Descoberta','Interesse','Entrada no roteiro','Visita','Memória e relacionamento'];
    return `<section class="partners-final" aria-labelledby="partners-final-title"><div class="partners-shell partners-final-grid"><div><p class="partners-eyebrow">DA DESCOBERTA À VISITA</p><h2 id="partners-final-title">A parceria acompanha a jornada.</h2><ol class="partners-timeline">${timeline.map((x,i)=>`<li><span>${String(i+1).padStart(2,'0')}</span><strong>${x}</strong></li>`).join('')}</ol><p class="partners-final-note">Timeline conceitual. Esta demonstração não afirma que todas as etapas sejam rastreadas ou mensuradas.</p></div>${photo('assets/stock/01-mirante-vale-araucarias.jpg','Paisagem montanhosa usada como fotografia ilustrativa de jornada.','partners-final-photo')}</div><div class="partners-shell partners-contact" id="contato-parceiro"><div><p class="partners-eyebrow">CONVERSA INICIAL</p><h2>Quer entender como seu negócio pode entrar nessa rede?</h2></div><div><p>Esta versão ainda está em validação. A ideia é conversar com negócios locais para construir um modelo que faça sentido para visitantes e parceiros.</p><div class="partners-actions"><button class="button partners-button-light" type="button" data-action="partner-contact-demo">Quero conversar sobre parceria</button><a class="partners-text-button light as-link" href="#/">Ver como funciona para o visitante <span aria-hidden="true">↗</span></a></div><small>CTA demonstrativo nesta fase. Nenhum formulário ou contato real é enviado.</small></div></div></section>`;
  }

  function render(activeTab=0){
    return `<div class="partners-b2b-page">${hero()}${ecosystem()}${moreThanShowcase()}${benefits()}${howItWorks()}${participation(activeTab)}${manifesto()}${features()}${journeyContact()}</div>`;
  }

  window.PSN_PARTNER_PAGE={render,content};
})();
