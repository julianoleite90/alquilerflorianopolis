'use client'

import { useState } from 'react'
import { FiTrash2 } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { deleteBannerFromLocalStorage } from '@/lib/supabase/local-storage-fallback'

interface DeleteBannerButtonProps {
  bannerId: string
  useLocalStorage?: boolean
}

export default function DeleteBannerButton({ bannerId, useLocalStorage = false }: DeleteBannerButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que deseas eliminar este banner?')) {
      return
    }

    setLoading(true)
    try {
      if (useLocalStorage || bannerId.startsWith('local-')) {
        const deleted = deleteBannerFromLocalStorage(bannerId)
        if (deleted) {
          router.refresh()
        } else {
          alert('No se pudo eliminar el banner')
        }
      } else {
        const { error } = await supabase
          .from('banners')
          .delete()
          .eq('id', bannerId)

        if (error) throw error

        router.refresh()
      }
    } catch (error) {
      console.error('Error al eliminar:', error)
      // Intentar con localStorage como fallback
      if (!useLocalStorage) {
        const deleted = deleteBannerFromLocalStorage(bannerId)
        if (deleted) {
          router.refresh()
        } else {
          alert('Error al eliminar el banner')
        }
      } else {
        alert('Error al eliminar el banner')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
    >
      <FiTrash2 />
    </button>
  )
}

