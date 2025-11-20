import { createReadonlyClient } from '@/lib/supabase/server-readonly'
import PropiedadDetailClient from './PropiedadDetailClient'
import { generatePropiedadMetadata, generateStructuredData } from '@/lib/seo'
import type { Metadata } from 'next'
import { getPropiedadesFromLocalStorage } from '@/lib/supabase/local-storage-fallback'

export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  let propiedad: any = null
  
  try {
    const supabase = createReadonlyClient()
    const { data, error } = await supabase
      .from('propiedades')
      .select('*')
      .eq('id', params.id)
      .eq('disponible', true)
      .single()
    
    if (!error && data) {
      propiedad = data
    } else {
      // Intentar desde localStorage
      const localPropiedades = getPropiedadesFromLocalStorage()
      propiedad = localPropiedades.find(p => p.id === params.id && p.disponible !== false)
    }
  } catch (error) {
    console.warn('Error al cargar propiedad para metadata:', error)
  }

  if (!propiedad) {
    return {
      title: 'Propiedad no encontrada - Alquiler en Florianópolis',
      description: 'La propiedad que buscas no está disponible.',
    }
  }

  return generatePropiedadMetadata(propiedad)
}

export default async function PropiedadDetailPage({
  params,
}: {
  params: { id: string }
}) {
  let propiedad: any = null
  
  try {
    const supabase = createReadonlyClient()
    const { data, error } = await supabase
      .from('propiedades')
      .select('*')
      .eq('id', params.id)
      .eq('disponible', true)
      .single()
    
    if (!error && data) {
      propiedad = data
    }
  } catch (error) {
    console.warn('Error al cargar propiedad desde Supabase:', error)
  }

  return <PropiedadDetailClient initialPropiedad={propiedad} propiedadId={params.id} />
}
