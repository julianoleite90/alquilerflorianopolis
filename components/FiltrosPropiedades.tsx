'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { FiFilter, FiX, FiSearch, FiHome, FiDollarSign, FiMapPin } from 'react-icons/fi'

export default function FiltrosPropiedades() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filtros, setFiltros] = useState({
    tipo: searchParams.get('tipo') || '',
    ciudad: searchParams.get('ciudad') || '',
    provincia: searchParams.get('provincia') || '',
    precio_min: searchParams.get('precio_min') || '',
    precio_max: searchParams.get('precio_max') || '',
    habitaciones: searchParams.get('habitaciones') || '',
  })

  const [isExpanded, setIsExpanded] = useState(true)

  const aplicarFiltros = () => {
    const params = new URLSearchParams()
    Object.entries(filtros).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      }
    })
    router.push(`/propiedades?${params.toString()}`)
  }

  const limpiarFiltros = () => {
    setFiltros({
      tipo: '',
      ciudad: '',
      provincia: '',
      precio_min: '',
      precio_max: '',
      habitaciones: '',
    })
    router.push('/propiedades')
  }

  const hasActiveFilters = Object.values(filtros).some(v => v !== '')

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden lg:sticky lg:top-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-3 md:p-4 text-white">
        <div className="flex items-center justify-between">
          <h2 className="text-base md:text-lg font-bold flex items-center">
            <FiFilter className="mr-2 text-sm md:text-base" />
            Filtros
          </h2>
          {hasActiveFilters && (
            <button
              onClick={limpiarFiltros}
              className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors flex items-center"
            >
              <FiX className="mr-1" />
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-3 md:p-4 space-y-3 md:space-y-4">
        {/* Tipo */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Tipo
          </label>
          <select
            value={filtros.tipo}
            onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white text-sm"
          >
            <option value="">Todos los tipos</option>
            <option value="casa">Casa</option>
            <option value="departamento">Departamento</option>
            <option value="local">Local</option>
            <option value="oficina">Oficina</option>
            <option value="terreno">Terreno</option>
          </select>
        </div>

        {/* Ubicación */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Ciudad
          </label>
          <input
            type="text"
            value={filtros.ciudad}
            onChange={(e) => setFiltros({ ...filtros, ciudad: e.target.value })}
            placeholder="Ej: Jurerê, Canasvieiras..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"
          />
        </div>

        {/* Precio */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Precio (USD)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              value={filtros.precio_min}
              onChange={(e) => setFiltros({ ...filtros, precio_min: e.target.value })}
              placeholder="Mín"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"
            />
            <input
              type="number"
              value={filtros.precio_max}
              onChange={(e) => setFiltros({ ...filtros, precio_max: e.target.value })}
              placeholder="Máx"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"
            />
          </div>
        </div>

        {/* Habitaciones */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Habitaciones
          </label>
          <select
            value={filtros.habitaciones}
            onChange={(e) => setFiltros({ ...filtros, habitaciones: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white text-sm"
          >
            <option value="">Cualquier cantidad</option>
            <option value="1">1+ habitaciones</option>
            <option value="2">2+ habitaciones</option>
            <option value="3">3+ habitaciones</option>
            <option value="4">4+ habitaciones</option>
            <option value="5">5+ habitaciones</option>
          </select>
        </div>

        {/* Botón Aplicar */}
        <button
          onClick={aplicarFiltros}
          className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2 text-sm"
        >
          <FiSearch />
          <span>Buscar</span>
        </button>

        {/* Indicador de filtros activos */}
        {hasActiveFilters && (
          <div className="pt-3 border-t border-gray-200">
            <div className="flex flex-wrap gap-1.5">
              {filtros.tipo && (
                <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs">
                  {filtros.tipo}
                </span>
              )}
              {filtros.ciudad && (
                <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs">
                  {filtros.ciudad}
                </span>
              )}
              {filtros.precio_min && (
                <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs">
                  ${filtros.precio_min}+
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
