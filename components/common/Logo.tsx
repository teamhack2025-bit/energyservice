'use client'

import { Zap } from 'lucide-react'

interface LogoProps {
  className?: string
  isDark?: boolean
}

export default function Logo({ className = '', isDark = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-0 ${className}`}>
      {/* App Name with Thunder Icon */}
      <div className="flex items-center gap-0">
        {/* WATT */}
        <span className={`
          text-lg font-black tracking-tight leading-none
          ${isDark ? 'text-white' : 'text-gray-900'}
          transition-colors duration-300
        `}>
          WATT
        </span>
        
        {/* Thunder Icon replacing apostrophe */}
        <div className="relative mx-0.5">
          <Zap 
            className={`
              h-4 w-4 text-yellow-500
              fill-yellow-500
              drop-shadow-md
            `}
            strokeWidth={2.5}
          />
          {/* Glow effect */}
          <Zap 
            className={`
              absolute inset-0 h-4 w-4 text-yellow-400/50
              fill-yellow-400/50
              blur-[1px]
            `}
            strokeWidth={2.5}
          />
        </div>
        
        {/* S */}
        <span className={`
          text-lg font-black tracking-tight leading-none
          ${isDark ? 'text-white' : 'text-gray-900'}
          transition-colors duration-300
        `}>
          S
        </span>
        
        {/* Space */}
        <span className="w-2"></span>
        
        {/* NEXT */}
        <span className={`
          text-lg font-black tracking-tight leading-none
          ${isDark ? 'text-white' : 'text-gray-900'}
          transition-colors duration-300
        `}>
          NEXT
        </span>
      </div>
    </div>
  )
}

