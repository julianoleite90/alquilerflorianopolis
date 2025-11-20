'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiSearch } from 'react-icons/fi'
import { getBannersFromLocalStorage } from '@/lib/supabase/local-storage-fallback'

export default function HeroFallback() {
  const [hasBanners, setHasBanners] = useState(false)

  useEffect(() => {
    const checkBanners = () => {
      const banners = getBannersFromLocalStorage()
        .filter(b => b.activo !== false)
      setHasBanners(banners.length > 0)
    }

    checkBanners()
    const interval = setInterval(checkBanners, 1000)
    return () => clearInterval(interval)
  }, [])

  // Se houver banners, não mostrar o fallback
  if (hasBanners) {
    return null
  }

  return (
    <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Tu temporada en Florianópolis
          </h1>
          <p className="text-xl mb-8 text-primary-100">
            Encuentra el alojamiento perfecto para disfrutar de la mejor temporada en Floripa
          </p>
          <Link href="/propiedades" className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
            <FiSearch className="inline mr-2" />
            Buscar Propiedades
          </Link>
        </div>
      </div>
    </section>
  )
}

