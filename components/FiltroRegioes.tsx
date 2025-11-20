'use client'

import { useState } from 'react'

interface FiltroRegioesProps {
  regiaoSelecionada: string | null
  onRegiaoChange: (regiao: string | null) => void
}

const REGIOES = [
  { value: null, label: 'Todos' },
  { value: 'norte_da_ilha', label: 'Norte de la Isla' },
  { value: 'sul_da_ilha', label: 'Sur de la Isla' },
  { value: 'centro', label: 'Centro' },
  { value: 'continente', label: 'Continente' },
]

export default function FiltroRegioes({ regiaoSelecionada, onRegiaoChange }: FiltroRegioesProps) {
  return (
    <div className="flex flex-wrap gap-2 md:gap-3 mb-6 md:mb-8 px-4 md:px-0 justify-center md:justify-start">
      {REGIOES.map((regiao) => (
        <button
          key={regiao.value || 'todos'}
          onClick={() => onRegiaoChange(regiao.value)}
          className={`
            px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition-all duration-200 text-sm md:text-base
            ${
              regiaoSelecionada === regiao.value
                ? 'bg-primary-600 text-white shadow-lg transform scale-105'
                : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-primary-400 hover:text-primary-600 hover:shadow-md'
            }
          `}
        >
          {regiao.label}
        </button>
      ))}
    </div>
  )
}

