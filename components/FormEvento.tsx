'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { createClient } from '@/lib/supabase/client'
import { uploadImage } from '@/lib/supabase/storage'
import { testSupabaseConnection } from '@/lib/supabase/test-connection'
import { 
  saveEventoToLocalStorage, 
  updateEventoInLocalStorage,
} from '@/lib/supabase/local-storage-fallback'
import type { Evento, EventoInsert } from '@/types/database.types'

interface FormEventoProps {
  evento?: Evento
}

export default function FormEvento({ evento }: FormEventoProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imagenUrl, setImagenUrl] = useState(evento?.imagem || '')
  const [useLocalStorage, setUseLocalStorage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    testSupabaseConnection().then((result) => {
      if (!result.success) {
        setUseLocalStorage(true)
      }
    }).catch(() => {
      setUseLocalStorage(true)
    })
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<EventoInsert>({
    defaultValues: evento || {
      ativo: true,
      cidade: 'Florianópolis',
    },
  })

  useEffect(() => {
    if (evento) {
      Object.keys(evento).forEach((key) => {
        setValue(key as keyof EventoInsert, evento[key as keyof Evento] as any)
      })
      if (evento.imagem) {
        setImagenUrl(evento.imagem)
      }
    }
  }, [evento, setValue])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const url = await uploadImage(file, 'eventos')
      setImagenUrl(url)
    } catch (error: any) {
      console.error('Error al subir imagen:', error)
      alert(`Error al subir la imagen: ${error.message || 'Error desconocido'}. En desarrollo local, se usará base64 como alternativa.`)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const onSubmit = async (data: any) => {
    setLoading(true)
    try {
      const eventoData: EventoInsert = {
        ...data,
        imagem: imagenUrl || null,
        cidade: data.cidade || 'Florianópolis',
        ativo: data.ativo !== false,
      }

      if (useLocalStorage || evento?.id?.startsWith('local-')) {
        if (evento?.id) {
          updateEventoInLocalStorage(evento.id, eventoData as any)
        } else {
          saveEventoToLocalStorage(eventoData as any)
        }
      } else {
        if (evento) {
          const { error } = await supabase
            .from('eventos')
            .update(eventoData)
            .eq('id', evento.id)

          if (error) throw error
        } else {
          const { error } = await supabase
            .from('eventos')
            .insert([eventoData])

          if (error) throw error
        }
      }

      router.push('/dashboard/eventos')
      router.refresh()
    } catch (error: any) {
      console.error('Error:', error)
      alert(`Error al guardar el evento: ${error.message || 'Error desconocido'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-8 space-y-6">
      <h2 className="text-2xl font-bold mb-6">
        {evento ? 'Editar Evento' : 'Nuevo Evento'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-2">Título *</label>
          <input
            {...register('titulo', { required: 'El título es obligatorio' })}
            className="input-field"
            placeholder="Ej: Festival de Música en Floripa"
          />
          {errors.titulo && (
            <p className="text-red-500 text-sm mt-1">{errors.titulo.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-2">Descripción *</label>
          <textarea
            {...register('descripcion', { required: 'La descripción es obligatoria' })}
            className="input-field"
            rows={4}
            placeholder="Descripción del evento..."
          />
          {errors.descripcion && (
            <p className="text-red-500 text-sm mt-1">{errors.descripcion.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Fecha Inicio *</label>
          <input
            type="date"
            {...register('fecha_inicio', { required: 'La fecha de inicio es obligatoria' })}
            className="input-field"
          />
          {errors.fecha_inicio && (
            <p className="text-red-500 text-sm mt-1">{errors.fecha_inicio.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Fecha Fin</label>
          <input
            type="date"
            {...register('fecha_fin')}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Hora Inicio</label>
          <input
            type="time"
            {...register('hora_inicio')}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Hora Fin</label>
          <input
            type="time"
            {...register('hora_fin')}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Ubicación *</label>
          <input
            {...register('localizacao', { required: 'La ubicación es obligatoria' })}
            className="input-field"
            placeholder="Ej: Praia de Jurerê"
          />
          {errors.localizacao && (
            <p className="text-red-500 text-sm mt-1">{errors.localizacao.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Ciudad</label>
          <input
            {...register('cidade')}
            className="input-field"
            defaultValue="Florianópolis"
            placeholder="Florianópolis"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-2">Link Externo</label>
          <input
            {...register('link_externo')}
            className="input-field"
            type="url"
            placeholder="https://..."
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold mb-2">Imagen</label>
          <div className="space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="input-field"
              disabled={uploading}
            />
            {uploading && <p className="text-sm text-gray-600">Subiendo imagen...</p>}
            {imagenUrl && (
              <div className="mt-3">
                <img src={imagenUrl} alt="Preview" className="max-w-full h-48 object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => setImagenUrl('')}
                  className="mt-2 text-red-600 text-sm hover:text-red-700"
                >
                  Eliminar imagen
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...register('ativo')}
              defaultChecked={evento?.ativo !== false}
              className="rounded"
            />
            <span className="text-sm font-semibold">Evento activo</span>
          </label>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Guardando...' : evento ? 'Actualizar Evento' : 'Crear Evento'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

