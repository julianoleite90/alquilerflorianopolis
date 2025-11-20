# 🚀 Criar Usuário Admin em Produção

⚠️ **IMPORTANTE**: O Supabase Auth **NÃO permite** criar usuários diretamente via SQL por segurança. Use uma das opções abaixo.

## 📋 Passo a Passo

### 1. Acesse o Supabase Dashboard

1. Vá para: https://supabase.com/dashboard
2. Selecione seu projeto de produção

### 2. Criar o Usuário

1. No menu lateral, clique em **Authentication**
2. Clique em **Users**
3. Clique no botão **Add User** (canto superior direito)
4. Selecione **Create new user**

### 3. Preencher os Dados

Preencha o formulário:

- **Email**: `julianodesouzaleite@gmail.com`
- **Password**: `Password90!#%90`
- **Auto Confirm User**: ✅ **Marque esta opção** (importante!)
- **Send invite email**: ❌ Desmarque (não precisa)

### 4. Criar

Clique em **Create User**

### 5. Verificar

Você deve ver o usuário na lista com:
- ✅ Email confirmado
- ✅ Status ativo

## 🔐 Fazer Login

1. Acesse seu site em produção: `https://seu-dominio.com/dashboard`
2. Você será redirecionado para `/dashboard/login`
3. Faça login com:
   - **Email**: `julianodesouzaleite@gmail.com`
   - **Senha**: `Password90!#%90`

## ✅ Pronto!

Agora você tem acesso completo ao dashboard administrativo.

## 🔄 Se Precisar Alterar a Senha

1. No Supabase Dashboard > Authentication > Users
2. Clique no usuário
3. Clique em **Update User**
4. Altere a senha
5. Salve

## 📝 Notas

- O usuário precisa ter o email confirmado para fazer login
- Use a opção "Auto Confirm User" ao criar
- A senha deve ser forte (já está: `Password90!#%90`)

