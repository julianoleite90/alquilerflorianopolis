-- Crear tabla de eventos
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

-- Crear índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_eventos_fecha_inicio ON eventos(fecha_inicio);
CREATE INDEX IF NOT EXISTS idx_eventos_ativo ON eventos(ativo);
CREATE INDEX IF NOT EXISTS idx_eventos_cidade ON eventos(cidade);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_eventos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
CREATE TRIGGER update_eventos_updated_at
  BEFORE UPDATE ON eventos
  FOR EACH ROW
  EXECUTE FUNCTION update_eventos_updated_at();

-- Habilitar Row Level Security (RLS)
ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;

-- Política para lectura pública (todos pueden ver eventos activos)
CREATE POLICY "Eventos activos son visibles públicamente"
  ON eventos FOR SELECT
  USING (ativo = true);

