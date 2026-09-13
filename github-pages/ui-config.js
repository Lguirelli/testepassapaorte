(() => {
  'use strict';
  window.PSN_UI_CONFIG = {
    storeVersion: 3,
    navigation: {
      main: [
        { label:'Explorar', href:'#/explorar', iconKey:'nav.explore' },
        { label:'Pontos turísticos', href:'#/explorar?relation=public_point', iconKey:'map.place' },
        { label:'Roteiros', href:'#/viagens/demo-trip-001/roteiro', iconKey:'nav.route' },
        { label:'Mapa', href:'#/explorar?view=map', iconKey:'nav.map' },
        { label:'Para parceiros', href:'#/parceiros', iconKey:'nav.partners' },
        { label:'Montar meu roteiro', href:'#/roteiro', iconKey:'route.add', cta:true }
      ],
      pageMap: { explorar:'#/explorar', roteiro:'#/viagens/demo-trip-001/roteiro', viagens:'#/viagens/demo-trip-001/roteiro', parceiros:'#/parceiros', 'para-parceiros':'#/parceiros' }
    },
    themeOptions: [
      {value:'system',label:'Sistema',iconKey:'theme.system'},
      {value:'light',label:'Claro',iconKey:'theme.light'},
      {value:'dark',label:'Escuro',iconKey:'theme.dark'}
    ],
    footer: {
      description:'Demonstração visual e funcional. Parceiros e jornada continuam sintéticos; atrativos públicos destacados usam pesquisa em fontes oficiais.',
      groups:[
        {label:'Descobrir',items:[{label:'Explorar',href:'#/explorar'},{label:'Montar roteiro',href:'#/roteiro'},{label:'Meu Passaporte',href:'#/meu-passaporte'}]},
        {label:'Ecossistema',items:[{label:'Para parceiros',href:'#/parceiros'},{label:'Admin demo',href:'#/admin'},{label:'Restaurar demo',action:'reset-demo'}]},
        {label:'Transparência',items:[{label:'Privacidade',href:'#/privacidade'},{label:'Termos de uso',href:'#/termos'},{label:'Cookies e armazenamento',href:'#/cookies'},{label:'Acessibilidade',href:'#/acessibilidade'}]}
      ]
    },
    pageMeta: {
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
    },
    labels: {
      cost: {free:'Sem custo',paid:'Pago',mixed:'Misto',paid_with_booking:'Pago · reserva',not_informed:'Confirmar'},
      environment: {indoor:'Ambiente interno',outdoor:'Ao ar livre',mixed:'Misto'},
      relation: {partner:'Parceiro demo',public_point:'Ponto turístico demo'},
      response: {within_1_hour:'Em até 1 hora (demo)',same_day:'No mesmo dia (demo)',within_few_hours:'Em algumas horas (demo)'},
      status: {
        planned:{label:'Planejado',iconKey:'calendar.planned',tone:'warning'},
        fixed:{label:'Fixo',iconKey:'route.fix',tone:'neutral'},
        visited:{label:'Visita registrada',iconKey:'qr.visited',tone:'success'},
        draft:{label:'Rascunho',iconKey:'admin.draft',tone:'warning'},
        archived:{label:'Arquivado',iconKey:'admin.archive',tone:'danger'},
        published:{label:'Publicado',iconKey:'admin.publish',tone:'success'}
      }
    },
    weather: {
      partly_cloudy:{label:'Parcialmente nublado',iconKey:'weather.partlyCloudy'},
      rain:{label:'Chuva',iconKey:'weather.rain'},
      clear:{label:'Céu aberto',iconKey:'theme.light'},
      cloudy:{label:'Nublado',iconKey:'weather.cloudy'},
      storm:{label:'Tempestade',iconKey:'weather.storm'}
    },
    categoryUi: {
      'cat-natureza':{iconKey:'map.place',tone:'sage'},
      'cat-gastronomia':{iconKey:'nav.partners',tone:'cocoa'},
      'cat-cafes':{iconKey:'place.info',tone:'yellow'},
      'cat-cultura':{iconKey:'passport.categories',tone:'blue'},
      'cat-compras':{iconKey:'nav.partners',tone:'olive'},
      'cat-bem-estar':{iconKey:'passport.history',tone:'coconut'}
    },
    explore: {
      filters:[
        {id:'explore-relation',stateKey:'relation',label:'Relação',iconKey:'nav.partners',options:[['','Todos'],['partner','Parceiros'],['public_point','Pontos turísticos']]},
        {id:'explore-environment',stateKey:'environment',label:'Ambiente',iconKey:'place.outdoor',options:[['','Qualquer'],['indoor','Interno'],['outdoor','Ao ar livre'],['mixed','Misto']]},
        {id:'explore-cost',stateKey:'cost',label:'Custo',iconKey:'place.cost',options:[['','Qualquer'],['free','Sem custo'],['paid','Pago'],['mixed','Misto']]}
      ]
    },
    home: {
      quickSearch:['Natureza','Cafés','Cultura','Sem custo'],
      routeTypes:[
        {id:'primeira-visita',label:'Primeira visita',title:'Um começo sem pressa',body:'Uma seleção demonstrativa que combina paisagem, centro e uma pausa gastronômica.',placeIds:['place-mirante-araucarias','place-centro-cultural','place-cafe-neblina']},
        {id:'natureza',label:'Natureza',title:'Verde e horizonte',body:'Paradas ao ar livre e tempo livre para caminhar sem transformar o dia em uma corrida.',placeIds:['place-jardim-nascentes','place-mirante-araucarias','place-casa-mel']},
        {id:'gastronomia',label:'Gastronomia',title:'Sabores pelo caminho',body:'Uma sequência demonstrativa de café, almoço e produção local, sempre com dados fictícios.',placeIds:['place-cafe-neblina','place-bistro-estacao','place-casa-mel']},
        {id:'chuva',label:'Dia de chuva',title:'Descobertas em ambiente interno',body:'Alternativas demonstrativas para reorganizar a viagem quando o clima muda.',placeIds:['place-centro-cultural','place-atelie-pedra-folha','place-aguas-claras']}
      ],
      faq:[
        {question:'Preciso criar conta?',answer:'Não nesta demonstração. O estado é salvo somente no navegador para permitir validar os fluxos.'},
        {question:'Como funcionam os roteiros?',answer:'Você responde ao onboarding, recebe um roteiro demonstrativo e pode mover, fixar, remover ou adicionar paradas sem reconstrução automática.'},
        {question:'Como funciona o Passaporte?',answer:'Planejamento e visita registrada são estados diferentes. O Passaporte reúne apenas os registros demonstrativos confirmados.'},
        {question:'Como funciona o QR?',answer:'O QR real ainda não está integrado nesta fase. O registro manual existe somente para validar a experiência e permanece identificado como demonstração.'},
        {question:'Posso alterar o roteiro?',answer:'Sim. As mudanças locais são persistidas no navegador e refletidas também no calendário.'}
      ],
      passportSteps:[
        {label:'Explorar',iconKey:'nav.explore'},
        {label:'Montar',iconKey:'route.add'},
        {label:'Visitar',iconKey:'map.navigate'},
        {label:'Registrar',iconKey:'qr.visited'},
        {label:'Construir o Passaporte',iconKey:'nav.passport'}
      ],
      sections:[
        {id:'hero',type:'homeHero',enabled:true,order:10},{id:'spots',type:'touristSpots',enabled:true,order:20},{id:'partners',type:'partnerLoop',enabled:true,order:30},{id:'route-visual',type:'routeVisual',enabled:true,order:40},{id:'route-types',type:'routeTypesShowcase',enabled:true,order:50},{id:'route-cards',type:'routeTypeCards',enabled:true,order:60},{id:'editorial',type:'editorialDiscovery',enabled:true,order:70},{id:'categories',type:'partnerCategories',enabled:true,order:80},{id:'faq',type:'homeFaq',enabled:true,order:90},{id:'passport',type:'passportIntro',enabled:true,order:100},{id:'map',type:'mapExplore',enabled:true,order:110},{id:'final',type:'finalCta',enabled:true,order:120}
      ]
    },
    onboarding: [
      {key:'dates',title:'Quando você vai?',lead:'A demo usa o período definido pela viagem atual.',choiceMode:'tripDates',iconKey:'nav.calendar'},
      {key:'party',title:'Com quem você viaja?',choices:[['Casal','profile.couple'],['Família','profile.family'],['Amigos','profile.friends'],['Sozinho','nav.account']]},
      {key:'interests',title:'O que você quer encontrar?',multi:true,choiceMode:'categories'},
      {key:'intent',title:'Qual é a intenção da viagem?',choices:[['Conhecer e descobrir','nav.explore'],['Relaxar','profile.relax'],['Comer bem','place.info'],['Ver paisagens','map.place']]},
      {key:'pace',title:'Qual ritmo combina com vocês?',choices:[['Tranquilo','profile.paceSlow'],['Equilibrado','profile.paceBalanced'],['Ativo','profile.paceActive']]},
      {key:'transport',title:'Como vocês vão circular?',choices:[['Carro','profile.car'],['A pé','profile.walk'],['Táxi / app','profile.taxi'],['Ainda não sei','profile.unknown']]},
      {key:'needs',title:'Alguma necessidade importante?',choices:[['Nenhuma necessidade específica','profile.none'],['Preferir opções sem custo','profile.free'],['Acessibilidade parcial ou completa','profile.accessibility'],['Restrição alimentar','profile.foodRestriction']]},
      {key:'review',title:'Pronto para montar?',review:true,iconKey:'route.save'}
    ],
    passport: {
      chapters:[
        {id:'cover',title:'Passaporte Serra Negra',eyebrow:'Capa de validação',iconKey:'nav.passport'},
        {id:'identity',title:'Identificação',eyebrow:'Viajante demo',iconKey:'nav.account'},
        {id:'ticket',title:'Bilhete da viagem',eyebrow:'Viagem atual',iconKey:'passport.ticket'},
        {id:'stamps',title:'Marcas da viagem',eyebrow:'Carimbos demo',iconKey:'qr.visited'},
        {id:'discoveries',title:'Descobertas',eyebrow:'Fora do roteiro',iconKey:'nav.explore'},
        {id:'categories',title:'Categorias vividas',eyebrow:'Interesses encontrados',iconKey:'passport.categories'},
        {id:'path',title:'Caminho vivido',eyebrow:'Memória',iconKey:'nav.route'},
        {id:'archive',title:'Arquivo de viagens',eyebrow:'Viagens demo',iconKey:'passport.history'},
        {id:'summary',title:'Resumo',eyebrow:'Planejado ≠ registrado',iconKey:'passport.shareTicket'}
      ]
    },
    admin: {
      modules:[
        {key:'places',label:'Lugares',iconKey:'map.place'},
        {key:'partners',label:'Parceiros',iconKey:'nav.partners'},
        {key:'experiences',label:'Experiências',iconKey:'map.experience'},
        {key:'events',label:'Eventos',iconKey:'map.event'},
        {key:'categories',label:'Categorias',iconKey:'admin.sections'},
        {key:'sources',label:'Fontes',iconKey:'admin.sources'}
      ],
      statusOptions:['published','draft','archived','active'],
      createTemplates:{
        places:{placeType:'tourist_point',commercialRelation:'public_point',categoryIds:['cat-cultura'],shortDescription:'Novo conteúdo criado localmente no Admin de demonstração.',environment:'indoor',costType:'free',durationMinutes:60,openingHours:{type:'demo',text:'09:00–17:00'},location:{lat:-22.61,lng:-46.70,display:'Área de demonstração, Serra Negra, SP'},status:'draft',sourceIds:['source-synthetic']}
      },
      schemas:{
        places:[
          {name:'name',label:'Nome',type:'text'},
          {name:'slug',label:'Slug',type:'text'},
          {name:'shortDescription',label:'Descrição curta',type:'textarea'},
          {name:'openingHours',path:'openingHours.text',label:'Horário',type:'text'},
          {name:'status',label:'Status',type:'select',options:['published','draft','archived','active']}
        ],
        partners:[
          {name:'status',label:'Status',type:'select',options:['published','draft','archived','active']},
          {name:'responseTime',label:'Tempo de resposta',type:'select',options:['within_1_hour','same_day','within_few_hours']}
        ],
        experiences:[
          {name:'name',label:'Nome',type:'text'},
          {name:'status',label:'Status',type:'select',options:['published','draft','archived','active']}
        ],
        events:[
          {name:'name',label:'Nome',type:'text'},
          {name:'status',label:'Status',type:'select',options:['published','draft','archived','active']}
        ],
        categories:[
          {name:'name',label:'Nome',type:'text'},
          {name:'enabled',label:'Disponibilidade',type:'select',options:[['true','Ativa'],['false','Desativada']],coerce:'boolean'}
        ],
        sources:[
          {name:'sourceName',label:'Nome da fonte',type:'text'},
          {name:'sourceUrl',label:'URL da fonte',type:'url'},
          {name:'verificationStatus',label:'Verificação',type:'select',options:['demo_only','verified','pending','synthetic']},
          {name:'notes',label:'Notas',type:'textarea'}
        ]
      }
    },
    legal: {
      privacidade:{title:'Política de Privacidade da demonstração',eyebrow:'Transparência',lead:'Esta página descreve somente o comportamento desta versão de validação, sem presumir o funcionamento futuro da plataforma.',sections:[
        ['Dados tratados nesta versão','A demonstração não possui cadastro real, autenticação de produção, CRM, pixels publicitários, mapas externos ou envio de formulários para servidor. O roteiro, as alterações do Admin demo, as visitas demonstrativas e a preferência de tema ficam armazenados localmente no navegador.'],
        ['Finalidade','O armazenamento local existe exclusivamente para permitir validar continuidade de navegação e estados da interface. Esses dados não são apresentados como registros reais de viagem ou presença.'],
        ['Compartilhamento e fornecedores','Nesta build estática não há integração ativa com fornecedores externos para analytics, autenticação, publicidade, mapas, reservas ou atendimento. Quando qualquer integração real for adicionada, esta política deverá ser revista antes de produção.'],
        ['Retenção e controle','Os dados demonstrativos permanecem no armazenamento local deste navegador até serem limpos pelo usuário. Você pode usar “Restaurar demo” para recriar o estado inicial ou apagar todos os dados locais desta demonstração.','clear-local-data'],
        ['Contato e validação jurídica','Dados do operador comercial e canal jurídico ainda não foram fornecidos para esta build de validação e, por isso, não são inventados aqui. Antes de produção, a política precisa refletir o operador real, fornecedores, bases legais e direitos aplicáveis, com revisão jurídica quando necessário.']
      ]},
      termos:{title:'Termos de uso da demonstração',eyebrow:'Condições de uso',lead:'Estes termos descrevem a finalidade desta versão navegável e não substituem termos comerciais futuros.',sections:[
        ['Finalidade','Esta versão existe para validação visual e funcional. Lugares, parceiros, clima, visitas, contatos, eventos e demais dados exibidos são sintéticos.'],
        ['Sem transação real','Nenhuma ação desta demonstração conclui reserva, pagamento, contratação, visita presencial ou contato comercial. Botões externos demonstrativos são bloqueados justamente para evitar essa interpretação.'],
        ['Contas e permissões','Não há autenticação real nesta publicação estática. O Admin é um simulador local. Qualquer versão de produção com papéis diferentes deverá aplicar autorização no frontend e no backend.'],
        ['Disponibilidade e responsabilidade','A demonstração pode mudar ou ser reiniciada a qualquer momento e não oferece garantia de disponibilidade, conteúdo turístico atual ou funcionamento de integrações futuras.'],
        ['Versão de produção','Antes de uma operação comercial real, estes termos deverão ser substituídos ou ampliados conforme o modelo de negócio, operador, legislação e jurisdição aplicáveis.']
      ]},
      cookies:{title:'Cookies e armazenamento',eyebrow:'Preferências',lead:'A demonstração foi construída para evitar rastreamento externo e documentar as tecnologias que realmente utiliza.',sections:[
        ['Cookies','Esta build não instala cookies opcionais de analytics, publicidade ou remarketing e não carrega scripts de terceiros que dependam de consentimento.'],
        ['Armazenamento local','O navegador utiliza localStorage para salvar o estado da demonstração e a preferência de aparência. Isso permite que roteiro, Passaporte, alterações locais do Admin e tema persistam após recarregar a página.'],
        ['Consentimento','Como não há cookies opcionais nem ferramentas externas de rastreamento nesta build, não exibimos um banner de consentimento artificial. Caso ferramentas opcionais sejam adicionadas, elas deverão ser bloqueadas até o consentimento quando a legislação aplicável assim exigir.'],
        ['Limpar preferências','Você pode apagar o estado e as preferências locais desta demonstração a qualquer momento.','clear-local-data']
      ]},
      acessibilidade:{title:'Acessibilidade',eyebrow:'Experiência inclusiva',lead:'A acessibilidade é tratada como requisito da construção, não como acabamento posterior.',sections:[
        ['Navegação','A demo inclui link de salto para o conteúdo, foco visível, navegação por teclado, fechamento do menu móvel por Escape, labels em formulários e controles com nomes acessíveis.'],
        ['Movimento e contraste','As transições respeitam prefers-reduced-motion. Estados importantes não devem depender apenas de cor e a paleta usa tokens semânticos de contraste da interface.'],
        ['Imagens e mapas','As mídias demonstrativas recebem descrição funcional. Mapas abstratos não substituem informação textual de localização.'],
        ['Limites desta validação','Esta página não declara certificação formal. Auditorias automatizadas e testes assistivos completos continuam necessários antes de produção.']
      ]}
    }
  };
})();
