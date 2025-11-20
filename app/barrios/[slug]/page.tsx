import { notFound } from 'next/navigation'
import { createReadonlyClient } from '@/lib/supabase/server-readonly'
import PropiedadesList from '@/components/PropiedadesList'
import { getBarrioBySlug, BARRIOS } from '@/data/barrios'
import { generateBarrioMetadata } from '@/lib/seo'

interface BarrioPageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  return BARRIOS.map((barrio) => ({ slug: barrio.slug }))
}

export async function generateMetadata({ params }: BarrioPageProps) {
  let barrio = getBarrioBySlug(params.slug)
  
  // Intentar buscar del banco primero
  if (!barrio) {
    try {
      const supabase = createReadonlyClient()
      const { data } = await supabase
        .from('barrios')
        .select('*')
        .eq('slug', params.slug)
        .eq('activo', true)
        .single()
      
      if (data) {
        barrio = {
          slug: data.slug,
          nombre: data.nombre,
          descripcion: data.descripcion,
          descripcionSeo: data.descripcion_seo,
          keywords: data.keywords || [],
          regiao: data.regiao,
          coverImage: data.cover_image,
          highlights: data.highlights || [],
        }
      }
    } catch (error) {
      console.warn('Error al cargar barrio para metadata:', error)
    }
  }

  if (!barrio) {
    return {
      title: 'Barrio no encontrado - Alquiler en Florianópolis',
      description: 'La categoría solicitada no existe.',
    }
  }

  return generateBarrioMetadata(barrio)
}

export default async function BarrioPage({ params }: BarrioPageProps) {
  let barrio: any = getBarrioBySlug(params.slug)
  
  // Intentar buscar del banco primero
  if (!barrio) {
    try {
      const supabase = createReadonlyClient()
      const { data } = await supabase
        .from('barrios')
        .select('*')
        .eq('slug', params.slug)
        .eq('activo', true)
        .single()
      
      if (data) {
        barrio = {
          slug: data.slug,
          nombre: data.nombre,
          descripcion: data.descripcion,
          descripcionSeo: data.descripcion_seo,
          keywords: data.keywords || [],
          regiao: data.regiao,
          coverImage: data.cover_image,
          highlights: data.highlights || [],
        }
      }
    } catch (error) {
      console.warn('Error al cargar barrio:', error)
    }
  }

  if (!barrio) {
    notFound()
  }

  let propiedades: any[] = []
  
  try {
    const supabase = createReadonlyClient()
    const { data, error } = await supabase
      .from('propiedades')
      .select('*')
      .eq('disponible', true)
      .eq('barrio', barrio.slug)
      .order('created_at', { ascending: false })
    
    if (!error && data) {
      propiedades = data
    }
  } catch (error) {
    console.warn('Error al cargar propiedades por barrio:', error)
  }

  return (
    <div className="bg-white">
      <div className="bg-gradient-to-b from-primary-600 to-primary-500 text-white py-12 md:py-16">
        <div className="container-custom px-4 md:px-0">
          <p className="uppercase tracking-[0.35em] text-xs mb-3 text-white/70">Barrio</p>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{barrio.nombre}</h1>
          <p className="text-base md:text-lg max-w-3xl">{barrio.descripcionSeo || barrio.descripcion}</p>
          {barrio.highlights && barrio.highlights.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {barrio.highlights.map((highlight: string, idx: number) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full border border-white/40 text-sm"
                >
                  {highlight}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container-custom py-12 md:py-16 px-4 md:px-0">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Propiedades en {barrio.nombre}</h2>
            <p className="text-gray-600 text-sm md:text-base mt-2">
              Seleccionamos opciones disponibles en {barrio.nombre}. Si buscás otra zona, visita nuestras{' '}
              <a href="/propiedades" className="text-primary-600 font-semibold hover:text-primary-700">
                propiedades completas
              </a>.
            </p>
          </div>
        </div>

        <PropiedadesList initialPropiedades={propiedades} barrio={barrio.slug} />
      </div>
    </div>
  )
}
