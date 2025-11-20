import { createClient } from '@/lib/supabase/server'
import EditarPropiedadClient from '../EditarPropiedadClient'

export default async function EditarPropiedadPage({
  params,
}: {
  params: { id: string }
}) {
  let propiedad: any = null
  
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('propiedades')
      .select('*')
      .eq('id', params.id)
      .single()
    
    if (!error && data) {
      propiedad = data
    }
  } catch (error) {
    console.warn('Error al cargar propiedad desde Supabase:', error)
  }

  return <EditarPropiedadClient initialPropiedad={propiedad} propiedadId={params.id} />
}

