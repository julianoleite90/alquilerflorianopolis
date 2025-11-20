-- Adicionar coluna regiao à tabela propiedades (se ainda não existir)
ALTER TABLE propiedades 
ADD COLUMN IF NOT EXISTS regiao TEXT CHECK (regiao IN ('sul_da_ilha', 'norte_da_ilha', 'centro', 'continente'));

-- Criar índice para buscas rápidas por região
CREATE INDEX IF NOT EXISTS idx_propiedades_regiao ON propiedades(regiao);

