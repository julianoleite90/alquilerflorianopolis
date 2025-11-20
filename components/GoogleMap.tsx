'use client'

import { useEffect, useRef } from 'react'

interface GoogleMapProps {
  direccion: string
  ciudad: string
  provincia: string
  height?: string
}

export default function GoogleMap({ direccion, ciudad, provincia, height = '400px' }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapRef.current) return

    const fullAddress = `${direccion}, ${ciudad}, ${provincia}, Brasil`
    const encodedAddress = encodeURIComponent(fullAddress)

    // Criar iframe do Google Maps (método que não requer API key)
    const iframe = document.createElement('iframe')
    iframe.width = '100%'
    iframe.height = height
    iframe.style.border = '0'
    iframe.loading = 'lazy'
    iframe.allowFullscreen = true
    iframe.referrerPolicy = 'no-referrer-when-downgrade'
    
    // Usar Google Maps Embed sem API key
    iframe.src = `https://www.google.com/maps?q=${encodedAddress}&output=embed&hl=es`

    mapRef.current.innerHTML = ''
    mapRef.current.appendChild(iframe)
  }, [direccion, ciudad, provincia, height])

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-md border border-gray-200">
      <div ref={mapRef} className="w-full" style={{ height }} />
    </div>
  )
}

