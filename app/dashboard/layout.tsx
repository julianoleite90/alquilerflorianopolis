'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import AuthGuard from '@/components/AuthGuard'
import { FiHome, FiPlus, FiList, FiLogOut, FiImage, FiTrash2, FiCalendar, FiUser } from 'react-icons/fi'

function LogoutButton() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email || null)
      }
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/dashboard/login')
    router.refresh()
  }

  return (
    <div className="mt-auto pt-6 border-t border-gray-200">
      {userEmail && (
        <div className="px-4 py-2 mb-2 text-sm text-gray-600 flex items-center gap-2">
          <FiUser className="text-gray-400" />
          <span className="truncate">{userEmail}</span>
        </div>
      )}
      <button
        onClick={handleLogout}
        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
      >
        <FiLogOut />
        <span>Cerrar Sesión</span>
      </button>
      <Link
        href="/"
        className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors mt-2"
      >
        <FiHome />
        <span>Volver al sitio</span>
      </Link>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/dashboard/login'

  // Se for a página de login, não aplicar o layout do dashboard
  if (isLoginPage) {
    return <>{children}</>
  }

  // Para outras páginas do dashboard, aplicar o AuthGuard e o layout
  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 bg-white shadow-lg min-h-screen sticky top-0 flex flex-col">
            <div className="p-6 flex-1">
              <Link href="/dashboard" className="flex items-center space-x-2 mb-8">
                <FiHome className="text-primary-600 text-2xl" />
                <span className="text-xl font-bold text-primary-600">Dashboard</span>
              </Link>
              
              <nav className="space-y-2">
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                >
                  <FiList />
                  <span>Propiedades</span>
                </Link>
                <Link
                  href="/dashboard/nueva"
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                >
                  <FiPlus />
                  <span>Nueva Propiedad</span>
                </Link>
                <Link
                  href="/dashboard/banners"
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                >
                  <FiImage />
                  <span>Banners</span>
                </Link>
                <Link
                  href="/dashboard/eventos"
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                >
                  <FiCalendar />
                  <span>Eventos</span>
                </Link>
                <Link
                  href="/dashboard/limpiar-storage"
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                >
                  <FiTrash2 />
                  <span>Limpiar Storage</span>
                </Link>
              </nav>

              <LogoutButton />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}

