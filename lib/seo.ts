import type { Metadata } from 'next'
import type { Propiedad, Evento } from '@/types/database.types'
import type { BarrioCategory } from '@/data/barrios'

const SITE_NAME = 'Alquiler en Florianópolis'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://alquilerenflorianopolis.com'
const DEFAULT_DESCRIPTION = 'Encuentra tu alojamiento perfecto para la temporada en Florianópolis. Casas, departamentos y más cerca de las mejores playas de Brasil. Reserva ahora y disfruta de la mejor temporada en Floripa.'

export function generateMetadata({
  title,
  description,
  path = '',
  image,
  type = 'website',
  noindex = false,
}: {
  title: string
  description?: string
  path?: string
  image?: string
  type?: 'website' | 'article'
  noindex?: boolean
}): Metadata {
  const fullTitle = `${title} - ${SITE_NAME}`
  const url = `${SITE_URL}${path}`
  const ogImage = image || `${SITE_URL}/images/og-default.jpg`

  return {
    title: fullTitle,
    description: description || DEFAULT_DESCRIPTION,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description: description || DEFAULT_DESCRIPTION,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'es_AR',
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: description || DEFAULT_DESCRIPTION,
      images: [ogImage],
    },
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
      },
    },
  }
}

export function generatePropiedadMetadata(propiedad: Propiedad): Metadata {
  const title = propiedad.titulo
  const description = propiedad.descripcion.length > 155
    ? propiedad.descripcion.substring(0, 152) + '...'
    : propiedad.descripcion
  
  const image = propiedad.imagenes && propiedad.imagenes.length > 0
    ? propiedad.imagenes[0]
    : undefined

  return generateMetadata({
    title,
    description: `${description} | ${propiedad.ciudad}, ${propiedad.provincia}. Precio: ${propiedad.moneda} ${propiedad.precio}/${propiedad.periodo === 'diaria' ? 'día' : 'mes'}`,
    path: `/propiedades/${propiedad.id}`,
    image,
    type: 'article',
  })
}

export function generateEventoMetadata(evento: Evento): Metadata {
  const title = evento.titulo
  const description = evento.descripcion.length > 155
    ? evento.descripcion.substring(0, 152) + '...'
    : evento.descripcion

  return generateMetadata({
    title,
    description: `${description} | ${evento.localizacao}, ${evento.cidade}`,
    path: `/eventos/${evento.id}`,
    image: evento.imagem || undefined,
    type: 'article',
  })
}

export function generateBarrioMetadata(barrio: BarrioCategory): Metadata {
  return generateMetadata({
    title: `Alquiler en ${barrio.nombre}`,
    description: barrio.descripcionSeo,
    path: `/barrios/${barrio.slug}`,
    image: barrio.coverImage,
  })
}

export function generateStructuredData(propiedad: Propiedad) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Accommodation',
    name: propiedad.titulo,
    description: propiedad.descripcion,
    address: {
      '@type': 'PostalAddress',
      streetAddress: propiedad.direccion,
      addressLocality: propiedad.ciudad,
      addressRegion: propiedad.provincia,
      postalCode: propiedad.codigo_postal || '',
      addressCountry: 'BR',
    },
    image: propiedad.imagenes && propiedad.imagenes.length > 0 ? propiedad.imagenes : undefined,
    priceRange: `${propiedad.moneda} ${propiedad.precio}`,
    numberOfRooms: propiedad.habitaciones || undefined,
    numberOfBathroomsTotal: propiedad.banios || undefined,
    floorSize: propiedad.metros_cuadrados ? {
      '@type': 'QuantitativeValue',
      value: propiedad.metros_cuadrados,
      unitCode: 'MTK',
    } : undefined,
  }
}

