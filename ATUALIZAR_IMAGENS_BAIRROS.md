# Como Atualizar Imagens dos Bairros para Praia

## Problema
Os bairros Jurerê Internacional, Campeche e Lagoa da Conceição não estão usando imagens de praia.

## Solução Recomendada: Atualizar pelo Dashboard

1. **Acesse o Dashboard:**
   - Vá para `/dashboard/barrios`
   - Faça login se necessário

2. **Edite cada bairro:**
   - Clique em "Editar" no bairro **Jurerê Internacional**
   - No campo "Imagen de Portada", substitua a URL atual por:
     ```
     https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=60
     ```
   - Clique em "Actualizar Barrio"
   
   - Repita o processo para **Campeche**
   - Repita o processo para **Lagoa da Conceição**

3. **Verificar:**
   - Após atualizar, acesse a home page
   - Faça um hard refresh (Ctrl+Shift+R ou Cmd+Shift+R)
   - As imagens devem aparecer atualizadas

## Alternativa: SQL Direto

Se preferir usar SQL, execute primeiro o script de verificação:

```sql
-- Verificar imagens atuais
SELECT slug, nombre, cover_image 
FROM barrios 
WHERE slug IN ('jurere_internacional', 'campeche', 'lagoa_da_conceicao');
```

Depois execute o UPDATE:

```sql
UPDATE barrios 
SET cover_image = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=60',
    updated_at = NOW()
WHERE slug IN ('jurere_internacional', 'campeche', 'lagoa_da_conceicao');
```

## Nota sobre Cache

Se após atualizar ainda não aparecer:
- Faça um hard refresh no navegador
- Limpe o cache do navegador
- Aguarde alguns minutos (o Next.js pode fazer cache estático)
- Se estiver em produção, pode ser necessário fazer um novo deploy

