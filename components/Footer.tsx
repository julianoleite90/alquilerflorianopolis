import Link from 'next/link'
import { FiHome, FiPhone, FiMail, FiMapPin } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-8 md:py-12 px-4 md:px-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <div>
          <Link href="/" className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-4 group">
            <FiHome className="text-primary-400 text-2xl md:text-3xl lg:text-4xl flex-shrink-0 transition-transform group-hover:scale-110" />
            <div className="flex flex-col leading-[0.9] -space-y-0.5">
              <span className="text-base md:text-lg lg:text-xl font-bold text-white tracking-tight">Alquiler en</span>
              <span className="text-base md:text-lg lg:text-xl font-bold text-white tracking-tight">Florianópolis</span>
            </div>
          </Link>
          <p className="text-xs md:text-sm">
            Tu mejor opción para encontrar alojamiento temporario en Florianópolis. Especialistas en temporada para argentinos.
          </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Enlaces</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-primary-400 transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/propiedades" className="hover:text-primary-400 transition-colors">
                  Propiedades
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <FiPhone className="text-primary-400" />
                <a href="https://wa.me/5548991045052" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">
                  +55 (48) 9-9104-5052
                </a>
                <span className="text-xs text-gray-400">(WhatsApp)</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiMail className="text-primary-400" />
                <a href="mailto:alquiler@tucasaenflorianopolis.com" className="hover:text-primary-400 transition-colors">
                  alquiler@tucasaenflorianopolis.com
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Ubicación</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <FiMapPin className="text-primary-400" />
                <span>Florianópolis, SC - Brasil</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-6 md:mt-8 pt-6 md:pt-8 text-center text-xs md:text-sm">
          <p>&copy; {new Date().getFullYear()} Inmobiliaria. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

