# Passaporte Serra Negra

## Documentação consolidada de produto, arquitetura, experiência e regras do MVP

**Data de consolidação:** 09/09/2026

**Referências visuais:** ver [Índice de referências visuais](REFERENCIAS_VISUAIS.md). As marcações `RV-XX` usadas ao longo do documento correspondem aos arquivos da pasta `referencias/`.  
**Status:** arquitetura funcional consolidada, sistema visual em definição avançada  
**Escopo atual:** MVP Passaporte Serra Negra, Serra Negra/SP

---

# 1. Objetivo do projeto

O **Passaporte Serra Negra** é uma plataforma turística voltada a organizar a descoberta da cidade, auxiliar a montagem de viagens e registrar a experiência efetivamente vivida pelo turista.

A proposta combina quatro capacidades principais:

1. **descoberta turística**, com lugares, experiências, eventos e contexto territorial;
2. **Travel Engine**, para montar roteiros coerentes com o perfil da viagem;
3. **Passaporte**, para registrar visitas, descobertas e retornos;
4. **inteligência de mercado**, usando comportamento anônimo e autenticado para compreender circulação, interesse, uso da plataforma e oportunidades dos parceiros.

A promessa pública pode ser trabalhada em torno de:

> **Descubra Serra Negra do seu jeito.**

Complementos possíveis:

> O Passaporte Serra Negra organiza a cidade ao redor da sua viagem.

> A sua história em Serra Negra.

---

# 2. Escopo do MVP

O MVP é exclusivamente o **Passaporte Serra Negra**.

## 2.1. Superfícies operacionais

O sistema possui três frentes no MVP:

- **Turista**
- **Parceiro**
- **Admin interno**

## 2.2. Produto futuro separado

O **Concierge Digital White Label** é um produto futuro e não entra no MVP.

Não devem entrar agora:

- QR Code do Concierge;
- hotel fixo no roteiro;
- PMS;
- tenancy de hotéis;
- overrides específicos por hotel;
- analytics específicos do Concierge;
- estruturas multi-tenant para hotel;
- marketing público do White Label dentro do MVP.

A arquitetura deve evitar bloquear essa evolução, mas sem expandir o escopo atual.

---

# 3. Geografia do MVP

Somente **Serra Negra, SP** é pública e operacional no MVP.

O modelo de dados deve prever `city_id`, mas outras cidades:

- não aparecem publicamente;
- não entram em roteiros;
- não influenciam busca;
- não influenciam recomendações;
- não entram no marketing atual.

A expansão para outras cidades é futura.

---

# 4. Modelo conceitual de conteúdo

## 4.1. Lugar

Um lugar representa um ponto físico ou estabelecimento.

Pode ser:

- ponto turístico;
- negócio listado;
- parceiro;
- outro local relevante.

## 4.2. Relação comercial

A natureza do local e sua relação comercial com a plataforma são coisas diferentes.

Exemplo conceitual:

```text
Place
├── place_type
├── category
└── commercial_relation
    ├── public_point
    ├── listed_business
    └── partner
```

Nunca apresentar um negócio pesquisado como parceiro sem confirmação.

## 4.3. Experiência

**Ponto turístico e experiência não são sinônimos.**

Um ponto turístico responde:

> Onde estou indo?

Uma experiência responde:

> O que vou fazer?

Estrutura conceitual:

```text
Experience
├── place_id
├── cost_type
├── booking_type
├── duration
├── environment
└── weather_profile
```

Tipos de custo possíveis:

- `free`
- `paid`
- `free_with_booking`
- `paid_with_booking`
- `mixed`
- `unknown`

## 4.4. Experiência sem custo

Experiência sem custo é uma atividade gratuita e pode ocorrer:

- em ponto turístico;
- em parceiro;
- em evento;
- em outro local.

Ela não deve ser tratada como categoria equivalente a ponto turístico.

---

# 5. Pesquisa e criação inicial das páginas

A primeira versão de apresentação deve pesquisar pontos reais e atuais de Serra Negra usando fontes públicas, preferencialmente oficiais.

Os pontos pesquisados devem:

- ser inseridos em dados estruturados;
- ter páginas individuais reais;
- ser editáveis no Admin;
- não ser cards fictícios ou placeholders.

Campos de proveniência recomendados:

```text
source_url
source_name
source_type
verified_at
verification_status
notes
```

Status possíveis:

- `official_source`
- `verified`
- `secondary_source`
- `conflicting`
- `needs_review`

Se uma informação estiver ausente, o campo continua existindo estruturalmente, mas não é renderizado ao público.

---

# 6. Frente do turista

## 6.1. Navegação sem login

O turista pode conhecer a plataforma sem criar conta.

Sem login é possível:

- explorar;
- buscar lugares;
- abrir páginas;
- visualizar experiências;
- consultar eventos;
- abrir mapas;
- clicar em WhatsApp;
- ligar;
- abrir Instagram;
- acessar site;
- acessar reserva externa.

## 6.2. Quando o login é exigido

O login entra quando existe persistência pessoal.

Exemplos:

- salvar roteiro;
- criar viagem persistente;
- organizar viagem;
- registrar visita física;
- atualizar Passaporte;
- manter favoritos históricos;
- enviar avaliação vinculada à conta;
- compartilhar conteúdo persistente controlado.

Fluxo padrão:

```text
navegar
↓
tentar ação persistente
↓
login
↓
retomar exatamente a ação iniciada
```

---

# 7. Tracking anônimo

Cliques e navegação de usuários sem login devem ser observáveis.

Identificadores técnicos possíveis:

```text
anonymous_visitor_id
session_id
```

Esses identificadores não equivalem automaticamente à identidade civil do visitante.

## 7.1. Eventos importantes

Exemplos:

```text
PAGE_VIEWED
SECTION_IMPRESSION
PLACE_VIEWED
CATEGORY_VIEWED
SEARCH_PERFORMED
FILTER_APPLIED
EXPERIENCE_VIEWED
EVENT_VIEWED
PARTNER_CARD_IMPRESSION
PARTNER_CARD_CENTERED
PARTNER_CARD_CLICK
CONTACT_CLICKED
WHATSAPP_CLICKED
PHONE_CLICKED
WEBSITE_CLICKED
EXTERNAL_BOOKING_CLICKED
MAP_OPENED
ROUTE_STARTED
ROUTE_STEP_VIEWED
ROUTE_STEP_COMPLETED
ROUTE_INTEREST_SELECTED
ROUTE_PROFILE_COMPLETED
ROUTE_AUTH_REQUESTED
TRIP_CREATED
PLACE_ADDED
PLACE_REMOVED
PLACE_SWAPPED
QR_SCANNED
VISIT_CONFIRMED
REVIEW_SUBMITTED
PASSPORT_SHARED
```

O Admin deve conseguir analisar:

- visitantes anônimos;
- sessões;
- caminhos de navegação;
- origem;
- categorias consultadas;
- locais visualizados;
- cliques externos;
- abandono;
- tentativa de criação de roteiro;
- conversão de anônimo para conta;
- influência de eventos;
- influência do clima.

Qualquer associação do histórico anônimo com uma conta autenticada exige finalidade clara, regra de privacidade e consentimento quando aplicável.

---

# 8. Home pública

A Home já possui direção visual estabelecida.

Estrutura consolidada:

1. Header global
2. Hero
3. Conheça Serra Negra
4. Loop de parceiros
5. Chamada visual de roteiro
6. Tipos de roteiro
7. Cards de roteiro
8. Seções editoriais
9. Categorias de parceiros
10. FAQ
11. Introdução ao Passaporte e à dinâmica de uso
12. Mapa/contexto territorial quando aplicável
13. CTA final
14. Footer global

A Home deve permanecer editorial, turística e responsiva.

---

# 9. Explorar

Rota principal:

```text
/explorar
```

A página deve ser mais funcional do que a Home, mas ainda manter caráter editorial.

## 9.1. Estrutura

- hero fotográfico compacto;
- busca dominante;
- categorias rápidas;
- filtros progressivos;
- contexto de clima;
- contexto de eventos;
- cards de lugares e experiências;
- mapa secundário;
- lista e mapa compartilhando os mesmos filtros.

Busca sugerida:

> Buscar lugares, experiências ou categorias

Filtros possíveis:

- Todos
- Sem custo
- Indoor
- Outdoor
- Família
- Casal
- Acessibilidade
- Mais filtros

## 9.2. Regras

Não usar:

- ranking pago;
- “mais popular” sem dado real;
- “melhor” sem critério verificável;
- posições comerciais disfarçadas de recomendação.

---

# 10. Google Maps no Passaporte

O Google Maps pode ser usado como infraestrutura técnica para mapas e rotas, enquanto a inteligência permanece no Passaporte.

## 10.1. Funções adequadas

