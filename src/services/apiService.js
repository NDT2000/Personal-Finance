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
}
