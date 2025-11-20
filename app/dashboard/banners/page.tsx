import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { FiPlus } from 'react-icons/fi'
import BannersListClient from '@/components/BannersListClient'

export default async function BannersPage() {
  let banners = null
  let useLocalStorage = false
  
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('orden', { ascending: true })
    
    if (error) {
      console.warn('Error al cargar banners de Supabase:', error)
      useLocalStorage = true
    } else {
      banners = data
    }
  } catch (error) {
    console.warn('Supabase no disponible, usando localStorage:', error)
    useLocalStorage = true
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestión de Banners</h1>
          <p className="text-gray-600">Administra los banners de la página principal</p>
        </div>
        <Link href="/dashboard/banners/nuevo" className="btn-primary flex items-center space-x-2">
          <FiPlus />
          <span>Nuevo Banner</span>
        </Link>
      </div>

      <BannersListClient initialBanners={banners} useLocalStorage={useLocalStorage} />
    </div>
  )
}

