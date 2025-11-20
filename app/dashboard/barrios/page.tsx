import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { FiEdit, FiPlus, FiMapPin } from 'react-icons/fi'
import BarriosListClient from './BarriosListClient'

export default async function BarriosPage() {
  let barrios: any[] = []
  
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('barrios')
      .select('*')
      .order('orden', { ascending: true })
    
    if (error) {
      console.error('Error al cargar barrios desde Supabase:', error)
    } else {
      barrios = data || []
    }
  } catch (error) {
    console.error('Error de conexión con Supabase en el servidor:', error)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestión de Barrios</h1>
          <p className="text-gray-600">Administra los barrios destacados que aparecen en la home</p>
        </div>
        <Link href="/dashboard/barrios/nuevo" className="btn-primary flex items-center space-x-2">
          <FiPlus />
          <span>Nuevo Barrio</span>
        </Link>
      </div>

      <BarriosListClient initialBarrios={barrios} />
    </div>
  )
}

