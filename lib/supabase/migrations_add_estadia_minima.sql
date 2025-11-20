-- Adicionar coluna estadia_minima à tabela propiedades (se ainda não existir)
ALTER TABLE propiedades 
ADD COLUMN IF NOT EXISTS estadia_minima INTEGER;

