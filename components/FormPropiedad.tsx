'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { createClient } from '@/lib/supabase/client'
import { uploadImage } from '@/lib/supabase/storage'
import { testSupabaseConnection } from '@/lib/supabase/test-connection'
import { compressImage, estimateLocalStorageSize } from '@/lib/image-compression'
import { 
  savePropiedadToLocalStorage, 
  updatePropiedadInLocalStorage 
} from '@/lib/supabase/local-storage-fallback'
import GoogleMap from '@/components/GoogleMap'
import { BARRIOS } from '@/data/barrios'
import { FiHome, FiMapPin, FiDollarSign, FiImage, FiInfo, FiX, FiUpload, FiPlus } from 'react-icons/fi'
import type { Propiedad, PropiedadInsert } from '@/types/database.types'

interface FormPropiedadProps {
  propiedad?: Propiedad
}

export default function FormPropiedad({ propiedad }: FormPropiedadProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [useLocalStorage, setUseLocalStorage] = useState(false)
  const [imagenes, setImagenes] = useState<string[]>(propiedad?.imagenes || [])
  const [caracteristicas, setCaracteristicas] = useState<string[]>(propiedad?.caracteristicas || [])
  const [nuevaCaracteristica, setNuevaCaracteristica] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isProduction = process.env.NODE_ENV === 'production'

  // Verificar conexión al montar
  useEffect(() => {
    if (isProduction) {
      setUseLocalStorage(false)
      return
    }
    testSupabaseConnection().then((result) => {
      if (!result.success) {
        setUseLocalStorage(true)
      }
    }).catch(() => {
      if (!isProduction) {
        setUseLocalStorage(true)
      }
    })
  }, [isProduction])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PropiedadInsert>({
    defaultValues: (propiedad ? {
      ...propiedad,
      moneda: propiedad.moneda || 'USD',
    } : {
      disponible: true,
      moneda: 'USD',
      periodo: 'mensal',
    }) as PropiedadInsert,
  })

  // Watch para atualizar o mapa quando o endereço mudar
  const direccion = watch('direccion')
  const ciudad = watch('ciudad')
  const provincia = watch('provincia')

  useEffect(() => {
    if (propiedad) {
      Object.keys(propiedad).forEach((key) => {
        setValue(key as keyof PropiedadInsert, propiedad[key as keyof Propiedad] as any)
      })
    }
  }, [propiedad, setValue])

  const agregarCaracteristica = () => {
    if (nuevaCaracteristica.trim()) {
      setCaracteristicas([...caracteristicas, nuevaCaracteristica.trim()])
      setNuevaCaracteristica('')
    }
  }

  const eliminarCaracteristica = (index: number) => {
    setCaracteristicas(caracteristicas.filter((_, i) => i !== index))
  }

  const agregarImagen = (url: string) => {
    if (url.trim()) {
      setImagenes([...imagenes, url.trim()])
    }
  }

  const eliminarImagen = (index: number) => {
    setImagenes(imagenes.filter((_, i) => i !== index))
  }

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      if (useLocalStorage) {
        const maxImages = 10
        const currentCount = imagenes.length
        const remainingSlots = maxImages - currentCount
        
        if (remainingSlots <= 0) {
          alert(`Máximo de ${maxImages} imágenes por propiedad. Elimine algunas imágenes antes de agregar más.`)
          return
        }
        
        const filesToProcess = Array.from(files).slice(0, remainingSlots)
        if (files.length > remainingSlots) {
          alert(`Solo se agregarán las primeras ${remainingSlots} imágenes. Máximo de ${maxImages} imágenes por propiedad.`)
        }
        
        const compressedPromises = filesToProcess.map(file => compressImage(file, 800, 0.4))
        const compressedImages = await Promise.all(compressedPromises)
        setImagenes([...imagenes, ...compressedImages])
      } else {
        const uploadPromises = Array.from(files).map(file => uploadImage(file, 'propiedades'))
        const uploadedUrls = await Promise.all(uploadPromises)
        setImagenes([...imagenes, ...uploadedUrls])
      }
    } catch (error: any) {
      console.error('Error al subir imágenes:', error)
      
      if (useLocalStorage || error.message?.includes('Failed to fetch')) {
        try {
          const maxImages = 10
          const currentCount = imagenes.length
          const remainingSlots = maxImages - currentCount
          
          if (remainingSlots <= 0) {
            alert(`Máximo de ${maxImages} imágenes por propiedad. Elimine algunas imágenes antes de agregar más.`)
            return
          }
          
          const filesToProcess = Array.from(files).slice(0, remainingSlots)
          if (files.length > remainingSlots) {
            alert(`Solo se agregarán las primeras ${remainingSlots} imágenes. Máximo de ${maxImages} imágenes por propiedad.`)
          }
          
          const compressedPromises = filesToProcess.map(file => compressImage(file, 600, 0.35))
          const compressedImages = await Promise.all(compressedPromises)
          
          const testData = { ...imagenes, ...compressedImages }
          const estimatedSize = estimateLocalStorageSize(testData)
          const maxSize = 2 * 1024 * 1024
          
          if (estimatedSize > maxSize) {
            alert(`Las imágenes son demasiado grandes (${(estimatedSize / 1024 / 1024).toFixed(2)}MB). Por favor, reduzca el número de imágenes o elimine algunas propiedades antiguas del localStorage.`)
            return
          }
          
          setImagenes([...imagenes, ...compressedImages])
        } catch (compressError: any) {
          alert(`Error al procesar las imágenes: ${compressError.message || 'Error desconocido'}`)
        }
      } else {
        alert(`Error al subir las imágenes: ${error.message || 'Error desconocido'}. En desarrollo local, se usará base64 como alternativa.`)
      }
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await handleFileUpload(e.target.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      await handleFileUpload(files)
    }
  }

  const onSubmit = async (data: PropiedadInsert) => {
    setLoading(true)
    try {
      const propiedadData = {
        ...data,
        moneda: (data.moneda || 'USD') as 'USD' | 'BRL',
        regiao: data.regiao || null,
        barrio: data.barrio || null,
        imagenes,
        caracteristicas,
        precio: parseFloat(data.precio as any),
        habitaciones: data.habitaciones ? parseInt(data.habitaciones as any) : null,
        banios: data.banios ? parseInt(data.banios as any) : null,
        metros_cuadrados: data.metros_cuadrados ? parseInt(data.metros_cuadrados as any) : null,
        estadia_minima: (data as any).estadia_minima ? parseInt((data as any).estadia_minima) : null,
        distancia_praia: (data as any).distancia_praia ? parseInt((data as any).distancia_praia) : null,
        disponible: typeof data.disponible === 'string' 
          ? data.disponible === 'true' 
          : data.disponible ?? true,
      }

      if (useLocalStorage || propiedad?.id?.startsWith('local-')) {
        if (propiedad?.id) {
          const updated = updatePropiedadInLocalStorage(propiedad.id, propiedadData as any)
          if (!updated) {
            throw new Error('No se encontró la propiedad para actualizar')
          }
        } else {
          savePropiedadToLocalStorage(propiedadData as any)
        }
      } else {
        if (propiedad) {
          const { error } = await supabase
            .from('propiedades')
            .update(propiedadData)
            .eq('id', propiedad.id)

          if (error) {
            console.error('Error de Supabase:', error)
            const updated = updatePropiedadInLocalStorage(propiedad.id, propiedadData as any)
            if (updated) {
              setUseLocalStorage(true)
            } else {
              throw error
            }
          }
        } else {
          const { error } = await supabase
            .from('propiedades')
            .insert([propiedadData])

          if (error) {
            console.error('Error de Supabase:', error)
            savePropiedadToLocalStorage(propiedadData as any)
            setUseLocalStorage(true)
          }
        }
      }

      router.push('/dashboard')
      router.refresh()
    } catch (error: any) {
      console.error('Error:', error)
      const errorMessage = error?.message || 'Error desconocido'
      
      let userMessage = 'Error al guardar la propiedad'
      
      if (errorMessage.includes('exceeded the quota') || errorMessage.includes('excede el límite') || errorMessage.includes('almacenamiento local está lleno')) {
        userMessage = `⚠️ El almacenamiento local está lleno (${errorMessage}).\n\nSugerencias:\n- Elimine algunas propiedades o imágenes antiguas\n- Reduzca el número de imágenes por propiedad\n- Configure Supabase para usar almacenamiento en la nube\n- Use imágenes más pequeñas o comprimidas`
        setUseLocalStorage(true)
      } else if (errorMessage.includes('relation') && errorMessage.includes('does not exist')) {
        if (isProduction) {
          userMessage = 'La tabla "propiedades" no existe. Ejecuta la migración SQL en Supabase.'
        } else {
          userMessage = 'La tabla "propiedades" no existe. Ejecuta la migración SQL en Supabase. Usando modo desarrollo (localStorage).'
          setUseLocalStorage(true)
        }
      } else if (errorMessage.includes('permission denied') || errorMessage.includes('policy')) {
        if (isProduction) {
          userMessage = 'Error de permisos. Verifique as políticas RLS no Supabase.'
        } else {
          userMessage = 'Error de permisos. Usando modo desarrollo (localStorage).'
          setUseLocalStorage(true)
        }
      } else if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('Failed to fetch')) {
        if (isProduction) {
          userMessage = 'Error de conexión con Supabase. Verifique as variáveis de ambiente no Vercel.'
        } else {
          userMessage = 'Supabase no disponible. Usando modo desarrollo (localStorage).'
          setUseLocalStorage(true)
        }
      } else {
        userMessage = `Error: ${errorMessage}`
        if (useLocalStorage && !isProduction) {
          userMessage += '\n\nUsando modo desarrollo (localStorage).'
        }
      }
      
      alert(userMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-5xl mx-auto space-y-6">
      {/* Sección 1: Información Básica */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary-100 rounded-lg">
            <FiHome className="text-primary-600 text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Información Básica</h2>
            <p className="text-sm text-gray-500">Datos principales de la propiedad</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Título de la Propiedad *
            </label>
            <input
              {...register('titulo', { required: 'El título es obligatorio' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              placeholder="Ej: Hermoso departamento en Canasvieiras con vista al mar"
            />
            {errors.titulo && (
              <p className="text-red-500 text-sm mt-1">{errors.titulo.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tipo de Propiedad *
            </label>
            <select
              {...register('tipo', { required: 'El tipo es obligatorio' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
            >
              <option value="">Seleccionar tipo...</option>
              <option value="casa">Casa</option>
              <option value="departamento">Departamento</option>
              <option value="local">Local</option>
              <option value="oficina">Oficina</option>
              <option value="terreno">Terreno</option>
            </select>
            {errors.tipo && (
              <p className="text-red-500 text-sm mt-1">{errors.tipo.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              {...register('descripcion', { required: 'La descripción es obligatoria' })}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition resize-none"
              placeholder="Describe la propiedad en detalle..."
            />
            {errors.descripcion && (
              <p className="text-red-500 text-sm mt-1">{errors.descripcion.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Sección 2: Precio y Disponibilidad */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <FiDollarSign className="text-green-600 text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Precio y Disponibilidad</h2>
            <p className="text-sm text-gray-500">Información de tarifas y estado</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Moneda *
            </label>
            <select
              {...register('moneda', { required: 'La moneda es obligatoria' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              defaultValue={propiedad?.moneda || 'USD'}
            >
              <option value="USD">USD</option>
              <option value="BRL">BRL</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Precio *
            </label>
            <input
              type="number"
              step="0.01"
              {...register('precio', { required: 'El precio es obligatorio' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              placeholder="0.00"
            />
            {errors.precio && (
              <p className="text-red-500 text-sm mt-1">{errors.precio.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Período *
            </label>
            <select
              {...register('periodo', { required: 'El período es obligatorio' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              defaultValue={propiedad?.periodo || 'mensal'}
            >
              <option value="mensal">Mensual</option>
              <option value="diaria">Diaria</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Estado *
            </label>
            <select
              {...register('disponible', { 
                setValueAs: (v) => v === 'true' 
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              defaultValue={propiedad?.disponible ? 'true' : 'false'}
            >
              <option value="true">Disponible</option>
              <option value="false">No Disponible</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sección 3: Ubicación */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FiMapPin className="text-blue-600 text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Ubicación</h2>
            <p className="text-sm text-gray-500">Dirección y zona de la propiedad</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Dirección *
            </label>
            <input
              {...register('direccion', { required: 'La dirección es obligatoria' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              placeholder="Ej: Rua das Palmeiras, 123"
            />
            {errors.direccion && (
              <p className="text-red-500 text-sm mt-1">{errors.direccion.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ciudad / Barrio *
            </label>
            <input
              {...register('ciudad', { required: 'La ciudad es obligatoria' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              placeholder="Ej: Canasvieiras, Jurerê Internacional..."
            />
            {errors.ciudad && (
              <p className="text-red-500 text-sm mt-1">{errors.ciudad.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Provincia *
            </label>
            <input
              {...register('provincia', { required: 'La provincia es obligatoria' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              placeholder="Ej: Santa Catarina"
              defaultValue="Santa Catarina"
            />
            {errors.provincia && (
              <p className="text-red-500 text-sm mt-1">{errors.provincia.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Código Postal
            </label>
            <input
              {...register('codigo_postal')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              placeholder="Ej: 88054-000"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Región *
            </label>
            <select
              {...register('regiao', { required: 'La región es obligatoria' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              defaultValue={propiedad?.regiao || ''}
            >
              <option value="">Seleccionar región...</option>
              <option value="norte_da_ilha">Norte de la Isla</option>
              <option value="sul_da_ilha">Sur de la Isla</option>
              <option value="centro">Centro</option>
              <option value="continente">Continente</option>
            </select>
            {errors.regiao && (
              <p className="text-red-500 text-sm mt-1">{errors.regiao.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Barrio *
            </label>
            <select
              {...register('barrio', { required: 'El barrio es obligatorio' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              defaultValue={propiedad?.barrio || ''}
            >
              <option value="">Seleccionar barrio...</option>
              {BARRIOS.map((barrio) => (
                <option key={barrio.slug} value={barrio.slug}>{barrio.nombre}</option>
              ))}
            </select>
            {errors?.barrio && (
              <p className="text-red-500 text-sm mt-1">{errors.barrio.message as string}</p>
            )}
          </div>
        </div>

        {/* Mapa de Preview */}
        {direccion && ciudad && provincia && (
          <div className="mt-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Vista Previa de Ubicación
            </label>
            <GoogleMap
              direccion={direccion}
              ciudad={ciudad}
              provincia={provincia}
              height="300px"
            />
            <p className="text-xs text-gray-500 mt-2">
              Verifica que la ubicación en el mapa sea correcta
            </p>
          </div>
        )}
      </div>

      {/* Sección 4: Características */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <FiInfo className="text-purple-600 text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Características</h2>
            <p className="text-sm text-gray-500">Detalles y especificaciones de la propiedad</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Habitaciones
            </label>
            <input
              type="number"
              {...register('habitaciones')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              placeholder="0"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Baños
            </label>
            <input
              type="number"
              {...register('banios')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              placeholder="0"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Metros Cuadrados
            </label>
            <input
              type="number"
              {...register('metros_cuadrados')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              placeholder="0"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Estancia Mínima (noches)
            </label>
            <input
              type="number"
              {...register('estadia_minima')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              placeholder="Ej: 7"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Distancia de la Playa (metros)
            </label>
            <input
              type="number"
              {...register('distancia_praia' as any)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              placeholder="Ej: 200"
              min="0"
            />
          </div>
        </div>

        {/* Características adicionales */}
        <div className="mt-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Características Adicionales
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {caracteristicas.map((car, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium border border-primary-200"
              >
                {car}
                <button
                  type="button"
                  onClick={() => eliminarCaracteristica(index)}
                  className="text-primary-600 hover:text-primary-800 transition-colors"
                >
                  <FiX className="text-sm" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={nuevaCaracteristica}
              onChange={(e) => setNuevaCaracteristica(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  agregarCaracteristica()
                }
              }}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              placeholder="Ej: Cocina integrada, Balcón, Garage, WiFi..."
            />
            <button
              type="button"
              onClick={agregarCaracteristica}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold flex items-center gap-2"
            >
              <FiPlus />
              Agregar
            </button>
          </div>
        </div>
      </div>

      {/* Sección 5: Imágenes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-pink-100 rounded-lg">
            <FiImage className="text-pink-600 text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Imágenes</h2>
            <p className="text-sm text-gray-500">
              {imagenes.length} {imagenes.length === 1 ? 'imagen' : 'imágenes'} agregada{imagenes.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        
        {/* Área de drag and drop */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-12 text-center mb-6 transition-all ${
            isDragging 
              ? 'border-primary-500 bg-primary-50 scale-[1.02]' 
              : 'border-gray-300 hover:border-primary-400 bg-gray-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
            id="file-upload"
            disabled={uploading}
          />
          <div className="flex flex-col items-center">
            <FiUpload className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4 font-medium">
              Arrastra y suelta imágenes aquí o
            </p>
            <label
              htmlFor="file-upload"
              className={`inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer transition-colors font-semibold shadow-lg ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {uploading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Subiendo imágenes...
                </>
              ) : (
                <>
                  <FiUpload />
                  Seleccionar imágenes
                </>
              )}
            </label>
            <p className="text-sm text-gray-500 mt-3">
              Puedes seleccionar múltiples imágenes a la vez (máximo 10)
            </p>
          </div>
        </div>

        {/* Preview de imágenes */}
        {imagenes.length > 0 && (
          <div className="mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {imagenes.map((img, index) => (
                <div key={index} className="relative group">
                  <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={img}
                      alt={`Imagen ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded font-semibold">
                      {index + 1}
                    </div>
                    <button
                      type="button"
                      onClick={() => eliminarImagen(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-700"
                      title="Eliminar imagen"
                    >
                      <FiX />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Agregar URL manualmente */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="https://ejemplo.com/imagen.jpg"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                agregarImagen(e.currentTarget.value)
                e.currentTarget.value = ''
              }
            }}
          />
          <button
            type="button"
            onClick={(e) => {
              const input = e.currentTarget.previousElementSibling as HTMLInputElement
              if (input) {
                agregarImagen(input.value)
                input.value = ''
              }
            }}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
          >
            Agregar URL
          </button>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex items-center justify-between gap-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
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
              {propiedad ? 'Actualizar Propiedad' : 'Crear Propiedad'}
            </>
          )}
        </button>
      </div>
    </form>
  )
}
