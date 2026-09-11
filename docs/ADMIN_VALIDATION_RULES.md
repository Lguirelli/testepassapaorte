# Admin — regras de validação

## Princípio central

Toda operação recorrente de conteúdo, cadastro, configuração e gestão incluída nesta validação deve ser possível pela interface do Admin, sem editar banco diretamente e sem alterar código.

## Matriz v1

| Entidade | Criar | Editar | Rascunho | Publicar | Arquivar | Histórico | Parceiro edita |
|---|---:|---:|---:|---:|---:|---:|---:|
| Lugar | sim | sim | sim | sim | sim | sim | parcialmente, futuro |
| Experiência | sim | sim | sim | sim | sim | sim | via solicitação, futuro |
| Parceiro | sim | sim | sim | sim | sim | sim | próprio cadastro, futuro |
| Categoria | sim | sim | sim | sim | sim | sim | não |
| Evento | sim | sim | sim | sim | sim | sim | futuro |
| Fonte | sim | sim | sim | n/a | arquivar | sim | não |

## Campos e comportamento

Para cada formulário, os campos devem carregar metadados de UI e validação em uma camada reutilizável. Evitar formulários completamente independentes quando um padrão de campo já existir.

O Admin deve distinguir sem depender apenas de cor:

- editável;
- somente leitura;
- requer ação administrativa específica;
- técnico/interno.

## Preview e publicação

Fluxo obrigatório:

`Editar → Salvar rascunho → Preview → Publicar`

Salvar não deve publicar automaticamente.

## Auditoria mínima

Registrar:

- ator;
- ação;
- entidade;
- data/hora;
- estado anterior;
- estado posterior.

A restauração de uma versão cria nova versão. Não apagar histórico.

## Proibição

O Admin não deve oferecer:

- SQL;
- JavaScript customizado;
- CSS livre;
- edição de migrations;
- alteração direta de permissões do backend;
- execução arbitrária de código.
