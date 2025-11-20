'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getEventosFromLocalStorage } from '@/lib/supabase/local-storage-fallback'
import { testSupabaseConnection } from '@/lib/supabase/test-connection'
import FormEvento from '@/components/FormEvento'
import type { Evento } from '@/types/database.types'

export default function EditarEventoPage({ params }: { params: { id: string } }) {
  const [evento, setEvento] = useState<Evento | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEvento()
  }, [params.id])

  const loadEvento = async () => {
    try {
      const connectionTest = await testSupabaseConnection()
      if (!connectionTest.success || params.id.startsWith('local-')) {
        const eventos = getEventosFromLocalStorage()
        const found = eventos.find(e => e.id === params.id)
        if (found) {
          setEvento(found as Evento)
          setLoading(false)
          return
        }
      }

      const supabase = createClient()
      const { data, error } = await supabase
        .from('eventos')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      setEvento(data)
    } catch (error) {
      console.error('Error al cargar evento:', error)
      // Intentar desde localStorage
      const eventos = getEventosFromLocalStorage()
      const found = eventos.find(e => e.id === params.id)
      if (found) {
        setEvento(found as Evento)
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Cargando evento...</div>
  }

  if (!evento) {
    return <div className="text-center py-12">Evento no encontrado</div>
  }

  return <FormEvento evento={evento} />
}

