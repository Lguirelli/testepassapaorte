# Restrições visuais desta etapa

Esta build é para validar produto e sistema, não identidade visual final.

## Não definir

- fonte de marca;
- paleta de marca;
- cor primária definitiva;
- cor secundária definitiva;
- símbolo ou logo final;
- estilo fotográfico final;
- textura final do Passaporte;
- acabamento final da capa.

## Implementar mesmo assim

Criar tokens semânticos e substituíveis:

- `--surface-page`
- `--surface-raised`
- `--surface-muted`
- `--text-primary`
- `--text-secondary`
- `--border-default`
- `--accent-primary`
- `--focus-ring`
- `--state-success`
- `--state-warning`
- `--state-danger`

Usar valores neutros temporários e marcar claramente no código como `VALIDATION_ONLY`. Não espalhar hex/RGB pelos componentes.

Usar font stack de sistema temporária. Nenhuma fonte externa de marca deve ser escolhida.

## Imagens

Usar placeholders genéricos locais. Não buscar fotos reais apenas para preencher a interface. O placeholder deve comunicar proporção e função da imagem, sem tentar simular identidade fotográfica final.
