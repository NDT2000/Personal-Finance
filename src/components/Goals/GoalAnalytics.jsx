import React from 'react'

const GoalAnalytics = ({ goal, progressData = [], transactions = [] }) => {
  // Calculate analytics
  const currentAmount = parseFloat(goal.current_amount)
  const targetAmount = parseFloat(goal.target_amount)
  const progressPercentage = targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0
  const remainingAmount = Math.max(targetAmount - currentAmount, 0)
  
  // Calculate days remaining
  const daysRemaining = goal.deadline ? Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : null
  
  // Calculate average daily contribution needed
  const avgDailyNeeded = daysRemaining > 0 ? remainingAmount / daysRemaining : 0
  
  // Calculate total contributions
  const totalContributions = transactions
    .filter(t => t.transaction_type === 'contribution')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0)
  
  // Calculate total withdrawals
  const totalWithdrawals = transactions
    .filter(t => t.transaction_type === 'withdrawal')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0)
  
  // Calculate interest/dividends
  const totalInterest = transactions
    .filter(t => t.transaction_type === 'interest' || t.transaction_type === 'dividend')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0)
  
  // Calculate average contribution
  const contributionCount = transactions.filter(t => t.transaction_type === 'contribution').length
  const avgContribution = contributionCount > 0 ? totalContributions / contributionCount : 0
  
  // Calculate progress rate (amount per day)
  const progressRate = progressData.length > 1 ? 
    (currentAmount - parseFloat(progressData[0].progress_amount)) / 
    Math.max((new Date() - new Date(progressData[0].recorded_date)) / (1000 * 60 * 60 * 24), 1) : 0

  const analytics = [
    {
      title: 'Progress Percentage',
      value: `${progressPercentage.toFixed(1)}%`,
      description: 'Completion status',
      color: progressPercentage >= 100 ? 'text-green-600' : progressPercentage >= 75 ? 'text-blue-600' : progressPercentage >= 50 ? 'text-yellow-600' : 'text-red-600',
      bgColor: progressPercentage >= 100 ? 'bg-green-50' : progressPercentage >= 75 ? 'bg-blue-50' : progressPercentage >= 50 ? 'bg-yellow-50' : 'bg-red-50',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      title: 'Remaining Amount',
      value: `$${remainingAmount.toFixed(2)}`,
      description: 'Amount left to reach goal',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    },
    {
      title: 'Days Remaining',
      value: daysRemaining ? `${daysRemaining} days` : 'No deadline',
      description: daysRemaining ? 'Time left to reach goal' : 'Open timeline',
      color: daysRemaining ? (daysRemaining < 30 ? 'text-red-600' : daysRemaining < 90 ? 'text-yellow-600' : 'text-green-600') : 'text-gray-600',
      bgColor: daysRemaining ? (daysRemaining < 30 ? 'bg-red-50' : daysRemaining < 90 ? 'bg-yellow-50' : 'bg-green-50') : 'bg-gray-50',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: 'Avg Daily Needed',
      value: avgDailyNeeded > 0 ? `$${avgDailyNeeded.toFixed(2)}` : 'N/A',
      description: 'Daily contribution to reach goal',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    }
  ]

  const transactionStats = [
    {
      title: 'Total Contributions',
      value: `$${totalContributions.toFixed(2)}`,
      description: `${contributionCount} transactions`,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    {
      title: 'Total Withdrawals',
      value: `$${totalWithdrawals.toFixed(2)}`,
      description: 'Money taken out',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      )
    },
    {
      title: 'Interest/Dividends',
      value: `$${totalInterest.toFixed(2)}`,
      description: 'Passive earnings',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      )
    },
    {
      title: 'Avg Contribution',
      value: `$${avgContribution.toFixed(2)}`,
      description: 'Per transaction',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    }
  ]

  return (
    <div className="space-y-6">
      {/* Progress Analytics */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-lg mr-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Goal Analytics</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {analytics.map((metric, index) => (
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

      {/* Transaction Statistics */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center mb-6">
          <div className="p-2 bg-gradient-to-r from-green-400 to-green-500 rounded-lg mr-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V5M10 9l2 2 4-4" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Transaction Statistics</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {transactionStats.map((stat, index) => (
            <div key={index} className={`p-4 rounded-xl ${stat.bgColor} hover:shadow-md transition-all duration-200`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg ${stat.bgColor.replace('50', '100')}`}>
                  <div className={stat.color}>
                    {stat.icon}
                  </div>
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
              <p className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default GoalAnalytics
