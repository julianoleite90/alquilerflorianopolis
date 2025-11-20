-- Migración para desarrollo local (sin RLS)
-- Usa esto solo para desarrollo/testing

-- Crear tabla de banners
CREATE TABLE IF NOT EXISTS banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT,
  descripcion TEXT,
  imagen_url TEXT NOT NULL,
  enlace TEXT,
  orden INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_banners_activo ON banners(activo);
CREATE INDEX IF NOT EXISTS idx_banners_orden ON banners(orden);

-- Trigger para actualizar updated_at
CREATE TRIGGER update_banners_updated_at
  BEFORE UPDATE ON banners
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- DESHABILITAR RLS para desarrollo (NO usar en producción)
ALTER TABLE banners DISABLE ROW LEVEL SECURITY;

