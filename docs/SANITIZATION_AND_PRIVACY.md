# Sanitização de informação e privacidade por fronteira

**Status:** requisito transversal do produto.  
**Escopo:** entrada, persistência, observabilidade, exposição, retenção e empacotamento.

## 1. Princípio

Sanitização não significa apagar conteúdo válido. O projeto separa responsabilidades:

1. **validar na fronteira** formato, tamanho, enumerações e estrutura esperados;
2. **normalizar antes de persistir** somente quando a normalização é semanticamente segura;
3. **minimizar** o que é persistido e evitar cópias desnecessárias;
4. **escapar/validar na saída** conforme o contexto, como texto, URL, asset, SVG, redirect e CSS;
5. **pseudonimizar** identidade quando a identidade civil não é necessária;
6. **agregar** inteligência antes de exibir dimensões que possam facilitar inferência individual;
7. **redigir** logs e auditoria que não precisam reter valores sensíveis;
8. **reter por prazo configurável** e oferecer rotina de expurgo;
9. **bloquear o pacote** quando a auditoria automatizada encontrar material incompatível com estas regras.

A validação do cliente é UX. A autoridade permanece no servidor.

## 2. Classificação de dados

| Classe | Exemplos | Regra principal |
|---|---|---|
| Público pesquisado | atrativos, descrições, fontes, fotos licenciadas | publicar somente conteúdo validado, com proveniência |
| Contato comercial | telefone/site/WhatsApp de parceiro | armazenar apenas em entidade de parceiro; validar por tipo |
| Identidade de acesso | e-mail recebido no login | não persistir o e-mail nas tabelas operacionais; derivar `authSubject` por HMAC |
| Identificador pseudônimo | `traveler-*`, `partner-user-*`, UUIDs técnicos | usar somente onde necessário à operação |
| Dados privados de viagem | datas, interesses, necessidades, roteiro, visitas | restringir ao proprietário/Admin autorizado e não enviar ao analytics opcional |
| Analytics opcional | page view, categoria, lugar, origem agregável | somente com consentimento no cliente; payload por allowlist; sem identidade do turista |
| Auditoria | ator pseudônimo, ação, entidade, versões | metadados mínimos; redaction em profundidade |
| Segredos | sessão, pepper, credenciais de ambiente, DSN | somente ambiente; nunca seed, log, bundle público ou ZIP final |
| Demonstração | parceiros e contas `.local` | `synthetic=true`; domínio reservado; proibidos como fato real |

## 3. Núcleo compartilhado

`src/core/security/sanitize.ts` centraliza:

- normalização Unicode e remoção de controles invisíveis de risco;
- IDs e slugs por allowlist;
- e-mail e senha em fronteiras de autenticação;
- narrativa operacional que rejeita dados sensíveis desnecessários;
- redirects internos relativos;
- URLs externas HTTPS sem credenciais e sem hosts locais/privados conhecidos;
- referências de assets;
- telefone, WhatsApp e Instagram;
- posição segura de imagem;
- objetos estruturados com limites de profundidade/quantidade e bloqueio de chaves de prototype pollution;
- payloads de analytics por allowlist;
- anonimização de paths privados antes de analytics;
- redaction de auditoria/log;
- mensagens públicas de erro sem detalhes técnicos;
- validação de origem e leitura limitada de JSON.

## 4. Autenticação e pseudonimização

A senha recebida é limitada e nunca registrada. O e-mail é validado no login, mas as tabelas operacionais não persistem o e-mail puro.

A identidade operacional é derivada por:

```text
HMAC-SHA256(IDENTITY_PEPPER, email_normalizado)
```

Regras:

- `IDENTITY_PEPPER` deve possuir ao menos 32 caracteres;
- em produção deve existir explicitamente;
- em produção não pode ser igual a `SESSION_SECRET`;
- IDs de turista/parceiro/Admin derivam do subject pseudônimo, não de SHA-1 simples do e-mail;
- `SESSION_SECRET` assina sessão e possui finalidade separada;
- cookie de sessão é `HttpOnly`, `SameSite=Strict` e `Secure` em produção;
- credenciais `.local` e segredos de demonstração são recusados em produção;
- PGlite/fallback local não substituem a configuração de banco de produção.