O Google Maps pode sustentar:

- mapa interativo;
- marcadores;
- geocodificação;
- coordenadas;
- busca/autocomplete quando útil;
- cálculo de rota;
- distância;
- tempo de deslocamento;
- matrizes de deslocamento;
- abertura de navegação externa.

## 10.2. Responsabilidade do Passaporte

O Passaporte decide:

- relevância;
- compatibilidade com roteiro;
- relação com clima;
- relação com horário;
- proximidade útil;
- complementaridade de categoria;
- oportunidade dentro do tempo disponível.

Exemplo:

```text
Google Maps
→ distância e tempo

Passaporte
→ por que aquele local faz sentido agora
```

## 10.3. Arquitetura recomendada

```text
MapsProvider
RoutesProvider
PlacesProvider
```

Evitar dependência direta espalhada pelos componentes.

A base editorial do Passaporte deve continuar própria.

---

# 11. Página de ponto turístico

Rota:

```text
/lugares/[slug]
```

A página de ponto turístico não deve usar exatamente o mesmo template da página de parceiro.

Prioridades:

- lugar;
- contexto;
- história;
- experiências;
- clima;
- planejamento;
- visita;
- Passaporte;
- proximidade.

## 11.1. Estrutura

1. Header
2. Hero fotográfico
3. Tipo, nome e descrição curta
4. CTA Adicionar ao roteiro
5. Informações rápidas integradas
6. Conheça este lugar
7. O que fazer aqui
8. Experiências sem custo, quando houver
9. Planeje sua visita
10. Clima
11. Galeria
12. Localização e mapa
13. Eventos relacionados
14. Estado de visita/Passaporte
15. Perto daqui e que combina com seu roteiro
16. Footer

## 11.2. Recomendações próximas

A ordem de relevância deve considerar:

1. proximidade;
2. compatibilidade com roteiro ativo;
3. horário de funcionamento;
4. clima;
5. categoria complementar;
6. duração disponível;
7. eventos;
8. histórico do usuário, quando existir.

Mostrar apenas 3 ou 4 opções úteis.

Exemplos de justificativa:

- fica no caminho da próxima atividade;
- boa opção antes do almoço;
- opção indoor próxima para chuva.

---

# 12. Experiências

Nem toda experiência precisa de página própria.

## 12.1. Experiência simples/contextual

Permanece dentro da página do local.

```text
/lugares/[slug]
└── experiência
```

Pode abrir em:

- expansão;
- drawer;
- modal;
- âncora interna.

## 12.2. Experiência com identidade própria

Pode ganhar URL quando houver conteúdo e operação suficientes.

```text
/experiencias/[slug]
```

Critérios:

- duração própria;
- horário próprio;
- reserva;
- preço;
- capacidade;
- ponto de encontro;
- regras próprias;
- clima específico;
- preparação;
- faixa etária;
- acessibilidade específica;
- forte relevância para o Travel Engine.

A página própria não deve depender de interesse comercial do parceiro.

---

# 13. Montar meu roteiro

Rota conceitual:

```text
/roteiro
```

## 13.1. Fluxo de onboarding

1. Quando?
2. Com quem?
3. O que interessa?
4. O que quer viver?
5. Ritmo
6. Transporte
7. Necessidades importantes
8. Revisão
9. Login, se necessário
10. Geração do roteiro

## 13.2. Perfil por viagem

O perfil pertence à viagem, não deve ser tratado como psicologia permanente do usuário.

## 13.3. Interesses possíveis

- natureza;
- gastronomia;
- cafés;
- cultura;
- compras;
- aventura;
- vinícolas;
- bem-estar;
- experiências sem custo;
- pontos turísticos;
- eventos.

## 13.4. Intenções

Exemplos:

- conhecer os clássicos;
- descobrir lugares diferentes;
- comer bem;
- relaxar;
- ver paisagens;
- atividades com crianças;
- gastar menos;
- conhecer produtores locais.

## 13.5. Ritmo

- lento;
- equilibrado;
- ativo.

## 13.6. Transporte

- carro;
- a pé;
- aplicativo/táxi;
- ainda não sei.

## 13.7. Necessidades

- acessibilidade;
- criança pequena;
- preferir opções gratuitas;
- evitar outdoor;
- restrições alimentares;
- nenhuma.

O clima não é perguntado, é obtido pelo sistema.

---

# 14. Travel Engine

O Travel Engine do MVP pode ser determinístico e explicável.

Considerar:

- datas;
- duração;
- companhia;
- crianças;
- interesses;
- intenção;
- ritmo;
- transporte;
- distância;
- horário de funcionamento;
- clima;
- eventos;
- experiências sem custo;
- experiências pagas;
- diversidade;
- acessibilidade;
- restrições;
- avaliações reais;
- disponibilidade quando houver dado real.

O roteiro deve ser coerente por dia e não uma lista aleatória.

---

# 15. Roteiro gerado
> **Referências visuais principais:** RV-05, RV-39, RV-40 e RV-41. Para o calendário: RV-34, RV-35 e RV-36. Consulte `REFERENCIAS_VISUAIS.md`.


Rota conceitual:

```text
/viagens/[tripId]/roteiro
```

## 15.1. Estrutura

- Header;
- resumo compacto da viagem;
- abas por dia;
- contexto de clima;
- eventos relevantes;
- timeline vertical em SVG;
- paradas;
- deslocamentos;
- tempo livre;
- mapa;
- resumo do dia;
- edição;
- reorganização;
- compartilhamento.

## 15.2. Fontes do item

```text
recommended_by_engine
added_by_user
changed_by_user
fixed
```

Essas origens são importantes para preservar escolhas manuais, interpretar alterações e aprender com o comportamento sem confundir recomendação do sistema com decisão do usuário.

## 15.3. Edição

A edição ocorre na própria página.

Ações:

- trocar;
- mover;
- remover;
- adicionar;
- reorganizar.

O sistema não deve reconstruir silenciosamente todo o roteiro depois de uma mudança local.

Itens fixados ou alterados manualmente devem ser preservados.

No desktop, o roteiro pode usar coluna principal e coluna contextual. No mobile, os cards ficam empilhados e ações secundárias podem abrir em bottom sheet ou menu acessível.

## 15.4. Calendário da viagem

Deve existir uma página de calendário para ajudar o turista a **organizar e visualizar a viagem no tempo**.

Conceito:

```text
ROTEIRO
=
sequência e lógica do percurso

CALENDÁRIO
=
distribuição no tempo

PASSAPORTE
=
memória registrada
```

Rota conceitual:

```text
/viagens/[tripId]/calendario
```

O calendário não substitui o roteiro e não deve parecer uma agenda corporativa genérica.

### Modos principais

- **Dia**, visão detalhada de horários;
- **Semana**, visão principal para viagens de alguns dias;
- **Mês**, contexto geral de datas, eventos e distribuição macro.

### Conteúdo

O calendário pode mostrar:

- atividades planejadas;
- lugares;
- experiências;
- duração;
- deslocamentos relevantes;
- clima;
- eventos;
- intervalos livres;
- conflitos;
- sugestões de reorganização;
- estados de presença quando houver evidência.

Estados possíveis, sempre sem depender somente de cor:

- planejado;
- presença registrada;
- movido;
- removido;
- sem evidência registrada.

"Sem evidência registrada" não significa que a visita não ocorreu.

### Desktop

A visão pode combinar:

```text
resumo / contexto do dia
+
grade temporal
+
clima
+
eventos
+
alertas e sugestões
```

### Mobile

A experiência principal deve favorecer:

- agenda diária;
- semana simplificada;
- blocos grandes e legíveis;
- controles Dia / Semana / Mês;
- detalhe em bottom sheet quando necessário.

Não tentar reproduzir uma grade desktop comprimida.

### Integração com o Travel Engine

Espaços livres podem gerar sugestões contextuais usando:

```text
tempo disponível
+
proximidade
+
rota
+
horário
+
clima
+
interesses
```

O calendário reutiliza os mesmos dados e regras do roteiro, sem criar um motor de recomendação paralelo.

---

# 16. Clima

O clima é fundamental desde o MVP.

Variáveis possíveis:

- temperatura;
- sensação térmica;
- probabilidade de chuva;
- intensidade de chuva;
- vento;
- umidade;
- alertas;
- previsão horária.

## 16.1. Perfil climático do local

```text
indoor
outdoor
rain_sensitivity
heat_sensitivity
cold_affinity
wind_sensitivity
```

Se o provider falhar, usar fallback explícito.

Nunca inventar clima.

---

# 17. Eventos

Eventos entram no MVP como dados estruturados e contexto de viagem.

Podem:

- aparecer em roteiros;
- influenciar recomendações;
- ser cadastrados no Admin;
- ser associados a locais;
- ser analisados quanto ao impacto no comportamento turístico.

