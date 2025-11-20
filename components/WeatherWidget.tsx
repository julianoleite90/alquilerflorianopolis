'use client'

import { useState, useEffect } from 'react'
import { FiThermometer, FiDroplet, FiWind } from 'react-icons/fi'

interface WeatherData {
  temp: number
  description: string
  humidity: number
  windSpeed: number
  icon: string
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Usando wttr.in API (gratuita, não precisa de key)
        const response = await fetch(
          'https://wttr.in/Florianopolis?format=j1&lang=es'
        )
        
        if (response.ok) {
          const data = await response.json()
          const current = data.current_condition[0]
          const weatherDesc = current.lang_es && current.lang_es.length > 0 
            ? current.lang_es[0].value 
            : current.weatherDesc[0].value
            
          setWeather({
            temp: parseInt(current.temp_C),
            description: weatherDesc,
            humidity: parseInt(current.humidity),
            windSpeed: parseInt(current.windspeedKmph),
            icon: getWeatherIconFromCode(current.weatherCode),
          })
        } else {
          throw new Error('API response not ok')
        }
      } catch (error) {
        console.warn('Error al cargar el clima:', error)
        // Dados de ejemplo em caso de erro (clima típico de Florianópolis)
        setWeather({
          temp: 25,
          description: 'Parcialmente nublado',
          humidity: 70,
          windSpeed: 15,
          icon: '🌤️',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
    // Atualizar a cada 30 minutos
    const interval = setInterval(fetchWeather, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const getWeatherIconFromCode = (code: string) => {
    // Códigos do wttr.in
    const codeNum = parseInt(code)
    if (codeNum >= 113 && codeNum <= 116) return '☀️' // Clear/Sunny
    if (codeNum >= 119 && codeNum <= 122) return '☁️' // Cloudy
    if (codeNum >= 143 && codeNum <= 248) return '🌫️' // Fog/Mist
    if (codeNum >= 260 && codeNum <= 263) return '🌫️' // Freezing fog
    if (codeNum >= 266 && codeNum <= 302) return '🌧️' // Rain
    if (codeNum >= 305 && codeNum <= 308) return '🌧️' // Heavy rain
    if (codeNum >= 311 && codeNum <= 314) return '🌦️' // Light rain
    if (codeNum >= 317 && codeNum <= 320) return '🌧️' // Rain
    if (codeNum >= 350 && codeNum <= 353) return '🌧️' // Rain
    if (codeNum >= 356 && codeNum <= 359) return '🌧️' // Heavy rain
    if (codeNum >= 365 && codeNum <= 368) return '🌧️' // Rain
    if (codeNum >= 371 && codeNum <= 377) return '❄️' // Snow
    if (codeNum >= 386 && codeNum <= 395) return '⛈️' // Thunderstorm
    if (codeNum >= 399 && codeNum <= 399) return '⛈️' // Thunderstorm
    return '🌤️' // Default
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl max-w-sm w-full">
        <div className="flex items-center space-x-3">
          <div className="animate-pulse">
            <FiThermometer className="text-3xl" />
          </div>
          <div>
            <div className="text-sm opacity-90 font-medium">Cargando clima...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!weather) return null

  return (
    <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl md:rounded-2xl p-4 md:p-5 lg:p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 max-w-sm w-full">
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <div className="flex-1">
          <div className="text-xs uppercase tracking-wider opacity-80 mb-1 md:mb-2 font-semibold">Clima Actual</div>
          <div className="flex items-baseline gap-1 md:gap-2 mb-1 md:mb-2">
            <div className="text-3xl md:text-4xl lg:text-5xl font-bold">{weather.temp}</div>
            <div className="text-xl md:text-2xl font-light opacity-90">°C</div>
          </div>
          <div className="text-sm md:text-base opacity-90 capitalize font-medium">{weather.description}</div>
        </div>
        <div className="text-3xl md:text-4xl lg:text-5xl ml-2 md:ml-4">{weather.icon}</div>
      </div>
      
      <div className="flex items-center gap-4 md:gap-6 pt-3 md:pt-4 border-t border-white/30">
        <div className="flex items-center gap-1.5 md:gap-2">
          <div className="bg-white/20 rounded-full p-1.5 md:p-2">
            <FiDroplet className="text-sm md:text-lg" />
          </div>
          <div>
            <div className="text-xs opacity-70">Humedad</div>
            <div className="text-xs md:text-sm font-semibold">{weather.humidity}%</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2">
          <div className="bg-white/20 rounded-full p-1.5 md:p-2">
            <FiWind className="text-sm md:text-lg" />
          </div>
          <div>
            <div className="text-xs opacity-70">Viento</div>
            <div className="text-xs md:text-sm font-semibold">{weather.windSpeed} km/h</div>
          </div>
        </div>
      </div>
    </div>
  )
}
