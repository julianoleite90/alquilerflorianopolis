'use client'

import { useEffect } from 'react'
import type { Propiedad } from '@/types/database.types'

interface StructuredDataProps {
  propiedad: Propiedad
}

export default function StructuredData({ propiedad }: StructuredDataProps) {
  useEffect(() => {
    const structuredData = {
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

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = 'structured-data'
    script.text = JSON.stringify(structuredData)
    
    // Remover script anterior se existe
    const existingScript = document.getElementById('structured-data')
    if (existingScript) {
      existingScript.remove()
    }
    
    document.head.appendChild(script)

    return () => {
      const scriptToRemove = document.getElementById('structured-data')
      if (scriptToRemove) {
        scriptToRemove.remove()
      }
    }
  }, [propiedad])

  return null
}

