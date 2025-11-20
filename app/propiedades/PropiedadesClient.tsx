'use client'

import { useState, useEffect } from 'react'
import { getPropiedadesFromLocalStorage } from '@/lib/supabase/local-storage-fallback'
import PropiedadCard from '@/components/PropiedadCard'
import FiltrosPropiedades from '@/components/FiltrosPropiedades'
import type { Propiedad } from '@/types/database.types'

interface PropiedadesClientProps {
  initialPropiedades: Propiedad[]
  searchParams: {
    tipo?: string
    ciudad?: string
    provincia?: string
    precio_min?: string
    precio_max?: string
    habitaciones?: string
    zona?: string
    barrio?: string
  }
}

export default function PropiedadesClient({ initialPropiedades, searchParams }: PropiedadesClientProps) {
  const [propiedades, setPropiedades] = useState<Propiedad[]>(initialPropiedades || [])

  useEffect(() => {
    // Carregar do localStorage se não houver propriedades iniciais ou se houver IDs locais
    if (initialPropiedades.length === 0 || initialPropiedades.some(p => p.id?.startsWith('local-'))) {
      loadFromLocalStorage()
    }

    // Verificar periodicamente por atualizações no localStorage
    const interval = setInterval(() => {
      loadFromLocalStorage()
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const loadFromLocalStorage = () => {
    let localPropiedades = getPropiedadesFromLocalStorage()
      .filter(p => p.disponible !== false)

    // Aplicar filtros
    if (searchParams.zona) {
      if (searchParams.zona === 'norte') {
        const zonasNorte = ['Jurerê', 'Canasvieiras', 'Ingleses', 'Santinho', 'Praia Brava', 'Daniela', 'Lagoinha']
        localPropiedades = localPropiedades.filter(p => 
          zonasNorte.some(zona => p.ciudad?.toLowerCase().includes(zona.toLowerCase()))
        )
      } else if (searchParams.zona === 'sul') {
        const zonasSul = ['Campeche', 'Armação', 'Pântano do Sul', 'Ribeirão da Ilha', 'Lagoa', 'Barra da Lagoa']
        localPropiedades = localPropiedades.filter(p => 
          zonasSul.some(zona => p.ciudad?.toLowerCase().includes(zona.toLowerCase()))
        )
      }
    }
    if (searchParams.barrio) {
      localPropiedades = localPropiedades.filter(p => p.barrio === searchParams.barrio)
    }
    if (searchParams.tipo) {
      localPropiedades = localPropiedades.filter(p => p.tipo === searchParams.tipo)
    }
    if (searchParams.ciudad) {
      localPropiedades = localPropiedades.filter(p => 
        p.ciudad?.toLowerCase().includes(searchParams.ciudad!.toLowerCase())
      )
    }
    if (searchParams.provincia) {
      localPropiedades = localPropiedades.filter(p => 
        p.provincia?.toLowerCase().includes(searchParams.provincia!.toLowerCase())
      )
    }
    if (searchParams.precio_min) {
      const precioMin = parseFloat(searchParams.precio_min)
      localPropiedades = localPropiedades.filter(p => p.precio >= precioMin)
    }
    if (searchParams.precio_max) {
      const precioMax = parseFloat(searchParams.precio_max)
      localPropiedades = localPropiedades.filter(p => p.precio <= precioMax)
    }
    if (searchParams.habitaciones) {
      const habitaciones = parseInt(searchParams.habitaciones)
      localPropiedades = localPropiedades.filter(p => p.habitaciones === habitaciones)
    }

    // Ordenar por data de criação
    localPropiedades = localPropiedades.sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime()
      const dateB = new Date(b.created_at || 0).getTime()
      return dateB - dateA
    })
    
    if (localPropiedades.length > 0 || initialPropiedades.length === 0) {
      setPropiedades(localPropiedades as Propiedad[])
    }
  }

  return (
    <div className="container-custom py-4 md:py-8 px-4 md:px-0">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4">Propiedades en Florianópolis</h1>
        <p className="text-sm md:text-base text-gray-600">
          Encuentra tu alojamiento perfecto para la temporada en Floripa
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8">
        <aside className="lg:col-span-1">
          <FiltrosPropiedades />
        </aside>

        <main className="lg:col-span-3">
          {propiedades && propiedades.length > 0 ? (
            <>
              <div className="mb-4 text-sm md:text-base text-gray-600">
                <p>{propiedades.length} propiedad{propiedades.length !== 1 ? 'es' : ''} encontrada{propiedades.length !== 1 ? 's' : ''}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {propiedades.map((propiedad) => (
                  <PropiedadCard key={propiedad.id} propiedad={propiedad} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8 md:py-12 bg-white rounded-lg px-4">
              <p className="text-gray-600 text-base md:text-lg mb-4">
                No se encontraron propiedades con los filtros seleccionados.
              </p>
              <a href="/propiedades" className="text-primary-600 hover:text-primary-700 font-semibold text-sm md:text-base">
                Ver todas las propiedades
              </a>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

