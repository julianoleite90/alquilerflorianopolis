'use client'

import { FiCalendar, FiMapPin, FiClock, FiExternalLink } from 'react-icons/fi'
import type { Evento } from '@/types/database.types'

interface EventoCardProps {
  evento: Evento
}

export default function EventoCard({ evento }: EventoCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatTime = (timeString: string | null) => {
    if (!timeString) return ''
    return timeString.substring(0, 5) // HH:MM
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-shadow duration-200 hover:shadow-xl">
      {evento.imagem && (
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={evento.imagem}
            alt={evento.titulo}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
            }}
          />
        </div>
      )}
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{evento.titulo}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{evento.descripcion}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-700 text-sm">
            <FiCalendar className="text-primary-600 mr-2" />
            <span>
              {formatDate(evento.fecha_inicio)}
              {evento.fecha_fin && ` - ${formatDate(evento.fecha_fin)}`}
            </span>
          </div>
          
          {evento.hora_inicio && (
            <div className="flex items-center text-gray-700 text-sm">
              <FiClock className="text-primary-600 mr-2" />
              <span>
                {formatTime(evento.hora_inicio)}
                {evento.hora_fin && ` - ${formatTime(evento.hora_fin)}`}
              </span>
            </div>
          )}
          
          <div className="flex items-center text-gray-700 text-sm">
            <FiMapPin className="text-primary-600 mr-2" />
            <span>{evento.localizacao}</span>
          </div>
        </div>
        
        {evento.link_externo && (
          <a
            href={evento.link_externo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold text-sm"
          >
            Más información
            <FiExternalLink className="ml-1" />
          </a>
        )}
      </div>
    </div>
  )
}

