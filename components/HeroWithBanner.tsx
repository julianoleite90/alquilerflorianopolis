'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiSearch } from 'react-icons/fi'
import { createClient } from '@/lib/supabase/client'
import { getBannersFromLocalStorage } from '@/lib/supabase/local-storage-fallback'

interface Banner {
  id: string
  titulo?: string | null
  descripcion?: string | null
  imagen_url: string
  enlace?: string | null
}

export default function HeroWithBanner() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hasBanners, setHasBanners] = useState(false)

  const loadBanners = async () => {
    const isProduction = process.env.NODE_ENV === 'production'
    
    // Em produção, sempre tentar Supabase primeiro
    if (isProduction) {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('banners')
          .select('*')
          .eq('activo', true)
          .order('orden', { ascending: true })

        if (!error && data && data.length > 0) {
          setBanners(data as Banner[])
          setHasBanners(true)
          return
        }
      } catch (error) {
        console.warn('Error al cargar banners desde Supabase:', error)
      }
    }

    // Fallback para localStorage (solo en desarrollo)
    if (!isProduction) {
      const localBanners = getBannersFromLocalStorage()
        .filter(b => b.activo !== false)
        .sort((a, b) => (a.orden || 0) - (b.orden || 0))
      
      if (localBanners.length > 0) {
        setBanners(localBanners as Banner[])
        setHasBanners(true)
      } else {
        setHasBanners(false)
      }
    } else {
      setHasBanners(false)
    }
  }

  useEffect(() => {
    loadBanners()
    // En producción, recargar cada 30 segundos
    // En desarrollo, cada 1 segundo para ver cambios en localStorage
    const interval = setInterval(loadBanners, process.env.NODE_ENV === 'production' ? 30000 : 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (banners.length <= 1) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [banners.length])

  const currentBanner = banners[currentIndex]

  return (
    <section className="relative w-full">
      {/* Banner de fundo ou gradiente */}
      {hasBanners && currentBanner ? (
        <>
          {currentBanner.enlace ? (
            <Link href={currentBanner.enlace} className="block w-full">
              <div 
                className="relative w-full bg-gray-900 overflow-hidden"
                style={{
                  height: '350px'
                }}
              >
                <img
                  src={currentBanner.imagen_url}
                  alt={currentBanner.titulo || 'Banner'}
                  className="w-full h-full"
                  style={{
                    display: 'block',
                    objectFit: 'cover',
                    objectPosition: 'center center',
                    width: '100%',
                    height: '100%'
                  }}
                />
              </div>
            </Link>
          ) : (
            <div 
              className="relative w-full bg-gray-900 overflow-hidden"
              style={{
                height: '350px'
              }}
            >
              <img
                src={currentBanner.imagen_url}
                alt={currentBanner.titulo || 'Banner'}
                className="w-full h-full"
                style={{
                  display: 'block',
                  objectFit: 'cover',
                  objectPosition: 'center center',
                  width: '100%',
                  height: '100%'
                }}
              />
            </div>
          )}
        </>
      ) : (
        <div className="w-full bg-gradient-to-r from-primary-600 to-primary-800" style={{ height: '350px' }}></div>
      )}

      {/* Overlay para contraste */}
      {hasBanners && currentBanner && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60 pointer-events-none" />
      )}

      {/* Conteúdo sobreposto */}
      <div className="absolute inset-0 flex items-center justify-center px-4 pointer-events-none">
        <div className="container-custom pointer-events-auto">
          <div className="max-w-3xl mx-auto text-center">
            {currentBanner?.titulo ? (
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-white px-2" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}>
                {currentBanner.titulo}
              </h1>
            ) : (
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 text-white px-2" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}>
                Tu temporada en Florianópolis
              </h1>
            )}
            
            {currentBanner?.descripcion ? (
              <p className="text-base md:text-lg lg:text-xl font-semibold mb-6 md:mb-8 text-white px-2" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.6)' }}>
                {currentBanner.descripcion}
              </p>
            ) : (
              <p className="text-base md:text-lg lg:text-xl font-semibold mb-6 md:mb-8 text-white px-2" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.6)' }}>
                Encuentra el alojamiento perfecto para disfrutar de la mejor temporada en Floripa
              </p>
            )}
            
            <Link 
              href="/propiedades" 
              className="inline-flex items-center justify-center space-x-2 bg-primary-600 text-white px-8 py-4 md:px-10 md:py-5 rounded-xl font-bold hover:bg-primary-700 transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-105 text-base md:text-lg"
            >
              <FiSearch className="text-xl md:text-2xl" />
              <span>Buscar Propiedades</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Indicadores de banner */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-white w-8' : 'bg-white bg-opacity-50'
              }`}
              aria-label={`Ir al banner ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
