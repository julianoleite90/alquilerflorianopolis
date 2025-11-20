import { createClient } from './client'

// Función para convertir File a base64 (para desarrollo local)
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

export async function uploadImage(file: File, folder: string = 'propiedades'): Promise<string> {
  const supabase = createClient()
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
  const filePath = `${folder}/${fileName}`

  try {
    // Intentar subir a Supabase Storage
    const { data, error } = await supabase.storage
      .from('imagenes')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      // Si hay error y estamos en localhost, usar base64 como fallback
      if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('localhost') || 
          process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('127.0.0.1')) {
        console.warn('Supabase Storage no disponible, usando base64 para desarrollo:', error.message)
        const base64 = await fileToBase64(file)
        return base64
      }
      throw error
    }

    const { data: { publicUrl } } = supabase.storage
      .from('imagenes')
      .getPublicUrl(filePath)

    return publicUrl
  } catch (error: any) {
    // Si falla completamente, usar base64 como último recurso
    console.warn('Error al subir a Supabase, usando base64:', error.message)
    try {
      const base64 = await fileToBase64(file)
      return base64
    } catch (base64Error) {
      throw new Error('No se pudo procesar la imagen')
    }
  }
}

export async function deleteImage(url: string): Promise<void> {
  const supabase = createClient()
  // Extraer el path del URL
  const urlParts = url.split('/')
  const filePath = urlParts.slice(urlParts.indexOf('imagenes') + 1).join('/')

  const { error } = await supabase.storage
    .from('imagenes')
    .remove([filePath])

  if (error) {
    console.error('Error al eliminar imagen:', error)
  }
}

