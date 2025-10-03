// Goals service for frontend API calls
const API_BASE_URL = 'http://localhost:3001/api'

export class GoalsService {
  // Get user's goals
  static async getUserGoals(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/goals/${userId}`)
      const result = await response.json()
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Create new goal
  static async createGoal(goalData) {
    try {
      console.log('Sending goal data:', goalData)
      const response = await fetch(`${API_BASE_URL}/goals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(goalData)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error creating goal:', error)
      return { success: false, error: error.message }
    }
  }

  // Update goal
  static async updateGoal(goalId, updateData) {
    try {
      const response = await fetch(`${API_BASE_URL}/goals/${goalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })
      const result = await response.json()
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Delete goal
  static async deleteGoal(goalId) {
    try {
      const response = await fetch(`${API_BASE_URL}/goals/${goalId}`, {
        method: 'DELETE'
      })
      const result = await response.json()
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Add transaction to goal
  static async addGoalTransaction(goalId, transactionData) {
    try {
      console.log('Sending transaction data:', transactionData)
      const response = await fetch(`${API_BASE_URL}/goals/${goalId}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(transactionData)
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      return result
    } catch (error) {
      console.error('Error adding goal transaction:', error)
      return { success: false, error: error.message }
    }
  }

  // Get goal transactions
  static async getGoalTransactions(goalId) {
    try {
      const response = await fetch(`${API_BASE_URL}/goals/${goalId}/transactions`)
      const result = await response.json()
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Get goal progress timeline
  static async getGoalProgress(goalId) {
    try {
      const response = await fetch(`${API_BASE_URL}/goals/${goalId}/progress`)
      const result = await response.json()
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Helper function to format goal data for display
  static formatGoalData(goal) {
    const progressPercentage = goal.progress_percentage || 0
    const daysRemaining = goal.deadline ? Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)) : null
    
    return {
      ...goal,
      progressPercentage: Math.min(progressPercentage, 100),
      daysRemaining,
      isOverdue: goal.deadline_status === 'overdue',
      isDueSoon: goal.deadline_status === 'due_soon',
      isOnTrack: goal.deadline_status === 'on_track',
      remainingAmount: Math.max(goal.target_amount - goal.current_amount, 0)
    }
  }

  // Helper function to get goal status color
  static getGoalStatusColor(goal) {
    if (goal.status === 'completed') return 'text-green-600'
    if (goal.status === 'paused') return 'text-yellow-600'
    if (goal.status === 'cancelled') return 'text-red-600'
    if (goal.deadline_status === 'overdue') return 'text-red-600'
    if (goal.deadline_status === 'due_soon') return 'text-yellow-600'
    return 'text-blue-600'
  }

  // Helper function to get goal priority color
  static getGoalPriorityColor(priority) {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Helper function to get goal type icon (returns icon name for components to use)
  static getGoalTypeIconName(goalType) {
    switch (goalType) {
      case 'savings': return 'savings'
      case 'investment': return 'investment'
      case 'debt_payoff': return 'debt_payoff'
      case 'purchase': return 'purchase'
      case 'income': return 'income'
      default: return 'default'
    }
  }

  // Helper function to get goal type color
  static getGoalTypeColor(goalType) {
    switch (goalType) {
      case 'savings': return 'bg-green-500'
      case 'investment': return 'bg-blue-500'
      case 'debt_payoff': return 'bg-red-500'
      case 'purchase': return 'bg-purple-500'
      case 'income': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }
}
