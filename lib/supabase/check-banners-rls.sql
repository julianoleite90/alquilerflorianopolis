-- Script para verificar se a tabela banners existe e suas políticas RLS

-- 1. Verificar se a tabela existe
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'banners'
    ) THEN '✅ Tabla "banners" EXISTE'
    ELSE '❌ Tabla "banners" NO EXISTE - Ejecuta setup-database.sql'
  END AS estado_tabla;

-- 2. Verificar políticas RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'banners';

-- 3. Verificar si RLS está habilitado
SELECT 
  CASE 
    WHEN (SELECT relrowsecurity FROM pg_class WHERE relname = 'banners') = true 
    THEN '✅ RLS está HABILITADO'
    ELSE '⚠️ RLS está DESHABILITADO'
  END AS estado_rls;

-- 4. Contar banners existentes
SELECT COUNT(*) as total_banners FROM banners;

-- 5. Ver banners activos
SELECT id, titulo, activo, orden, created_at 
FROM banners 
ORDER BY orden, created_at DESC 
LIMIT 10;

