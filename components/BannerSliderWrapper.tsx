import { createClient } from '@/lib/supabase/server'
import BannerSlider from './BannerSlider'

export default async function BannerSliderWrapper() {
  let banners = null
  
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .eq('activo', true)
      .order('orden', { ascending: true })
    
    if (!error && data) {
      banners = data
    }
  } catch (error) {
    // Si Supabase no está disponible, BannerSlider cargará de localStorage
    console.warn('Supabase no disponible para banners:', error)
  }

  // Pasar null para que BannerSlider cargue de localStorage si no hay banners de Supabase
  return <BannerSlider initialBanners={banners} />
}

