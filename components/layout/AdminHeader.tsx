'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, LogOut, User } from 'lucide-react'
import { useAdminAuth } from '@/lib/hooks/useAdminAuth'

interface AdminHeaderProps {
  setMobileMenuOpen: (open: boolean) => void
}

export default function AdminHeader({ setMobileMenuOpen }: AdminHeaderProps) {
  const router = useRouter()
  const { user, logout } = useAdminAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push('/admin/login')
  }

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AD'

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Page title - can be customized per page */}
        <div className="flex-1 md:ml-0">
          <h2 className="text-lg font-semibold text-gray-900">
            {/* This will be overridden by page-specific titles */}
          </h2>
        </div>

        {/* Right side - User menu */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {initials}
              </div>
              <span className="hidden md:block text-sm font-medium">
                {user?.name || 'Admin'}
              </span>
            </button>
            
            {showUserMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-200">
                      <div className="font-medium text-gray-900">{user?.name || 'Admin'}</div>
                      <div className="text-xs">{user?.email}</div>
                      <div className="text-xs mt-1 capitalize">{user?.role?.replace('_', ' ')}</div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
