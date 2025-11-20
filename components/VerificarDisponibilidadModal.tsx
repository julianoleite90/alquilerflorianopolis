'use client'

import { useState } from 'react'
import { FiX, FiCalendar, FiUser, FiMail, FiPhone, FiMessageSquare, FiCheck, FiClock, FiSearch, FiDatabase, FiShield } from 'react-icons/fi'

interface VerificarDisponibilidadModalProps {
  isOpen: boolean
  onClose: () => void
  propiedadTitulo: string
}

export default function VerificarDisponibilidadModal({ isOpen, onClose, propiedadTitulo }: VerificarDisponibilidadModalProps) {
  const [step, setStep] = useState<'form' | 'checking' | 'success'>('form')
  const [checkingMessage, setCheckingMessage] = useState('')
  const [checkingIcon, setCheckingIcon] = useState<React.ReactNode>(null)
  const [formData, setFormData] = useState({
    fechaEntrada: '',
    fechaSalida: '',
    nombreCompleto: '',
    email: '',
    whatsapp: '',
    mensaje: '',
  })

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStep('checking')
    
    // Sequência de mensagens com ícones
    setCheckingMessage('Verificando disponibilidad...')
    setCheckingIcon(<FiSearch className="text-primary-600 text-3xl animate-pulse" />)
    
    setTimeout(() => {
      setCheckingMessage('Checando fechas...')
      setCheckingIcon(<FiCalendar className="text-primary-600 text-3xl animate-pulse" />)
    }, 2000)

    setTimeout(() => {
      setCheckingMessage('Consultando base de datos...')
      setCheckingIcon(<FiDatabase className="text-primary-600 text-3xl animate-pulse" />)
    }, 4000)

    setTimeout(() => {
      setCheckingMessage('Validando reservas...')
      setCheckingIcon(<FiShield className="text-primary-600 text-3xl animate-pulse" />)
    }, 6000)

    setTimeout(() => {
      setCheckingMessage('Procesando solicitud...')
      setCheckingIcon(<FiClock className="text-primary-600 text-3xl animate-pulse" />)
    }, 8000)

    setTimeout(() => {
      setStep('success')
    }, 10000)
  }

  const handleClose = () => {
    setStep('form')
    setCheckingMessage('')
    setCheckingIcon(null)
    setFormData({
      fechaEntrada: '',
      fechaSalida: '',
      nombreCompleto: '',
      email: '',
      whatsapp: '',
      mensaje: '',
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={handleClose}>
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-primary-600 text-white p-4 rounded-t-xl flex items-center justify-between">
          <h2 className="text-lg font-bold">Verificar Disponibilidad</h2>
          <button
            onClick={handleClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          {step === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-3 mb-4">
                <p className="text-primary-800 font-semibold text-sm mb-1">Propiedad:</p>
                <p className="text-primary-700 text-sm">{propiedadTitulo}</p>
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-gray-700">
                    Fecha Entrada *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.fechaEntrada}
                    onChange={(e) => setFormData({ ...formData, fechaEntrada: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-gray-700">
                    Fecha Salida *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.fechaSalida}
                    onChange={(e) => setFormData({ ...formData, fechaSalida: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"
                    min={formData.fechaEntrada || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {/* Datos de contacto */}
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-gray-700">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombreCompleto}
                  onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"
                  placeholder="Ej: Juan Pérez"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5 text-gray-700">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"
                  placeholder="ejemplo@email.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5 text-gray-700">
                  WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"
                  placeholder="+54 11 1234-5678"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5 text-gray-700">
                  Mensaje Adicional
                </label>
                <textarea
                  value={formData.mensaje}
                  onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none text-sm"
                  placeholder="Información adicional..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Verificar Disponibilidad
              </button>
            </form>
          )}

          {step === 'checking' && (
            <div className="text-center py-8">
              <div className="mb-6 flex justify-center">
                {checkingIcon && (
                  <div className="bg-primary-50 rounded-full p-4 border-2 border-primary-200">
                    {checkingIcon}
                  </div>
                )}
              </div>
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent mb-4"></div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{checkingMessage}</h3>
              <p className="text-sm text-gray-500">Por favor espera...</p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <FiCheck className="text-green-600 text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">¡Solicitud Enviada!</h3>
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-4">
                <p className="text-primary-800 font-semibold mb-1 text-sm">Esta propiedad está pre-reservada</p>
                <p className="text-primary-700 text-sm">
                  Un atendente va a entrar en contacto por el WhatsApp informado en las próximas horas.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-sm"
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

