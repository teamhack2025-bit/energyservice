import AppShell from '@/components/layout/AppShell'
import { mockContracts } from '@/lib/mockData'
import { FileCheck, ArrowRight, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function ContractsPage() {
  return (
    <AppShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Contracts & Tariffs</h1>
        <p className="text-gray-600 mt-1">Manage your energy contracts and tariffs</p>
      </div>

      {/* Active Contracts */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Contracts</h3>
        {mockContracts.map((contract) => (
          <div key={contract.id} className="border border-gray-200 rounded-lg p-6 mb-4 last:mb-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <FileCheck className="h-5 w-5 text-primary mr-2" />
                  <h4 className="text-lg font-semibold text-gray-900">{contract.siteName}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  123 Main St, Berlin, 10115
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Contract Number</p>
                    <p className="font-medium text-gray-900">{contract.contractNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tariff</p>
                    <p className="font-medium text-gray-900">{contract.tariff.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="font-medium text-gray-900 capitalize">{contract.tariff.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Base Price</p>
                    <p className="font-medium text-gray-900">€{contract.tariff.basePricePerKwh.toFixed(2)}/kWh</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Start Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(contract.startDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Auto-Renew</p>
                    <p className="font-medium text-gray-900">{contract.autoRenew ? 'Yes' : 'No'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success">
                    {contract.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-gray-200">
              <Link href="/contracts/compare" className="btn-outline flex items-center text-sm">
                Compare Tariffs
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
              <button className="btn-outline flex items-center text-sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Renew Contract
              </button>
              <button className="btn-outline text-sm">Switch Tariff</button>
            </div>
          </div>
        ))}
      </div>

      {/* Tariff Details */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Tariff Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Base Price per kWh</p>
            <p className="text-xl font-semibold text-gray-900">€0.30</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Monthly Fee</p>
            <p className="text-xl font-semibold text-gray-900">€5.00</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Feed-in Tariff</p>
            <p className="text-xl font-semibold text-gray-900">€0.10/kWh</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Grid Fees</p>
            <p className="text-xl font-semibold text-gray-900">€0.05/kWh</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">VAT</p>
            <p className="text-xl font-semibold text-gray-900">19%</p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