Campos possíveis:

- cidade;
- local;
- parceiro relacionado;
- nome;
- descrição;
- categoria;
- início;
- fim;
- localização;
- gratuito/pago;
- indoor/outdoor;
- sensibilidade ao clima;
- fonte;
- status.

## 17.1. QR de evento

**Não entra por enquanto.**

Eventos não possuem QR próprio no MVP inicial.

---

# 18. QR Code do Passaporte

O QR Code do MVP é o **QR do Passaporte associado a local/parceiro**.

Funções:

```text
descoberta
+
origem
+
presença
+
registro de visita
+
carimbo
+
retorno
+
continuidade da viagem
```

QR validado representa **evidência de presença física**.

Não representa automaticamente:

- compra;
- reserva;
- consumo;
- gasto;
- transação.

## 18.1. Fluxo

```text
ESCANEAR QR
↓
IDENTIFICAR LOCAL
↓
EXIBIR CONTEXTO
↓
REGISTRAR VISITA
↓
LOGIN, SE NECESSÁRIO
↓
VALIDAR
↓
CRIAR VISIT
↓
PRIMEIRA VISITA OU RETORNO
↓
ATUALIZAR PASSAPORTE
↓
MOSTRAR CARIMBO
↓
CONTINUAR VIAGEM
```

## 18.2. Usuário sem login

O scan pode ser registrado anonimamente.

Ao solicitar o registro da visita:

```text
login
↓
retorno ao mesmo QR
↓
continuação da validação
```

O contexto do local nunca deve ser perdido.

## 18.3. Duplicidade

Scans repetidos em curto intervalo não devem gerar visitas duplicadas.

O intervalo exato ainda será definido.

## 18.4. Estados de erro

Prever:

- QR inválido;
- QR desativado;
- falha temporária;
- visita já registrada recentemente;
- local indisponível.

Nunca mostrar erro técnico cru ao turista.

## 18.5. QR do Concierge

O QR do Concierge será desenvolvido futuramente junto ao White Label.

Deve ser separado em:

- tipo;
- finalidade;
- tracking;
- regras;
- contexto.

Não reutilizar automaticamente a lógica de carimbo e presença do QR do Passaporte.

---

# 19. Meu Passaporte
> **Referências visuais principais:** RV-21 a RV-33. Consulte `REFERENCIAS_VISUAIS.md`.


O **Meu Passaporte** deve aparentar um **passaporte físico de viagem reinterpretado digitalmente**.

Ele não deve ser um dashboard com decoração de passaporte. O objeto visual é parte central do produto.

Conceito:

```text
CAPA FÍSICA
+
PÁGINAS INTERNAS
+
BILHETES
+
CARIMBOS
+
MAPA
+
REGISTROS DE VIAGEM
```

Direção:

> físico, elegante, contemporâneo, afetivo e colecionável.

Evitar:

- cópia de documento oficial;
- aparência governamental;
- burocracia desnecessária;
- papel excessivamente envelhecido;
- visual vintage caricatural;
- elementos de aeroporto sem função real.

## 19.1. Estado fechado e capa

A entrada do Passaporte pode apresentar o objeto fechado.

A capa deve possuir pouca informação e forte presença material.

Pode conter:

- marca Passaporte Serra Negra;
- símbolo da identidade futura;
- textura sutil;
- acabamento visual de relevo ou hotstamp;
- identificação discreta do viajante;
- numeração visual do Passaporte.

A identidade definitiva de cor, símbolo e tipografia será construída posteriormente.

## 19.2. Abertura física

No desktop, o Passaporte deve abrir como um livro real, com duas páginas lado a lado.

```text
┌───────────────────────┬───────────────────────┐
│ página esquerda       │ página direita        │
│                       │                       │
│ conteúdo              │ conteúdo              │
│                       │                       │
└───────────────────────┴───────────────────────┘
```

No mobile, deve apresentar uma página por vez, preservando:

- materialidade;
- margens;
- numeração;
- textura;
- hierarquia do objeto.

Swipe pode ser usado como conveniência, mas deve haver navegação acessível por botões.

## 19.3. Anatomia das páginas

A ordem conceitual fica:

```text
CAPA

ABERTURA 01
Identificação

ABERTURA 02
Viagem atual + bilhete

ABERTURAS DE CARIMBOS
quantas forem necessárias

DESCOBERTAS + REENCONTROS

CATEGORIAS

CAMINHO VIVIDO

LUGARES DE RETORNO
quando houver dados suficientes

ARQUIVO DE VIAGENS

RESUMO GERAL

CONTRACAPA INTERNA
```

O número de páginas deve crescer conforme a história do usuário. Não diminuir carimbos ou textos artificialmente para caber mais conteúdo.

## 19.4. Identificação

A primeira abertura pode conter um elemento territorial discreto à esquerda e identificação do Passaporte à direita.

Pode incluir:

- nome escolhido pelo usuário;
- número interno visual do Passaporte;
- ano de início;
- Serra Negra, SP;
- idioma atual.

Não incluir campos civis desnecessários como CPF, sexo, nascimento ou nacionalidade apenas para imitar documentos oficiais.

## 19.5. Bilhete da viagem

A viagem atual deve possuir uma dobra ou página com **ticket de viagem** inspirado em bilhetes físicos.

Esse ticket pode parecer:

- encaixado em um bolso;
- parcialmente inserido;
- solto sobre a página;
- destacável visualmente.

Campos possíveis:

```text
VIAGEM
DESTINO
CHEGADA
SAÍDA
DURAÇÃO
COM QUEM
RITMO
LUGARES REGISTRADOS
DESCOBERTAS
REENCONTROS
```

Não usar campos falsos de aviação como voo, portão ou assento.

O ticket também é uma peça compartilhável autônoma.

## 19.6. Carimbos

O sistema visual do carimbo **já foi desenvolvido**.

A partir daqui, não redesenhar o carimbo. O trabalho restante é sua aplicação dentro do objeto Passaporte.

Os carimbos devem:

- parecer aplicados fisicamente;
- admitir pequenas rotações;
- variar discretamente de posição;
- permitir composição orgânica;
- manter legibilidade;
- poder se sobrepor de forma controlada;
- abrir detalhe da visita quando selecionados.

Se uma abertura ficar cheia, o sistema cria novas páginas de carimbos.

Retornos devem preservar a identidade do mesmo lugar e mostrar contagem ou registros adicionais sem transformar cada retorno em um badge gamificado.

## 19.7. Descobertas, reencontros e categorias

Descobertas e reencontros devem parecer registros editoriais do Passaporte, não conquistas.

Categorias podem apresentar `X/X`, desde que o denominador siga uma regra de elegibilidade controlada.

Não usar:

- barra de progresso de jogo;
- percentual de cidade concluída;
- XP;
- streak;
- ranking.

## 19.8. Caminho vivido

O Passaporte representa o que possui evidência de realização.

```text
ROTEIRO
=
planejado

PASSAPORTE
=
registrado / vivido
```

O caminho vivido deve usar linguagem cartográfica mais orgânica do que o roteiro.

Pode combinar:

- mapa vetorial de Serra Negra;
- pontos registrados;
- linha de percurso;
- datas;
- carimbos relacionados.

O caminho vivido não significa rastreamento GPS contínuo.

Ele pode ser reconstruído a partir de:

- QR validado;
- visitas registradas;
- ordem temporal;
- outras evidências explicitamente definidas.

## 19.9. Mapa vetorial de Serra Negra

Deve existir um **mapa vetorial real de Serra Negra** como elemento permanente da linguagem do Passaporte.

O contorno deve derivar de base geográfica real, preferencialmente oficial, e ser convertido para SVG.

O arquivo deve ser reutilizável e possuir camadas conceituais como:

```text
territory-outline
topography
route
visited-points
labels
decorative-details
```

Usos:

1. marca d'água nas páginas internas;
2. mapa do caminho vivido;
3. elemento gráfico da identidade;
4. ticket;
5. compartilhamentos;
6. contracapa e páginas de abertura.

A origem dos dados geográficos e sua licença devem ser registradas em `ASSET_LICENSES.md`.

O SVG deve respeitar Light Mode e Dark Mode por meio de tokens ou `currentColor`, sem cores fixas desnecessárias.

## 19.10. Histórico e arquivo de viagens

O Passaporte geral funciona como coleção de capítulos.

```text
PASSAPORTE GERAL
├── viagem atual
├── viagem anterior
├── viagem anterior
└── ...
```

Cada viagem anterior pode ser representada por um mini bilhete ou ficha física e abrir seu próprio conjunto de páginas.

## 19.11. Estado vazio

Um Passaporte novo deve continuar parecendo um objeto real.

Não usar carimbos falsos ou dados de demonstração.

Uma página vazia pode dizer discretamente:

