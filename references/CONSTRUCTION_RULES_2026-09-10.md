# INSTRUÇÕES PARA CRIAÇÃO DO SITE

## 1. CONTROLE DE ACESSO E PERMISSÕES

Caso o sistema possua diferentes tipos de usuários, como administradores, parceiros, clientes, editores ou outros níveis de acesso, implementar **RBAC, Role-Based Access Control**, ou Controle de Acesso Baseado em Funções.

O objetivo é garantir que cada usuário consiga visualizar e executar somente as ações autorizadas para sua função.

### 1.1 Estrutura de usuários

A arquitetura deve permitir a criação de diferentes papéis, por exemplo:

- administrador;
- usuário comum;
- parceiro;
- editor;
- moderador;
- outros papéis que possam ser adicionados futuramente.

As permissões não devem depender apenas da interface visual.

A estrutura deve permitir definir claramente:

- quais páginas cada função pode acessar;
- quais informações cada função pode visualizar;
- quais ações cada função pode realizar;
- quais dados podem ser criados;
- quais dados podem ser modificados;
- quais dados podem ser excluídos;
- quais funções administrativas são exclusivas de administradores.

### 1.2 Autenticação e RBAC com Clerk

Quando compatível com a stack utilizada, usar **Clerk** para autenticação, gerenciamento de usuários, organizações, roles e permissões.

A implementação deve seguir a documentação oficial e os padrões recomendados pelo serviço.

A lógica de autorização deve existir em duas camadas independentes.

#### Frontend

Utilizar os recursos de autorização do Clerk para controlar a renderização da interface.

Elementos restritos devem aparecer somente para usuários autorizados.

Exemplo:

um usuário administrador pode visualizar opções como:

- configurações da equipe;
- gestão de usuários;
- painel administrativo;
- configurações sensíveis.

Usuários sem a permissão correspondente não devem visualizar esses elementos.

Os componentes condicionais do Clerk, como `Show`, podem ser utilizados para controlar essa exibição.

#### Backend

Ocultar elementos no frontend **não é suficiente para proteger o sistema**.

Todas as rotas, APIs, Server Actions, mutations e operações sensíveis também devem validar permissões no servidor.

Utilizar os mecanismos de autorização fornecidos pelo Clerk, incluindo verificações como `has()` quando aplicável.

O backend deve validar:

- se o usuário está autenticado;
- qual função possui;
- quais permissões possui;
- se possui autorização para acessar aquele recurso;
- se possui autorização para executar aquela ação.

Nunca confiar em informações de função ou permissão enviadas diretamente pelo navegador.

### 1.3 Princípio de segurança

A regra obrigatória é:

**frontend controla o que o usuário vê; backend controla o que o usuário realmente pode fazer.**

A segurança deve permanecer válida mesmo que alguém:

- altere manualmente o HTML;
- modifique JavaScript no navegador;
- tente acessar diretamente uma URL protegida;
- envie requisições diretamente à API;
- tente executar uma ação sem utilizar a interface normal.

---

# 2. PRIVACIDADE, TERMOS E CONFORMIDADE

Criar uma camada de conformidade adequada ao tipo de site, às tecnologias utilizadas e aos locais onde o serviço opera.

A implementação técnica não deve assumir que textos genéricos garantem conformidade jurídica.

Sempre que existir uma decisão jurídica dependente da legislação aplicável, sinalizar explicitamente que ela precisa de validação jurídica especializada.

## 2.1 Página de Política de Privacidade

Criar uma página específica de Política de Privacidade.

Ela deve explicar, de maneira clara:

- quais dados são coletados;
- por que são coletados;
- como são utilizados;
- quais dados são obrigatórios;
- quais dados são opcionais;
- com quem podem ser compartilhados;
- quais fornecedores processam dados;
- durante quanto tempo os dados são mantidos;
- como o usuário pode solicitar informações, correção ou exclusão quando aplicável;
- como entrar em contato com o responsável pelo serviço.

A política deve refletir o funcionamento real do site.

Não incluir práticas que o sistema não realiza.

Não esconder práticas que o sistema realiza.

---

# 3. TERMOS E CONDIÇÕES

