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
import { FiImage, FiLink, FiSettings, FiUpload, FiX } from 'react-icons/fi'

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

  const isProduction = process.env.NODE_ENV === 'production'

  // Testear conexión al montar el componente
  useEffect(() => {
    if (isProduction) {
      setUseLocalStorage(false)
      // Em produção, testar conexão com Supabase
      const testConnection = async () => {
        try {
          const { data, error } = await supabase
            .from('banners')
            .select('id')
            .limit(1)
          
          if (error) {
            console.error('Error de conexión con Supabase:', error)
            if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
              setConnectionStatus('❌ La tabla "banners" no existe. Ejecuta setup-database.sql en Supabase.')
            } else if (error.code === '42501' || error.message?.includes('permission denied')) {
              setConnectionStatus('❌ Error de permisos. Verifica las políticas RLS en Supabase.')
            }
          }
        } catch (err) {
          console.error('Error al testar conexión:', err)
        }
      }
      testConnection()
      return
    }

    testSupabaseConnection().then((result) => {
      if (!result.success) {
        if (!result.message.includes('does not exist')) {
          setConnectionStatus(`⚠️ Modo desarrollo: usando localStorage. Para producción, inicia Supabase.`)
        }
        setUseLocalStorage(true)
      }
    }).catch(() => {
      if (!isProduction) {
        setUseLocalStorage(true)
      }
    })
  }, [isProduction, supabase])

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
      const bannerData: any = {
        imagen_url: imagenUrl.trim(),
        orden: parseInt(String(data.orden || 0)) || 0,
        activo: typeof data.activo === 'string' 
          ? data.activo === 'true' 
          : data.activo ?? true,
      }

      if (data.titulo && data.titulo.trim()) {
        bannerData.titulo = data.titulo.trim()
      }
      if (data.descripcion && data.descripcion.trim()) {
        bannerData.descripcion = data.descripcion.trim()
      }
      if (data.enlace && data.enlace.trim()) {
        bannerData.enlace = data.enlace.trim()
      }

      // Em produção, sempre tentar Supabase primeiro
      if (isProduction || !useLocalStorage) {
        if (banner?.id) {
          // Actualizar banner existente
          const { data: updatedData, error } = await supabase
            .from('banners')
            .update(bannerData)
            .eq('id', banner.id)
            .select()

          if (error) {
            console.error('Error de Supabase al actualizar:', error)
            // Em produção, mostrar erro claro
            if (isProduction) {
              throw new Error(`Error al actualizar el banner: ${error.message || 'Error desconocido'}`)
            }
            // Em desenvolvimento, tentar localStorage como fallback
            const updated = updateBannerInLocalStorage(banner.id, bannerData)
            if (!updated) {
              throw new Error('No se encontró el banner para actualizar')
            }
            setUseLocalStorage(true)
          } else {
            console.log('Banner actualizado exitosamente:', updatedData)
          }
        } else {
          // Crear nuevo banner
          const { data: insertedData, error } = await supabase
            .from('banners')
            .insert([bannerData])
            .select()

          if (error) {
            console.error('Error de Supabase al crear:', error)
            // Em produção, mostrar erro claro
            if (isProduction) {
              throw new Error(`Error al crear el banner: ${error.message || 'Error desconocido'}. Verifique las políticas RLS en Supabase.`)
            }
            // Em desenvolvimento, tentar localStorage como fallback
            saveBannerToLocalStorage(bannerData)
            setUseLocalStorage(true)
            setConnectionStatus('⚠️ Supabase no disponible. Usando modo desarrollo (localStorage).')
          } else {
            console.log('Banner creado exitosamente:', insertedData)
          }
        }
      } else {
        // Usar localStorage apenas em desenvolvimento
        if (banner?.id) {
          const updated = updateBannerInLocalStorage(banner.id, bannerData)
          if (!updated) {
            throw new Error('No se encontró el banner para actualizar')
          }
        } else {
          saveBannerToLocalStorage(bannerData)
        }
      }

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
        userMessage = '❌ La tabla "banners" no existe en Supabase.\n\nEjecuta el script SQL en Supabase:\n1. Ve a SQL Editor en tu proyecto Supabase\n2. Ejecuta: lib/supabase/setup-database.sql\n\nO ejecuta solo la parte de banners.'
      } else if (errorMessage.includes('permission denied') || errorMessage.includes('policy') || errorMessage.includes('RLS')) {
        userMessage = '❌ Error de permisos (RLS).\n\nNecesitas configurar las políticas RLS en Supabase:\n1. Ve a Authentication > Policies\n2. Crea una política que permita INSERT/UPDATE para usuarios autenticados\n3. O desactiva RLS temporalmente para la tabla banners (solo desarrollo)'
      } else if (errorMessage.includes('null value') || errorMessage.includes('violates not-null')) {
        userMessage = '❌ Faltan campos requeridos. La imagen es obligatoria.'
      } else if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('Failed to fetch') || errorMessage.includes('ECONNREFUSED')) {
        if (isProduction) {
          userMessage = '❌ Error de conexión con Supabase.\n\nVerifica:\n1. Las variables de entorno en Vercel\n2. NEXT_PUBLIC_SUPABASE_URL\n3. NEXT_PUBLIC_SUPABASE_ANON_KEY'
        } else {
          userMessage = 'Supabase no está corriendo.\n\nPara desarrollo local:\n1. Ejecuta: supabase start\n2. Verifica INICIAR_SUPABASE.md\n\nO usa Supabase en la nube y actualiza .env.local con tus credenciales.'
        }
      } else {
        userMessage = `❌ Error: ${errorMessage}${errorDetails ? `\n\nDetalles: ${errorDetails}` : ''}\n\nCódigo: ${error?.code || 'N/A'}`
      }
      
      alert(userMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-6">
      {connectionStatus && !isProduction && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">{connectionStatus}</p>
        </div>
      )}

      {/* Sección 1: Información General */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary-100 rounded-lg">
            <FiImage className="text-primary-600 text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Información General</h2>
            <p className="text-sm text-gray-500">Datos básicos del banner</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Título
            </label>
            <input
              {...register('titulo')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              placeholder="Título del banner (opcional)"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Orden de Visualización
            </label>
            <input
              type="number"
              {...register('orden')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              placeholder="0"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-2">
              Los banners se muestran en orden ascendente (menor número = aparece primero)
            </p>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            {...register('descripcion')}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition resize-none"
            placeholder="Descripción del banner (opcional)"
          />
        </div>
      </div>

      {/* Sección 2: Imagen */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-pink-100 rounded-lg">
            <FiImage className="text-pink-600 text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Imagen del Banner *</h2>
            <p className="text-sm text-gray-500">Sube una imagen o ingresa una URL</p>
          </div>
        </div>
        
        {imagenUrl && (
          <div className="mb-6">
            <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50">
              <img
                src={imagenUrl}
                alt="Preview del banner"
                className="w-full h-auto max-h-96 object-contain mx-auto"
              />
              <button
                type="button"
                onClick={() => setImagenUrl('')}
                className="absolute top-4 right-4 bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-700 transition-colors shadow-lg"
                title="Eliminar imagen"
              >
                <FiX />
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
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
              className={`inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer transition-colors font-semibold shadow-lg ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {uploading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Subiendo...
                </>
              ) : (
                <>
                  <FiUpload />
                  {imagenUrl ? 'Cambiar Imagen' : 'Subir Imagen'}
                </>
              )}
            </label>
            <p className="text-xs text-gray-500 mt-2">
              O ingresa una URL de imagen manualmente
            </p>
          </div>
          
          <div>
            <input
              type="text"
              value={imagenUrl}
              onChange={(e) => setImagenUrl(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>
        </div>
      </div>

      {/* Sección 3: Configuración */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <FiSettings className="text-purple-600 text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Configuración</h2>
            <p className="text-sm text-gray-500">Enlace y estado del banner</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FiLink className="inline mr-2" />
              Enlace (opcional)
            </label>
            <input
              {...register('enlace')}
              type="url"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              placeholder="https://ejemplo.com"
            />
            <p className="text-xs text-gray-500 mt-2">
              URL a la que redirigirá el banner al hacer clic
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Estado del Banner
            </label>
            <select
              {...register('activo', {
                setValueAs: (v) => v === 'true'
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              defaultValue={banner?.activo ? 'true' : 'false'}
            >
              <option value="true">Activo (visible en el sitio)</option>
              <option value="false">Inactivo (oculto)</option>
            </select>
            <p className="text-xs text-gray-500 mt-2">
              Solo los banners activos se mostrarán en la página principal
            </p>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex items-center justify-between gap-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => router.push('/dashboard/banners')}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading || !imagenUrl}
          className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Guardando...
            </>
          ) : (
            <>
              {banner ? 'Actualizar Banner' : 'Crear Banner'}
            </>
          )}
        </button>
      </div>
    </form>
  )
}