> Ainda há espaço para a primeira marca desta viagem.

O vazio faz parte da experiência física.

## 19.12. Dark Mode

No Dark Mode, o entorno da interface pode ficar escuro, mas o Passaporte deve continuar parecendo um objeto físico.

Não inverter todo o papel para preto.

A materialidade, impressão, profundidade, bilhetes, carimbos e superfícies devem ser adaptados preservando a identidade do objeto.

---

# 20. Compartilhamento do Passaporte
> **Referências visuais principais:** RV-21, RV-24, RV-25, RV-26 e RV-33. Consulte `REFERENCIAS_VISUAIS.md`.


O compartilhamento deve funcionar como uma extensão do objeto físico e também como canal de aquisição orgânica.

Regra central:

> cada dobra relevante do Passaporte deve possuir opção de compartilhar.

## 20.1. Compartilhar a dobra atual

A ação:

```text
Compartilhar esta dobra
```

deve gerar uma **renderização social limpa** baseada na visualização atual.

Não deve ser um screenshot bruto da interface.

O render final remove:

- Header;
- botões;
- setas de navegação;
- menus;
- elementos técnicos;
- chrome do navegador.

Mantém:

- páginas físicas;
- textura;
- carimbos;
- ticket;
- datas;
- mapa;
- conteúdo autorizado;
- branding discreto.

## 20.2. Ticket compartilhável

O ticket da viagem deve existir também como peça autônoma.

Exemplo de conteúdo:

```text
PASSAPORTE SERRA NEGRA
TICKET DE VIAGEM

VIAGEM 004
SERRA NEGRA, SP

12 SET 2026 -> 14 SET 2026

3 dias
Casal
Ritmo equilibrado

8 lugares registrados
5 descobertas
3 reencontros
```

O ticket deve parecer parte do mesmo sistema físico do Passaporte, não um card publicitário.

## 20.3. Resumo compartilhável

Também pode existir:

```text
Compartilhar viagem
```

para gerar uma composição resumida com:

- período;
- quantidade de lugares;
- descobertas;
- reencontros;
- mapa vetorial;
- seleção de carimbos.

## 20.4. Formatos

Gerar pelo menos:

```text
1080 x 1920
Stories / Status

1080 x 1350
Feed vertical

1080 x 1080
Quadrado
```

A composição deve se adaptar ao formato em vez de simplesmente cortar a imagem.

## 20.5. Privacidade

Antes de gerar, permitir selecionar informações públicas quando necessário.

Possíveis controles:

- carimbos;
- datas;
- lugares;
- categorias;
- nome do viajante;
- quantidade de visitas.

Nunca incluir automaticamente:

- localização atual;
- localização em tempo real;
- roteiro futuro;
- dados da conta;
- informações pessoais desnecessárias.

## 20.6. Aquisição

A peça compartilhada pode apresentar discretamente:

```text
Passaporte Serra Negra
Descubra Serra Negra do seu jeito.
```

Quando houver link ou QR funcional de aquisição, ele pode ser incluído desde que sua finalidade seja real e rastreável.

---

# 21. Fotografias

As fotos não devem funcionar como cards de divulgação ou peças promocionais de troca constante.

## 21.1. Regra

```text
FOTO DA PÁGINA
=
registro visual do local
```

Não:

```text
campanha
promoção
banner sazonal
flyer
card de Instagram
arte de preço
```

## 21.2. O que mostrar

Priorizar:

- fachada;
- ambiente interno;
- área externa;
- paisagem;
- arquitetura;
- estrutura;
- produto característico;
- experiência recorrente;
- elementos que ajudem o turista a reconhecer o ponto.

## 21.3. Quando trocar

Faz sentido trocar quando:

- a imagem estiver desatualizada;
- o espaço mudar;
- houver reforma;
- surgir foto de qualidade significativamente melhor;
- a estrutura deixar de existir;
- a imagem deixar de representar o local.

A interface deve tratar isso como **Imagens do local**, não como “mídia promocional”.

---

# 22. Página pública do parceiro

A página do parceiro é simples no MVP.

Prioridades:

- identidade do negócio;
- descrição;
- informações práticas;
- serviços;
- experiências;
- contato;
- WhatsApp;
- site;
- reserva externa;
- localização;
- tempo de resposta declarado;
- visita/Passaporte.

Não há:

- reserva interna;
- pagamento interno;
- chat interno;
- condições especiais do Passaporte.

Condições especiais só entram depois da validação do modelo.

---

# 23. Links externos do parceiro

Conexões, contatos e reservas ficam por conta de links externos no MVP.

Exemplos:

- WhatsApp;
- telefone;
- Instagram;
- site;
- sistema externo de reserva;
- mapa.

Regra:

- desktop, preferir nova guia;
- mobile, deep link quando apropriado;
- nunca destruir o estado atual do Passaporte.

---

# 24. Tempo de resposta do parceiro

O tempo de resposta é relevante na página do parceiro, mas não é medido automaticamente no MVP.

É declarado pelo estabelecimento.

Opções possíveis:

```text
responds_quickly
within_1_hour
within_few_hours
same_day
one_business_day
custom
```

A interface pública deve deixar claro que é informação declarada.

---

# 25. Área do parceiro

O parceiro possui login próprio e nunca acessa o Admin.

## 25.1. Minha Página

O parceiro pode:

- visualizar sua página pública;
- editar dados permitidos;
- atualizar links;
- revisar horários;
- atualizar imagens do local;
- informar tempo de resposta;
- visualizar experiências existentes;
- abrir solicitações;
- acompanhar solicitações;
- ver histórico simples de alterações.

## 25.2. Alterações diretas

O parceiro pode alterar dados não sensíveis já existentes quando permitido.

## 25.3. Solicitação obrigatória

Para:

- adicionar nova informação estrutural;
- remover informação estrutural;
- alterar categoria;
- mudar identidade principal;
- criar nova experiência;
- adicionar nova seção;
- alterar estrutura global.

Deve abrir solicitação.

## 25.4. Regra visual

A interface deve diferenciar claramente:

```text
EDITÁVEL
```

versus:

```text
REQUER SOLICITAÇÃO
```

Não depender apenas de cor.

## 25.5. Segurança

Backend deve validar:

- role;
- ownership;
- permission;
- campo permitido.

O parceiro não pode:

- editar concorrentes;
- alterar cidade;
- alterar QR;
- criar QR;
- editar tracking;
- alterar métricas;
- editar score;
- acessar Admin;
- alterar Section Registry global;
- aprovar própria solicitação.

---

# 26. Dashboard do parceiro

O parceiro vê apenas inteligência relacionada ao próprio negócio.

Pode visualizar:

- visualizações;
- cliques externos;
- adições a roteiro;
- presença validada;
- retornos;
- afinidades;
- comportamento agregado relevante;
- origens de descoberta;
- evolução ao longo do tempo.

Não mostrar ranking competitivo público entre parceiros.

Visualizações úteis:

- Sankey simplificado de origem;
- timeline de evolução;
- funil de evidência;
- gráficos de séries temporais.

---

# 27. Admin

O Admin é a central interna de operação, inteligência e maturação.

Pode:

- criar páginas;
- editar páginas;
- publicar;
- arquivar;
- revisar fontes;
- revisar solicitações;
- editar lugares;
- editar eventos;
- administrar QR;
- acompanhar parceiros;
- visualizar dados agregados;
- visualizar dados individuais quando necessário e permitido;
- acompanhar comportamento anônimo;
- analisar circulação;
- analisar eventos;
- analisar clima;
- acompanhar maturação.

---

# 28. CMS do Admin

O Admin utiliza um editor central reutilizável.

Estrutura sugerida:

```text
NAVEGAÇÃO
+
EDITOR
+
PREVIEW
```

Campos e seções mudam conforme o tipo da entidade.

## 28.1. Grupos possíveis

- Informações gerais
- Conteúdo
- Experiências
- Informações práticas
- Localização
- Clima
- Eventos relacionados
- Galeria
- Fontes
- SEO
- Seções
- Histórico
- Versões
- Auditoria

## 28.2. Preview

O preview deve usar os mesmos componentes da página pública.

```text
dados em edição
↓
PageRenderer
↓
componentes públicos reais
```

## 28.3. Publicação

Estados:

- rascunho;
- publicado;
- arquivado;
- precisa revisar.

Salvar rascunho e publicar devem ser ações distintas.

---

# 29. Section Registry

As páginas devem ser modulares.

Estrutura conceitual:

```text
SectionDefinition
├── id
├── type
├── version
├── enabled
├── order
├── audience
├── pageScopes
├── variant
├── theme
├── content
├── dataSource
├── visibility
├── layout
└── analytics
```

Uma nova seção deve ser:

- componente;
- registrada;
- responsiva;
- rastreável;
- documentada;
- reutilizável.