Criar uma página de **Termos e Condições de Uso**.

Os termos devem abordar, conforme aplicável:

- finalidade da plataforma;
- regras de utilização;
- direitos e responsabilidades dos usuários;
- limitações do serviço;
- propriedade intelectual;
- conteúdo enviado por usuários;
- criação e encerramento de contas;
- atividades proibidas;
- disponibilidade do serviço;
- limitações de responsabilidade juridicamente cabíveis;
- regras comerciais;
- formas de contato;
- legislação e jurisdição aplicáveis quando juridicamente adequadas.

Os termos devem ser compatíveis com o modelo de negócio real.

---

# 4. POLÍTICA DE COOKIES

Criar uma página de **Política de Cookies**.

Documentar:

- quais cookies são utilizados;
- finalidade de cada categoria;
- duração;
- origem;
- cookies próprios;
- cookies de terceiros;
- ferramentas de analytics;
- publicidade, caso exista;
- preferências;
- cookies estritamente necessários.

Avaliar se a legislação aplicável exige consentimento prévio para determinados cookies ou tecnologias de rastreamento.

Caso seja necessário, implementar gerenciamento de consentimento.

Cookies estritamente necessários devem ser tratados separadamente dos cookies opcionais.

---

# 5. CONSENTIMENTO PARA COOKIES

Verificar se os serviços efetivamente utilizados exigem consentimento antes de serem carregados.

Caso a resposta seja positiva, implementar uma solução de consentimento capaz de:

- aceitar cookies opcionais;
- rejeitar cookies opcionais;
- configurar preferências;
- manter cookies essenciais funcionando;
- registrar preferências quando necessário;
- permitir alteração posterior da escolha.

Não carregar scripts opcionais antes do consentimento quando isso for exigido pela legislação aplicável.

A interface não deve induzir o usuário a aceitar.

---

# 6. POLÍTICA DE REEMBOLSO

Caso o site venda produtos, serviços, assinaturas ou reservas, criar uma política de cancelamento e reembolso adequada ao modelo de negócio.

Ela deve esclarecer:

- quando existe direito a reembolso;
- quando não existe;
- prazos;
- procedimentos de solicitação;
- cancelamentos;
- estornos;
- pagamentos recorrentes;
- situações excepcionais;
- forma de contato.

Não criar uma política de reembolso artificial caso ela não seja aplicável ao serviço.

A política deve respeitar a legislação de defesa do consumidor pertinente.

---

# 7. CONSENTIMENTO EM FORMULÁRIOS

Revisar todos os formulários do site.

Quando necessário, adicionar consentimento claro para tratamento dos dados enviados.

Não utilizar consentimentos genéricos ou caixas pré-marcadas quando isso não for adequado.

O usuário deve compreender:

- para que os dados serão utilizados;
- se receberá contato;
- se será incluído em campanhas;
- se os dados serão compartilhados;
- qual política explica o tratamento.

Quando adequado, incluir link direto para a Política de Privacidade junto ao formulário.

Consentimento de marketing deve ser separado de ações necessárias para atender a solicitação do usuário.

---

# 8. MINIMIZAÇÃO DE DADOS

Aplicar o princípio de coleta mínima.

Solicitar somente informações realmente necessárias para a operação.

Não coletar dados "caso sejam úteis no futuro".

Revisar:

- formulários;
- cadastros;
- analytics;
- CRM;
- integrações;
- pixels;
- cookies;
- logs;
- APIs;
- ferramentas de atendimento.

Eliminar campos e coletas que não possuam finalidade definida.

---

# 9. ANALYTICS E TRACKING

Auditar todas as ferramentas de analytics e rastreamento utilizadas.

Verificar:

- Google Analytics;
- Google Tag Manager;
- Meta Pixel;
- pixels de publicidade;
- ferramentas de heatmap;
- gravação de sessão;
- ferramentas de comportamento;
- CRM;
- plataformas de automação;
- scripts de remarketing;
- identificadores persistentes.

Documentar quais dados são enviados e para quem.

Caso Google Analytics seja utilizado, configurá-lo conscientemente e integrá-lo à política de privacidade e ao mecanismo de consentimento quando necessário.

