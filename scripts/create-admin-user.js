#!/usr/bin/env node

/**
 * Script para criar usuário administrador no Supabase
 * Execute: node scripts/create-admin-user.js
 * 
 * Requer: SUPABASE_SERVICE_ROLE_KEY no .env.local
 */

require('dotenv').config({ path: '.env.local' });
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

async function createAdminUser() {
  log('\n🔐 Criando usuário administrador...\n', 'blue');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    log('❌ Erro: Variáveis de ambiente não encontradas!', 'red');
    log('\n📝 Configure no .env.local:', 'yellow');
    log('   NEXT_PUBLIC_SUPABASE_URL=sua_url', 'reset');
    log('   SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key\n', 'reset');
    log('💡 A Service Role Key está em:', 'cyan');
    log('   Supabase Dashboard > Settings > API > service_role (secret)\n', 'reset');
    process.exit(1);
  }

  // Debug: mostrar URL (sem mostrar a chave)
  log(`🔗 Conectando a: ${supabaseUrl}`, 'cyan');
  log(`🔑 Service Role Key: ${serviceRoleKey.substring(0, 20)}...`, 'cyan');

  // Criar cliente com Service Role Key (tem permissões administrativas)
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  const email = 'julianodesouzaleite@gmail.com';
  const password = 'Password90!#%90';

  try {
    log(`📧 Criando usuário: ${email}`, 'cyan');

    // Verificar se o usuário já existe
    const { data: existingUser } = await supabase.auth.admin.listUsers();
    const userExists = existingUser?.users?.find(u => u.email === email);

    if (userExists) {
      log(`⚠️  Usuário ${email} já existe!`, 'yellow');
      log(`   ID: ${userExists.id}`, 'cyan');
      log(`   Criado em: ${userExists.created_at}`, 'cyan');
      
      // Tentar atualizar a senha
      log('\n🔄 Atualizando senha...', 'yellow');
      const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
        userExists.id,
        { password }
      );

      if (updateError) {
        log(`   ❌ Erro ao atualizar senha: ${updateError.message}`, 'red');
      } else {
        log(`   ✅ Senha atualizada com sucesso!`, 'green');
      }
      
      return;
    }

    // Criar novo usuário
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Confirmar email automaticamente
      user_metadata: {
        role: 'admin',
        name: 'Admin'
      }
    });

    if (error) {
      log(`❌ Erro ao criar usuário: ${error.message}`, 'red');
      process.exit(1);
    }

    if (data.user) {
      log(`\n✅ Usuário criado com sucesso!`, 'green');
      log(`   ID: ${data.user.id}`, 'cyan');
      log(`   Email: ${data.user.email}`, 'cyan');
      log(`   Email confirmado: ${data.user.email_confirmed_at ? 'Sim' : 'Não'}`, 'cyan');
      
      log('\n📝 Credenciais de login:', 'yellow');
      log(`   Email: ${email}`, 'reset');
      log(`   Senha: ${password}`, 'reset');
      
      log('\n🔗 Acesse o login em:', 'cyan');
      log('   http://localhost:3000/dashboard/login\n', 'reset');
    }
  } catch (error) {
    log(`\n❌ Erro fatal: ${error.message}`, 'red');
    if (error.cause) {
      log(`   Causa: ${error.cause.message || error.cause}`, 'yellow');
    }
    log('\n💡 Verifique:', 'yellow');
    log('   1. A URL do Supabase está correta?', 'reset');
    log('   2. A Service Role Key está correta?', 'reset');
    log('   3. Você tem conexão com a internet?', 'reset');
    log('   4. O Supabase está acessível?', 'reset');
    process.exit(1);
  }
}

createAdminUser();

