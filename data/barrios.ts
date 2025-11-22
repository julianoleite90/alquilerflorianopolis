export type BarrioSlug =
  | 'canasvieiras'
  | 'jurere_internacional'
  | 'ingleses'
  | 'campeche'
  | 'barra_da_lagoa'
  | 'lagoa_da_conceicao'
  | 'ponta_das_canas'

export interface BarrioCategory {
  slug: BarrioSlug
  nombre: string
  descripcion: string
  descripcionSeo: string
  keywords: string[]
  regiao: 'norte_da_ilha' | 'sul_da_ilha' | 'centro' | 'continente'
  coverImage: string
  highlights: string[]
}

export const BARRIOS: BarrioCategory[] = [
  {
    slug: 'canasvieiras',
    nombre: 'Canasvieiras',
    descripcion: 'Playas tranquilas, gastronomía con sabor argentino y servicios completos para familias.',
    descripcionSeo: 'Departamentos y casas en alquiler en Canasvieiras, Florianópolis. Opciones frente al mar ideales para familias y grupos.',
    keywords: [
      'alquiler en Canasvieiras',
      'departamento en Canasvieiras',
      'temporada Canasvieiras Florianópolis',
    ],
    regiao: 'norte_da_ilha',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=60',
    highlights: ['Ambiente familiar', 'Servicios en español', 'Vida nocturna suave'],
  },
  {
    slug: 'jurere_internacional',
    nombre: 'Jurerê Internacional',
    descripcion: 'Lujo frente al mar, beach clubs y propiedades premium para estancias sofisticadas.',
    descripcionSeo: 'Casas y departamentos exclusivos en Jurerê Internacional, la zona más elegante de Florianópolis.',
    keywords: [
      'alquiler en Jurerê Internacional',
      'casas de lujo en Florianópolis',
      'temporada jurere',
    ],
    regiao: 'norte_da_ilha',
    coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Beach clubs', 'Servicios premium', 'Ambiente exclusivo'],
  },
  {
    slug: 'ingleses',
    nombre: 'Ingleses',
    descripcion: 'Playa extensa, comercios abiertos todo el año y fácil acceso a otras playas del norte.',
    descripcionSeo: 'Alquiler temporario en Ingleses, Florianópolis. Propiedades con excelente relación precio/beneficio.',
    keywords: [
      'alquiler en Ingleses',
      'departamentos en Ingleses',
      'temporada ingleses florianopolis',
    ],
    regiao: 'norte_da_ilha',
    coverImage: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=60',
    highlights: ['Comercios todo el año', 'playa extensa', 'ideal familias'],
  },
  {
    slug: 'campeche',
    nombre: 'Campeche',
    descripcion: 'Surf, naturaleza y estilo bohemio. Perfecto para quienes buscan energía joven.',
    descripcionSeo: 'Departamentos y casas modernas en Campeche, Florianópolis. Ambiente surf y naturaleza.',
    keywords: [
      'alquiler en Campeche',
      'temporada Campeche Florianópolis',
      'casas en Campeche',
    ],
    regiao: 'sul_da_ilha',
    coverImage: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Spot de surf', 'Gastronomía orgánica', 'Ambiente joven'],
  },
  {
    slug: 'barra_da_lagoa',
    nombre: 'Barra da Lagoa',
    descripcion: 'Canales, senderos y una comunidad pesquera encantadora. Ideal para desconectar.',
    descripcionSeo: 'Alquiler en Barra da Lagoa, Florianópolis. Casas y estudios cerca del canal y la playa.',
    keywords: [
      'alquiler en Barra da Lagoa',
      'temporada barra da lagoa',
      'casas barra da lagoa',
    ],
    regiao: 'centro',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=60',
    highlights: ['Ambiente nativo', 'Senderos', 'Playas tranquilas'],
  },
  {
    slug: 'lagoa_da_conceicao',
    nombre: 'Lagoa da Conceição',
    descripcion: 'Centro artístico con vista a la laguna, deportes náuticos y vida nocturna vibrante.',
    descripcionSeo: 'Alquiler en Lagoa da Conceição, Florianópolis. Estudios, lofts y casas con vista privilegiada.',
    keywords: [
      'alquiler en Lagoa da Conceição',
      'departamento en la lagoa',
      'temporada lagoa florianopolis',
    ],
    regiao: 'centro',
    coverImage: 'https://images.unsplash.com/photo-1471922695134-8f5a67f23b90?auto=format&fit=crop&w=1200&q=80',
    highlights: ['Vida nocturna', 'Deportes náuticos', 'Vista privilegiada'],
  },
  {
    slug: 'ponta_das_canas',
    nombre: 'Ponta das Canas',
    descripcion: 'Playa calma, ideal para familias y quienes buscan relajarse lejos del ruido.',
    descripcionSeo: 'Casas frente al mar en Ponta das Canas, Florianópolis. Playa calma con atardeceres memorables.',
    keywords: [
      'alquiler en Ponta das Canas',
      'casas frente al mar florianopolis',
      'temporada norte florianopolis',
    ],
    regiao: 'norte_da_ilha',
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=60',
    highlights: ['Playa calma', 'Atardeceres', 'Ambiente familiar'],
  },
]

export const BARRIO_SLUGS = BARRIOS.map((b) => b.slug)

export function getBarrioBySlug(slug: string) {
  return BARRIOS.find((barrio) => barrio.slug === slug) || null
}

