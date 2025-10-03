import React, { useState, useEffect } from 'react'
import { GoalsService } from '../../services/goalsService'
import GoalCard from './GoalCard'
import CreateGoalModal from './CreateGoalModal'
import GoalsOverview from './GoalsOverview'

const GoalsDashboard = ({ userId }) => {
  const [goals, setGoals] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadGoals()
  }, [userId])

  const loadGoals = async () => {
    try {
      setIsLoading(true)
      const result = await GoalsService.getUserGoals(userId)
      if (result.success) {
        setGoals(result.goals)
      }
    } catch (error) {
      console.error('Error loading goals:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateGoal = async (goalData) => {
    try {
      const result = await GoalsService.createGoal({
        ...goalData,
        userId
      })
      
      if (result.success) {
        setMessage('Goal created successfully!')
        setTimeout(() => setMessage(''), 3000)
        setShowCreateModal(false)
        await loadGoals()
      } else {
        setMessage('Error creating goal: ' + result.error)
        setTimeout(() => setMessage(''), 5000)
      }
    } catch (error) {
      console.error('Error creating goal:', error)
      setMessage('Error creating goal')
      setTimeout(() => setMessage(''), 5000)
    }
  }

  const handleUpdateGoal = async (goalId, updateData) => {
    try {
      const result = await GoalsService.updateGoal(goalId, updateData)
      if (result.success) {
        setMessage('Goal updated successfully!')
        setTimeout(() => setMessage(''), 3000)
        await loadGoals()
      } else {
        setMessage('Error updating goal: ' + result.error)
        setTimeout(() => setMessage(''), 5000)
      }
    } catch (error) {
      console.error('Error updating goal:', error)
      setMessage('Error updating goal')
      setTimeout(() => setMessage(''), 5000)
    }
  }

  const handleDeleteGoal = async (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        const result = await GoalsService.deleteGoal(goalId)
        if (result.success) {
          setMessage('Goal deleted successfully!')
          setTimeout(() => setMessage(''), 3000)
          await loadGoals()
        } else {
          setMessage('Error deleting goal: ' + result.error)
          setTimeout(() => setMessage(''), 5000)
        }
      } catch (error) {
        console.error('Error deleting goal:', error)
        setMessage('Error deleting goal')
        setTimeout(() => setMessage(''), 5000)
      }
    }
  }

  const handleAddTransaction = async (goalId, transactionData) => {
    try {
      const result = await GoalsService.addGoalTransaction(goalId, transactionData)
      if (result.success) {
        setMessage('Transaction added successfully!')
        setTimeout(() => setMessage(''), 3000)
        await loadGoals()
      } else {
        setMessage('Error adding transaction: ' + result.error)
        setTimeout(() => setMessage(''), 5000)
      }
    } catch (error) {
      console.error('Error adding transaction:', error)
      setMessage('Error adding transaction')
      setTimeout(() => setMessage(''), 5000)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-lg mr-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Financial Goals</h2>
            <p className="text-gray-600">Track your financial objectives</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>New Goal</span>
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-6 px-4 py-3 rounded-lg ${
          message.includes('successfully') 
            ? 'bg-green-50 border border-green-200 text-green-600' 
            : 'bg-red-50 border border-red-200 text-red-600'
        }`}>
          {message}
        </div>
      )}

      {/* Goals Overview */}
      {goals.length > 0 && (
        <div className="mb-8">
          <GoalsOverview goals={goals} />
        </div>
      )}

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <div className="text-center py-12">
          <div className="p-4 bg-gray-50 rounded-xl mb-6 inline-block">
            <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Goals Yet</h3>
          <p className="text-gray-600 mb-6">Create your first financial goal to start tracking your progress</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onUpdate={handleUpdateGoal}
              onDelete={handleDeleteGoal}
              onAddTransaction={handleAddTransaction}
            />
          ))}
        </div>
      )}

      {/* Create Goal Modal */}
      {showCreateModal && (
        <CreateGoalModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateGoal}
        />
      )}
    </div>
  )
}

export default GoalsDashboard
