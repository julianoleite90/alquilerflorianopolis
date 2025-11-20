import Link from 'next/link'
import { FiSearch, FiHome, FiMapPin, FiDollarSign, FiSun, FiCalendar } from 'react-icons/fi'
import { createReadonlyClient } from '@/lib/supabase/server-readonly'
import PropiedadesListWithFilter from '@/components/PropiedadesListWithFilter'
import HeroWithBanner from '@/components/HeroWithBanner'
import EventosList from '@/components/EventosList'
import WeatherWidget from '@/components/WeatherWidget'
import BarriosGrid from '@/components/BarriosGrid'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Su Temporada Comienza Aquí',
  description: 'Encuentra tu alojamiento perfecto para la temporada en Florianópolis. Casas, departamentos y más cerca de las mejores playas de Brasil. Reserva ahora y disfruta de la mejor temporada en Floripa.',
  path: '/',
})

export default async function Home() {
  let propiedades: any[] = []
  let eventos: any[] = []
  
  try {
    const supabase = createReadonlyClient()
    const { data: propiedadesData, error: propiedadesError } = await supabase
      .from('propiedades')
      .select('*')
      .eq('disponible', true)
      .order('created_at', { ascending: false })
      .limit(6)
    
    if (!propiedadesError && propiedadesData) {
      propiedades = propiedadesData
    }

    const { data: eventosData, error: eventosError } = await supabase
      .from('eventos')
      .select('*')
      .eq('ativo', true)
      .gte('fecha_inicio', new Date().toISOString().split('T')[0])
      .order('fecha_inicio', { ascending: true })
      .limit(6)
    
    if (!eventosError && eventosData) {
      eventos = eventosData
    }
  } catch (error) {
    console.warn('Error al cargar datos desde Supabase:', error)
  }

  return (
    <div>
      {/* Hero Section com Banner */}
      <HeroWithBanner />

      {/* Temporada Section */}
      <section className="py-10 md:py-16 bg-gradient-to-br from-primary-50 via-white to-primary-50">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center">
              {/* Texto e Sol */}
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-4 md:mb-6">
                  <div className="relative">
                    <FiSun className="text-yellow-400 text-4xl md:text-6xl animate-spin-slow drop-shadow-lg" />
                    <div className="absolute inset-0 bg-yellow-300 rounded-full blur-2xl opacity-50 animate-pulse" />
                  </div>
                </div>
                <p className="uppercase tracking-[0.35em] text-xs md:text-sm text-primary-500 mb-3">Temporada 2025</p>
                <h2 className="text-2xl md:text-4xl font-bold mb-4 text-gray-900">
                  Temporada en Florianópolis para viajeros exigentes
                </h2>
                <p className="text-base md:text-lg text-gray-700 leading-relaxed px-2 md:px-0">
                  Conectamos propiedades seleccionadas con viajeros argentinos que buscan comodidad,
                  cercanía a la playa y asistencia personalizada en español.
                </p>
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-white/80 border border-primary-100 rounded-xl p-3 text-left shadow-sm">
                    <p className="text-2xl font-bold text-primary-600">250+</p>
                    <p className="text-xs uppercase tracking-wide text-gray-500">propiedades</p>
                  </div>
                  <div className="bg-white/80 border border-primary-100 rounded-xl p-3 text-left shadow-sm">
                    <p className="text-2xl font-bold text-primary-600">40 km</p>
                    <p className="text-xs uppercase tracking-wide text-gray-500">de playas</p>
                  </div>
                  <div className="bg-white/80 border border-primary-100 rounded-xl p-3 text-left shadow-sm">
                    <p className="text-2xl font-bold text-primary-600">24/7</p>
                    <p className="text-xs uppercase tracking-wide text-gray-500">asistencia</p>
                  </div>
                </div>
              </div>
              
              {/* Widget de Clima */}
              <div className="flex justify-center lg:justify-end px-4 md:px-0">
                <WeatherWidget />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 px-3 md:px-0">
            {[
              {
                icon: <FiHome className="text-primary-600 text-2xl" />,
                title: 'Curaduría premium',
                desc: 'Solo listamos propiedades verificadas, con fotos reales y anfitriones confiables.'
              },
              {
                icon: <FiMapPin className="text-primary-600 text-2xl" />,
                title: 'Experiencia local',
                desc: 'Conocemos cada rincón de Floripa para recomendarte la zona ideal para tu estadía.'
              },
              {
                icon: <FiDollarSign className="text-primary-600 text-2xl" />,
                title: 'Precio transparente',
                desc: 'Tarifas en USD o BRL, sin sorpresas y con asesoramiento en español.'
              },
            ].map((feature, idx) => (
              <div key={idx} className="bg-gray-50 border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary-100 w-12 h-12 rounded-xl flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Barrios */}
      <BarriosGrid />

      {/* Featured Properties */}
      <section className="py-12 md:py-16 bg-gray-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.12),_transparent_50%)]" />
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 px-4 md:px-0">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 sm:mb-0">Propiedades Destacadas</h1>
            <Link href="/propiedades" className="text-primary-600 hover:text-primary-700 font-semibold text-sm md:text-base">
              Ver todas →
            </Link>
          </div>
          
          <PropiedadesListWithFilter initialPropiedades={propiedades} limit={6} />
        </div>
      </section>

      {/* Eventos Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6 md:mb-8 px-4 md:px-0">
            <div>
              <div className="flex items-center gap-2 text-primary-600 text-sm uppercase tracking-[0.3em] mb-2">
                <FiCalendar />
                <span>Agenda Floripa</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Programación en Florianópolis</h2>
              <p className="text-gray-600 text-sm md:text-base max-w-2xl">
                Eventos culturales, gastronómicos y deportivos para complementar tu estadía. 
                Actualizamos semanalmente para que puedas planificar mejor cada día.
              </p>
            </div>
            <Link
              href="/propiedades"
              className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-700 text-sm"
            >
              Ver alojamientos disponibles →
            </Link>
          </div>
          
          <EventosList initialEventos={eventos} limit={6} />
        </div>
      </section>
    </div>
  )
}

