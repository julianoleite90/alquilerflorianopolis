#!/usr/bin/env node

/**
 * Script para verificar se o usuário admin foi criado no Supabase
 * Execute: node scripts/check-admin-user.js
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
  gray: '\x1b[90m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function checkAdminUser() {
  log('\n🔍 Verificando usuário admin no Supabase...\n', 'blue');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    log('❌ Erro: Variáveis de ambiente não encontradas!', 'red');
    log('\n📝 Configure no .env.local:', 'yellow');
    log('   NEXT_PUBLIC_SUPABASE_URL=sua_url', 'reset');
    log('   SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key\n', 'reset');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  const email = 'julianodesouzaleite@gmail.com';

  try {
    log(`📧 Buscando usuário: ${email}`, 'cyan');

    // Listar todos os usuários e encontrar o admin
    const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
      log(`❌ Erro ao listar usuários: ${listError.message}`, 'red');
      process.exit(1);
    }

    const adminUser = usersData?.users?.find(u => u.email === email);

    if (!adminUser) {
      log('\n❌ Usuário admin NÃO encontrado!', 'red');
      log('\n💡 Para criar o usuário:', 'yellow');
      log('   1. Via Dashboard: Supabase > Authentication > Users > Add User', 'reset');
      log('   2. Via Script: npm run admin:create', 'reset');
      log('   3. Email: julianodesouzaleite@gmail.com', 'reset');
      log('   4. Senha: Password90!#%90', 'reset');
      log('   5. Marque "Auto Confirm User"\n', 'reset');
      process.exit(1);
    }

    // Usuário encontrado - mostrar detalhes
    log('\n✅ Usuário admin ENCONTRADO!\n', 'green');
    log('📋 Detalhes do usuário:', 'cyan');
    log('─'.repeat(60), 'gray');
    log(`   ID: ${adminUser.id}`, 'reset');
    log(`   Email: ${adminUser.email}`, 'reset');
    log(`   Criado em: ${new Date(adminUser.created_at).toLocaleString('pt-BR')}`, 'reset');
    
    if (adminUser.email_confirmed_at) {
      log(`   ✅ Email confirmado: ${new Date(adminUser.email_confirmed_at).toLocaleString('pt-BR')}`, 'green');
    } else {
      log(`   ❌ Email NÃO confirmado`, 'red');
      log(`   💡 Marque "Auto Confirm User" ao criar ou atualize o usuário`, 'yellow');
    }

    if (adminUser.last_sign_in_at) {
      log(`   ✅ Último login: ${new Date(adminUser.last_sign_in_at).toLocaleString('pt-BR')}`, 'green');
    } else {
      log(`   ⚠️  Nunca fez login ainda`, 'yellow');
    }

    if (adminUser.user_metadata?.role) {
      log(`   Role: ${adminUser.user_metadata.role}`, 'reset');
    }

    log('─'.repeat(60), 'gray');

    // Estatísticas gerais
    const totalUsers = usersData?.users?.length || 0;
    const confirmedUsers = usersData?.users?.filter(u => u.email_confirmed_at).length || 0;
    const usersWithLogin = usersData?.users?.filter(u => u.last_sign_in_at).length || 0;

    log('\n📊 Estatísticas gerais:', 'cyan');
    log(`   Total de usuários: ${totalUsers}`, 'reset');
    log(`   Usuários confirmados: ${confirmedUsers}`, 'reset');
    log(`   Usuários que fizeram login: ${usersWithLogin}`, 'reset');

    // Verificar se pode fazer login
    log('\n🔐 Status de login:', 'cyan');
    if (adminUser.email_confirmed_at) {
      log('   ✅ Usuário pode fazer login', 'green');
      log('   📝 Credenciais:', 'reset');
      log(`      Email: ${email}`, 'reset');
      log(`      Senha: Password90!#%90`, 'reset');
      log('   🔗 Acesse: /dashboard/login\n', 'cyan');
    } else {
      log('   ❌ Usuário NÃO pode fazer login (email não confirmado)', 'red');
      log('   💡 Confirme o email ou recrie o usuário com "Auto Confirm User"\n', 'yellow');
    }

  } catch (error) {
    log(`\n❌ Erro fatal: ${error.message}`, 'red');
    if (error.cause) {
      log(`   Causa: ${error.cause.message || error.cause}`, 'yellow');
    }
    process.exit(1);
  }
}

checkAdminUser();

