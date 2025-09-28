import React, { useState, useEffect } from 'react'

const AccountManager = ({ userId, onAccountSelect, selectedAccountId }) => {
  const [accounts, setAccounts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newAccount, setNewAccount] = useState({
    accountType: 'checking',
    accountName: '',
    initialBalance: 0
  })
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    loadAccounts()
  }, [userId])

  const loadAccounts = async () => {
    try {
      const { ApiService } = await import('../services/apiService.js')
      const result = await ApiService.getUserAccounts(userId)
      
      if (result.success) {
        setAccounts(result.accounts)
        // Auto-select first account if none selected
        if (result.accounts.length > 0 && !selectedAccountId) {
          onAccountSelect(result.accounts[0].id)
        }
      }
    } catch (error) {
      console.error('Error loading accounts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateAccount = async (e) => {
    e.preventDefault()
    if (!newAccount.accountName.trim()) return

    setIsCreating(true)
    try {
      const { ApiService } = await import('../services/apiService.js')
      const result = await ApiService.createAccount(
        userId,
        newAccount.accountType,
        newAccount.accountName,
        parseFloat(newAccount.initialBalance) || 0
      )
      
      if (result.success) {
        setNewAccount({ accountType: 'checking', accountName: '', initialBalance: 0 })
        setShowCreateForm(false)
        await loadAccounts()
        // Select the newly created account
        onAccountSelect(result.accountId)
      }
    } catch (error) {
      console.error('Error creating account:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const getAccountTypeIcon = (type) => {
    switch (type) {
      case 'checking':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-6 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        )
      case 'savings':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        )
      case 'credit':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-6 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        )
      case 'investment':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        )
      case 'cash':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-6 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        )
    }
  }

  const getAccountTypeColor = (type) => {
    switch (type) {
      case 'checking': return 'bg-blue-500'
      case 'savings': return 'bg-green-500'
      case 'credit': return 'bg-red-500'
      case 'investment': return 'bg-purple-500'
      case 'cash': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-lg mr-3">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-6 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Accounts</h2>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add Account</span>
        </button>
      </div>

      {/* Create Account Form */}
      {showCreateForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Account</h3>
          <form onSubmit={handleCreateAccount} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type
                </label>
                <select
                  value={newAccount.accountType}
                  onChange={(e) => setNewAccount({...newAccount, accountType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="checking">Checking</option>
                  <option value="savings">Savings</option>
                  <option value="credit">Credit Card</option>
                  <option value="investment">Investment</option>
                  <option value="cash">Cash</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Name
                </label>
                <input
                  type="text"
                  value={newAccount.accountName}
                  onChange={(e) => setNewAccount({...newAccount, accountName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., Main Checking"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Initial Balance
              </label>
              <input
                type="number"
                step="0.01"
                value={newAccount.initialBalance}
                onChange={(e) => setNewAccount({...newAccount, initialBalance: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0.00"
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isCreating}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 transition-all duration-200"
              >
                {isCreating ? 'Creating...' : 'Create Account'}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Accounts List */}
      <div className="space-y-3">
        {accounts.length === 0 ? (
          <div className="text-center py-8">
            <div className="p-4 bg-gray-50 rounded-xl mb-4">
              <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-6 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No accounts yet</p>
            <p className="text-gray-400 text-sm">Create your first account to get started</p>
          </div>
        ) : (
          accounts.map((account) => (
            <div
              key={account.id}
              onClick={() => onAccountSelect(account.id)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                selectedAccountId === account.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getAccountTypeColor(account.account_type)}`}>
                    <div className="text-white">
                      {getAccountTypeIcon(account.account_type)}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{account.account_name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{account.account_type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    ${parseFloat(account.balance).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">Balance</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default AccountManager
