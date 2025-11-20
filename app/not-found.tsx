import Link from 'next/link'
import type { Metadata } from 'next'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Página no encontrada',
  description: 'La página que buscas no existe.',
  noindex: true,
})

export default function NotFound() {
  return (
    <div className="container-custom py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Página no encontrada</h1>
      <p className="text-gray-600 mb-8">Lo sentimos, la página que buscas no existe.</p>
      <Link href="/" className="btn-primary">
        Volver al inicio
      </Link>
    </div>
  )
}
