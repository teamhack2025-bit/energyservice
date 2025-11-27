import AppShell from '@/components/layout/AppShell'
import { Search, HelpCircle, FileText, MessageSquare, Plus } from 'lucide-react'
import Link from 'next/link'

const faqCategories = [
  { name: 'Billing', icon: FileText, count: 12 },
  { name: 'Contracts', icon: FileText, count: 8 },
  { name: 'Devices', icon: HelpCircle, count: 15 },
  { name: 'Technical', icon: HelpCircle, count: 10 },
]

const popularArticles = [
  'How do I pay my invoice?',
  'How to read my meter?',
  'What is feed-in tariff?',
  'How to connect my solar system?',
  'Understanding my energy bill',
]

export default function SupportPage() {
  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Support & Help</h1>
        <p className="text-gray-600 mt-1">Find answers and get help</p>
      </div>

      {/* Search */}
      <div className="card mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search FAQ..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* FAQ Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {faqCategories.map((category) => (
          <Link
            key={category.name}
            href={`/support/faq?category=${category.name.toLowerCase()}`}
            className="card hover:shadow-md transition-shadow cursor-pointer"
          >
            <category.icon className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
            <p className="text-sm text-gray-600">{category.count} articles</p>
          </Link>
        ))}
      </div>

      {/* Popular Articles */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Articles</h3>
        <div className="space-y-2">
          {popularArticles.map((article, index) => (
            <Link
              key={index}
              href={`/support/faq/${index + 1}`}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <span className="text-gray-900">{article}</span>
              <span className="text-primary">→</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Create Ticket */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Need more help?</h3>
            <p className="text-sm text-gray-600">
              Create a support ticket and our team will get back to you.
            </p>
          </div>
          <Link href="/support/tickets/new" className="btn-primary flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Create Ticket
          </Link>
        </div>
      </div>

      {/* My Tickets */}
      <div className="card mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">My Tickets</h3>
          <Link href="/support/tickets" className="text-sm text-primary hover:underline">
            View All
          </Link>
        </div>
        <div className="text-center py-8 text-gray-600">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p>No tickets yet</p>
        </div>
      </div>
    </AppShell>
  )
}

