import React, { useState, useEffect } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import AccountManager from '../components/AccountManager'
import GoalsDashboard from '../components/Goals/GoalsDashboard'

const Profile = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [user, setUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  
  // Transaction management state
  const [accounts, setAccounts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [selectedAccountId, setSelectedAccountId] = useState(null)
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: ''
  })
  const [activeTab, setActiveTab] = useState('profile') // 'profile', 'transactions', or 'goals'

  useEffect(() => {
    // Get user data from localStorage
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      const userData = JSON.parse(currentUser)
      setUser(userData)
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      
      // Load user's accounts and transactions
      // Check if user has an id field, if not, we need to get it from the database
      if (userData.id) {
        loadUserData(userData.id)
      } else {
        // Try to get user ID from email
        loadUserDataByEmail(userData.email)
      }
    } else {
      navigate('/login')
    }

    // Check for tab parameter in URL
    const tab = searchParams.get('tab')
    if (tab === 'transactions') {
      setActiveTab('transactions')
    } else if (tab === 'goals') {
      setActiveTab('goals')
    }
  }, [navigate, searchParams])

  const loadUserData = async (userId) => {
    try {
      const { ApiService } = await import('../services/apiService.js')
      const result = await ApiService.getDashboardData(userId)
      if (result.success) {
        setAccounts(result.accounts)
        setTransactions(result.transactions)
        if (result.accounts.length > 0 && !selectedAccountId) {
          setSelectedAccountId(result.accounts[0].id)
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }

  const loadUserDataByEmail = async (email) => {
    try {
      const { ApiService } = await import('../services/apiService.js')
      const response = await fetch(`http://localhost:3001/api/user-by-email/${encodeURIComponent(email)}`)
      const userResult = await response.json()
      
      if (userResult.success && userResult.user) {
        // Update localStorage with the correct user data including ID
        const updatedUser = { ...user, id: userResult.user.id }
        localStorage.setItem('currentUser', JSON.stringify(updatedUser))
        setUser(updatedUser)
        loadUserData(userResult.user.id)
      }
    } catch (error) {
      console.error('Error loading user data by email:', error)
    }
  }

  const handleAccountSelect = (accountId) => {
    setSelectedAccountId(accountId)
  }

  const addTransaction = async (e) => {
    e.preventDefault()
    if (!newTransaction.description || !newTransaction.amount || !selectedAccountId) return

    try {
      const { ApiService } = await import('../services/apiService.js')
      const result = await ApiService.createTransaction(
        selectedAccountId,
        parseFloat(newTransaction.amount),
        newTransaction.category || 'other',
        newTransaction.type,
        newTransaction.description,
        new Date().toISOString().split('T')[0]
      )

      if (result.success) {
        // Reload user data
        await loadUserData(user.id)
        setNewTransaction({ description: '', amount: '', type: 'expense', category: '' })
        setMessage('Transaction added successfully!')
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (error) {
      console.error('Error adding transaction:', error)
    }
  }

  const deleteTransaction = async (id) => {
    try {
      const { ApiService } = await import('../services/apiService.js')
      const result = await ApiService.deleteTransaction(id)

      if (result.success) {
        // Reload user data
        await loadUserData(user.id)
        setMessage('Transaction deleted successfully!')
        setTimeout(() => setMessage(''), 3000)
      }
    } catch (error) {
      console.error('Error deleting transaction:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    // Password validation only if any password field is filled
    if (formData.currentPassword || formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required'
      }

      if (!formData.newPassword) {
        newErrors.newPassword = 'New password is required'
      } else if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'Password must be at least 6 characters'
      }

      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setMessage('')
    setErrors({})

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update local storage
      const updatedUser = {
        ...user,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email
      }
      
      localStorage.setItem('currentUser', JSON.stringify(updatedUser))
      setUser(updatedUser)
      
      // Reset form
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))
      
      setIsEditing(false)
      setMessage('Profile updated successfully!')
      
    } catch (error) {
      setErrors({ general: 'Failed to update profile. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    navigate('/login')
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Profile Settings
              </h1>
              <p className="text-gray-600 text-lg">Manage your account and transactions</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 text-gray-700 hover:text-gray-900"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Dashboard</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'profile'
                ? 'bg-white text-indigo-600 shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'transactions'
                ? 'bg-white text-indigo-600 shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Manage Transactions
          </button>
          <button
            onClick={() => setActiveTab('goals')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'goals'
                ? 'bg-white text-indigo-600 shadow-md'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Financial Goals
          </button>
        </div>

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-6">
            {message}
          </div>
        )}


        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">
                      {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-gray-500 mb-4">{user.email}</p>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-2 px-4 rounded-xl font-medium hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200"
                  >
                    {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                </div>

                {errors.general && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                    {errors.general}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                          !isEditing ? 'bg-gray-50' : ''
                        } ${errors.firstName ? 'border-red-500' : ''}`}
                      />
                      {errors.firstName && (
                        <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                          !isEditing ? 'bg-gray-50' : ''
                        } ${errors.lastName ? 'border-red-500' : ''}`}
                      />
                      {errors.lastName && (
                        <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                        !isEditing ? 'bg-gray-50' : ''
                      } ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  {isEditing && (
                    <>
                      <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Current Password
                            </label>
                            <input
                              type="password"
                              name="currentPassword"
                              value={formData.currentPassword}
                              onChange={handleChange}
                              className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                                errors.currentPassword ? 'border-red-500' : ''
                              }`}
                            />
                            {errors.currentPassword && (
                              <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              New Password
                            </label>
                            <input
                              type="password"
                              name="newPassword"
                              value={formData.newPassword}
                              onChange={handleChange}
                              className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                                errors.newPassword ? 'border-red-500' : ''
                              }`}
                            />
                            {errors.newPassword && (
                              <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                                errors.confirmPassword ? 'border-red-500' : ''
                              }`}
                            />
                            {errors.confirmPassword && (
                              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {isEditing && (
                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-3 px-4 rounded-xl font-medium hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50"
                      >
                        {isLoading ? 'Updating...' : 'Update Profile'}
                      </button>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="px-6 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Account Manager */}
            <div className="lg:col-span-1">
              <AccountManager 
                userId={user.id} 
                onAccountSelect={handleAccountSelect}
                selectedAccountId={selectedAccountId}
              />
            </div>

            {/* Transaction Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-lg mr-3">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Add Transaction</h2>
                  </div>
                  {selectedAccountId && (
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Selected Account</p>
                      <p className="font-semibold text-gray-900">
                        {accounts.find(acc => acc.id === selectedAccountId)?.account_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        ${parseFloat(accounts.find(acc => acc.id === selectedAccountId)?.balance || 0).toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
                
                <form onSubmit={addTransaction} className="space-y-6">
                  {/* Transaction Type Toggle */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Transaction Type
                    </label>
                    <div className="flex bg-gray-100 rounded-xl p-1">
                      <button
                        type="button"
                        onClick={() => setNewTransaction({...newTransaction, type: 'income', category: ''})}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                          newTransaction.type === 'income'
                            ? 'bg-green-500 text-white shadow-md'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                          <span>Income</span>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewTransaction({...newTransaction, type: 'expense', category: ''})}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                          newTransaction.type === 'expense'
                            ? 'bg-red-500 text-white shadow-md'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                          </svg>
                          <span>Expense</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      value={newTransaction.description}
                      onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder={newTransaction.type === 'income' ? 'e.g., Salary, Freelance, Bonus' : 'e.g., Rent, Groceries, Gas'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        value={newTransaction.amount}
                        onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Category Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={newTransaction.category}
                      onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select a category</option>
                      {newTransaction.type === 'income' ? (
                        <>
                          <option value="salary">Salary</option>
                          <option value="freelance">Freelance</option>
                          <option value="bonus">Bonus</option>
                          <option value="investment">Investment</option>
                          <option value="business">Business</option>
                          <option value="other">Other</option>
                        </>
                      ) : (
                        <>
                          <option value="housing">Housing</option>
                          <option value="food">Food & Dining</option>
                          <option value="transportation">Transportation</option>
                          <option value="utilities">Utilities</option>
                          <option value="healthcare">Healthcare</option>
                          <option value="entertainment">Entertainment</option>
                          <option value="shopping">Shopping</option>
                          <option value="other">Other</option>
                        </>
                      )}
                    </select>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={!selectedAccountId}
                    className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                      !selectedAccountId
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : newTransaction.type === 'income'
                        ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                        : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      {newTransaction.type === 'income' ? (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                          <span>Add Income</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                          </svg>
                          <span>Add Expense</span>
                        </>
                      )}
                    </div>
                  </button>
                </form>
              </div>

              {/* Transaction List */}
              <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-gradient-to-r from-purple-400 to-purple-500 rounded-lg mr-3">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V5M10 9l2 2 4-4" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
                </div>
                <div className="space-y-4">
                  {transactions.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="p-4 bg-gray-50 rounded-xl mb-4">
                        <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-lg">No transactions yet</p>
                      <p className="text-gray-400 text-sm">Add your first transaction above</p>
                    </div>
                  ) : (
                    transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-all duration-200">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-xl ${
                            transaction.transaction_type === 'income' 
                              ? 'bg-gradient-to-r from-green-400 to-green-500' 
                              : 'bg-gradient-to-r from-red-400 to-red-500'
                          }`}>
                            {transaction.transaction_type === 'income' ? (
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{transaction.description}</p>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <span>{transaction.transaction_date}</span>
                              <span>•</span>
                              <span>{transaction.account_name}</span>
                              <span>•</span>
                              <span className="capitalize">{transaction.category}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`text-lg font-bold ${
                            transaction.transaction_type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.transaction_type === 'income' ? '+' : '-'}${Math.abs(parseFloat(transaction.amount)).toFixed(2)}
                          </span>
                          <button
                            onClick={() => deleteTransaction(transaction.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="space-y-8">
            <GoalsDashboard userId={user.id} />
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile