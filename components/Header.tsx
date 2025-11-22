'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FiHome, FiMenu, FiX } from 'react-icons/fi'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom py-3 md:py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 md:space-x-3 group">
            <FiHome className="text-primary-600 text-2xl md:text-3xl lg:text-4xl flex-shrink-0 transition-transform group-hover:scale-110" />
            <div className="flex flex-col leading-[0.9] -space-y-0.5">
              <span className="text-base md:text-lg lg:text-xl font-bold text-primary-600 tracking-tight">Alquiler en</span>
              <span className="text-base md:text-lg lg:text-xl font-bold text-primary-600 tracking-tight">Florianópolis</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link href="/propiedades?regiao=norte_da_ilha" className="text-gray-900 hover:text-gray-700 transition-colors font-semibold text-sm">
              Norte de la Isla
            </Link>
            <Link href="/propiedades?regiao=sul_da_ilha" className="text-gray-900 hover:text-gray-700 transition-colors font-semibold text-sm">
              Sur de la Isla
            </Link>
            <Link href="/propiedades" className="text-gray-900 hover:text-gray-700 transition-colors font-semibold text-sm">
              Todos
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-900 hover:text-primary-600 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3 pt-4">
              <Link 
                href="/propiedades?regiao=norte_da_ilha" 
                className="text-gray-900 hover:text-primary-600 transition-colors font-semibold py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Norte de la Isla
              </Link>
              <Link 
                href="/propiedades?regiao=sul_da_ilha" 
                className="text-gray-900 hover:text-primary-600 transition-colors font-semibold py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Sur de la Isla
              </Link>
              <Link 
                href="/propiedades" 
                className="text-gray-900 hover:text-primary-600 transition-colors font-semibold py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Todos
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

