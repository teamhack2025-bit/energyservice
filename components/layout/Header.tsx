'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Bell, ChevronDown, User, LogOut, Settings } from 'lucide-react'
import { mockNotifications } from '@/lib/mockData'
import { createClient } from '@/lib/supabase-browser'

export default function Header() {
  const router = useRouter()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [customerData, setCustomerData] = useState<any>(null)
  const [authUser, setAuthUser] = useState<any>(null)
  const unreadCount = mockNotifications.filter(n => !n.read).length
  const supabase = createClient()

  useEffect(() => {
    async function loadUserData() {
      // Get authenticated user
      const { data: { user } } = await supabase.auth.getUser()
      console.log('Header - Auth User:', user)
      setAuthUser(user)
      
      if (user) {
        // Try to find customer by auth_user_id first
        const { data: customerByAuth } = await supabase
          .from('customers')
          .select('*')
          .eq('auth_user_id', user.id)
          .maybeSingle()
        
        console.log('Header - Customer by auth_user_id:', customerByAuth)
        
        // Fallback to email
        if (!customerByAuth) {
          const { data: customerByEmail } = await supabase
            .from('customers')
            .select('*')
            .eq('email', user.email)
            .maybeSingle()
          
          console.log('Header - Customer by email:', customerByEmail)
          setCustomerData(customerByEmail)
        } else {
          setCustomerData(customerByAuth)
        }
      }
    }
    loadUserData()
  }, [])

  // Use customer data if available, otherwise fall back to auth user or mock
  const displayName = customerData?.name || authUser?.user_metadata?.full_name || 'User'
  const displayEmail = customerData?.email || authUser?.email || ''
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

  const handleLogout = () => {
    setShowUserMenu(false)
    // Navigate to logout page which will handle the logout process
    router.push('/logout')
  }

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="flex items-center justify-end h-16 px-4 md:pl-72">
        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-danger rounded-full"></span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Notifications</h3>
                    <span className="text-sm text-gray-500">{unreadCount} unread</span>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {mockNotifications.slice(0, 5).map((notification) => (
                    <Link
                      key={notification.id}
                      href={notification.actionUrl || '#'}
                      className="block p-4 hover:bg-gray-50 border-b border-gray-100"
                    >
                      <div className="flex items-start">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                        </div>
                        {!notification.read && (
                          <span className="ml-2 h-2 w-2 bg-primary rounded-full"></span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-200">
                  <Link href="/notifications" className="text-sm text-primary hover:underline">
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                {initials}
              </div>
              <span className="hidden md:block text-sm font-medium">
                {displayName}
              </span>
              <ChevronDown className="hidden md:block h-4 w-4 text-gray-500" />
            </button>
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                <div className="py-1">
                  <Link
                    href="/settings/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

