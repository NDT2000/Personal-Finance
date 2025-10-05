// Demo data for localStorage fallback when backend is not available
export const setupDemoData = () => {
  // Check if demo data already exists
  if (localStorage.getItem('finance_demo_setup')) {
    return
  }
  
  // Create demo user
  const demoUser = {
    id: 'demo-user-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'demo@example.com',
    password: 'demo123' // In real app, this would be hashed
  }
  
  // Create demo accounts
  const demoAccounts = [
    {
      id: 'account-1',
      userId: 'demo-user-1',
      accountType: 'checking',
      accountName: 'Main Checking',
      balance: 2500.00,
      createdAt: new Date().toISOString()
    },
    {
      id: 'account-2',
      userId: 'demo-user-1',
      accountType: 'savings',
      accountName: 'Emergency Fund',
      balance: 5000.00,
      createdAt: new Date().toISOString()
    }
  ]
  
  // Create demo transactions
  const demoTransactions = [
    {
      id: 'trans-1',
      accountId: 'account-1',
      amount: -50.00,
      category: 'groceries',
      transactionType: 'expense',
      description: 'Grocery shopping at Whole Foods',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'trans-2',
      accountId: 'account-1',
      amount: 3000.00,
      category: 'salary',
      transactionType: 'income',
      description: 'Monthly salary',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'trans-3',
      accountId: 'account-1',
      amount: -200.00,
      category: 'utilities',
      transactionType: 'expense',
      description: 'Electric bill',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]
  
  // Store demo data in localStorage
  localStorage.setItem('finance_users', JSON.stringify([demoUser]))
  localStorage.setItem('finance_accounts_demo-user-1', JSON.stringify(demoAccounts))
  localStorage.setItem('finance_transactions_account-1', JSON.stringify(demoTransactions))
  localStorage.setItem('finance_demo_setup', 'true')
  
  console.log('Demo data setup complete. Use email: demo@example.com, password: demo123')
}

// Initialize demo data when the module is imported
setupDemoData()
