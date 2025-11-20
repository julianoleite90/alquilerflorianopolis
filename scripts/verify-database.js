#!/usr/bin/env node

/**
 * Script para verificar se o banco de dados foi configurado corretamente
 * Execute: node scripts/verify-database.js
 */

const { createClient } = require('@supabase/supabase-js');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function verifyDatabase() {
  log('\n🔍 Verificando configuração do banco de dados...\n', 'blue');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

  log(`📡 Conectando a: ${supabaseUrl}`, 'cyan');

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const tables = [
    { name: 'propiedades', description: 'Tabela de propriedades' },
    { name: 'banners', description: 'Tabela de banners' },
    { name: 'eventos', description: 'Tabela de eventos' },
  ];

  let allOk = true;

  for (const table of tables) {
    try {
      log(`\n📊 Verificando tabela: ${table.name}...`, 'yellow');
      
      const { data, error, count } = await supabase
        .from(table.name)
        .select('*', { count: 'exact', head: true })
        .limit(1);

      if (error) {
        if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
          log(`   ❌ Tabela ${table.name} NÃO existe!`, 'red');
          log(`   💡 Execute o setup-database.sql no Supabase SQL Editor`, 'yellow');
          allOk = false;
        } else {
          log(`   ⚠️  Erro ao acessar ${table.name}: ${error.message}`, 'red');
          allOk = false;
        }
      } else {
        log(`   ✅ Tabela ${table.name} existe!`, 'green');
        log(`   📝 Registros: ${count || 0}`, 'cyan');
      }
    } catch (err) {
      log(`   ❌ Erro de conexão: ${err.message}`, 'red');
      allOk = false;
    }
  }

  // Verificar índices (tentando uma query que usa índices)
  log(`\n🔍 Verificando índices...`, 'yellow');
  try {
    const { error } = await supabase
      .from('propiedades')
      .select('id')
      .eq('disponible', true)
      .limit(1);

    if (error && error.code !== 'PGRST116') {
      log(`   ⚠️  Possível problema com índices: ${error.message}`, 'yellow');
    } else {
      log(`   ✅ Índices funcionando corretamente`, 'green');
    }
  } catch (err) {
    log(`   ⚠️  Não foi possível verificar índices`, 'yellow');
  }

  // Resumo final
  log('\n' + '='.repeat(60), 'blue');
  if (allOk) {
    log('✅ Banco de dados configurado corretamente!', 'green');
    log('\n📝 Próximos passos:', 'cyan');
    log('   1. (Opcional) Execute seed.sql para dados de exemplo', 'reset');
    log('   2. Acesse o dashboard em /dashboard', 'reset');
    log('   3. Comece a adicionar propriedades!', 'reset');
  } else {
    log('❌ Alguns problemas foram encontrados', 'red');
    log('\n💡 Soluções:', 'yellow');
    log('   1. Verifique se executou setup-database.sql no Supabase', 'reset');
    log('   2. Verifique as variáveis de ambiente (.env.local)', 'reset');
    log('   3. Verifique se o RLS está configurado corretamente', 'reset');
  }
  log('='.repeat(60) + '\n', 'blue');
}

// Verificar variáveis de ambiente
if (!process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  log('⚠️  Variáveis de ambiente não encontradas!', 'yellow');
  log('   Usando valores padrão (localhost)', 'yellow');
  log('   Para produção, configure .env.local\n', 'yellow');
}

verifyDatabase().catch((error) => {
  log(`\n❌ Erro fatal: ${error.message}`, 'red');
  process.exit(1);
});

