# Tamanhos Ideais para Banners da Home

## Dimensões Recomendadas

### Opção 1: Proporção 16:9 (Recomendado)
- **Largura**: 1920px
- **Altura**: 1080px
- **Proporção**: 16:9
- **Formato**: JPG ou PNG
- **Tamanho do arquivo**: Máximo 500KB (otimizado)

### Opção 2: Proporção 21:9 (Widescreen/Cinematográfico)
- **Largura**: 2560px
- **Altura**: 1080px
- **Proporção**: 21:9
- **Formato**: JPG ou PNG
- **Tamanho do arquivo**: Máximo 600KB (otimizado)

### Opção 3: Proporção 2:1 (Alternativa)
- **Largura**: 1920px
- **Altura**: 960px
- **Proporção**: 2:1
- **Formato**: JPG ou PNG
- **Tamanho do arquivo**: Máximo 500KB (otimizado)

## Como o Banner é Exibido

O banner na home tem as seguintes alturas responsivas:
- **Mobile**: 280px de altura
- **Tablet**: 346px de altura
- **Desktop**: 450px de altura
- **Largura**: 100% da largura da tela

A imagem usa `object-cover`, o que significa que:
- A imagem preenche todo o espaço disponível
- Pode ser cortada nas laterais ou topo/base para manter a proporção
- O centro da imagem sempre será visível

## Recomendações de Design

### Área Segura (Safe Zone)
- **Importante**: Coloque elementos importantes (texto, pessoas, objetos principais) no **centro 60%** da imagem
- Evite colocar elementos importantes nas bordas (podem ser cortados em telas menores)

### Resolução
- **Mínimo**: 1920x1080px (para qualidade em telas Full HD)
- **Ideal**: 2560x1080px (para telas 2K e widescreen)
- **Máximo**: Não exceda 3840x2160px (4K) - muito pesado para web

### Otimização
- Use JPG para fotos (qualidade 80-85%)
- Use PNG apenas se precisar de transparência
- Comprima a imagem antes de fazer upload
- Tamanho ideal do arquivo: 200-500KB

## Ferramentas para Otimizar

1. **TinyPNG**: https://tinypng.com/
2. **Squoosh**: https://squoosh.app/
3. **ImageOptim**: Para Mac
4. **Photoshop**: Exportar para Web (JPG 80-85%)

## Exemplo de Tamanhos por Dispositivo

| Dispositivo | Largura | Altura Exibida | Proporção |
|------------|---------|----------------|-----------|
| Mobile | 375-414px | 280px | ~1.3:1 |
| Tablet | 768-1024px | 346px | ~2.2:1 |
| Desktop | 1920px+ | 450px | ~4.3:1 |

**Nota**: Como a altura varia muito entre dispositivos, use uma imagem com proporção 16:9 ou 21:9 e deixe o sistema cortar automaticamente. O centro sempre será visível.

## Checklist Antes de Fazer Upload

- [ ] Imagem tem pelo menos 1920px de largura
- [ ] Proporção é 16:9 ou 21:9
- [ ] Arquivo está otimizado (< 500KB)
- [ ] Elementos importantes estão no centro 60%
- [ ] Imagem está nítida e bem iluminada
- [ ] Não há texto importante nas bordas (o texto é sobreposto pelo sistema)

