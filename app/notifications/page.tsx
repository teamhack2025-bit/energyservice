import AppShell from '@/components/layout/AppShell'
import { mockNotifications } from '@/lib/mockData'
import { Bell, CheckCircle, AlertCircle, Info, XCircle } from 'lucide-react'
import Link from 'next/link'

function getSeverityIcon(severity: string) {
  switch (severity) {
    case 'success':
      return <CheckCircle className="h-5 w-5 text-success" />
    case 'warning':
      return <AlertCircle className="h-5 w-5 text-warning" />
    case 'error':
      return <XCircle className="h-5 w-5 text-danger" />
    default:
      return <Info className="h-5 w-5 text-primary" />
  }
}

export default function NotificationsPage() {
  const unreadNotifications = mockNotifications.filter(n => !n.read)
  const readNotifications = mockNotifications.filter(n => n.read)

  return (
    <AppShell>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">Stay updated on your energy usage</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="btn-outline text-sm">Mark All as Read</button>
          <Link href="/notifications/settings" className="btn-outline text-sm">
            Settings
          </Link>
        </div>
      </div>

      {/* Unread Notifications */}
      {unreadNotifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Unread ({unreadNotifications.length})
          </h2>
          <div className="space-y-3">
            {unreadNotifications.map((notification) => (
              <Link
                key={notification.id}
                href={notification.actionUrl || '#'}
                className="card hover:shadow-md transition-shadow block"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    {getSeverityIcon(notification.severity)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{notification.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(notification.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <span className="h-2 w-2 bg-primary rounded-full ml-4"></span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Read Notifications */}
      {readNotifications.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Read</h2>
          <div className="space-y-3">
            {readNotifications.map((notification) => (
              <Link
                key={notification.id}
                href={notification.actionUrl || '#'}
                className="card hover:shadow-md transition-shadow block opacity-75"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-4">
                    {getSeverityIcon(notification.severity)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{notification.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(notification.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {mockNotifications.length === 0 && (
        <div className="card text-center py-12">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
          <p className="text-gray-600">You're all caught up!</p>
        </div>
      )}
    </AppShell>
  )
}