Não instalar rastreamento simplesmente porque é comum.

Cada ferramenta deve possuir finalidade clara.

---

# 10. EMBEDS E SERVIÇOS DE TERCEIROS

Revisar todos os conteúdos incorporados de terceiros.

Exemplos:

- YouTube;
- Vimeo;
- Google Maps;
- Instagram;
- TikTok;
- Facebook;
- serviços de reservas;
- chats;
- widgets;
- formulários externos;
- calendários;
- fontes externas.

Verificar se esses serviços carregam cookies, trackers ou transferem informações antes de qualquer interação.

Sempre que necessário, integrar esses serviços ao sistema de consentimento.

---

# 11. ACESSIBILIDADE

Construir o site considerando acessibilidade desde a implementação inicial.

Não tratar acessibilidade como correção posterior.

## 11.1 Imagens

Adicionar `alt text` significativo às imagens que transmitem conteúdo.

Imagens puramente decorativas devem utilizar tratamento apropriado para que leitores de tela não interpretem conteúdo irrelevante.

O texto alternativo deve explicar a função ou informação da imagem, e não simplesmente repetir seu nome de arquivo.

## 11.2 Contraste

Verificar contraste entre:

- texto e fundo;
- botões e fundo;
- links;
- estados de hover;
- mensagens de erro;
- campos de formulário;
- elementos interativos.

Evitar depender exclusivamente de cor para comunicar estados.

## 11.3 Navegação por teclado

Todo elemento interativo deve funcionar por teclado.

Isso inclui:

- menus;
- botões;
- links;
- formulários;
- modais;
- dropdowns;
- accordions;
- sliders;
- filtros;
- componentes personalizados.

O foco deve permanecer visível.

A ordem de navegação deve ser lógica.

## 11.4 Formulários

Todos os campos devem possuir labels adequados.

Não utilizar placeholder como substituto exclusivo de label.

Erros devem ser descritos de forma compreensível.

---

# 12. BOTÕES E CTAs

Todos os botões devem ter rótulos claros e específicos.

Evitar textos genéricos quando houver alternativa melhor.

Em vez de:

"Saiba mais"

preferir, quando aplicável:

"Conhecer os serviços"

"Ver detalhes do projeto"

"Solicitar orçamento"

"Falar com a equipe"

O usuário deve compreender a ação antes de clicar.

---

# 13. REVIEWS E PROVA SOCIAL

Não criar avaliações falsas.

Não utilizar:

- depoimentos inventados;
- nomes fictícios apresentados como clientes reais;
- números de avaliações inexistentes;
- estrelas simulando reputação;
- logos de clientes inexistentes.

Avaliações apresentadas como reais devem possuir origem real.

Caso sejam utilizadas avaliações externas, verificar a forma permitida de utilização.

---

# 14. CLAIMS E PROMESSAS

Remover afirmações não comprovadas.

Não utilizar frases como:

"o melhor";

"resultado garantido";

"número 1";

"aumentamos suas vendas em X%";

"100% de satisfação";

caso não existam evidências adequadas.

Diferenciar claramente:

- promessa comercial;
- expectativa;
- estimativa;
- resultado histórico;
- garantia contratual.

---

# 15. DADOS DO NEGÓCIO

O site deve apresentar informações suficientes para identificar quem opera o negócio.

Dependendo da natureza da empresa, isso pode incluir:

- nome comercial;
- razão social quando adequado;
- cidade;
- região de atendimento;
- meios de contato;
- e-mail;
- telefone;
- canais oficiais;
- informações empresariais legalmente exigidas.

Evitar esconder a identidade do operador do serviço.

---

# 16. DIREITOS AUTORAIS E IMAGENS

Auditar todas as imagens e materiais utilizados.

Confirmar que cada elemento possui uma origem compatível com o uso pretendido.

Verificar:

- fotografias;
- ilustrações;
- ícones;
- vídeos;
- fontes;
- logos;
- gráficos;
- músicas;
- textos;
- imagens de bancos de imagem.

Não utilizar conteúdos simplesmente encontrados na internet sem verificar direitos de uso.