Não exigir edição de páginas não relacionadas.

## 29.1. Variante por página

Alteração específica de um parceiro ou lugar não deve sobrescrever a seção global.

Criar variante/versionamento local.

## 29.2. Campo vazio

Campo sem informação:

- continua existindo no modelo;
- não aparece publicamente.

---

# 30. Versionamento e auditoria

Alterações devem ser registradas.

Auditoria mínima:

```text
actor
action
entity
timestamp
before
after
```

Restaurar uma versão antiga cria uma nova versão baseada nela.

Não apagar histórico.

Preferir arquivamento em vez de delete destrutivo para entidades já relacionadas a:

- visitas;
- Passaportes;
- roteiros;
- analytics.

---

# 31. Maturação de parceiros

O ciclo de 90 dias é uma referência, não uma sequência rígida.

Estágios possíveis:

```text
Entrada
↓
Ativação
↓
Primeiros dados
↓
Engajamento
↓
Consistência
↓
Maturação
```

O parceiro pode:

- avançar mais rápido;
- permanecer mais tempo;
- regredir;
- avançar novamente.

## 31.1. Maturidade do dado

Outra dimensão possível:

```text
DADO INICIAL
↓
SINAL
↓
PADRÃO
↓
INSIGHT
↓
OPORTUNIDADE
↓
HIPÓTESE EM TESTE
↓
APRENDIZADO VALIDADO
```

Não criar score definitivo de saúde/oportunidade sem dados suficientes.

---

# 32. Alertas do Admin

O Admin deve contemplar alertas como:

- parceiro sem visitas há 30 dias;
- QR instalado sem uso;
- muitas visitas e poucos cliques externos;
- crescimento forte;
- parceiro sem atualização há 90 dias;
- solicitação pendente há X dias;
- aumento anormal de avaliações negativas;
- parceiro entrando em muitos roteiros;
- turistas retornando ao estabelecimento;
- futuras oportunidades comerciais.

---

# 33. Evidência de atribuição

Evitar o antigo conceito genérico de “Conversion Confidence”.

Usar **Nível de Evidência de Atribuição**.

Exemplo:

1. visualização;
2. salvo;
3. inserido em roteiro;
4. contato;
5. presença física;
6. reserva confirmada, quando integrada;
7. transação confirmada, quando integrada.

Isso não é:

- score de saúde;
- maturidade;
- oportunidade;
- risco.

---

# 34. Conversão e monetização

Separar:

## Conversão digital

Exemplo:

- clique;
- salvar;
- adicionar ao roteiro;
- contato.

## Conversão física

Presença validada por QR.

## Conversão comercial

Só existe quando houver reserva, compra ou transação comprovada por integração.

O QR não comprova compra.

Se houver variável de desempenho no MVP, o percentual incide sobre a **mensalidade do parceiro**, não sobre gasto do turista.

A fórmula exata continua aberta.

---

# 35. Passaporte e gamificação

O Passaporte usa elementos de gamificação leve, mas não deve se tornar programa de recompensas.

Permitido:

- carimbos;
- memória de viagem;
- contagem por categoria;
- descoberta;
- retorno;
- reencontro;
- Passaporte geral;
- Passaporte por viagem.

Não permitido no MVP:

- pontos;
- moedas;
- ranking;
- desconto garantido;
- streak;
- competição;
- benefício obrigatório.

Condições especiais e Magical Moments ficam para depois da validação.

---

# 36. Reviews

Avaliações devem ser reais.

Não usar:

- estrelas falsas;
- depoimentos fictícios;
- prova social inventada.

A avaliação não deve ser solicitada obrigatoriamente no instante do scan do QR, porque o turista pode ter acabado de chegar.

Fluxo preferível:

```text
visita
↓
tempo
↓
convite posterior
```

---

# 37. Identidade visual global
> **Referências visuais complementares:** RV-26 a RV-33 para materialidade do Passaporte e RV-37/RV-38 para interação orbital. Consulte `REFERENCIAS_VISUAIS.md`.


A identidade deve combinar:

- turismo editorial;
- natureza;
- exploração;
- linguagem de passaporte;
- mapas;
- rotas;
- registros;
- carimbos;
- datas;
- numeração;
- materialidade;
- sensação de produto premium.

Sem aparência:

- burocrática;
- governamental;
- excessivamente vintage;
- documental oficial;
- gamificada;
- visualmente infantil.

A identidade final de cor, símbolo, capa e tipografia ainda será construída, portanto os componentes devem continuar parametrizados por tokens.

## 37.1. Interações orbitais e seletores curvos

Elementos inspirados em navegação circular, arco lateral ou seletor orbital podem ser utilizados em pontos estratégicos da experiência do turista.

Usos recomendados:

1. seleção de interesses no onboarding do roteiro;
2. navegação complementar entre capítulos do Passaporte no mobile;
3. exploração editorial de categorias, quando realmente agregar.

Não usar como padrão principal em:

- Admin;
- área do parceiro;
- tabelas;
- dashboards;
- calendário;
- formulários;
- analytics densos.

Requisitos:

- alternativa clicável, não depender apenas de arraste;
- navegação por teclado;
- labels legíveis;
- estado ativo claro;
- versão linear acessível;
- animação leve;
- suporte a `prefers-reduced-motion`.

---

# 38. Header global

Estrutura final:

```text
[Logo]
Explorar
Meu Passaporte
Para parceiros
[Montar meu roteiro]
[Entrar / Minha conta]
```

Regra importante:

**Montar meu roteiro aparece apenas uma vez, dentro do botão principal.**

---

# 39. Footer global

Pode incluir:

## Explore

- Lugares
- Categorias
- Experiências sem custo
- Eventos, quando públicos

## Passaporte

- Como funciona
- Meu Passaporte
- Para parceiros
- FAQ

## Informações

- Privacidade
- Termos
- Cookies
- Acessibilidade

## Contato

Não incluir White Label no MVP.

---

# 40. Sistema visual e CSS

Usar design tokens.

Exemplo:

```css
@layer reset, tokens, base, layout, components, utilities, overrides;
```

Tokens para:

- cores;
- tipografia;
- escala;
- pesos;
- line-height;
- espaçamento;
- grid;
- container;
- breakpoints;
- raios;
- bordas;
- sombras;
- motion;
- superfícies;
- estados.

Evitar valores de design hardcoded nos componentes.

## 40.1. Modo claro e modo escuro

A plataforma deve possuir **Light Mode e Dark Mode** como parte do sistema visual global.

A implementação não deve duplicar componentes. Ambos derivam dos mesmos tokens semânticos.

O sistema deve:

- respeitar `prefers-color-scheme` no primeiro acesso;
- oferecer Claro, Escuro e Sistema;
- persistir preferência quando aplicável;
- evitar flash de tema incorreto;
- manter contraste e foco visível.

### Passaporte físico no Dark Mode

A interface externa pode ficar escura, mas o Passaporte continua sendo um objeto físico.

Não transformar automaticamente as páginas em cartões pretos.

As superfícies do papel, capa, carimbos, tickets e impressão são adaptadas para conforto sem perder materialidade.

### Fotografias

Fotos dos pontos não recebem filtros escuros agressivos apenas por causa do tema.

## 40.2. Internacionalização e idiomas

O Passaporte Serra Negra deve nascer internacionalizado em:

- `pt-BR`, português do Brasil;
- `en`, inglês;
- `es`, espanhol.

Português é o idioma principal e fonte editorial original.

A internacionalização abrange:

- navegação;
- formulários;
- autenticação;
- onboarding;
- Travel Engine;
- roteiro;
- calendário;
- Passaporte;
- QR;
- parceiro;
- Admin;
- páginas públicas;
- categorias;
- experiências;
- eventos;
- mensagens de erro;
- estados vazios;
- SEO;
- Open Graph;
- acessibilidade.

Textos de interface não ficam hardcoded nos componentes.

Conteúdo editorial deve permitir traduções por entidade e status:

```text
missing
draft
translated
reviewed
published
needs_review
```

Alterações na versão original podem marcar traduções relacionadas como `needs_review`.

Tradução automática pode auxiliar a operação futuramente, mas não deve ser tratada silenciosamente como tradução revisada.

### URLs e SEO

A arquitetura deve permitir URLs e metadados por idioma.

Exemplo conceitual:

```text
/explorar
/lugares/[slug]

/en/explore
/en/places/[slug]

/es/explorar
/es/lugares/[slug]
```

Implementar:

- `hreflang`;
- canonical;
- `lang`;
- metadados localizados;
- sitemap internacional;
- slugs localizados quando definidos.

A troca de idioma deve preservar a página equivalente e o contexto da viagem sempre que possível.

Datas, números e formatação seguem o locale. Troca de idioma não implica conversão automática de moeda.

## 40.3. Motion Design System

