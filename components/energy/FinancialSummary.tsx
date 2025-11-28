'use client'

import { TrendingUp, TrendingDown, DollarSign, Leaf, Calendar, Wallet } from 'lucide-react'
import { FinancialSummary as FinancialData } from '@/types/energy'
import { motion } from 'framer-motion'

interface FinancialSummaryProps {
  data: FinancialData
}

export default function FinancialSummary({ data }: FinancialSummaryProps) {
  const { today, month } = data

  const cards = [
    {
      title: "Today's Cost",
      value: today.cost,
      prefix: '€',
      icon: DollarSign,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
    },
    {
      title: "Today's Revenue",
      value: today.revenue,
      prefix: '€',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      title: "Today's Net",
      value: today.netBalance,
      prefix: '€',
      icon: Wallet,
      color: today.netBalance < 0 ? 'from-orange-500 to-orange-600' : 'from-blue-500 to-blue-600',
      bgColor: today.netBalance < 0 ? 'bg-orange-50' : 'bg-blue-50',
      textColor: today.netBalance < 0 ? 'text-orange-700' : 'text-blue-700',
    },
    {
      title: 'CO₂ Saved Today',
      value: today.co2Saved,
      suffix: ' kg',
      icon: Leaf,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Today's Summary */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          <span>Today's Financial Summary</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${card.bgColor} rounded-xl border-2 border-gray-200 p-4 hover:shadow-lg transition-all`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${card.color} shadow-md`}>
                  <card.icon className="h-5 w-5 text-white" />
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-700 mb-2">{card.title}</p>
              <div className="flex items-baseline space-x-1">
                {card.prefix && <span className="text-lg font-bold text-gray-900">{card.prefix}</span>}
                <span className="text-3xl font-bold text-gray-900">
                  {Math.abs(card.value).toFixed(2)}
                </span>
                {card.suffix && <span className="text-sm text-gray-600">{card.suffix}</span>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-purple-600" />
          <span>This Month</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Cost</p>
            <p className="text-2xl font-bold text-red-600">€{month.cost.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-green-600">€{month.revenue.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Net Balance</p>
            <p className={`text-2xl font-bold ${month.netBalance < 0 ? 'text-orange-600' : 'text-blue-600'}`}>
              €{month.netBalance.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Savings vs Last Month</p>
            <div className="flex items-center space-x-2">
              {month.savingsVsLastMonth > 0 ? (
                <TrendingUp className="h-5 w-5 text-green-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-600" />
              )}
              <p className={`text-2xl font-bold ${month.savingsVsLastMonth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                €{Math.abs(month.savingsVsLastMonth).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-amber-500 rounded-lg">
            <DollarSign className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 mb-1">Financial Insight</p>
            <p className="text-sm text-gray-700">
              {month.savingsVsLastMonth > 0
                ? `Great job! You've saved €${month.savingsVsLastMonth.toFixed(2)} compared to last month. Keep optimizing your energy usage!`
                : `Your costs increased by €${Math.abs(month.savingsVsLastMonth).toFixed(2)} this month. Consider shifting high-power activities to off-peak hours.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
