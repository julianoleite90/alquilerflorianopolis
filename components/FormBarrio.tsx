'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { createClient } from '@/lib/supabase/client'
import { uploadImage } from '@/lib/supabase/storage'
import { FiMapPin, FiImage, FiInfo, FiUpload, FiX, FiPlus } from 'react-icons/fi'
import type { Barrio, BarrioInsert } from '@/types/database.types'

interface FormBarrioProps {
  barrio?: Barrio
}

export default function FormBarrio({ barrio }: FormBarrioProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [coverImage, setCoverImage] = useState(barrio?.cover_image || '')
  const [highlights, setHighlights] = useState<string[]>(barrio?.highlights || [])
  const [nuevoHighlight, setNuevoHighlight] = useState('')
  const [keywords, setKeywords] = useState<string[]>(barrio?.keywords || [])
  const [nuevaKeyword, setNuevaKeyword] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<BarrioInsert>({
    defaultValues: barrio || {
      activo: true,
      orden: 0,
      keywords: [],
      highlights: [],
    } as any,
  })

  const agregarHighlight = () => {
    if (nuevoHighlight.trim()) {
      setHighlights([...highlights, nuevoHighlight.trim()])
      setNuevoHighlight('')
    }
  }

  const eliminarHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index))
  }

  const agregarKeyword = () => {
    if (nuevaKeyword.trim()) {
      setKeywords([...keywords, nuevaKeyword.trim()])
      setNuevaKeyword('')
    }
  }

  const eliminarKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const url = await uploadImage(file, 'barrios')
      setCoverImage(url)
    } catch (error: any) {
      console.error('Error al subir imagen:', error)
      alert(`Error al subir la imagen: ${error.message || 'Error desconocido'}`)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const onSubmit = async (data: any) => {
    if (!coverImage || coverImage.trim() === '') {
      alert('Debes subir una imagen de portada o agregar una URL')
      return
    }

    setLoading(true)
    try {
      const barrioData: BarrioInsert = {
        slug: data.slug.trim().toLowerCase().replace(/\s+/g, '_'),
        nombre: data.nombre.trim(),
        descripcion: data.descripcion.trim(),
        descripcion_seo: data.descripcion_seo.trim(),
        regiao: data.regiao,
        cover_image: coverImage.trim(),
        keywords,
        highlights,
        activo: typeof data.activo === 'string' 
          ? data.activo === 'true' 
          : data.activo ?? true,
        orden: parseInt(String(data.orden || 0)) || 0,
      }

      if (barrio?.id) {
        const { error } = await supabase
          .from('barrios')
          .update(barrioData)
          .eq('id', barrio.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('barrios')
          .insert([barrioData])

        if (error) throw error
      }

      router.push('/dashboard/barrios')
      router.refresh()
    } catch (error: any) {
      console.error('Error:', error)
      alert('Error al guardar el barrio: ' + (error.message || 'Error desconocido'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-6">
      {/* Sección 1: Información Básica */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary-100 rounded-lg">
            <FiMapPin className="text-primary-600 text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Información Básica</h2>
            <p className="text-sm text-gray-500">Datos principales del barrio</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nombre del Barrio *
            </label>
            <input
              {...register('nombre', { required: 'El nombre es obligatorio' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              placeholder="Ej: Canasvieiras"
            />
            {errors.nombre && (
              <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Slug (URL) *
            </label>
            <input
              {...register('slug', { required: 'El slug es obligatorio' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              placeholder="Ej: canasvieiras"
              disabled={!!barrio}
            />
            <p className="text-xs text-gray-500 mt-1">
              {barrio ? 'El slug no se puede modificar' : 'Se genera automáticamente desde el nombre (solo minúsculas y guiones bajos)'}
            </p>
            {errors.slug && (
              <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Región *
            </label>
            <select
              {...register('regiao', { required: 'La región es obligatoria' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
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
              Orden de Visualización
            </label>
            <input
              type="number"
              {...register('orden')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              placeholder="0"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              Menor número = aparece primero en la home
            </p>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descripción Corta *
            </label>
            <textarea
              {...register('descripcion', { required: 'La descripción es obligatoria' })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition resize-none"
              placeholder="Descripción breve que aparece en la tarjeta del barrio..."
            />
            {errors.descripcion && (
              <p className="text-red-500 text-sm mt-1">{errors.descripcion.message}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descripción SEO *
            </label>
            <textarea
              {...register('descripcion_seo', { required: 'La descripción SEO es obligatoria' })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition resize-none"
              placeholder="Descripción más completa para SEO y página del barrio..."
            />
            {errors.descripcion_seo && (
              <p className="text-red-500 text-sm mt-1">{errors.descripcion_seo.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Sección 2: Imagen de Portada */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-pink-100 rounded-lg">
            <FiImage className="text-pink-600 text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Imagen de Portada *</h2>
            <p className="text-sm text-gray-500">Imagen principal del barrio</p>
            <p className="text-xs text-blue-600 mt-1 font-semibold">
              📍 Use apenas imagens de praia. Pode repetir a mesma imagem para diferentes bairros.
            </p>
          </div>
        </div>
        
        {coverImage && (
          <div className="mb-6">
            <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50">
              <img
                src={coverImage}
                alt="Preview"
                className="w-full h-auto max-h-96 object-contain mx-auto"
              />
              <button
                type="button"
                onClick={() => setCoverImage('')}
                className="absolute top-4 right-4 bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-700 transition-colors shadow-lg"
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
              id="cover-upload"
              disabled={uploading}
            />
            <label
              htmlFor="cover-upload"
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
                  {coverImage ? 'Cambiar Imagen' : 'Subir Imagen'}
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
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>
        </div>
      </div>

      {/* Sección 3: Highlights y Keywords */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <FiInfo className="text-purple-600 text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Highlights y Keywords</h2>
            <p className="text-sm text-gray-500">Características destacadas y palabras clave para SEO</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Highlights (Características Destacadas)
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {highlights.map((highlight, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium border border-primary-200"
                >
                  {highlight}
                  <button
                    type="button"
                    onClick={() => eliminarHighlight(index)}
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
                value={nuevoHighlight}
                onChange={(e) => setNuevoHighlight(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    agregarHighlight()
                  }
                }}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                placeholder="Ej: Ambiente familiar"
              />
              <button
                type="button"
                onClick={agregarHighlight}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold flex items-center gap-2"
              >
                <FiPlus />
                Agregar
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Keywords (Palabras Clave para SEO)
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium border border-gray-200"
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={() => eliminarKeyword(index)}
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <FiX className="text-sm" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={nuevaKeyword}
                onChange={(e) => setNuevaKeyword(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    agregarKeyword()
                  }
                }}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                placeholder="Ej: alquiler en Canasvieiras"
              />
              <button
                type="button"
                onClick={agregarKeyword}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold flex items-center gap-2"
              >
                <FiPlus />
                Agregar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sección 4: Estado */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Estado del Barrio
          </label>
          <select
            {...register('activo', {
              setValueAs: (v) => v === 'true'
            })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
            defaultValue={barrio?.activo ? 'true' : 'false'}
          >
            <option value="true">Activo (visible en el sitio)</option>
            <option value="false">Inactivo (oculto)</option>
          </select>
          <p className="text-xs text-gray-500 mt-2">
            Solo los barrios activos se mostrarán en la página principal
          </p>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex items-center justify-between gap-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => router.push('/dashboard/barrios')}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading || !coverImage}
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
              {barrio ? 'Actualizar Barrio' : 'Crear Barrio'}
            </>
          )}
        </button>
      </div>
    </form>
  )
}

