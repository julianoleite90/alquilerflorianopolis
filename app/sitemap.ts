import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'
import { BARRIOS } from '@/data/barrios'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://alquilerenflorianopolis.com'
  
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/propiedades`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ]

  BARRIOS.forEach((barrio) => {
    routes.push({
      url: `${baseUrl}/barrios/${barrio.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    })
  })

  // Agregar propiedades individuales
  try {
    const supabase = await createClient()
    const { data: propiedades } = await supabase
      .from('propiedades')
      .select('id, updated_at')
      .eq('disponible', true)
    
    if (propiedades) {
      propiedades.forEach((propiedad) => {
        routes.push({
          url: `${baseUrl}/propiedades/${propiedad.id}`,
          lastModified: new Date(propiedad.updated_at),
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        })
      })
    }
  } catch (error) {
    console.warn('Error al generar sitemap de propiedades:', error)
  }

  return routes
}

