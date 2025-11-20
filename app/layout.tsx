import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Su Temporada Comienza Aquí - Alquiler en Florianópolis',
  description: 'Encuentra tu alojamiento perfecto para la temporada en Florianópolis. Casas, departamentos y más cerca de las mejores playas de Brasil. Reserva ahora y disfruta de la mejor temporada en Floripa.',
  keywords: ['alquiler temporario florianópolis', 'alquiler florianópolis', 'casas florianópolis', 'departamentos florianópolis', 'temporada florianópolis', 'alquiler floripa', 'propiedades florianópolis', 'alquiler argentinos florianópolis'],
  authors: [{ name: 'Alquiler en Florianópolis' }],
  creator: 'Alquiler en Florianópolis',
  publisher: 'Alquiler en Florianópolis',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://alquilerenflorianopolis.com'),
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://alquilerenflorianopolis.com',
    siteName: 'Alquiler en Florianópolis',
    title: 'Inicio - Alquiler en Florianópolis',
    description: 'Encuentra tu alojamiento perfecto para la temporada en Florianópolis. Casas, departamentos y más cerca de las mejores playas de Brasil.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Inicio - Alquiler en Florianópolis',
    description: 'Encuentra tu alojamiento perfecto para la temporada en Florianópolis. Casas, departamentos y más cerca de las mejores playas de Brasil.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es-AR">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <WhatsAppFloatingButton />
      </body>
    </html>
  )
}

