'use client'

import { useState, useEffect } from 'react'
import { getPropiedadesFromLocalStorage } from '@/lib/supabase/local-storage-fallback'
import PropiedadCard from './PropiedadCard'
import type { Propiedad } from '@/types/database.types'

interface PropiedadesListProps {
  initialPropiedades: Propiedad[]
  limit?: number
  regiao?: string | null
  barrio?: string | null
}

export default function PropiedadesList({ initialPropiedades, limit, regiao, barrio }: PropiedadesListProps) {
  const [propiedades, setPropiedades] = useState<Propiedad[]>([])

  const loadAllPropiedades = () => {
    // Combinar propiedades del servidor y localStorage
    const serverPropiedades = initialPropiedades || []
    const localPropiedades = getPropiedadesFromLocalStorage()
      .filter(p => p.disponible !== false)
    
    // Combinar ambas listas, evitando duplicados
    const allPropiedades = [...serverPropiedades]
    localPropiedades.forEach(local => {
      if (!allPropiedades.find(p => p.id === local.id)) {
        allPropiedades.push(local as Propiedad)
      }
    })

    // Filtrar por región/barrio si se especifica
    let filtered = allPropiedades
    if (regiao) {
      filtered = filtered.filter(p => {
        const propiedadRegiao = p.regiao === '' || !p.regiao ? null : p.regiao
        return propiedadRegiao === regiao
      })
    }
    if (barrio) {
      filtered = filtered.filter(p => {
        const propiedadBarrio = p.barrio === '' || !p.barrio ? null : p.barrio
        return propiedadBarrio === barrio
      })
    }
    
    // Ordenar por fecha de creación
    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime()
      const dateB = new Date(b.created_at || 0).getTime()
      return dateB - dateA
    })
    
    // Aplicar límite si existe
    if (limit) {
      filtered = filtered.slice(0, limit)
    }
    
    setPropiedades(filtered)
  }

  useEffect(() => {
    // Cargar inmediatamente al montar
    loadAllPropiedades()

    // Verificar periódicamente por actualizaciones en localStorage
    const interval = setInterval(() => {
      loadAllPropiedades()
    }, 1000)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [regiao, barrio, initialPropiedades])


  const displayedPropiedades = limit ? propiedades.slice(0, limit) : propiedades

  if (displayedPropiedades.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No hay propiedades disponibles en este momento.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayedPropiedades.map((propiedad) => (
        <PropiedadCard key={propiedad.id} propiedad={propiedad} />
      ))}
    </div>
  )
}

