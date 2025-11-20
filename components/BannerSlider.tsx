'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getBannersFromLocalStorage } from '@/lib/supabase/local-storage-fallback'

interface Banner {
  id: string
  titulo?: string | null
  descripcion?: string | null
  imagen_url: string
  enlace?: string | null
}

interface BannerSliderProps {
  initialBanners: Banner[] | null
}

export default function BannerSlider({ initialBanners }: BannerSliderProps) {
  const [banners, setBanners] = useState<Banner[]>(initialBanners || [])
  const [currentIndex, setCurrentIndex] = useState(0)

  // Cargar banners de localStorage (siempre en el cliente)
  const loadBanners = () => {
    const localBanners = getBannersFromLocalStorage()
      .filter(b => b.activo !== false)
      .sort((a, b) => (a.orden || 0) - (b.orden || 0))
    
    console.log('Banners cargados de localStorage:', localBanners)
    
    if (localBanners.length > 0) {
      setBanners(localBanners as Banner[])
    } else if (initialBanners && initialBanners.length > 0) {
      setBanners(initialBanners)
    }
  }

  // Cargar al montar y cuando cambia localStorage
  useEffect(() => {
    loadBanners()

    // Escuchar cambios en localStorage
    const handleStorageChange = () => {
      loadBanners()
    }

    // Polling para detectar cambios (localStorage events no funcionan en la misma pestaña)
    const interval = setInterval(loadBanners, 1000)

    window.addEventListener('storage', handleStorageChange)

    return () => {
      clearInterval(interval)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  useEffect(() => {
    if (banners.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length)
    }, 5000) // Cambia cada 5 segundos

    return () => clearInterval(interval)
  }, [banners.length])

  if (!banners || banners.length === 0) {
    return null
  }

  const currentBanner = banners[currentIndex]

  return (
    <section className="relative w-full h-96 md:h-[500px] overflow-hidden">
      <div className="relative w-full h-full">
        {currentBanner && (
          <>
            {currentBanner.enlace ? (
              <Link href={currentBanner.enlace}>
                <div className="relative w-full h-full">
                  <Image
                    src={currentBanner.imagen_url}
                    alt={currentBanner.titulo || 'Banner'}
                    fill
                    className="object-cover"
                    priority
                  />
                  {(currentBanner.titulo || currentBanner.descripcion) && (
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                      <div className="text-center text-white px-4">
                        {currentBanner.titulo && (
                          <h2 className="text-4xl md:text-6xl font-bold mb-4">{currentBanner.titulo}</h2>
                        )}
                        {currentBanner.descripcion && (
                          <p className="text-xl md:text-2xl">{currentBanner.descripcion}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            ) : (
              <div className="relative w-full h-full">
                <Image
                  src={currentBanner.imagen_url}
                  alt={currentBanner.titulo || 'Banner'}
                  fill
                  className="object-cover"
                  priority
                />
                {(currentBanner.titulo || currentBanner.descripcion) && (
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <div className="text-center text-white px-4">
                      {currentBanner.titulo && (
                        <h2 className="text-4xl md:text-6xl font-bold mb-4">{currentBanner.titulo}</h2>
                      )}
                      {currentBanner.descripcion && (
                        <p className="text-xl md:text-2xl">{currentBanner.descripcion}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Indicadores */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
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

