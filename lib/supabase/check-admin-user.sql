-- ============================================
-- VERIFICAR SE O USUÁRIO ADMIN FOI CRIADO
-- Execute este arquivo no Supabase SQL Editor
-- ============================================

-- Consultar usuário admin específico
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  last_sign_in_at,
  updated_at,
  raw_user_meta_data,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN '✅ Email Confirmado'
    ELSE '❌ Email NÃO Confirmado'
  END as status_email,
  CASE 
    WHEN last_sign_in_at IS NOT NULL THEN '✅ Já fez login'
    ELSE '❌ Nunca fez login'
  END as status_login
FROM auth.users
WHERE email = 'julianodesouzaleite@gmail.com';

-- ============================================
-- VERIFICAR TODOS OS USUÁRIOS (se houver mais)
-- ============================================

SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  last_sign_in_at,
  raw_user_meta_data->>'role' as role,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN 'Confirmado'
    ELSE 'Não Confirmado'
  END as email_status
FROM auth.users
ORDER BY created_at DESC;

-- ============================================
-- CONTAR TOTAL DE USUÁRIOS
-- ============================================

SELECT 
  COUNT(*) as total_usuarios,
  COUNT(CASE WHEN email_confirmed_at IS NOT NULL THEN 1 END) as usuarios_confirmados,
  COUNT(CASE WHEN last_sign_in_at IS NOT NULL THEN 1 END) as usuarios_que_fizeram_login
FROM auth.users;

-- ============================================
-- VERIFICAR SE O USUÁRIO ADMIN EXISTE
-- ============================================

SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM auth.users 
      WHERE email = 'julianodesouzaleite@gmail.com'
    ) THEN '✅ Usuário admin EXISTE no banco de dados'
    ELSE '❌ Usuário admin NÃO EXISTE no banco de dados'
  END as resultado;

-- ============================================
-- VERIFICAR DETALHES COMPLETOS DO USUÁRIO ADMIN
-- ============================================

SELECT 
  'ID' as campo,
  id::text as valor
FROM auth.users
WHERE email = 'julianodesouzaleite@gmail.com'

UNION ALL

SELECT 
  'Email' as campo,
  email as valor
FROM auth.users
WHERE email = 'julianodesouzaleite@gmail.com'

UNION ALL

SELECT 
  'Email Confirmado' as campo,
  CASE 
    WHEN email_confirmed_at IS NOT NULL 
    THEN 'Sim (' || email_confirmed_at::text || ')'
    ELSE 'Não'
  END as valor
FROM auth.users
WHERE email = 'julianodesouzaleite@gmail.com'

UNION ALL

SELECT 
  'Criado em' as campo,
  created_at::text as valor
FROM auth.users
WHERE email = 'julianodesouzaleite@gmail.com'

UNION ALL

SELECT 
  'Último Login' as campo,
  CASE 
    WHEN last_sign_in_at IS NOT NULL 
    THEN last_sign_in_at::text
    ELSE 'Nunca fez login'
  END as valor
FROM auth.users
WHERE email = 'julianodesouzaleite@gmail.com'

UNION ALL

SELECT 
  'Role' as campo,
  COALESCE(raw_user_meta_data->>'role', 'Não definido') as valor
FROM auth.users
WHERE email = 'julianodesouzaleite@gmail.com';

-- ============================================
-- NOTAS
-- ============================================
-- 1. A senha NÃO é armazenada em texto plano (é hash)
-- 2. Não é possível ver a senha original por segurança
-- 3. Se o usuário não existe, você precisa criá-lo:
--    - Via Dashboard: Authentication > Users > Add User
--    - Via Script: npm run admin:create
-- 4. Se o email não está confirmado, marque "Auto Confirm User" ao criar
-- 5. Para resetar a senha, use: Authentication > Users > [usuário] > Reset Password

