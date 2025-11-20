#!/usr/bin/env node

/**
 * Script para configurar o banco de dados Supabase
 * Execute: node scripts/setup-database.js
 */

const fs = require('fs');
const path = require('path');

// Cores para output no terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function readSQLFile(filename) {
  const filePath = path.join(__dirname, '..', 'lib', 'supabase', filename);
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    log(`❌ Erro ao ler arquivo ${filename}: ${error.message}`, 'red');
    process.exit(1);
  }
}

function main() {
  log('\n🚀 Setup do Banco de Dados Supabase\n', 'blue');
  
  log('📋 Instruções:', 'yellow');
  log('1. Acesse o Supabase Dashboard (https://supabase.com/dashboard)', 'reset');
  log('2. Selecione seu projeto', 'reset');
  log('3. Vá em "SQL Editor" no menu lateral', 'reset');
  log('4. Clique em "New query"', 'reset');
  log('5. Cole o conteúdo do arquivo setup-database.sql', 'reset');
  log('6. Clique em "Run" para executar', 'reset');
  log('7. (Opcional) Execute o seed.sql para dados de exemplo\n', 'reset');
  
  log('📁 Arquivos SQL disponíveis:', 'yellow');
  log('   - lib/supabase/setup-database.sql (cria todas as tabelas)', 'green');
  log('   - lib/supabase/seed.sql (dados de exemplo)\n', 'green');
  
  log('📝 Conteúdo do setup-database.sql:', 'blue');
  log('─'.repeat(60), 'blue');
  
  const setupSQL = readSQLFile('setup-database.sql');
  console.log(setupSQL);
  
  log('─'.repeat(60), 'blue');
  log('\n✅ Para executar via código, use a biblioteca @supabase/supabase-js', 'green');
  log('   ou execute diretamente no SQL Editor do Supabase.\n', 'green');
}

main();

