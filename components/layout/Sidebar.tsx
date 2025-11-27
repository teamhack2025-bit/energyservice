'use client'

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
  UsersRound
} from 'lucide-react'
import clsx from 'clsx'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Smart Home', href: '/energy-home', icon: Plug },
  { name: 'Weather', href: '/weather', icon: Cloud },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'Energy Sharing', href: '/energy-sharing', icon: UsersRound },
  { name: 'Consumption', href: '/consumption', icon: BarChart3 },
  { name: 'Production', href: '/production', icon: Sun },
  { name: 'Net Balance', href: '/net-balance', icon: DollarSign },
  { name: 'Billing', href: '/billing', icon: FileText },
  { name: 'Contracts', href: '/contracts', icon: FileCheck },
  { name: 'Devices', href: '/devices', icon: Plug },
  { name: 'Forecast', href: '/forecast', icon: TrendingUp },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Support', href: '/support', icon: HelpCircle },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex flex-col flex-grow border-r border-gray-200 bg-white overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4 h-16 border-b border-gray-200">
          <h1 className="text-xl font-bold text-primary">Energy Portal</h1>
        </div>
        <div className="mt-5 flex-1 flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
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
                  <item.icon
                    className={clsx(
                      'mr-3 flex-shrink-0 h-5 w-5',
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                    )}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}