Todas as animações e transições do produto devem transmitir uma sensação:

```text
suave
precisa
elegante
responsiva
premium
```

Princípios obrigatórios:

- easing com sensação de `ease-in-out`;
- opacidade como recurso principal;
- escala discreta;
- deslocamentos pequenos;
- sem bounce exagerado;
- sem overshoot;
- sem animações elásticas chamativas;
- sem loops decorativos constantes;
- sem animação que atrase conteúdo ou ação.

Padrões conceituais:

```text
entrada
opacity: 0 -> 1
scale: 0.98 -> 1
```

```text
saída
opacity: 1 -> 0
scale: 1 -> 0.99
```

Faixas de referência:

```text
microinteração            120-180 ms
hover/foco/seleção        160-220 ms
drawer/modal              220-320 ms
mudança de seção          280-400 ms
Passaporte/interação      300-450 ms
```

Os valores finais podem variar por contexto, mas devem manter coerência sistêmica.

### Performance

Priorizar:

- `transform`;
- `opacity`;
- CSS;
- SVG leve;
- carregamento antecipado do estado final.

Evitar:

- blur animado pesado;
- filtros caros;
- grandes reflows;
- vídeo para microinterações;
- bibliotecas pesadas dedicadas a efeitos simples.

A animação representa algo que já aconteceu, nunca bloqueia:

- login;
- validação;
- visita;
- navegação;
- salvamento;
- compartilhamento.

### Reduced motion

Com `prefers-reduced-motion`:

- reduzir ou remover escala;
- remover grandes deslocamentos;
- evitar viradas de página animadas;
- preservar feedback textual e estado final.

### Aplicação global

O Motion Design System vale para:

- Home;
- Explorar;
- cards;
- onboarding;
- seletor orbital;
- roteiro;
- calendário;
- mapa;
- Passaporte;
- aplicação do carimbo;
- compartilhamento;
- Sankey;
- visualizações territoriais;
- parceiro;
- Admin;
- modais;
- drawers;
- filtros;
- menus.

---

# 41. SVG e assets

Regra absoluta do projeto:

- não usar emojis na interface;
- ícones devem ser SVG;
- elementos vetoriais devem ser SVG;
- carimbos devem ser gerados em SVG;
- ícones de categoria devem ser SVG;
- usar famílias visuais consistentes;
- utilizar opções gratuitas com licença compatível;
- registrar licenças.

Arquivo recomendado:

```text
ASSET_LICENSES.md
```

---

# 42. Diagramas e visualizações de inteligência
> **Referência técnica adicional:** pacote Diagram Design fornecido separadamente. As imagens do índice visual são referências de interface, não dados de analytics.


O pacote **Diagram Design** deve ser adaptado nativamente ao sistema, não usado como iframe ou página demo incorporada.

Os padrões necessários devem ser reimplementados como componentes React/TypeScript orientados a dados, usando:

- SVG;
- design tokens;
- responsividade;
- acessibilidade;
- Light e Dark Mode;
- tracking first-party;
- dados reais;
- animações discretas.

Regra:

> gráficos respondem "quanto?"

> diagramas respondem "como se relaciona?"

Evitar radar, quadrantes e scores visuais quando ainda não houver base empírica suficiente.

Tipos úteis:

- Line;
- Bar;
- Sankey;
- Journey;
- Timeline;
- State;
- Loop;
- Treemap;
- Process;
- DataFlow;
- Scatter futuramente.

## 42.1. Journey Sankey mestre

O principal Sankey do Admin responde:

> Como o turista entrou na rede, o que descobriu, quais sinais de intenção demonstrou, que ações realizou e qual nível de evidência foi observado?

Estrutura:

```text
ORIGEM
-> DESCOBERTA
-> INTENÇÃO
-> AÇÃO
-> PRESENÇA
```

### Origem

Pode incluir:

- busca orgânica;
- acesso direto;
- rede social;
- QR do Passaporte;
- compartilhamento;
- referência externa;
- campanha identificada;
- desconhecida.

Nunca inventar origem quando não houver evidência.

### Descoberta

Pode incluir:

- Home;
- Explorar;
- categoria;
- ponto turístico;
- parceiro;
- experiência;
- evento;
- roteiro.

### Intenção

Pode incluir:

- visualizou lugar;
- visualizou experiência;
- salvou;
- adicionou ao roteiro;
- abriu mapa;
- iniciou roteiro;
- visualizou contato.

### Ação

Pode incluir:

- criou roteiro;
- adicionou parada;
- clicou no WhatsApp;
- clicou no telefone;
- abriu site;
- abriu reserva externa;
- abriu navegação;
- compartilhou;
- criou ou acessou conta.

### Presença

No MVP:

- visita registrada por QR;
- retorno registrado;
- sem presença observável.

"Sem presença observável" não significa que a visita não ocorreu.

### Unidade de análise

Permitir pelo menos:

```text
Visitantes únicos
Sessões
```

O padrão administrativo pode priorizar visitantes únicos.

### Interação

Selecionar um nó filtra visualmente os caminhos relacionados.

O gráfico deve permitir filtros como:

- período;
- origem;
- categoria;
- com roteiro / sem roteiro;
- primeira visita / retorno;
- evento;
- clima;
- idioma.

Clima e eventos funcionam principalmente como **contexto/filtro**, não como causa presumida.

### Versão do parceiro

A versão do parceiro é reduzida e responde:

> Como os turistas chegam até você e o que fazem depois?

Exemplo:

```text
Explorar -------\
Roteiro ---------\
Busca ------------> SUA PÁGINA
Compartilhamento -/      |
                         +-> WhatsApp
                         +-> Site
                         +-> Reserva externa
                         +-> Visita registrada
```

Não expor concorrentes individualmente quando isso contrariar a política de inteligência da rede.

### Acessibilidade

Sempre disponibilizar representação equivalente em tabela.

## 42.2. Mapa de circulação territorial

A visualização territorial responde:

> Por onde os turistas estão circulando dentro de Serra Negra?

Combina:

```text
MAPA REAL
+
PONTOS
+
FLUXOS
+
VOLUME
+
CONTEXTO TEMPORAL
```

Pode usar Google Maps como base funcional, com camada própria do Passaporte para os fluxos.

### Significado da conexão

```text
A -> B
```

significa que houve jornadas observadas em que uma presença registrada em A foi seguida de presença registrada em B.

Não significa rastreamento GPS contínuo.

### Modos

O mesmo componente pode oferecer:

- **Fluxos**, conexões entre lugares;
- **Concentração**, distribuição agregada;
- **Lugares**, volumes por ponto.

### Interações

Selecionar um lugar pode mostrar:

- visitas registradas;
- visitantes únicos;
- origens anteriores agregadas;
- próximos registros agregados.

Filtros possíveis:

- período;
- categoria;
- manhã / tarde / noite;
- clima;
- evento;
- primeira visita / retorno.

### Privacidade

Não mostrar:

- caminho individual;
- localização em tempo real;
- sequência identificável;
- GPS histórico de uma pessoa.

Aplicar thresholds de agregação quando necessário.

### Relação com o Sankey

```text
SANKEY
=
como o fluxo se organiza

MAPA
=
onde o fluxo aconteceu
```

Uma seleção no Sankey pode abrir o mapa já filtrado e vice-versa.

## 42.3. Planejado versus registrado

Essa visualização conecta:

- Travel Engine;
- roteiro;
- calendário;
- QR;
- Passaporte.

Pergunta:

> O que foi planejado e o que possui evidência registrada?

Regra:

```text
Planejado
=
estava no roteiro

Registrado
=
há evidência

Sem evidência
!=
não realizado
```

### Estados

- planejado e registrado;
- planejado sem evidência;
- registrado fora do roteiro;
- substituído;
- reorganizado.

Não usar "percentual do roteiro concluído" quando isso puder sugerir certeza inexistente.

Exemplo factual:

```text
5 paradas planejadas
3 com presença registrada
1 descoberta fora do roteiro
2 sem evidência registrada
```

### Turista

No desktop, pode usar timeline comparativa lado a lado.

No mobile, usar sequência linear.

Visitas espontâneas fora do roteiro podem aparecer como:

> descoberta durante a viagem

quando realmente forem novas para aquele usuário.

### Admin

A versão agregada pode comparar padrões de planejamento e presença registrada sem inferir que ausência de QR significa ausência física.

### Parceiro

A versão simplificada pode mostrar:

- inclusões em roteiro;
- presenças posteriormente registradas;
- visitas registradas sem inclusão prévia.

## 42.4. Influência de clima e eventos

Clima e eventos devem ser analisados usando os componentes já definidos, principalmente:

- filtros do Sankey;
- comparação temporal;
- mapa territorial;
- Line/Bar;
- PlannedVsRealized.

Não criar uma linguagem visual completamente separada.

