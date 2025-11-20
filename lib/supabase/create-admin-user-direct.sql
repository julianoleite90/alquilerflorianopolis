-- ============================================
-- CRIAR USUÁRIO ADMIN NO SUPABASE
-- ============================================
-- IMPORTANTE: Supabase Auth NÃO permite criar usuários diretamente via SQL
-- Use uma das opções abaixo:

-- ============================================
-- OPÇÃO 1: VIA DASHBOARD (RECOMENDADO - MAIS FÁCIL)
-- ============================================
-- 1. Acesse: https://supabase.com/dashboard
-- 2. Selecione seu projeto
-- 3. Vá em: Authentication > Users
-- 4. Clique em: "Add User" > "Create new user"
-- 5. Preencha:
--    - Email: julianodesouzaleite@gmail.com
--    - Password: Password90!#%90
--    - Auto Confirm User: ✅ (MARCAR ESTA OPÇÃO!)
--    - Send invite email: ❌ (desmarcar)
-- 6. Clique em: "Create User"
-- 7. Pronto! O usuário está criado e pode fazer login

-- ============================================
-- OPÇÃO 2: VIA SCRIPT NODE.JS
-- ============================================
-- Execute no terminal:
-- npm run admin:create
-- 
-- Requer: SUPABASE_SERVICE_ROLE_KEY no .env.local

-- ============================================
-- OPÇÃO 3: VIA API REST (ADVANCED)
-- ============================================
-- Use a API do Supabase com Service Role Key:
-- POST https://[seu-projeto].supabase.co/auth/v1/admin/users
-- Headers:
--   Authorization: Bearer [SUPABASE_SERVICE_ROLE_KEY]
--   Content-Type: application/json
-- Body:
-- {
--   "email": "julianodesouzaleite@gmail.com",
--   "password": "Password90!#%90",
--   "email_confirm": true,
--   "user_metadata": {
--     "role": "admin"
--   }
-- }

-- ============================================
-- VERIFICAR APÓS CRIAR
-- ============================================
-- Execute este SQL para verificar se foi criado:
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN '✅ Email Confirmado'
    ELSE '❌ Email NÃO Confirmado'
  END as status
FROM auth.users
WHERE email = 'julianodesouzaleite@gmail.com';

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================
-- 1. A senha NÃO pode ser criada via SQL por segurança
-- 2. Use o Dashboard ou a API com Service Role Key
-- 3. Sempre marque "Auto Confirm User" para permitir login imediato
-- 4. Após criar, verifique com: npm run admin:check

