'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FiMapPin, FiHome, FiMaximize2, FiDroplet, FiChevronLeft, FiChevronRight, FiNavigation } from 'react-icons/fi'
import { getBarrioBySlug } from '@/data/barrios'
import type { Propiedad } from '@/types/database.types'

interface PropiedadCardProps {
  propiedad: Propiedad
}

export default function PropiedadCard({ propiedad }: PropiedadCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const barrioInfo = propiedad.barrio ? getBarrioBySlug(propiedad.barrio) : null

  const formatPrice = (precio: number, moneda: string = 'USD') => {
    const currency = moneda === 'BRL' ? 'BRL' : 'USD'
    const formattedNumber = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(precio)
    return `${currency} ${formattedNumber}`
  }

  const getPeriodoLabel = (periodo: string) => {
    return periodo === 'diaria' ? '/día' : '/mes'
  }

  const getTipoLabel = (tipo: string) => {
    const tipos: Record<string, string> = {
      casa: 'Casa',
      departamento: 'Departamento',
      local: 'Local',
      oficina: 'Oficina',
      terreno: 'Terreno',
    }
    return tipos[tipo] || tipo
  }

  const imagenes = propiedad.imagenes && propiedad.imagenes.length > 0 
    ? propiedad.imagenes 
    : []

  const hasMultipleImages = imagenes.length > 1

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % imagenes.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + imagenes.length) % imagenes.length)
  }

  const currentImage = imagenes[currentImageIndex] || null
  const isBase64 = currentImage?.startsWith('data:image')

  return (
    <Link href={`/propiedades/${propiedad.id}`}>
      <div className="card h-full flex flex-col overflow-hidden hover:shadow-2xl transition-all duration-300 group">
        <div className="relative h-56 sm:h-64 md:h-72 w-full bg-gray-200 overflow-hidden">
          {currentImage ? (
            <>
              {isBase64 ? (
                <img
                  src={currentImage}
                  alt={`${propiedad.titulo} - Alquiler en ${propiedad.ciudad}, Florianópolis`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <Image
                  src={currentImage}
                  alt={`${propiedad.titulo} - Alquiler en ${propiedad.ciudad}, Florianópolis`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  unoptimized={currentImage.startsWith('http://localhost')}
                />
              )}
              
              {/* Setas de navegação */}
              {hasMultipleImages && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    aria-label="Imagen anterior"
                  >
                    <FiChevronLeft className="text-xl" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    aria-label="Siguiente imagen"
                  >
                    <FiChevronRight className="text-xl" />
                  </button>
                  
                  {/* Indicadores de imagem */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 z-10">
                    {imagenes.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setCurrentImageIndex(index)
                        }}
                        className={`h-1.5 rounded-full transition-all ${
                          index === currentImageIndex 
                            ? 'bg-white w-6' 
                            : 'bg-white/50 w-1.5'
                        }`}
                        aria-label={`Ir a imagen ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <FiHome className="text-gray-400 text-4xl" />
            </div>
          )}
          
          {/* Badge de tipo */}
          <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-primary-600 text-white px-2 py-1 md:px-4 md:py-1.5 rounded-full text-xs md:text-sm font-bold shadow-lg">
            {getTipoLabel(propiedad.tipo)}
          </div>
        </div>
        
        <div className="p-4 md:p-6 flex-1 flex flex-col">
          <h2 className="text-lg md:text-xl font-bold mb-2 line-clamp-2 text-gray-900 group-hover:text-primary-600 transition-colors">
            {propiedad.titulo}
          </h2>
          
          <div className="mb-3 md:mb-4">
            <p className="text-primary-600 text-2xl md:text-3xl font-bold">
              {formatPrice(propiedad.precio, propiedad.moneda)}
              <span className="text-sm md:text-base text-gray-600 font-normal ml-1">{getPeriodoLabel(propiedad.periodo)}</span>
            </p>
          </div>
          
          <div className="flex flex-col gap-1 mb-3 md:mb-4">
            <div className="flex items-center text-gray-600 text-xs md:text-sm">
              <FiMapPin className="mr-1.5 md:mr-2 text-primary-600 text-sm md:text-base" />
              <span className="line-clamp-1">{propiedad.ciudad}, {propiedad.provincia}</span>
            </div>
            {barrioInfo && (
              <span className="inline-flex items-center w-fit px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-[11px] md:text-xs font-semibold">
                {barrioInfo.nombre}
              </span>
            )}
          </div>

          {/* Distância da praia */}
          {(propiedad as any).distancia_praia && (
            <div className="flex items-center text-gray-600 mb-3 md:mb-4 text-xs md:text-sm">
              <FiNavigation className="mr-1.5 md:mr-2 text-primary-600 text-sm md:text-base" />
              <span>{(propiedad as any).distancia_praia} m de la playa</span>
            </div>
          )}
          
          <div className="flex items-center flex-wrap gap-3 md:gap-5 text-gray-600 text-xs md:text-sm mt-auto pt-3 md:pt-4 border-t border-gray-200">
            {propiedad.habitaciones && (
              <div className="flex items-center space-x-1 md:space-x-1.5">
                <FiHome className="text-primary-600 text-sm md:text-base" />
                <span className="font-medium">{propiedad.habitaciones} hab.</span>
              </div>
            )}
            {propiedad.banios && (
              <div className="flex items-center space-x-1 md:space-x-1.5">
                <FiDroplet className="text-primary-600 text-sm md:text-base" />
                <span className="font-medium">{propiedad.banios} baños</span>
              </div>
            )}
            {propiedad.metros_cuadrados && (
              <div className="flex items-center space-x-1 md:space-x-1.5">
                <FiMaximize2 className="text-primary-600 text-sm md:text-base" />
                <span className="font-medium">{propiedad.metros_cuadrados} m²</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
