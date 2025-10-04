// Bank Integration Service for Automatic Transaction Import
class BankIntegration {
  constructor() {
    this.supportedBanks = [
      { id: 'chase', name: 'Chase Bank', logo: '/logos/chase.png' },
      { id: 'bankofamerica', name: 'Bank of America', logo: '/logos/bofa.png' },
      { id: 'wells_fargo', name: 'Wells Fargo', logo: '/logos/wells.png' },
      { id: 'citibank', name: 'Citibank', logo: '/logos/citi.png' },
      { id: 'capital_one', name: 'Capital One', logo: '/logos/capitalone.png' },
      { id: 'us_bank', name: 'U.S. Bank', logo: '/logos/usbank.png' }
    ]
    this.connectionStatus = new Map()
  }

  // Get list of supported banks
  getSupportedBanks() {
    return this.supportedBanks
  }

  // Connect to a bank account
  async connectBankAccount(userId, bankId, credentials) {
    try {
      // In a real implementation, this would use OAuth or secure API connections
      // For now, we'll simulate the connection process
      const connectionId = 'conn_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      
      // Simulate API call to bank
      const connectionData = {
        id: connectionId,
        userId,
        bankId,
        accountId: credentials.accountId,
        status: 'connected',
        connectedAt: new Date().toISOString(),
        lastSync: new Date().toISOString()
      }

      // Store connection status
      this.connectionStatus.set(connectionId, connectionData)
      
      return {
        success: true,
        connectionId,
        message: 'Bank account connected successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Import transactions from connected bank account
  async importTransactions(connectionId, startDate, endDate) {
    try {
      const connection = this.connectionStatus.get(connectionId)
      if (!connection) {
        throw new Error('Bank connection not found')
      }

      // Simulate fetching transactions from bank API
      const mockTransactions = this.generateMockTransactions(connection.bankId, startDate, endDate)
      
      // Update last sync time
      connection.lastSync = new Date().toISOString()
      this.connectionStatus.set(connectionId, connection)

      return {
        success: true,
        transactions: mockTransactions,
        importedCount: mockTransactions.length,
        lastSync: connection.lastSync
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Get connection status
  getConnectionStatus(connectionId) {
    return this.connectionStatus.get(connectionId)
  }

  // Disconnect bank account
  async disconnectBankAccount(connectionId) {
    try {
      const connection = this.connectionStatus.get(connectionId)
      if (!connection) {
        throw new Error('Bank connection not found')
      }

      // Update status to disconnected
      connection.status = 'disconnected'
      connection.disconnectedAt = new Date().toISOString()
      this.connectionStatus.set(connectionId, connection)

      return {
        success: true,
        message: 'Bank account disconnected successfully'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Get user's connected accounts
  getUserConnections(userId) {
    const userConnections = []
    for (const [connectionId, connection] of this.connectionStatus) {
      if (connection.userId === userId && connection.status === 'connected') {
        const bank = this.supportedBanks.find(b => b.id === connection.bankId)
        userConnections.push({
          ...connection,
          bankName: bank?.name || 'Unknown Bank',
          bankLogo: bank?.logo
        })
      }
    }
    return userConnections
  }

  // Generate mock transactions for demonstration
  generateMockTransactions(bankId, startDate, endDate) {
    const transactions = []
    const start = new Date(startDate)
    const end = new Date(endDate)
    const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    
    // Generate 1-3 transactions per day
    for (let i = 0; i < daysDiff; i++) {
      const date = new Date(start)
      date.setDate(date.getDate() + i)
      
      const numTransactions = Math.floor(Math.random() * 3) + 1
      
      for (let j = 0; j < numTransactions; j++) {
        const transaction = this.generateRandomTransaction(date, bankId)
        transactions.push(transaction)
      }
    }
    
    return transactions.sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  generateRandomTransaction(date, bankId) {
    const categories = [
      'Groceries', 'Dining', 'Transportation', 'Entertainment', 
      'Shopping', 'Utilities', 'Healthcare', 'Education'
    ]
    
    const merchants = {
      'Groceries': ['Whole Foods', 'Safeway', 'Trader Joe\'s', 'Kroger'],
      'Dining': ['McDonald\'s', 'Starbucks', 'Chipotle', 'Pizza Hut'],
      'Transportation': ['Uber', 'Lyft', 'Gas Station', 'Metro'],
      'Entertainment': ['Netflix', 'Spotify', 'Movie Theater', 'Amazon Prime'],
      'Shopping': ['Amazon', 'Target', 'Walmart', 'Best Buy'],
      'Utilities': ['Electric Company', 'Water Department', 'Internet Provider'],
      'Healthcare': ['CVS Pharmacy', 'Doctor\'s Office', 'Hospital'],
      'Education': ['University', 'Online Course', 'Textbook Store']
    }
    
    const category = categories[Math.floor(Math.random() * categories.length)]
    const merchant = merchants[category][Math.floor(Math.random() * merchants[category].length)]
    
    const amount = -(Math.random() * 200 + 10).toFixed(2) // Random expense between $10-$210
    
    return {
      id: 'txn_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      date: date.toISOString().split('T')[0],
      amount: parseFloat(amount),
      description: merchant + ' - ' + category,
      category: category,
      merchant: merchant,
      accountId: 'acc_' + bankId + '_' + Math.random().toString(36).substr(2, 9),
      bankId: bankId,
      type: 'expense',
      status: 'posted'
    }
  }

  // Categorize imported transactions using ML
  async categorizeTransactions(transactions) {
    try {
      // This would integrate with the existing ML service
      const categorizedTransactions = transactions.map(transaction => ({
        ...transaction,
        mlCategory: this.predictCategory(transaction.description),
        mlConfidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
        isMLPredicted: true
      }))
      
      return {
        success: true,
        transactions: categorizedTransactions
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Simple category prediction (in real implementation, this would use the ML service)
  predictCategory(description) {
    const description_lower = description.toLowerCase()
    
    if (description_lower.includes('grocery') || description_lower.includes('food') || description_lower.includes('market')) {
      return 'Groceries'
    } else if (description_lower.includes('restaurant') || description_lower.includes('cafe') || description_lower.includes('dining')) {
      return 'Dining'
    } else if (description_lower.includes('gas') || description_lower.includes('fuel') || description_lower.includes('uber') || description_lower.includes('lyft')) {
      return 'Transportation'
    } else if (description_lower.includes('entertainment') || description_lower.includes('movie') || description_lower.includes('netflix')) {
      return 'Entertainment'
    } else if (description_lower.includes('shopping') || description_lower.includes('store') || description_lower.includes('amazon')) {
      return 'Shopping'
    } else if (description_lower.includes('utility') || description_lower.includes('electric') || description_lower.includes('water')) {
      return 'Utilities'
    } else if (description_lower.includes('medical') || description_lower.includes('doctor') || description_lower.includes('pharmacy')) {
      return 'Healthcare'
    } else {
      return 'Other'
    }
  }

  // Sync all connected accounts for a user
  async syncAllAccounts(userId) {
    try {
      const connections = this.getUserConnections(userId)
      const syncResults = []
      
      for (const connection of connections) {
        const result = await this.importTransactions(
          connection.id,
          connection.lastSync,
          new Date().toISOString().split('T')[0]
        )
        
        if (result.success) {
          syncResults.push({
            connectionId: connection.id,
            bankName: connection.bankName,
            importedCount: result.importedCount,
            status: 'success'
          })
        } else {
          syncResults.push({
            connectionId: connection.id,
            bankName: connection.bankName,
            error: result.error,
            status: 'error'
          })
        }
      }
      
      return {
        success: true,
        results: syncResults
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }
}

export default new BankIntegration()
