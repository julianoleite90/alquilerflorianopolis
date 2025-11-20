'use client'

import { useState } from 'react'
import { FiTrash2 } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface DeleteButtonProps {
  propiedadId: string
}

export default function DeleteButton({ propiedadId }: DeleteButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta propiedad?')) {
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('propiedades')
        .delete()
        .eq('id', propiedadId)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error('Error al eliminar:', error)
      alert('Error al eliminar la propiedad')
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

