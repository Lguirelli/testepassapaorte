# Passaporte Serra Negra — Premium Experience v9

## Objetivo

Elevar a demonstração estática para uma experiência de produto premium sem transformar a interface em uma coleção de efeitos decorativos. A implementação usa continuidade espacial, microinterações consistentes, personalização, contexto e manipulação direta.

## 1. Navegação espacial

- As mudanças de rota continuam usando slide horizontal de tela inteira.
- A direção segue a profundidade de navegação sempre que possível.
- A navegação não usa fade de página.
- `prefers-reduced-motion` continua sendo respeitado.

## 2. Shared Element Transition

Cards de lugares podem compartilhar a mídia com o hero da página de destino por meio da View Transitions API.

- card/lista -> detalhe;
- card de parceiro -> hero do parceiro;
- pins/atalhos compatíveis -> detalhe;
- fallback continua sendo a navegação horizontal existente.

A mídia selecionada recebe temporariamente `view-transition-name: place-media`.

## 3. Header contextual

- topo da Home: transparente sobre o hero;
- após o scroll: superfície glass com blur e altura/padding reduzidos;
- páginas internas: cores de texto voltam ao contexto semântico do tema;
- Home e Parceiros preservam foreground claro quando o fundo exige.

## 4. Cards premium

- o card inteiro se move no hover;
- mídia interna não possui zoom independente;
- ação contextual “Explorar” é revelada no hover/focus;
- clique possui resposta curta de pressão;
- destaque de mapa/card é sincronizado.

## 5. Explorar: Lista <-> Mapa

A tela Explorar ganhou dois modos:

- Lista;
- Mapa.

A mudança usa View Transitions e nomes compartilhados por lugar, permitindo que cards se transformem visualmente em pins.

No mapa:

- pins e índice lateral se destacam em conjunto;
- clicar em um pin abre uma prévia contextual sem sair do mapa;
- a prévia permite abrir a experiência completa ou adicionar ao roteiro.

## 6. Progressive disclosure

Informações operacionais detalhadas das páginas turísticas foram movidas para um componente `details` acessível.

O essencial permanece visível primeiro; notas adicionais são abertas sob demanda.

## 7. Recomendações contextuais

Os blocos “Continue explorando” deixaram de usar apenas a ordem do array.

Quando existem coordenadas, os próximos lugares são ordenados por proximidade geográfica usando distância Haversine.

Os cards exibem distância aproximada quando esse contexto está disponível.

## 8. Roteiro manipulável

O roteiro agora aceita:

- drag-and-drop dos cards;
- botões acessíveis Subir/Descer para teclado/mobile;
- recálculo dos horários após reorganização;
- preservação das paradas fixadas como âncoras temporais;
- indicador visual durante drag;
- painel de leitura inteligente do dia.

O painel informa quantidade de paradas, distância aproximada da sequência e próximo horário disponível.

## 9. Feedback inteligente

Adicionar um lugar agora responde com contexto real do estado:

- dia escolhido;
- horário calculado;
- nome da parada.

Adicionar diretamente pelo roteiro também comunica o próximo horário disponível.

## 10. Passaporte como objeto digital

O SVG enviado pelo usuário passou a ser a folha real do Passaporte.

Arquivos:

- `assets/brand/passport/folha-passaporte-original.svg`
- `assets/brand/passport/folha-passaporte.svg`

A versão web foi otimizada removendo apenas metadata/C2PA pesada, preservando a arte vetorial.

A folha funciona como um spread físico:

- lado esquerdo do SVG = página esquerda;
- lado direito do SVG = página direita;
- conteúdo HTML é sobreposto às páginas;
- o preview da Home reutiliza a mesma identidade visual.

## 11. Virada de página

A navegação dentro do Passaporte usa uma transição própria:

- avanço: deslocamento discreto e rotação Y curta;
- retorno: movimento invertido;
- sem efeito exagerado de livro 3D;
- reduzido/desativado com `prefers-reduced-motion`.

## 12. Carimbo físico

Um registro recém-criado recebe uma microanimação curta:

- entrada em escala reduzida;
- pequena rotação;
- overshoot controlado;
- estabilização.

## 13. Personalização da Home

Depois que o onboarding gera uma viagem:

- `trip.personalized = true`;
- hero passa a reconhecer perfil, ritmo e período;
- aparece um resumo da viagem dentro do hero;
- a seção do roteiro sobe na hierarquia;
- pontos turísticos e parceiros são priorizados conforme interesses;
- categorias escolhidas aparecem primeiro.

Isso mantém o mesmo banco de conteúdo, mas muda sua ordem conforme o estado da viagem.

## 14. Carregamento visual

As imagens permanecem com geometria estável e passam a revelar a mídia suavemente depois do carregamento.

Como a aplicação atual usa dados locais e não possui requests de conteúdo assíncronos, não foi introduzido um skeleton artificial que aumentaria a duração percebida sem benefício real.

## 15. Compartilhamento

O Passaporte usa `navigator.share` quando disponível.

Fallback: copiar resumo para a área de transferência.

## 16. Acessibilidade

As melhorias preservam ou adicionam:

- `prefers-reduced-motion`;
- botões de ordenação como alternativa ao drag-and-drop;
- labels dos pins;
- estados focus-visible;
- `details/summary` nativo;
- interação do mapa por teclado;
- compartilhamento com fallback.

## Validação técnica

Validações executadas:

- `node --check` nos JavaScript principais;
- contagem balanceada de chaves nos CSS;
- verificação de todos os assets locais referenciados;
- validação do SVG otimizado;
- auditoria de presença dos módulos premium em `premium-validation.json`.

Resultado:

- 0 assets locais ausentes;
- SVG do Passaporte válido e com `viewBox` preservado;
- metadata pesada removida da versão web;
- referências antigas ao fundo fotográfico do header removidas do CSS operacional;
- header permanece transparente no topo.

O Chromium headless deste ambiente não concluiu a navegação visual dentro do timeout disponível, portanto a validação final realizada aqui foi estrutural/estática, além do servidor HTTP local responder corretamente.
