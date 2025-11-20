'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { createClient } from '@/lib/supabase/client'
import { uploadImage } from '@/lib/supabase/storage'
import { testSupabaseConnection } from '@/lib/supabase/test-connection'
import { 
  saveBannerToLocalStorage, 
  updateBannerInLocalStorage,
  type BannerLocal 
} from '@/lib/supabase/local-storage-fallback'

interface Banner {
  id?: string
  titulo?: string | null
  descripcion?: string | null
  imagen_url: string
  enlace?: string | null
  orden?: number
  activo?: boolean
}

interface FormBannerProps {
  banner?: Banner
}

export default function FormBanner({ banner }: FormBannerProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imagenUrl, setImagenUrl] = useState(banner?.imagen_url || '')
  const [connectionStatus, setConnectionStatus] = useState<string>('')
  const [useLocalStorage, setUseLocalStorage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Testear conexión al montar el componente
  useEffect(() => {
    testSupabaseConnection().then((result) => {
      if (!result.success) {
        // Solo mostrar aviso si no es un error esperado de desarrollo
        if (!result.message.includes('does not exist')) {
          setConnectionStatus(`⚠️ Modo desarrollo: usando localStorage. Para producción, inicia Supabase.`)
        }
        setUseLocalStorage(true)
      }
    }).catch(() => {
      // Si falla la conexión, usar localStorage silenciosamente
      setUseLocalStorage(true)
    })
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: banner || {
      activo: true,
      orden: 0,
    },
  })

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const url = await uploadImage(file, 'banners')
      setImagenUrl(url)
    } catch (error: any) {
      console.error('Error al subir imagen:', error)
      // En desarrollo, se usará base64 como fallback automáticamente
      if (error.message?.includes('No se pudo procesar')) {
        alert('Error al procesar la imagen. Por favor, use una URL manualmente.')
      } else {
        alert(`Error al subir la imagen: ${error.message || 'Error desconocido'}. En desarrollo local, se usará base64 como alternativa.`)
      }
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const onSubmit = async (data: any) => {
    if (!imagenUrl || imagenUrl.trim() === '') {
      alert('Debes subir una imagen o agregar una URL')
      return
    }

    setLoading(true)
    try {
      // Limpiar datos vacíos
      const bannerData: any = {
        imagen_url: imagenUrl.trim(),
        orden: parseInt(String(data.orden || 0)) || 0,
        activo: typeof data.activo === 'string' 
          ? data.activo === 'true' 
          : data.activo ?? true,
      }

      // Agregar campos opcionales solo si tienen valor
      if (data.titulo && data.titulo.trim()) {
        bannerData.titulo = data.titulo.trim()
      }
      if (data.descripcion && data.descripcion.trim()) {
        bannerData.descripcion = data.descripcion.trim()
      }
      if (data.enlace && data.enlace.trim()) {
        bannerData.enlace = data.enlace.trim()
      }

      console.log('Datos a guardar:', bannerData)

      // Si Supabase no está disponible, usar localStorage
      if (useLocalStorage) {
        if (banner?.id) {
          const updated = updateBannerInLocalStorage(banner.id, bannerData)
          if (!updated) {
            throw new Error('No se encontró el banner para actualizar')
          }
          console.log('Banner actualizado en localStorage:', updated)
        } else {
          const created = saveBannerToLocalStorage(bannerData)
          console.log('Banner creado en localStorage:', created)
        }
      } else {
        // Usar Supabase normalmente
        if (banner?.id) {
          // Actualizar
          const { data: updatedData, error } = await supabase
            .from('banners')
            .update(bannerData)
            .eq('id', banner.id)
            .select()

          if (error) {
            console.error('Error de Supabase:', error)
            throw error
          }
          console.log('Banner actualizado:', updatedData)
        } else {
          // Crear
          const { data: insertedData, error } = await supabase
            .from('banners')
            .insert([bannerData])
            .select()

          if (error) {
            console.error('Error de Supabase:', error)
            // Si falla, intentar con localStorage como fallback
            console.warn('Intentando guardar en localStorage como fallback...')
            const created = saveBannerToLocalStorage(bannerData)
            console.log('Banner guardado en localStorage:', created)
            setUseLocalStorage(true)
            setConnectionStatus('⚠️ Supabase no disponible. Usando modo desarrollo (localStorage).')
          } else {
            console.log('Banner creado:', insertedData)
          }
        }
      }

      // Disparar evento para actualizar banners en la home
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('storage'))
      }
      
      router.push('/dashboard/banners')
      router.refresh()
    } catch (error: any) {
      console.error('Error completo:', error)
      const errorMessage = error?.message || 'Error desconocido'
      const errorDetails = error?.details || error?.hint || error?.code || ''
      
      let userMessage = 'Error al guardar el banner'
      
      if (errorMessage.includes('relation') && errorMessage.includes('does not exist')) {
        userMessage = 'La tabla "banners" no existe. Ejecuta la migración SQL en Supabase (migrations_banners_dev.sql para desarrollo).'
      } else if (errorMessage.includes('permission denied') || errorMessage.includes('policy') || errorMessage.includes('RLS')) {
        userMessage = 'Error de permisos. Ejecuta migrations_banners_dev.sql para deshabilitar RLS en desarrollo.'
      } else if (errorMessage.includes('null value') || errorMessage.includes('violates not-null')) {
        userMessage = 'Faltan campos requeridos. La imagen es obligatoria.'
      } else if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('Failed to fetch') || errorMessage.includes('ECONNREFUSED')) {
        userMessage = 'Supabase no está corriendo.\n\nPara desarrollo local:\n1. Ejecuta: supabase start\n2. Verifica INICIAR_SUPABASE.md\n\nO usa Supabase en la nube y actualiza .env.local con tus credenciales.'
      } else if (error?.code === 'PGRST116' || errorMessage.includes('relation') || errorMessage.includes('does not exist')) {
        userMessage = 'La tabla "banners" no existe. Ejecuta migrations_banners_dev.sql en el SQL Editor de Supabase.'
      } else {
        userMessage = `Error: ${errorMessage}${errorDetails ? ` (${errorDetails})` : ''}`
      }
      
      alert(userMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-8 space-y-6">
      {connectionStatus && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-blue-800">{connectionStatus}</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2">Título</label>
          <input
            {...register('titulo')}
            className="input-field"
            placeholder="Título del banner (opcional)"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Orden</label>
          <input
            type="number"
            {...register('orden')}
            className="input-field"
            placeholder="0"
          />
          <p className="text-xs text-gray-500 mt-1">Los banners se muestran en orden ascendente</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Descripción</label>
        <textarea
          {...register('descripcion')}
          rows={3}
          className="input-field"
          placeholder="Descripción del banner (opcional)"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Imagen *</label>
        
        {imagenUrl && (
          <div className="mb-4">
            <img
              src={imagenUrl}
              alt="Preview"
              className="w-full h-64 object-cover rounded-lg mb-2"
            />
            <button
              type="button"
              onClick={() => setImagenUrl('')}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Eliminar imagen
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
          id="banner-upload"
          disabled={uploading}
        />
        <label
          htmlFor="banner-upload"
          className={`inline-block px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {uploading ? 'Subiendo...' : imagenUrl ? 'Cambiar Imagen' : 'Subir Imagen'}
        </label>
        <p className="text-xs text-gray-500 mt-1">O puedes agregar una URL</p>
        
        <input
          type="text"
          value={imagenUrl}
          onChange={(e) => setImagenUrl(e.target.value)}
          className="input-field mt-2"
          placeholder="https://ejemplo.com/imagen.jpg"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Enlace (opcional)</label>
        <input
          {...register('enlace')}
          type="url"
          className="input-field"
          placeholder="https://ejemplo.com"
        />
        <p className="text-xs text-gray-500 mt-1">URL a la que redirigirá el banner al hacer clic</p>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Estado</label>
        <select
          {...register('activo', {
            setValueAs: (v) => v === 'true'
          })}
          className="input-field"
          defaultValue={banner?.activo ? 'true' : 'false'}
        >
          <option value="true">Activo</option>
          <option value="false">Inactivo</option>
        </select>
      </div>

      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          disabled={loading || !imagenUrl}
          className="btn-primary disabled:opacity-50"
        >
          {loading ? 'Guardando...' : banner ? 'Actualizar' : 'Crear'} Banner
        </button>
        <button
          type="button"
          onClick={() => router.push('/dashboard/banners')}
          className="btn-secondary"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

