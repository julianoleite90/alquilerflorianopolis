'use client'

import { useState } from 'react'
import PropiedadesList from './PropiedadesList'
import FiltroRegioes from './FiltroRegioes'
import type { Propiedad } from '@/types/database.types'

interface PropiedadesListWithFilterProps {
  initialPropiedades: Propiedad[]
  limit?: number
}

export default function PropiedadesListWithFilter({ initialPropiedades, limit }: PropiedadesListWithFilterProps) {
  const [regiaoSelecionada, setRegiaoSelecionada] = useState<string | null>(null)

  return (
    <div>
      <FiltroRegioes 
        regiaoSelecionada={regiaoSelecionada} 
        onRegiaoChange={setRegiaoSelecionada} 
      />
      <PropiedadesList 
        initialPropiedades={initialPropiedades} 
        limit={limit}
        regiao={regiaoSelecionada}
      />
    </div>
  )
}

