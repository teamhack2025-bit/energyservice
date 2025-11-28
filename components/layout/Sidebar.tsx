'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  BarChart3, 
  Sun, 
  DollarSign, 
  FileText, 
  FileCheck, 
  Plug, 
  TrendingUp, 
  Bell, 
  HelpCircle, 
  Settings,
  Cloud,
  Users,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Leaf,
  Brain
} from 'lucide-react'
import clsx from 'clsx'

type NavigationItem = {
  name: string
  href: string
  icon: any
  status?: 'active' | 'deactivated' | 'in-progress'
}

const activeNavigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, status: 'active' },
  { name: 'Smart Home', href: '/energy-home', icon: Plug, status: 'active' },
  { name: 'Weather', href: '/weather', icon: Cloud, status: 'active' },
  { name: 'Consumption', href: '/consumption', icon: BarChart3, status: 'active' },
  { name: 'Devices', href: '/devices', icon: Plug, status: 'active' },
  { name: 'Forecast', href: '/forecast', icon: TrendingUp, status: 'active' },
  { name: 'AI Forecast', href: '/ai-forecast', icon: Brain, status: 'active' },
  { name: 'Sustainability Board', href: '/sustainability', icon: Leaf, status: 'active' },
  { name: 'Notifications', href: '/notifications', icon: Bell, status: 'active' },
]

const comingSoonNavigation: NavigationItem[] = [
  { name: 'Community', href: '/community', icon: Users},
  { name: 'Net Balance', href: '/net-balance', icon: DollarSign},
  { name: 'Billing', href: '/billing', icon: FileText},
  { name: 'Contracts', href: '/contracts', icon: FileCheck},
  { name: 'Support', href: '/support', icon: HelpCircle},
  { name: 'Settings', href: '/settings', icon: Settings},
]

const deactivatedNavigation: NavigationItem[] = [
  { name: 'Production', href: '/production', icon: Sun, status: 'deactivated' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false)

  const renderNavItem = (item: NavigationItem) => {
    const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
    const isDeactivated = item.status === 'deactivated'
    const isInProgress = item.status === 'in-progress'
    
    const content = (
      <>
        <item.icon
          className={clsx(
            'mr-3 flex-shrink-0 h-5 w-5',
            isActive && !isDeactivated && !isInProgress
              ? 'text-white'
              : isDeactivated
              ? 'text-gray-300'
              : 'text-gray-400 group-hover:text-gray-500'
          )}
        />
        <span className="flex-1">{item.name}</span>
        {isInProgress && (
          <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
            Coming Soon
          </span>
        )}
      </>
    )

    if (isDeactivated) {
      return (
        <div
          key={item.name}
          className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-400 cursor-not-allowed opacity-50"
        >
          {content}
        </div>
      )
    }

    return (
      <Link
        key={item.name}
        href={item.href}
        className={clsx(
          'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
          isActive
            ? 'bg-primary text-white'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        )}
      >
        {content}
      </Link>
    )
  }

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex flex-col flex-grow border-r border-gray-200 bg-white overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4 h-16 border-b border-gray-200">
          <h1 className="text-xl font-bold text-primary">Energy Portal</h1>
        </div>
        <div className="mt-5 flex-1 flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
            {/* Active Navigation Items */}
            {activeNavigation.map(renderNavItem)}

            {/* Deactivated Items */}
            {deactivatedNavigation.map(renderNavItem)}
            
            {/* Coming Soon Section */}
            <div className="pt-4">
              <button
                onClick={() => setIsComingSoonOpen(!isComingSoonOpen)}
                className="w-full group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                <Sparkles className="mr-3 flex-shrink-0 h-5 w-5 text-yellow-500" />
                <span className="flex-1 text-left">Coming Soon</span>
                {isComingSoonOpen ? (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
              </button>
              
              {isComingSoonOpen && (
                <div className="mt-1 ml-4 space-y-1">
                  {comingSoonNavigation.map(renderNavItem)}
                </div>
              )}
            </div>

          </nav>
        </div>
      </div>
    </div>
  )
}

