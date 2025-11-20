# Pasta de Imagens

Esta pasta contém as imagens estáticas do site.

## Estrutura

- `/logo/` - Logos da imobiliária
- `/banners/` - Banners estáticos (opcional, também podem ser gerenciados via dashboard)
- `/propiedades/` - Imagens de propriedades (opcional, também podem ser gerenciadas via upload)

## Como adicionar logo

1. Coloque seu arquivo de logo em `/public/images/logo/`
2. Nomeie o arquivo como `logo.png`, `logo.svg`, `logo.jpg` ou `logo.webp`
3. O sistema tentará carregar automaticamente. Se não encontrar, mostrará o ícone padrão

### Formatos suportados
- PNG (recomendado para logos com transparência)
- SVG (recomendado para logos vetoriais)
- JPG/JPEG
- WEBP

### Tamanho recomendado
- Logo para header: 40x40px a 80x80px
- Formato: PNG ou SVG com fundo transparente

## Nota

As imagens nesta pasta são servidas estaticamente. Para imagens dinâmicas (banners, propriedades), use o sistema de upload no dashboard que salva no Supabase Storage.

