    -- Atualizar imagens dos bairros para usar apenas imagens de praia
    -- Cada bairro terá uma imagem de praia diferente

-- Jurerê Internacional - Praia exclusiva com areia branca
UPDATE barrios 
SET cover_image = 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    updated_at = NOW()
WHERE slug = 'jurere_internacional';

-- Campeche - Praia com ondas e surf
UPDATE barrios 
SET cover_image = 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=1200&q=80',
    updated_at = NOW()
WHERE slug = 'campeche';

-- Lagoa da Conceição - Praia com vista panorâmica e montanhas
UPDATE barrios 
SET cover_image = 'https://images.unsplash.com/photo-1471922695134-8f5a67f23b90?auto=format&fit=crop&w=1200&q=80',
    updated_at = NOW()
WHERE slug = 'lagoa_da_conceicao';

    -- Verificar as atualizações
    SELECT slug, nombre, cover_image, updated_at
    FROM barrios 
    WHERE slug IN ('jurere_internacional', 'campeche', 'lagoa_da_conceicao')
    ORDER BY slug;

    -- Verificar todos os barrios para debug
    SELECT slug, nombre, cover_image 
    FROM barrios 
    ORDER BY orden;