Manter registro de licenças quando necessário.

---

# 17. ANÁLISE DE RISCOS

Antes da publicação, revisar o projeto procurando riscos adicionais relacionados a:

- privacidade;
- proteção de dados;
- consumidor;
- contratos;
- acessibilidade;
- propriedade intelectual;
- publicidade;
- segurança;
- pagamentos;
- conteúdo gerado por usuários;
- integrações externas.

Quando um risco depender de interpretação jurídica, **sinalizá-lo para revisão profissional**, em vez de presumir conformidade automática.

---

# 18. PÁGINA 404 PERSONALIZADA

Criar uma página personalizada para URLs inexistentes.

Ela deve ser útil e não apenas informar que ocorreu um erro.

Incluir:

- mensagem clara;
- link para página inicial;
- principais destinos do site;
- mecanismo de busca quando aplicável;
- CTA relevante.

Manter a identidade visual da plataforma.

---

# 19. CTA ACIMA DA DOBRA

As páginas comerciais mais importantes devem apresentar uma proposta de valor e um CTA principal antes que o usuário precise rolar significativamente a página.

O primeiro bloco deve responder rapidamente:

1. o que é oferecido;
2. para quem;
3. qual é o benefício;
4. qual é a próxima ação possível.

Não sobrecarregar o hero com múltiplos CTAs concorrentes.

---

# 20. LINKS INTERNOS

Criar uma estrutura consistente de links internos.

As páginas devem se conectar semanticamente.

Exemplos:

serviço → case relacionado;

case → serviço utilizado;

artigo → serviço relacionado;

FAQ → página aprofundada;

página comercial → contato.

Evitar páginas isoladas.

---

# 21. PÁGINA DE AGRADECIMENTO

Após o envio bem-sucedido de formulários importantes, direcionar o usuário para uma página de confirmação ou agradecimento.

Essa página deve:

- confirmar que a solicitação foi recebida;
- informar o próximo passo;
- comunicar prazo ou expectativa realista de resposta;
- oferecer alternativas úteis;
- permitir mensuração de conversão.

Não disparar evento de conversão simplesmente ao abrir o formulário.

A conversão deve ocorrer após a conclusão válida da ação.

---

# 22. BREADCRUMBS

Utilizar breadcrumbs em páginas hierárquicas quando fizer sentido.

Exemplo:

Início > Serviços > Consultoria > Estratégia

Eles devem:

- facilitar navegação;
- mostrar contexto;
- permitir retorno a níveis anteriores;
- possuir marcação semântica apropriada quando aplicável.

---

# 23. CASE STUDIES

Criar uma área dedicada a estudos de caso.

Cada case deve mostrar, sempre que houver dados reais:

- contexto;
- problema;
- objetivo;
- estratégia;
- execução;
- resultado;
- aprendizados;
- evidências.

Não inventar métricas.

Quando números forem confidenciais, utilizar descrições qualitativas ou intervalos autorizados.

---

# 24. FAQ

Criar uma seção com pelo menos **cinco perguntas frequentes relevantes**, quando existir conteúdo suficiente.

As perguntas devem refletir dúvidas reais do público.

Evitar FAQs artificiais utilizadas apenas para inserir palavras-chave.

Entre os possíveis assuntos:

- funcionamento;
- contratação;
- valores;
- prazos;
- processo;
- suporte;
- cobertura;
- cancelamentos;
- requisitos.

---

# 25. TEMPO DE RESPOSTA

Informar claramente quanto tempo o usuário pode esperar para receber retorno quando essa informação puder ser sustentada operacionalmente.

Exemplo:

"Normalmente respondemos em até um dia útil."

Não prometer prazos que não possam ser cumpridos.

---

# 26. PROMESSA PRINCIPAL

A proposta de valor deve ser clara e específica.

O visitante deve compreender rapidamente:

- o problema resolvido;
- o benefício;
- o diferencial;
- para quem a solução existe.

Evitar frases genéricas como:

"Transformamos sonhos em realidade."

Priorizar propostas concretas e verificáveis.

---

# 27. CTA FIXO NO MOBILE

