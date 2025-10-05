// API service for database operations through backend
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.com/api' // Replace with your actual backend URL
  : 'http://localhost:3001/api'

// Check if we're in a browser environment and if backend is available
const isBackendAvailable = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/test-db`, { 
      method: 'GET',
      signal: AbortSignal.timeout(3000) // 3 second timeout
    })
    return response.ok
  } catch (error) {
    console.warn('Backend not available, using local storage fallback:', error.message)
    return false
  }
}

// Local storage fallback methods
const LocalStorageService = {
  getUsers: () => {
    const users = localStorage.getItem('finance_users')
    return users ? JSON.parse(users) : []
  },
  
  saveUsers: (users) => {
    localStorage.setItem('finance_users', JSON.stringify(users))
  },
  
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('currentUser') || 'null')
  },
  
  setCurrentUser: (user) => {
    localStorage.setItem('currentUser', JSON.stringify(user))
  },
  
  getAccounts: (userId) => {
    const accounts = localStorage.getItem(`finance_accounts_${userId}`)
    return accounts ? JSON.parse(accounts) : []
  },
  
  saveAccounts: (userId, accounts) => {
    localStorage.setItem(`finance_accounts_${userId}`, JSON.stringify(accounts))
  },
  
  getTransactions: (accountId) => {
    const transactions = localStorage.getItem(`finance_transactions_${accountId}`)
    return transactions ? JSON.parse(transactions) : []
  },
  
  saveTransactions: (accountId, transactions) => {
    localStorage.setItem(`finance_transactions_${accountId}`, JSON.stringify(transactions))
  }
}

export class ApiService {
  static async testDatabase() {
    try {
      const backendAvailable = await isBackendAvailable()
      if (!backendAvailable) {
        return { success: true, message: 'Using local storage fallback' }
      }
      
      const response = await fetch(`${API_BASE_URL}/test-db`)
      const result = await response.json()
      return result
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  static async syncUserToDatabase(userData) {
    try {
      const backendAvailable = await isBackendAvailable()
      if (!backendAvailable) {
        // Use localStorage fallback
        LocalStorageService.setCurrentUser(userData)
        return { success: true, message: 'User synced to local storage' }
      }
      
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
      const backendAvailable = await isBackendAvailable()
      if (!backendAvailable) {
        // Use localStorage fallback for demo purposes
        const users = LocalStorageService.getUsers()
        const user = users.find(u => u.email === email)
        
        if (user && user.password === password) {
          return { 
            success: true, 
            user: { 
              id: user.id, 
              firstName: user.firstName, 
              lastName: user.lastName, 
              email: user.email 
            } 
          }
        } else {
          return { success: false, error: 'Invalid credentials' }
        }
      }
      
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
