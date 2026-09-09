# Definition of Done — Validation v1

A validação só é considerada concluída quando:

- repositório inicia localmente a partir do README;
- banco sobe por Docker Compose e migrations são reproduzíveis;
- seed é idempotente;
- nenhum dado fictício está misturado com alegação de dado real;
- todos os dados das páginas principais vêm da camada de dados;
- Admin consegue editar/publicar sem acesso a DB/código;
- fluxo Admin → Preview → Publish → Public foi testado;
- Icon System v2 é usado como fonte de ícones;
- nenhum emoji é usado como ícone de interface;
- fontes e cores finais permanecem indefinidas;
- nenhum componente depende de uma cor de marca fixa;
- desktop/tablet/mobile foram verificados no Playwright;
- screenshots de validação foram geradas;
- sem erros críticos de acessibilidade automatizados conhecidos;
- lint, typecheck e testes passam;
- CI executa verificações essenciais;
- README registra limitações e próximos blocos;
- Work produz `VALIDATION_REPORT.md` com bugs encontrados, correções aplicadas e pendências reais.
