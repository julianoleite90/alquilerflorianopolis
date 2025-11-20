# 🗄️ Setup do Banco de Dados Supabase

Este guia explica como configurar o banco de dados Supabase para o projeto.

## 📋 Pré-requisitos

- Conta no Supabase (https://supabase.com)
- Projeto criado no Supabase
- Variáveis de ambiente configuradas (`.env.local`)

## 🚀 Método 1: Via SQL Editor (Recomendado)

### Passo 1: Criar as Tabelas

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione seu projeto
3. Vá em **SQL Editor** no menu lateral
4. Clique em **New query**
5. Abra o arquivo `lib/supabase/setup-database.sql` e copie todo o conteúdo
6. Cole no SQL Editor
7. Clique em **Run** (ou pressione `Ctrl/Cmd + Enter`)

### Passo 2: Inserir Dados de Exemplo (Opcional)

1. No mesmo SQL Editor, clique em **New query**
2. Abra o arquivo `lib/supabase/seed.sql` e copie todo o conteúdo
3. Cole no SQL Editor
4. Clique em **Run**

## 🔧 Método 2: Via Script Node.js (Automático)

Você pode executar as migrações programaticamente:

```bash
# Instalar dependências (se ainda não instalou)
npm install

# Executar setup
node scripts/setup-database.js
```

## 📊 Estrutura das Tabelas

### `propiedades`
Tabela principal para armazenar as propriedades para aluguel.

**Campos principais:**
- `titulo`, `descripcion`, `tipo`
- `precio`, `moneda` (USD/BRL), `periodo` (diaria/mensal)
- `direccion`, `ciudad`, `provincia`, `codigo_postal`
- `regiao` (norte_da_ilha, sul_da_ilha, centro, continente)
- `barrio` (canasvieiras, jurere_internacional, etc.)
- `habitaciones`, `banios`, `metros_cuadrados`
- `estadia_minima`
- `imagenes` (array de URLs)
- `caracteristicas` (array de strings)
- `disponible` (boolean)

### `banners`
Tabela para banners do carrossel na homepage.

**Campos principais:**
- `titulo`, `descripcion`
- `imagen_url`
- `enlace` (link opcional)
- `orden` (ordem de exibição)
- `activo` (boolean)

### `eventos`
Tabela para eventos da programação em Florianópolis.

**Campos principais:**
- `titulo`, `descripcion`
- `fecha_inicio`, `fecha_fin`
- `hora_inicio`, `hora_fin`
- `localizacao`, `cidade`
- `imagem`, `link_externo`
- `ativo` (boolean)

## 🔒 Row Level Security (RLS)

Por padrão, as tabelas têm RLS habilitado com políticas que permitem:

- **Leitura pública**: Apenas registros com `disponible = true` (propiedades), `activo = true` (banners/eventos)
- **Escrita**: Requer autenticação (você precisará configurar políticas de autenticação)

### Para Desenvolvimento Local

Se estiver usando Supabase local ou quiser desabilitar RLS temporariamente:

```sql
-- Desabilitar RLS (apenas para desenvolvimento)
ALTER TABLE propiedades DISABLE ROW LEVEL SECURITY;
ALTER TABLE banners DISABLE ROW LEVEL SECURITY;
ALTER TABLE eventos DISABLE ROW LEVEL SECURITY;
```

Ou criar políticas mais permissivas:

```sql
-- Permitir tudo para desenvolvimento
CREATE POLICY "Permitir todo para desenvolvimento"
  ON propiedades FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);
```

## 📝 Verificar se Funcionou

### Método 1: Via Script (Recomendado)

Execute o script de verificação:

```bash
npm run db:verify
```

Este script irá:
- ✅ Verificar se todas as tabelas existem
- ✅ Contar registros em cada tabela
- ✅ Testar a conexão com o banco
- ✅ Verificar se os índices estão funcionando

### Método 2: Via Supabase Dashboard

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard)
2. Vá em **Table Editor**
3. Você deve ver as tabelas: `propiedades`, `banners`, `eventos`
4. Se executou o seed, deve ver dados de exemplo

### Método 3: Testar no Aplicativo

1. Inicie o servidor: `npm run dev`
2. Acesse `http://localhost:3000/dashboard`
3. Tente criar uma nova propriedade
4. Se funcionar, o banco está configurado corretamente!

## 🔄 Atualizar Schema

Se precisar adicionar novas colunas ou modificar a estrutura:

1. Crie um novo arquivo SQL em `lib/supabase/migrations_*.sql`
2. Execute no SQL Editor do Supabase
3. Atualize os tipos TypeScript em `types/database.types.ts`

## 🆘 Troubleshooting

### Erro: "relation already exists"
- As tabelas já existem. Isso é normal se você já executou o setup antes.

### Erro: "permission denied"
- Verifique as políticas de RLS ou desabilite temporariamente para desenvolvimento.

### Erro: "column does not exist"
- Execute todas as migrações na ordem correta:
  1. `setup-database.sql` (criação inicial)
  2. Migrações adicionais (se houver)

## 📚 Arquivos Relacionados

- `lib/supabase/setup-database.sql` - Setup completo do banco
- `lib/supabase/seed.sql` - Dados de exemplo
- `types/database.types.ts` - Tipos TypeScript do banco
- `lib/supabase/migrations_*.sql` - Migrações adicionais

