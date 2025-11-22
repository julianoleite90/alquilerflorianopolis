import Link from 'next/link'
import { createReadonlyClient } from '@/lib/supabase/server-readonly'
import { BARRIOS } from '@/data/barrios'

export default async function BarriosGrid() {
  let barrios: any[] = []

  try {
    const supabase = createReadonlyClient()
    const { data, error } = await supabase
      .from('barrios')
      .select('*')
      .eq('activo', true)
      .order('orden', { ascending: true })

    if (!error && data && data.length > 0) {
      barrios = data
    } else {
      // Fallback para dados estáticos se não houver dados no banco
      barrios = BARRIOS.map(b => ({
        slug: b.slug,
        nombre: b.nombre,
        descripcion: b.descripcion,
        regiao: b.regiao,
        cover_image: b.coverImage,
        highlights: b.highlights,
      }))
    }
  } catch (error) {
    console.warn('Error al cargar barrios desde Supabase, usando datos estáticos:', error)
    // Fallback para dados estáticos em caso de erro
    barrios = BARRIOS.map(b => ({
      slug: b.slug,
      nombre: b.nombre,
      descripcion: b.descripcion,
      regiao: b.regiao,
      cover_image: b.coverImage,
      highlights: b.highlights,
    }))
  }

  return (
    <section className="py-10 md:py-14 bg-white">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 px-4 md:px-0">
          <div>
            <p className="uppercase tracking-[0.35em] text-xs text-primary-500 mb-2">Barrios destacados</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Explorá Florianópolis por barrio</h2>
            <p className="text-sm md:text-base text-gray-600 mt-2 max-w-2xl">
              Seleccionamos los barrios más buscados por viajeros argentinos. 
              Descubrí qué ofrece cada zona y filtrá las propiedades disponibles.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-4 md:px-0">
          {barrios.map((barrio) => (
            <Link
              key={barrio.slug}
              href={`/barrios/${barrio.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-primary-50 via-white to-primary-50 shadow-sm hover:shadow-xl transition-all"
            >
              <div className="h-40 md:h-48 w-full flex flex-col items-center justify-center px-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-700 mb-3">
                  {barrio.regiao === 'norte_da_ilha' ? 'Norte' :
                    barrio.regiao === 'sul_da_ilha' ? 'Sur' :
                    barrio.regiao === 'centro' ? 'Centro' : 'Continente'}
                </span>
                <h3 className="text-3xl md:text-4xl font-bold text-primary-600 text-center mb-2 group-hover:text-primary-700 transition-colors">
                  {barrio.nombre}
                </h3>
              </div>
              <div className="p-5">
                <p className="text-sm text-gray-600 mb-4 min-h-[48px]">{barrio.descripcion}</p>
                {barrio.highlights && barrio.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {barrio.highlights.slice(0, 3).map((highlight: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 text-xs rounded-full bg-primary-50 text-primary-700 font-medium"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-5 text-primary-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                  Ver propiedades →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
