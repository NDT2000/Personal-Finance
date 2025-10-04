import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import IncomeExpenseChart from '../components/Charts/IncomeExpenseChart'
import SpendingCategoriesChart from '../components/Charts/SpendingCategoriesChart'
import MonthlyTrendsChart from '../components/Charts/MonthlyTrendsChart'
import FinancialSummary from '../components/Charts/FinancialSummary'
import IncomeInsights from '../components/Charts/IncomeInsights'
import MLInsights from '../components/MLInsights'
import SimpleMLTest from '../components/SimpleMLTest'
import GoalsDashboard from '../components/Goals/GoalsDashboard'
import PerformanceDashboard from '../components/PerformanceDashboard'
import RegressionInsights from '../components/RegressionInsights'

const Dashboard = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [accounts, setAccounts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [selectedAccountId, setSelectedAccountId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user data and dashboard data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUser = localStorage.getItem('currentUser')
        if (!currentUser) {
          navigate('/login')
          return
        }

        const userData = JSON.parse(currentUser)
        setUser(userData)

        // Load dashboard data from database
        const { ApiService } = await import('../services/apiService.js')
        const result = await ApiService.getDashboardData(userData.id)
        
        if (result.success) {
          setAccounts(result.accounts)
          setTransactions(result.transactions)
          
          // Select first account if available
          if (result.accounts.length > 0) {
            setSelectedAccountId(result.accounts[0].id)
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()
  }, [navigate])


  const totalIncome = transactions
    .filter(t => t.transaction_type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0)

  const totalExpenses = transactions
    .filter(t => t.transaction_type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0)

  const balance = totalIncome - totalExpenses

  // Get selected account

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in</h2>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all duration-200"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Modern Header */}
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                Personal Finance
              </h1>
              <p className="text-gray-600 text-lg">Track your income and expenses</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/profile"
                className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 text-gray-700 hover:text-gray-900"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Profile</span>
              </Link>
              <button
                onClick={() => navigate('/login')}
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

        {/* Modern Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-green-400 to-green-500 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-500">Total Balance</span>
            </div>
            <p className={`text-3xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${balance.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {balance >= 0 ? 'Positive balance' : 'Negative balance'}
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-500">Total Income</span>
            </div>
            <p className="text-3xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-1">This month</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-red-400 to-red-500 rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-500">Total Expenses</span>
            </div>
            <p className="text-3xl font-bold text-red-600">${totalExpenses.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-1">This month</p>
          </div>
        </div>

        {/* Quick Access to Profile for Transactions */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-gradient-to-r from-green-400 to-green-500 rounded-lg mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Manage Transactions</h2>
                  <p className="text-gray-600">Add income and expenses, view transaction history</p>
                </div>
              </div>
              <Link
                to="/profile?tab=transactions"
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span>Add Income & Expenses</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Financial Goals Section */}
        <div className="mb-8">
          <GoalsDashboard userId={user.id} />
        </div>

              {/* AI Insights Section */}
              <div className="mb-8">
                <MLInsights />
              </div>

              {/* Regression Insights Section */}
              <div className="mb-8">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-gradient-to-r from-green-400 to-green-500 rounded-lg mr-3">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Predictive Analytics</h2>
                </div>
                <RegressionInsights userId={user.id} />
              </div>


              {/* AI Testing Section */}
              <div className="mb-8">
                <SimpleMLTest />
              </div>

        {/* Performance Dashboard */}
        <div className="mb-8">
          <PerformanceDashboard />
        </div>

        {/* Charts Section */}
        <div className="mt-8">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-gradient-to-r from-purple-400 to-purple-500 rounded-lg mr-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Financial Analytics</h2>
          </div>

          {/* Financial Summary */}
          <div className="mb-8">
            <FinancialSummary transactions={transactions} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <IncomeExpenseChart transactions={transactions} />
            <SpendingCategoriesChart transactions={transactions} />
          </div>

          {/* Income Insights */}
          <div className="mb-8">
            <IncomeInsights transactions={transactions} />
          </div>

          <div className="grid grid-cols-1 gap-8">
            <MonthlyTrendsChart transactions={transactions} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard