-- Crear tabla de barrios
CREATE TABLE IF NOT EXISTS barrios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  descripcion_seo TEXT NOT NULL,
  keywords TEXT[] DEFAULT '{}',
  regiao TEXT NOT NULL CHECK (regiao IN ('norte_da_ilha', 'sul_da_ilha', 'centro', 'continente')),
  cover_image TEXT NOT NULL,
  highlights TEXT[] DEFAULT '{}',
  activo BOOLEAN DEFAULT true,
  orden INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_barrios_slug ON barrios(slug);
CREATE INDEX IF NOT EXISTS idx_barrios_activo ON barrios(activo);
CREATE INDEX IF NOT EXISTS idx_barrios_orden ON barrios(orden);
CREATE INDEX IF NOT EXISTS idx_barrios_regiao ON barrios(regiao);

-- Trigger para actualizar updated_at
CREATE TRIGGER update_barrios_updated_at
  BEFORE UPDATE ON barrios
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE barrios ENABLE ROW LEVEL SECURITY;

-- Política para lectura pública (todos pueden ver barrios activos)
CREATE POLICY "Barrios activos son visibles públicamente"
  ON barrios FOR SELECT
  USING (activo = true);

-- Insertar barrios iniciales desde data/barrios.ts
INSERT INTO barrios (slug, nombre, descripcion, descripcion_seo, keywords, regiao, cover_image, highlights, orden, activo)
VALUES
  ('canasvieiras', 'Canasvieiras', 'Playas tranquilas, gastronomía con sabor argentino y servicios completos para familias.', 'Departamentos y casas en alquiler en Canasvieiras, Florianópolis. Opciones frente al mar ideales para familias y grupos.', ARRAY['alquiler en Canasvieiras', 'departamento en Canasvieiras', 'temporada Canasvieiras Florianópolis'], 'norte_da_ilha', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=60', ARRAY['Ambiente familiar', 'Servicios en español', 'Vida nocturna suave'], 1, true),
  ('jurere_internacional', 'Jurerê Internacional', 'Lujo frente al mar, beach clubs y propiedades premium para estancias sofisticadas.', 'Casas y departamentos exclusivos en Jurerê Internacional, la zona más elegante de Florianópolis.', ARRAY['alquiler en Jurerê Internacional', 'casas de lujo en Florianópolis', 'temporada jurere'], 'norte_da_ilha', 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=60', ARRAY['Beach clubs', 'Servicios premium', 'Ambiente exclusivo'], 2, true),
  ('ingleses', 'Ingleses', 'Playa extensa, comercios abiertos todo el año y fácil acceso a otras playas del norte.', 'Alquiler temporario en Ingleses, Florianópolis. Propiedades con excelente relación precio/beneficio.', ARRAY['alquiler en Ingleses', 'departamentos en Ingleses', 'temporada ingleses florianopolis'], 'norte_da_ilha', 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=60', ARRAY['Comercios todo el año', 'playa extensa', 'ideal familias'], 3, true),
  ('campeche', 'Campeche', 'Surf, naturaleza y estilo bohemio. Perfecto para quienes buscan energía joven.', 'Departamentos y casas modernas en Campeche, Florianópolis. Ambiente surf y naturaleza.', ARRAY['alquiler en Campeche', 'temporada Campeche Florianópolis', 'casas en Campeche'], 'sul_da_ilha', 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=1200&q=60', ARRAY['Spot de surf', 'Gastronomía orgánica', 'Ambiente joven'], 4, true),
  ('barra_da_lagoa', 'Barra da Lagoa', 'Canales, senderos y una comunidad pesquera encantadora. Ideal para desconectar.', 'Alquiler en Barra da Lagoa, Florianópolis. Casas y estudios cerca del canal y la playa.', ARRAY['alquiler en Barra da Lagoa', 'temporada barra da lagoa', 'casas barra da lagoa'], 'centro', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=60', ARRAY['Ambiente nativo', 'Senderos', 'Playas tranquilas'], 5, true),
  ('lagoa_da_conceicao', 'Lagoa da Conceição', 'Centro artístico con vista a la laguna, deportes náuticos y vida nocturna vibrante.', 'Alquiler en Lagoa da Conceição, Florianópolis. Estudios, lofts y casas con vista privilegiada.', ARRAY['alquiler en Lagoa da Conceição', 'departamento en la lagoa', 'temporada lagoa florianopolis'], 'centro', 'https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=1200&q=60', ARRAY['Vida nocturna', 'Deportes náuticos', 'Vista privilegiada'], 6, true),
  ('ponta_das_canas', 'Ponta das Canas', 'Playa calma, ideal para familias y quienes buscan relajarse lejos del ruido.', 'Casas frente al mar en Ponta das Canas, Florianópolis. Playa calma con atardeceres memorables.', ARRAY['alquiler en Ponta das Canas', 'casas frente al mar florianopolis', 'temporada norte florianopolis'], 'norte_da_ilha', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=60', ARRAY['Playa calma', 'Atardeceres', 'Ambiente familiar'], 7, true)
ON CONFLICT (slug) DO NOTHING;

