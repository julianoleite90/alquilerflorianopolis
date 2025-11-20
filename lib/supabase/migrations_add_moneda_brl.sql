-- Adicionar suporte para BRL na coluna moneda
ALTER TABLE propiedades 
DROP CONSTRAINT IF EXISTS propiedades_moneda_check;

ALTER TABLE propiedades 
ADD CONSTRAINT propiedades_moneda_check 
CHECK (moneda IN ('USD', 'BRL'));

