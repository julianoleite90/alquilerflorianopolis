# 🔐 Configuração de Autenticação Admin

Este guia explica como configurar a autenticação para o dashboard administrativo.

## 📋 Pré-requisitos

- Banco de dados Supabase configurado (execute `setup-database.sql`)
- Variáveis de ambiente configuradas (`.env.local`)
- `SUPABASE_SERVICE_ROLE_KEY` no `.env.local`

## 🚀 Criar Usuário Administrador

### Método 1: Via Script (Recomendado)

Execute o script automatizado:

```bash
npm run admin:create
```

Este script irá:
- ✅ Criar o usuário `julianodesouzaleite@gmail.com`
- ✅ Definir a senha `Password90!#%90`
- ✅ Confirmar o email automaticamente
- ✅ Verificar se o usuário já existe (e atualizar senha se necessário)

**Requisitos:**
- `SUPABASE_SERVICE_ROLE_KEY` deve estar no `.env.local`
- A Service Role Key está em: Supabase Dashboard > Settings > API > service_role (secret)

### Método 2: Via Dashboard do Supabase

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá em **Authentication** > **Users**
3. Clique em **Add User** > **Create new user**
4. Preencha:
   - **Email**: `julianodesouzaleite@gmail.com`
   - **Password**: `Password90!#%90`
   - **Auto Confirm User**: ✅ (marcar)
5. Clique em **Create User**

### Método 3: Via SQL (Não Recomendado)

O Supabase Auth não permite criar usuários diretamente via SQL. Use um dos métodos acima.

## 🔒 Como Funciona

### Proteção de Rotas

- **Middleware**: Redireciona automaticamente para `/dashboard/login` se não autenticado
- **AuthGuard**: Componente que verifica autenticação no cliente
- **Layout**: Protege todas as rotas do dashboard

### Rotas Protegidas

Todas as rotas em `/dashboard/*` (exceto `/dashboard/login`) requerem autenticação:
- `/dashboard` - Lista de propriedades
- `/dashboard/nueva` - Criar propriedade
- `/dashboard/editar/[id]` - Editar propriedade
- `/dashboard/banners` - Gerenciar banners
- `/dashboard/eventos` - Gerenciar eventos

### Página de Login

- **URL**: `/dashboard/login`
- **Redirecionamento**: Se já estiver autenticado, redireciona para `/dashboard`
- **Validação**: Verifica credenciais via Supabase Auth

## 📝 Credenciais Padrão

```
Email: julianodesouzaleite@gmail.com
Senha: Password90!#%90
```

## 🔄 Gerenciar Usuários

### Ver Usuários Existentes

No Supabase Dashboard:
1. Vá em **Authentication** > **Users**
2. Veja a lista de todos os usuários

### Adicionar Novos Usuários

Use o mesmo processo do Método 2 acima, ou execute o script com credenciais diferentes.

### Alterar Senha

1. No Supabase Dashboard > Authentication > Users
2. Clique no usuário
3. Clique em **Reset Password** ou **Update User**

Ou execute o script novamente (ele atualiza a senha se o usuário já existir).

## 🛡️ Segurança

### Row Level Security (RLS)

Para proteger os dados no banco, configure políticas RLS que permitam apenas usuários autenticados:

```sql
-- Exemplo: Permitir apenas usuários autenticados
CREATE POLICY "Usuários autenticados podem gerenciar propriedades"
  ON propiedades FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
```

### Service Role Key

⚠️ **IMPORTANTE**: Nunca exponha a `SUPABASE_SERVICE_ROLE_KEY` no frontend!
- Use apenas em scripts server-side
- Mantenha no `.env.local` (já está no `.gitignore`)
- Não commite no Git

## 🧪 Testar

1. Crie o usuário: `npm run admin:create`
2. Inicie o servidor: `npm run dev`
3. Acesse: `http://localhost:3000/dashboard`
4. Você será redirecionado para `/dashboard/login`
5. Faça login com as credenciais
6. Você será redirecionado para `/dashboard`

## 🆘 Troubleshooting

### Erro: "Service Role Key not found"
- Adicione `SUPABASE_SERVICE_ROLE_KEY` no `.env.local`
- Obtenha a chave em: Supabase Dashboard > Settings > API

### Erro: "User already exists"
- O script detecta e atualiza a senha automaticamente
- Ou delete o usuário no Dashboard e crie novamente

### Não consigo fazer login
- Verifique se o email está correto
- Verifique se o email foi confirmado (Auto Confirm deve estar marcado)
- Verifique as variáveis de ambiente no `.env.local`

### Redirecionamento infinito
- Limpe os cookies do navegador
- Verifique se o middleware está funcionando
- Verifique as variáveis de ambiente

## 📚 Arquivos Relacionados

- `app/dashboard/login/page.tsx` - Página de login
- `components/AuthGuard.tsx` - Componente de proteção
- `middleware.ts` - Middleware de autenticação
- `scripts/create-admin-user.js` - Script para criar usuário
- `lib/supabase/create-admin-user.sql` - Instruções SQL

