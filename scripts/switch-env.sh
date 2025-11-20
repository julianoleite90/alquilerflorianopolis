#!/bin/bash

# Script para alternar entre ambiente local e produção

ENV_TYPE=$1

if [ -z "$ENV_TYPE" ]; then
  echo "Uso: ./scripts/switch-env.sh [local|production]"
  echo ""
  echo "  local       - Configura para desenvolvimento local (Supabase local)"
  echo "  production  - Configura para produção (Supabase em produção)"
  exit 1
fi

if [ "$ENV_TYPE" = "local" ]; then
  echo "Configurando para ambiente LOCAL..."
  cat > .env.local << 'EOF'
# Supabase Local (desenvolvimento)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0

SUPABASE_URL=http://localhost:54321
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU

NEXT_PUBLIC_SITE_URL=http://localhost:3000
EOF
  echo "✅ Ambiente LOCAL configurado!"
  echo "   Certifique-se de que o Supabase está rodando: supabase start"

elif [ "$ENV_TYPE" = "production" ]; then
  echo "Configurando para ambiente PRODUÇÃO..."
  cat > .env.local << 'EOF'
# Supabase Production
NEXT_PUBLIC_SUPABASE_URL=https://dljqkpaxmkxlmwzmqecb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsanFrcGF4bWt4bG13em1xZWNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1OTk1NjEsImV4cCI6MjA3OTE3NTU2MX0.bQ7oBq6MRy5XX_A1tzVxPfKGbCkZDEMkbv7snNsrA5A

SUPABASE_URL=https://dljqkpaxmkxlmwzmqecb.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsanFrcGF4bWt4bG13em1xZWNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1OTk1NjEsImV4cCI6MjA3OTE3NTU2MX0.bQ7oBq6MRy5XX_A1tzVxPfKGbCkZDEMkbv7snNsrA5A
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRsanFrcGF4bWt4bG13em1xZWNiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzU5OTU2MSwiZXhwIjoyMDc5MTc1NTYxfQ.Nc_LKMq5BLVsxIw-MPpZNuAobe6miVqft0K8y7KVEN8

POSTGRES_URL=postgres://postgres.dljqkpaxmkxlmwzmqecb:RJ5pfSNSFK2wlBj4@aws-1-sa-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true&supa=base-pooler.x
POSTGRES_URL_NON_POOLING=postgres://postgres.dljqkpaxmkxlmwzmqecb:RJ5pfSNSFK2wlBj4@aws-1-sa-east-1.pooler.supabase.com:5432/postgres?sslmode=require
POSTGRES_HOST=db.dljqkpaxmkxlmwzmqecb.supabase.co
POSTGRES_DATABASE=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=RJ5pfSNSFK2wlBj4

NEXT_PUBLIC_SITE_URL=https://alquilerenflorianopolis.com
EOF
  echo "✅ Ambiente PRODUÇÃO configurado!"

else
  echo "❌ Tipo inválido: $ENV_TYPE"
  echo "Use 'local' ou 'production'"
  exit 1
fi

echo ""
echo "📝 Arquivo .env.local atualizado!"
echo "🔄 Reinicie o servidor Next.js para aplicar as mudanças"

