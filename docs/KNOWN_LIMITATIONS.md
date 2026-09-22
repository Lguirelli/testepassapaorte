# Limitações conhecidas

1. **Validação dependente de npm do runtime:** Playwright Python + Chromium executam neste ambiente, mas `npm ci` do projeto Next.js ainda não conclui por falha de acesso ao registry. Por isso a suíte TypeScript E2E/Axe completa do runtime não é declarada como aprovada localmente; o GitHub Actions agora instala Chromium e executa essa suíte automaticamente.
2. **Autenticação:** há um adaptador local de credenciais para desenvolvimento. Uma integração externa de identidade pode substituir esse adaptador sem mudar RBAC/ownership do domínio.
3. **PostGIS:** o MVP funciona sem PostGIS em PGlite; consultas territoriais avançadas devem usar PostgreSQL/PostGIS em produção quando necessário.
4. **Clima:** nenhum clima é inventado. A UI exibe contexto somente quando há `weather_snapshots` verificados.
5. **Parceiros:** os parceiros incluídos no seed funcional são sintéticos e marcados como tal. Nenhuma relação comercial real é inferida.
6. **Tipografia web:** Arimo e Cormorant Garamond são as únicas famílias do produto; os binários não são empacotados e o navegador usa fallbacks genéricos quando a fonte web não estiver disponível.
7. **Legal:** textos de privacidade, termos e cookies são base operacional e precisam de revisão jurídica antes do lançamento comercial.
8. **Reservas/pagamentos:** permanecem externos ao produto nesta fase.

9. **Sanitização não substitui revisão de segurança:** o runtime possui validação estrita, output seguro, redaction e varredura de material sensível, mas uma revisão de segurança externa continua recomendada antes do lançamento comercial.
10. **Uploads/rich text:** não existem no MVP. Se forem introduzidos, exigem pipeline específico de MIME/arquivo/HTML; o sanitizer textual atual não deve ser usado como substituto.


11. **Infraestrutura externa:** o repositório não controla logs de proxy/CDN, snapshots, backups, APM ou políticas do provedor de banco ainda não selecionado. A política de retenção/sanitização deve ser replicada nesses serviços na implantação.
12. **Garantia de sanitização:** os invariantes cobertos pelos scripts locais são verificáveis e falham o QA estático em regressões conhecidas; isso não equivale a promessa de segurança absoluta contra vulnerabilidades futuras ou conteúdo malicioso em superfícies que ainda não existem no MVP.

13. **QA visual responsivo automatizado:** a matriz adicional de resize/200%/landscape está incluída em `tests/e2e/05-responsive.spec.ts`, mas não é declarada como executada nesta sessão enquanto `npm ci` permanecer bloqueado pelo registry. A auditoria estática `audit:responsive` foi executada e passou.
14. **QA visual completo do runtime:** o browser Playwright/Chromium foi validado por smoke real, e a suíte automatizada foi ampliada. A execução contra todas as rotas Next.js ainda depende do `npm ci` local ou do job CI/Preview remoto. O pacote não apresenta essa etapa completa como aprovada sem a execução correspondente.
