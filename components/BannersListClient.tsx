'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiPlus, FiEdit, FiImage } from 'react-icons/fi'
import DeleteBannerButton from './DeleteBannerButton'
import { getBannersFromLocalStorage, type BannerLocal } from '@/lib/supabase/local-storage-fallback'

interface BannersListClientProps {
  initialBanners: any[] | null
  useLocalStorage: boolean
}

export default function BannersListClient({ initialBanners, useLocalStorage: initialUseLocalStorage }: BannersListClientProps) {
  const [banners, setBanners] = useState<any[]>(initialBanners || [])
  const [useLocalStorage, setUseLocalStorage] = useState(initialUseLocalStorage)

  useEffect(() => {
    if (useLocalStorage) {
      const localBanners = getBannersFromLocalStorage()
      setBanners(localBanners)
    }
  }, [useLocalStorage])

  useEffect(() => {
    // Recargar cuando se actualiza localStorage
    const interval = setInterval(() => {
      if (useLocalStorage) {
        const localBanners = getBannersFromLocalStorage()
        setBanners(localBanners)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [useLocalStorage])

  if (useLocalStorage && banners.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <p className="text-gray-600 text-lg mb-4">
          No hay banners registrados aún.
        </p>
        <p className="text-sm text-blue-600 mb-4">
          💡 Modo desarrollo: Los banners se guardan en localStorage (temporal).
        </p>
        <Link href="/dashboard/banners/nuevo" className="btn-primary inline-block">
          Crear primer banner
        </Link>
      </div>
    )
  }

  return (
    <>
      {useLocalStorage && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
          <p className="text-sm text-blue-800">
            💡 Modo desarrollo: Los banners se guardan en localStorage. Para producción, inicia Supabase con "supabase start".
          </p>
        </div>
      )}
      
      {banners && banners.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div key={banner.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48 w-full bg-gray-200">
                {banner.imagen_url ? (
                  <img
                    src={banner.imagen_url}
                    alt={banner.titulo || 'Banner'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FiImage className="text-gray-400 text-4xl" />
                  </div>
                )}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${
                  banner.activo 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-500 text-white'
                }`}>
                  {banner.activo ? 'Activo' : 'Inactivo'}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-bold mb-2 line-clamp-1">
                  {banner.titulo || 'Sin título'}
                </h3>
                {banner.descripcion && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {banner.descripcion}
                  </p>
                )}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>Orden: {banner.orden}</span>
                  {banner.enlace && (
                    <span className="text-primary-600">Tiene enlace</span>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/dashboard/banners/editar/${banner.id}`}
                    className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                  >
                    <FiEdit />
                    <span>Editar</span>
                  </Link>
                  <DeleteBannerButton bannerId={banner.id} useLocalStorage={useLocalStorage} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600 text-lg mb-4">
            No hay banners registrados aún.
          </p>
          <Link href="/dashboard/banners/nuevo" className="btn-primary inline-block">
            Crear primer banner
          </Link>
        </div>
      )}
    </>
  )
}

