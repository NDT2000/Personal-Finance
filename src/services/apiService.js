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
      const response = await fetch(`${API_BASE_URL}/ml/categorize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ descriptions })
      })
      const result = await response.json()
      return result
    } catch (error) {
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
}
