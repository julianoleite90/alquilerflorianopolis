// Função para comprimir imagens antes de salvar no localStorage

export function compressImage(file: File, maxWidth: number = 800, quality: number = 0.5): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height
        
        // Redimensionar se necessário
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        
        canvas.width = width
        canvas.height = height
        
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Não foi possível criar contexto do canvas'))
          return
        }
        
        ctx.drawImage(img, 0, 0, width, height)
        
        // Converter para base64 com qualidade reduzida
        const base64 = canvas.toDataURL('image/jpeg', quality)
        resolve(base64)
      }
      
      img.onerror = () => reject(new Error('Erro ao carregar imagem'))
      img.src = e.target?.result as string
    }
    
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'))
    reader.readAsDataURL(file)
  })
}

// Verificar tamanho estimado do localStorage
export function estimateLocalStorageSize(data: any): number {
  const jsonString = JSON.stringify(data)
  return new Blob([jsonString]).size
}

// Limitar tamanho total das imagens
export function limitImageSize(base64: string, maxSizeKB: number = 200): string {
  // Se a imagem já está pequena o suficiente, retornar como está
  const sizeKB = (base64.length * 3) / 4 / 1024
  if (sizeKB <= maxSizeKB) {
    return base64
  }
  
  // Se for muito grande, precisamos comprimir mais
  // Isso seria feito na função compressImage com qualidade menor
  return base64
}

