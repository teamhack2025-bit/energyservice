import AppShell from '@/components/layout/AppShell'
import { User, MapPin, Shield, Globe, Database } from 'lucide-react'
import Link from 'next/link'

const settingsSections = [
  {
    title: 'Profile',
    icon: User,
    href: '/settings/profile',
    description: 'Update your personal information',
  },
  {
    title: 'Addresses & Sites',
    icon: MapPin,
    href: '/settings/addresses',
    description: 'Manage your addresses and sites',
  },
  {
    title: 'Security',
    icon: Shield,
    href: '/settings/security',
    description: 'Password, 2FA, and security settings',
  },
  {
    title: 'Preferences',
    icon: Globe,
    href: '/settings/preferences',
    description: 'Language, timezone, and display settings',
  },
  {
    title: 'Privacy & Data',
    icon: Database,
    href: '/settings/privacy',
    description: 'Data export and privacy controls',
  },
]

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsSections.map((section) => (
          <Link
            key={section.title}
            href={section.href}
            className="card hover:shadow-md transition-shadow cursor-pointer"
          >
            <section.icon className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{section.title}</h3>
            <p className="text-sm text-gray-600">{section.description}</p>
          </Link>
        ))}
      </div>

      {/* Quick Profile Preview */}
      <div className="card mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Preview</h3>
        <div className="flex items-center">
          <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center text-white text-xl font-medium mr-4">
            JD
          </div>
          <div>
            <p className="font-medium text-gray-900">John Doe</p>
            <p className="text-sm text-gray-600">user@example.com</p>
            <p className="text-sm text-gray-600">Prosumer</p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