Sempre escrever em termos de:

- associação;
- mudança observada;
- diferença entre períodos;
- concentração relativa.

Evitar linguagem causal sem desenho analítico que a sustente.

## 42.5. Componentes técnicos

Arquitetura conceitual:

```text
JourneySankey
TerritorialFlowMap
PlannedVsRealizedJourney
TripTimeline
TravelCalendar
PassportJourneyMap
```

Todos devem usar dados reais e ser registrados em um `DataVisualizationRegistry` ou arquitetura equivalente.

---

# 43. RBAC e segurança

Papéis principais:

- admin;
- tourist;
- partner.

Futuros:

- editor;
- moderator;
- outros papéis especializados.

Quando compatível, Clerk pode ser usado para autenticação e RBAC.

O frontend controla visibilidade.

O backend controla autorização real.

Permissões possíveis:

```text
place:read
trip:create
trip:edit_own
passport:manage_own
partner:read_own
partner:edit_allowed_fields
partner:request_change
partner:view_own_analytics
admin:manage_places
admin:manage_partners
admin:manage_users
admin:manage_content
admin:manage_events
admin:manage_qr
admin:view_network_analytics
```

Nunca confiar em role enviada pelo navegador.

---

# 44. Privacidade, compliance e acessibilidade

A plataforma deve contemplar:

- política de privacidade real;
- termos;
- cookies;
- consentimento quando aplicável;
- minimização de dados;
- auditoria de analytics;
- auditoria de embeds de terceiros;
- revisão de LGPD;
- acessibilidade;
- navegação por teclado;
- foco visível;
- labels;
- mensagens de erro claras;
- contraste;
- alt text;
- logs;
- auditoria.

Itens jurídicos contextuais devem ser revisados profissionalmente antes de alegar conformidade definitiva.

---

# 45. SEO e produção

Prever:

- títulos únicos;
- meta descriptions;
- Open Graph;
- imagem social;
- canonical;
- robots.txt;
- 404 customizada;
- breadcrumbs quando fizer sentido;
- links internos;
- LocalBusiness schema apenas quando real e apropriado;
- CTA acima da dobra em páginas comerciais;
- página de agradecimento após formulário válido;
- revisão final de segurança, compliance, conversão e descoberta.

Robots.txt não é mecanismo de segurança.

---

# 46. Modelo de dados mínimo

Entidades recomendadas:

```text
City
Place
PlaceCategory
Experience
Partner
PartnerUser
TravelerUser
AnonymousVisitor
Session
Trip
TripDay
TripItem
Visit
QrCode
Review
Event
WeatherSnapshot
Source
Section
SectionField
PageSection
ContentVersion
PartnerRequest
TrackingEvent
PartnerMaturityHistory
Alert
ConsentRecord
```

Possíveis entidades futuras:

- Contact
- Booking
- Affinity
- Availability

Seeds devem ser idempotentes por slug/chave/upsert.

---

# 47. Regra para decisões visuais futuras

Somente elementos que realmente dependam de uma linguagem visual própria devem continuar sendo discutidos individualmente.

Telas que já podem reutilizar padrões existentes devem adaptar apenas:

- campos;
- seções;
- permissões;
- estados;
- dados;
- conteúdo;
- contexto.

Não criar uma linguagem visual nova para cada página.

## 47.1. Elementos visuais já suficientemente definidos

- Home e direção editorial;
- Explorar;
- página de ponto turístico;
- página pública de parceiro;
- onboarding do roteiro;
- rota gerada;
- edição do roteiro;
- calendário da viagem;
- Passaporte físico digital;
- anatomia das páginas do Passaporte;
- ticket de viagem;
- carimbo, já desenvolvido;
- aplicação do carimbo;
- compartilhamento por dobra;
- mapa vetorial territorial;
- caminho planejado versus vivido;
- seletor orbital como padrão opcional;
- Sankey de jornada;
- mapa de circulação territorial;
- planejado versus registrado;
- Motion Design System.

## 47.2. Elementos que reutilizam padrões existentes

Exemplos:

- histórico detalhado de viagens;
- conta do turista;
- solicitações;
- fontes;
- auditoria;
- versões;
- detalhes administrativos;
- editor de campos;
- formulários;
- tabelas;
- timelines;
- drawers;
- telas de status;
- análises de clima;
- análises de eventos.

Esses elementos devem adaptar os componentes existentes em vez de criar novas experiências visuais independentes.

---

# 48. Prioridade visual e de construção atual

A maior parte das linguagens visuais proprietárias necessárias para o MVP já possui direção definida.

A prioridade agora deve migrar de **inventar novas telas** para:

1. consolidar a identidade visual final;
2. transformar as decisões em design tokens;
3. implementar os componentes reutilizáveis;
4. integrar dados reais;
5. validar responsividade;
6. validar Light e Dark Mode;
7. validar `pt-BR`, `en` e `es`;
8. validar acessibilidade;
9. validar performance;
10. revisar tracking e privacidade.

A identidade visual final ainda precisa fechar principalmente:

- paleta;
- tipografia;
- símbolo;
- capa final do Passaporte;
- materialidade;
- acabamento dos elementos físicos digitais;
- sistema fotográfico;
- detalhes vetoriais territoriais.

O carimbo já desenvolvido deve ser incorporado ao sistema, não redesenhado.

---

# 49. Estado atual do MVP

## 49.1. Estrutura funcional bem definida

- Home;
- Explorar;
- página de ponto turístico;
- página pública de parceiro;
- experiências contextuais e autônomas;
- onboarding do roteiro;
- Travel Engine;
- roteiro gerado;
- edição de roteiro;
- calendário de viagem;
- Passaporte físico digital;
- ticket de viagem;
- compartilhamento;
- QR de visita;
- confirmação de presença;
- eventos como contexto e dado;
- clima;
- Google Maps;
- mapa vetorial de Serra Negra;
- área do parceiro;
- Admin;
- CMS;
- tracking anônimo e autenticado;
- RBAC;
- versionamento;
- modularidade;
- Light Mode e Dark Mode;
- português, inglês e espanhol;
- SEO internacional;
- Sankey;
- circulação territorial;
- planejado versus registrado;
- Motion Design System.

## 49.2. Decisões fechadas importantes

- QR de evento não entra por enquanto;
- QR do Concierge é futuro e separado;
- carimbo já está desenvolvido;
- fotos representam o local, não campanhas;
- Passaporte não é programa de fidelidade;
- ausência de QR não significa ausência de visita;
- recomendações públicas não usam ranking pago;
- mapa funcional pode usar Google Maps;
- inteligência e relevância permanecem no Passaporte;
- toda dobra relevante do Passaporte pode ser compartilhada;
- o ticket é uma opção compartilhável;
- animações devem ser discretas, premium e performáticas.

## 49.3. Itens ainda a fechar antes da implementação visual final

Principalmente:

- identidade visual definitiva;
- paleta;
- tipografia;
- símbolo;
- acabamento final da capa;
- escolha e preparação do mapa vetorial real de Serra Negra;
- conjunto inicial de fotografias licenciadas;
- thresholds operacionais e de privacidade dos analytics;
- fórmula comercial final, quando aplicável;
- regras finais de deduplicação e antifraude do QR;
- revisão jurídica e de LGPD baseada na implementação real.

---

# 50. Princípio de construção daqui para frente

A plataforma deve crescer por **reuso de sistema**, não por criação isolada de telas.

Todo componente novo deve nascer compatível com:

- Light Mode e Dark Mode;
- `pt-BR`, `en` e `es`;
- design tokens;
- Motion Design System;
- acessibilidade;
- responsividade;
- tracking aplicável;
- regras de privacidade;
- estados de loading, vazio, erro e sucesso.

Quando um padrão já existir, adaptar:

```text
campos
+
dados
+
seções
+
permissões
+
contexto
```

em vez de criar um componente inteiramente novo.

Novas decisões visuais só devem ser abertas quando a necessidade realmente não for atendida pelo sistema atual.

---

# 51. Resumo executivo da arquitetura atual

