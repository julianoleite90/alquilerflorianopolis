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
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio
NEXT_PUBLIC_SITE_URL=tu_url_del_sitio
```

## 🔄 Status Atual

**Por padrão, o projeto está configurado para PRODUÇÃO** (arquivo `.env.local` criado com credenciais de produção).

Para voltar ao desenvolvimento local, execute:
```bash
npm run env:local
```

