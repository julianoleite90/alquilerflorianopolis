import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import FormBanner from '@/components/FormBanner'
import EditarBannerClient from '@/components/EditarBannerClient'

export default async function EditarBannerPage({
  params,
}: {
  params: { id: string }
}) {
  let banner = null
  let useLocalStorage = false

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .eq('id', params.id)
      .single()

    if (!error && data) {
      banner = data
    } else if (params.id.startsWith('local-')) {
      useLocalStorage = true
    }
  } catch (error) {
    // Si el ID empieza con 'local-', es de localStorage
    if (params.id.startsWith('local-')) {
      useLocalStorage = true
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Editar Banner</h1>
      <EditarBannerClient bannerId={params.id} initialBanner={banner} useLocalStorage={useLocalStorage} />
    </div>
  )
}

