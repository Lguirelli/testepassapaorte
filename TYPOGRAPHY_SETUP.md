# Tipografia do Passaporte Serra Negra

O projeto usa três papéis tipográficos fixos:

- **Origin Black Display**: títulos de páginas e subtítulos editoriais (`--font-display`).
- **Scratchy**: carimbos e elementos decorativos do passaporte (`--font-decorative`).
- **Anodina**: body copy, descrições, navegação, botões, formulários e interface (`--font-body`).

As declarações `@font-face` e as variáveis ficam em `public/typography.css`, compartilhado pela implementação estática e pelo Next.js.

## Instalação dos arquivos de fonte

Os arquivos devem existir em `public/assets/fonts/` com estes nomes:

- `Origin-BlackDisplay.otf`
- `Scratchy-Regular.otf`
- `Anodina-ExtraLight.otf`
- `Anodina-Light.otf`
- `Anodina-Regular.otf`
- `Anodina-Bold.otf`
- `Anodina-ExtraBold.otf`

Para usar o bundle de fontes fornecido ao projeto:

```bash
python scripts/install_typography_fonts.py /caminho/passaporte-serra-negra-fontes.zip
```

O instalador valida a presença dos sete arquivos antes de escrever qualquer fonte no destino.
