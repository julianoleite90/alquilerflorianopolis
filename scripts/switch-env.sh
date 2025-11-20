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
  echo ""
  echo "⚠️  IMPORTANTE: Você precisa configurar manualmente as credenciais de produção."
  echo "Crie um arquivo .env.local com as seguintes variáveis:"
  echo ""
  echo "NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase"
  echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima"
  echo "SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio"
  echo "NEXT_PUBLIC_SITE_URL=tu_url_del_sitio"
  echo ""
  echo "⚠️  NUNCA commite o arquivo .env.local com credenciais reais!"
  echo ""
  echo "✅ Instruções salvas. Configure manualmente o .env.local com suas credenciais."

else
  echo "❌ Tipo inválido: $ENV_TYPE"
  echo "Use 'local' ou 'production'"
  exit 1
fi

echo ""
echo "📝 Arquivo .env.local atualizado!"
echo "🔄 Reinicie o servidor Next.js para aplicar as mudanças"

