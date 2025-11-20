# Como Resolver o Problema de Banners Não Salvando

## Diagnóstico

Se você executou `check-banners-rls.sql` e viu `total_banners: 0`, significa que:
- ✅ A tabela `banners` existe
- ❌ Os banners não estão sendo salvos (provavelmente bloqueado por RLS)

## Solução Rápida

### Opção 1: Executar Script de Correção (Recomendado)

1. Acesse o **SQL Editor** no Supabase Dashboard
2. Execute o arquivo: `lib/supabase/fix-banners-rls.sql`
3. Este script irá:
   - Criar políticas RLS para permitir INSERT/UPDATE/DELETE para usuários autenticados
   - Manter a política de leitura pública para banners ativos

### Opção 2: Desabilitar RLS Temporariamente (Apenas para Teste)

Se você quiser testar rapidamente, execute no SQL Editor:

```sql
-- Desabilitar RLS temporariamente (apenas para teste)
ALTER TABLE banners DISABLE ROW LEVEL SECURITY;
```

**⚠️ ATENÇÃO**: Isso permite acesso total sem autenticação. Use apenas para teste e depois reabilite RLS.

### Opção 3: Criar Política Permissiva (Desenvolvimento)

Para desenvolvimento local, você pode criar uma política que permite tudo:

```sql
-- Política permissiva para desenvolvimento
CREATE POLICY "Permitir todo en banners para desarrollo"
  ON banners FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);
```

## Verificar se Funcionou

1. Execute novamente `check-banners-rls.sql` para verificar as políticas
2. Tente criar um banner no dashboard
3. Execute esta query para verificar:

```sql
SELECT id, titulo, activo, orden, created_at 
FROM banners 
ORDER BY created_at DESC;
```

## Erros Comuns

### Erro: "permission denied" ou "policy"
**Solução**: Execute `fix-banners-rls.sql`

### Erro: "relation does not exist"
**Solução**: Execute `setup-database.sql` completo

### Erro: "null value violates not-null constraint"
**Solução**: Certifique-se de que a imagem foi carregada antes de salvar

## Para Produção

Em produção, você DEVE usar as políticas RLS corretas (Opção 1). As políticas criadas por `fix-banners-rls.sql` são seguras e permitem:
- ✅ Leitura pública de banners ativos
- ✅ Criação/edição/deleção apenas para usuários autenticados

## Próximos Passos

1. Execute `fix-banners-rls.sql` no Supabase
2. Tente criar um banner novamente
3. Verifique se aparece na home
4. Se ainda não funcionar, verifique o console do navegador (F12) para ver erros

