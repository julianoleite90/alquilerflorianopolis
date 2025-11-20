// Función para testear la conexión con Supabase
import { createClient } from './client'

export async function testSupabaseConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = createClient()
    
    // Intentar una consulta simple con timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), 2000)
    )
    
    const queryPromise = supabase
      .from('banners')
      .select('count')
      .limit(1)
    
    const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any
    
    if (error) {
      // Si el error es que la tabla no existe, la conexión funciona
      if (error.message?.includes('does not exist') || error.code === 'PGRST116') {
        return {
          success: true,
          message: 'Conexión OK, pero la tabla banners no existe. Ejecuta migrations_banners_dev.sql'
        }
      }
      
      return {
        success: false,
        message: `Error de conexión: ${error.message}`
      }
    }
    
    return {
      success: true,
      message: 'Conexión exitosa con Supabase'
    }
  } catch (error: any) {
    // Si es timeout o error de red, Supabase no está disponible
    if (error.message === 'Timeout' || error.message?.includes('Failed to fetch')) {
      return {
        success: false,
        message: 'Supabase no disponible - usando modo desarrollo'
      }
    }
    
    return {
      success: false,
      message: `Error de red: ${error.message || 'No se pudo conectar con Supabase'}`
    }
  }
}

