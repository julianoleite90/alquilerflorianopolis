-- Script para configurar políticas RLS para banners
-- Execute este script no SQL Editor do Supabase se os banners não estiverem salvando

-- 1. Verificar se a tabela existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'banners'
  ) THEN
    RAISE EXCEPTION 'A tabela "banners" não existe. Execute primeiro setup-database.sql';
  END IF;
END $$;

-- 2. Habilitar RLS (se ainda não estiver habilitado)
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- 3. Remover políticas antigas (se existirem)
DROP POLICY IF EXISTS "Banners activos son visibles públicamente" ON banners;
DROP POLICY IF EXISTS "Permitir todo en banners para desarrollo" ON banners;
DROP POLICY IF EXISTS "Permitir INSERT/UPDATE para autenticados" ON banners;

-- 4. Política para leitura pública (todos podem ver banners ativos)
CREATE POLICY "Banners activos son visibles públicamente"
  ON banners FOR SELECT
  USING (activo = true);

-- 5. Política para INSERT (usuários autenticados podem criar)
CREATE POLICY "Usuarios autenticados pueden crear banners"
  ON banners FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 6. Política para UPDATE (usuários autenticados podem atualizar)
CREATE POLICY "Usuarios autenticados pueden actualizar banners"
  ON banners FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 7. Política para DELETE (usuários autenticados podem deletar)
CREATE POLICY "Usuarios autenticados pueden eliminar banners"
  ON banners FOR DELETE
  TO authenticated
  USING (true);

-- Verificar políticas criadas
SELECT 
  policyname,
  cmd,
  roles,
  CASE 
    WHEN qual IS NOT NULL THEN 'USING: ' || qual::text
    ELSE 'Sem restrição USING'
  END as using_clause,
  CASE 
    WHEN with_check IS NOT NULL THEN 'WITH CHECK: ' || with_check::text
    ELSE 'Sem restrição WITH CHECK'
  END as with_check_clause
FROM pg_policies 
WHERE tablename = 'banners'
ORDER BY policyname;

