-- Migración para agregar campo periodo y actualizar a USD solamente
-- Ejecutar esto si ya tienes la tabla creada

-- Agregar columna periodo si no existe
ALTER TABLE propiedades 
ADD COLUMN IF NOT EXISTS periodo TEXT DEFAULT 'mensal' CHECK (periodo IN ('diaria', 'mensal'));

-- Actualizar todas las propiedades existentes a USD si no lo están
UPDATE propiedades SET moneda = 'USD' WHERE moneda != 'USD';

-- Cambiar el default de moneda a USD
ALTER TABLE propiedades 
ALTER COLUMN moneda SET DEFAULT 'USD';

-- Actualizar constraint de moneda para solo permitir USD
ALTER TABLE propiedades 
DROP CONSTRAINT IF EXISTS propiedades_moneda_check;

ALTER TABLE propiedades 
ADD CONSTRAINT propiedades_moneda_check CHECK (moneda IN ('USD'));

