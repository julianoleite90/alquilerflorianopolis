import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Proteger rotas do dashboard (exceto /dashboard/login)
  if (request.nextUrl.pathname.startsWith('/dashboard') && 
      request.nextUrl.pathname !== '/dashboard/login') {
    
    const response = NextResponse.next()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard/login'
      return NextResponse.redirect(url)
    }
  }

  // Redirecionar de /dashboard/login se já estiver autenticado
  if (request.nextUrl.pathname === '/dashboard/login') {
    const response = NextResponse.next()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    const { data: { session } } = await supabase.auth.getSession()

    if (session) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
    
    // Permitir acesso à página de login se não estiver autenticado
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
}

