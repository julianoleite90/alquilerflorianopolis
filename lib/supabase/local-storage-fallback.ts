// Fallback para desenvolvimento quando Supabase não está disponível
// Usa localStorage para simular o banco de dados

const STORAGE_KEY_BANNERS = 'aluguel_banners'
const STORAGE_KEY_PROPRIEDADES = 'aluguel_propriedades'
const STORAGE_KEY_EVENTOS = 'aluguel_eventos'

export interface BannerLocal {
  id: string
  titulo?: string | null
  descripcion?: string | null
  imagen_url: string
  enlace?: string | null
  orden?: number
  activo?: boolean
  created_at?: string
  updated_at?: string
}

export function getBannersFromLocalStorage(): BannerLocal[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(STORAGE_KEY_BANNERS)
  return data ? JSON.parse(data) : []
}

export function saveBannerToLocalStorage(banner: Omit<BannerLocal, 'id' | 'created_at' | 'updated_at'>): BannerLocal {
  const banners = getBannersFromLocalStorage()
  const newBanner: BannerLocal = {
    ...banner,
    id: `local-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  banners.push(newBanner)
  localStorage.setItem(STORAGE_KEY_BANNERS, JSON.stringify(banners))
  console.log('Banner guardado en localStorage:', newBanner)
  console.log('Total de banners:', banners.length)
  return newBanner
}

export function updateBannerInLocalStorage(id: string, updates: Partial<BannerLocal>): BannerLocal | null {
  const banners = getBannersFromLocalStorage()
  const index = banners.findIndex(b => b.id === id)
  if (index === -1) return null
  
  banners[index] = {
    ...banners[index],
    ...updates,
    updated_at: new Date().toISOString(),
  }
  localStorage.setItem(STORAGE_KEY_BANNERS, JSON.stringify(banners))
  return banners[index]
}

export function deleteBannerFromLocalStorage(id: string): boolean {
  const banners = getBannersFromLocalStorage()
  const filtered = banners.filter(b => b.id !== id)
  if (filtered.length === banners.length) return false
  localStorage.setItem(STORAGE_KEY_BANNERS, JSON.stringify(filtered))
  return true
}

// Funções para Propriedades
export interface PropiedadLocal {
  id: string
  titulo: string
  descripcion: string
  tipo: 'casa' | 'departamento' | 'local' | 'oficina' | 'terreno'
  precio: number
  moneda: 'USD'
  periodo: 'diaria' | 'mensal'
  direccion: string
  ciudad: string
  provincia: string
  codigo_postal?: string | null
  regiao?: 'sul_da_ilha' | 'norte_da_ilha' | 'centro' | 'continente' | null
  barrio?: 'canasvieiras' | 'jurere_internacional' | 'ingleses' | 'campeche' | 'barra_da_lagoa' | 'lagoa_da_conceicao' | 'ponta_das_canas' | null
  habitaciones?: number | null
  banios?: number | null
  metros_cuadrados?: number | null
  estadia_minima?: number | null
  distancia_praia?: number | null
  imagenes?: string[]
  caracteristicas?: string[]
  disponible?: boolean
  created_at?: string
  updated_at?: string
}

export function getPropiedadesFromLocalStorage(): PropiedadLocal[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(STORAGE_KEY_PROPRIEDADES)
  return data ? JSON.parse(data) : []
}

export function savePropiedadToLocalStorage(propiedad: Omit<PropiedadLocal, 'id' | 'created_at' | 'updated_at'>): PropiedadLocal {
  try {
    const propiedades = getPropiedadesFromLocalStorage()
    const newPropiedad: PropiedadLocal = {
      ...propiedad,
      id: `local-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    propiedades.push(newPropiedad)
    
    // Verificar tamanho antes de salvar
    const dataString = JSON.stringify(propiedades)
    const sizeMB = new Blob([dataString]).size / 1024 / 1024
    
    if (sizeMB > 2) {
      // Tentar limpar propriedades antigas se possível
      if (propiedades.length > 1) {
        // Manter apenas as 5 propriedades mais recentes
        const sorted = propiedades.sort((a, b) => {
          const dateA = new Date(a.created_at || 0).getTime()
          const dateB = new Date(b.created_at || 0).getTime()
          return dateB - dateA
        })
        const recent = sorted.slice(0, 5)
        const recentString = JSON.stringify(recent)
        const recentSizeMB = new Blob([recentString]).size / 1024 / 1024
        
        if (recentSizeMB < 2) {
          // Salvar apenas as recentes
          localStorage.setItem(STORAGE_KEY_PROPRIEDADES, recentString)
          throw new Error(`El almacenamiento está lleno. Se eliminaron propiedades antiguas automáticamente. Intente guardar nuevamente.`)
        }
      }
      
      throw new Error(`Los datos exceden el límite de localStorage (${sizeMB.toFixed(2)}MB). Por favor, elimine algunas propiedades antiguas o configure Supabase para usar almacenamiento en la nube.`)
    }
    
    localStorage.setItem(STORAGE_KEY_PROPRIEDADES, dataString)
    console.log('Propiedad guardada en localStorage:', newPropiedad)
    return newPropiedad
  } catch (error: any) {
    if (error.message?.includes('exceeded the quota') || error.message?.includes('excede el límite')) {
      throw new Error('El almacenamiento local está lleno. Por favor, elimine algunas propiedades o imágenes, o configure Supabase para usar almacenamiento en la nube.')
    }
    throw error
  }
}

