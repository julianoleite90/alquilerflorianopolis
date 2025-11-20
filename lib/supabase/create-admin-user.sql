-- ============================================
-- CREAR USUARIO ADMINISTRADOR
-- Execute este arquivo no Supabase SQL Editor
-- ============================================

-- IMPORTANTE: Este script cria um usuário admin usando Supabase Auth
-- A senha será: Password90!#%90
-- Email: julianodesouzaleite@gmail.com

-- Método 1: Usando a função auth.users (recomendado)
-- Nota: Você precisa usar a Service Role Key para criar usuários diretamente
-- Ou criar o usuário via Dashboard do Supabase

-- ============================================
-- OPÇÃO 1: Criar via Dashboard (Mais Fácil)
-- ============================================
-- 1. Acesse: Supabase Dashboard > Authentication > Users
-- 2. Clique em "Add User" > "Create new user"
-- 3. Preencha:
--    Email: julianodesouzaleite@gmail.com
--    Password: Password90!#%90
--    Auto Confirm User: ✅ (marcar)
-- 4. Clique em "Create User"

-- ============================================
-- OPÇÃO 2: Criar via SQL (Usando Service Role)
-- ============================================
-- ATENÇÃO: Este método requer Service Role Key
-- Execute no SQL Editor do Supabase

-- Primeiro, você precisa gerar o hash da senha
-- Use este comando no terminal (Node.js):
-- node -e "const crypto = require('crypto'); console.log(crypto.createHash('sha256').update('Password90!#%90').digest('hex'));"

-- Ou use a função do Supabase para criar o usuário:
-- Nota: Isso deve ser feito via API ou Dashboard, não diretamente via SQL

-- ============================================
-- OPÇÃO 3: Criar via API/CLI (Recomendado para produção)
-- ============================================

-- Use o script Node.js: scripts/create-admin-user.js
-- Ou use a API do Supabase com Service Role Key

-- ============================================
-- VERIFICAR SE O USUÁRIO FOI CRIADO
-- ============================================

-- Execute esta query para verificar:
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at,
  last_sign_in_at
FROM auth.users
WHERE email = 'julianodesouzaleite@gmail.com';

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================
-- 1. O Supabase Auth não permite criar usuários diretamente via SQL
-- 2. Use o Dashboard ou a API com Service Role Key
-- 3. Após criar, o usuário pode fazer login em /dashboard/login
-- 4. Configure RLS policies para permitir acesso apenas a usuários autenticados

