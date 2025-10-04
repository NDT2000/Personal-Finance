import React, { useState, useEffect } from 'react'
import { ApiService } from '../services/apiService'
import { LoadingSpinner } from './LoadingStates'

const RegressionInsights = ({ userId }) => {
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadRegressionInsights()
  }, [userId])

  const loadRegressionInsights = async () => {
    try {
      setLoading(true)
      setError(null)

      // Get user data for regression analysis
      const userData = await loadUserData()
      
      if (!userData) {
        throw new Error('Unable to load user data')
      }

      // Get comprehensive financial insights
      const result = await ApiService.getComprehensiveFinancialInsights(
        userData.transactions,
        userData.incomeHistory,
        userData.expenseHistory,
        userData.goals,
        userData.userProfile,
        userData.marketConditions
      )

      if (result.success) {
        setInsights(result.insights)
      } else {
        throw new Error(result.error || 'Failed to load regression insights')
      }
    } catch (error) {
      console.error('Error loading regression insights:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const loadUserData = async () => {
    try {
      // Load transactions
      const transactionsResult = await ApiService.getTransactions(userId)
      const transactions = transactionsResult.success ? transactionsResult.transactions : []

      // Load goals
      const goalsResult = await ApiService.getGoals(userId)
      const goals = goalsResult.success ? goalsResult.goals : []

      // Process data for regression analysis
      const incomeHistory = processIncomeHistory(transactions)
      const expenseHistory = processExpenseHistory(transactions)
      
      const userProfile = {
        monthlySavingsCapacity: calculateMonthlySavingsCapacity(incomeHistory, expenseHistory),
        incomeGrowthRate: calculateIncomeGrowthRate(incomeHistory),
        expenseReductionRate: 0, // Could be calculated from user preferences
        riskTolerance: 'medium' // Could be from user settings
      }

      const marketConditions = {
        volatility: 0.15, // Could be fetched from external API
        bullish: true, // Could be calculated from market data
        interestRate: 0.05 // Could be fetched from external API
      }

      return {
        transactions,
        incomeHistory,
        expenseHistory,
        goals,
        userProfile,
        marketConditions
      }
    } catch (error) {
      console.error('Error loading user data:', error)
      return null
    }
  }

  const processIncomeHistory = (transactions) => {
    const monthlyIncome = {}
    
    transactions
      .filter(t => t.transaction_type === 'income')
      .forEach(t => {
        const date = new Date(t.transaction_date)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        monthlyIncome[monthKey] = (monthlyIncome[monthKey] || 0) + t.amount
      })

    return Object.values(monthlyIncome).sort((a, b) => a - b)
  }

  const processExpenseHistory = (transactions) => {
    const monthlyExpenses = {}
    
    transactions
      .filter(t => t.transaction_type === 'expense')
      .forEach(t => {
        const date = new Date(t.transaction_date)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        monthlyExpenses[monthKey] = (monthlyExpenses[monthKey] || 0) + Math.abs(t.amount)
      })

    return Object.values(monthlyExpenses).sort((a, b) => a - b)
  }

  const calculateMonthlySavingsCapacity = (incomeHistory, expenseHistory) => {
    if (incomeHistory.length === 0 || expenseHistory.length === 0) return 0
    
    const avgIncome = incomeHistory.reduce((sum, val) => sum + val, 0) / incomeHistory.length
    const avgExpenses = expenseHistory.reduce((sum, val) => sum + val, 0) / expenseHistory.length
    
    return Math.max(0, avgIncome - avgExpenses)
  }

  const calculateIncomeGrowthRate = (incomeHistory) => {
    if (incomeHistory.length < 2) return 0
    
    const firstIncome = incomeHistory[0]
    const lastIncome = incomeHistory[incomeHistory.length - 1]
    
    return (lastIncome - firstIncome) / firstIncome
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <div className="text-red-500 text-lg font-semibold mb-2">Error Loading Insights</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadRegressionInsights}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!insights) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-gray-500">
          No regression insights available
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Spending Trend */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📈 Spending Trend Analysis</h3>
        {insights.spendingTrend && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Current Average</div>
                <div className="text-xl font-semibold text-blue-600">
                  ${insights.spendingTrend.currentAverage?.toFixed(2) || '0.00'}
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Trend Type</div>
                <div className="text-lg font-semibold text-green-600 capitalize">
                  {insights.spendingTrend.trend || 'Unknown'}
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Confidence</div>
                <div className="text-lg font-semibold text-purple-600">
                  {Math.round((insights.spendingTrend.confidence || 0) * 100)}%
                </div>
              </div>
            </div>
            
            {insights.spendingTrend.predictions && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Next 3 Months Predictions</h4>
                <div className="space-y-2">
                  {insights.spendingTrend.predictions.map((pred, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                      <span className="text-gray-600">Month {pred.month}</span>
                      <span className="font-semibold">
                        ${pred.predictedAmount?.toFixed(2) || '0.00'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Income Growth */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">💰 Income Growth Projection</h3>
        {insights.incomeGrowth && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Growth Rate</div>
                <div className="text-xl font-semibold text-green-600">
                  {insights.incomeGrowth.growthRate?.toFixed(2) || '0.00'}%
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Current Income</div>
                <div className="text-xl font-semibold text-blue-600">
                  ${insights.incomeGrowth.currentIncome?.toFixed(2) || '0.00'}
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Trend</div>
                <div className="text-lg font-semibold text-purple-600 capitalize">
                  {insights.incomeGrowth.trend || 'Unknown'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Savings Capacity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">💎 Savings Capacity Analysis</h3>
        {insights.savingsCapacity && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Current Capacity</div>
                <div className="text-xl font-semibold text-green-600">
                  ${insights.savingsCapacity.currentCapacity?.toFixed(2) || '0.00'}
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600">Projected Capacity</div>
                <div className="text-xl font-semibold text-blue-600">
                  ${insights.savingsCapacity.projectedCapacity?.toFixed(2) || '0.00'}
                </div>
              </div>
            </div>
            
            {insights.savingsCapacity.projections && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Monthly Projections</h4>
                <div className="space-y-2">
                  {insights.savingsCapacity.projections.slice(0, 6).map((proj, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                      <span className="text-gray-600">Month {proj.month}</span>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          Income: ${proj.projectedIncome?.toFixed(2) || '0.00'}
                        </div>
                        <div className="text-sm text-gray-500">
                          Expenses: ${proj.projectedExpenses?.toFixed(2) || '0.00'}
                        </div>
                        <div className="font-semibold text-green-600">
                          Savings: ${proj.projectedSavings?.toFixed(2) || '0.00'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Risk Assessment */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">⚠️ Financial Risk Assessment</h3>
        {insights.riskAssessment && (
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">Overall Risk Score</div>
              <div className="text-2xl font-semibold text-red-600">
                {Math.round((insights.riskAssessment.overallRisk || 0) * 100)}%
              </div>
            </div>
            
            {insights.riskAssessment.risks && insights.riskAssessment.risks.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Identified Risks</h4>
                <div className="space-y-2">
                  {insights.riskAssessment.risks.map((risk, index) => (
                    <div key={index} className={`p-3 rounded ${
                      risk.severity === 'high' ? 'bg-red-50 border-l-4 border-red-400' :
                      risk.severity === 'medium' ? 'bg-yellow-50 border-l-4 border-yellow-400' :
                      'bg-blue-50 border-l-4 border-blue-400'
                    }`}>
                      <div className="font-medium text-gray-800 capitalize">
                        {risk.type.replace('_', ' ')} ({risk.severity})
                      </div>
                      <div className="text-sm text-gray-600 mt-1">{risk.description}</div>
                      <div className="text-sm text-blue-600 mt-1">{risk.mitigation}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Goal Predictions */}
      {insights.goalPredictions && insights.goalPredictions.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🎯 Goal Achievement Predictions</h3>
          <div className="space-y-4">
            {insights.goalPredictions.map((goalPred, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="font-medium text-gray-800 mb-2">{goalPred.goalName}</div>
                {goalPred.prediction && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-3 rounded">
                      <div className="text-sm text-gray-600">Timeline</div>
                      <div className="font-semibold text-blue-600">
                        {goalPred.prediction.timeline} months
                      </div>
                    </div>
                    <div className="bg-green-50 p-3 rounded">
                      <div className="text-sm text-gray-600">Monthly Required</div>
                      <div className="font-semibold text-green-600">
                        ${goalPred.prediction.monthlyRequired?.toFixed(2) || '0.00'}
                      </div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded">
                      <div className="text-sm text-gray-600">Probability</div>
                      <div className="font-semibold text-purple-600">
                        {Math.round((goalPred.prediction.probability || 0) * 100)}%
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="text-center">
        <button
          onClick={loadRegressionInsights}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Refresh Insights
        </button>
      </div>
    </div>
  )
}

export default RegressionInsights
