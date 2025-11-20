-- ============================================
-- SETUP COMPLETO DO BANCO DE DADOS
-- Execute este arquivo no Supabase SQL Editor
-- ============================================

-- 1. CREAR TABLA DE PROPIEDADES
CREATE TABLE IF NOT EXISTS propiedades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('casa', 'departamento', 'local', 'oficina', 'terreno')),
  precio DECIMAL(12, 2) NOT NULL,
  moneda TEXT DEFAULT 'USD' CHECK (moneda IN ('USD', 'BRL')),
  periodo TEXT DEFAULT 'mensal' CHECK (periodo IN ('diaria', 'mensal')),
  direccion TEXT NOT NULL,
  ciudad TEXT NOT NULL,
  provincia TEXT NOT NULL,
  codigo_postal TEXT,
  regiao TEXT CHECK (regiao IN ('sul_da_ilha', 'norte_da_ilha', 'centro', 'continente')),
  barrio TEXT CHECK (barrio IN (
    'canasvieiras',
    'jurere_internacional',
    'ingleses',
    'campeche',
    'barra_da_lagoa',
    'lagoa_da_conceicao',
    'ponta_das_canas'
  )),
  habitaciones INTEGER,
  banios INTEGER,
  metros_cuadrados INTEGER,
  estadia_minima INTEGER,
  imagenes TEXT[] DEFAULT '{}',
  caracteristicas TEXT[] DEFAULT '{}',
  disponible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. CREAR TABLA DE BANNERS
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

-- 3. CREAR TABLA DE EVENTOS
CREATE TABLE IF NOT EXISTS eventos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE,
  hora_inicio TIME,
  hora_fin TIME,
  localizacao TEXT NOT NULL,
  cidade TEXT DEFAULT 'Florianópolis',
  imagem TEXT,
  link_externo TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================
-- ÍNDICES PARA BÚSQUEDAS RÁPIDAS
-- ============================================

-- Índices para propiedades
CREATE INDEX IF NOT EXISTS idx_propiedades_tipo ON propiedades(tipo);
CREATE INDEX IF NOT EXISTS idx_propiedades_ciudad ON propiedades(ciudad);
CREATE INDEX IF NOT EXISTS idx_propiedades_provincia ON propiedades(provincia);
CREATE INDEX IF NOT EXISTS idx_propiedades_disponible ON propiedades(disponible);
CREATE INDEX IF NOT EXISTS idx_propiedades_precio ON propiedades(precio);
CREATE INDEX IF NOT EXISTS idx_propiedades_barrio ON propiedades(barrio);
CREATE INDEX IF NOT EXISTS idx_propiedades_regiao ON propiedades(regiao);

-- Índices para banners
CREATE INDEX IF NOT EXISTS idx_banners_activo ON banners(activo);
CREATE INDEX IF NOT EXISTS idx_banners_orden ON banners(orden);

-- Índices para eventos
CREATE INDEX IF NOT EXISTS idx_eventos_fecha_inicio ON eventos(fecha_inicio);
CREATE INDEX IF NOT EXISTS idx_eventos_ativo ON eventos(ativo);
CREATE INDEX IF NOT EXISTS idx_eventos_cidade ON eventos(cidade);

-- ============================================
-- FUNCIONES Y TRIGGERS
-- ============================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para propiedades
CREATE TRIGGER update_propiedades_updated_at
  BEFORE UPDATE ON propiedades
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para banners
CREATE TRIGGER update_banners_updated_at
  BEFORE UPDATE ON banners
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para eventos
CREATE TRIGGER update_eventos_updated_at
  BEFORE UPDATE ON eventos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE propiedades ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;

-- Políticas para lectura pública (propiedades)
CREATE POLICY "Propiedades disponibles son visibles públicamente"
  ON propiedades FOR SELECT
  USING (disponible = true);

-- Políticas para lectura pública (banners)
CREATE POLICY "Banners activos son visibles públicamente"
  ON banners FOR SELECT
  USING (activo = true);

-- Políticas para lectura pública (eventos)
CREATE POLICY "Eventos activos son visibles públicamente"
  ON eventos FOR SELECT
  USING (ativo = true);

-- ============================================
-- POLÍTICAS PARA DESARROLLO (OPCIONAL)
-- Descomenta estas líneas si necesitas acceso completo sin autenticación
-- ============================================

-- Para desarrollo local, puedes deshabilitar RLS temporalmente:
-- ALTER TABLE propiedades DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE banners DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE eventos DISABLE ROW LEVEL SECURITY;

-- O crear políticas permisivas para desarrollo:
-- CREATE POLICY "Permitir todo en propiedades para desarrollo"
--   ON propiedades FOR ALL
--   TO public
--   USING (true)
--   WITH CHECK (true);

-- CREATE POLICY "Permitir todo en banners para desarrollo"
--   ON banners FOR ALL
--   TO public
--   USING (true)
--   WITH CHECK (true);

-- CREATE POLICY "Permitir todo en eventos para desarrollo"
--   ON eventos FOR ALL
--   TO public
--   USING (true)
--   WITH CHECK (true);

