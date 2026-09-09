# ADR-002 — Admin como control plane operacional

**Status:** aceito para validação.

## Decisão

O Admin usa um editor reutilizável por tipo de entidade e separa rascunho da versão pública.

## Invariantes

- salvar != publicar;
- preview lê rascunho;
- publicar atualiza público;
- operações relevantes registram auditoria mínima;
- conteúdo recorrente não exige edição de código/banco manual.
