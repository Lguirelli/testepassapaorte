# Passaporte Serra Negra — apresentação visual

Protótipo estático para apresentar a experiência do **Passaporte Serra Negra** a turistas e parceiros.

Esta versão é deliberadamente simples: **não possui banco de dados, backend, autenticação real, API, persistência remota ou infraestrutura externa**. Todos os lugares, métricas, formulários, logins e estados apresentados são exemplos locais para demonstração de produto e UX.

## Como abrir

A apresentação publicada usa `github-pages/index.html`. Localmente:

```sh
npm ci
npm run dev
```

Abra `http://127.0.0.1:4173`.

## Rotas demonstrativas

A navegação usa hash para funcionar em qualquer hospedagem estática:

- `#/` — experiência do turista;
- `#/explorar` — descoberta de lugares;
- `#/roteiros` — roteiros demonstrativos;
- `#/parceiros` — proposta para parceiros;
- `#/parceiros/caminho-do-cafe` — exemplo de página de parceiro;
- `#/area-parceiro/entrar` — acesso demonstrativo do parceiro;
- `#/gestao/entrar` — acesso demonstrativo de gestão.

Consulte `docs/APRESENTACAO.md` para o roteiro de apresentação.

## Estrutura

```text
github-pages/       Site estático completo: HTML, CSS, JavaScript e assets
index.html          Bootstrap para publicação pelo GitHub Pages a partir da raiz
docs/               Roteiro, narrativa e evidências visuais
scripts/            Servidor local e validação do pacote estático
vercel.json         Publicação estática da pasta github-pages/
```

## Validação

```sh
npm run validate
```

O validador impede que camadas de backend/banco voltem ao repositório, verifica os assets da apresentação e bloqueia chamadas de rede/API no JavaScript publicado.
