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

-- Habilitar Row Level Security
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- Política para lectura pública
CREATE POLICY "Banners activos son visibles públicamente"
  ON banners FOR SELECT
  USING (activo = true);

-- Políticas para administradores (INSERT, UPDATE, DELETE)
-- Nota: En desarrollo, puedes deshabilitar RLS temporalmente o crear políticas más permisivas
-- Para desarrollo local, descomenta estas líneas:

-- CREATE POLICY "Permitir todo en banners para desarrollo"
--   ON banners FOR ALL
--   TO public
--   USING (true)
--   WITH CHECK (true);

-- O deshabilita RLS completamente para desarrollo:
-- ALTER TABLE banners DISABLE ROW LEVEL SECURITY;

