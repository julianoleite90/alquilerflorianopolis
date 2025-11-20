# Como Adicionar o Favicon

## Opção 1: Colocar arquivos na pasta `public/` (Recomendado)

Coloque os seguintes arquivos na pasta `public/`:

1. **favicon.ico** - Ícone tradicional (16x16 ou 32x32)
2. **icon.png** - Ícone PNG padrão (32x32 ou 48x48)
3. **icon-192.png** - Para Android (192x192)
4. **icon-512.png** - Para Android/PWA (512x512)
5. **apple-icon.png** - Para iOS (180x180)

### Tamanhos recomendados:
- `favicon.ico`: 16x16, 32x32 ou 48x48
- `icon.png`: 32x32 ou 48x48
- `icon-192.png`: 192x192
- `icon-512.png`: 512x512
- `apple-icon.png`: 180x180

## Opção 2: Colocar na pasta `app/` (Next.js 13+)

Você também pode colocar os arquivos diretamente na pasta `app/` com estes nomes:
- `app/icon.png` ou `app/icon.ico`
- `app/apple-icon.png`
- `app/favicon.ico`

O Next.js detectará automaticamente esses arquivos.

## Ferramentas para criar favicons:

1. **Favicon Generator**: https://realfavicongenerator.net/
2. **Favicon.io**: https://favicon.io/
3. **Canva**: Para criar o design inicial

## Após adicionar os arquivos:

1. Coloque os arquivos na pasta `public/`
2. Reinicie o servidor de desenvolvimento (`npm run dev`)
3. O favicon aparecerá automaticamente

