'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { getEventosFromLocalStorage, deleteEventoFromLocalStorage } from '@/lib/supabase/local-storage-fallback'
import { testSupabaseConnection } from '@/lib/supabase/test-connection'
import { FiPlus, FiEdit, FiTrash2, FiCalendar } from 'react-icons/fi'
import type { Evento } from '@/types/database.types'

export default function EventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [loading, setLoading] = useState(true)
  const [useLocalStorage, setUseLocalStorage] = useState(false)

  useEffect(() => {
    loadEventos()
  }, [])

  const loadEventos = async () => {
    setLoading(true)
    try {
      const connectionTest = await testSupabaseConnection()
      if (!connectionTest.success) {
        setUseLocalStorage(true)
        const localEventos = getEventosFromLocalStorage()
        setEventos(localEventos as Evento[])
        setLoading(false)
        return
      }

      const supabase = createClient()
      const { data, error } = await supabase
        .from('eventos')
        .select('*')
        .order('fecha_inicio', { ascending: true })

      if (error) throw error
      setEventos(data || [])
    } catch (error) {
      console.warn('Error al cargar eventos, usando localStorage:', error)
      setUseLocalStorage(true)
      const localEventos = getEventosFromLocalStorage()
      setEventos(localEventos as Evento[])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este evento?')) return

    try {
      if (useLocalStorage || id.startsWith('local-')) {
        deleteEventoFromLocalStorage(id)
      } else {
        const supabase = createClient()
        const { error } = await supabase.from('eventos').delete().eq('id', id)
        if (error) throw error
      }
      loadEventos()
    } catch (error) {
      console.error('Error al eliminar evento:', error)
      alert('Error al eliminar el evento')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  if (loading) {
    return <div className="text-center py-12">Cargando eventos...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center space-x-3">
          <FiCalendar className="text-primary-600" />
          <span>Eventos</span>
        </h1>
        <Link
          href="/dashboard/eventos/nuevo"
          className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center space-x-2"
        >
          <FiPlus />
          <span>Nuevo Evento</span>
        </Link>
      </div>

      {eventos.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600 text-lg mb-4">No hay eventos registrados</p>
          <Link
            href="/dashboard/eventos/nuevo"
            className="text-primary-600 hover:text-primary-700 font-semibold"
          >
            Crear primer evento →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventos.map((evento) => (
            <div key={evento.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {evento.imagem && (
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={evento.imagem}
                    alt={evento.titulo}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{evento.titulo}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{evento.descripcion}</p>
                <div className="space-y-1 mb-4 text-sm text-gray-700">
                  <p><strong>Fecha:</strong> {formatDate(evento.fecha_inicio)}</p>
                  {evento.localizacao && <p><strong>Ubicación:</strong> {evento.localizacao}</p>}
                  <p><strong>Estado:</strong> {evento.ativo ? 'Activo' : 'Inactivo'}</p>
                </div>
                <div className="flex space-x-2">
                  <Link
                    href={`/dashboard/eventos/editar/${evento.id}`}
                    className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg text-center hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <FiEdit />
                    <span>Editar</span>
                  </Link>
                  <button
                    onClick={() => handleDelete(evento.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

