'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { FiMapPin, FiHome, FiMaximize2, FiDroplet, FiCheck, FiNavigation, FiX, FiChevronLeft, FiChevronRight, FiCalendar, FiDollarSign, FiPhone, FiMail } from 'react-icons/fi'
import Link from 'next/link'
import { getPropiedadesFromLocalStorage } from '@/lib/supabase/local-storage-fallback'
import GoogleMap from '@/components/GoogleMap'
import VerificarDisponibilidadModal from '@/components/VerificarDisponibilidadModal'
import StructuredData from '@/components/StructuredData'
import { getBarrioBySlug } from '@/data/barrios'
import type { Propiedad } from '@/types/database.types'

interface PropiedadDetailClientProps {
  initialPropiedad: Propiedad | null
  propiedadId: string
}

export default function PropiedadDetailClient({ initialPropiedad, propiedadId }: PropiedadDetailClientProps) {
  const [propiedad, setPropiedad] = useState<Propiedad | null>(initialPropiedad)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [showDisponibilidadModal, setShowDisponibilidadModal] = useState(false)

  useEffect(() => {
    if (!propiedad) {
      const localPropiedades = getPropiedadesFromLocalStorage()
      const found = localPropiedades.find(p => p.id === propiedadId && p.disponible !== false)
      if (found) {
        setPropiedad(found as Propiedad)
      }
    }
  }, [propiedad, propiedadId])

  if (!propiedad) {
    return (
      <div className="container-custom py-8">
        <p className="text-gray-600">Propiedad no encontrada.</p>
        <Link href="/propiedades" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
          ← Volver a propiedades
        </Link>
      </div>
    )
  }

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

  const isBase64 = (img: string) => img.startsWith('data:image')

  const nextImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex < imagenes.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1)
    }
  }

  const prevImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1)
    }
  }

  const barrioInfo = propiedad.barrio ? getBarrioBySlug(propiedad.barrio) : null

  return (
    <>
      {propiedad && <StructuredData propiedad={propiedad} />}
      <div className="container-custom py-4 md:py-8 px-4 md:px-0">
        <Link href="/propiedades" className="text-primary-600 hover:text-primary-700 mb-4 md:mb-6 inline-flex items-center group text-sm md:text-base">
          <FiChevronLeft className="mr-1 group-hover:-translate-x-1 transition-transform" />
          Volver a propiedades
        </Link>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Galería de Imágenes Mejorada */}
        {imagenes.length > 0 ? (
          <div className="relative">
            {/* Imagen Principal */}
            <div className="relative h-[250px] sm:h-[300px] md:h-[400px] lg:h-[450px] bg-gray-200">
              {isBase64(imagenes[0]) ? (
                <img
                  src={imagenes[0]}
                  alt={`${propiedad.titulo} - Alquiler en ${propiedad.ciudad}, Florianópolis`}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setSelectedImageIndex(0)}
                />
              ) : (
                <Image
                  src={imagenes[0]}
                  alt={`${propiedad.titulo} - Alquiler en ${propiedad.ciudad}, Florianópolis`}
                  fill
                  className="object-cover cursor-pointer"
                  priority
                  unoptimized={imagenes[0].startsWith('http://localhost')}
                  onClick={() => setSelectedImageIndex(0)}
                />
              )}
              {imagenes.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-4 py-2 rounded-lg text-sm font-semibold">
                  {imagenes.length} imágenes
                </div>
              )}
            </div>

            {/* Miniaturas */}
            {imagenes.length > 1 && (
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2 p-4 bg-gray-50">
                {imagenes.slice(0, 6).map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg"
                    onClick={() => setSelectedImageIndex(idx)}
                  >
                    {isBase64(img) ? (
                      <img
                        src={img}
                        alt={`${propiedad.titulo} - Imagen ${idx + 1} - Alquiler en ${propiedad.ciudad}, Florianópolis`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <Image
                        src={img}
                        alt={`${propiedad.titulo} - Imagen ${idx + 1} - Alquiler en ${propiedad.ciudad}, Florianópolis`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        unoptimized={img.startsWith('http://localhost')}
                      />
                    )}
                    {idx === 0 && (
                      <div className="absolute inset-0 border-2 border-primary-600"></div>
                    )}
                  </div>
                ))}
                {imagenes.length > 6 && (
                  <div className="relative aspect-square bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer group"
                    onClick={() => setSelectedImageIndex(6)}
                  >
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-600">+{imagenes.length - 6}</div>
                      <div className="text-xs text-gray-500">más</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="h-[500px] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <FiHome className="text-gray-400 text-8xl" />
          </div>
        )}

        {/* Modal de Imagen Completa */}
        {selectedImageIndex !== null && (
          <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4" onClick={() => setSelectedImageIndex(null)}>
            <button
              onClick={() => setSelectedImageIndex(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <FiX className="text-3xl" />
            </button>
            {selectedImageIndex > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 text-white hover:text-gray-300 z-10 bg-black/50 p-3 rounded-full"
              >
                <FiChevronLeft className="text-2xl" />
              </button>
            )}
            {selectedImageIndex < imagenes.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 text-white hover:text-gray-300 z-10 bg-black/50 p-3 rounded-full"
              >
                <FiChevronRight className="text-2xl" />
              </button>
            )}
            <div className="max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
              {isBase64(imagenes[selectedImageIndex]) ? (
                <img
                  src={imagenes[selectedImageIndex]}
                  alt={`${propiedad.titulo} - Imagen ${selectedImageIndex + 1} - Alquiler en ${propiedad.ciudad}, Florianópolis`}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <Image
                  src={imagenes[selectedImageIndex]}
                  alt={`${propiedad.titulo} - Imagen ${selectedImageIndex + 1} - Alquiler en ${propiedad.ciudad}, Florianópolis`}
                  width={1200}
                  height={800}
                  className="max-w-full max-h-full object-contain"
                  unoptimized={imagenes[selectedImageIndex].startsWith('http://localhost')}
                />
              )}
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
              Imagen {selectedImageIndex + 1} de {imagenes.length}
            </div>
          </div>
        )}

        <div className="p-4 md:p-6 lg:p-10">
          {/* Header simplificado */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center gap-2 mb-2 md:mb-3 flex-wrap">
              <span className="text-primary-600 text-xs md:text-sm font-semibold">{getTipoLabel(propiedad.tipo)}</span>
              <span className="text-gray-400">•</span>
              <span className="text-green-600 text-xs md:text-sm font-medium">Disponible</span>
              {barrioInfo && (
                <>
                  <span className="text-gray-400 hidden md:inline">•</span>
                  <span className="px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold">
                    {barrioInfo.nombre}
                  </span>
                </>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 text-gray-900">{propiedad.titulo}</h1>
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-4 text-gray-600 mb-4 md:mb-6">
              <div className="flex items-center">
                <FiMapPin className="mr-1.5 text-primary-600 text-sm" />
                <span className="text-xs md:text-sm">{propiedad.direccion}, {propiedad.ciudad}</span>
              </div>
              {(propiedad as any).distancia_praia && (
                <>
                  <span className="hidden sm:inline text-gray-300">•</span>
                  <div className="flex items-center">
                    <FiNavigation className="mr-1.5 text-primary-600 text-sm" />
                    <span className="text-xs md:text-sm">{(propiedad as any).distancia_praia} m de la playa</span>
                  </div>
                </>
              )}
            </div>
            
            {/* Precio destacado */}
            <div className="flex items-baseline gap-2 mb-4 md:mb-6">
              <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-600">
                {formatPrice(propiedad.precio, propiedad.moneda)}
              </span>
              <span className="text-base md:text-lg text-gray-600">{getPeriodoLabel(propiedad.periodo)}</span>
            </div>
          </div>

          {/* Características Principales - Simplificadas */}
          <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-gray-200">
            {propiedad.habitaciones && (
              <div className="flex items-center gap-2">
                <FiHome className="text-primary-600 text-xl" />
                <div>
                  <div className="text-lg font-bold text-gray-900">{propiedad.habitaciones}</div>
                  <div className="text-xs text-gray-500">Habitaciones</div>
                </div>
              </div>
            )}
            {propiedad.banios && (
              <div className="flex items-center gap-2">
                <FiDroplet className="text-primary-600 text-xl" />
                <div>
                  <div className="text-lg font-bold text-gray-900">{propiedad.banios}</div>
                  <div className="text-xs text-gray-500">Baños</div>
                </div>
              </div>
            )}
            {propiedad.metros_cuadrados && (
              <div className="flex items-center gap-2">
                <FiMaximize2 className="text-primary-600 text-xl" />
                <div>
                  <div className="text-lg font-bold text-gray-900">{propiedad.metros_cuadrados} m²</div>
                  <div className="text-xs text-gray-500">Área</div>
                </div>
              </div>
            )}
            {(propiedad as any).estadia_minima && (
              <div className="flex items-center gap-2">
                <FiCalendar className="text-primary-600 text-xl" />
                <div>
                  <div className="text-lg font-bold text-gray-900">{(propiedad as any).estadia_minima}</div>
                  <div className="text-xs text-gray-500">noches mín.</div>
                </div>
              </div>
            )}
          </div>
          
          {/* CTAs */}
          <div className="mb-6 md:mb-8 flex flex-col sm:flex-row gap-2 md:gap-3">
            <button
              onClick={() => setShowDisponibilidadModal(true)}
              className="flex-1 bg-green-600 text-white py-3 md:py-3.5 rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm md:text-base"
            >
              Verificar Disponibilidad
            </button>
            <a
              href={`https://wa.me/5548991045052?text=${encodeURIComponent(`Hola, estoy interesado en: ${propiedad.titulo}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-green-500 text-white py-2.5 md:py-3 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <FiPhone className="text-sm md:text-base" />
              <span>WhatsApp</span>
            </a>
            <a
              href={`mailto:alquiler@tucasaenflorianopolis.com?subject=${encodeURIComponent(`Consulta sobre: ${propiedad.titulo}`)}`}
              className="flex-1 bg-gray-100 text-gray-700 py-2.5 md:py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
            >
              <FiMail className="text-sm md:text-base" />
              <span>Email</span>
            </a>
          </div>

          {/* Descripción */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-gray-900">Descripción</h2>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-line">
              {propiedad.descripcion}
            </p>
          </div>

          {/* Características */}
          {propiedad.caracteristicas && propiedad.caracteristicas.length > 0 && (
            <div className="mb-6 md:mb-8">
              <h2 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-gray-900">Características</h2>
              <div className="flex flex-wrap gap-2">
                {propiedad.caracteristicas.map((caracteristica, idx) => (
                  <div key={idx} className="flex items-center gap-1 md:gap-1.5 bg-gray-50 rounded-full px-2.5 py-1 md:px-3 md:py-1.5">
                    <FiCheck className="text-green-500 text-xs md:text-sm flex-shrink-0" />
                    <span className="text-gray-700 text-xs md:text-sm">{caracteristica}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mapa */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-gray-900">Ubicación</h2>
            <div className="rounded-lg overflow-hidden border border-gray-200">
              <GoogleMap
                direccion={propiedad.direccion}
                ciudad={propiedad.ciudad}
                provincia={propiedad.provincia}
                height="250px"
              />
            </div>
            <div className="mt-2 md:mt-3">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${propiedad.direccion}, ${propiedad.ciudad}, ${propiedad.provincia}, Brasil`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 text-xs md:text-sm inline-flex items-center"
              >
                <FiMapPin className="mr-1 text-sm" />
                Abrir en Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Verificar Disponibilidad */}
      <VerificarDisponibilidadModal
        isOpen={showDisponibilidadModal}
        onClose={() => setShowDisponibilidadModal(false)}
        propiedadTitulo={propiedad.titulo}
      />
      </div>
    </>
  )
}
