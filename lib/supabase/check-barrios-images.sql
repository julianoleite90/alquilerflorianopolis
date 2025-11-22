-- Script para verificar as imagens dos bairros no banco de dados

-- Verificar todos os bairros e suas imagens
SELECT 
  slug,
  nombre,
  cover_image,
  activo,
  updated_at
FROM barrios 
ORDER BY orden;

-- Verificar especificamente os bairros que devem ter imagens de praia
SELECT 
  slug,
  nombre,
  cover_image,
  CASE 
    WHEN cover_image LIKE '%1507525428034%' THEN '✅ Imagem de praia'
    ELSE '❌ Não é imagem de praia'
  END as status_imagem
FROM barrios 
WHERE slug IN ('jurere_internacional', 'campeche', 'lagoa_da_conceicao')
ORDER BY slug;

