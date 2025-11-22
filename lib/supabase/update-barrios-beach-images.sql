-- Atualizar imagens dos bairros para usar apenas imagens de praia
-- Usando a mesma imagem de praia para todos (pode repetir conforme solicitado)

-- Imagem de praia do Unsplash (tropical beach)
UPDATE barrios 
SET cover_image = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=60',
    updated_at = NOW()
WHERE slug IN ('jurere_internacional', 'campeche', 'lagoa_da_conceicao');

-- Verificar as atualizações
SELECT slug, nombre, cover_image, updated_at
FROM barrios 
WHERE slug IN ('jurere_internacional', 'campeche', 'lagoa_da_conceicao')
ORDER BY slug;

-- Verificar todos os barrios para debug
SELECT slug, nombre, cover_image 
FROM barrios 
ORDER BY orden;

