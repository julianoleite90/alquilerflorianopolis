# Como Iniciar Supabase Local

## Passo 1: Instalar Supabase CLI

```bash
npm install -g supabase
```

## Passo 2: Iniciar Supabase

```bash
supabase start
```

Isso vai:
- Baixar e iniciar os containers Docker necessários
- Criar as tabelas
- Mostrar as credenciais

## Passo 3: Verificar Status

```bash
supabase status
```

Isso mostrará:
- URL: http://localhost:54321
- Anon Key: (sua chave)
- Service Role Key: (sua chave)

## Passo 4: Executar Migrações

```bash
supabase db reset
```

Ou execute manualmente no SQL Editor:
1. Acesse http://localhost:54323 (Studio do Supabase)
2. Vá em SQL Editor
3. Execute `lib/supabase/migrations.sql`
4. Execute `lib/supabase/migrations_banners_dev.sql`

## Parar Supabase

```bash
supabase stop
```

