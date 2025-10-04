import React, { useState, useEffect } from 'react'
import { GoalsService } from '../../services/goalsService'
import GoalProgressChart from './GoalProgressChart'
import GoalAnalytics from './GoalAnalytics'
import SmartRecommendations from './SmartRecommendations'
import PredictiveInsights from './PredictiveInsights'
import AddTransactionModal from './AddTransactionModal'

const GoalDetailView = ({ goal, onClose, onUpdate, onDelete, onAddTransaction }) => {
  const [progressData, setProgressData] = useState([])
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showTransactionModal, setShowTransactionModal] = useState(false)

  useEffect(() => {
    loadGoalData()
  }, [goal.id])

  const loadGoalData = async () => {
    try {
      setIsLoading(true)
      const [progressResult, transactionsResult] = await Promise.all([
        GoalsService.getGoalProgress(goal.id),
        GoalsService.getGoalTransactions(goal.id)
      ])

      if (progressResult.success) {
        setProgressData(progressResult.progress)
      }
      if (transactionsResult.success) {
        setTransactions(transactionsResult.transactions)
      }
    } catch (error) {
      console.error('Error loading goal data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddTransaction = async (transactionData) => {
    try {
      await onAddTransaction(goal.id, transactionData)
      await loadGoalData() // Refresh data
      setShowTransactionModal(false)
    } catch (error) {
      console.error('Error adding transaction:', error)
    }
  }

  const getGoalTypeIcon = (goalType) => {
    switch (goalType) {
      case 'savings':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        )
      case 'investment':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        )
      case 'debt_payoff':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
          </svg>
        )
      case 'purchase':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        )
      case 'income':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        )
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
    }
  }

  const getGoalTypeColor = (goalType) => {
    switch (goalType) {
      case 'savings': return 'bg-green-500'
      case 'investment': return 'bg-blue-500'
      case 'debt_payoff': return 'bg-red-500'
      case 'purchase': return 'bg-purple-500'
      case 'income': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-blue-600'
      case 'completed': return 'text-green-600'
      case 'paused': return 'text-yellow-600'
      case 'cancelled': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const formattedGoal = GoalsService.formatGoalData(goal)

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-8">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-4">
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${getGoalTypeColor(goal.goal_type)} mr-4`}>
              <div className="text-white">
                {getGoalTypeIcon(goal.goal_type)}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{goal.title}</h2>
              <div className="flex items-center space-x-3 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                  {goal.priority} priority
                </span>
                <span className={`text-sm font-medium ${getStatusColor(goal.status)}`}>
                  {goal.status}
                </span>
                {goal.deadline && (
                  <span className="text-sm text-gray-500">
                    Due: {new Date(goal.deadline).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Goal Description */}
          {goal.description && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600">{goal.description}</p>
            </div>
          )}

          {/* Progress Overview */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Progress Overview</h3>
              <button
                onClick={() => setShowTransactionModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add Transaction</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-1">
                  ${parseFloat(goal.current_amount).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Current Amount</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  ${parseFloat(goal.target_amount).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">Target Amount</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {formattedGoal.progressPercentage.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Progress</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(formattedGoal.progressPercentage, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Progress Chart */}
          <GoalProgressChart goal={goal} progressData={progressData} />

          {/* Analytics */}
          <GoalAnalytics goal={goal} progressData={progressData} transactions={transactions} />

          {/* Phase 3: Predictive Analytics */}
          <div className="space-y-6">
            <SmartRecommendations goal={goal} userId={goal.user_id} />
            <PredictiveInsights goal={goal} userId={goal.user_id} />
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="p-2 bg-gradient-to-r from-green-400 to-green-500 rounded-lg mr-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V5M10 9l2 2 4-4" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
              </div>
            </div>

            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <div className="p-4 bg-gray-50 rounded-xl mb-4 inline-block">
                  <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V5M10 9l2 2 4-4" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg">No transactions yet</p>
                <p className="text-gray-400 text-sm">Add your first transaction to start tracking progress</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.slice(0, 10).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:shadow-md transition-all duration-200">
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${
                        transaction.transaction_type === 'contribution' ? 'bg-green-500' :
                        transaction.transaction_type === 'withdrawal' ? 'bg-red-500' :
                        transaction.transaction_type === 'interest' ? 'bg-blue-500' :
                        'bg-purple-500'
                      }`}>
                        <div className="text-white">
                          {transaction.transaction_type === 'contribution' ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                          ) : transaction.transaction_type === 'withdrawal' ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 capitalize">
                          {transaction.transaction_type.replace('_', ' ')}
                        </p>
                        {transaction.description && (
                          <p className="text-sm text-gray-600">{transaction.description}</p>
                        )}
                        <p className="text-sm text-gray-500">
                          {new Date(transaction.transaction_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-lg font-bold ${
                        transaction.transaction_type === 'contribution' || 
                        transaction.transaction_type === 'interest' || 
                        transaction.transaction_type === 'dividend'
                          ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.transaction_type === 'contribution' || 
                         transaction.transaction_type === 'interest' || 
                         transaction.transaction_type === 'dividend' ? '+' : '-'}
                        ${Math.abs(parseFloat(transaction.amount)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showTransactionModal && (
        <AddTransactionModal
          goal={goal}
          onClose={() => setShowTransactionModal(false)}
          onSubmit={handleAddTransaction}
        />
      )}
    </div>
  )
}

export default GoalDetailView