O adaptador local de credenciais continua sendo uma superfície de desenvolvimento. A integração de identidade usada no lançamento deve passar pela mesma camada de RBAC/ownership e política de minimização.

## 5. Entradas públicas

### Query params e rotas

- slugs e IDs dinâmicos são validados antes de consultas;
- filtros de Explorar usam allowlists/limites;
- redirects de login aceitam somente caminhos relativos da aplicação;
- parâmetros de compartilhamento usam valores fechados;
- paths enviados ao analytics perdem IDs de QR, viagens, compartilhamento e recursos Admin.

### APIs JSON

Rotas JSON:

- validam `Origin`/`Sec-Fetch-Site` quando disponíveis;
- exigem `application/json`;
- limitam tamanho declarado e tamanho real do body;
- usam Zod estrito quando há payload estruturado;
- descartam propriedades fora da allowlist;
- retornam mensagem pública genérica em falha técnica.

`req.json()` direto é bloqueado pela auditoria de sanitização nas APIs do projeto.

## 6. Conteúdo e Admin

- schema editorial é `.strict()`;
- campos são sanitizados por tipo antes da persistência;
- relacionamentos usam IDs validados;
- URLs externas exigem HTTPS público;
- datas de evento/verificação são validadas;
- caminhos de mídia bloqueiam traversal;
- posição de imagem usa gramática fechada;
- seed passa pelo mesmo validador antes de virar conteúdo canônico;
- `content_versions` mantém a versão sanitizada necessária à restauração;
- `audit` mantém apenas metadados operacionais necessários.

O renderer React usa escaping padrão. O runtime não usa `dangerouslySetInnerHTML`, `.innerHTML=`, `document.write`, `eval` ou `new Function` para conteúdo do produto.

## 7. Parceiros

Edição direta aceita somente campos explicitamente permitidos. No servidor:

- horário é texto limitado;
- tempo de resposta é allowlist;
- contatos usam validadores específicos;
- website, reserva e imagem externa exigem HTTPS público;
- updates usam controle de versão;
- auditoria registra versões e nomes de campos, sem duplicar contatos.

Solicitações estruturais aceitam narrativa operacional, mas rejeitam e-mail, telefone, token, credencial ou caminho técnico desnecessário. A interface orienta o parceiro a não inserir esses dados.

Métricas dimensionais de origem só aparecem ao atingir o limiar agregado de privacidade configurado, nunca abaixo de 3 observações.

## 8. Viagens, QR e compartilhamento

- perfil da viagem usa schema estrito;
- datas precisam representar datas reais e a duração é limitada;
- enums controlam intenções, transporte, ritmo e necessidades;
- IDs, horários e operações de edição são validados no servidor;
- QR associa `Visit` ao viajante autenticado e aplica deduplicação configurável;
- QR não é tratado como prova de compra, reserva, consumo ou gasto;
- o compartilhamento é solicitado pelo proprietário da viagem;
- modo compacto remove datas e nomes de lugares;
- SVG exportado escapa todo texto dinâmico e usa `Cache-Control: private, no-store`.

## 9. Analytics e consentimento

Analytics opcional depende de escolha explícita.

Antes do consentimento ou após negação:

- o cliente não envia a requisição de tracking;
- o endpoint também rejeita persistência caso seja chamado sem `psn_analytics=granted`;
- negação apaga `psn_anon` e `psn_tracking_session` do navegador.

Quando permitido:

- identificadores de visitante/sessão são UUIDs técnicos;
- o event stream opcional não contém e-mail/nome;
- `travelerUserId` não é anexado ao analytics de produto;
- termos de busca não são persistidos, apenas `hasQuery`/`queryLength`;
- `tripId`, `itemId`, tokens e propriedades arbitrárias são descartados;
- payloads passam por allowlist e limites;
- não existe trilha GPS contínua.

A página `/cookies` possui controle para rever a preferência depois da primeira escolha.

## 10. Inteligência e proteção contra inferência

Circulação territorial só exibe conexões que atingem um limiar agregado. O runtime força mínimo de 3 observações, mesmo que a variável de ambiente seja configurada abaixo disso.

A conexão A → B significa apenas presença registrada em A seguida de presença registrada em B. Não representa trajetória GPS.

