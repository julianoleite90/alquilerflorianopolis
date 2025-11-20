import { createClient } from '@/lib/supabase/server'
import DashboardClient from './DashboardClient'
import { getPropiedadesFromLocalStorage } from '@/lib/supabase/local-storage-fallback'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Dashboard',
  description: 'Panel de administración de propiedades',
  noindex: true,
})

export default async function DashboardPage() {
  let propiedades: any[] = []
  
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('propiedades')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error al cargar desde Supabase:', error)
      // Em produção, não usar localStorage - retornar vazio e mostrar erro
      if (process.env.NODE_ENV === 'production') {
        console.error('ERRO: Supabase não está funcionando em produção!', error)
      }
    } else {
      propiedades = data || []
    }
  } catch (error) {
    console.error('Error de conexión con Supabase:', error)
    // Em produção, não usar localStorage
    if (process.env.NODE_ENV === 'production') {
      console.error('ERRO CRÍTICO: Não foi possível conectar ao Supabase em produção!', error)
    }
  }

  return <DashboardClient initialPropiedades={propiedades} />
}

