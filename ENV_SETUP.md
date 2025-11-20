# Configuração de Variáveis de Ambiente

Este projeto suporta tanto desenvolvimento local quanto produção.

## 🚀 Alternando entre Ambientes

A forma mais fácil de alternar entre local e produção é usar os scripts npm:

```bash
# Configurar para desenvolvimento LOCAL
npm run env:local

# Configurar para PRODUÇÃO
npm run env:production
```

Depois de executar o comando, reinicie o servidor Next.js:
```bash
npm run dev
```

## 📝 Desenvolvimento Local

Para desenvolvimento local com Supabase local:

1. Configure para ambiente local:
   ```bash
   npm run env:local
   ```

2. Certifique-se de que o Supabase está rodando localmente:
   ```bash
   supabase start
   ```

3. Inicie o servidor:
   ```bash
   npm run dev
   ```

O código já tem fallback para valores locais caso o `.env.local` não exista:
- `NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (chave padrão do Supabase local)

## 🌐 Produção

Para produção:

1. Configure para ambiente de produção:
   ```bash
   npm run env:production
   ```

2. O arquivo `.env.local` será atualizado com as credenciais de produção

**Importante:** 
- O arquivo `.env.local` está no `.gitignore` e não será commitado
- Para deploy no Vercel, configure as variáveis de ambiente diretamente no painel do Vercel
- Use as mesmas variáveis que estão no `.env.local` atual

### Variáveis necessárias no Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=https://dljqkpaxmkxlmwzmqecb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsanFrcGF4bWt4bG13em1xZWNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1OTk1NjEsImV4cCI6MjA3OTE3NTU2MX0.bQ7oBq6MRy5XX_A1tzVxPfKGbCkZDEMkbv7snNsrA5A
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsanFrcGF4bWt4bG13em1xZWNiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzU5OTU2MSwiZXhwIjoyMDc5MTc1NTYxfQ.Nc_LKMq5BLVsxIw-MPpZNuAobe6miVqft0K8y7KVEN8
NEXT_PUBLIC_SITE_URL=https://alquilerenflorianopolis.com
```

## 🔄 Status Atual

**Por padrão, o projeto está configurado para PRODUÇÃO** (arquivo `.env.local` criado com credenciais de produção).

Para voltar ao desenvolvimento local, execute:
```bash
npm run env:local
```

