'use client'

import { useState } from 'react'
import { FiPhone } from 'react-icons/fi'

// Avatar placeholder de mulher ~40 anos (pravatar.cc img=47)
const AVATAR_PLACEHOLDER = 'https://i.pravatar.cc/150?img=47'

export default function WhatsAppFloatingButton() {
  const [isHovered, setIsHovered] = useState(false)

  const whatsappNumber = '5548991045052'
  const message = encodeURIComponent('Hola! Me gustaría obtener más información sobre las propiedades disponibles.')

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group transition-transform hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Avatar da atendente */}
        <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white">
          <img
            src="/images/logo/atendente.png"
            alt="Atendente"
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback para avatar placeholder se a imagem não existir
              const target = e.target as HTMLImageElement
              if (target.src !== AVATAR_PLACEHOLDER) {
                target.src = AVATAR_PLACEHOLDER
              }
            }}
          />
        </div>

        {/* Badge de notificação */}
        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse shadow-lg">
          1
        </div>

        {/* Tooltip */}
        {isHovered && (
          <div className="absolute right-20 top-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl p-3 whitespace-nowrap border border-gray-200 animate-fade-in">
            <p className="text-sm font-semibold text-gray-900">¿Necesitas ayuda?</p>
            <p className="text-xs text-gray-600">Chatea con nosotros</p>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1">
              <div className="w-2 h-2 bg-white border-r border-b border-gray-200 transform rotate-45"></div>
            </div>
          </div>
        )}

        {/* Ícone do WhatsApp */}
        <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1.5 shadow-lg border-2 border-white">
          <FiPhone className="text-white text-xs" />
        </div>
      </div>
    </a>
  )
}

