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

  // Verificar conexión al montar
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
  } = useForm<PropiedadInsert>({
    defaultValues: propiedad || {
      disponible: true,
      moneda: 'USD' as 'USD' | 'BRL',
      periodo: 'mensal',
    },
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
      // Se estiver usando localStorage, comprimir imagens primeiro
      if (useLocalStorage) {
        // Limitar número de imagens por propriedade (máx 10)
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
        // Tentar upload normal para Supabase
        const uploadPromises = Array.from(files).map(file => uploadImage(file, 'propiedades'))
        const uploadedUrls = await Promise.all(uploadPromises)
        setImagenes([...imagenes, ...uploadedUrls])
      }
    } catch (error: any) {
      console.error('Error al subir imágenes:', error)
      
      // Se falhar e estiver em localStorage, tentar comprimir
      if (useLocalStorage || error.message?.includes('Failed to fetch')) {
        try {
          console.log('Comprimindo imagens para localStorage...')
          
          // Limitar número de imagens
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
          
          // Verificar tamaño estimado
          const testData = { ...imagenes, ...compressedImages }
          const estimatedSize = estimateLocalStorageSize(testData)
          const maxSize = 2 * 1024 * 1024 // 2MB (más conservador)
          
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
        regiao: (data.regiao && data.regiao !== '') ? data.regiao : null,
        barrio: data.barrio && data.barrio !== '' ? data.barrio : null,
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

      // Si Supabase no está disponible, usar localStorage
      if (useLocalStorage || propiedad?.id?.startsWith('local-')) {
        if (propiedad?.id) {
          const updated = updatePropiedadInLocalStorage(propiedad.id, propiedadData as any)
          if (!updated) {
            throw new Error('No se encontró la propiedad para actualizar')
          }
          console.log('Propiedad actualizada en localStorage:', updated)
        } else {
          const created = savePropiedadToLocalStorage(propiedadData as any)
          console.log('Propiedad creada en localStorage:', created)
        }
      } else {
        // Usar Supabase normalmente
        if (propiedad) {
          // Actualizar
          const { error } = await supabase
            .from('propiedades')
            .update(propiedadData)
            .eq('id', propiedad.id)

          if (error) {
            console.error('Error de Supabase:', error)
            // Si falla, intentar con localStorage como fallback
            console.warn('Intentando guardar en localStorage como fallback...')
            const updated = updatePropiedadInLocalStorage(propiedad.id, propiedadData as any)
            if (updated) {
              setUseLocalStorage(true)
            } else {
              throw error
            }
          }
        } else {
          // Crear
          const { error } = await supabase
            .from('propiedades')
            .insert([propiedadData])

          if (error) {
            console.error('Error de Supabase:', error)
            // Si falla, intentar con localStorage como fallback
            console.warn('Intentando guardar en localStorage como fallback...')
            const created = savePropiedadToLocalStorage(propiedadData as any)
            console.log('Propiedad guardada en localStorage:', created)
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
        userMessage = 'La tabla "propiedades" no existe. Ejecuta la migración SQL en Supabase. Usando modo desarrollo (localStorage).'
        setUseLocalStorage(true)
      } else if (errorMessage.includes('permission denied') || errorMessage.includes('policy')) {
        userMessage = 'Error de permisos. Usando modo desarrollo (localStorage).'
        setUseLocalStorage(true)
      } else if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('Failed to fetch')) {
        userMessage = 'Supabase no disponible. Usando modo desarrollo (localStorage).'
        setUseLocalStorage(true)
      } else {
        userMessage = `Error: ${errorMessage}`
        if (useLocalStorage) {
          userMessage += '\n\nUsando modo desarrollo (localStorage).'
        }
      }
      
      alert(userMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2">Título *</label>
          <input
            {...register('titulo', { required: 'El título es obligatorio' })}
            className="input-field"
            placeholder="Ej: Hermoso departamento en Palermo"
          />
          {errors.titulo && (
            <p className="text-red-500 text-sm mt-1">{errors.titulo.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Tipo *</label>
          <select
            {...register('tipo', { required: 'El tipo es obligatorio' })}
            className="input-field"
          >
            <option value="">Seleccionar...</option>
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
          <label className="block text-sm font-semibold mb-2">Precio (USD) *</label>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600 font-semibold">USD</span>
            <input
              type="number"
              step="0.01"
              {...register('precio', { required: 'El precio es obligatorio' })}
              className="input-field flex-1"
              placeholder="0"
            />
          </div>
          {errors.precio && (
            <p className="text-red-500 text-sm mt-1">{errors.precio.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Moneda *</label>
          <select
            {...register('moneda', { required: 'La moneda es obligatoria' })}
            className="input-field"
            defaultValue={propiedad?.moneda || 'USD'}
          >
            <option value="USD">USD</option>
            <option value="BRL">BRL</option>
          </select>
          {errors.moneda && (
            <p className="text-red-500 text-sm mt-1">{errors.moneda.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Período *</label>
          <select
            {...register('periodo', { required: 'El período es obligatorio' })}
            className="input-field"
            defaultValue={propiedad?.periodo || 'mensal'}
          >
            <option value="mensal">Mensal</option>
            <option value="diaria">Diaria</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Dirección *</label>
          <input
            {...register('direccion', { required: 'La dirección es obligatoria' })}
            className="input-field"
            placeholder="Ej: Av. Beira Mar Norte, Rua das Flores..."
          />
          {errors.direccion && (
            <p className="text-red-500 text-sm mt-1">{errors.direccion.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Ciudad *</label>
          <input
            {...register('ciudad', { required: 'La ciudad es obligatoria' })}
            className="input-field"
            placeholder="Ej: Florianópolis, Jurerê, Canasvieiras..."
          />
          {errors.ciudad && (
            <p className="text-red-500 text-sm mt-1">{errors.ciudad.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Provincia *</label>
          <input
            {...register('provincia', { required: 'La provincia es obligatoria' })}
            className="input-field"
            placeholder="Ej: SC (Santa Catarina)"
          />
          {errors.provincia && (
            <p className="text-red-500 text-sm mt-1">{errors.provincia.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Código Postal</label>
          <input
            {...register('codigo_postal')}
            className="input-field"
            placeholder="Ej: C1425"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Región *</label>
          <select
            {...register('regiao', { required: 'La región es obligatoria' })}
            className="input-field"
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
          <label className="block text-sm font-semibold mb-2">Barrio *</label>
          <select
            {...register('barrio' , { required: 'El barrio es obligatorio' })}
            className="input-field"
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
          <label className="block text-sm font-semibold mb-3">Vista Previa de Ubicación</label>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2">Habitaciones</label>
          <input
            type="number"
            {...register('habitaciones')}
            className="input-field"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Baños</label>
          <input
            type="number"
            {...register('banios')}
            className="input-field"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Metros Cuadrados</label>
          <input
            type="number"
            {...register('metros_cuadrados')}
            className="input-field"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Estancia Mínima (noches)</label>
          <input
            type="number"
            {...register('estadia_minima')}
            className="input-field"
            placeholder="Ej: 3"
            min="1"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Distancia de la Playa (metros)</label>
          <input
            type="number"
            {...register('distancia_praia' as any)}
            className="input-field"
            placeholder="Ej: 200"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Disponible</label>
          <select
            {...register('disponible', { 
              setValueAs: (v) => v === 'true' 
            })}
            className="input-field"
            defaultValue={propiedad?.disponible ? 'true' : 'false'}
          >
            <option value="true">Sí</option>
            <option value="false">No</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Descripción *</label>
        <textarea
          {...register('descripcion', { required: 'La descripción es obligatoria' })}
          rows={6}
          className="input-field"
          placeholder="Describe la propiedad en detalle..."
        />
        {errors.descripcion && (
          <p className="text-red-500 text-sm mt-1">{errors.descripcion.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">
          Imágenes ({imagenes.length} {imagenes.length === 1 ? 'imagen' : 'imágenes'})
        </label>
        
        {/* Área de drag and drop */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center mb-4 transition-colors ${
            isDragging 
              ? 'border-primary-600 bg-primary-50' 
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
            <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-gray-600 mb-2">
              Arrastra y suelta imágenes aquí o
            </p>
            <label
              htmlFor="file-upload"
              className={`inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer transition-colors font-semibold ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {uploading ? 'Subiendo imágenes...' : 'Seleccionar imágenes'}
            </label>
            <p className="text-sm text-gray-500 mt-2">
              Puedes seleccionar múltiples imágenes a la vez
            </p>
          </div>
        </div>

        {/* Preview de imágenes */}
        {imagenes.length > 0 && (
          <div className="mb-4">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {imagenes.map((img, index) => (
                <div key={index} className="relative group">
                  <div className="relative aspect-square">
                    <img
                      src={img}
                      alt={`Imagen ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                    />
                    <div className="absolute top-0 left-0 bg-black/50 text-white text-xs px-2 py-1 rounded-br-lg">
                      {index + 1}
                    </div>
                    <button
                      type="button"
                      onClick={() => eliminarImagen(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-700"
                      title="Eliminar imagen"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Agregar URL manualmente */}
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="https://ejemplo.com/imagen.jpg"
            className="input-field flex-1"
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
            onClick={() => {
              const input = document.querySelector('input[placeholder*="ejemplo.com"]') as HTMLInputElement
              if (input) {
                agregarImagen(input.value)
                input.value = ''
              }
            }}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Agregar URL
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Características</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {caracteristicas.map((car, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
            >
              {car}
              <button
                type="button"
                onClick={() => eliminarCaracteristica(index)}
                className="ml-2 text-primary-700 hover:text-primary-900"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex space-x-2">
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
            className="input-field flex-1"
            placeholder="Ej: Cocina integrada, Balcón, Garage..."
          />
          <button
            type="button"
            onClick={agregarCaracteristica}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Agregar
          </button>
        </div>
      </div>

      <div className="flex space-x-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary disabled:opacity-50"
        >
          {loading ? 'Guardando...' : propiedad ? 'Actualizar' : 'Crear'} Propiedad
        </button>
        <button
          type="button"
          onClick={() => router.push('/dashboard')}
          className="btn-secondary"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

