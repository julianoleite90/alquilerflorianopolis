# Configuración de Supabase Storage

Para que el upload de imágenes funcione, necesitas configurar un bucket en Supabase Storage.

## Pasos para configurar:

1. Ve a tu proyecto en Supabase Dashboard
2. Navega a **Storage** en el menú lateral
3. Crea un nuevo bucket llamado `imagenes`
4. Configura las políticas:

### Política para subir imágenes (INSERT):
```sql
CREATE POLICY "Permitir subir imágenes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'imagenes');
```

### Política para leer imágenes (SELECT):
```sql
CREATE POLICY "Permitir leer imágenes públicas"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'imagenes');
```

### Política para eliminar imágenes (DELETE):
```sql
CREATE POLICY "Permitir eliminar imágenes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'imagenes');
```

## Alternativa: Bucket público

Si prefieres hacer el bucket completamente público (más simple pero menos seguro):

1. Al crear el bucket `imagenes`, marca la opción **"Public bucket"**
2. Esto permitirá que cualquiera pueda leer las imágenes sin políticas adicionales

## Nota

Si estás usando Supabase local, el storage también funciona. Solo asegúrate de que el bucket existe.

