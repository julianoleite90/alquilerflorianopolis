-- ============================================
-- SEED DATA - DATOS DE EJEMPLO
-- Execute este arquivo após setup-database.sql
-- ============================================

-- Limpiar datos existentes (opcional - descomenta si quieres empezar desde cero)
-- TRUNCATE TABLE propiedades, banners, eventos CASCADE;

-- ============================================
-- BANNERS DE EJEMPLO
-- ============================================

INSERT INTO banners (titulo, descripcion, imagen_url, enlace, orden, activo) VALUES
('Bienvenido a Florianópolis', 'Descubre las mejores propiedades para tu temporada', '/images/banners/banner1.jpg', '/propiedades', 1, true),
('Temporada 2024', 'Alquileres disponibles en las mejores zonas', '/images/banners/banner2.jpg', '/propiedades?regiao=norte_da_ilha', 2, true);

-- ============================================
-- PROPIEDADES DE EJEMPLO
-- ============================================

INSERT INTO propiedades (
  titulo,
  descripcion,
  tipo,
  precio,
  moneda,
  periodo,
  direccion,
  ciudad,
  provincia,
  codigo_postal,
  regiao,
  barrio,
  habitaciones,
  banios,
  metros_cuadrados,
  estadia_minima,
  imagenes,
  caracteristicas,
  disponible
) VALUES
(
  'Casa en Canasvieiras con Vista al Mar',
  'Hermosa casa a solo 200m de la playa de Canasvieiras. Ideal para familias argentinas. Cuenta con 3 habitaciones, 2 baños, cocina completa, área de barbacoa y estacionamiento.',
  'casa',
  1500.00,
  'USD',
  'mensal',
  'Rua das Palmeiras, 123',
  'Canasvieiras',
  'Santa Catarina',
  '88054-000',
  'norte_da_ilha',
  'canasvieiras',
  3,
  2,
  120,
  7,
  ARRAY['/images/propiedades/casa1-1.jpg', '/images/propiedades/casa1-2.jpg'],
  ARRAY['WiFi', 'Aire acondicionado', 'Estacionamiento', 'Cocina completa', 'Cerca de la playa'],
  true
),
(
  'Departamento en Jurerê Internacional',
  'Moderno departamento en el corazón de Jurerê. A 100m de la playa más exclusiva de Florianópolis. Perfecto para parejas o familias pequeñas.',
  'departamento',
  2500.00,
  'USD',
  'mensal',
  'Avenida dos Búzios, 456',
  'Jurerê Internacional',
  'Santa Catarina',
  '88053-700',
  'norte_da_ilha',
  'jurere_internacional',
  2,
  2,
  80,
  7,
  ARRAY['/images/propiedades/apt1-1.jpg', '/images/propiedades/apt1-2.jpg'],
  ARRAY['WiFi', 'Piscina', 'Gimnasio', 'Seguridad 24h', 'Aire acondicionado'],
  true
),
(
  'Casa en Campeche con Piscina',
  'Espaciosa casa en Campeche con piscina privada. Ideal para grupos grandes. A 300m de la playa, con 4 habitaciones y área de entretenimiento completa.',
  'casa',
  2000.00,
  'USD',
  'mensal',
  'Rua do Sol, 789',
  'Campeche',
  'Santa Catarina',
  '88063-000',
  'sul_da_ilha',
  'campeche',
  4,
  3,
  180,
  14,
  ARRAY['/images/propiedades/casa2-1.jpg', '/images/propiedades/casa2-2.jpg'],
  ARRAY['Piscina', 'WiFi', 'Estacionamiento', 'Área de barbacoa', 'Cocina completa'],
  true
);

-- ============================================
-- EVENTOS DE EJEMPLO
-- ============================================

INSERT INTO eventos (
  titulo,
  descripcion,
  fecha_inicio,
  fecha_fin,
  hora_inicio,
  hora_fin,
  localizacao,
  cidade,
  imagem,
  link_externo,
  ativo
) VALUES
(
  'Festival de Verão de Florianópolis',
  'El mayor festival de música y cultura de la temporada. Artistas nacionales e internacionales.',
  '2024-12-20',
  '2024-12-22',
  '18:00:00',
  '23:00:00',
  'Praia de Jurerê Internacional',
  'Florianópolis',
  '/images/eventos/festival-verao.jpg',
  'https://festivalverao.com.br',
  true
),
(
  'Campeonato de Vôlei de Praia',
  'Competição de vôlei de praia com atletas profissionais. Entrada gratuita.',
  '2024-12-15',
  '2024-12-17',
  '09:00:00',
  '18:00:00',
  'Praia de Canasvieiras',
  'Florianópolis',
  '/images/eventos/volei-praia.jpg',
  NULL,
  true
),
(
  'Feira de Artesanato',
  'Feira tradicional com artesanato local, comidas típicas e apresentações culturais.',
  '2024-12-10',
  '2024-12-10',
  '10:00:00',
  '20:00:00',
  'Centro de Lagoa da Conceição',
  'Florianópolis',
  '/images/eventos/feira-artesanato.jpg',
  NULL,
  true
);

