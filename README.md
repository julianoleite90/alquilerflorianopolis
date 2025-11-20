# Inmobiliaria - Alquiler Temporario en Florianópolis

Sitio web moderno de inmobiliaria especializado en alquiler temporario de propiedades en Florianópolis, SC - Brasil, dirigido al público argentino que busca alojamiento para la temporada.

## Tecnologías

- Next.js 14
- TypeScript
- Tailwind CSS
- Supabase
- Vercel (deploy)

## Configuración

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.local.example .env.local
```

Editar `.env.local` con tus credenciales de Supabase:
- `NEXT_PUBLIC_SUPABASE_URL`: URL de tu proyecto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Clave anónima pública
- `SUPABASE_SERVICE_ROLE_KEY`: Clave de servicio (solo backend)

3. Ejecutar en desarrollo:
```bash
npm run dev
```

4. Para producción en Vercel:
- Conectar el repositorio a Vercel
- Agregar las variables de entorno en la configuración del proyecto
- Deploy automático en cada push

## Estructura del Proyecto

- `/app` - Páginas y rutas de Next.js
- `/components` - Componentes reutilizables
- `/lib` - Utilidades y configuración de Supabase
- `/types` - Tipos TypeScript

