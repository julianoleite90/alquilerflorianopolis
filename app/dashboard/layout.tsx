import Link from 'next/link'
import { FiHome, FiPlus, FiList, FiLogOut, FiImage, FiTrash2, FiCalendar } from 'react-icons/fi'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-lg min-h-screen sticky top-0">
          <div className="p-6">
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
              <Link
                href="/"
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
              >
                <FiLogOut />
                <span>Volver al sitio</span>
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

