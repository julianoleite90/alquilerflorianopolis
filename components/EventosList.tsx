'use client'

import { useState, useEffect } from 'react'
import { getEventosFromLocalStorage } from '@/lib/supabase/local-storage-fallback'
import EventoCard from './EventoCard'
import type { Evento } from '@/types/database.types'

interface EventosListProps {
  initialEventos: Evento[]
  limit?: number
}

export default function EventosList({ initialEventos, limit }: EventosListProps) {
  const [eventos, setEventos] = useState<Evento[]>(initialEventos || [])

  useEffect(() => {
    // Cargar del localStorage si no hay eventos iniciales o si hay IDs locales
    if (initialEventos.length === 0 || initialEventos.some(e => e.id?.startsWith('local-'))) {
      loadFromLocalStorage()
    }

    // Verificar periódicamente por actualizaciones en localStorage
    const interval = setInterval(() => {
      loadFromLocalStorage()
    }, 1000)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadFromLocalStorage = () => {
    let localEventos = getEventosFromLocalStorage()
      .filter(e => e.ativo !== false)
      .sort((a, b) => {
        const dateA = new Date(a.fecha_inicio || 0).getTime()
        const dateB = new Date(b.fecha_inicio || 0).getTime()
        return dateA - dateB // Ordenar por fecha (más próximos primero)
      })
    
    if (limit) {
      localEventos = localEventos.slice(0, limit)
    }
    
    if (localEventos.length > 0 || initialEventos.length === 0) {
      setEventos(localEventos as Evento[])
    }
  }

  const displayedEventos = limit ? eventos.slice(0, limit) : eventos

  if (displayedEventos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No hay eventos programados en este momento.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayedEventos.map((evento) => (
        <EventoCard key={evento.id} evento={evento} />
      ))}
    </div>
  )
}

