import AppShell from '@/components/layout/AppShell'
import { mockInvoices } from '@/lib/mockData'
import { Download, CreditCard, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import Link from 'next/link'

function getStatusIcon(status: string) {
  switch (status) {
    case 'paid':
      return <CheckCircle className="h-5 w-5 text-success" />
    case 'issued':
      return <Clock className="h-5 w-5 text-warning" />
    case 'overdue':
      return <AlertCircle className="h-5 w-5 text-danger" />
    case 'draft':
      return <Clock className="h-5 w-5 text-gray-400" />
    default:
      return null
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case 'paid':
      return 'text-success'
    case 'issued':
      return 'text-warning'
    case 'overdue':
      return 'text-danger'
    case 'draft':
      return 'text-gray-600'
    default:
      return 'text-gray-600'
  }
}

export default function BillingPage() {
  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Billing & Payments</h1>
        <p className="text-gray-600 mt-1">Manage your invoices and payment methods</p>
      </div>

      {/* Estimated Next Invoice */}
      <div className="card mb-6 bg-primary/5 border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Estimated Next Invoice</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">€36.00</p>
            <p className="text-sm text-gray-500 mt-1">Period: Feb 1 - Feb 28, 2025</p>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoices</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Period</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Due Date</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {new Date(invoice.periodStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -{' '}
                    {new Date(invoice.periodEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">€{invoice.total.toFixed(2)}</td>
                  <td className="py-3 px-4 text-sm">
                    <div className="flex items-center">
                      {getStatusIcon(invoice.status)}
                      <span className={`ml-2 ${getStatusColor(invoice.status)} capitalize`}>{invoice.status}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(invoice.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                  <td className="py-3 px-4 text-sm text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        href={`/billing/${invoice.id}`}
                        className="text-primary hover:underline flex items-center"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        View
                      </Link>
                      {(invoice.status === 'issued' || invoice.status === 'overdue') && (
                        <button className="btn-primary text-sm py-1 px-3">Pay Now</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
          <button className="btn-outline text-sm">Add Payment Method</button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Visa •••• 4242</p>
                <p className="text-sm text-gray-600">Default payment method</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="text-sm text-primary hover:underline">Edit</button>
              <button className="text-sm text-gray-600 hover:underline">Remove</button>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <p className="font-medium text-gray-900">SEPA Direct Debit</p>
                <p className="text-sm text-gray-600">IBAN: DE89 •••• •••• •••• 1234</p>
              </div>
            </div>
            <button className="text-sm text-primary hover:underline">Edit</button>
          </div>
        </div>
      </div>

      {/* Auto-Pay Settings */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Auto-Pay Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Enable automatic payments</p>
              <p className="text-sm text-gray-600 mt-1">Automatically pay invoices when due</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div>
              <p className="font-medium text-gray-900">Max Amount</p>
              <p className="text-sm text-gray-600 mt-1">Maximum amount for automatic payment</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-900">€200</span>
              <button className="text-sm text-primary hover:underline">Edit</button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

