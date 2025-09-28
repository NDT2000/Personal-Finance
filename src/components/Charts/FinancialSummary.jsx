import React from 'react'

const FinancialSummary = ({ transactions }) => {
  const totalIncome = transactions
    .filter(t => t.transaction_type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.transaction_type === 'expense')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  const balance = totalIncome - totalExpenses

  // Calculate savings rate
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0

  // Calculate average monthly income
  const monthlyIncome = transactions
    .filter(t => t.transaction_type === 'income')
    .reduce((acc, t) => {
      const month = new Date(t.transaction_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      if (!acc[month]) acc[month] = 0
      acc[month] += t.amount
      return acc
    }, {})

  const avgMonthlyIncome = Object.keys(monthlyIncome).length > 0 
    ? Object.values(monthlyIncome).reduce((sum, income) => sum + income, 0) / Object.keys(monthlyIncome).length
    : 0

  // Calculate average monthly expenses
  const monthlyExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      const month = new Date(t.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      if (!acc[month]) acc[month] = 0
      acc[month] += Math.abs(t.amount)
      return acc
    }, {})

  const avgMonthlyExpenses = Object.keys(monthlyExpenses).length > 0 
    ? Object.values(monthlyExpenses).reduce((sum, expense) => sum + expense, 0) / Object.keys(monthlyExpenses).length
    : 0

  const metrics = [
    {
      title: 'Savings Rate',
      value: `${savingsRate}%`,
      description: 'Percentage of income saved',
      color: savingsRate >= 20 ? 'text-green-600' : savingsRate >= 10 ? 'text-yellow-600' : 'text-red-600',
      bgColor: savingsRate >= 20 ? 'bg-green-50' : savingsRate >= 10 ? 'bg-yellow-50' : 'bg-red-50',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    },
    {
      title: 'Avg Monthly Income',
      value: `$${avgMonthlyIncome.toFixed(0)}`,
      description: 'Average monthly earnings',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    {
      title: 'Avg Monthly Expenses',
      value: `$${avgMonthlyExpenses.toFixed(0)}`,
      description: 'Average monthly spending',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      )
    },
    {
      title: 'Transaction Count',
      value: transactions.length,
      description: 'Total transactions',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V5M10 9l2 2 4-4" />
        </svg>
      )
    }
  ]

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-lg mr-3">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Financial Summary</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className={`p-4 rounded-xl ${metric.bgColor} hover:shadow-md transition-all duration-200`}>
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${metric.bgColor.replace('50', '100')}`}>
                <div className={metric.color}>
                  {metric.icon}
                </div>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{metric.title}</h3>
            <p className={`text-2xl font-bold ${metric.color} mb-1`}>{metric.value}</p>
            <p className="text-xs text-gray-500">{metric.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FinancialSummary
