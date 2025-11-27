'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard,
  Users,
  Building2,
  MapPin,
  Plug,
  UsersRound,
  Zap,
  FileText,
  CreditCard,
  FileCheck,
  ShoppingCart,
  TrendingUp,
  Ticket,
  Menu,
  X
} from 'lucide-react'
import clsx from 'clsx'
import { useState } from 'react'

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { 
    name: 'User Management',
    icon: Users,
    children: [
      { name: 'Users', href: '/admin/users', icon: Users },
      { name: 'Customers', href: '/admin/customers', icon: Building2 },
    ]
  },
  {
    name: 'Infrastructure',
    icon: Plug,
    children: [
      { name: 'Sites', href: '/admin/sites', icon: MapPin },
      { name: 'Devices', href: '/admin/devices', icon: Plug },
    ]
  },
  {
    name: 'Community',
    icon: UsersRound,
    children: [
      { name: 'Communities', href: '/admin/communities', icon: UsersRound },
      { name: 'Energy Sharing', href: '/admin/energy-sharing', icon: Zap },
    ]
  },
  { name: 'Energy Readings', href: '/admin/readings', icon: Zap },
  {
    name: 'Financial',
    icon: CreditCard,
    children: [
      { name: 'Invoices', href: '/admin/invoices', icon: FileText },
      { name: 'Payments', href: '/admin/payments', icon: CreditCard },
      { name: 'Contracts', href: '/admin/contracts', icon: FileCheck },
    ]
  },
  {
    name: 'Trading',
    icon: TrendingUp,
    children: [
      { name: 'Offers', href: '/admin/trading/offers', icon: ShoppingCart },
      { name: 'Trades', href: '/admin/trading/trades', icon: TrendingUp },
    ]
  },
  { name: 'Support Tickets', href: '/admin/tickets', icon: Ticket },
]

interface AdminSidebarProps {
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
}

export default function AdminSidebar({ mobileMenuOpen, setMobileMenuOpen }: AdminSidebarProps) {
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  const toggleSection = (name: string) => {
    setExpandedSections(prev => 
      prev.includes(name) 
        ? prev.filter(s => s !== name)
        : [...prev, name]
    )
  }

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + '/')
  }

  const isSectionActive = (children?: { href: string }[]) => {
    if (!children) return false
    return children.some(child => isActive(child.href))
  }

  const renderNavItem = (item: typeof navigation[0]) => {
    if ('children' in item && item.children) {
      const sectionActive = isSectionActive(item.children)
      const isExpanded = expandedSections.includes(item.name) || sectionActive

      return (
        <div key={item.name}>
          <button
            onClick={() => toggleSection(item.name)}
            className={clsx(
              'w-full group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors',
              sectionActive
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            )}
          >
            <div className="flex items-center">
              <item.icon
                className={clsx(
                  'mr-3 flex-shrink-0 h-5 w-5',
                  sectionActive ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'
                )}
              />
              {item.name}
            </div>
            <svg
              className={clsx(
                'h-4 w-4 transition-transform',
                isExpanded ? 'transform rotate-180' : ''
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isExpanded && (
            <div className="ml-4 mt-1 space-y-1">
              {item.children.map((child) => (
                <Link
                  key={child.name}
                  href={child.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={clsx(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    isActive(child.href)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <child.icon
                    className={clsx(
                      'mr-3 flex-shrink-0 h-4 w-4',
                      isActive(child.href) ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                    )}
                  />
                  {child.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      )
    }

    return (
      <Link
        key={item.name}
        href={item.href}
        onClick={() => setMobileMenuOpen(false)}
        className={clsx(
          'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
          isActive(item.href)
            ? 'bg-blue-600 text-white'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        )}
      >
        <item.icon
          className={clsx(
            'mr-3 flex-shrink-0 h-5 w-5',
            isActive(item.href) ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
          )}
        />
        {item.name}
      </Link>
    )
  }

  return (
    <>
      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={clsx(
        'fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:translate-x-0',
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between flex-shrink-0 px-4 h-16 border-b border-gray-200">
            <h1 className="text-xl font-bold text-blue-600">Admin Panel</h1>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto">
            <nav className="px-2 py-4 space-y-1">
              {navigation.map(renderNavItem)}
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}
