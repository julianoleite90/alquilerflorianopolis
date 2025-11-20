# 🚀 Como Criar o Usuário Admin - Passo a Passo

## ✅ Método Recomendado: Via Dashboard do Supabase

### 📍 Passo 1: Acessar o Dashboard

1. Abra seu navegador
2. Acesse: **https://supabase.com/dashboard**
3. Faça login na sua conta
4. **Selecione seu projeto de produção**

### 📍 Passo 2: Ir para Authentication

1. No menu lateral esquerdo, procure por **"Authentication"**
2. Clique em **"Authentication"**
3. No submenu, clique em **"Users"**

### 📍 Passo 3: Criar Novo Usuário

1. No canto superior direito, clique no botão **"Add User"** (ou "Adicionar Usuário")
2. Selecione **"Create new user"** (Criar novo usuário)

### 📍 Passo 4: Preencher os Dados

No formulário que aparecer, preencha:

```
Email: julianodesouzaleite@gmail.com
Password: Password90!#%90
```

**IMPORTANTE - Marque estas opções:**

- ✅ **Auto Confirm User** - **MARQUE ESTA OPÇÃO!** (Essencial para poder fazer login)
- ❌ **Send invite email** - Desmarque (não precisa enviar email)

### 📍 Passo 5: Criar

1. Clique no botão **"Create User"** (ou "Criar Usuário")
2. Aguarde alguns segundos
3. Você verá o usuário na lista

### 📍 Passo 6: Verificar

1. O usuário deve aparecer na lista de usuários
2. Verifique se tem um ✅ ao lado do email (significa que está confirmado)
3. Se não estiver confirmado, clique no usuário e marque "Confirm Email"

## 🔐 Fazer Login

Agora você pode fazer login:

1. Acesse seu site: `https://seu-dominio.com/dashboard`
2. Você será redirecionado para `/dashboard/login`
3. Digite:
   - **Email**: `julianodesouzaleite@gmail.com`
   - **Senha**: `Password90!#%90`
4. Clique em "Iniciar Sesión"

## ✅ Pronto!

Agora você tem acesso ao dashboard administrativo!

## 🆘 Se Tiver Problemas

### Usuário não aparece na lista
- Verifique se você está no projeto correto
- Recarregue a página (F5)

### Não consigo fazer login
- Verifique se "Auto Confirm User" foi marcado
- Se não, clique no usuário e confirme o email manualmente
- Verifique se a senha está correta: `Password90!#%90`

### Esqueci a senha
- No Dashboard > Authentication > Users
- Clique no usuário
- Clique em "Reset Password"
- Ou use "Update User" para definir nova senha

## 📝 Alternativa: Via Script (Se tiver Service Role Key)

Se você tiver a `SUPABASE_SERVICE_ROLE_KEY` configurada no `.env.local`:

```bash
npm run admin:create
```

Mas o método via Dashboard é mais simples e não requer configuração adicional!

