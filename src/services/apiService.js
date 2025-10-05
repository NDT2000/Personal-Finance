// API service for database operations through backend
const API_BASE_URL = 'http://localhost:3001/api'

export class ApiService {
  static async testDatabase() {
    try {
      const response = await fetch(`${API_BASE_URL}/test-db`)
      const result = await response.json()
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  static async syncUserToDatabase(userData) {
    try {
      const response = await fetch(`${API_BASE_URL}/sync-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userData })
      })
      const result = await response.json()
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  static async authenticateUser(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })
      const result = await response.json()
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  static async getAllUsers() {
    try {
      const response = await fetch(`${API_BASE_URL}/users`)
      const result = await response.json()
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  static async forgotPassword(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })
      const result = await response.json()
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  static async resetPassword(token, newPassword) {
    try {
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, newPassword })
      })
      const result = await response.json()
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Account management
  static async getUserAccounts(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/accounts/${userId}`)
      const result = await response.json()
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  static async createAccount(userId, accountType, accountName, initialBalance = 0) {
    try {
      const response = await fetch(`${API_BASE_URL}/accounts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, accountType, accountName, initialBalance })
      })
      const result = await response.json()
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Transaction management
  static async getAccountTransactions(accountId) {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${accountId}`)
      const result = await response.json()
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  static async createTransaction(accountId, amount, category, transactionType, description, transactionDate) {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ accountId, amount, category, transactionType, description, transactionDate })
      })
      const result = await response.json()
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  static async deleteTransaction(transactionId) {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
        method: 'DELETE'
      })
      const result = await response.json()
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Dashboard data
  static async getDashboardData(userId) {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/${userId}`)
      const result = await response.json()
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // ML Categorization
  static async getMLCategorization(descriptions) {
    try {
      // Validate input
      if (!Array.isArray(descriptions)) {
        return { success: false, error: 'Descriptions must be an array' }
      }
      
      // Ensure all descriptions are strings
      const validDescriptions = descriptions.filter(desc => typeof desc === 'string' && desc.trim().length > 0)
      
      if (validDescriptions.length === 0) {
        return { success: false, error: 'No valid descriptions provided' }
      }
      
      const response = await fetch(`${API_BASE_URL}/ml/categorize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ descriptions: validDescriptions })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      return result
    } catch (error) {
      console.error('ML categorization error:', error)
      return { success: false, error: error.message }
    }
  }

  static async getMLModelInfo() {
    try {
      const response = await fetch(`${API_BASE_URL}/ml/info`)
      const result = await response.json()
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  static async updateMLPrediction(transactionId, mlCategory, mlConfidence, isMLPredicted) {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}/ml`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mlCategory, mlConfidence, isMLPredicted })
      })
      const result = await response.json()
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  static async getMLReviewTransactions() {
    try {
      const response = await fetch(`${API_BASE_URL}/ml/review`)
      const result = await response.json()
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  static async testMLModel() {
    try {
      const response = await fetch(`${API_BASE_URL}/ml/test`)
      const result = await response.json()
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // ===== REGRESSION API METHODS =====

  static async getSpendingTrendPrediction(transactions, months = 6) {
    try {
      const response = await fetch(`${API_BASE_URL}/regression/spending-trend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ transactions, months })
      })
      const result = await response.json()
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  static async getIncomeGrowthPrediction(incomeHistory, months = 12) {
    try {
      const response = await fetch(`${API_BASE_URL}/regression/income-growth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ incomeHistory, months })
      })
      const result = await response.json()
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  static async getSavingsCapacityPrediction(incomeHistory, expenseHistory, months = 12) {
    try {
      const response = await fetch(`${API_BASE_URL}/regression/savings-capacity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ incomeHistory, expenseHistory, months })
      })
      const result = await response.json()
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  static async getGoalTimelinePrediction(goal, userProfile, historicalData) {
    try {
      const response = await fetch(`${API_BASE_URL}/regression/goal-timeline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ goal, userProfile, historicalData })
      })
      const result = await response.json()
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  static async getFinancialRiskAssessment(userProfile, goals = [], marketConditions = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}/regression/risk-assessment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userProfile, goals, marketConditions })
      })
      const result = await response.json()
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  static async getComprehensiveFinancialInsights(transactions, incomeHistory, expenseHistory, goals = [], userProfile, marketConditions = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}/regression/insights`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          transactions, 
          incomeHistory, 
          expenseHistory, 
          goals, 
          userProfile, 
          marketConditions 
        })
      })
      const result = await response.json()
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // ===== MODEL TRAINING API METHODS =====

  static async trainWithSampleData() {
    try {
      const response = await fetch(`${API_BASE_URL}/training/train-sample`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const result = await response.json()
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  static async trainWithDataset(filePath, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}/training/train-dataset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filePath, options })
      })
      const result = await response.json()
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  static async getTrainedModel(target) {
    try {
      const response = await fetch(`${API_BASE_URL}/training/model/${target}`)
      const result = await response.json()
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  static async getTrainingHistory() {
    try {
      const response = await fetch(`${API_BASE_URL}/training/history`)
      const result = await response.json()
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  static async exportTrainedModels() {
    try {
      const response = await fetch(`${API_BASE_URL}/training/export`)
      const result = await response.json()
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  static async clearTrainedModels() {
    try {
      const response = await fetch(`${API_BASE_URL}/training/clear`, {
        method: 'DELETE'
      })
      const result = await response.json()
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  static async uploadDataset(filePath, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}/training/upload-dataset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ filePath, options })
      })
      const result = await response.json()
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}
