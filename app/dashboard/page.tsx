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
      console.warn('Error al cargar desde Supabase, usando localStorage:', error)
      // Fallback para localStorage no servidor no funciona, entonces retornamos vacío
      // El cliente va a cargar del localStorage
    } else {
      propiedades = data || []
    }
  } catch (error) {
    console.warn('Error de conexión con Supabase, el cliente usará localStorage:', error)
  }

  return <DashboardClient initialPropiedades={propiedades} />
}

