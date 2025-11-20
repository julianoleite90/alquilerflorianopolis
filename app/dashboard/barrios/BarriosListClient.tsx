'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { FiEdit, FiTrash2, FiMapPin, FiImage } from 'react-icons/fi'

interface BarriosListClientProps {
  initialBarrios: any[]
}

export default function BarriosListClient({ initialBarrios }: BarriosListClientProps) {
  const router = useRouter()
  const [barrios, setBarrios] = useState(initialBarrios)
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este barrio?')) {
      return
    }

    setDeleting(id)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('barrios')
        .delete()
        .eq('id', id)

      if (error) throw error

      setBarrios(barrios.filter(b => b.id !== id))
      router.refresh()
    } catch (error: any) {
      console.error('Error al eliminar:', error)
      alert('Error al eliminar el barrio: ' + error.message)
    } finally {
      setDeleting(null)
    }
  }

  if (barrios.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <FiMapPin className="text-gray-400 text-5xl mx-auto mb-4" />
        <p className="text-gray-600 text-lg mb-4">
          No hay barrios registrados aún.
        </p>
        <Link href="/dashboard/barrios/nuevo" className="btn-primary inline-block">
          Crear primer barrio
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {barrios.map((barrio) => (
        <div
          key={barrio.id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="relative h-48">
            <img
              src={barrio.cover_image}
              alt={barrio.nombre}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                barrio.activo 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {barrio.activo ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <h3 className="text-white font-bold text-lg">{barrio.nombre}</h3>
              <p className="text-white/90 text-sm mt-1">
                {barrio.regiao === 'norte_da_ilha' ? 'Norte' :
                 barrio.regiao === 'sul_da_ilha' ? 'Sur' :
                 barrio.regiao === 'centro' ? 'Centro' : 'Continente'}
              </p>
            </div>
          </div>
          
          <div className="p-5">
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {barrio.descripcion}
            </p>
            
            {barrio.highlights && barrio.highlights.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {barrio.highlights.slice(0, 3).map((highlight: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs rounded-full bg-primary-50 text-primary-700 font-medium"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FiImage />
                <span>Orden: {barrio.orden || 0}</span>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/dashboard/barrios/editar/${barrio.id}`}
                  className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="Editar"
                >
                  <FiEdit />
                </Link>
                <button
                  onClick={() => handleDelete(barrio.id)}
                  disabled={deleting === barrio.id}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Eliminar"
                >
                  {deleting === barrio.id ? (
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <FiTrash2 />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

