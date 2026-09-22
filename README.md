# Passaporte Serra Negra

### Descobrir a cidade. Planejar a visita. Guardar a experiência.

Protótipo de apresentação com duas jornadas: o turista encontra experiências e organiza sua viagem; o parceiro apresenta seu negócio e acompanha indicadores demonstrativos.

## Comece aqui

- **[Publicar no GitHub e na Vercel](VERCEL_DEPLOY.md)** — passo a passo de implantação.
- **[Apresentar o produto](docs/APRESENTACAO.md)** — páginas, sequência sugerida e logins de demonstração.
- **[Decisões de narrativa e visual](docs/NARRATIVAS.md)** — evolução do projeto.

## Páginas principais

| Jornada | Endereço |
| --- | --- |
| Turista | `/` |
| Seja parceiro | `/parceiros` |
| Exemplo de estabelecimento | `/parceiros/caminho-do-cafe` |
| Painel do parceiro | `/area-parceiro` |
| Dados do parceiro | `/area-parceiro/dados` |
| Administração | `/gestao` |

## Organização

```text
src/                 Aplicação Next.js, páginas e componentes
public/              Imagens, fontes e demais arquivos públicos
docs/                Apresentação, decisões e documentação técnica
scripts/             Ferramentas de desenvolvimento e manutenção
tests/               Testes do projeto
github-pages/        Prévia estática auxiliar; não é a raiz da Vercel
package.json         Dependências e comandos
package-lock.json    Versões para instalação com npm
vercel.json          Configuração da publicação
```

## Executar localmente

Node.js 24 e npm:

```sh
npm ci
npm run dev
```

Abra `http://localhost:4173`. Para conferir a compilação, execute `npm run build`.

## Escopo desta versão

Apresentação em modo visual (`APP_MODE=visual`), sem banco de dados. Painéis, métricas e logins de demonstração são simulados. O header original foi preservado e as duas capas têm conteúdo centralizado. A busca usa bordas completamente arredondadas.

A documentação histórica em `docs/historico/` descreve também recursos do runtime completo; siga o guia de publicação desta raiz para a apresentação inicial.
