# Guía de Configuración

## 1. Instalación de Dependencias

```bash
npm install
```

## 2. Configuración de Supabase

### Opción A: Supabase Local (Desarrollo)

1. Instala Supabase CLI:
```bash
npm install -g supabase
```

2. Inicializa Supabase localmente:
```bash
supabase init
```

3. Inicia Supabase localmente:
```bash
supabase start
```

4. Ejecuta la migración:
```bash
supabase db reset
# O ejecuta manualmente el archivo lib/supabase/migrations.sql en el SQL Editor de Supabase
```

5. Obtén las credenciales:
```bash
supabase status
```

### Opción B: Supabase en la Nube (Producción)

1. Crea una cuenta en [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto
3. Ve a Settings > API y copia:
   - Project URL
   - anon/public key
   - service_role key (solo para operaciones administrativas)

## 3. Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio
```

**Para Supabase local:**
- La URL será algo como: `http://localhost:54321`
- Las claves las obtienes con `supabase status`

## 4. Ejecutar la Migración de Base de Datos

Si usas Supabase local, ejecuta:
```bash
supabase db reset
```

Si usas Supabase en la nube:
1. Ve al SQL Editor en el dashboard de Supabase
2. Copia y pega el contenido de `lib/supabase/migrations.sql`
3. Ejecuta la consulta

## 5. Ejecutar el Proyecto

```bash
npm run dev
```

El sitio estará disponible en `http://localhost:3000`

## 6. Deploy en Vercel

1. Conecta tu repositorio a Vercel
2. En la configuración del proyecto, agrega las variables de entorno:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (opcional, solo si necesitas operaciones administrativas)
3. Vercel detectará automáticamente Next.js y desplegará el proyecto

## Estructura del Dashboard

- `/dashboard` - Lista de todas las propiedades
- `/dashboard/nueva` - Crear nueva propiedad
- `/dashboard/editar/[id]` - Editar propiedad existente

## Notas Importantes

- Las imágenes deben ser URLs públicas (puedes usar servicios como Cloudinary, Imgur, o el storage de Supabase)
- Para producción, considera configurar Row Level Security (RLS) en Supabase para proteger los datos
- El dashboard actualmente no tiene autenticación. Para producción, deberías agregar autenticación con Supabase Auth

