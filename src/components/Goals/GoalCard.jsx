import React, { useState } from 'react'
import { GoalsService } from '../../services/goalsService'
import AddTransactionModal from './AddTransactionModal'
import GoalDetailView from './GoalDetailView'

const GoalCard = ({ goal, onUpdate, onDelete, onAddTransaction }) => {
  const [showEditModal, setShowEditModal] = useState(false)
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [showDetailView, setShowDetailView] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const formattedGoal = GoalsService.formatGoalData(goal)
  const statusColor = GoalsService.getGoalStatusColor(goal)
  const priorityColor = GoalsService.getGoalPriorityColor(goal.priority)
  const typeColor = GoalsService.getGoalTypeColor(goal.goal_type)
  const getGoalTypeIcon = (goalType) => {
    switch (goalType) {
      case 'savings':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        )
      case 'investment':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        )
      case 'debt_payoff':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
          </svg>
        )
      case 'purchase':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        )
      case 'income':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
    }
  }

  const typeIcon = getGoalTypeIcon(goal.goal_type)

  const handleStatusChange = async (newStatus) => {
    setIsLoading(true)
    try {
      await onUpdate(goal.id, { status: newStatus })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = () => {
    setShowEditModal(true)
  }

  const handleAddTransaction = () => {
    setShowTransactionModal(true)
  }

  const getProgressBarColor = () => {
    if (formattedGoal.progressPercentage >= 100) return 'bg-green-500'
    if (formattedGoal.progressPercentage >= 75) return 'bg-blue-500'
    if (formattedGoal.progressPercentage >= 50) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getDeadlineText = () => {
    if (!goal.deadline) return 'No deadline'
    if (formattedGoal.isOverdue) return 'Overdue'
    if (formattedGoal.isDueSoon) return 'Due soon'
    if (formattedGoal.daysRemaining > 0) return `${formattedGoal.daysRemaining} days left`
    return 'Completed'
  }

  const getDeadlineColor = () => {
    if (formattedGoal.isOverdue) return 'text-red-600'
    if (formattedGoal.isDueSoon) return 'text-yellow-600'
    return 'text-gray-600'
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${typeColor}`}>
            <div className="text-white">
              {typeIcon}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{goal.title}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColor}`}>
                {goal.priority}
              </span>
              <span className={`text-xs font-medium ${statusColor}`}>
                {goal.status}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={handleEdit}
            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
            title="Edit goal"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
            title="Delete goal"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Description */}
      {goal.description && (
        <p className="text-gray-600 text-sm mb-4">{goal.description}</p>
      )}

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-semibold text-gray-900">
            {formattedGoal.progressPercentage.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${getProgressBarColor()}`}
            style={{ width: `${Math.min(formattedGoal.progressPercentage, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center mt-2 text-sm text-gray-600">
          <span>${parseFloat(goal.current_amount).toFixed(2)}</span>
          <span>${parseFloat(goal.target_amount).toFixed(2)}</span>
        </div>
      </div>

      {/* Deadline */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Deadline</span>
          <span className={`text-sm font-medium ${getDeadlineColor()}`}>
            {getDeadlineText()}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <div className="flex space-x-2">
          <button
            onClick={() => setShowDetailView(true)}
            className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>View Details</span>
          </button>
          
          <button
            onClick={handleAddTransaction}
            className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all duration-200 text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Money</span>
          </button>
        </div>
        
        <div className="flex space-x-2">
          {goal.status === 'active' && (
            <button
              onClick={() => handleStatusChange('completed')}
              disabled={isLoading}
              className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 text-sm font-medium disabled:opacity-50"
            >
              {isLoading ? '...' : 'Complete'}
            </button>
          )}
          
          {goal.status === 'completed' && (
            <button
              onClick={() => handleStatusChange('active')}
              disabled={isLoading}
              className="flex-1 px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-200 text-sm font-medium disabled:opacity-50"
            >
              {isLoading ? '...' : 'Reopen'}
            </button>
          )}
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showTransactionModal && (
        <AddTransactionModal
          goal={goal}
          onClose={() => setShowTransactionModal(false)}
          onSubmit={onAddTransaction}
        />
      )}

      {/* Goal Detail View */}
      {showDetailView && (
        <GoalDetailView
          goal={goal}
          onClose={() => setShowDetailView(false)}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onAddTransaction={onAddTransaction}
        />
      )}
    </div>
  )
}

export default GoalCard
