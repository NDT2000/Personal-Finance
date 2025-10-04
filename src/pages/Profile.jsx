import React, { useState, useEffect } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import AccountManager from '../components/AccountManager'
import GoalsDashboard from '../components/Goals/GoalsDashboard'
import SmartTransactionForm from '../components/SmartTransactionForm'
import EnhancedTransactionList from '../components/EnhancedTransactionList'
import ManualReviewDashboard from '../components/ManualReviewDashboard'
import ErrorBoundary from '../components/ErrorBoundary'
import { TransactionListSkeleton, LoadingSpinner } from '../components/LoadingStates'

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
      if (userData.id) {
        loadUserData(userData.id)
      } else {
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
      const result = await ApiService.getUserByEmail(email)
      if (result.success && result.user) {
        await loadUserData(result.user.id)
      }
    } catch (error) {
      console.error('Error loading user data by email:', error)
    }
  }

  const handleAccountSelect = (accountId) => {
    setSelectedAccountId(accountId)
  }

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    navigate('/login')
  }

  const handleInputChange = (e) => {
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
    
    if (formData.newPassword && formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters'
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
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
    
    try {
      const { ApiService } = await import('../services/apiService.js')
      
      // Update user profile
      const result = await ApiService.updateUser(user.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.newPassword || undefined
      })
      
      if (result.success) {
        // Update localStorage with new user data
        const updatedUser = {
          ...user,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email
        }
        localStorage.setItem('currentUser', JSON.stringify(updatedUser))
        setUser(updatedUser)
        setMessage('Profile updated successfully!')
        setIsEditing(false)
        
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }))
      } else {
        setMessage('Error updating profile: ' + result.error)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage('Error updating profile')
    } finally {
      setIsLoading(false)
    }
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Personal Finance
              </h1>
              <p className="text-gray-600 text-lg">Manage your profile and transactions</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/dashboard"
                className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 text-gray-700 hover:text-gray-900"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
                <span>Dashboard</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'profile'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'transactions'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Transactions
            </button>
            <button
              onClick={() => setActiveTab('goals')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'goals'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Goals
            </button>
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="p-3 bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-xl mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
                    <p className="text-gray-600">Manage your account information</p>
                  </div>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {message && (
                <div className={`mb-6 p-4 rounded-lg ${
                  message.includes('success') 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {message}
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
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                        errors.firstName ? 'border-red-300' : 'border-gray-300'
                      } ${!isEditing ? 'bg-gray-50' : ''}`}
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
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                        errors.lastName ? 'border-red-300' : 'border-gray-300'
                      } ${!isEditing ? 'bg-gray-50' : ''}`}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    } ${!isEditing ? 'bg-gray-50' : ''}`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {isEditing && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter current password to make changes"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                            errors.newPassword ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Leave blank to keep current"
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
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${
                            errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Confirm new password"
                        />
                        {errors.confirmPassword && (
                          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                        )}
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
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 bg-gray-500 text-white rounded-xl font-medium hover:bg-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        {/* Transactions Tab with ML Features */}
        {activeTab === 'transactions' && (
          <div className="space-y-8">
            {/* Account Manager */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <AccountManager 
                userId={user.id} 
                onAccountSelect={handleAccountSelect}
                selectedAccountId={selectedAccountId}
              />
            </div>

            {/* Smart Transaction Forms */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SmartTransactionForm
                selectedAccountId={selectedAccountId}
                onTransactionAdded={loadUserData}
                transactionType="expense"
              />
              <SmartTransactionForm
                selectedAccountId={selectedAccountId}
                onTransactionAdded={loadUserData}
                transactionType="income"
              />
            </div>

            {/* Enhanced Transaction List */}
            <EnhancedTransactionList
              transactions={transactions}
              onTransactionUpdate={loadUserData}
              showMLPredictions={true}
            />

            {/* Manual Review Dashboard */}
            <ManualReviewDashboard
              onReviewComplete={loadUserData}
            />
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <GoalsDashboard userId={user.id} />
        )}
      </div>
    </div>
  )
}

export default Profile