Em páginas com intenção comercial relevante, considerar um CTA fixo no mobile.

Exemplos:

"Solicitar orçamento"

"Entrar em contato"

"Reservar"

"Ver disponibilidade"

O componente não deve bloquear conteúdo nem prejudicar acessibilidade.

Respeitar áreas seguras de dispositivos móveis.

---

# 28. ROBOTS.TXT

Criar e revisar o arquivo `robots.txt`.

Definir conscientemente quais áreas podem ou não ser rastreadas.

Não utilizar `robots.txt` como mecanismo de segurança.

Páginas sensíveis devem ser protegidas por autenticação e autorização.

---

# 29. TÍTULOS ÚNICOS

Cada página indexável deve possuir um `<title>` específico e coerente com seu conteúdo.

Não reutilizar exatamente o mesmo título em todo o site.

Os títulos devem ajudar:

- usuários;
- mecanismos de busca;
- compartilhamentos;
- organização das abas do navegador.

---

# 30. META DESCRIPTIONS

Criar meta description específica para as principais páginas.

Ela deve descrever adequadamente o conteúdo e incentivar o clique sem utilizar promessas enganosas.

Evitar duplicação em massa.

---

# 31. IMAGENS PARA COMPARTILHAMENTO SOCIAL

Criar imagens adequadas para compartilhamento de páginas importantes.

Configurar metadados como:

- Open Graph;
- título;
- descrição;
- imagem;
- URL canônica quando apropriada.

Utilizar imagens representativas da página.

---

# 32. MAPAS E DIREÇÕES

Caso o negócio possua presença física ou dependa de deslocamento, incluir:

- mapa;
- endereço;
- instruções;
- pontos de referência quando úteis;
- acesso a rotas.

Avaliar implicações de privacidade antes de carregar embeds de mapas de terceiros automaticamente.

---

# 33. AVALIAÇÕES REAIS DE CLIENTES

Quando houver avaliações reais, utilizá-las como prova social.

Priorizar avaliações verificáveis.

Não modificar substancialmente o sentido original dos relatos.

Não transformar comentários privados em depoimentos públicos sem autorização adequada.

---

# 34. LOCAL BUSINESS SCHEMA

Para negócios locais, implementar dados estruturados compatíveis com o padrão `LocalBusiness` do Schema.org quando as informações da empresa justificarem essa marcação.

Utilizar apenas informações reais.

Os dados estruturados devem ser compatíveis com aquilo que aparece publicamente no site.

Possíveis propriedades incluem:

- nome;
- endereço;
- telefone;
- URL;
- horário;
- localização;
- categoria;
- imagem.

Selecionar o subtipo mais apropriado para o negócio quando existir.

---

# 35. FOTOGRAFIAS REAIS

Sempre que possível, utilizar fotografias reais da empresa, equipe, espaço, produto ou operação.

Evitar depender exclusivamente de bancos de imagens genéricos.

Uma fotografia real da equipe pode melhorar:

- confiança;
- percepção de legitimidade;
- identificação da empresa;
- transparência.

Não inventar membros da equipe nem utilizar pessoas de banco de imagens apresentadas como funcionários reais.

---

# 36. REQUISITOS DE PRODUÇÃO

Antes de considerar o site pronto para produção, executar uma revisão final contemplando quatro dimensões.

### Segurança

Verificar autenticação, autorização, proteção de APIs, validação de dados, sessões, permissões e acesso administrativo.

### Conformidade

Verificar privacidade, cookies, consentimentos, termos, acessibilidade, dados pessoais e materiais protegidos por direitos autorais.

### Conversão

Verificar proposta de valor, CTAs, formulários, prova social, cases, FAQs, páginas de agradecimento e experiência mobile.

### Descoberta

Verificar SEO técnico, títulos, descrições, links internos, dados estruturados, robots.txt, compartilhamento social e SEO local.

O sistema não deve ser considerado seguro, juridicamente conforme ou "production ready" apenas porque os elementos visuais foram implementados.

A implementação deve refletir o funcionamento real da plataforma, e qualquer questão jurídica dependente da legislação, localização ou modelo de negócio deve ser explicitamente sinalizada para validação apropriada.