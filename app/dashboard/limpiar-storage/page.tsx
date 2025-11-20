'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FiTrash2, FiAlertTriangle } from 'react-icons/fi'
import { getPropiedadesFromLocalStorage, getBannersFromLocalStorage } from '@/lib/supabase/local-storage-fallback'

export default function LimpiarStoragePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [propiedades, setPropiedades] = useState(getPropiedadesFromLocalStorage())
  const [banners, setBanners] = useState(getBannersFromLocalStorage())

  const calcularTamanho = () => {
    const props = JSON.stringify(propiedades)
    const banns = JSON.stringify(banners)
    const total = new Blob([props, banns]).size / 1024 / 1024
    return total.toFixed(2)
  }

  const limparTudo = () => {
    if (confirm('¿Está seguro de que desea eliminar TODOS los datos del localStorage? Esta acción no se puede deshacer.')) {
      localStorage.removeItem('aluguel_propriedades')
      localStorage.removeItem('aluguel_banners')
      alert('Datos eliminados. Redirigiendo...')
      router.push('/dashboard')
      router.refresh()
    }
  }

  const eliminarPropiedad = (id: string) => {
    if (confirm('¿Eliminar esta propiedad?')) {
      const nuevas = propiedades.filter(p => p.id !== id)
      localStorage.setItem('aluguel_propriedades', JSON.stringify(nuevas))
      setPropiedades(nuevas)
      alert('Propiedad eliminada')
    }
  }

  return (
    <div className="container-custom py-8">
      <div className="mb-6">
        <Link href="/dashboard" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
          ← Volver al Dashboard
        </Link>
        <h1 className="text-3xl font-bold mb-2">Limpiar Almacenamiento Local</h1>
        <p className="text-gray-600">
          Gestiona el almacenamiento local cuando Supabase no está disponible
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <FiAlertTriangle className="text-yellow-600 text-xl mr-3 mt-1" />
          <div>
            <h3 className="font-semibold text-yellow-800 mb-1">Tamaño actual del almacenamiento</h3>
            <p className="text-yellow-700">
              <strong>{calcularTamanho()} MB</strong> de datos almacenados
            </p>
            <p className="text-sm text-yellow-600 mt-2">
              El límite de localStorage es aproximadamente 5-10MB. Si excede este límite, no podrá guardar más datos.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Propiedades ({propiedades.length})</h2>
            <button
              onClick={limparTudo}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              <FiTrash2 className="inline mr-2" />
              Limpiar Todo
            </button>
          </div>
          
          {propiedades.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {propiedades.map((prop) => (
                <div key={prop.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-semibold">{prop.titulo}</p>
                    <p className="text-sm text-gray-600">
                      {prop.imagenes?.length || 0} imágenes • {new Date(prop.created_at || '').toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => eliminarPropiedad(prop.id)}
                    className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No hay propiedades almacenadas</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Banners ({banners.length})</h2>
          {banners.length > 0 ? (
            <div className="space-y-2">
              {banners.map((banner) => (
                <div key={banner.id} className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-semibold">{banner.titulo || 'Sin título'}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(banner.created_at || '').toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No hay banners almacenados</p>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">Recomendaciones</h3>
        <ul className="list-disc list-inside text-blue-700 space-y-1 text-sm">
          <li>Configure Supabase para usar almacenamiento en la nube y evitar límites de localStorage</li>
          <li>Elimine propiedades antiguas que ya no necesite</li>
          <li>Reduzca el número de imágenes por propiedad (máximo 10 recomendado)</li>
          <li>Use imágenes comprimidas (las imágenes se comprimen automáticamente al guardar)</li>
        </ul>
      </div>
    </div>
  )
}