```text
PASSAPORTE SERRA NEGRA
│
├── TURISTA
│   ├── Home
│   ├── Explorar
│   ├── Lugares
│   ├── Experiências
│   ├── Montar roteiro
│   ├── Roteiro
│   ├── Calendário
│   ├── Mapa
│   ├── QR de visita
│   └── Passaporte físico digital
│       ├── capa
│       ├── identificação
│       ├── ticket
│       ├── carimbos
│       ├── descobertas
│       ├── reencontros
│       ├── categorias
│       ├── caminho vivido
│       ├── histórico
│       └── compartilhamento
│
├── PARCEIRO
│   ├── dashboard
│   ├── Minha Página
│   ├── dados próprios
│   ├── links externos
│   ├── solicitações
│   └── inteligência do próprio negócio
│
├── ADMIN
│   ├── controle geral
│   ├── CMS
│   ├── parceiros
│   ├── lugares
│   ├── experiências
│   ├── eventos
│   ├── QR
│   ├── fontes
│   ├── versões
│   ├── auditoria
│   └── inteligência
│       ├── Journey Sankey
│       ├── circulação territorial
│       ├── planejado x registrado
│       ├── clima
│       └── eventos
│
└── INFRAESTRUTURA COMPARTILHADA
    ├── Travel Engine
    ├── Google Maps/provider de mapas
    ├── clima
    ├── eventos
    ├── tracking
    ├── RBAC
    ├── i18n
    ├── Light/Dark Mode
    ├── Section Registry
    ├── versionamento
    ├── design tokens
    └── Motion Design System
```

O MVP deve continuar restrito operacionalmente a **Serra Negra, SP**, ainda que o modelo de dados seja preparado para expansão futura.

O **Concierge Digital White Label** permanece um produto futuro separado e não deve expandir o escopo atual.

# 52. Referências visuais

As referências visuais usadas na construção estão empacotadas na pasta `referencias/` e indexadas em [`REFERENCIAS_VISUAIS.md`](REFERENCIAS_VISUAIS.md).

## 52.1. Regra de uso

- `RV-01` a `RV-20`: referências visuais iniciais consolidadas em 08/09/2026.
- `RV-21` a `RV-33`: Passaporte físico, ticket, carimbos e linguagem de viagem.
- `RV-34` a `RV-36`: calendário da viagem.
- `RV-37` e `RV-38`: navegação orbital e seletores curvos.
- `RV-39` a `RV-41`: roteiro, percurso e wireframes responsivos.
- `RV-42` a `RV-48`: exploração, páginas editoriais e experiências.
- `RV-49`: exploração territorial, mapa e eventos.

As referências são direcionais. Não copiar identidade, marca, texto, fotografia ou composição proprietária de terceiros como ativo final do Passaporte.

## 52.2. Arquivos

- **RV-01**: [Hero editorial de destino, base para fotografia de impacto.](referencias/01_home_ref_vienna_hero.png)
- **RV-02**: [Hero com busca como porta de entrada para descoberta.](referencias/02_home_ref_escape_search_hero.png)
- **RV-03**: [Cards de pontos turísticos com destaque e navegação lateral.](referencias/03_home_ref_saint_antonin_cards.png)
- **RV-04**: [Loop/carrossel de parceiros, adaptado para exposição neutra.](referencias/04_home_ref_adventure_partner_loop.png)
- **RV-05**: [Elemento visual de rota com pontos conectados.](referencias/05_home_ref_old_riga_route.png)
- **RV-06**: [Seleção editorial de tipos de roteiro.](referencias/06_home_ref_morocco_route_types.png)
- **RV-07**: [Cards altos para tipos/modelos de roteiro.](referencias/07_home_ref_idyll_route_cards.png)
- **RV-08**: [Seções editoriais para variar ritmo da landing.](referencias/08_home_ref_travel_time_sections.png)
- **RV-09**: [Composição editorial com respiro e fotografia.](referencias/09_home_ref_creacy_editorial_sections.png)
- **RV-10**: [Categorias de parceiros e exploração visual.](referencias/10_home_ref_miljo_partner_categories.png)
- **RV-11**: [Página pública de parceiro, hero e conteúdo.](referencias/11_partner_page_ref_armonia.png)
- **RV-12**: [Página pública de parceiro, organização editorial.](referencias/12_partner_page_ref_idyll.png)
- **RV-13**: [Módulos de conteúdo e informação do estabelecimento.](referencias/13_partner_page_ref_cabin_modules.png)
- **RV-14**: [Informação prática e FAQ em página de negócio.](referencias/14_partner_page_ref_athens_info_faq.png)
- **RV-15**: [FAQ e introdução da dinâmica do Passaporte em área escura.](referencias/15_home_ref_faq_passport_dark.png)
- **RV-16**: [Landing de chamada para entrada de parceiros.](referencias/16_partner_acquisition_landing_ref_old_riga.png)
- **RV-17**: [Estrutura visual de dashboard do parceiro.](referencias/17_partner_dashboard_ref_dropify.png)
- **RV-18**: [Dashboard administrativo com visão geral.](referencias/18_admin_dashboard_ref_dodo.png)
- **RV-19**: [Componentes compartilhados entre parceiro e Admin.](referencias/19_dashboard_shared_components_ref_caplen.png)
- **RV-20**: [Tabelas, perfis e dados operacionais.](referencias/20_dashboard_tables_profiles_ref_korean.png)
- **RV-21**: [Bilhete de viagem minimalista e hierarquia de informação.](referencias/21_passaporte_ref_boarding_pass_minimal.png)
- **RV-22**: [Linguagem modular de viagem, passport card, navegação e cartões funcionais.](referencias/22_passaporte_ref_travel_app_modular_cards.png)
- **RV-23**: [Composição mobile editorial de descoberta, destino e detalhe.](referencias/23_turista_ref_mobile_destination_editorial.png)
- **RV-24**: [Ticket mobile, estados de viagem e apresentação em cartão físico.](referencias/24_passaporte_ref_mobile_boarding_pass.png)
- **RV-25**: [Bilhete de viagem compartilhável com forte identidade editorial.](referencias/25_passaporte_ref_bali_boarding_pass_poster.png)
- **RV-26**: [Capa física com materialidade e ticket inserido.](referencias/26_passaporte_ref_capa_fisica_verde.png)
- **RV-27**: [Passaporte aberto com páginas editoriais, selos e campos de registro.](referencias/27_passaporte_ref_abertura_editorial.png)
- **RV-28**: [Composição orgânica e sobreposição de carimbos de viagem.](referencias/28_passaporte_ref_colagem_carimbos.png)
- **RV-29**: [Distribuição de carimbos em duas páginas abertas.](referencias/29_passaporte_ref_abertura_carimbos.png)
- **RV-30**: [Materialidade, contraste e hierarquia de capas de passaporte.](referencias/30_passaporte_ref_capas_internacionais.png)
- **RV-31**: [Página dupla contemporânea com carimbos gráficos.](referencias/31_passaporte_ref_paginas_carimbos_moderno.png)
- **RV-32**: [Referência de spread de identificação e registros físicos.](referencias/32_passaporte_ref_identificacao_spread.png)
- **RV-33**: [Ticket encaixado em passaporte, base para dobra compartilhável.](referencias/33_passaporte_ref_ticket_inserido.png)
- **RV-34**: [Calendário mensal limpo com hierarquia editorial.](referencias/34_calendario_ref_mes_minimalista.png)
- **RV-35**: [Calendário compacto com eventos laterais e marcação de datas.](referencias/35_calendario_ref_eventos_compacto.png)
- **RV-36**: [Visão semanal por horários, adequada à organização da viagem.](referencias/36_calendario_ref_semana_dashboard.png)
- **RV-37**: [Menu curvo com item ativo, opacidade e progressão espacial.](referencias/37_interacao_ref_navegacao_orbital_desktop.png)
- **RV-38**: [Seletor curvo mobile para interesses ou capítulos.](referencias/38_interacao_ref_navegacao_orbital_mobile.png)
- **RV-39**: [Percurso visual com paradas, imagens e linha conectando pontos.](referencias/39_roteiro_ref_percurso_visual_vertical.png)
- **RV-40**: [Hero editorial com rota desenhada e leitura territorial.](referencias/40_roteiro_ref_rota_editorial_deserto.png)
- **RV-41**: [Wireframes responsivos para organização de viagem e edição.](referencias/41_roteiro_ref_wireframes_responsivos.png)
- **RV-42**: [Landing de turismo com busca, destino em destaque e seções editoriais.](referencias/42_home_ref_landing_busca_destinos.png)
- **RV-43**: [Landing de destino com hero fotográfico e descoberta visual.](referencias/43_explorar_ref_destination_dark.png)
- **RV-44**: [Composição editorial assimétrica com texto, imagem e blocos informativos.](referencias/44_lugar_ref_editorial_assimetrico.png)
- **RV-45**: [Direção visual escura de aventura e destinos em mobile.](referencias/45_explorar_ref_adventure_dark_mobile.png)
- **RV-46**: [Página de aventura com cards, fotografia e ritmo editorial.](referencias/46_explorar_ref_adventure_web.png)
- **RV-47**: [Exploração mobile com cards e navegação leve.](referencias/47_explorar_ref_mobile_cards_claros.png)
- **RV-48**: [Cards editoriais para experiências e destinos.](referencias/48_experiencia_ref_cards_editoriais.png)
- **RV-49**: [Página territorial com mapa vetorial, categorias e eventos.](referencias/49_mapa_ref_exploracao_territorial_eventos.png)
