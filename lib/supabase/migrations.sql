-- Crear tabla de propiedades
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

-- Crear índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_propiedades_tipo ON propiedades(tipo);
CREATE INDEX IF NOT EXISTS idx_propiedades_ciudad ON propiedades(ciudad);
CREATE INDEX IF NOT EXISTS idx_propiedades_provincia ON propiedades(provincia);
CREATE INDEX IF NOT EXISTS idx_propiedades_disponible ON propiedades(disponible);
CREATE INDEX IF NOT EXISTS idx_propiedades_precio ON propiedades(precio);
CREATE INDEX IF NOT EXISTS idx_propiedades_barrio ON propiedades(barrio);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
CREATE TRIGGER update_propiedades_updated_at
  BEFORE UPDATE ON propiedades
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE propiedades ENABLE ROW LEVEL SECURITY;

-- Política para lectura pública (todos pueden ver propiedades disponibles)
CREATE POLICY "Propiedades disponibles son visibles públicamente"
  ON propiedades FOR SELECT
  USING (disponible = true);

-- Política para administradores (necesitarás configurar autenticación)
-- Por ahora, descomenta y ajusta según tu sistema de autenticación
-- CREATE POLICY "Administradores pueden hacer todo"
--   ON propiedades FOR ALL
--   USING (auth.role() = 'authenticated');

