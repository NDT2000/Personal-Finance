import React from 'react'

const IncomeInsights = ({ transactions }) => {
  // Calculate income metrics
  const incomeTransactions = transactions.filter(t => t.transaction_type === 'income')
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0)
  
  // Calculate monthly income
  const monthlyIncome = incomeTransactions.reduce((acc, t) => {
    const month = new Date(t.transaction_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    if (!acc[month]) acc[month] = 0
    acc[month] += t.amount
    return acc
  }, {})

  const avgMonthlyIncome = Object.keys(monthlyIncome).length > 0 
    ? Object.values(monthlyIncome).reduce((sum, income) => sum + income, 0) / Object.keys(monthlyIncome).length
    : 0

  // Calculate income by category
  const incomeByCategory = incomeTransactions.reduce((acc, t) => {
    const category = getIncomeCategory(t.description)
    if (!acc[category]) acc[category] = 0
    acc[category] += t.amount
    return acc
  }, {})

  const topIncomeCategory = Object.entries(incomeByCategory)
    .sort(([,a], [,b]) => b - a)[0]

  // Calculate income growth (if we have multiple months)
  const months = Object.keys(monthlyIncome).sort()
  const incomeGrowth = months.length >= 2 
    ? ((monthlyIncome[months[months.length - 1]] - monthlyIncome[months[0]]) / monthlyIncome[months[0]] * 100)
    : 0

  function getIncomeCategory(description) {
    const desc = description.toLowerCase()
    
    if (desc.includes('salary') || desc.includes('wage') || desc.includes('pay')) {
      return 'Salary'
    } else if (desc.includes('freelance') || desc.includes('contract') || desc.includes('consulting')) {
      return 'Freelance'
    } else if (desc.includes('bonus') || desc.includes('incentive')) {
      return 'Bonus'
    } else if (desc.includes('investment') || desc.includes('dividend') || desc.includes('return')) {
      return 'Investment'
    } else if (desc.includes('business') || desc.includes('profit') || desc.includes('revenue')) {
      return 'Business'
    } else {
      return 'Other'
    }
  }

  const insights = [
    {
      title: 'Total Income',
      value: `$${totalIncome.toLocaleString()}`,
      description: 'All time earnings',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    },
    {
      title: 'Avg Monthly Income',
      value: `$${avgMonthlyIncome.toFixed(0)}`,
      description: 'Average per month',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: 'Top Income Source',
      value: topIncomeCategory ? topIncomeCategory[0] : 'N/A',
      description: topIncomeCategory ? `$${topIncomeCategory[1].toLocaleString()}` : 'No data',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    {
      title: 'Income Growth',
      value: `${incomeGrowth >= 0 ? '+' : ''}${incomeGrowth.toFixed(1)}%`,
      description: 'Month over month',
      color: incomeGrowth >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: incomeGrowth >= 0 ? 'bg-green-50' : 'bg-red-50',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    }
  ]

  if (incomeTransactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-gradient-to-r from-green-400 to-green-500 rounded-lg mr-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Income Insights</h2>
        </div>
        <div className="text-center py-8">
          <div className="p-4 bg-gray-50 rounded-xl mb-4">
            <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <p className="text-gray-500 text-lg">No income data available</p>
          <p className="text-gray-400 text-sm">Add some income transactions to see insights</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center mb-6">
        <div className="p-2 bg-gradient-to-r from-green-400 to-green-500 rounded-lg mr-3">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Income Insights</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((insight, index) => (
          <div key={index} className={`p-4 rounded-xl ${insight.bgColor} hover:shadow-md transition-all duration-200`}>
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${insight.bgColor.replace('50', '100')}`}>
                <div className={insight.color}>
                  {insight.icon}
                </div>
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{insight.title}</h3>
            <p className={`text-2xl font-bold ${insight.color} mb-1`}>{insight.value}</p>
            <p className="text-xs text-gray-500">{insight.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default IncomeInsights
