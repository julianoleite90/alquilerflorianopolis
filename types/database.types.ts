export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      propiedades: {
        Row: {
          id: string
          titulo: string
          descripcion: string
          tipo: 'casa' | 'departamento' | 'local' | 'oficina' | 'terreno'
          precio: number
          moneda: 'USD' | 'BRL'
          periodo: 'diaria' | 'mensal'
          direccion: string
          ciudad: string
          provincia: string
          codigo_postal: string | null
          regiao: 'sul_da_ilha' | 'norte_da_ilha' | 'centro' | 'continente' | null
          barrio: 'canasvieiras' | 'jurere_internacional' | 'ingleses' | 'campeche' | 'barra_da_lagoa' | 'lagoa_da_conceicao' | 'ponta_das_canas' | null
          habitaciones: number | null
          banios: number | null
          metros_cuadrados: number | null
          estadia_minima: number | null
          imagenes: string[]
          caracteristicas: string[]
          disponible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          titulo: string
          descripcion: string
          tipo: 'casa' | 'departamento' | 'local' | 'oficina' | 'terreno'
          precio: number
          moneda?: 'USD' | 'BRL'
          periodo?: 'diaria' | 'mensal'
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
          imagenes?: string[]
          caracteristicas?: string[]
          disponible?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          titulo?: string
          descripcion?: string
          tipo?: 'casa' | 'departamento' | 'local' | 'oficina' | 'terreno'
          precio?: number
          moneda?: 'USD' | 'BRL'
          periodo?: 'diaria' | 'mensal'
          direccion?: string
          ciudad?: string
          provincia?: string
          codigo_postal?: string | null
          regiao?: 'sul_da_ilha' | 'norte_da_ilha' | 'centro' | 'continente' | null
          barrio?: 'canasvieiras' | 'jurere_internacional' | 'ingleses' | 'campeche' | 'barra_da_lagoa' | 'lagoa_da_conceicao' | 'ponta_das_canas' | null
          habitaciones?: number | null
          banios?: number | null
          metros_cuadrados?: number | null
          estadia_minima?: number | null
          imagenes?: string[]
          caracteristicas?: string[]
          disponible?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      eventos: {
        Row: {
          id: string
          titulo: string
          descripcion: string
          fecha_inicio: string
          fecha_fin: string | null
          hora_inicio: string | null
          hora_fin: string | null
          localizacao: string
          cidade: string
          imagem: string | null
          link_externo: string | null
          ativo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
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
        Update: {
          id?: string
          titulo?: string
          descripcion?: string
          fecha_inicio?: string
          fecha_fin?: string | null
          hora_inicio?: string | null
          hora_fin?: string | null
          localizacao?: string
          cidade?: string
          imagem?: string | null
          link_externo?: string | null
          ativo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      barrios: {
        Row: {
          id: string
          slug: string
          nombre: string
          descripcion: string
          descripcion_seo: string
          keywords: string[]
          regiao: 'norte_da_ilha' | 'sul_da_ilha' | 'centro' | 'continente'
          cover_image: string
          highlights: string[]
          activo: boolean
          orden: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          nombre: string
          descripcion: string
          descripcion_seo: string
          keywords?: string[]
          regiao: 'norte_da_ilha' | 'sul_da_ilha' | 'centro' | 'continente'
          cover_image: string
          highlights?: string[]
          activo?: boolean
          orden?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          nombre?: string
          descripcion?: string
          descripcion_seo?: string
          keywords?: string[]
          regiao?: 'norte_da_ilha' | 'sul_da_ilha' | 'centro' | 'continente'
          cover_image?: string
          highlights?: string[]
          activo?: boolean
          orden?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      tipo_propiedad: 'casa' | 'departamento' | 'local' | 'oficina' | 'terreno'
      moneda: 'USD' | 'BRL'
      periodo: 'diaria' | 'mensal'
    }
  }
}

export type Propiedad = Database['public']['Tables']['propiedades']['Row']
export type PropiedadInsert = Database['public']['Tables']['propiedades']['Insert']
export type PropiedadUpdate = Database['public']['Tables']['propiedades']['Update']

export type Evento = Database['public']['Tables']['eventos']['Row']
export type EventoInsert = Database['public']['Tables']['eventos']['Insert']
export type EventoUpdate = Database['public']['Tables']['eventos']['Update']

export type Barrio = Database['public']['Tables']['barrios']['Row']
export type BarrioInsert = Database['public']['Tables']['barrios']['Insert']
export type BarrioUpdate = Database['public']['Tables']['barrios']['Update']

export type Barrio = Database['public']['Tables']['barrios']['Row']
export type BarrioInsert = Database['public']['Tables']['barrios']['Insert']
export type BarrioUpdate = Database['public']['Tables']['barrios']['Update']

