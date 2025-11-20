'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FiPlus } from 'react-icons/fi'
import PropiedadDashboardCard from '@/components/PropiedadDashboardCard'
import { getPropiedadesFromLocalStorage } from '@/lib/supabase/local-storage-fallback'
import { createClient } from '@/lib/supabase/client'
import type { Propiedad } from '@/types/database.types'

export default function DashboardClient({ initialPropiedades }: { initialPropiedades: Propiedad[] }) {
  const [propiedades, setPropiedades] = useState<Propiedad[]>(initialPropiedades || [])
  const [useLocalStorage, setUseLocalStorage] = useState(false)

  useEffect(() => {
    // Verificar si necesita usar localStorage
    if (initialPropiedades.length === 0 || initialPropiedades.some(p => p.id?.startsWith('local-'))) {
      setUseLocalStorage(true)
      loadFromLocalStorage()
    }

    // Verificar periódicamente por actualizaciones en localStorage
    const interval = setInterval(() => {
      if (useLocalStorage) {
        loadFromLocalStorage()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [useLocalStorage])

  const loadFromLocalStorage = () => {
    const localPropiedades = getPropiedadesFromLocalStorage()
    if (localPropiedades.length > 0) {
      setPropiedades(localPropiedades as Propiedad[])
      setUseLocalStorage(true)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestión de Propiedades</h1>
          <p className="text-gray-600">Administra todas tus propiedades</p>
          {useLocalStorage && (
            <p className="text-sm text-yellow-600 mt-1">
              ⚠️ Modo desarrollo: usando localStorage
            </p>
          )}
        </div>
        <Link href="/dashboard/nueva" className="btn-primary flex items-center space-x-2">
          <FiPlus />
          <span>Nueva Propiedad</span>
        </Link>
      </div>

      {propiedades && propiedades.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {propiedades.map((propiedad) => (
            <PropiedadDashboardCard key={propiedad.id} propiedad={propiedad} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600 text-lg mb-4">
            No hay propiedades registradas aún.
          </p>
          <Link href="/dashboard/nueva" className="btn-primary inline-block">
            Crear primera propiedad
          </Link>
        </div>
      )}
    </div>
  )
}

