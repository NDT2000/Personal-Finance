import React, { useState, useEffect } from 'react'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import predictiveAnalytics from '../../services/predictiveAnalytics'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const PredictiveInsights = ({ goal, userId }) => {
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState('12') // months

  useEffect(() => {
    loadPredictiveInsights()
  }, [goal, userId, timeframe])

  const loadPredictiveInsights = async () => {
    try {
      setLoading(true)
      
      // Load user data
      const userData = await loadUserData()
      
      // Generate predictive insights
      const predictiveData = {
        savingsCapacity: predictiveAnalytics.predictSavingsCapacity(
          userData.incomeHistory,
          userData.expenseHistory,
          parseInt(timeframe)
        ),
        spendingPatterns: predictiveAnalytics.analyzeSpendingPatterns(
          userData.transactions,
          6
        ),
        goalProjection: generateGoalProjection(goal, userData, parseInt(timeframe))
      }
      
      setInsights(predictiveData)
      
    } catch (error) {
      console.error('Error loading predictive insights:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUserData = async () => {
    // Mock data - in real implementation, this would come from APIs
    return {
      incomeHistory: [5000, 5200, 5100, 5300, 5400, 5500],
      expenseHistory: [3500, 3600, 3550, 3650, 3700, 3750],
      transactions: [
        { amount: -500, category: 'Dining', transaction_date: '2024-01-15' },
        { amount: -300, category: 'Entertainment', transaction_date: '2024-01-20' },
        { amount: -200, category: 'Transportation', transaction_date: '2024-01-25' }
      ]
    }
  }

  const generateGoalProjection = (goal, userData, months) => {
    const currentAmount = goal.current_amount
    const targetAmount = goal.target_amount
    const monthlyCapacity = userData.savingsCapacity?.currentCapacity || 1000
    
    const projection = []
    let current = currentAmount
    
    for (let i = 0; i < months; i++) {
      current += monthlyCapacity
      projection.push({
        month: `Month ${i + 1}`,
        amount: Math.min(current, targetAmount),
        target: targetAmount,
        achieved: current >= targetAmount
      })
    }
    
    return projection
  }

  const getSavingsCapacityChartData = () => {
    if (!insights?.savingsCapacity) return null

    const data = {
      labels: ['Current', 'Projected'],
      datasets: [
        {
          label: 'Monthly Savings Capacity',
          data: [
            insights.savingsCapacity.currentCapacity,
            insights.savingsCapacity.projectedCapacity
          ],
          backgroundColor: ['#3B82F6', '#10B981'],
          borderColor: ['#2563EB', '#059669'],
          borderWidth: 2
        }
      ]
    }

    const options = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Savings Capacity Analysis'
        },
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '$' + value.toLocaleString()
            }
          }
        }
      }
    }

    return { data, options }
  }

  const getGoalProjectionChartData = () => {
    if (!insights?.goalProjection) return null

    const projection = insights.goalProjection
    const data = {
      labels: projection.map(p => p.month),
      datasets: [
        {
          label: 'Projected Progress',
          data: projection.map(p => p.amount),
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4
        },
        {
          label: 'Target Amount',
          data: projection.map(p => p.target),
          borderColor: '#EF4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderDash: [5, 5],
          fill: false
        }
      ]
    }

    const options = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Goal Achievement Projection'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '$' + value.toLocaleString()
            }
          }
        }
      }
    }

    return { data, options }
  }

  const getSpendingPatternsChartData = () => {
    if (!insights?.spendingPatterns?.categoryPatterns) return null

    const patterns = insights.spendingPatterns.categoryPatterns
    const categories = Object.keys(patterns)
    const amounts = Object.values(patterns)

    const data = {
      labels: categories,
      datasets: [
        {
          label: 'Monthly Spending',
          data: amounts,
          backgroundColor: [
            '#EF4444', '#F97316', '#EAB308', '#22C55E', 
            '#06B6D4', '#8B5CF6', '#EC4899'
          ],
          borderWidth: 0
        }
      ]
    }

    const options = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Spending Patterns by Category'
        },
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '$' + value.toLocaleString()
            }
          }
        }
      }
    }

    return { data, options }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with timeframe selector */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Predictive Insights</h3>
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="6">6 months</option>
            <option value="12">12 months</option>
            <option value="24">24 months</option>
          </select>
        </div>
        
        {/* Key Metrics */}
        {insights?.savingsCapacity && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm font-medium text-blue-600">Current Capacity</div>
              <div className="text-2xl font-bold text-blue-900">
                ${insights.savingsCapacity.currentCapacity.toLocaleString()}
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm font-medium text-green-600">Projected Capacity</div>
              <div className="text-2xl font-bold text-green-900">
                ${insights.savingsCapacity.projectedCapacity.toLocaleString()}
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-sm font-medium text-purple-600">Confidence</div>
              <div className="text-2xl font-bold text-purple-900">
                {Math.round(insights.savingsCapacity.confidence * 100)}%
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Savings Capacity Chart */}
      {getSavingsCapacityChartData() && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Savings Capacity Analysis</h4>
          <div className="h-64">
            <Bar {...getSavingsCapacityChartData()} />
          </div>
        </div>
      )}

      {/* Goal Projection Chart */}
      {getGoalProjectionChartData() && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Goal Achievement Projection</h4>
          <div className="h-64">
            <Line {...getGoalProjectionChartData()} />
          </div>
        </div>
      )}

      {/* Spending Patterns Chart */}
      {getSpendingPatternsChartData() && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Spending Patterns</h4>
          <div className="h-64">
            <Bar {...getSpendingPatternsChartData()} />
          </div>
        </div>
      )}

      {/* Insights Summary */}
      {insights && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h4>
          <div className="space-y-3">
            {insights.savingsCapacity && (
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">
                  Your savings capacity is projected to {insights.savingsCapacity.projectedCapacity > insights.savingsCapacity.currentCapacity ? 'increase' : 'decrease'} by ${Math.abs(insights.savingsCapacity.projectedCapacity - insights.savingsCapacity.currentCapacity).toLocaleString()} per month
                </span>
              </div>
            )}
            
            {insights.spendingPatterns && (
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">
                  Spending trend is {insights.spendingPatterns.seasonalTrends.direction} with {Math.round(insights.spendingPatterns.seasonalTrends.strength * 100)}% consistency
                </span>
              </div>
            )}
            
            {insights.goalProjection && (
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-700">
                  Based on current patterns, you're on track to reach your goal in {insights.goalProjection.find(p => p.achieved)?.month || 'more than ' + timeframe + ' months'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default PredictiveInsights
