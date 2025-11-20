ALTER TABLE propiedades
  ADD COLUMN IF NOT EXISTS barrio TEXT CHECK (barrio IN (
    'canasvieiras',
    'jurere_internacional',
    'ingleses',
    'campeche',
    'barra_da_lagoa',
    'lagoa_da_conceicao',
    'ponta_das_canas'
  ));

CREATE INDEX IF NOT EXISTS idx_propiedades_barrio ON propiedades(barrio);

