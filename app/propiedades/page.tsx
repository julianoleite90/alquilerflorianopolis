import { createReadonlyClient } from '@/lib/supabase/server-readonly'
import PropiedadesClient from './PropiedadesClient'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import { getBarrioBySlug } from '@/data/barrios'
import type { Metadata } from 'next'

interface SearchParams {
  tipo?: string
  ciudad?: string
  provincia?: string
  precio_min?: string
  precio_max?: string
  habitaciones?: string
  zona?: string
  regiao?: string
  barrio?: string
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams
}): Promise<Metadata> {
  const regiaoName = searchParams.regiao === 'norte_da_ilha' 
    ? 'Norte de la Isla'
    : searchParams.regiao === 'sul_da_ilha'
    ? 'Sur de la Isla'
    : searchParams.regiao === 'centro'
    ? 'Centro'
    : searchParams.regiao === 'continente'
    ? 'Continente'
    : null
  const barrioData = searchParams.barrio ? getBarrioBySlug(searchParams.barrio) : null

  const title = barrioData
    ? `Alquiler en ${barrioData.nombre}`
    : regiaoName
    ? `Propiedades en ${regiaoName}`
    : 'Propiedades'
  const description = barrioData
    ? barrioData.descripcionSeo
    : regiaoName
    ? `Encuentra las mejores propiedades para alquiler temporario en ${regiaoName}, Florianópolis. Casas, departamentos y más opciones cerca de las mejores playas.`
    : 'Explora todas las propiedades disponibles para alquiler temporario en Florianópolis. Casas, departamentos y más opciones en las mejores zonas de Floripa.'

  return generateSEOMetadata({
    title,
    description,
    path: '/propiedades',
  })
}

export default async function PropiedadesPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  let propiedades: any[] = []
  
  try {
    const supabase = createReadonlyClient()
    let query = supabase
      .from('propiedades')
      .select('*')
      .eq('disponible', true)

    // Aplicar filtros
    if (searchParams.zona) {
      if (searchParams.zona === 'norte') {
        const zonasNorte = ['Jurerê', 'Canasvieiras', 'Ingleses', 'Santinho', 'Praia Brava', 'Daniela', 'Lagoinha']
        query = query.or(zonasNorte.map(z => `ciudad.ilike.%${z}%`).join(','))
      } else if (searchParams.zona === 'sul') {
        const zonasSul = ['Campeche', 'Armação', 'Pântano do Sul', 'Ribeirão da Ilha', 'Lagoa', 'Barra da Lagoa']
        query = query.or(zonasSul.map(z => `ciudad.ilike.%${z}%`).join(','))
      }
    }
    if (searchParams.barrio) {
      query = query.eq('barrio', searchParams.barrio)
    }
    if (searchParams.tipo) {
      query = query.eq('tipo', searchParams.tipo)
    }
    if (searchParams.ciudad) {
      query = query.ilike('ciudad', `%${searchParams.ciudad}%`)
    }
    if (searchParams.provincia) {
      query = query.ilike('provincia', `%${searchParams.provincia}%`)
    }
    if (searchParams.precio_min) {
      query = query.gte('precio', searchParams.precio_min)
    }
    if (searchParams.precio_max) {
      query = query.lte('precio', searchParams.precio_max)
    }
    if (searchParams.habitaciones) {
      query = query.eq('habitaciones', parseInt(searchParams.habitaciones))
    }

    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (!error && data) {
      propiedades = data
    }
  } catch (error) {
    console.warn('Error al cargar propiedades desde Supabase:', error)
  }

  return <PropiedadesClient initialPropiedades={propiedades} searchParams={searchParams} />
}