export function updatePropiedadInLocalStorage(id: string, updates: Partial<PropiedadLocal>): PropiedadLocal | null {
  try {
    const propiedades = getPropiedadesFromLocalStorage()
    const index = propiedades.findIndex(p => p.id === id)
    if (index === -1) return null
    
    propiedades[index] = {
      ...propiedades[index],
      ...updates,
      updated_at: new Date().toISOString(),
    }
    
    // Verificar tamanho antes de salvar
    const dataString = JSON.stringify(propiedades)
    const sizeMB = new Blob([dataString]).size / 1024 / 1024
    
    if (sizeMB > 4) {
      throw new Error(`Los datos exceden el límite de localStorage (${sizeMB.toFixed(2)}MB). Por favor, reduzca el número de imágenes o use imágenes más pequeñas.`)
    }
    
    localStorage.setItem(STORAGE_KEY_PROPRIEDADES, dataString)
    return propiedades[index]
  } catch (error: any) {
    if (error.message?.includes('exceeded the quota') || error.message?.includes('excede el límite')) {
      throw new Error('El almacenamiento local está lleno. Por favor, elimine algunas propiedades o imágenes, o configure Supabase para usar almacenamiento en la nube.')
    }
    throw error
  }
}

export function deletePropiedadFromLocalStorage(id: string): boolean {
  const propiedades = getPropiedadesFromLocalStorage()
  const filtered = propiedades.filter(p => p.id !== id)
  if (filtered.length === propiedades.length) return false
  localStorage.setItem(STORAGE_KEY_PROPRIEDADES, JSON.stringify(filtered))
  return true
}

// Funções para Eventos
export interface EventoLocal {
  id: string
  titulo: string
  descripcion: string
  fecha_inicio: string
  fecha_fin?: string | null
  hora_inicio?: string | null
  hora_fin?: string | null
  localizacao: string
  cidade?: string
  imagem?: string | null
  link_externo?: string | null
  ativo?: boolean
  created_at?: string
  updated_at?: string
}

export function getEventosFromLocalStorage(): EventoLocal[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(STORAGE_KEY_EVENTOS)
  return data ? JSON.parse(data) : []
}

export function saveEventoToLocalStorage(evento: Omit<EventoLocal, 'id' | 'created_at' | 'updated_at'>): EventoLocal {
  const eventos = getEventosFromLocalStorage()
  const newEvento: EventoLocal = {
    ...evento,
    id: `local-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  eventos.push(newEvento)
  localStorage.setItem(STORAGE_KEY_EVENTOS, JSON.stringify(eventos))
  console.log('Evento guardado en localStorage:', newEvento)
  return newEvento
}

export function updateEventoInLocalStorage(id: string, updates: Partial<EventoLocal>): EventoLocal | null {
  const eventos = getEventosFromLocalStorage()
  const index = eventos.findIndex(e => e.id === id)
  if (index === -1) return null
  
  eventos[index] = {
    ...eventos[index],
    ...updates,
    updated_at: new Date().toISOString(),
  }
  localStorage.setItem(STORAGE_KEY_EVENTOS, JSON.stringify(eventos))
  return eventos[index]
}

export function deleteEventoFromLocalStorage(id: string): boolean {
  const eventos = getEventosFromLocalStorage()
  const filtered = eventos.filter(e => e.id !== id)
  if (filtered.length === eventos.length) return false
  localStorage.setItem(STORAGE_KEY_EVENTOS, JSON.stringify(filtered))
  return true
}

