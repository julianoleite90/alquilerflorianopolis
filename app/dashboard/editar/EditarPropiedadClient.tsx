'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getPropiedadesFromLocalStorage } from '@/lib/supabase/local-storage-fallback'
import FormPropiedad from '@/components/FormPropiedad'
import type { Propiedad } from '@/types/database.types'

interface EditarPropiedadClientProps {
  initialPropiedad: Propiedad | null
  propiedadId: string
}

export default function EditarPropiedadClient({ initialPropiedad, propiedadId }: EditarPropiedadClientProps) {
  const [propiedad, setPropiedad] = useState<Propiedad | null>(initialPropiedad)
  const router = useRouter()

  useEffect(() => {
    // Se não encontrou no servidor, buscar no localStorage
    if (!propiedad) {
      const localPropiedades = getPropiedadesFromLocalStorage()
      const found = localPropiedades.find(p => p.id === propiedadId)
      if (found) {
        setPropiedad(found as Propiedad)
      } else {
        // Se não encontrou em lugar nenhum, redirecionar
        router.push('/dashboard')
      }
    }
  }, [propiedad, propiedadId, router])

  if (!propiedad) {
    return (
      <div>
        <p className="text-gray-600">Cargando...</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Editar Propiedad</h1>
      <FormPropiedad propiedad={propiedad} />
    </div>
  )
}

