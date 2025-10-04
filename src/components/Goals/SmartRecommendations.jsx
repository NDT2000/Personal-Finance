import React, { useState, useEffect } from 'react'
import { GoalsService } from '../../services/goalsService'
import predictiveAnalytics from '../../services/predictiveAnalytics'

const SmartRecommendations = ({ goal, userId }) => {
  const [recommendations, setRecommendations] = useState([])
  const [risks, setRisks] = useState([])
  const [probability, setProbability] = useState(0)
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState(null)
  const [spendingPatterns, setSpendingPatterns] = useState(null)

  useEffect(() => {
    loadRecommendations()
  }, [goal, userId])

  const loadRecommendations = async () => {
    try {
      setLoading(true)
      
      // Load user profile and spending data
      const [profileData, transactionsData] = await Promise.all([
        loadUserProfile(),
        loadUserTransactions()
      ])
      
      setUserProfile(profileData)
      setSpendingPatterns(profileData.spendingPatterns)
      
      // Calculate goal achievement probability
      const goalProbability = predictiveAnalytics.calculateGoalProbability(goal, profileData)
      setProbability(goalProbability)
      
      // Generate recommendations
      const smartRecommendations = predictiveAnalytics.generateRecommendations(
        goal, 
        profileData, 
        profileData.spendingPatterns
      )
      setRecommendations(smartRecommendations)
      
      // Assess risks
      const goalRisks = predictiveAnalytics.assessRisks(goal, profileData)
      setRisks(goalRisks)
      
    } catch (error) {
      console.error('Error loading recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUserProfile = async () => {
    // This would typically come from a user profile API
    // For now, we'll create a mock profile based on goal data
    return {
      monthlySavingsCapacity: goal.target_amount / 12, // Simplified calculation
      incomeTrend: 0.03, // 3% annual growth
      expenseTrend: 0.02, // 2% annual growth
      spendingPatterns: {
        'Dining': 500,
        'Entertainment': 300,
        'Shopping': 400,
        'Transportation': 200
      }
    }
  }

  const loadUserTransactions = async () => {
    try {
      // This would load actual transaction data
      // For now, return mock data
      return []
    } catch (error) {
      console.error('Error loading transactions:', error)
      return []
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getProbabilityColor = (prob) => {
    if (prob >= 0.8) return 'text-green-600'
    if (prob >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getProbabilityText = (prob) => {
    if (prob >= 0.8) return 'High'
    if (prob >= 0.6) return 'Medium'
    return 'Low'
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
      {/* Goal Achievement Probability */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Goal Achievement Probability</h3>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Success Probability</span>
              <span className={`text-lg font-bold ${getProbabilityColor(probability)}`}>
                {Math.round(probability * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full ${
                  probability >= 0.8 ? 'bg-green-500' : 
                  probability >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${probability * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {getProbabilityText(probability)} probability of achieving this goal
            </p>
          </div>
        </div>
      </div>

      {/* Smart Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Smart Recommendations</h3>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className={`p-4 rounded-xl border ${getPriorityColor(rec.priority)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(rec.priority)}`}>
                        {rec.priority} priority
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{rec.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Impact: {rec.impact}</span>
                      <span>Effort: {rec.effort}</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-sm font-medium text-gray-600">Action: </span>
                      <span className="text-sm text-gray-700">{rec.action}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risk Assessment */}
      {risks.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Risk Assessment</h3>
          <div className="space-y-4">
            {risks.map((risk, index) => (
              <div key={index} className={`p-4 rounded-xl border ${getSeverityColor(risk.severity)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-gray-900 capitalize">
                        {risk.type.replace('_', ' ')} Risk
                      </h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(risk.severity)}`}>
                        {risk.severity} severity
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{risk.description}</p>
                    <div className="mt-2">
                      <span className="text-sm font-medium text-gray-600">Mitigation: </span>
                      <span className="text-sm text-gray-700">{risk.mitigation}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No recommendations message */}
      {recommendations.length === 0 && risks.length === 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Great Progress!</h3>
            <p className="text-gray-600">
              Your goal is on track with no immediate risks or recommendations needed.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default SmartRecommendations