Métricas do parceiro ficam limitadas ao próprio negócio. Dimensões de origem abaixo do limiar agregado não são exibidas.

## 11. Retenção

`scripts/privacy-maintenance.ts` aplica expurgo conforme variáveis configuráveis:

- `ANALYTICS_RETENTION_DAYS`;
- `CONSENT_RETENTION_DAYS`;
- `AUTH_SESSION_RETENTION_DAYS`;
- `AUDIT_RETENTION_DAYS`.

Defaults do `.env.example` são parâmetros operacionais, não uma afirmação jurídica de prazo ideal. Eles precisam ser aprovados para a operação real antes do lançamento.

Executar:

```bash
npm run db:sanitize      # saneamento/pseudonimização de registros legados
npm run privacy:cleanup  # retenção/expurgo configurável
```

A rotina não imprime IDs individuais nos logs.

## 12. Saída e links

- texto em JSX usa escaping padrão do React;
- URLs de contato passam por `safeContactHref`;
- assets passam por `safeAssetSrc`;
- CSS derivado de conteúdo usa `safeObjectPosition`;
- URLs públicas rejeitam credenciais e hosts locais/privados conhecidos;
- origem usada por SEO/sitemap é validada e exige HTTPS em produção;
- erros técnicos de banco/rede/stack não são repassados ao usuário.

## 13. Logs, auditoria e pacote

`scripts/validate-all.mjs` redige segredos conhecidos, e-mail, telefone e caminhos internos antes de gravar logs.

`scripts/scan-sensitive.mjs` bloqueia material como:

- `.env` real;
- chaves privadas;
- padrões de tokens cloud/API;
- JWT persistido;
- e-mail fora dos domínios explicitamente permitidos para teste/exemplo.

`scripts/audit-sanitization.mjs` verifica adicionalmente:

- caminhos do ambiente de execução;
- IDs/referências de arquivos/chat;
- primitivas inseguras de HTML;
- `javascript:` em href/src;
- leitura JSON sem limite;
- exposição direta de `error.message` em Server Actions;
- seed real sem contatos/segredos desnecessários;
- dados demo corretamente marcados;
- pseudonimização por HMAC;
- gestão de consentimento;
- retenção;
- limiar agregado mínimo.

`npm run validate:static` executa validação estrutural + varredura sensível + auditoria de sanitização.

`node_modules`, `.next`, `.data`, caches, relatórios temporários, `.env`, credenciais e segredos não pertencem ao ZIP final.

## 14. Superfícies inexistentes no MVP

O runtime não possui upload arbitrário de arquivo pelo usuário nem editor rich-text/HTML. Se forem adicionados no futuro, devem receber pipeline específico de MIME, tamanho, malware, armazenamento isolado e sanitização HTML apropriada. `sanitizeText` não substitui esses controles.

## 15. Limites da garantia

A implementação pode garantir as invariantes verificadas pelo código e pela auditoria local. Ela não pode declarar, por si só:

- conformidade jurídica definitiva;
- segurança absoluta contra vulnerabilidades futuras;
- comportamento de infraestrutura externa não configurada neste repositório;
- retenção real em backups/observabilidade de provedores ainda não escolhidos.

Esses itens exigem revisão da implantação real. Nenhuma sanitização substitui autorização, RBAC, queries parametrizadas, gestão de segredos, revisão de dependências e testes de segurança.


## 16. Critérios de aceitação de sanitização

Antes de distribuir o repositório:

1. `npm run validate:static` precisa passar;
2. `npm run security:scan` não pode encontrar material sensível;
3. `npm run audit:sanitize` precisa passar;
4. o manifesto SHA-256 deve corresponder aos arquivos distribuídos;
5. o ZIP deve ser extraído em diretório limpo e revalidado;
6. `.env`, secrets, bancos locais, caches, `node_modules`, `.next` e artefatos temporários não podem estar no pacote;
7. dados reais e sintéticos precisam permanecer diferenciados;
8. testes dependentes de pacotes só podem ser marcados como aprovados quando realmente executados.

A garantia fornecida por esta implementação é a conformidade com esses invariantes verificáveis do repositório. Ela não é uma alegação de segurança absoluta nem de conformidade jurídica definitiva.
