import Link from 'next/link'
import Image from 'next/image'
import { FiEdit, FiTrash2, FiEye, FiHome } from 'react-icons/fi'
import type { Propiedad } from '@/types/database.types'
import DeleteButton from './DeleteButton'

interface PropiedadDashboardCardProps {
  propiedad: Propiedad
}

export default function PropiedadDashboardCard({ propiedad }: PropiedadDashboardCardProps) {
  const formatPrice = (precio: number, moneda: string = 'USD') => {
    const currency = moneda === 'BRL' ? 'BRL' : 'USD'
    const formattedNumber = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(precio)
    return `${currency} ${formattedNumber}`
  }

  const getPeriodoLabel = (periodo: string) => {
    return periodo === 'diaria' ? '/día' : '/mes'
  }

  const imagenPrincipal = propiedad.imagenes && propiedad.imagenes.length > 0 
    ? propiedad.imagenes[0] 
    : null

  const isBase64 = imagenPrincipal?.startsWith('data:image')

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48 w-full bg-gray-200">
        {imagenPrincipal ? (
          isBase64 ? (
            <img
              src={imagenPrincipal}
              alt={propiedad.titulo}
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              src={imagenPrincipal}
              alt={propiedad.titulo}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized={imagenPrincipal.startsWith('http://localhost')}
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <FiHome className="text-gray-400 text-4xl" />
          </div>
        )}
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${
          propiedad.disponible 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {propiedad.disponible ? 'Disponible' : 'No disponible'}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2 line-clamp-2">{propiedad.titulo}</h3>
        <p className="text-primary-600 text-xl font-bold mb-2">
          {formatPrice(propiedad.precio, propiedad.moneda)}{getPeriodoLabel(propiedad.periodo)}
        </p>
        <p className="text-sm text-gray-600 mb-4">
          {propiedad.ciudad}, {propiedad.provincia}
        </p>
        
        <div className="flex items-center space-x-2">
          <Link
            href={`/propiedades/${propiedad.id}`}
            target="_blank"
            className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            <FiEye />
            <span>Ver</span>
          </Link>
          <Link
            href={`/dashboard/editar/${propiedad.id}`}
            className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
          >
            <FiEdit />
            <span>Editar</span>
          </Link>
          <DeleteButton propiedadId={propiedad.id} />
        </div>
      </div>
    </div>
  )
}

