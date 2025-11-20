'use client'

import { useState, useEffect } from 'react'
import FormBanner from './FormBanner'
import { getBannersFromLocalStorage, type BannerLocal } from '@/lib/supabase/local-storage-fallback'

interface EditarBannerClientProps {
  bannerId: string
  initialBanner: any | null
  useLocalStorage: boolean
}

export default function EditarBannerClient({ bannerId, initialBanner, useLocalStorage }: EditarBannerClientProps) {
  const [banner, setBanner] = useState(initialBanner)

  useEffect(() => {
    if (useLocalStorage || bannerId.startsWith('local-')) {
      const banners = getBannersFromLocalStorage()
      const found = banners.find(b => b.id === bannerId)
      if (found) {
        setBanner(found)
      }
    }
  }, [bannerId, useLocalStorage])

  if (!banner) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-600">Banner no encontrado</p>
      </div>
    )
  }

  return <FormBanner banner={banner} />
}

