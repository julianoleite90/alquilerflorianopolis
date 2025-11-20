import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import FormBarrio from '@/components/FormBarrio'

export default async function EditarBarrioPage({
  params,
}: {
  params: { id: string }
}) {
  let barrio: any = null

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('barrios')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !data) {
      console.error('Error al cargar barrio:', error)
      notFound()
    }

    barrio = data
  } catch (error) {
    console.error('Error de conexión:', error)
    notFound()
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Editar Barrio</h1>
      <FormBarrio barrio={barrio} />
    </div>
  )
}

